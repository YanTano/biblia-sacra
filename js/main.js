(function () {
  "use strict";

  var root = document.documentElement;
  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primaryNav");
  var heroScene = document.getElementById("heroScene");
  var particlesHost = document.getElementById("heroParticles");

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------- Header scroll state ---------------- */
  function onScroll() {
    if (window.scrollY > 8) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile nav toggle ---------------- */
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

      primaryNav.querySelectorAll(".nav-link").forEach(function (l) {
        l.classList.remove("is-active");
      });
      link.classList.add("is-active");
    });
  });

  /* ---------------- Cursor parallax (lerped) ---------------- */
  var targetX = 0, targetY = 0;
  var fgX = 0, fgY = 0, bgX = 0, bgY = 0;
  var maxFg = 13;   // px
  var maxBg = 2.5;  // px
  var lerpFactor = 0.08;
  var parallaxEnabled = !reducedMotion.matches && window.innerWidth > 900;

  function onPointerMove(e) {
    if (!parallaxEnabled) return;
    var rect = heroScene.getBoundingClientRect();
    var relX = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5..0.5
    var relY = (e.clientY - rect.top) / rect.height - 0.5;
    targetX = relX * 2; // -1..1
    targetY = relY * 2;
  }
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  function animateParallax() {
    fgX += (targetX * maxFg - fgX) * lerpFactor;
    fgY += (targetY * maxFg - fgY) * lerpFactor;
    bgX += (targetX * maxBg - bgX) * lerpFactor;
    bgY += (targetY * maxBg - bgY) * lerpFactor;

    root.style.setProperty("--fg-x", fgX.toFixed(2) + "px");
    root.style.setProperty("--fg-y", fgY.toFixed(2) + "px");
    root.style.setProperty("--bg-x", bgX.toFixed(2) + "px");
    root.style.setProperty("--bg-y", bgY.toFixed(2) + "px");

    requestAnimationFrame(animateParallax);
  }
  requestAnimationFrame(animateParallax);

  /* Gentle automatic float when parallax is disabled (mobile / reduced motion off but small screen) */
  var floatT = 0;
  function autoFloat() {
    if (parallaxEnabled || reducedMotion.matches) {
      requestAnimationFrame(autoFloat);
      return;
    }
    floatT += 0.006;
    var fx = Math.sin(floatT) * 6;
    var fy = Math.cos(floatT * 0.8) * 4;
    root.style.setProperty("--fg-x", fx.toFixed(2) + "px");
    root.style.setProperty("--fg-y", fy.toFixed(2) + "px");
    requestAnimationFrame(autoFloat);
  }
  requestAnimationFrame(autoFloat);

  window.addEventListener("resize", function () {
    parallaxEnabled = !reducedMotion.matches && window.innerWidth > 900;
  });

  /* ---------------- Ambient light particles ---------------- */
  function spawnMotes(count) {
    if (reducedMotion.matches) return;
    for (var i = 0; i < count; i++) {
      var mote = document.createElement("span");
      mote.className = "mote";
      var left = Math.random() * 100;
      var duration = 9 + Math.random() * 9;
      var delay = Math.random() * 10;
      var size = 3 + Math.random() * 4;
      mote.style.left = left + "%";
      mote.style.width = size + "px";
      mote.style.height = size + "px";
      mote.style.animationDuration = duration + "s";
      mote.style.animationDelay = "-" + delay + "s";
      particlesHost.appendChild(mote);
    }
  }
  spawnMotes(14);

  /* ---------------- Scroll-spy for nav active state ---------------- */
  var sections = ["home", "about", "bible", "gallery", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  var navLinks = Array.prototype.slice.call(primaryNav.querySelectorAll(".nav-link"));

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            navLinks.forEach(function (l) {
              l.classList.toggle("is-active", l.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }
})();
