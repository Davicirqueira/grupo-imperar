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

function setYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  setupStickyHeader();
  setupMobileNav();
  setYear();

  // Helpful hook for analytics later (no-op by default)
  document.documentElement.dataset.page = toKebab(document.title);
});

