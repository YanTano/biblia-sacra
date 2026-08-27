(function () {
  "use strict";

  var RAW_PATH = "bible/raw/";
  var BOOKMARK_KEY = "bibliaSacraBookmarks";

  var bookCache = new Map(); // slug -> parsed JSON

  var state = {
    book: "genesis",
    chapter: 1,
    verse: null
  };

  /* ---------------- DOM refs ---------------- */
  var testamentSelect = document.getElementById("testamentSelect");
  var bookSelect = document.getElementById("bookSelect");
  var chapterSelect = document.getElementById("chapterSelect");
  var readingCard = document.getElementById("readingCard");
  var chapterNav = document.getElementById("chapterNav");
  var prevChapterBtn = document.getElementById("prevChapterBtn");
  var nextChapterBtn = document.getElementById("nextChapterBtn");
  var prevChapterLabel = document.getElementById("prevChapterLabel");
  var nextChapterLabel = document.getElementById("nextChapterLabel");
  var viewChapterListBtn = document.getElementById("viewChapterListBtn");
  var chapterListModal = document.getElementById("chapterListModal");
  var chapterListClose = document.getElementById("chapterListClose");
  var chapterListGrid = document.getElementById("chapterListGrid");
  var chapterListTitle = document.getElementById("chapterListTitle");

  var menuToggleBtn = document.getElementById("menuToggleBtn");
  var readerToolbarBar = document.getElementById("readerToolbarBar");
  var printChapterBtn = document.getElementById("printChapterBtn");
  var copyChapterBtn = document.getElementById("copyChapterBtn");

  var searchToggle = document.getElementById("searchToggle");
  var searchOverlay = document.getElementById("searchOverlay");
  var searchClose = document.getElementById("searchClose");
  var searchInput = document.getElementById("searchInput");
  var searchResults = document.getElementById("searchResults");

  var fontDecreaseBtn = document.getElementById("fontDecreaseBtn");
  var fontIncreaseBtn = document.getElementById("fontIncreaseBtn");
  var fontResetBtn = document.getElementById("fontResetBtn");
  var fontSizeLabel = document.getElementById("fontSizeLabel");
  var fontSizeSlider = document.getElementById("fontSizeSlider");

  var themeLightBtn = document.getElementById("themeLightBtn");
  var themeDarkBtn = document.getElementById("themeDarkBtn");
  var chapterFavoriteBtn = document.getElementById("chapterFavoriteBtn");
  var chapterNotesBtn = document.getElementById("chapterNotesBtn");
  var chapterShareBtn = document.getElementById("chapterShareBtn");
  var notesMenuItem = document.getElementById("notesMenuItem");
  var shareMenuItem = document.getElementById("shareMenuItem");
  var toolbarMoreBtn = document.getElementById("toolbarMoreBtn");
  var toolbarMoreMenu = document.getElementById("toolbarMoreMenu");
  var copyChapterLinkBtn = document.getElementById("copyChapterLinkBtn");

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ==========================================================
     Data loading
     ========================================================== */

  function loadBook(slug) {
    if (bookCache.has(slug)) {
      return Promise.resolve(bookCache.get(slug));
    }
    return fetch(RAW_PATH + slug + ".json")
      .then(function (res) {
        if (!res.ok) { throw new Error("HTTP " + res.status); }
        return res.json();
      })
      .then(function (data) {
        bookCache.set(slug, data);
        return data;
      });
  }

  /* ==========================================================
     Book / chapter controls
     ========================================================== */

  function populateBookSelect(testament) {
    var groups = {};
    var order = [];

    BIBLE_BOOKS.forEach(function (b) {
      if (b.testament !== testament) { return; }
      if (!groups[b.group]) { groups[b.group] = []; order.push(b.group); }
      groups[b.group].push(b);
    });

    var html = "";
    order.forEach(function (groupName) {
      html += '<optgroup label="' + escapeHtml(groupName) + '">';
      groups[groupName].forEach(function (b) {
        html += '<option value="' + b.slug + '">' + escapeHtml(b.name) + "</option>";
      });
      html += "</optgroup>";
    });
    bookSelect.innerHTML = html;
  }

  function populateChapterSelect(chapterCount, selected) {
    var html = "";
    for (var i = 1; i <= chapterCount; i++) {
      html += '<option value="' + i + '"' + (i === selected ? " selected" : "") + ">Chapter " + i + "</option>";
    }
    chapterSelect.innerHTML = html;
  }

  /* ==========================================================
     Rendering
     ========================================================== */

  function showLoading() {
    readingCard.innerHTML =
      '<div class="reader-status">' +
      '<div class="status-cross" aria-hidden="true">&#10013;</div>' +
      '<p class="status-text">Opening the Word&hellip;</p>' +
      "</div>";
    chapterNav.hidden = true;
  }

  function showError(message, retrySlug, retryChapter) {
    readingCard.innerHTML =
      '<div class="reader-status">' +
      '<div class="status-cross" aria-hidden="true">&#10013;</div>' +
      '<p class="status-text">Unable to load this book.</p>' +
      '<p class="status-sub">' + escapeHtml(message || "Please try again.") + "</p>" +
      '<button class="retry-btn" id="retryBtn" type="button">Try Again</button>' +
      "</div>";
    chapterNav.hidden = true;
    var retryBtn = document.getElementById("retryBtn");
    if (retryBtn) {
      retryBtn.addEventListener("click", function () {
        goTo(retrySlug, retryChapter, null, { push: false });
      });
    }
  }

  function renderChapter(slug, bookData, chapterNum, verseNum) {
    var meta = BOOKS_BY_SLUG[slug];
    var chapter = bookData.chapters.filter(function (c) { return c.chapter === chapterNum; })[0];

    if (!chapter) {
      showError("That chapter could not be found in this book.", slug, 1);
      return;
    }

    var html = "";

    html += '<div class="chapter-heading">';
    html += '<span class="book-name">' + escapeHtml(meta ? meta.name : bookData.short_title || slug) + " " + chapterNum + "</span>";
    if (meta && meta.original && meta.original !== meta.name) {
      html += '<span class="book-original">Douay&ndash;Rheims: ' + escapeHtml(meta.original) + "</span>";
    }
    html += "</div>";

    html += '<div class="chapter-divider" aria-hidden="true"><span class="divider-line"></span><span class="divider-mark">&#10013;</span><span class="divider-line"></span></div>';

    if (chapter.summary) {
      html += '<div class="chapter-summary">';
      html += '<span class="summary-icon" aria-hidden="true">&#128214;</span>';
      html += '<div class="summary-copy">';
      html += '<span class="summary-label">Chapter Summary</span>';
      html += formatInline(chapter.summary);
      if (chapter.summary_notes && chapter.summary_notes.length) {
        html += '<div class="summary-notes">';
        chapter.summary_notes.forEach(function (n) {
          html += '<div class="note-item">' + formatInline(n.text || "") + "</div>";
        });
        html += "</div>";
      }
      html += "</div>"; // summary-copy
      html += "</div>"; // chapter-summary
    }

    html += '<div class="verses" id="versesList">';
    (chapter.verses || []).forEach(function (v) {
      var hasNotes = (v.notes && v.notes.length) || (v.cross_refs && v.cross_refs.length) || v.has_annotation;
      html += '<div class="verse" tabindex="0" role="button" data-verse="' + v.verse + '" data-text="' + escapeHtml(plainText(v.text)) + '" aria-label="Verse ' + v.verse + '">';
      html += '<span class="verse-num">' + v.verse + "</span>";
      html += '<div class="verse-body">';
      html += '<span class="verse-text">' + formatInline(v.text);
      if (hasNotes) { html += '<span class="note-flag" title="Notes available">&#10047;</span>'; }
      html += "</span>";

      html += '<div class="verse-actions">';
      html += '<button class="verse-action-btn bookmark-btn" type="button" data-action="bookmark">&#9825; <span>Bookmark</span></button>';
      html += '<button class="verse-action-btn" type="button" data-action="copy">&#128203; <span>Copy</span></button>';
      html += '<button class="verse-action-btn" type="button" data-action="share">&#128279; <span>Share</span></button>';

      if (hasNotes) {
        html += '<div class="verse-notes">';
        if (v.notes && v.notes.length) {
          v.notes.forEach(function (n) {
            html += '<div class="note-item"><b>' + escapeHtml(n.label ? n.label + ". " : "Note. ") + "</b>" + formatInline(n.text || "") + "</div>";
          });
        }
        if (v.cross_refs && v.cross_refs.length) {
          v.cross_refs.forEach(function (r) {
            html += '<div class="note-item"><b>See also. </b>' + formatInline(r.text || "") + "</div>";
          });
        }
        html += "</div>";
      }

      html += "</div>"; // verse-actions
      html += "</div>"; // verse-body
      html += "</div>"; // verse
    });
    html += "</div>";

    readingCard.innerHTML = html;

    attachVerseHandlers(slug, meta ? meta.name : slug, chapterNum);

    updateChapterNavUI(slug, bookData, chapterNum, meta);
    chapterNav.hidden = false;

    if (verseNum) {
      highlightVerse(verseNum, true);
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function unescapeHtml(str) {
    return String(str)
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");
  }

  // The source JSON uses a small set of inline markers: <i> (italics),
  // <br> (line break), <mn>/<na> (footnote-style marginal note markers).
  // Render them as real, safe elements instead of escaping them to
  // literal text — everything else in the string is still escaped.
  function formatInline(str) {
    var s = escapeHtml(str || "");
    s = s.replace(/&lt;i&gt;/g, "<em>").replace(/&lt;\/i&gt;/g, "</em>");
    s = s.replace(/&lt;br\s*\/?&gt;/g, "<br>");
    s = s.replace(/&lt;mn&gt;/g, '<sup class="ref-mark">').replace(/&lt;\/mn&gt;/g, "</sup>");
    s = s.replace(/&lt;na&gt;/g, '<sup class="ref-mark">').replace(/&lt;\/na&gt;/g, "</sup>");
    return s;
  }

  // Plain-text version (markers stripped) for copy / bookmark / share.
  function plainText(str) {
    return String(str || "")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/?(i|mn|na)>/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* ---------------- Verse interaction ---------------- */

  function attachVerseHandlers(slug, bookName, chapterNum) {
    var list = document.getElementById("versesList");
    if (!list) { return; }

    list.querySelectorAll(".verse").forEach(function (verseEl) {
      verseEl.addEventListener("click", function (e) {
        if (e.target.closest(".verse-action-btn")) { return; }
        toggleVerse(verseEl);
      });
      verseEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          if (e.target.closest(".verse-action-btn")) { return; }
          e.preventDefault();
          toggleVerse(verseEl);
        }
      });

      var bookmarkBtn = verseEl.querySelector('[data-action="bookmark"]');
      var copyBtn = verseEl.querySelector('[data-action="copy"]');
      var shareBtn = verseEl.querySelector('[data-action="share"]');
      var verseNum = parseInt(verseEl.getAttribute("data-verse"), 10);
      var verseText = unescapeHtml(verseEl.getAttribute("data-text") || "");

      refreshBookmarkState(bookmarkBtn, slug, chapterNum, verseNum);

      if (bookmarkBtn) {
        bookmarkBtn.addEventListener("click", function () {
          toggleBookmark(slug, bookName, chapterNum, verseNum, verseText, bookmarkBtn);
        });
      }
      if (copyBtn) {
        copyBtn.addEventListener("click", function () {
          copyVerse(bookName, chapterNum, verseNum, verseText, copyBtn);
        });
      }
      if (shareBtn) {
        shareBtn.addEventListener("click", function () {
          shareVerse(slug, bookName, chapterNum, verseNum, verseText);
        });
      }
    });
  }

  function toggleVerse(verseEl) {
    var wasActive = verseEl.classList.contains("is-active");
    document.querySelectorAll(".verse.is-active").forEach(function (v) {
      if (v !== verseEl) { v.classList.remove("is-active"); }
    });
    verseEl.classList.toggle("is-active", !wasActive);
  }

  function highlightVerse(verseNum, scroll) {
    var el = document.querySelector('.verse[data-verse="' + verseNum + '"]');
    if (!el) { return; }
    el.classList.add("is-active");
    el.classList.add("is-target");
    if (scroll) {
      setTimeout(function () {
        el.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "center" });
      }, 60);
    }
    setTimeout(function () { el.classList.remove("is-target"); }, 2400);
  }

  /* ---------------- Bookmarks ---------------- */

  function getBookmarks() {
    try {
      var raw = localStorage.getItem(BOOKMARK_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveBookmarks(list) {
    try {
      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(list));
    } catch (e) { /* storage unavailable — fail silently */ }
  }

  function bookmarkId(slug, chapter, verse) {
    return slug + ":" + chapter + ":" + verse;
  }

  function isBookmarked(slug, chapter, verse) {
    var id = bookmarkId(slug, chapter, verse);
    return getBookmarks().some(function (b) { return b.id === id; });
  }

  function refreshBookmarkState(btn, slug, chapter, verse) {
    if (!btn) { return; }
    var marked = isBookmarked(slug, chapter, verse);
    btn.classList.toggle("is-bookmarked", marked);
    btn.innerHTML = (marked ? "&#9829;" : "&#9825;") + ' <span>Bookmark</span>';
  }

  function toggleBookmark(slug, bookName, chapter, verse, text, btn) {
    var id = bookmarkId(slug, chapter, verse);
    var list = getBookmarks();
    var idx = list.findIndex(function (b) { return b.id === id; });
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push({ id: id, book: slug, bookName: bookName, chapter: chapter, verse: verse, text: text, savedAt: Date.now() });
    }
    saveBookmarks(list);
    refreshBookmarkState(btn, slug, chapter, verse);
  }

  /* ---------------- Copy / share ---------------- */

  function refText(bookName, chapter, verse) {
    return bookName + " " + chapter + ":" + verse;
  }

  function copyVerse(bookName, chapter, verse, text, btn) {
    var payload = '"' + text + '" \u2014 ' + refText(bookName, chapter, verse);
    var done = function () {
      var original = btn.innerHTML;
      btn.classList.add("is-copied");
      btn.innerHTML = "&#10003; <span>Copied</span>";
      setTimeout(function () {
        btn.classList.remove("is-copied");
        btn.innerHTML = original;
      }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(payload).then(done).catch(function () {});
    }
  }

  function shareVerse(slug, bookName, chapter, verse) {
    var url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("book", slug);
    url.searchParams.set("chapter", chapter);
    url.searchParams.set("verse", verse);

    if (navigator.share) {
      navigator.share({
        title: refText(bookName, chapter, verse) + " — Biblia Sacra",
        url: url.toString()
      }).catch(function () {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url.toString()).catch(function () {});
    }
  }

  /* ==========================================================
     Previous / Next chapter + book navigation
     ========================================================== */

  function updateChapterNavUI(slug, bookData, chapterNum, meta) {
    var atFirstChapter = chapterNum <= 1;
    var atLastChapter = chapterNum >= bookData.chapters.length;
    var bookIdx = meta ? meta.index : -1;
    var atFirstBook = bookIdx <= 0;
    var atLastBook = bookIdx >= BIBLE_BOOKS.length - 1;

    prevChapterBtn.disabled = atFirstChapter && atFirstBook;
    nextChapterBtn.disabled = atLastChapter && atLastBook;

    if (prevChapterLabel) {
      if (!prevChapterBtn.disabled) {
        if (!atFirstChapter) {
          prevChapterLabel.textContent = (meta ? meta.name : slug) + " " + (chapterNum - 1);
        } else {
          var prevMeta = BIBLE_BOOKS[bookIdx - 1];
          prevChapterLabel.textContent = prevMeta ? prevMeta.name : "";
        }
      } else {
        prevChapterLabel.textContent = "";
      }
    }

    if (nextChapterLabel) {
      if (!nextChapterBtn.disabled) {
        if (!atLastChapter) {
          nextChapterLabel.textContent = (meta ? meta.name : slug) + " " + (chapterNum + 1);
        } else {
          var nextMeta = BIBLE_BOOKS[bookIdx + 1];
          nextChapterLabel.textContent = nextMeta ? nextMeta.name + " 1" : "";
        }
      } else {
        nextChapterLabel.textContent = "";
      }
    }

    if (chapterListTitle) {
      chapterListTitle.textContent = (meta ? meta.name : slug) + " \u2014 Chapters";
    }
    populateChapterListGrid(bookData.chapters.length, chapterNum);
  }

  /* ---------------- "View Chapter List" quick-jump modal ---------------- */

  function populateChapterListGrid(count, current) {
    if (!chapterListGrid) { return; }
    var html = "";
    for (var i = 1; i <= count; i++) {
      html += '<button class="chapter-list-item' + (i === current ? " is-current" : "") +
        '" type="button" data-chapter="' + i + '">' + i + "</button>";
    }
    chapterListGrid.innerHTML = html;
  }

  function openChapterList() {
    if (!chapterListModal) { return; }
    chapterListModal.classList.add("is-open");
    if (viewChapterListBtn) { viewChapterListBtn.setAttribute("aria-expanded", "true"); }
  }

  function closeChapterList() {
    if (!chapterListModal) { return; }
    chapterListModal.classList.remove("is-open");
    if (viewChapterListBtn) { viewChapterListBtn.setAttribute("aria-expanded", "false"); }
  }

  function initChapterListModal() {
    if (viewChapterListBtn) { viewChapterListBtn.addEventListener("click", openChapterList); }
    if (chapterListClose) { chapterListClose.addEventListener("click", closeChapterList); }
    if (chapterListModal) {
      chapterListModal.addEventListener("click", function (e) {
        if (e.target === chapterListModal) { closeChapterList(); }
      });
      chapterListGrid.addEventListener("click", function (e) {
        var btn = e.target.closest(".chapter-list-item");
        if (!btn) { return; }
        closeChapterList();
        goTo(state.book, parseInt(btn.getAttribute("data-chapter"), 10), null, { push: true });
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeChapterList(); }
    });
  }

  function goPrevChapter() {
    if (state.chapter > 1) {
      goTo(state.book, state.chapter - 1, null, { push: true });
      return;
    }
    var meta = BOOKS_BY_SLUG[state.book];
    if (!meta || meta.index <= 0) { return; }
    var prevMeta = BIBLE_BOOKS[meta.index - 1];
    loadBook(prevMeta.slug).then(function (data) {
      goTo(prevMeta.slug, data.chapters.length, null, { push: true });
    }).catch(function () {
      showError("Please try again.", state.book, state.chapter);
    });
  }

  function goNextChapter() {
    var currentData = bookCache.get(state.book);
    if (currentData && state.chapter < currentData.chapters.length) {
      goTo(state.book, state.chapter + 1, null, { push: true });
      return;
    }
    var meta = BOOKS_BY_SLUG[state.book];
    if (!meta || meta.index >= BIBLE_BOOKS.length - 1) { return; }
    var nextMeta = BIBLE_BOOKS[meta.index + 1];
    goTo(nextMeta.slug, 1, null, { push: true });
  }

  /* ==========================================================
     Core navigation
     ========================================================== */

  function goTo(slug, chapterNum, verseNum, opts) {
    opts = opts || {};
    var meta = BOOKS_BY_SLUG[slug];
    if (!meta) { slug = "genesis"; meta = BOOKS_BY_SLUG.genesis; }

    showLoading();

    loadBook(slug).then(function (data) {
      var count = data.chapters.length;
      var ch = chapterNum && chapterNum >= 1 && chapterNum <= count ? chapterNum : 1;

      state.book = slug;
      state.chapter = ch;
      state.verse = verseNum || null;

      testamentSelect.value = meta.testament;
      populateBookSelect(meta.testament);
      bookSelect.value = slug;
      populateChapterSelect(count, ch);

      renderChapter(slug, data, ch, verseNum);
      updateUrl(slug, ch, verseNum, opts.push);
      refreshChapterFavoriteState();
    }).catch(function () {
      showError("This book could not be loaded. Check your connection and try again.", slug, chapterNum || 1);
    });
  }

  function updateUrl(slug, chapter, verse, push) {
    var url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("book", slug);
    url.searchParams.set("chapter", chapter);
    if (verse) { url.searchParams.set("verse", verse); }
    var method = push ? "pushState" : "replaceState";
    window.history[method]({ book: slug, chapter: chapter, verse: verse || null }, "", url.toString());
    document.title = (BOOKS_BY_SLUG[slug] ? BOOKS_BY_SLUG[slug].name : slug) + " " + chapter + " — Biblia Sacra";
  }

  /* ==========================================================
     Control listeners
     ========================================================== */

  testamentSelect.addEventListener("change", function () {
    var testament = testamentSelect.value;
    populateBookSelect(testament);
    var firstSlug = BIBLE_BOOKS.filter(function (b) { return b.testament === testament; })[0].slug;
    goTo(firstSlug, 1, null, { push: true });
  });

  bookSelect.addEventListener("change", function () {
    goTo(bookSelect.value, 1, null, { push: true });
  });

  chapterSelect.addEventListener("change", function () {
    goTo(state.book, parseInt(chapterSelect.value, 10), null, { push: true });
  });

  prevChapterBtn.addEventListener("click", goPrevChapter);
  nextChapterBtn.addEventListener("click", goNextChapter);

  window.addEventListener("popstate", function (e) {
    var params = new URLSearchParams(window.location.search);
    var slug = params.get("book") || "genesis";
    var chapter = parseInt(params.get("chapter"), 10) || 1;
    var verse = params.get("verse") ? parseInt(params.get("verse"), 10) : null;
    goTo(slug, chapter, verse, { push: false });
  });

  /* ==========================================================
     Search
     ========================================================== */

  var searchDebounceTimer = null;
  var searchToken = 0;

  function openSearch() {
    searchOverlay.classList.add("is-open");
    searchInput.focus();
  }
  function closeSearch() {
    searchOverlay.classList.remove("is-open");
  }

  searchToggle.addEventListener("click", openSearch);
  searchClose.addEventListener("click", closeSearch);
  searchOverlay.addEventListener("click", function (e) {
    if (e.target === searchOverlay) { closeSearch(); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && searchOverlay.classList.contains("is-open")) { closeSearch(); }
  });

  searchInput.addEventListener("input", function () {
    var q = searchInput.value.trim();
    clearTimeout(searchDebounceTimer);
    if (q.length < 3) {
      searchResults.innerHTML = '<p class="search-hint">Type at least 3 letters to search the whole Bible.</p>';
      return;
    }
    searchDebounceTimer = setTimeout(function () { runSearch(q); }, 400);
  });

  function runSearch(query) {
    var myToken = ++searchToken;
    var lowerQ = query.toLowerCase();
    searchResults.innerHTML = '<p class="search-progress">Searching the Scriptures&hellip;</p>';

    var results = [];
    var maxResults = 60;
    var books = BIBLE_BOOKS;
    var i = 0;

    function step() {
      if (myToken !== searchToken) { return; } // a newer search superseded this one
      if (i >= books.length || results.length >= maxResults) {
        renderSearchResults(results, query);
        return;
      }
      var meta = books[i++];
      loadBook(meta.slug).then(function (data) {
        if (myToken !== searchToken) { return; }
        data.chapters.forEach(function (ch) {
          if (results.length >= maxResults) { return; }
          (ch.verses || []).forEach(function (v) {
            if (results.length >= maxResults) { return; }
            if (v.text && v.text.toLowerCase().indexOf(lowerQ) !== -1) {
              results.push({ slug: meta.slug, name: meta.name, chapter: ch.chapter, verse: v.verse, text: v.text });
            }
          });
        });
        searchResults.innerHTML = '<p class="search-progress">Searching\u2026 ' + i + " of " + books.length + " books, " + results.length + " found</p>";
        step();
      }).catch(function () {
        step(); // skip a book that failed to load, keep searching
      });
    }
    step();
  }

  function renderSearchResults(results, query) {
    if (!results.length) {
      searchResults.innerHTML = '<p class="search-empty">No verses found for &ldquo;' + escapeHtml(query) + "&rdquo;.</p>";
      return;
    }
    var html = "";
    results.forEach(function (r) {
      var snippet = escapeHtml(plainText(r.text)).replace(
        new RegExp("(" + escapeRegExp(escapeHtml(query)) + ")", "ig"),
        "<mark>$1</mark>"
      );
      html +=
        '<button class="search-result" type="button" data-book="' + r.slug + '" data-chapter="' + r.chapter + '" data-verse="' + r.verse + '">' +
        '<span class="result-ref">' + escapeHtml(r.name) + " " + r.chapter + ":" + r.verse + "</span>" +
        '<span class="result-snippet">' + snippet + "</span>" +
        "</button>";
    });
    searchResults.innerHTML = html;

    searchResults.querySelectorAll(".search-result").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var slug = btn.getAttribute("data-book");
        var chapter = parseInt(btn.getAttribute("data-chapter"), 10);
        var verse = parseInt(btn.getAttribute("data-verse"), 10);
        closeSearch();
        goTo(slug, chapter, verse, { push: true });
      });
    });
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /* ==========================================================
     Text size adjuster
     ========================================================== */

  var FONT_SCALE_KEY = "bibliaSacraFontScale";
  var FONT_SCALE_MIN = 0.85;
  var FONT_SCALE_MAX = 2.0;
  var FONT_SCALE_STEP = 0.15;
  var FONT_SCALE_STEPS = Math.round((FONT_SCALE_MAX - FONT_SCALE_MIN) / FONT_SCALE_STEP);

  function clampFontScale(value) {
    return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, value));
  }

  function scaleToStepIndex(scale) {
    return Math.round((clampFontScale(scale) - FONT_SCALE_MIN) / FONT_SCALE_STEP);
  }

  function applyFontScale(scale) {
    scale = clampFontScale(scale);
    var pct = Math.round(scale * 100);
    document.documentElement.style.setProperty("--reader-font-scale", scale);
    if (fontSizeLabel) {
      fontSizeLabel.textContent = pct + "%";
    }
    if (fontDecreaseBtn) { fontDecreaseBtn.disabled = scale <= FONT_SCALE_MIN; }
    if (fontIncreaseBtn) { fontIncreaseBtn.disabled = scale >= FONT_SCALE_MAX; }
    if (fontSizeSlider) {
      var stepIndex = scaleToStepIndex(scale);
      fontSizeSlider.value = String(stepIndex);
      fontSizeSlider.setAttribute("aria-valuetext", pct + "%");
      fontSizeSlider.style.setProperty("--reader-font-pct", (stepIndex / FONT_SCALE_STEPS * 100) + "%");
    }
    try {
      window.localStorage.setItem(FONT_SCALE_KEY, String(scale));
    } catch (e) { /* storage unavailable, ignore */ }
    return scale;
  }

  function getSavedFontScale() {
    try {
      var saved = parseFloat(window.localStorage.getItem(FONT_SCALE_KEY));
      if (!isNaN(saved)) { return clampFontScale(saved); }
    } catch (e) { /* storage unavailable, ignore */ }
    return 1;
  }

  function initFontSizeControl() {
    var currentScale = applyFontScale(getSavedFontScale());

    if (fontIncreaseBtn) {
      fontIncreaseBtn.addEventListener("click", function () {
        currentScale = applyFontScale(currentScale + FONT_SCALE_STEP);
      });
    }
    if (fontDecreaseBtn) {
      fontDecreaseBtn.addEventListener("click", function () {
        currentScale = applyFontScale(currentScale - FONT_SCALE_STEP);
      });
    }
    if (fontResetBtn) {
      fontResetBtn.addEventListener("click", function () {
        currentScale = applyFontScale(1);
        flashSimpleButton(fontResetBtn, "Reset");
      });
    }
    if (fontSizeSlider) {
      fontSizeSlider.addEventListener("input", function () {
        var index = parseInt(fontSizeSlider.value, 10) || 0;
        currentScale = applyFontScale(FONT_SCALE_MIN + index * FONT_SCALE_STEP);
      });
    }
  }

  /* ==========================================================
     Light / Dark reading mode
     ========================================================== */

  var READER_THEME_KEY = "bibliaSacraReaderTheme";

  function getSavedReaderTheme() {
    try {
      return window.localStorage.getItem(READER_THEME_KEY) === "dark" ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  }

  function applyReaderTheme(theme) {
    var isDark = theme === "dark";
    if (isDark) {
      document.documentElement.setAttribute("data-reader-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-reader-theme");
    }
    if (themeLightBtn) { themeLightBtn.setAttribute("aria-pressed", String(!isDark)); }
    if (themeDarkBtn) { themeDarkBtn.setAttribute("aria-pressed", String(isDark)); }
    try {
      window.localStorage.setItem(READER_THEME_KEY, isDark ? "dark" : "light");
    } catch (e) { /* storage unavailable, ignore */ }
  }

  function initThemeToggle() {
    applyReaderTheme(getSavedReaderTheme());
    if (themeLightBtn) {
      themeLightBtn.addEventListener("click", function () { applyReaderTheme("light"); });
    }
    if (themeDarkBtn) {
      themeDarkBtn.addEventListener("click", function () { applyReaderTheme("dark"); });
    }
  }

  /* ==========================================================
     Chapter favorites, share, and the "more" menu
     ========================================================== */

  var FAVORITES_KEY = "bibliaSacraChapterFavorites";

  function getFavorites() {
    try {
      var raw = localStorage.getItem(FAVORITES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveFavorites(list) {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
    } catch (e) { /* storage unavailable — fail silently */ }
  }

  function favoriteId(slug, chapter) {
    return slug + ":" + chapter;
  }

  function refreshChapterFavoriteState() {
    if (!chapterFavoriteBtn) { return; }
    var id = favoriteId(state.book, state.chapter);
    var marked = getFavorites().some(function (f) { return f.id === id; });
    chapterFavoriteBtn.classList.toggle("is-favorited", marked);
    chapterFavoriteBtn.setAttribute("aria-pressed", String(marked));
    chapterFavoriteBtn.innerHTML = '<span aria-hidden="true">' + (marked ? "&#9733;" : "&#9734;") + '</span><span class="pill-label">' + (marked ? "Bookmarked" : "Bookmark") + "</span>";
    chapterFavoriteBtn.setAttribute(
      "aria-label",
      (marked ? "Remove " : "Add ") + "this chapter " + (marked ? "from" : "to") + " favorites"
    );
  }

  function toggleChapterFavorite() {
    var meta = BOOKS_BY_SLUG[state.book];
    var id = favoriteId(state.book, state.chapter);
    var list = getFavorites();
    var idx = list.findIndex(function (f) { return f.id === id; });
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push({
        id: id,
        book: state.book,
        bookName: meta ? meta.name : state.book,
        chapter: state.chapter,
        savedAt: Date.now()
      });
    }
    saveFavorites(list);
    refreshChapterFavoriteState();
  }

  function currentChapterUrl() {
    var url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("book", state.book);
    url.searchParams.set("chapter", state.chapter);
    return url;
  }

  function shareChapter() {
    var meta = BOOKS_BY_SLUG[state.book];
    var title = (meta ? meta.name : state.book) + " " + state.chapter + " — Biblia Sacra";
    var url = currentChapterUrl().toString();

    if (navigator.share) {
      navigator.share({ title: title, url: url }).catch(function () {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        flashIconButton(chapterShareBtn, "&#10003;");
      }).catch(function () {});
    }
  }

  function copyChapterLink() {
    var url = currentChapterUrl().toString();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        flashChapterToolButton(copyChapterLinkBtn, "&#10003;", "Link copied");
      }).catch(function () {});
    }
  }

  /* ---------------- Chapter notes toggle ---------------- */

  function refreshNotesButtonState(isOpen) {
    if (chapterNotesBtn) {
      chapterNotesBtn.classList.toggle("is-active", isOpen);
      chapterNotesBtn.setAttribute("aria-pressed", String(isOpen));
    }
  }

  function toggleAllNotes() {
    if (!readingCard) { return; }
    var isOpen = readingCard.classList.toggle("show-all-notes");
    refreshNotesButtonState(isOpen);
  }

  function flashIconButton(btn, html) {
    if (!btn) { return; }
    var original = btn.innerHTML;
    btn.innerHTML = '<span aria-hidden="true">' + html + "</span>";
    setTimeout(function () { btn.innerHTML = original; }, 1400);
  }

  function flashMenuItem(btn, message) {
    if (!btn) { return; }
    var original = btn.textContent;
    btn.textContent = message;
    btn.classList.add("is-confirmed");
    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove("is-confirmed");
    }, 1400);
  }

  function flashSimpleButton(btn, message) {
    flashMenuItem(btn, message);
  }

  function openMoreMenu() {
    if (!toolbarMoreMenu) { return; }
    toolbarMoreMenu.hidden = false;
    if (toolbarMoreBtn) { toolbarMoreBtn.setAttribute("aria-expanded", "true"); }
  }

  function closeMoreMenu() {
    if (!toolbarMoreMenu) { return; }
    toolbarMoreMenu.hidden = true;
    if (toolbarMoreBtn) { toolbarMoreBtn.setAttribute("aria-expanded", "false"); }
  }

  function initToolbarExtras() {
    if (chapterFavoriteBtn) {
      chapterFavoriteBtn.addEventListener("click", toggleChapterFavorite);
    }
    if (chapterShareBtn) {
      chapterShareBtn.addEventListener("click", shareChapter);
    }
    if (chapterNotesBtn) {
      chapterNotesBtn.addEventListener("click", toggleAllNotes);
    }
    if (notesMenuItem) {
      notesMenuItem.addEventListener("click", function () {
        toggleAllNotes();
        closeMoreMenu();
      });
    }
    if (shareMenuItem) {
      shareMenuItem.addEventListener("click", function () {
        shareChapter();
        closeMoreMenu();
      });
    }
    if (copyChapterLinkBtn) {
      copyChapterLinkBtn.addEventListener("click", copyChapterLink);
    }
    if (toolbarMoreBtn) {
      toolbarMoreBtn.addEventListener("click", function () {
        if (toolbarMoreMenu && toolbarMoreMenu.hidden) { openMoreMenu(); } else { closeMoreMenu(); }
      });
    }
    document.addEventListener("click", function (e) {
      if (!toolbarMoreMenu || toolbarMoreMenu.hidden) { return; }
      if (e.target.closest(".toolbar-more")) { return; }
      closeMoreMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeMoreMenu(); }
    });
  }

  /* ==========================================================
     Menu toggle (shows / hides the reader-toolbar-bar)
     ========================================================== */

  function isToolbarOpen() {
    return !!readerToolbarBar && !readerToolbarBar.hidden;
  }

  function openReaderToolbar() {
    if (!readerToolbarBar) { return; }
    readerToolbarBar.hidden = false;
    if (menuToggleBtn) { menuToggleBtn.setAttribute("aria-expanded", "true"); }
  }

  function closeReaderToolbar() {
    if (!readerToolbarBar) { return; }
    readerToolbarBar.hidden = true;
    if (menuToggleBtn) { menuToggleBtn.setAttribute("aria-expanded", "false"); }
    closeMoreMenu();
  }

  function toggleReaderToolbar() {
    if (isToolbarOpen()) { closeReaderToolbar(); } else { openReaderToolbar(); }
  }

  function initMenuToggle() {
    if (!menuToggleBtn) { return; }
    menuToggleBtn.addEventListener("click", toggleReaderToolbar);
  }

  /* ==========================================================
     Print / Copy the whole chapter
     ========================================================== */

  function currentChapterHeading() {
    var meta = BOOKS_BY_SLUG[state.book];
    return (meta ? meta.name : state.book) + " " + state.chapter;
  }

  function chapterPlainText() {
    var data = bookCache.get(state.book);
    if (!data) { return currentChapterHeading(); }
    var chapter = data.chapters.filter(function (c) { return c.chapter === state.chapter; })[0];
    if (!chapter) { return currentChapterHeading(); }

    var lines = [currentChapterHeading(), ""];
    (chapter.verses || []).forEach(function (v) {
      lines.push(v.verse + ". " + plainText(v.text));
    });
    return lines.join("\n");
  }

  function printChapter() {
    if (isToolbarOpen()) { closeMoreMenu(); }
    window.print();
  }

  function copyWholeChapter() {
    var text = chapterPlainText();
    if (!(navigator.clipboard && navigator.clipboard.writeText)) { return; }
    navigator.clipboard.writeText(text).then(function () {
      flashChapterToolButton(copyChapterBtn, "&#10003;", "Copied");
    }).catch(function () {});
  }

  function flashChapterToolButton(btn, iconHtml, label) {
    if (!btn) { return; }
    var original = btn.innerHTML;
    btn.classList.add("is-confirmed");
    btn.innerHTML = '<span aria-hidden="true">' + iconHtml + '</span><span class="more-item-label">' + label + "</span>";
    setTimeout(function () {
      btn.classList.remove("is-confirmed");
      btn.innerHTML = original;
    }, 1600);
  }

  function initChapterTools() {
    if (printChapterBtn) { printChapterBtn.addEventListener("click", printChapter); }
    if (copyChapterBtn) { copyChapterBtn.addEventListener("click", copyWholeChapter); }
  }

  /* ==========================================================
     Init
     ========================================================== */

  function init() {
    var params = new URLSearchParams(window.location.search);
    var slug = params.get("book");
    var chapter = parseInt(params.get("chapter"), 10);
    var verse = params.get("verse") ? parseInt(params.get("verse"), 10) : null;

    if (!slug || !BOOKS_BY_SLUG[slug]) { slug = "genesis"; }
    if (!chapter || chapter < 1) { chapter = 1; }

    initFontSizeControl();
    initThemeToggle();
    initToolbarExtras();
    initChapterListModal();
    initMenuToggle();
    initChapterTools();
    populateBookSelect(BOOKS_BY_SLUG[slug].testament);
    goTo(slug, chapter, verse, { push: false });
  }

  init();
})();

