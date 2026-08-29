(function () {
  "use strict";

  /* ==========================================================
     Devotion content model
     ----------------------------------------------------------
     Each devotion follows this shape:
     {
       date,               // "YYYY-MM-DD" or null (pool item, used on rotation)
       title,
       scriptureReference,
       verse,
       translation,
       reading: { reference, summary },
       reflection: [ paragraph, paragraph, ... ],
       takeaway,
       prayer,
       questions: [ q, q, q ],
       action,
       relatedScriptures: [ { reference, book, chapter, verse }, ... ],
       bibleLink: { book, chapter, verse }
     }

     To add a devotion for a specific calendar date, give it a
     "date" of "YYYY-MM-DD" — it will be shown automatically on
     that day and take priority over the rotating pool below.
     ========================================================== */

  var DEVOTIONS = [
    {
      date: null,
      title: "Peace Beyond Understanding",
      scriptureReference: "Philippians 4:6-7",
      verse: "Be nothing careful: but in every thing by prayer and supplication with thanks-giving let your petitions be known with God. And the peace of God which passeth all understanding, keep your hearts and intelligences in Christ Jesus.",
      translation: "Douay-Rheims",
      reading: {
        reference: "Philippians 4:4-9",
        summary: "Paul closes his letter to the Philippians with practical instruction for anxious hearts: rejoice always, let your gentleness be known to all, bring every care to God in prayer, and fix your thoughts on whatever is true, honest, and just."
      },
      reflection: [
        "Anxiety has a way of convincing us that if we just think hard enough, we can solve everything ourselves. Paul writes to the Philippians from a prison cell, yet he doesn't tell them to stop feeling burdened \u2014 he tells them where to bring it.",
        "Prayer with thanksgiving is the posture Paul recommends: not a bare list of complaints, but requests wrapped in gratitude for what God has already done. Thanksgiving doesn't deny the difficulty; it simply refuses to let the difficulty have the last word.",
        "What follows is remarkable \u2014 not the removal of the problem, but a peace that \u201cpasseth all understanding.\u201d It's a peace that doesn't require the circumstances to make sense; it only requires trust to hold on."
      ],
      takeaway: "The peace of God doesn't wait for your problem to be solved \u2014 it stands guard over your heart while you wait.",
      prayer: "Lord, I bring You what I've been carrying alone. Thank You for the ways You have already provided. Guard my heart and mind with a peace I cannot manufacture myself. Amen.",
      questions: [
        "What worry have you been carrying instead of bringing to God in prayer?",
        "What is one thing you can thank God for today, even in the middle of difficulty?",
        "What would it look like to let God's peace guard your heart this week?"
      ],
      action: "Write down one worry on paper, turn it into a short prayer, and thank God for one specific blessing before you close your eyes tonight.",
      relatedScriptures: [
        { reference: "Josue 1:9", book: "josue", chapter: 1, verse: 9 },
        { reference: "Proverbs 3:5-6", book: "proverbs", chapter: 3, verse: 5 },
        { reference: "Psalms 22:1", book: "psalms", chapter: 22, verse: 1 },
        { reference: "Matthew 11:28", book: "matthew", chapter: 11, verse: 28 }
      ],
      bibleLink: { book: "philippians", chapter: 4, verse: 6 }
    },
    {
      date: null,
      title: "Take Courage",
      scriptureReference: "Josue 1:9",
      verse: "Behold I command thee, take courage, and be strong. Fear not, and dread not: because the Lord thy God is with thee in all the things to whatsoever thou shalt go.",
      translation: "Douay-Rheims",
      reading: {
        reference: "Josue 1:1-9",
        summary: "As Moses' successor, Josue receives God's charge to lead Israel into the promised land, backed by a repeated command: be strong, be courageous, for the Lord goes with him wherever he goes."
      },
      reflection: [
        "Josue inherited a mission he never asked for \u2014 leading a nation into unfamiliar territory after the death of Moses. God's first instruction isn't a strategy; it's a command to be strong and to fear not.",
        "Courage in Scripture is rarely the absence of fear. It's the decision to keep moving because of who is present, not because the danger has disappeared. God doesn't tell Josue the obstacles are gone \u2014 He tells him he isn't walking in alone.",
        "\u201cBecause the Lord thy God is with thee\u201d is the hinge on which the whole verse turns. Take that promise away and courage becomes wishful thinking. Keep it, and courage becomes obedience."
      ],
      takeaway: "Courage isn't the absence of fear \u2014 it's remembering Who goes with you into it.",
      prayer: "Lord, give me courage for what lies ahead today. Where I am afraid, remind me that You go before me and beside me. Amen.",
      questions: [
        "What is one situation today where you need to \u201ctake courage\u201d instead of shrinking back?",
        "Where have you seen God's presence in a difficult season before?",
        "What would change if you truly believed God was with you in this moment?"
      ],
      action: "Name one task you've been avoiding out of fear, and take the first small step toward it today.",
      relatedScriptures: [
        { reference: "Philippians 4:6-7", book: "philippians", chapter: 4, verse: 6 },
        { reference: "Psalms 22:1", book: "psalms", chapter: 22, verse: 1 },
        { reference: "Jeremie 29:11", book: "jeremie", chapter: 29, verse: 11 }
      ],
      bibleLink: { book: "josue", chapter: 1, verse: 9 }
    },
    {
      date: null,
      title: "Trust Without Leaning",
      scriptureReference: "Proverbs 3:5-6",
      verse: "Have confidence in our Lord with all thy heart and lean not upon thine own prudence. In all thy ways think on him, and he will direct thy steps.",
      translation: "Douay-Rheims",
      reading: {
        reference: "Proverbs 3:5-12",
        summary: "Solomon's instruction calls the reader to trust God fully rather than lean on personal understanding, to honor Him with the first of everything, and to receive His correction as a sign of fatherly love."
      },
      reflection: [
        "\u201cLean not upon thine own prudence\u201d is a hard word for anyone who prides themselves on figuring things out. Solomon isn't condemning wisdom \u2014 he's condemning self-sufficiency dressed up as wisdom.",
        "Trusting with \u201call thy heart\u201d means trust isn't a backup plan for when our own understanding runs out. It's the starting posture, offered before we've worked out all the details.",
        "The promise attached to that trust is directional, not explanatory: God will direct your steps. He doesn't promise to explain every turn in advance \u2014 only to guide the next one, and the one after that."
      ],
      takeaway: "Trusting God isn't the last resort after your own plans fail \u2014 it's the first step before you take any.",
      prayer: "Lord, I don't want to lean only on what I can figure out. In all my ways today, help me think on You, and direct my steps according to Your will. Amen.",
      questions: [
        "In what area of your life are you leaning more on your own understanding than on God?",
        "What would it look like to \u201cacknowledge Him\u201d in a decision you're facing today?",
        "What's one step you can take in trust rather than certainty?"
      ],
      action: "Before making a decision today, pause and pray for direction instead of relying only on your own reasoning.",
      relatedScriptures: [
        { reference: "Jeremie 29:11", book: "jeremie", chapter: 29, verse: 11 },
        { reference: "Josue 1:9", book: "josue", chapter: 1, verse: 9 },
        { reference: "Matthew 11:28", book: "matthew", chapter: 11, verse: 28 }
      ],
      bibleLink: { book: "proverbs", chapter: 3, verse: 5 }
    },
    {
      date: null,
      title: "A Future of Hope",
      scriptureReference: "Jeremie 29:11",
      verse: "For I know the cogitations, that I intend upon you, saith our Lord, cogitations of peace, and not of affliction, to give you an end and patience.",
      translation: "Douay-Rheims",
      reading: {
        reference: "Jeremie 29:4-14",
        summary: "Writing to the exiles in Babylon, the prophet Jeremie relays God's instruction to settle in, seek the welfare of the city, and trust the plans of peace God has for their future."
      },
      reflection: [
        "These words were written to exiles \u2014 a people displaced from home, uncertain whether they'd ever see it again. God's promise of a future wasn't a denial of their present hardship; it was a word spoken into the middle of it.",
        "\u201cCogitations of peace, and not of affliction\u201d describes the heart behind God's plans, even when the road there runs through seasons that don't feel peaceful at all.",
        "Hope, in this verse, isn't wishful optimism. It's confidence rooted in the character of the One who holds the future, even when we can't see the whole plan ourselves."
      ],
      takeaway: "God's plans for you were formed before your circumstances were, and they don't end where your hardship does.",
      prayer: "Lord, when the present feels uncertain, remind me that You hold my future. Give me patience to wait on Your plan of peace. Amen.",
      questions: [
        "What present circumstance makes it hard to believe God has a good plan for you?",
        "How has God shown faithfulness to you in a past season of waiting?",
        "What would it mean to trust God's timing rather than your own?"
      ],
      action: "Write one sentence describing the future you're hoping for, and hand it to God in prayer today.",
      relatedScriptures: [
        { reference: "Proverbs 3:5-6", book: "proverbs", chapter: 3, verse: 5 },
        { reference: "Philippians 4:6-7", book: "philippians", chapter: 4, verse: 6 },
        { reference: "Psalms 22:1", book: "psalms", chapter: 22, verse: 1 }
      ],
      bibleLink: { book: "jeremie", chapter: 29, verse: 11 }
    },
    {
      date: null,
      title: "The Lord Who Leads",
      scriptureReference: "Psalms 22:1-3",
      verse: "Our Lord ruleth me, and nothing shall be wanting to me: in place of pasture there he hath placed me. Upon the water of refection he hath brought me up: he hath converted my soul. He hath conducted me upon the paths of justice, for his name.",
      translation: "Douay-Rheims",
      reading: {
        reference: "Psalms 22 (Douay)",
        summary: "David's psalm pictures the Lord as a shepherd who provides rest, guidance, and protection even through the darkest valley, and prepares a table of provision in the presence of one's enemies."
      },
      reflection: [
        "The image of a shepherd would have been immediately familiar to David's first readers \u2014 a shepherd who doesn't just herd from behind but leads from ahead, choosing the path.",
        "\u201cNothing shall be wanting to me\u201d isn't a claim that life will be free of difficulty; the rest of the psalm speaks plainly about dark valleys. It's a claim about sufficiency \u2014 that under this Shepherd's care, nothing essential will be missing.",
        "Being led \u201cupon the paths of justice, for his name\u201d reminds us that God's guidance isn't random. It has a character and a purpose that reflects who He is."
      ],
      takeaway: "A well-led sheep doesn't need to know the whole path \u2014 only the Shepherd walking ahead of it.",
      prayer: "Lord, be my shepherd today. Lead me to what I need, and guide my steps along paths that honor Your name. Amen.",
      questions: [
        "In what area of life do you need to trust God's leading rather than your own map?",
        "What does \u201cnothing shall be wanting\u201d mean to you in your current season?",
        "How can you follow God's lead more closely today?"
      ],
      action: "Spend five quiet minutes today simply asking God to lead your next decision, then listen before you act.",
      relatedScriptures: [
        { reference: "Proverbs 3:5-6", book: "proverbs", chapter: 3, verse: 5 },
        { reference: "Josue 1:9", book: "josue", chapter: 1, verse: 9 },
        { reference: "Matthew 11:28", book: "matthew", chapter: 11, verse: 28 }
      ],
      bibleLink: { book: "psalms", chapter: 22, verse: 1 }
    },
    {
      date: null,
      title: "Come and Rest",
      scriptureReference: "Matthew 11:28-30",
      verse: "Come ye to me all that labour, and are burdened, and I will refresh you. Take up my yoke upon you, and learn of me, because I am meek, and humble of heart: and you shall find rest to your souls. For my yoke is sweet, and my burden light.",
      translation: "Douay-Rheims",
      reading: {
        reference: "Matthew 11:25-30",
        summary: "Jesus thanks the Father for revealing truth to the humble, then extends His gentle invitation to all who are weary: come to Him, take His yoke, and find rest for their souls."
      },
      reflection: [
        "Jesus doesn't invite the put-together and the unburdened \u2014 He calls those who \u201clabour, and are burdened.\u201d The invitation itself is a form of grace: rest is offered before it's earned.",
        "A yoke is a tool for shared work, not solitary struggle. Taking Christ's yoke means learning to carry life's weight paired with Him, not alone under it.",
        "The promise that His \u201cyoke is sweet, and burden light\u201d doesn't erase responsibility \u2014 it changes who's bearing the greater share of the weight."
      ],
      takeaway: "Rest, in Christ's invitation, isn't the absence of a yoke \u2014 it's sharing the weight with the right one.",
      prayer: "Lord Jesus, I come to You tired and burdened. Teach me to walk in step with You, and give my soul the rest it's looking for. Amen.",
      questions: [
        "What burden are you still trying to carry alone?",
        "What would it look like to take Christ's \u201cyoke\u201d instead of carrying this on your own?",
        "Where do you most need rest for your soul right now?"
      ],
      action: "Name one burden out loud in prayer today and consciously hand it over, instead of carrying it silently.",
      relatedScriptures: [
        { reference: "Philippians 4:6-7", book: "philippians", chapter: 4, verse: 6 },
        { reference: "Jeremie 29:11", book: "jeremie", chapter: 29, verse: 11 },
        { reference: "Psalms 22:1", book: "psalms", chapter: 22, verse: 1 }
      ],
      bibleLink: { book: "matthew", chapter: 11, verse: 28 }
    }
  ];

  /* ==========================================================
     Date helpers
     ========================================================== */

  function toDateKey(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  // The devotion "day" always follows Philippine Time (Asia/Manila, UTC+8),
  // regardless of the visitor's own device timezone, so everyone sees the
  // same devotion change over at the same moment (midnight in Cebu).
  var PH_TIME_ZONE = "Asia/Manila";

  function getManilaDateKey(date) {
    try {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone: PH_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(date || new Date());
    } catch (e) {
      // Fallback if Intl/timeZone isn't supported: use local date.
      return toDateKey(date || new Date());
    }
  }

  function manilaKeyToDate(key) {
    var parts = key.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function todayInManila() {
    return manilaKeyToDate(getManilaDateKey());
  }

  function startOfDay(d) {
    var copy = new Date(d.getTime());
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  function dayIndex(d) {
    // Days since a fixed epoch, used to pick a stable rotating pool item.
    var epoch = new Date(2024, 0, 1);
    var ms = startOfDay(d).getTime() - startOfDay(epoch).getTime();
    return Math.floor(ms / 86400000);
  }

  function formatDisplayDate(d) {
    try {
      return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    } catch (e) {
      return d.toDateString();
    }
  }

  function resolveDevotion(d) {
    var key = toDateKey(d);
    var exact = DEVOTIONS.find(function (dev) { return dev.date === key; });
    if (exact) { return exact; }

    var pool = DEVOTIONS.filter(function (dev) { return !dev.date; });
    if (!pool.length) { return DEVOTIONS[0]; }
    var idx = ((dayIndex(d) % pool.length) + pool.length) % pool.length;
    return pool[idx];
  }

  /* ==========================================================
     State
     ========================================================== */

  var today = todayInManila();
  var viewedDate = todayInManila();

  /* ==========================================================
     DOM refs
     ========================================================== */

  var devotionDateEl = document.getElementById("devotionDate");
  var devotionTitleEl = document.getElementById("devotionTitle");

  var verseTextEl = document.getElementById("verseText");
  var verseReferenceEl = document.getElementById("verseReference");
  var verseTranslationEl = document.getElementById("verseTranslation");
  var readScriptureLink = document.getElementById("readScriptureLink");

  var readingReferenceEl = document.getElementById("readingReference");
  var readingSummaryEl = document.getElementById("readingSummary");
  var readPassageLink = document.getElementById("readPassageLink");

  var reflectionBodyEl = document.getElementById("reflectionBody");
  var takeawayTextEl = document.getElementById("takeawayText");
  var prayerTextEl = document.getElementById("prayerText");
  var reflectListEl = document.getElementById("reflectList");
  var actionTextEl = document.getElementById("actionText");
  var relatedGridEl = document.getElementById("relatedGrid");

  var shareBtn = document.getElementById("shareBtn");
  var copyAllBtn = document.getElementById("copyAllBtn");
  var verseCardCopyBtn = document.getElementById("verseCardCopyBtn");
  var printBtn = document.getElementById("printBtn");
  var toolbarStatus = document.getElementById("toolbarStatus");

  var fontDecreaseBtn = document.getElementById("fontDecreaseBtn");
  var fontIncreaseBtn = document.getElementById("fontIncreaseBtn");
  var resetFontBtn = document.getElementById("resetFontBtn");
  var fontSizeSlider = document.getElementById("fontSizeSlider");
  var fontSizeLabel = document.getElementById("fontSizeLabel");
  var devotionContainerEl = document.querySelector(".devotion-container");

  var radialMenuToggle = document.getElementById("radialMenuToggle");

  var prevDevotionBtn = document.getElementById("prevDevotionBtn");
  var todayDevotionBtn = document.getElementById("todayDevotionBtn");
  var nextDevotionBtn = document.getElementById("nextDevotionBtn");

  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primaryNav");
  var siteHeader = document.getElementById("siteHeader");

  var currentDevotion = null;
  var statusTimer = null;

  /* ==========================================================
     Helpers
     ========================================================== */

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function bibleUrl(link) {
    var params = new URLSearchParams();
    params.set("book", link.book);
    params.set("chapter", link.chapter);
    if (link.verse) { params.set("verse", link.verse); }
    return "bible.html?" + params.toString();
  }

  function announce(message) {
    if (!toolbarStatus) { return; }
    toolbarStatus.textContent = message;
    if (statusTimer) { clearTimeout(statusTimer); }
    statusTimer = setTimeout(function () { toolbarStatus.textContent = ""; }, 4000);
  }

  /* ==========================================================
     Render
     ========================================================== */

  function render() {
    currentDevotion = resolveDevotion(viewedDate);
    var dev = currentDevotion;

    devotionDateEl.textContent = formatDisplayDate(viewedDate);
    devotionDateEl.setAttribute("datetime", toDateKey(viewedDate));
    devotionTitleEl.textContent = dev.title;
    document.title = "Biblia Sacra \u2014 Daily Devotion: " + dev.title;

    verseTextEl.textContent = "\u201c" + dev.verse + "\u201d";
    verseReferenceEl.textContent = dev.scriptureReference;
    verseTranslationEl.textContent = dev.translation;
    readScriptureLink.href = bibleUrl(dev.bibleLink);

    readingReferenceEl.textContent = dev.reading.reference;
    readingSummaryEl.textContent = dev.reading.summary;
    readPassageLink.href = bibleUrl(dev.bibleLink);

    reflectionBodyEl.innerHTML = dev.reflection.map(function (p) {
      return "<p>" + escapeHtml(p) + "</p>";
    }).join("");

    takeawayTextEl.textContent = dev.takeaway;
    prayerTextEl.textContent = dev.prayer;

    reflectListEl.innerHTML = dev.questions.map(function (q) {
      return "<li>" + escapeHtml(q) + "</li>";
    }).join("");

    actionTextEl.textContent = dev.action;

    relatedGridEl.innerHTML = dev.relatedScriptures.map(function (rs) {
      return '<a class="related-card" href="' + bibleUrl(rs) + '">' +
        '<span class="related-card-ref">' + escapeHtml(rs.reference) + "</span>" +
        '<span class="related-card-cta">Read passage <span aria-hidden="true">&#8594;</span></span>' +
        "</a>";
    }).join("");

    var isToday = toDateKey(viewedDate) === toDateKey(today);
    nextDevotionBtn.disabled = isToday;
    todayDevotionBtn.disabled = isToday;
  }

  /* ==========================================================
     Devotion navigation
     ========================================================== */

  function shiftDay(delta) {
    var d = new Date(viewedDate.getTime());
    d.setDate(d.getDate() + delta);
    if (d.getTime() > today.getTime()) { d = new Date(today.getTime()); }
    viewedDate = startOfDay(d);
    render();
  }

  prevDevotionBtn.addEventListener("click", function () { shiftDay(-1); });
  nextDevotionBtn.addEventListener("click", function () { shiftDay(1); });
  todayDevotionBtn.addEventListener("click", function () {
    today = todayInManila();
    viewedDate = todayInManila();
    render();
  });

  // If the page is left open across midnight in Manila, roll the
  // devotion over automatically without requiring a manual refresh
  // — but only while the visitor is looking at "today", so it never
  // yanks them away from a devotion they navigated back to on purpose.
  setInterval(function () {
    var wasOnToday = toDateKey(viewedDate) === toDateKey(today);
    var freshToday = todayInManila();
    if (toDateKey(freshToday) !== toDateKey(today)) {
      today = freshToday;
      if (wasOnToday) {
        viewedDate = todayInManila();
        render();
      }
    }
  }, 60000);

  /* ==========================================================
     Radial menu helpers
     ========================================================== */

  function closeRadialMenu() {
    if (radialMenuToggle) { radialMenuToggle.checked = false; }
  }

  /* ==========================================================
     Copy verse / copy all
     ========================================================== */

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  if (copyAllBtn) {
    copyAllBtn.addEventListener("click", function () {
      copyAllToClipboard();
      closeRadialMenu();
    });
  }

  if (verseCardCopyBtn) {
    verseCardCopyBtn.addEventListener("click", function () {
      copyVerseToClipboard();
    });
  }

  function copyVerseToClipboard() {
    var text = "\u201c" + currentDevotion.verse + "\u201d \u2014 " + currentDevotion.scriptureReference + " (" + currentDevotion.translation + ")";
    copyText(text).then(function () {
      announce("Verse copied to clipboard.");
    }).catch(function () {
      announce("Could not copy automatically \u2014 please copy the verse manually.");
    });
  }

  function copyAllToClipboard() {
    var dev = currentDevotion;
    var lines = [];
    lines.push(dev.title);
    lines.push("");
    lines.push("\u201c" + dev.verse + "\u201d \u2014 " + dev.scriptureReference + " (" + dev.translation + ")");
    lines.push("");
    lines.push("Today's Reading: " + dev.reading.reference);
    lines.push(dev.reading.summary);
    lines.push("");
    lines.push("Reflection:");
    dev.reflection.forEach(function (p) { lines.push(p); });
    lines.push("");
    lines.push("Key Takeaway: " + dev.takeaway);
    lines.push("");
    lines.push("Prayer: " + dev.prayer);
    lines.push("");
    lines.push("Reflect:");
    dev.questions.forEach(function (q, i) { lines.push((i + 1) + ". " + q); });
    lines.push("");
    lines.push("Today's Action: " + dev.action);
    var text = lines.join("\n");
    copyText(text).then(function () {
      announce("Devotion copied to clipboard.");
    }).catch(function () {
      announce("Could not copy automatically \u2014 please copy the text manually.");
    });
  }

  /* ==========================================================
     Share
     ========================================================== */

  shareBtn.addEventListener("click", function () {
    var shareData = {
      title: "Biblia Sacra \u2014 " + currentDevotion.title,
      text: "\u201c" + currentDevotion.verse + "\u201d \u2014 " + currentDevotion.scriptureReference,
      url: window.location.href
    };
    if (navigator.share) {
      navigator.share(shareData).catch(function () { /* user cancelled, ignore */ });
      closeRadialMenu();
      return;
    }
    copyText(shareData.text + "\n" + shareData.url).then(function () {
      announce("Sharing isn't available here \u2014 link copied instead.");
    }).catch(function () {
      announce("Could not share or copy automatically.");
    });
    closeRadialMenu();
  });

  /* ==========================================================
     Print
     ========================================================== */

  printBtn.addEventListener("click", function () {
    window.print();
    closeRadialMenu();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeRadialMenu(); }
  });

  /* ==========================================================
     Font size control
     ========================================================== */

  var FONT_SCALE_KEY = "bibliaSacraDevotionFontScale";
  var FONT_STEPS = [0.85, 0.925, 1, 1.1, 1.2];
  var FONT_LABELS = ["Smallest", "Small", "Default", "Large", "Largest"];
  var fontStepIndex = 2;

  function loadFontStepIndex() {
    try {
      var raw = window.localStorage.getItem(FONT_SCALE_KEY);
      var idx = raw !== null ? parseInt(raw, 10) : 2;
      if (isNaN(idx) || idx < 0 || idx >= FONT_STEPS.length) { return 2; }
      return idx;
    } catch (e) {
      return 2;
    }
  }

  function saveFontStepIndex(idx) {
    try { window.localStorage.setItem(FONT_SCALE_KEY, String(idx)); } catch (e) { /* ignore */ }
  }

  function applyFontStep(idx, skipSave) {
    fontStepIndex = Math.max(0, Math.min(FONT_STEPS.length - 1, idx));
    if (devotionContainerEl) {
      devotionContainerEl.style.setProperty("--devotion-font-scale", FONT_STEPS[fontStepIndex]);
    }
    if (fontSizeSlider) {
      fontSizeSlider.value = fontStepIndex;
      fontSizeSlider.setAttribute("aria-valuetext", FONT_LABELS[fontStepIndex] + " text size");
    }
    if (fontSizeLabel) { fontSizeLabel.textContent = FONT_LABELS[fontStepIndex]; }
    if (fontDecreaseBtn) { fontDecreaseBtn.disabled = fontStepIndex === 0; }
    if (fontIncreaseBtn) { fontIncreaseBtn.disabled = fontStepIndex === FONT_STEPS.length - 1; }
    if (!skipSave) { saveFontStepIndex(fontStepIndex); }
  }

  if (fontDecreaseBtn) {
    fontDecreaseBtn.addEventListener("click", function () { applyFontStep(fontStepIndex - 1); });
  }
  if (fontIncreaseBtn) {
    fontIncreaseBtn.addEventListener("click", function () { applyFontStep(fontStepIndex + 1); });
  }
  if (resetFontBtn) {
    resetFontBtn.addEventListener("click", function () {
      applyFontStep(2);
      closeRadialMenu();
      announce("Text size reset to default.");
    });
  }
  if (fontSizeSlider) {
    fontSizeSlider.addEventListener("input", function () {
      applyFontStep(parseInt(fontSizeSlider.value, 10));
    });
  }

  applyFontStep(loadFontStepIndex(), true);

  /* ==========================================================
     Mobile nav toggle (self-contained, safe on this page)
     ========================================================== */

  function onScroll() {
    if (window.scrollY > 8) {
      siteHeader.classList.add("is-scrolled");
    } else {
      siteHeader.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener("click", function () {
    var isOpen = primaryNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  primaryNav.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      primaryNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    });
  });

  /* ==========================================================
     Init
     ========================================================== */

  render();
})();
