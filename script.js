/* =========================================================
   Interactions: scroll progress, reveal on scroll,
   header state, stat count-up, mobile menu.
   No libraries needed. Works on every page.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* Scroll progress bar + sticky header state */
  var progress = document.getElementById("progress");
  var header = document.querySelector("header");
  function onScroll() {
    var h = document.documentElement;
    var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
    if (progress) progress.style.width = (scrolled * 100) + "%";
    if (header) header.classList.toggle("scrolled", h.scrollTop > 20);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Reveal elements as they enter the viewport */
  var reveals = document.querySelectorAll(".reveal");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  reveals.forEach(function (el, i) {
    el.style.transitionDelay = (i % 4 * 0.06) + "s";
    io.observe(el);
  });

  /* Count-up for stat numbers. Reads data-target and data-suffix/prefix. */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-target"));
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    var decimals = (el.getAttribute("data-decimals")) ? parseInt(el.getAttribute("data-decimals")) : 0;
    var dur = 1500, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased).toFixed(decimals);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-target]");
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        cio.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(function (el) { cio.observe(el); });

  /* Mobile menu toggle */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
      toggle.innerHTML = links.classList.contains("open")
        ? '<i class="ti ti-x"></i>' : '<i class="ti ti-menu-2"></i>';
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.innerHTML = '<i class="ti ti-menu-2"></i>';
      });
    });
  }

  /* Contact form: front-end only demo handler */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = document.getElementById("form-note");
      if (note) { note.style.display = "block"; }
      form.reset();
    });
  }

  /* Footer year */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
});
