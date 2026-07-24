/**
 * analytics.js — Centralized tracking module for Grupo ImperAR.
 *
 * Abstracts Meta Pixel (fbq) and Google Analytics 4 (gtag) behind a single
 * public interface exposed as `window.ImperarAnalytics`. Every method is safe
 * to call even when `fbq` or `gtag` are undefined: the module degrades
 * gracefully, skipping the respective platform's event without throwing and
 * without blocking navigation or user interaction.
 *
 * Loaded via a plain <script> tag (no modules/imports). Vanilla ES6+.
 */
(function () {
  "use strict";

  // Session flag guaranteeing Meta Pixel 'InitiateCheckout' fires only once
  // per page session (Requirement 5.5 / Property 4).
  var formStartFired = false;

  /**
   * Returns the current page filename (e.g., "index.html", "services.html").
   * Falls back to "index.html" when the path ends in a slash or is empty.
   */
  function getPageFilename() {
    var path = (window.location && window.location.pathname) || "";
    var file = path.split("/").pop();
    return file && file.length > 0 ? file : "index.html";
  }

  /**
   * Fire a Meta Pixel event safely. No-op if `fbq` is not a function.
   * Any error is swallowed so tracking never blocks the user.
   *
   * @param {string} method - fbq method, e.g. "track" or "trackCustom".
   * @param {string} eventName - event name, e.g. "PageView", "Lead".
   * @param {Object} [params] - optional event parameters.
   */
  function pixel(method, eventName, params) {
    try {
      if (typeof window.fbq !== "function") return;
      if (params && typeof params === "object") {
        window.fbq(method, eventName, params);
      } else {
        window.fbq(method, eventName);
      }
    } catch (e) {
      /* fire-and-forget: analytics must never break the page */
    }
  }

  /**
   * Send a GA4 event safely. No-op if `gtag` is not a function.
   * Any error is swallowed so tracking never blocks the user.
   *
   * @param {string} eventName - GA4 event name, e.g. "cta_click".
   * @param {Object} [params] - optional event parameters.
   */
  function ga(eventName, params) {
    try {
      if (typeof window.gtag !== "function") return;
      window.gtag("event", eventName, params || {});
    } catch (e) {
      /* fire-and-forget: analytics must never break the page */
    }
  }

  var ImperarAnalytics = {
    /**
     * Track a page view. Meta Pixel 'PageView' + GA4 'page_view'.
     * The GA4 config snippet typically auto-fires page_view, so the explicit
     * GA4 event here is redundant-safe. Requirement 9.1.
     */
    trackPageView: function () {
      pixel("track", "PageView");
      ga("page_view", { page_path: getPageFilename() });
    },

    /**
     * Track a WhatsApp link click. Fires Meta Pixel 'Contact' with the source
     * page and a matching GA4 event. Requirement 9.2.
     *
     * @param {string} [sourcePage] - originating page filename; defaults to
     *   the current page filename when omitted.
     */
    trackWhatsAppClick: function (sourcePage) {
      var source = sourcePage || getPageFilename();
      pixel("track", "Contact", { source: source });
      ga("whatsapp_click", { source_page: source });
    },

    /**
     * Track a CTA button click. Sends GA4 'cta_click' with the button label
     * and source page. Requirement 9.5.
     *
     * @param {string} label - the CTA's visible text.
     * @param {string} [sourcePage] - originating page filename; defaults to
     *   the current page filename when omitted.
     */
    trackCTAClick: function (label, sourcePage) {
      ga("cta_click", {
        cta_label: label || "",
        source_page: sourcePage || getPageFilename()
      });
    },

    /**
     * Track the first interaction with the contact form. Fires Meta Pixel
     * 'InitiateCheckout' exactly once per page session; subsequent calls are
     * no-ops. Requirement 5.5 / Property 4.
     */
    trackFormStart: function () {
      if (formStartFired) return;
      formStartFired = true;
      pixel("track", "InitiateCheckout");
    },

    /**
     * Track a successful form submission. Meta Pixel 'Lead' + GA4
     * 'generate_lead'. Requirement 9.3.
     */
    trackFormSubmit: function () {
      pixel("track", "Lead");
      ga("generate_lead", { method: "form" });
    },

    /**
     * Generic custom event. Meta Pixel 'trackCustom' + GA4 event with the
     * same name and params. Both platforms degrade gracefully.
     *
     * @param {string} name - custom event name.
     * @param {Object} [params] - optional event parameters.
     */
    trackCustomEvent: function (name, params) {
      pixel("trackCustom", name, params);
      ga(name, params);
    }
  };

  window.ImperarAnalytics = ImperarAnalytics;
})();
