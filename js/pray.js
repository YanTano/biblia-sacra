(function () {
  "use strict";

  var JOURNAL_KEY = "bibliaSacraPrayerJournal";
  var FONT_SCALE_KEY = "bibliaSacraFontScale";
  var FONT_SCALE_MIN = 0.85;
  var FONT_SCALE_MAX = 2.0;
  var FONT_SCALE_STEP = 0.15;

  /* ==========================================================
     Icons (inline SVG markup, one per category)
     ========================================================== */

  var ICONS = {
    rosary: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="5" r="1.4" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="4" r="1.4" stroke="currentColor" stroke-width="1.4"/><circle cx="17" cy="5" r="1.4" stroke="currentColor" stroke-width="1.4"/><circle cx="20" cy="9" r="1.4" stroke="currentColor" stroke-width="1.4"/><circle cx="19" cy="14" r="1.4" stroke="currentColor" stroke-width="1.4"/><circle cx="4" cy="9" r="1.4" stroke="currentColor" stroke-width="1.4"/><circle cx="5" cy="14" r="1.4" stroke="currentColor" stroke-width="1.4"/><path d="M12 15v6M10 18h4M10.5 21h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    sunrise: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 18h14M12 5v3M5.5 11.5l1.8 1.8M18.5 11.5l-1.8 1.8M3 15h2M19 15h2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8 18a4 4 0 018 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 13.5A7 7 0 1110.5 6a5.5 5.5 0 007.5 7.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M18 5l0.6 1.4L20 7l-1.4 0.6L18 9l-0.6-1.4L16 7l1.4-0.6z" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/></svg>',
    meal: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 3v8m0 0c-1.5 0-2.5-1-2.5-2.5V3M7 3v0M9.5 3v5.5C9.5 10 8.5 11 7 11m0 0v10M17 3c-1.5 0-2 2-2 4v3c0 1 0.7 1.5 2 1.5s2-.5 2-1.5V7c0-2-.5-4-2-4zm0 8.5V21" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20s-7-4.4-9.5-8.8C1 8 2.4 4.8 5.6 4c2-.5 4 .4 5.4 2.1L12 7.2l1-1.1C14.4 4.4 16.4 3.5 18.4 4c3.2.8 4.6 4 3.1 7.2C19 15.6 12 20 12 20z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    family: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="8" r="2.6" stroke="currentColor" stroke-width="1.5"/><circle cx="16" cy="8.5" r="2.2" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 19c0-3 2.2-5 5-5s5 2 5 5M14 19c0-2.3 1.6-4 4-4s4 1.7 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3l7 3v5c0 5-3.4 8.4-7 10-3.6-1.6-7-5-7-10V6l7-3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9.5 12l1.8 1.8L14.8 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5c-1.6-1-4-1.4-6.5-1.2v13c2.5-.2 4.9.2 6.5 1.2 1.6-1 4-1.4 6.5-1.2v-13C16 3.6 13.6 4 12 5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M12 5v13" stroke="currentColor" stroke-width="1.4"/></svg>'
  };

  /* ==========================================================
     Prayer library content
     ========================================================== */

  var LIBRARY = [
    {
      group: "The Holy Rosary",
      desc: "Meditate on the life of Christ with Mary.",
      icon: "rosary",
      prayers: [
        {
          title: "How to Pray the Rosary",
          text: "1. Make the Sign of the Cross while holding the Crucifix.\n2. Say the Apostles' Creed.\n3. Say the Our Father on the first large bead.\n4. Say three Hail Marys on the next three beads, for an increase of Faith, Hope, and Charity.\n5. Say the Glory Be.\n6. Announce the First Mystery, then say the Our Father on the large bead.\n7. Say ten Hail Marys on the ten small beads of the decade, meditating on the Mystery.\n8. Say the Glory Be, then the Fatima Prayer (O My Jesus).\n9. Repeat steps 6 to 8 for the remaining four Mysteries.\n10. After the fifth decade, say the Hail, Holy Queen.\n11. End with the Closing Prayer and the Sign of the Cross."
        },
        {
          title: "The Mysteries of the Rosary",
          text: "Joyful Mysteries \u2014 Monday & Saturday\n1. The Annunciation\n2. The Visitation\n3. The Nativity\n4. The Presentation in the Temple\n5. The Finding of Jesus in the Temple\n\nSorrowful Mysteries \u2014 Tuesday & Friday\n1. The Agony in the Garden\n2. The Scourging at the Pillar\n3. The Crowning with Thorns\n4. The Carrying of the Cross\n5. The Crucifixion\n\nGlorious Mysteries \u2014 Wednesday & Sunday\n1. The Resurrection\n2. The Ascension\n3. The Descent of the Holy Spirit\n4. The Assumption of Mary\n5. The Coronation of Mary as Queen of Heaven\n\nLuminous Mysteries \u2014 Thursday\n1. The Baptism of Jesus in the Jordan\n2. The Wedding at Cana\n3. The Proclamation of the Kingdom\n4. The Transfiguration\n5. The Institution of the Eucharist"
        },
        {
          title: "Sign of the Cross",
          text: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen."
        },
        {
          title: "Apostles' Creed",
          text: "I believe in God, the Father Almighty, Creator of heaven and earth.\nI believe in Jesus Christ, His only Son, our Lord, who was conceived by the Holy Spirit,\nborn of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried.\nHe descended into hell; on the third day He rose again from the dead.\nHe ascended into heaven and is seated at the right hand of God the Father Almighty.\nFrom there He will come to judge the living and the dead.\nI believe in the Holy Spirit, the holy catholic Church, the communion of saints,\nthe forgiveness of sins, the resurrection of the body, and life everlasting. Amen."
        },
        {
          title: "Our Father",
          text: "Our Father, who art in heaven, hallowed be Thy name.\nThy kingdom come, Thy will be done, on earth as it is in heaven.\nGive us this day our daily bread, and forgive us our trespasses,\nas we forgive those who trespass against us.\nAnd lead us not into temptation, but deliver us from evil. Amen."
        },
        {
          title: "Hail Mary",
          text: "Hail Mary, full of grace, the Lord is with thee.\nBlessed art thou amongst women, and blessed is the fruit of thy womb, Jesus.\nHoly Mary, Mother of God, pray for us sinners,\nnow and at the hour of our death. Amen."
        },
        {
          title: "Glory Be",
          text: "Glory be to the Father, and to the Son, and to the Holy Spirit.\nAs it was in the beginning, is now, and ever shall be, world without end. Amen."
        },
        {
          title: "Fatima Prayer (O My Jesus)",
          text: "O my Jesus, forgive us our sins, save us from the fires of hell,\nand lead all souls to Heaven, especially those most in need of Thy mercy. Amen."
        },
        {
          title: "Hail, Holy Queen",
          text: "Hail, Holy Queen, Mother of Mercy, our life, our sweetness, and our hope.\nTo thee do we cry, poor banished children of Eve.\nTo thee do we send up our sighs, mourning and weeping in this valley of tears.\nTurn then, most gracious advocate, thine eyes of mercy toward us,\nand after this our exile, show unto us the blessed fruit of thy womb, Jesus.\nO clement, O loving, O sweet Virgin Mary. Amen."
        },
        {
          title: "Closing Prayer",
          text: "Let us pray. O God, whose only-begotten Son, by His life, death, and resurrection,\nhas purchased for us the rewards of eternal life, grant, we beseech Thee,\nthat meditating upon these mysteries of the Most Holy Rosary of the Blessed Virgin Mary,\nwe may imitate what they contain and obtain what they promise,\nthrough the same Christ our Lord. Amen."
        }
      ]
    },
    {
      group: "The Hour of Great Mercy (3 O'Clock Prayer)",
      desc: "Remember His passion. Receive His mercy.",
      icon: "clock",
      prayers: [
        {
          title: "About the Hour of Mercy",
          text: "Catholic tradition holds three o'clock in the afternoon as the hour Christ died on the Cross \u2014 the Hour of Great Mercy.\nSt. Faustina Kowalska taught that the faithful are invited to pause at this hour and plead for God's mercy on the whole world, especially for the dying and for sinners."
        },
        {
          title: "The 3 O'Clock Prayer",
          text: "You expired, Jesus, but the source of life gushed forth for souls,\nO Fount of Life, unfathomable Divine Mercy, envelop the whole world and empty Yourself out upon us.\nO Blood and Water, which gushed forth from the Heart of Jesus as a fount of mercy for us, I trust in You!"
        }
      ]
    },
    {
      group: "Morning Prayers",
      desc: "Begin your day with God.",
      icon: "sunrise",
      prayers: [
        {
          title: "A Morning Offering",
          text: "Lord, as this new day begins, I offer You my thoughts, my words, and my work.\nGuide my steps, steady my heart, and let everything I do today bring You honor.\nThank You for the gift of this morning. Amen."
        },
        {
          title: "Prayer for Strength",
          text: "Father, I don't know everything today will bring, but You do.\nGive me strength for what is hard, patience for what is slow, and joy for what is good.\nWalk with me from this hour until the sun goes down. Amen."
        }
      ]
    },
    {
      group: "Evening Prayers",
      desc: "End your day with gratitude.",
      icon: "moon",
      prayers: [
        {
          title: "Prayer of Rest",
          text: "Lord, the day is done. For what I did well, I thank You. For what I got wrong, I ask forgiveness.\nWatch over my home and the people I love while I sleep.\nLet me rise tomorrow rested and ready to serve You again. Amen."
        },
        {
          title: "Prayer for a Peaceful Night",
          text: "Father, quiet my mind and ease my worries.\nInto Your hands I place everything I could not finish today.\nLet me rest in Your peace tonight. Amen."
        }
      ]
    },
    {
      group: "Before Meals",
      desc: "Give thanks for the food we receive.",
      icon: "meal",
      prayers: [
        {
          title: "Grace Before Eating",
          text: "Bless us, O Lord, and these Thy gifts, which we are about to receive from Thy bounty.\nThrough Christ our Lord. Amen."
        },
        {
          title: "A Simple Table Blessing",
          text: "Thank You, Lord, for this food and for the hands that prepared it.\nBless our family and all who are gathered here. Amen."
        }
      ]
    },
    {
      group: "Thanksgiving",
      desc: "Express your gratitude to God.",
      icon: "heart",
      prayers: [
        {
          title: "Prayer of Gratitude",
          text: "Lord, thank You for the breath in my lungs and the roof over my head.\nThank You for the people who love me and the small mercies I overlook each day.\nTeach me to count my blessings before I count my burdens. Amen."
        }
      ]
    },
    {
      group: "For Family",
      desc: "Pray for your loved ones.",
      icon: "family",
      prayers: [
        {
          title: "Prayer for My Family",
          text: "Father, watch over the people I hold dearest.\nKeep them safe, keep them healthy, and keep our home full of patience and love.\nWhere there is distance between us, bring us closer. Amen."
        },
        {
          title: "Prayer for Children and Grandchildren",
          text: "Lord, protect the young ones in my family wherever they are today.\nGuide their choices, guard their hearts, and let them always find their way back to You. Amen."
        }
      ]
    },
    {
      group: "In Times of Trouble",
      desc: "Find peace amid life's storms.",
      icon: "shield",
      prayers: [
        {
          title: "Prayer for Anxiety",
          text: "Lord, my heart is heavy and my mind won't be still.\nYou said not to be anxious about anything, so I bring this worry to You now.\nGive me Your peace, the kind the world cannot give. Amen."
        },
        {
          title: "Prayer for Healing",
          text: "Father, You know exactly where it hurts.\nPlace Your healing hand on my body and my spirit, and give strength to those caring for me.\nI trust You with what I cannot control. Amen."
        },
        {
          title: "Prayer for Guidance",
          text: "Lord, I don't know which way to turn.\nMake the path clear, or give me the patience to wait until it is.\nI trust that You go before me. Amen."
        }
      ]
    },
    {
      group: "Traditional Prayers",
      desc: "Prayers passed down through the ages.",
      icon: "book",
      prayers: [
        {
          title: "The Lord's Prayer",
          text: "Our Father, who art in heaven, hallowed be Thy name.\nThy kingdom come, Thy will be done, on earth as it is in heaven.\nGive us this day our daily bread, and forgive us our trespasses,\nas we forgive those who trespass against us.\nAnd lead us not into temptation, but deliver us from evil. Amen."
        },
        {
          title: "Hail Mary",
          text: "Hail Mary, full of grace, the Lord is with thee.\nBlessed art thou amongst women, and blessed is the fruit of thy womb, Jesus.\nHoly Mary, Mother of God, pray for us sinners,\nnow and at the hour of our death. Amen."
        },
        {
          title: "The Apostles' Creed",
          text: "I believe in God, the Father Almighty, Creator of heaven and earth.\nI believe in Jesus Christ, His only Son, our Lord, who was conceived by the Holy Spirit,\nborn of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried.\nHe descended into hell; on the third day He rose again from the dead.\nHe ascended into heaven and is seated at the right hand of God the Father Almighty.\nFrom there He will come to judge the living and the dead.\nI believe in the Holy Spirit, the holy catholic Church, the communion of saints,\nthe forgiveness of sins, the resurrection of the body, and life everlasting. Amen."
        },
        {
          title: "Serenity Prayer",
          text: "God, grant me the serenity to accept the things I cannot change,\ncourage to change the things I can,\nand wisdom to know the difference."
        }
      ]
    }
  ];

  /* ==========================================================
     DOM refs
     ========================================================== */

  var menuToggle = document.getElementById("menuToggle");
  var prayToolbarBar = document.getElementById("prayToolbarBar");
  var praySidebar = document.getElementById("praySidebar");
  var sidebarOverlay = document.getElementById("sidebarOverlay");

  var tabLibraryBtn = document.getElementById("tabLibraryBtn");
  var tabJournalBtn = document.getElementById("tabJournalBtn");
  var libraryView = document.getElementById("libraryView");
  var journalView = document.getElementById("journalView");

  var categoryListView = document.getElementById("categoryListView");
  var categoryDetailView = document.getElementById("categoryDetailView");
  var detailBackBtn = document.getElementById("detailBackBtn");
  var detailCloseBtn = document.getElementById("detailCloseBtn");
  var detailTitle = document.getElementById("detailTitle");
  var detailSubtitle = document.getElementById("detailSubtitle");
  var detailPrayers = document.getElementById("detailPrayers");

  var paySectionSelect = document.getElementById("paySectionSelect");
  var prayerFullscreenToggle = document.getElementById("prayerFullscreenToggle");

  var prayerSearchToggle = document.getElementById("prayerSearchToggle");
  var prayerSearchOverlay = document.getElementById("prayerSearchOverlay");
  var prayerSearchClose = document.getElementById("prayerSearchClose");
  var prayerSearchInput = document.getElementById("prayerSearchInput");
  var prayerSearchResults = document.getElementById("prayerSearchResults");

  var introHeart = document.getElementById("introHeart");

  var journalForm = document.getElementById("journalForm");
  var journalTitle = document.getElementById("journalTitle");
  var journalCategory = document.getElementById("journalCategory");
  var journalText = document.getElementById("journalText");
  var journalList = document.getElementById("journalList");
  var journalEmpty = document.getElementById("journalEmpty");
  var filterBtns = document.querySelectorAll(".journal-filter-btn");

  var fontDecreaseBtn = document.getElementById("fontDecreaseBtn");
  var fontIncreaseBtn = document.getElementById("fontIncreaseBtn");
  var fontResetBtn = document.getElementById("fontResetBtn");
  var fontSizeLabel = document.getElementById("fontSizeLabel");

  var currentFilter = "all";

  /* ==========================================================
     Helpers
     ========================================================== */

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function uid() {
    return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function formatDate(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch (e) {
      return "";
    }
  }

  /* ==========================================================
     Mobile sidebar drawer
     ========================================================== */

  function openSidebar() {
    praySidebar.classList.add("is-open");
    sidebarOverlay.classList.add("is-open");
  }
  function closeSidebar() {
    praySidebar.classList.remove("is-open");
    sidebarOverlay.classList.remove("is-open");
  }
  sidebarOverlay.addEventListener("click", closeSidebar);

  /* ==========================================================
     Menu button — toggles the text-size toolbar bar, same
     behavior as the Bible reader's Menu button.
     ========================================================== */

  function isPrayToolbarOpen() {
    return !!prayToolbarBar && !prayToolbarBar.hidden;
  }
  function openPrayToolbar() {
    if (!prayToolbarBar) { return; }
    prayToolbarBar.hidden = false;
    if (menuToggle) { menuToggle.setAttribute("aria-expanded", "true"); }
  }
  function closePrayToolbar() {
    if (!prayToolbarBar) { return; }
    prayToolbarBar.hidden = true;
    if (menuToggle) { menuToggle.setAttribute("aria-expanded", "false"); }
  }
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      if (isPrayToolbarOpen()) { closePrayToolbar(); } else { openPrayToolbar(); }
    });
  }

  /* ==========================================================
     Tabs (Prayer Library / My Journal)
     ========================================================== */

  function activateTab(which) {
    var isLibrary = which === "library";
    tabLibraryBtn.classList.toggle("is-active", isLibrary);
    tabJournalBtn.classList.toggle("is-active", !isLibrary);
    tabLibraryBtn.setAttribute("aria-selected", isLibrary ? "true" : "false");
    tabJournalBtn.setAttribute("aria-selected", !isLibrary ? "true" : "false");
    libraryView.classList.toggle("is-hidden", !isLibrary);
    journalView.classList.toggle("is-hidden", isLibrary);
    if (paySectionSelect) { paySectionSelect.value = isLibrary ? "library" : "journal"; }
    closeSidebar();
  }

  tabLibraryBtn.addEventListener("click", function () { activateTab("library"); });
  tabJournalBtn.addEventListener("click", function () { activateTab("journal"); });

  /* Mobile-only dropdown — lists every category-row title (built in
     renderCategoryList below) so a category can be jumped to directly,
     plus "Prayer Library" (the overview) and "My Journal". */
  function renderCategorySelect() {
    if (!paySectionSelect) { return; }
    var html = '<option value="library">Prayer Library</option>';
    LIBRARY.forEach(function (group, idx) {
      html += '<option value="cat-' + idx + '">' + escapeHtml(group.group) + "</option>";
    });
    html += '<option value="journal">My Journal</option>';
    paySectionSelect.innerHTML = html;
  }

  if (paySectionSelect) {
    paySectionSelect.addEventListener("change", function () {
      var value = paySectionSelect.value;
      if (value === "journal") {
        activateTab("journal");
      } else if (value.indexOf("cat-") === 0) {
        var idx = parseInt(value.slice(4), 10);
        activateTab("library");
        if (LIBRARY[idx]) { openCategoryDetail(LIBRARY[idx]); }
      } else {
        activateTab("library");
        closeCategoryDetail();
      }
    });
  }

  /* ==========================================================
     Prayer library — category list + detail
     ========================================================== */

  function renderCategoryList() {
    var html = "";
    LIBRARY.forEach(function (group, idx) {
      html += '<button class="category-row" type="button" data-index="' + idx + '">' +
        '<span class="category-icon">' + (ICONS[group.icon] || "") + "</span>" +
        '<span class="category-info"><h3>' + escapeHtml(group.group) + "</h3><p>" + escapeHtml(group.desc) + "</p></span>" +
        '<span class="category-count">' + group.prayers.length + "</span>" +
        '<span class="category-chevron" aria-hidden="true">&#8250;</span>' +
        "</button>";
    });
    categoryListView.innerHTML = html;

    categoryListView.querySelectorAll(".category-row").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(btn.getAttribute("data-index"), 10);
        openCategoryDetail(LIBRARY[idx]);
        if (paySectionSelect) { paySectionSelect.value = "cat-" + idx; }
      });
    });

    renderCategorySelect();
  }

  function openCategoryDetail(group) {
    detailTitle.textContent = group.group;
    detailSubtitle.textContent = group.desc;

    var html = "";
    group.prayers.forEach(function (p) {
      html += '<div class="prayer-card"><h4>' + escapeHtml(p.title) + "</h4><p>" + escapeHtml(p.text) + "</p></div>";
    });
    detailPrayers.innerHTML = html;

    categoryListView.classList.add("is-hidden");
    categoryDetailView.classList.remove("is-hidden");
    categoryDetailView.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closeCategoryDetail() {
    categoryDetailView.classList.add("is-hidden");
    categoryListView.classList.remove("is-hidden");
    if (paySectionSelect) { paySectionSelect.value = "library"; }
  }

  detailBackBtn.addEventListener("click", closeCategoryDetail);
  if (detailCloseBtn) { detailCloseBtn.addEventListener("click", closeCategoryDetail); }

  /* ==========================================================
     Intro heart toggle (save this verse)
     ========================================================== */

  if (introHeart) {
    introHeart.addEventListener("click", function () {
      var active = introHeart.classList.toggle("is-active");
      introHeart.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  /* ==========================================================
     Journal storage
     ========================================================== */

  function loadJournal() {
    try {
      var raw = window.localStorage.getItem(JOURNAL_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveJournal(entries) {
    try {
      window.localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
    } catch (e) { /* storage unavailable, ignore */ }
  }

  function renderJournal() {
    var entries = loadJournal();
    entries.sort(function (a, b) { return b.createdAt.localeCompare(a.createdAt); });

    var visible = entries.filter(function (e) {
      if (currentFilter === "active") { return !e.answered; }
      if (currentFilter === "answered") { return !!e.answered; }
      return true;
    });

    journalEmpty.hidden = visible.length !== 0;
    if (visible.length === 0) {
      journalList.innerHTML = "";
      return;
    }

    var html = "";
    visible.forEach(function (e) {
      html += '<div class="journal-entry' + (e.answered ? " is-answered" : "") + '" data-id="' + e.id + '">' +
        '<div class="journal-entry-top">' +
        "<div>" +
        '<h3 class="journal-entry-title">' + escapeHtml(e.title) + "</h3>" +
        '<span class="journal-entry-meta">' + escapeHtml(e.category) + " &middot; " + formatDate(e.createdAt) +
        (e.answered ? " &middot; Answered" : "") + "</span>" +
        "</div>" +
        "</div>" +
        '<p class="journal-entry-text">' + escapeHtml(e.text) + "</p>" +
        '<div class="journal-entry-actions">' +
        '<button class="journal-action-btn answer-btn' + (e.answered ? " is-answered" : "") + '" type="button" data-action="toggle-answered" data-id="' + e.id + '">' +
        (e.answered ? "Mark as Praying" : "Mark as Answered") +
        "</button>" +
        '<button class="journal-action-btn delete-btn" type="button" data-action="delete" data-id="' + e.id + '">Delete</button>' +
        "</div>" +
        "</div>";
    });
    journalList.innerHTML = html;
  }

  journalForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var title = journalTitle.value.trim();
    var text = journalText.value.trim();
    if (!title || !text) { return; }

    var entries = loadJournal();
    entries.push({
      id: uid(),
      title: title,
      category: journalCategory.value,
      text: text,
      answered: false,
      createdAt: new Date().toISOString()
    });
    saveJournal(entries);

    journalForm.reset();
    renderJournal();
  });

  journalList.addEventListener("click", function (e) {
    var btn = e.target.closest(".journal-action-btn");
    if (!btn) { return; }
    var id = btn.getAttribute("data-id");
    var action = btn.getAttribute("data-action");
    var entries = loadJournal();

    if (action === "delete") {
      if (!window.confirm("Delete this prayer from your journal?")) { return; }
      entries = entries.filter(function (e) { return e.id !== id; });
    } else if (action === "toggle-answered") {
      entries = entries.map(function (e) {
        if (e.id === id) { e.answered = !e.answered; }
        return e;
      });
    }
    saveJournal(entries);
    renderJournal();
  });

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      currentFilter = btn.getAttribute("data-filter");
      renderJournal();
    });
  });

  /* ==========================================================
     Text size adjuster (shared preference with the Bible reader)
     ========================================================== */

  function clampFontScale(value) {
    return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, value));
  }

  function applyFontScale(scale) {
    scale = clampFontScale(scale);
    document.documentElement.style.setProperty("--reader-font-scale", scale);
    if (fontSizeLabel) { fontSizeLabel.textContent = Math.round(scale * 100) + "%"; }
    if (fontDecreaseBtn) { fontDecreaseBtn.disabled = scale <= FONT_SCALE_MIN; }
    if (fontIncreaseBtn) { fontIncreaseBtn.disabled = scale >= FONT_SCALE_MAX; }
    try { window.localStorage.setItem(FONT_SCALE_KEY, String(scale)); } catch (e) { /* ignore */ }
    return scale;
  }

  function getSavedFontScale() {
    try {
      var saved = parseFloat(window.localStorage.getItem(FONT_SCALE_KEY));
      if (!isNaN(saved)) { return clampFontScale(saved); }
    } catch (e) { /* ignore */ }
    return 1;
  }

  function initFontSizeControl() {
    var currentScale = applyFontScale(getSavedFontScale());
    if (fontIncreaseBtn) {
      fontIncreaseBtn.addEventListener("click", function () { currentScale = applyFontScale(currentScale + FONT_SCALE_STEP); });
    }
    if (fontDecreaseBtn) {
      fontDecreaseBtn.addEventListener("click", function () { currentScale = applyFontScale(currentScale - FONT_SCALE_STEP); });
    }
    if (fontResetBtn) {
      fontResetBtn.addEventListener("click", function () { currentScale = applyFontScale(1); });
    }
  }

  /* ==========================================================
     Fullscreen / distraction-free mode (mobile header button)
     ========================================================== */

  function toggleFullscreen() {
    var isOn = document.documentElement.getAttribute("data-pray-immersive") === "true";
    document.documentElement.setAttribute("data-pray-immersive", isOn ? "false" : "true");
    if (prayerFullscreenToggle) { prayerFullscreenToggle.setAttribute("aria-pressed", isOn ? "false" : "true"); }
    if (!isOn) { closePrayToolbar(); }
  }
  if (prayerFullscreenToggle) {
    prayerFullscreenToggle.addEventListener("click", toggleFullscreen);
  }

  /* ==========================================================
     Mobile prayer search — filters the library by title/text,
     jumps straight to the matching category's detail view.
     ========================================================== */

  var prayerSearchDebounce = null;

  function openPrayerSearch() {
    if (!prayerSearchOverlay) { return; }
    prayerSearchOverlay.classList.add("is-open");
    prayerSearchInput.setAttribute("name", "bs-prayer-search-" + Date.now());
    prayerSearchInput.removeAttribute("readonly");
    prayerSearchInput.focus();
  }
  function closePrayerSearch() {
    if (!prayerSearchOverlay) { return; }
    prayerSearchOverlay.classList.remove("is-open");
    prayerSearchInput.blur();
    prayerSearchInput.setAttribute("readonly", "");
  }

  if (prayerSearchToggle) {
    prayerSearchToggle.addEventListener("click", openPrayerSearch);
    prayerSearchClose.addEventListener("click", closePrayerSearch);
    prayerSearchOverlay.addEventListener("click", function (e) {
      if (e.target === prayerSearchOverlay) { closePrayerSearch(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && prayerSearchOverlay.classList.contains("is-open")) { closePrayerSearch(); }
    });

    prayerSearchInput.addEventListener("input", function () {
      var q = prayerSearchInput.value.trim();
      clearTimeout(prayerSearchDebounce);
      if (q.length < 2) {
        prayerSearchResults.innerHTML = '<p class="search-hint">Type at least 2 letters to search prayers.</p>';
        return;
      }
      prayerSearchDebounce = setTimeout(function () { runPrayerSearch(q); }, 200);
    });
  }

  function runPrayerSearch(query) {
    var q = query.toLowerCase();
    var matches = [];
    LIBRARY.forEach(function (group) {
      var groupTitleMatches = group.group.toLowerCase().indexOf(q) !== -1;
      group.prayers.forEach(function (p) {
        if (groupTitleMatches || p.title.toLowerCase().indexOf(q) !== -1 || p.text.toLowerCase().indexOf(q) !== -1) {
          matches.push({ group: group, prayer: p });
        }
      });
    });

    if (matches.length === 0) {
      prayerSearchResults.innerHTML = '<p class="search-empty">No prayers found for &ldquo;' + escapeHtml(query) + '&rdquo;.</p>';
      return;
    }

    var html = "";
    matches.slice(0, 30).forEach(function (m, i) {
      var snippet = m.prayer.text.replace(/\n/g, " ");
      if (snippet.length > 120) { snippet = snippet.slice(0, 120) + "\u2026"; }
      html += '<button class="search-result" type="button" data-index="' + i + '">' +
        '<span class="result-ref">' + escapeHtml(m.group.group) + '</span>' +
        '<span class="result-snippet">' + escapeHtml(m.prayer.title) + ' \u2014 ' + escapeHtml(snippet) + '</span>' +
        '</button>';
    });
    prayerSearchResults.innerHTML = html;

    prayerSearchResults.querySelectorAll(".search-result").forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        var m = matches[i];
        activateTab("library");
        openCategoryDetail(m.group);
        if (paySectionSelect) { paySectionSelect.value = "cat-" + LIBRARY.indexOf(m.group); }
        closePrayerSearch();
      });
    });
  }

  /* ==========================================================
     Vanta.js waves background
     ========================================================== */

  function initVanta() {
    if (typeof VANTA === "undefined" || !VANTA.WAVES) { return; }
    VANTA.WAVES({
      el: "#vantaBg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x174a73,
      shininess: 32,
      waveHeight: 16,
      waveSpeed: 0.85,
      zoom: 0.85
    });
  }

  /* ==========================================================
     Init
     ========================================================== */

  function init() {
    initFontSizeControl();
    renderCategoryList();
    renderJournal();
    initVanta();
  }

  init();
})();
