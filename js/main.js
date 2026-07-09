function toKebab(str) {
  return String(str || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function setActiveNav() {
  const path = (window.location.pathname || "").split("/").pop() || "index.html";
  const current = path === "" ? "index.html" : path;
  document.querySelectorAll("[data-nav-links] a[href], [data-mobile-menu] a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;
    const normalized = href.split("/").pop();
    if (normalized === current) {
      a.setAttribute("aria-current", "page");
    } else {
      a.removeAttribute("aria-current");
    }
  });
}

function setupStickyHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const heroPresent = !!document.querySelector("[data-hero-carousel]");

  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const atTop = window.scrollY <= 0;
      const scrolled = window.scrollY > 50;
      const compacted = window.scrollY > 100;

      // Single shared header, two mutually exclusive visual variants:
      // transparent only over the hero at the very top, solid everywhere else.
      // The header always carries exactly one skin variant.
      const transparent = heroPresent && atTop;
      header.classList.toggle("header-transparent", transparent);
      header.classList.toggle("header-solid", !transparent);

      // Compact padding + shadow once scrolled (both handled in CSS variants).
      header.classList.toggle("is-scrolled", scrolled || compacted);
      ticking = false;
    });
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function setupMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  const overlay = document.querySelector("[data-mobile-overlay]");
  if (!toggle || !menu) return;

  const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let isOpen = false;

  function open() {
    isOpen = true;
    toggle.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    if (overlay) {
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "true");
    }
    document.body.style.overflow = "hidden";

    // Focus first link in menu
    const firstLink = menu.querySelector("a");
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }

  function close() {
    isOpen = false;
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    if (overlay) {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
    }
    document.body.style.overflow = "";

    // Return focus to toggle button
    toggle.focus();
  }

  // Toggle on button click
  toggle.addEventListener("click", () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  });

  // Close on overlay click (outside click)
  if (overlay) {
    overlay.addEventListener("click", close);
  }

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      close();
    }
  });

  // Close when clicking a nav link inside the menu
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));

  // Focus trap within menu when open
  menu.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || !isOpen) return;

    const focusableElements = Array.from(menu.querySelectorAll(focusableSelector));
    if (focusableElements.length === 0) return;

    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift+Tab: if on first element, wrap to last
      if (document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }
    } else {
      // Tab: if on last element, wrap to first
      if (document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  });
}

function setupFloatingWhatsApp() {
  // WhatsApp button is always visible — no scroll logic needed
}

function setYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

function smoothScrollTo(targetElement) {
  const headerOffset = 80;
  const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
  const startPosition = window.scrollY;
  const distance = Math.abs(targetPosition - startPosition);

  // Proportional duration: 300ms minimum, 1000ms maximum
  const duration = Math.min(1000, Math.max(300, distance * 0.5));

  let startTime = null;
  let isScrolling = true;

  // Ease-in-out easing function
  function easeInOut(t) {
    return t < 0.5
      ? 2 * t * t
      : -1 + (4 - 2 * t) * t;
  }

  function animateScroll(currentTime) {
    if (!isScrolling) return;

    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOut(progress);

    const currentPos = startPosition + (targetPosition - startPosition) * easedProgress;
    window.scrollTo(0, currentPos);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  // Cancel scroll on user interaction (wheel, touch)
  function cancelScroll() {
    isScrolling = false;
    window.removeEventListener("wheel", cancelScroll);
    window.removeEventListener("touchstart", cancelScroll);
  }

  window.addEventListener("wheel", cancelScroll, { passive: true });
  window.addEventListener("touchstart", cancelScroll, { passive: true });

  requestAnimationFrame(animateScroll);
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      smoothScrollTo(target);

      // Update active navigation state after scroll
      document.querySelectorAll("[data-nav-links] a[href], [data-mobile-menu] a[href]").forEach((link) => {
        link.removeAttribute("aria-current");
      });
      const matchingLinks = document.querySelectorAll('[data-nav-links] a[href="' + href + '"], [data-mobile-menu] a[href="' + href + '"]');
      matchingLinks.forEach((link) => {
        link.setAttribute("aria-current", "page");
      });
    });
  });
}

function setupRippleEffect() {
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 400);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  setupStickyHeader();
  setupMobileNav();
  setupFloatingWhatsApp();
  setupSmoothScroll();
  setupRippleEffect();
  setYear();

  // Helpful hook for analytics later (no-op by default)
  document.documentElement.dataset.page = toKebab(document.title);
});

