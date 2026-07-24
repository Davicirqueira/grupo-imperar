/**
 * Modal system — Grupo ImperAR
 * Reusable centralized modals with overlay for service & project cards.
 *
 * Usage:
 *   - Trigger element:   <button data-modal-trigger="modal-id">…</button>
 *                        (also works on <article>, <div>, etc.)
 *   - Hidden template:   <template data-modal-content="modal-id">…</template>
 *   - Single root:       <div data-modal-root>…</div>  (injected lazily)
 *
 * Features:
 *   - One shared modal root, content swapped on open
 *   - Overlay click, close button & Escape key dismiss
 *   - Body scroll lock + scroll position preserved
 *   - Focus trap with restore-focus on close
 *   - aria-modal, aria-labelledby, role="dialog"
 *   - Respects prefers-reduced-motion via CSS
 */
(function () {
  "use strict";

  const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])'
  ].join(",");

  let root = null;
  let overlay = null;
  let panel = null;
  let closeBtn = null;
  let lastTrigger = null;
  let savedScrollY = 0;
  let isOpen = false;

  function ensureRoot() {
    if (root) return;

    root = document.createElement("div");
    root.className = "modal-root";
    root.setAttribute("data-modal-root", "");
    root.setAttribute("aria-hidden", "true");
    // Critical inline styles as fallback (CSS classes enhance transitions)
    root.style.cssText = "position:fixed;inset:0;z-index:100;pointer-events:none;visibility:hidden;";

    overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.setAttribute("data-modal-overlay", "");
    overlay.style.cssText = "position:absolute;inset:0;background:rgba(26,43,92,0.7);opacity:0;transition:opacity 250ms ease-out;";

    const container = document.createElement("div");
    container.className = "modal-container";
    container.style.cssText = "position:absolute;inset:0;display:flex;align-items:flex-start;justify-content:center;padding:1rem;overflow-y:auto;-webkit-overflow-scrolling:touch;";

    panel = document.createElement("div");
    panel.className = "modal-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.tabIndex = -1;
    panel.style.cssText = "position:relative;width:100%;max-width:720px;margin:auto;background:#fff;border-radius:1.25rem;overflow:hidden;box-shadow:0 24px 64px rgba(26,43,92,0.32);opacity:0;transform:scale(0.96) translateY(8px);transition:opacity 250ms ease-out,transform 280ms cubic-bezier(0.4,0,0.2,1);";

    closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "modal-close";
    closeBtn.setAttribute("aria-label", "Fechar");
    closeBtn.style.cssText = "position:absolute;top:0.875rem;right:0.875rem;z-index:2;width:2.5rem;height:2.5rem;display:inline-flex;align-items:center;justify-content:center;border-radius:9999px;background:rgba(255,255,255,0.92);color:#1A2B5C;border:1px solid rgba(26,43,92,0.08);cursor:pointer;transition:background 200ms ease,transform 200ms ease;";
    closeBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

    panel.appendChild(closeBtn);
    container.appendChild(panel);
    root.appendChild(overlay);
    root.appendChild(container);
    document.body.appendChild(root);

    overlay.addEventListener("click", close);
    closeBtn.addEventListener("click", close);
    // Tab trapping is handled at the document level via onKeydown so that
    // focus is caught even when it has escaped the panel (e.g. on <body>).
  }

  function lockScroll() {
    savedScrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = (window.innerWidth - document.documentElement.clientWidth) + "px";
  }

  function unlockScroll() {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }

  function trapFocus(e) {
    if (e.key !== "Tab") return;

    const focusable = panel.querySelectorAll(FOCUSABLE_SELECTOR);
    // Keep the close button reachable even if a layout quirk makes
    // offsetParent null (e.g. certain positioned/overflow contexts).
    const list = Array.from(focusable).filter(
      (el) => el.offsetParent !== null || el === closeBtn
    );
    if (list.length === 0) {
      e.preventDefault();
      panel.focus();
      return;
    }

    const first = list[0];
    const last = list[list.length - 1];

    // Edge case: focus has escaped the panel (e.g. it's on <body> or the
    // panel wrapper). Pull it back into the modal on the next Tab.
    if (!panel.contains(document.activeElement)) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
      return;
    }

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function onKeydown(e) {
    if (!isOpen) return;
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
    } else if (e.key === "Tab") {
      trapFocus(e);
    }
  }

  function clearPanelContent() {
    // keep close button, remove everything else
    Array.from(panel.children).forEach((child) => {
      if (child !== closeBtn) panel.removeChild(child);
    });
  }

  function open(modalId, trigger) {
    const tpl = document.querySelector(
      'template[data-modal-content="' + modalId + '"]'
    );
    if (!tpl) {
      console.warn("[modal] Template not found for id:", modalId);
      return;
    }

    ensureRoot();
    clearPanelContent();

    const fragment = tpl.content.cloneNode(true);
    panel.appendChild(fragment);

    // Set aria-labelledby to the first heading inside the content if present
    const heading = panel.querySelector("h2, h3");
    if (heading) {
      if (!heading.id) {
        heading.id = "modal-title-" + modalId;
      }
      panel.setAttribute("aria-labelledby", heading.id);
    } else {
      panel.removeAttribute("aria-labelledby");
    }

    lastTrigger = trigger || document.activeElement;
    lockScroll();

    root.classList.add("is-open");
    root.setAttribute("aria-hidden", "false");
    // Apply visibility inline to guarantee the modal is shown
    root.style.pointerEvents = "auto";
    root.style.visibility = "visible";
    overlay.style.opacity = "1";
    panel.style.opacity = "1";
    panel.style.transform = "scale(1) translateY(0)";
    isOpen = true;

    // Move focus into modal after the open transition starts
    requestAnimationFrame(() => {
      // Prefer first interactive element (skipping close), fallback to close button
      const focusables = panel.querySelectorAll(FOCUSABLE_SELECTOR);
      const target = Array.from(focusables).find((el) => el !== closeBtn) || closeBtn;
      target.focus();
    });

    document.addEventListener("keydown", onKeydown);
  }

  function close() {
    if (!isOpen || !root) return;

    isOpen = false;
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    // Reset inline styles to hidden state
    root.style.pointerEvents = "none";
    root.style.visibility = "hidden";
    overlay.style.opacity = "0";
    panel.style.opacity = "0";
    panel.style.transform = "scale(0.96) translateY(8px)";

    document.removeEventListener("keydown", onKeydown);
    unlockScroll();

    if (lastTrigger && typeof lastTrigger.focus === "function") {
      // restoreFocus after transition so layout is settled
      setTimeout(() => {
        try {
          lastTrigger.focus({ preventScroll: false });
        } catch (_) {
          lastTrigger.focus();
        }
        lastTrigger = null;
      }, 50);
    }
  }

  function setupTriggers() {
    document.querySelectorAll("[data-modal-trigger]").forEach((el) => {
      const id = el.getAttribute("data-modal-trigger");
      if (!id) return;

      // Make non-button triggers keyboard accessible
      const isButton = el.tagName === "BUTTON" || el.tagName === "A";
      if (!isButton) {
        if (!el.hasAttribute("role")) el.setAttribute("role", "button");
        if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
      }
      if (!el.hasAttribute("aria-haspopup")) {
        el.setAttribute("aria-haspopup", "dialog");
      }

      el.addEventListener("click", (e) => {
        // Don't hijack clicks on inner anchors/buttons
        if (e.target.closest("a, button") && e.target.closest("a, button") !== el) {
          return;
        }
        e.preventDefault();
        open(id, el);
      });

      el.addEventListener("keydown", (e) => {
        if (!isButton && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          open(id, el);
        }
      });
    });
  }

  // Public API (in case other scripts want to programmatically open)
  window.ImperarModal = { open: open, close: close };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupTriggers);
  } else {
    setupTriggers();
  }
})();
