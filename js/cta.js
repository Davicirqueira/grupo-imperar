/**
 * cta.js — Sticky CTA bar + WhatsApp click tracking for Grupo ImperAR.
 *
 * Responsibilities:
 *  1. Inject a sticky "Solicitar Orçamento" CTA bar at the bottom of the
 *     viewport that becomes visible once the visitor scrolls past >=50% of the
 *     total scrollable page height and hides again below <40% (hysteresis),
 *     with a 300ms fade-out transition.
 *  2. Keep a minimum 72px vertical gap from the existing WhatsApp floating
 *     button (bottom-right, z-40) by lifting the floating button group while
 *     the bar is visible, so both remain fully visible and independently
 *     tappable. The bar itself sits at z-index 35 (below the floating button).
 *     The bar is also suppressed once the footer reaches the band the bar
 *     occupies at the bottom of the viewport (a per-frame geometric check on
 *     the footer's top position), so it never overlaps the footer at the end
 *     of the page — the footer already exposes the contact CTAs.
 *  3. Delegate clicks on any [href*="wa.me"] link to the analytics layer,
 *     firing the WhatsApp/Contact event before navigation without ever
 *     blocking or throwing when analytics globals are unavailable.
 *
 * Respects prefers-reduced-motion: when "reduce" is set the bar appears and
 * disappears instantly (transitions are disabled via the injected CSS).
 *
 * Loaded via a plain <script src="js/cta.js" defer></script> (no modules).
 * Vanilla ES6+.
 */
(function () {
  "use strict";

  // ---- Configuration -------------------------------------------------------

  // Visibility thresholds (fraction of total scrollable height). The band
  // between HIDE and SHOW provides hysteresis so the bar never flickers.
  var SHOW_THRESHOLD = 0.5; // become visible at >= 50%
  var HIDE_THRESHOLD = 0.4; // hide at < 40%

  // Minimum vertical gap (px) to preserve between the sticky bar and the
  // WhatsApp floating button so both stay fully tappable (Requirement 4.1).
  var FLOAT_GAP_PX = 72;

  // The floating social buttons container sits at bottom: 24px (Tailwind
  // `bottom-6`). We read this at runtime but keep a sensible fallback.
  var FLOAT_DEFAULT_BOTTOM = 24;

  var WHATSAPP_HREF =
    "https://wa.me/5511980979915?text=" +
    encodeURIComponent(
      "Olá, vim pelo site e gostaria de solicitar um orçamento de climatização."
    );

  // ---- Pure visibility logic (exposed for testing — Property 2) ------------

  /**
   * Pure decision function for sticky CTA visibility given a scroll ratio and
   * the previous visibility state. Implements the 0.5 / 0.4 hysteresis:
   *   ratio >= 0.5           -> visible (true)
   *   ratio <  0.4           -> hidden  (false)
   *   0.4 <= ratio < 0.5     -> keep previous state
   *
   * Non-finite ratios (NaN/Infinity) preserve the previous state so transient
   * measurement glitches never toggle the bar.
   *
   * @param {number} scrollRatio - scrollY / (documentHeight - viewportHeight).
   * @param {boolean} prevState - the bar's current visibility.
   * @returns {boolean} whether the bar should be visible.
   */
  function ctaShouldShow(scrollRatio, prevState) {
    var prev = prevState === true;
    if (typeof scrollRatio !== "number" || !isFinite(scrollRatio)) return prev;
    if (scrollRatio >= SHOW_THRESHOLD) return true;
    if (scrollRatio < HIDE_THRESHOLD) return false;
    return prev; // hysteresis band keeps previous state
  }

  // Expose for unit/property testing (task 6.5 / Property 2).
  window.__ctaShouldShow = ctaShouldShow;

  // ---- Helpers -------------------------------------------------------------

  /**
   * Current page filename (e.g., "index.html"). Falls back to "index.html".
   */
  function getPageFilename() {
    var path = (window.location && window.location.pathname) || "";
    var file = path.split("/").pop();
    return file && file.length > 0 ? file : "index.html";
  }

  /**
   * Fraction of the page that has been scrolled:
   *   scrollY / (documentHeight - viewportHeight)
   * Returns 0 when the page is not tall enough to scroll (avoids div-by-zero).
   */
  function getScrollRatio() {
    var doc = document.documentElement;
    var body = document.body;
    var docHeight = Math.max(
      doc ? doc.scrollHeight : 0,
      body ? body.scrollHeight : 0
    );
    var viewport = window.innerHeight || (doc ? doc.clientHeight : 0);
    var scrollable = docHeight - viewport;
    if (scrollable <= 0) return 0;
    var y =
      window.scrollY != null
        ? window.scrollY
        : doc
        ? doc.scrollTop
        : 0;
    return y / scrollable;
  }

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  // ---- Style injection -----------------------------------------------------

  function injectStyles() {
    if (document.getElementById("sticky-cta-styles")) return;
    var style = document.createElement("style");
    style.id = "sticky-cta-styles";
    style.textContent = [
      ".sticky-cta-bar{",
      "  position:fixed;left:0;right:0;bottom:0;z-index:35;",
      "  display:flex;justify-content:center;align-items:center;gap:16px;",
      "  flex-wrap:wrap;",
      "  padding:12px 16px;",
      "  background:#ffffff;",
      "  box-shadow:0 -4px 16px rgba(26,43,92,0.12);",
      "  transform:translateY(110%);opacity:0;visibility:hidden;",
      "  transition:transform 300ms ease,opacity 300ms ease,visibility 300ms ease;",
      "  will-change:transform,opacity;",
      "}",
      ".sticky-cta-bar.is-visible{transform:translateY(0);opacity:1;visibility:visible;}",
      ".sticky-cta-bar .sticky-cta-text{",
      "  font-weight:600;color:var(--c-deep,#1a2b5c);font-size:15px;margin:0;",
      "}",
      ".sticky-cta-bar .sticky-cta-btn{",
      "  display:inline-flex;align-items:center;justify-content:center;gap:8px;",
      "  min-height:44px;padding:10px 22px;border-radius:9999px;",
      "  background:var(--c-sky,#3AAEDC);color:#ffffff;font-weight:600;",
      "  font-size:15px;line-height:1;text-decoration:none;white-space:nowrap;",
      "  transition:background-color 200ms ease,transform 200ms ease;",
      "}",
      ".sticky-cta-bar .sticky-cta-btn:hover{background:var(--c-hover,#2490ba);}",
      ".sticky-cta-bar .sticky-cta-btn:focus-visible{",
      "  outline:2px solid var(--c-deep,#1a2b5c);outline-offset:2px;",
      "}",
      // Floating button group lift while the bar is visible (72px gap).
      "[data-cta-float-group]{",
      "  transition:transform 300ms ease;",
      "}",
      // Reduced motion: appear/disappear and lift instantly, no transitions.
      "@media (prefers-reduced-motion: reduce){",
      "  .sticky-cta-bar,[data-cta-float-group]{transition:none !important;}",
      "}",
      // Small screens: stack text above the button so both stay readable.
      "@media (max-width:480px){",
      "  .sticky-cta-bar{gap:8px;padding:10px 12px;}",
      "  .sticky-cta-bar .sticky-cta-text{font-size:14px;text-align:center;}",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  // ---- Bar creation --------------------------------------------------------

  function createBar() {
    var bar = document.createElement("div");
    bar.className = "sticky-cta-bar";
    bar.setAttribute("role", "complementary");
    bar.setAttribute("aria-label", "Solicitar orçamento");
    bar.setAttribute("aria-hidden", "true");

    var text = document.createElement("p");
    text.className = "sticky-cta-text";
    text.textContent = "Pronto para climatizar seu espaço?";

    var link = document.createElement("a");
    link.className = "sticky-cta-btn";
    link.href = WHATSAPP_HREF;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Solicitar Orçamento";

    bar.appendChild(text);
    bar.appendChild(link);
    document.body.appendChild(bar);
    return bar;
  }

  // ---- Floating button group offset ---------------------------------------

  /**
   * Locate the container that groups the floating social buttons (the parent
   * of [data-whatsapp-float]). Returns null when the floating button is absent
   * (e.g., pages without it).
   */
  function getFloatGroup() {
    var floatBtn = document.querySelector("[data-whatsapp-float]");
    return floatBtn ? floatBtn.parentElement : null;
  }

  /**
   * Lift or reset the floating button group so that a minimum vertical gap of
   * FLOAT_GAP_PX is preserved between the top of the sticky bar and the bottom
   * of the floating button. Reading the bar height keeps the gap correct even
   * when the bar wraps to two lines on small screens.
   */
  function updateFloatOffset(bar, group, visible) {
    if (!group) return;
    group.setAttribute("data-cta-float-group", "");
    if (visible) {
      var barHeight = bar.offsetHeight || 0;
      // Existing distance of the group from the viewport bottom.
      var currentBottom = FLOAT_DEFAULT_BOTTOM;
      try {
        var rect = group.getBoundingClientRect();
        currentBottom = Math.max(
          0,
          (window.innerHeight || 0) - rect.bottom
        );
      } catch (e) {
        /* keep fallback */
      }
      // Shift up so: currentBottom + shift = barHeight + FLOAT_GAP_PX
      var shift = barHeight + FLOAT_GAP_PX - currentBottom;
      if (shift < 0) shift = 0;
      group.style.transform = "translateY(-" + shift + "px)";
    } else {
      group.style.transform = "";
    }
  }

  // ---- WhatsApp click tracking (event delegation) --------------------------

  /**
   * Delegate clicks on any anchor whose href contains "wa.me". Fires the
   * Contact/WhatsApp analytics event before navigation. Prefers the centralized
   * analytics layer (which itself fires fbq('track','Contact')); falls back to
   * a direct fbq call only when ImperarAnalytics is unavailable. Never blocks
   * navigation and never throws when analytics globals are missing.
   */
  function setupWhatsAppTracking() {
    document.addEventListener(
      "click",
      function (e) {
        var target = e.target;
        var link =
          target && target.closest
            ? target.closest('[href*="wa.me"]')
            : null;
        if (!link) return;

        var source = getPageFilename();
        try {
          if (
            window.ImperarAnalytics &&
            typeof window.ImperarAnalytics.trackWhatsAppClick === "function"
          ) {
            // Centralized path — handles fbq('track','Contact',{source}) and GA4.
            window.ImperarAnalytics.trackWhatsAppClick(source);
          } else if (typeof window.fbq === "function") {
            // Fallback when analytics module is absent; avoid double-firing.
            window.fbq("track", "Contact", { source: source });
          }
        } catch (err) {
          /* analytics is fire-and-forget: never block the WhatsApp navigation */
        }
        // Intentionally no preventDefault — navigation proceeds normally.
      },
      true // capture so we run before default navigation begins
    );
  }

  // ---- Wiring --------------------------------------------------------------

  function init() {
    injectStyles();
    setupWhatsAppTracking();

    var bar = createBar();
    var floatGroup = getFloatGroup();
    var state = { isVisible: false };

    // Minimum breathing room (px) between the bottom of the sticky bar's
    // "reserved" band and the top of the footer before we hide the bar.
    var FOOTER_GAP_PX = 8;

    var footer = document.querySelector("footer, [role='contentinfo']");

    /**
     * Would the sticky bar (fixed at bottom:0) collide with the footer at the
     * current scroll position? True once the footer's top has risen into the
     * band the bar occupies at the bottom of the viewport.
     *
     * This geometric check is evaluated on every scroll frame, so it stays
     * correct even at the absolute bottom of the page — unlike observing the
     * whole footer for intersection, which stops matching once a tall footer's
     * top scrolls off-screen. When the footer is on screen it already surfaces
     * the contact CTAs, so hiding the redundant bar is also the right UX.
     */
    function footerWouldCollide() {
      if (!footer) return false;
      var vh = window.innerHeight || document.documentElement.clientHeight || 0;
      var barH = bar.offsetHeight || 68;
      var footerTop = footer.getBoundingClientRect().top;
      // Bar occupies [vh - barH, vh]. Hide as soon as the footer top reaches it.
      return footerTop <= vh - barH - FOOTER_GAP_PX;
    }

    function setVisible(visible) {
      if (visible === state.isVisible) return;
      state.isVisible = visible;
      bar.classList.toggle("is-visible", visible);
      bar.setAttribute("aria-hidden", visible ? "false" : "true");
      updateFloatOffset(bar, floatGroup, visible);
    }

    function evaluate() {
      // Footer collision always wins: hide the bar so it never covers the footer.
      if (footerWouldCollide()) {
        setVisible(false);
        return;
      }
      var ratio = getScrollRatio();
      setVisible(ctaShouldShow(ratio, state.isVisible));
    }

    // Debounce scroll/resize work with requestAnimationFrame.
    var ticking = false;
    function onScrollOrResize() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        evaluate();
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    // Evaluate once on load in case the page is already scrolled.
    evaluate();

    // Expose a tiny handle for debugging/testing without leaking internals.
    window.__ctaBar = bar;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
