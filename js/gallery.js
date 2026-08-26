(function () {
  "use strict";

  /* ==========================================================
     Gallery images — shared with the homepage thumbnail slider
     via js/gallery-data.js (window.GalleryData), so both stay
     in sync from a single source of truth.
     ========================================================== */

  var IMAGES = window.GalleryData ? window.GalleryData.IMAGES : [];

  /* ==========================================================
     DOM refs
     ========================================================== */

  var galleryGrid = document.getElementById("galleryGrid");
  var filterBtns = document.querySelectorAll(".gallery-filter-btn");

  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lightboxClose = document.getElementById("lightboxClose");
  var lightboxPrev = document.getElementById("lightboxPrev");
  var lightboxNext = document.getElementById("lightboxNext");

  var currentIndex = 0;

  /* ==========================================================
     Render grid
     ========================================================== */

  function imgUrl(item) {
    return window.GalleryData ? window.GalleryData.imgUrl(item) : "";
  }

  function renderGrid() {
    var html = "";
    IMAGES.forEach(function (item, idx) {
      html += '<figure class="gallery-item" data-category="' + item.category + '" data-index="' + idx + '">' +
        '<img src="' + imgUrl(item) + '" alt="' + item.caption + '" loading="lazy">' +
        '<figcaption class="gallery-item-caption">' + item.caption + "</figcaption>" +
        "</figure>";
    });
    galleryGrid.innerHTML = html;

    galleryGrid.querySelectorAll(".gallery-item").forEach(function (fig) {
      fig.addEventListener("click", function () {
        openLightbox(parseInt(fig.getAttribute("data-index"), 10));
      });
    });
  }

  /* ==========================================================
     Filtering
     ========================================================== */

  function applyFilter(filter) {
    var items = galleryGrid.querySelectorAll(".gallery-item");
    items.forEach(function (item) {
      var show = filter === "all" || item.getAttribute("data-category") === filter;
      item.classList.toggle("is-hidden", !show);
    });
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      applyFilter(btn.getAttribute("data-filter"));
    });
  });

  /* ==========================================================
     Lightbox
     ========================================================== */

  function openLightbox(idx) {
    currentIndex = idx;
    showCurrent();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function showCurrent() {
    var item = IMAGES[currentIndex];
    lightboxImg.src = imgUrl(item).replace(/\/(\d+)\/(\d+)$/, "/1200/900");
    lightboxImg.alt = item.caption;
    lightboxCaption.textContent = item.caption;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % IMAGES.length;
    showCurrent();
  }
  function showPrev() {
    currentIndex = (currentIndex - 1 + IMAGES.length) % IMAGES.length;
    showCurrent();
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxNext.addEventListener("click", showNext);
  lightboxPrev.addEventListener("click", showPrev);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) { closeLightbox(); }
  });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) { return; }
    if (e.key === "Escape") { closeLightbox(); }
    if (e.key === "ArrowRight") { showNext(); }
    if (e.key === "ArrowLeft") { showPrev(); }
  });

  /* ==========================================================
     Vanta.js clouds background
     ========================================================== */

  function initVanta() {
    if (typeof VANTA === "undefined" || !VANTA.CLOUDS) { return; }
    VANTA.CLOUDS({
      el: "#vantaBg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      skyColor: 0x6fa8c9,
      cloudColor: 0xc7d3da,
      cloudShadowColor: 0x0f2438,
      sunColor: 0xc99a3a,
      sunGlareColor: 0xdfaf45,
      sunlightColor: 0xd9c295,
      speed: 1.1
    });
  }

  /* ==========================================================
     Init
     ========================================================== */

  renderGrid();
  initVanta();
})();
