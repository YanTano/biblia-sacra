/* ==========================================================
   Biblia Sacra — Bible Book Manifest
   Maps the local bible/raw/*.json filenames (Douay-Rheims /
   Vulgate naming) to reader-friendly display names, and defines
   the canonical Old Testament / New Testament reading order used
   throughout the Bible Reader (book picker + Previous/Next nav).

   IMPORTANT: this list only *references* the JSON files that ship
   in bible/raw/ — it never invents content. Each entry's `slug`
   is the exact filename (without .json) as found on disk.
   ========================================================== */

(function (global) {
  "use strict";

  // slug            : exact filename in bible/raw/ (without .json)
  // name             : reader-friendly display name shown in the UI
  // original         : the Douay-Rheims / Vulgate short title, shown
  //                    as a small caption so the traditional name
  //                    is never hidden, only clarified
  // testament        : 'ot' | 'nt'
  // group            : used to build <optgroup> sections in the book picker
  var BIBLE_BOOKS = [
    // ---------------- Old Testament ----------------
    { slug: "genesis", name: "Genesis", original: "Genesis", testament: "ot", group: "The Pentateuch" },
    { slug: "exodus", name: "Exodus", original: "Exodus", testament: "ot", group: "The Pentateuch" },
    { slug: "leviticus", name: "Leviticus", original: "Leviticus", testament: "ot", group: "The Pentateuch" },
    { slug: "numbers", name: "Numbers", original: "Numbers", testament: "ot", group: "The Pentateuch" },
    { slug: "deuteronomy", name: "Deuteronomy", original: "Deuteronomy", testament: "ot", group: "The Pentateuch" },

    { slug: "josue", name: "Joshua", original: "Josue", testament: "ot", group: "Historical Books" },
    { slug: "judges", name: "Judges", original: "Judges", testament: "ot", group: "Historical Books" },
    { slug: "ruth", name: "Ruth", original: "Ruth", testament: "ot", group: "Historical Books" },
    { slug: "1-kings", name: "1 Samuel", original: "1 Kings", testament: "ot", group: "Historical Books" },
    { slug: "2-kings", name: "2 Samuel", original: "2 Kings", testament: "ot", group: "Historical Books" },
    { slug: "3-kings", name: "1 Kings", original: "3 Kings", testament: "ot", group: "Historical Books" },
    { slug: "4-kings", name: "2 Kings", original: "4 Kings", testament: "ot", group: "Historical Books" },
    { slug: "1-paralipomenon", name: "1 Chronicles", original: "1 Paralipomenon", testament: "ot", group: "Historical Books" },
    { slug: "2-paralipomenon", name: "2 Chronicles", original: "2 Paralipomenon", testament: "ot", group: "Historical Books" },
    { slug: "1-esdras", name: "Ezra", original: "1 Esdras", testament: "ot", group: "Historical Books" },
    { slug: "2-esdras", name: "Nehemiah", original: "2 Esdras", testament: "ot", group: "Historical Books" },
    { slug: "tobias", name: "Tobit", original: "Tobias", testament: "ot", group: "Historical Books" },
    { slug: "judith", name: "Judith", original: "Judith", testament: "ot", group: "Historical Books" },
    { slug: "esther", name: "Esther", original: "Esther", testament: "ot", group: "Historical Books" },
    { slug: "1-machabees", name: "1 Maccabees", original: "1 Machabees", testament: "ot", group: "Historical Books" },
    { slug: "2-machabees", name: "2 Maccabees", original: "2 Machabees", testament: "ot", group: "Historical Books" },

    { slug: "job", name: "Job", original: "Job", testament: "ot", group: "Wisdom Books" },
    { slug: "psalms", name: "Psalms", original: "Psalms", testament: "ot", group: "Wisdom Books" },
    { slug: "proverbs", name: "Proverbs", original: "Proverbs", testament: "ot", group: "Wisdom Books" },
    { slug: "ecclesiastes", name: "Ecclesiastes", original: "Ecclesiastes", testament: "ot", group: "Wisdom Books" },
    { slug: "canticle-of-canticles", name: "Song of Songs", original: "Canticle of Canticles", testament: "ot", group: "Wisdom Books" },
    { slug: "wisdom", name: "Wisdom", original: "Wisdom", testament: "ot", group: "Wisdom Books" },
    { slug: "ecclesiasticus", name: "Sirach", original: "Ecclesiasticus", testament: "ot", group: "Wisdom Books" },

    { slug: "isaie", name: "Isaiah", original: "Isaie", testament: "ot", group: "Prophetic Books" },
    { slug: "jeremie", name: "Jeremiah", original: "Jeremy", testament: "ot", group: "Prophetic Books" },
    { slug: "lamentations", name: "Lamentations", original: "Lamentations", testament: "ot", group: "Prophetic Books" },
    { slug: "baruch", name: "Baruch", original: "Baruch", testament: "ot", group: "Prophetic Books" },
    { slug: "ezechiel", name: "Ezekiel", original: "Ezechiel", testament: "ot", group: "Prophetic Books" },
    { slug: "daniel", name: "Daniel", original: "Daniel", testament: "ot", group: "Prophetic Books" },
    { slug: "osee", name: "Hosea", original: "Osee", testament: "ot", group: "Prophetic Books" },
    { slug: "joel", name: "Joel", original: "Joel", testament: "ot", group: "Prophetic Books" },
    { slug: "amos", name: "Amos", original: "Amos", testament: "ot", group: "Prophetic Books" },
    { slug: "abdias", name: "Obadiah", original: "Abdias", testament: "ot", group: "Prophetic Books" },
    { slug: "jonas", name: "Jonah", original: "Jonas", testament: "ot", group: "Prophetic Books" },
    { slug: "micheas", name: "Micah", original: "Micheas", testament: "ot", group: "Prophetic Books" },
    { slug: "nahum", name: "Nahum", original: "Nahum", testament: "ot", group: "Prophetic Books" },
    { slug: "habacuc", name: "Habakkuk", original: "Habacuc", testament: "ot", group: "Prophetic Books" },
    { slug: "sophonias", name: "Zephaniah", original: "Sophonias", testament: "ot", group: "Prophetic Books" },
    { slug: "aggeus", name: "Haggai", original: "Aggeus", testament: "ot", group: "Prophetic Books" },
    { slug: "zacharias", name: "Zechariah", original: "Zacharias", testament: "ot", group: "Prophetic Books" },
    { slug: "malachie", name: "Malachi", original: "Malachie", testament: "ot", group: "Prophetic Books" },

    { slug: "3-esdras", name: "3 Esdras", original: "3 Esdras", testament: "ot", group: "Appendix" },
    { slug: "4-esdras", name: "4 Esdras", original: "4 Esdras", testament: "ot", group: "Appendix" },
    { slug: "prayer-of-manasses", name: "Prayer of Manasseh", original: "Prayer of Manasses", testament: "ot", group: "Appendix" },

    // ---------------- New Testament ----------------
    { slug: "matthew", name: "Matthew", original: "Matthew", testament: "nt", group: "The Gospels" },
    { slug: "mark", name: "Mark", original: "Mark", testament: "nt", group: "The Gospels" },
    { slug: "luke", name: "Luke", original: "Luke", testament: "nt", group: "The Gospels" },
    { slug: "john", name: "John", original: "John", testament: "nt", group: "The Gospels" },

    { slug: "acts", name: "Acts of the Apostles", original: "Acts", testament: "nt", group: "History" },

    { slug: "romans", name: "Romans", original: "Romans", testament: "nt", group: "Pauline Epistles" },
    { slug: "1-corinthians", name: "1 Corinthians", original: "1 Corinthians", testament: "nt", group: "Pauline Epistles" },
    { slug: "2-corinthians", name: "2 Corinthians", original: "2 Corinthians", testament: "nt", group: "Pauline Epistles" },
    { slug: "galatians", name: "Galatians", original: "Galatians", testament: "nt", group: "Pauline Epistles" },
    { slug: "ephesians", name: "Ephesians", original: "Ephesians", testament: "nt", group: "Pauline Epistles" },
    { slug: "philippians", name: "Philippians", original: "Philippians", testament: "nt", group: "Pauline Epistles" },
    { slug: "colossians", name: "Colossians", original: "Colossians", testament: "nt", group: "Pauline Epistles" },
    { slug: "1-thessalonians", name: "1 Thessalonians", original: "1 Thessalonians", testament: "nt", group: "Pauline Epistles" },
    { slug: "2-thessalonians", name: "2 Thessalonians", original: "2 Thessalonians", testament: "nt", group: "Pauline Epistles" },
    { slug: "1-timothy", name: "1 Timothy", original: "1 Timothy", testament: "nt", group: "Pauline Epistles" },
    { slug: "2-timothy", name: "2 Timothy", original: "2 Timothy", testament: "nt", group: "Pauline Epistles" },
    { slug: "titus", name: "Titus", original: "Titus", testament: "nt", group: "Pauline Epistles" },
    { slug: "philemon", name: "Philemon", original: "Philemon", testament: "nt", group: "Pauline Epistles" },
    { slug: "hebrews", name: "Hebrews", original: "Hebrews", testament: "nt", group: "Pauline Epistles" },

    { slug: "james", name: "James", original: "James", testament: "nt", group: "Catholic Epistles" },
    { slug: "1-peter", name: "1 Peter", original: "1 Peter", testament: "nt", group: "Catholic Epistles" },
    { slug: "2-peter", name: "2 Peter", original: "2 Peter", testament: "nt", group: "Catholic Epistles" },
    { slug: "1-john", name: "1 John", original: "1 John", testament: "nt", group: "Catholic Epistles" },
    { slug: "2-john", name: "2 John", original: "2 John", testament: "nt", group: "Catholic Epistles" },
    { slug: "3-john", name: "3 John", original: "3 John", testament: "nt", group: "Catholic Epistles" },
    { slug: "jude", name: "Jude", original: "Jude", testament: "nt", group: "Catholic Epistles" },

    { slug: "apocalypse", name: "Revelation", original: "Apocalypse", testament: "nt", group: "Apocalypse" }
  ];

  var BOOKS_BY_SLUG = {};
  BIBLE_BOOKS.forEach(function (b, i) {
    b.index = i;
    BOOKS_BY_SLUG[b.slug] = b;
  });

  global.BIBLE_BOOKS = BIBLE_BOOKS;
  global.BOOKS_BY_SLUG = BOOKS_BY_SLUG;
})(window);
