/* ==========================================================
   Biblia Sacra — Shared Gallery Data
   Single source of truth for gallery images, used by both
   the homepage thumbnail slider (index.html) and the full
   gallery page (gallery.html), so the two stay in sync.
   ========================================================== */

(function () {
  "use strict";

  var IMAGES = [
    { seed: "sunday-worship", w: 600, h: 800, category: "worship", caption: "Sunday Worship Service" },
    { seed: "candle-altar", w: 600, h: 500, category: "worship", caption: "Candlelight at the Altar" },
    { seed: "bible-study-group", w: 600, h: 750, category: "community", caption: "Bible Study Fellowship" },
    { seed: "sunrise-cross", w: 600, h: 700, category: "nature", caption: "Sunrise Over the Cross" },
    { seed: "open-scripture", w: 600, h: 450, category: "scripture", caption: "An Open Bible" },
    { seed: "choir-voices", w: 600, h: 700, category: "worship", caption: "Choir in Praise" },
    { seed: "hands-in-prayer", w: 600, h: 600, category: "community", caption: "Hands Joined in Prayer" },
    { seed: "stained-glass-light", w: 600, h: 800, category: "scripture", caption: "Light Through Stained Glass" },
    { seed: "quiet-chapel", w: 600, h: 450, category: "worship", caption: "A Quiet Chapel" },
    { seed: "mountain-morning", w: 600, h: 650, category: "nature", caption: "Morning on the Mountain" },
    { seed: "rosary-beads", w: 600, h: 500, category: "scripture", caption: "The Rosary" },
    { seed: "family-gathering", w: 600, h: 700, category: "community", caption: "Family Gathering" },
    { seed: "seashore-peace", w: 600, h: 480, category: "nature", caption: "Peace by the Shore" },
    { seed: "old-hymnal", w: 600, h: 600, category: "scripture", caption: "A Well-Worn Hymnal" },
    { seed: "youth-fellowship", w: 600, h: 750, category: "community", caption: "Youth Fellowship Night" },
    { seed: "garden-path-light", w: 600, h: 700, category: "nature", caption: "Garden Path at Dusk" }
  ];

  function imgUrl(item, w, h) {
    return "https://picsum.photos/seed/" + encodeURIComponent(item.seed) + "/" + (w || item.w) + "/" + (h || item.h);
  }

  window.GalleryData = {
    IMAGES: IMAGES,
    imgUrl: imgUrl
  };
})();
