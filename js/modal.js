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

    overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.setAttribute("data-modal-overlay", "");

    const container = document.createElement("div");
    container.className = "modal-container";

    panel = document.createElement("div");
    panel.className = "modal-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.tabIndex = -1;

    closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "modal-close";
    closeBtn.setAttribute("aria-label", "Fechar");
    closeBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

    panel.appendChild(closeBtn);
    container.appendChild(panel);
    root.appendChild(overlay);
    root.appendChild(container);
    document.body.appendChild(root);

    overlay.addEventListener("click", close);
    closeBtn.addEventListener("click", close);
    panel.addEventListener("keydown", trapFocus);
  }

  function lockScroll() {
    savedScrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = "-" + savedScrollY + "px";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }

  function unlockScroll() {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, savedScrollY);
  }

  function trapFocus(e) {
    if (e.key !== "Tab") return;

    const focusable = panel.querySelectorAll(FOCUSABLE_SELECTOR);
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

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function onKeydown(e) {
    if (e.key === "Escape" && isOpen) {
      e.stopPropagation();
      close();
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
