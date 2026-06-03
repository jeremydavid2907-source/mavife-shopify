(function () {
  "use strict";

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[MAVIFE:" + name + "]", e); }
  }

  /* SPLASH */
  function initSplash() {
    var splash = document.querySelector("[data-splash]");
    if (!splash) return;
    var hide = function () { splash.classList.add("is-out"); };
    if (document.readyState === "complete") {
      setTimeout(hide, 700);
    } else {
      window.addEventListener("load", function () { setTimeout(hide, 500); });
    }
    setTimeout(hide, 3800);
  }

  /* CURSOR */
  function initCursor() {
    var cursor = document.getElementById("cursor");
    if (!cursor) return;
    if (matchMedia("(hover: none)").matches) return;
    var dot  = cursor.querySelector(".cursor-dot");
    var ring = cursor.querySelector(".cursor-ring");
    var dx = 0, dy = 0, rx = 0, ry = 0;
    var firstMove = false;

    window.addEventListener("mousemove", function (e) {
      dx = e.clientX; dy = e.clientY;
      dot.style.transform = "translate3d(" + dx + "px," + dy + "px,0) translate(-50%,-50%)";
      if (!firstMove) {
        firstMove = true;
        rx = dx; ry = dy;
        ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0) translate(-50%,-50%)";
        cursor.classList.add("is-ready");
      }
    });

    (function lerp() {
      rx += (dx - rx) * 0.14;
      ry += (dy - ry) * 0.14;
      ring.style.transform = "translate3d(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px,0) translate(-50%,-50%)";
      requestAnimationFrame(lerp);
    })();

    document.querySelectorAll("a, button").forEach(function (el) {
      el.addEventListener("mouseover", function () { cursor.classList.add("on-cta"); });
      el.addEventListener("mouseout",  function () { cursor.classList.remove("on-cta"); });
    });
  }

  /* NAV */
  function initNav() {
    var nav        = document.getElementById("nav");
    var hamburger  = document.getElementById("hamburger");
    var mobileMenu = document.getElementById("mobileMenu");
    var mobileClose= document.getElementById("mobileClose");

    if (!nav) return;

    window.addEventListener("scroll", function () {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    }, { passive: true });

    if (hamburger) {
      hamburger.addEventListener("click", function () {
        mobileMenu.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    }
    if (mobileClose) {
      mobileClose.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      });
    }
    document.querySelectorAll(".mobile-link").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* SMOOTH SCROLL */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
    });
  }

  /* REVEAL ON SCROLL */
  function initReveals() {
    var items = document.querySelectorAll(".reveal, .reveal-left");
    if (!items.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.04, rootMargin: "0px 0px -2% 0px" });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible), .reveal-left:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight + 100) el.classList.add("is-visible");
      });
    }, 6000);
  }

  /* COUNT-UP */
  function initCountUp() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target   = parseInt(el.getAttribute("data-count"), 10);
        var duration = 1800;
        var start    = Date.now();
        var label    = el.parentElement && el.parentElement.querySelector(".stat-label");
        var suffix   = label && label.textContent.indexOf("%") !== -1 ? "%" : "+";
        function tick() {
          var elapsed  = Date.now() - start;
          var progress = Math.min(elapsed / duration, 1);
          var ease     = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(ease * target).toLocaleString("es") + (progress >= 1 ? suffix : "");
          if (progress < 1) requestAnimationFrame(tick);
        }
        tick();
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { io.observe(el); });
  }

  /* TESTIMONIALS CAROUSEL */
  function initTestiCarousel() {
    var track   = document.getElementById("testiTrack");
    if (!track) return;
    var dots    = document.querySelectorAll(".testi-dot");
    var prevBtn = document.getElementById("testiPrev");
    var nextBtn = document.getElementById("testiNext");
    var cards   = track.querySelectorAll(".testi-card");
    var current = 0;
    var total   = cards.length;
    var autoTimer;

    function go(idx) {
      if (idx < 0) idx = total - 1;
      if (idx >= total) idx = 0;
      current = idx;
      var cardW = cards[0].offsetWidth;
      track.style.transform = "translateX(-" + (current * cardW) + "px)";
      dots.forEach(function (d, i) { d.classList.toggle("active", i === current); });
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { go(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { go(current + 1); resetAuto(); });
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        go(parseInt(dot.getAttribute("data-idx"), 10));
        resetAuto();
      });
    });

    function resetAuto() { clearInterval(autoTimer); autoTimer = setInterval(function () { go(current + 1); }, 4000); }
    resetAuto();
    window.addEventListener("resize", function () { go(0); }, { passive: true });
  }

  /* HERO PARALLAX */
  function initHeroParallax() {
    var heroBg = document.querySelector(".hero-bg");
    if (!heroBg) return;
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var y = window.scrollY;
          if (y < window.innerHeight * 1.5) heroBg.style.transform = "translateY(" + (y * 0.3) + "px)";
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* BOOT */
  function boot() {
    safe(initSplash,        "splash");
    safe(initCursor,        "cursor");
    safe(initNav,           "nav");
    safe(initSmoothScroll,  "smoothScroll");
    safe(initReveals,       "reveals");
    safe(initCountUp,       "countUp");
    safe(initTestiCarousel, "carousel");
    safe(initHeroParallax,  "parallax");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
