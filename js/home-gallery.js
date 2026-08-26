/* ==========================================================
   Biblia Sacra — Homepage Gallery Thumbnail Slider
   Images are pulled from js/gallery-data.js so the homepage
   preview always stays in sync with the full Gallery page.
   Autostarts, pauses on hover/focus/touch and when the tab
   is hidden, and respects prefers-reduced-motion.
   ========================================================== */

(function () {
  "use strict";

  var slider = document.getElementById("homeGallerySlider");
  if (!slider || !window.GalleryData) { return; }

  var IMAGES = window.GalleryData.IMAGES;
  var imgUrl = window.GalleryData.imgUrl;

  var viewport = document.getElementById("sliderViewport");
  var thumbsHost = document.getElementById("sliderThumbs");
  var prevBtn = document.getElementById("sliderPrev");
  var nextBtn = document.getElementById("sliderNext");

  if (!viewport || !thumbsHost || !IMAGES.length) { return; }

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var AUTOPLAY_MS = 4500;
  var RESUME_DELAY_MS = 7000;

  var currentIndex = 0;
  var autoplayTimer = null;
  var resumeTimer = null;
  var isHovering = false;

  /* ---------------- Build slides ---------------- */

  var slideEls = [];
  var thumbEls = [];

  IMAGES.forEach(function (item, idx) {
    var slide = document.createElement("figure");
    slide.className = "gallery-slide" + (idx === 0 ? " is-active" : "");
    slide.setAttribute("data-index", idx);

    var img = document.createElement("img");
    img.src = imgUrl(item, 900, 700);
    img.alt = item.caption;
    img.loading = idx === 0 ? "eager" : "lazy";
    slide.appendChild(img);

    var caption = document.createElement("figcaption");
    caption.className = "gallery-slide-caption";
    caption.textContent = item.caption;
    slide.appendChild(caption);

    viewport.appendChild(slide);
    slideEls.push(slide);

    var thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "gallery-thumb" + (idx === 0 ? " is-active" : "");
    thumb.setAttribute("role", "tab");
    thumb.setAttribute("aria-label", item.caption);
    thumb.setAttribute("aria-selected", idx === 0 ? "true" : "false");
    thumb.setAttribute("data-index", idx);

    var thumbImg = document.createElement("img");
    thumbImg.src = imgUrl(item, 120, 120);
    thumbImg.alt = "";
    thumbImg.loading = "lazy";
    thumb.appendChild(thumbImg);

    thumb.addEventListener("click", function () {
      goTo(idx);
      restartAutoplay();
    });

    thumbsHost.appendChild(thumb);
    thumbEls.push(thumb);
  });

  /* ---------------- Navigation ---------------- */

  function goTo(idx, instant) {
    currentIndex = (idx + IMAGES.length) % IMAGES.length;

    slideEls.forEach(function (el, i) {
      el.classList.toggle("is-active", i === currentIndex);
    });
    thumbEls.forEach(function (el, i) {
      var active = i === currentIndex;
      el.classList.toggle("is-active", active);
      el.setAttribute("aria-selected", active ? "true" : "false");
    });

    var activeThumb = thumbEls[currentIndex];
    scrollThumbIntoView(activeThumb, instant);
  }

  /* Horizontal-only scroll of the thumb strip — never touches page scroll. */
  function scrollThumbIntoView(thumb, instant) {
    if (!thumb) { return; }
    var target = thumb.offsetLeft - (thumbsHost.clientWidth - thumb.clientWidth) / 2;
    thumbsHost.scrollTo({ left: Math.max(target, 0), behavior: instant ? "auto" : "smooth" });
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  prevBtn.addEventListener("click", function () { prev(); restartAutoplay(); });
  nextBtn.addEventListener("click", function () { next(); restartAutoplay(); });

  /* ---------------- Autoplay (autostart) ---------------- */

  function startAutoplay() {
    if (reducedMotion) { return; }
    stopAutoplay();
    autoplayTimer = window.setInterval(function () {
      if (!isHovering && !document.hidden) { next(); }
    }, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function restartAutoplay() {
    // Brief pause after manual interaction, then resume autostart.
    stopAutoplay();
    if (resumeTimer) { window.clearTimeout(resumeTimer); }
    if (reducedMotion) { return; }
    resumeTimer = window.setTimeout(startAutoplay, RESUME_DELAY_MS);
  }

  slider.addEventListener("mouseenter", function () { isHovering = true; });
  slider.addEventListener("mouseleave", function () { isHovering = false; });
  slider.addEventListener("focusin", function () { isHovering = true; });
  slider.addEventListener("focusout", function () { isHovering = false; });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stopAutoplay();
    } else if (!reducedMotion) {
      startAutoplay();
    }
  });

  /* ---------------- Drag-to-scroll for the thumbnail strip ----------------
     Lets people click-and-drag (mouse) or touch-drag the thumb strip left
     and right. A small movement threshold distinguishes a drag from a
     plain click, so tapping a thumb still selects it. */

  (function enableThumbDrag() {
    var isDown = false;
    var didDrag = false;
    var startX = 0;
    var startScroll = 0;
    var DRAG_THRESHOLD = 6; // px

    function pointerDown(e) {
      isDown = true;
      didDrag = false;
      thumbsHost.classList.add("is-dragging");
      startX = e.pageX || (e.touches && e.touches[0].pageX) || 0;
      startScroll = thumbsHost.scrollLeft;
    }

    function pointerMove(e) {
      if (!isDown) { return; }
      var x = e.pageX || (e.touches && e.touches[0].pageX) || 0;
      var delta = x - startX;
      if (Math.abs(delta) > DRAG_THRESHOLD) {
        didDrag = true;
        if (e.cancelable) { e.preventDefault(); }
      }
      thumbsHost.scrollLeft = startScroll - delta;
    }

    function pointerUp() {
      if (!isDown) { return; }
      isDown = false;
      thumbsHost.classList.remove("is-dragging");
    }

    thumbsHost.addEventListener("mousedown", pointerDown);
    window.addEventListener("mousemove", pointerMove);
    window.addEventListener("mouseup", pointerUp);

    thumbsHost.addEventListener("touchstart", pointerDown, { passive: true });
    thumbsHost.addEventListener("touchmove", pointerMove, { passive: false });
    thumbsHost.addEventListener("touchend", pointerUp, { passive: true });

    // Swallow the click that follows a drag so it doesn't also select a thumb.
    thumbsHost.addEventListener("click", function (e) {
      if (didDrag) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  })();

  /* ---------------- Swipe support (touch) ---------------- */

  var touchStartX = null;
  viewport.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  viewport.addEventListener("touchend", function (e) {
    if (touchStartX === null) { return; }
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
      restartAutoplay();
    }
    touchStartX = null;
  }, { passive: true });

  /* ---------------- Init ---------------- */

  goTo(0, true);
  startAutoplay();
})();
