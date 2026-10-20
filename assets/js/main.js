/* Résidence Bolivia · scripts du site */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  /* ===================================================================
     SUIVI DES VISITES (à remplir quand les comptes seront créés)
     - GA4_ID : identifiant Google Analytics 4, ex. "G-ABC123XYZ"
     - META_PIXEL_ID : identifiant du pixel Meta, ex. "123456789012345"
     Tant que ces deux valeurs sont vides, aucun suivi n'est chargé et
     aucune bannière de consentement n'apparaît.
     =================================================================== */
  var GA4_ID = "G-63LBQPJCDD";
  var META_PIXEL_ID = "";

  /* ---------- En-tête : fond plein au défilement ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header || header.classList.contains("always-solid")) return;
    header.classList.toggle("solid", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var nav = document.querySelector(".nav");
  var openBtn = document.querySelector(".menu-btn");
  var closeBtn = document.querySelector(".nav .close");
  function setMenu(open) {
    if (!nav) return;
    nav.classList.toggle("open", open);
    if (openBtn) openBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (openBtn) openBtn.addEventListener("click", function () { setMenu(true); });
  if (closeBtn) closeBtn.addEventListener("click", function () { setMenu(false); });
  if (nav) nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---------- Apparition au défilement ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Barre d'appel mobile ---------- */
  var mobileCta = document.querySelector(".mobile-cta");
  var hero = document.querySelector(".hero");
  if (mobileCta && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      mobileCta.classList.toggle("show", !entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(hero);
  } else if (mobileCta) { mobileCta.classList.add("show"); }

  /* ---------- Vidéos YouTube : chargées seulement au clic ---------- */
  document.querySelectorAll(".video[data-id]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-id");
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      f.title = btn.getAttribute("aria-label") || "Vidéo YouTube";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      f.allowFullscreen = true;
      btn.innerHTML = "";
      btn.appendChild(f);
      btn.style.cursor = "default";
    }, { once: true });
  });

  /* ---------- Année du pied de page ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Graphique des températures ---------- */
  var chartBox = document.getElementById("temp-chart");
  if (chartBox) drawChart(chartBox);

  function drawChart(box) {
    var months = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
    var series = [
      { name: "Santa Cruz", color: "#D9480F", data: [26.9, 26.4, 26.2, 24.8, 22.1, 20.9, 20.8, 23.0, 25.1, 26.4, 26.6, 26.6] },
      { name: "Paris", color: "#2F6FD1", data: [4.6, 5.2, 8.3, 11.3, 14.9, 18.2, 20.5, 20.2, 16.5, 12.4, 7.9, 5.2] },
      { name: "Montréal", color: "#1E8A5A", data: [-9.2, -7.9, -2.0, 6.2, 13.8, 19.0, 21.7, 20.6, 16.0, 8.8, 2.2, -4.9] }
    ];
    var W = Math.max(320, Math.round(box.clientWidth || 880)), small = W < 600;
    var H = small ? 280 : 340, m = { t: 16, r: small ? 84 : 108, b: 34, l: small ? 34 : 44 };
    var yMin = -12, yMax = 30;
    var iw = W - m.l - m.r, ih = H - m.t - m.b;
    function x(i) { return m.l + (iw * i) / 11; }
    function y(v) { return m.t + ih * (1 - (v - yMin) / (yMax - yMin)); }
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Températures moyennes mensuelles : Santa Cruz entre 20,8 et 26,9 °C toute l'année, Paris entre 4,6 et 20,5 °C, Montréal entre -9,2 et 21,7 °C.");
    function el(tag, attrs, parent) {
      var e = document.createElementNS(ns, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      (parent || svg).appendChild(e);
      return e;
    }
    [-10, 0, 10, 20, 30].forEach(function (v) {
      el("line", { x1: m.l, x2: m.l + iw, y1: y(v), y2: y(v), "class": v === 0 ? "zero-line" : "grid-line" });
      var t = el("text", { x: m.l - 10, y: y(v) + 4, "text-anchor": "end", "class": "axis-label" });
      t.textContent = v + "°";
    });
    months.forEach(function (mo, i) {
      if (small && i % 2) return;
      var t = el("text", { x: x(i), y: H - 10, "text-anchor": "middle", "class": "axis-label" });
      t.textContent = mo;
    });
    var dotsGroups = [];
    series.forEach(function (s) {
      var d = s.data.map(function (v, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1); }).join(" ");
      el("path", { d: d, "class": "series", stroke: s.color });
      var last = s.data[11];
      var lab = el("text", { x: x(11) + 12, y: y(last) + 4, "class": "end-label" });
      lab.textContent = s.name;
      var g = el("g", { opacity: 0 });
      s.data.forEach(function (v, i) {
        el("circle", { cx: x(i), cy: y(v), r: 5, fill: s.color, stroke: "#fff", "stroke-width": 2 }, g);
      });
      dotsGroups.push(g);
    });
    // Ajustement des étiquettes de fin pour éviter le chevauchement
    var labels = svg.querySelectorAll(".end-label");
    var ys = [];
    labels.forEach(function (l) { ys.push(parseFloat(l.getAttribute("y"))); });
    for (var a = 0; a < ys.length; a++) for (var b = 0; b < ys.length; b++) {
      if (a !== b && Math.abs(ys[a] - ys[b]) < 16) {
        if (ys[a] < ys[b]) { ys[a] -= 8; ys[b] += 8; }
      }
    }
    labels.forEach(function (l, i) { l.setAttribute("y", ys[i]); });

    var hover = el("line", { x1: 0, x2: 0, y1: m.t, y2: m.t + ih, "class": "hover-line", opacity: 0 });
    var hit = el("rect", { x: m.l - 20, y: m.t, width: iw + 40, height: ih, fill: "transparent" });
    box.appendChild(svg);
    var tip = document.createElement("div");
    tip.className = "chart-tip";
    box.appendChild(tip);
    var full = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    function show(i) {
      hover.setAttribute("x1", x(i)); hover.setAttribute("x2", x(i)); hover.setAttribute("opacity", 1);
      dotsGroups.forEach(function (g) {
        g.setAttribute("opacity", 1);
        g.querySelectorAll("circle").forEach(function (c, j) { c.setAttribute("r", j === i ? 6 : 0); });
      });
      var html = "<b>" + full[i] + "</b>";
      series.forEach(function (s) {
        html += '<div class="row"><span><i style="background:' + s.color + '"></i>' + s.name + "</span><strong>" + String(s.data[i]).replace(".", ",") + " °C</strong></div>";
      });
      tip.innerHTML = html;
      var rect = svg.getBoundingClientRect();
      var px = (x(i) / W) * rect.width;
      var minX = 90, maxX = rect.width - 90;
      tip.style.left = Math.max(minX, Math.min(maxX, px)) + "px";
      tip.style.top = "4px";
      tip.style.opacity = 1;
    }
    function hide() {
      hover.setAttribute("opacity", 0); tip.style.opacity = 0;
      dotsGroups.forEach(function (g) { g.setAttribute("opacity", 0); });
    }
    function idxFromEvent(ev) {
      var rect = svg.getBoundingClientRect();
      var cx = ((ev.touches ? ev.touches[0].clientX : ev.clientX) - rect.left) * (W / rect.width);
      return Math.max(0, Math.min(11, Math.round(((cx - m.l) / iw) * 11)));
    }
    hit.addEventListener("mousemove", function (ev) { show(idxFromEvent(ev)); });
    hit.addEventListener("mouseleave", hide);
    hit.addEventListener("touchstart", function (ev) { show(idxFromEvent(ev)); }, { passive: true });
    hit.addEventListener("touchmove", function (ev) { show(idxFromEvent(ev)); }, { passive: true });
  }

  /* ---------- Consentement et suivi ---------- */
  var KEY = "rb-consent";
  function getConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function loadTracking() {
    if (GA4_ID) {
      var s = document.createElement("script");
      s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", GA4_ID, { anonymize_ip: true });
    }
    if (META_PIXEL_ID) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", META_PIXEL_ID); window.fbq("track", "PageView");
    }
    // Clic vers Calendly = prospect
    document.querySelectorAll('a[href*="calendly.com"]').forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.gtag) window.gtag("event", "generate_lead", { method: "calendly" });
        if (window.fbq) window.fbq("track", "Lead");
      });
    });
  }
  if (GA4_ID || META_PIXEL_ID) {
    var c = getConsent();
    if (c === "yes") loadTracking();
    else if (c !== "no") {
      var bar = document.querySelector(".consent");
      if (bar) {
        bar.classList.add("show");
        bar.querySelector("[data-consent=yes]").addEventListener("click", function () { setConsent("yes"); bar.classList.remove("show"); loadTracking(); });
        bar.querySelector("[data-consent=no]").addEventListener("click", function () { setConsent("no"); bar.classList.remove("show"); });
      }
    }
  }
})();

/* ---------- Filtres des projets immobiliers ---------- */
(function () {
  var chips = document.querySelectorAll(".chip[data-filter]");
  if (!chips.length) return;
  var items = document.querySelectorAll(".project[data-zone], .overview-table tr[data-zone]");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("active"); c.setAttribute("aria-pressed", "false"); });
      chip.classList.add("active"); chip.setAttribute("aria-pressed", "true");
      var f = chip.getAttribute("data-filter"), kind = f.split(":")[0], val = f.split(":")[1];
      items.forEach(function (el) {
        var z = el.getAttribute("data-zone"), tags = (el.getAttribute("data-tags") || "").split(" ");
        var show = f === "tous" || z === "all" || (kind === "zone" && z === val) || (kind === "tag" && tags.indexOf(val) > -1);
        el.classList.toggle("dim", !show);
      });
    });
  });
})();
