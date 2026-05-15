function toKebab(str) {
  return String(str || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function setActiveNav() {
  const path = (window.location.pathname || "").split("/").pop() || "index.html";
  const current = path === "" ? "index.html" : path;
  document.querySelectorAll(".nav-links a[href]").forEach((a) => {
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
  const header = document.querySelector(".site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 100);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function setupMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const links = document.querySelector("[data-nav-links]");
  if (!toggle || !links) return;

  const close = () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.closest("[data-nav-toggle]") || target.closest("[data-nav-links]")) return;
    close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
}

function setupFloatingWhatsApp() {
  const btn = document.querySelector('[data-whatsapp-float]');
  if (!btn) return;

  const onScroll = () => {
    const shouldShow = window.scrollY > 300;
    btn.classList.toggle('is-visible', shouldShow);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function setYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
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

