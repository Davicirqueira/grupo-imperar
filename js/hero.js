/*
 * hero.js — Hero Section Carousel
 *
 * Fully self-contained carousel logic encapsulated in an IIFE.
 * Exposes NOTHING to the window object (Requirement 15.4).
 *
 * This file is loaded with `defer` and shared across pages, so init()
 * safely no-ops when the carousel markup ([data-hero-carousel]) is absent.
 *
 * Task 2.1 scope: IIFE scaffold + state object + DOM element queries +
 * init() wiring. Behavioral functions are stubbed here and implemented by
 * subsequent tasks (2.2 navigation, 3.x auto-play, 4.x interactions,
 * 5.1 error handling).
 */
(function HeroCarousel() {
  "use strict";

  // --- Constants ---
  // Auto-play cadence: advance to the next slide every 6 seconds
  // (Requirement 1.1). Reused by startAutoPlay/resumeAutoPlay/resetTimer so a
  // single source of truth governs the interval length.
  const AUTOPLAY_INTERVAL = 6000;

  // Task 5.1: how long to wait for the FIRST slide image before assuming it
  // failed and falling back to the gradient-only background. (Requirement 13.5)
  const FIRST_IMAGE_TIMEOUT = 5000;

  // --- State ---
  // Single source of truth driving all DOM updates.
  const state = {
    currentIndex: 0, // 0-based index of the active slide
    totalSlides: 0, // populated from the DOM in init()
    isPlaying: false, // whether the auto-play interval is currently active
    isPaused: false, // whether auto-play is paused by visibility/focus
    timerId: null, // setInterval id for auto-play
    transitionDuration: 800, // CSS fade duration in ms (600–1000 range)

    // Task 5.1: navigable slide indices. Starts as every slide index and has
    // entries removed as subsequent images fail to load, so navigation skips
    // broken slides and the effective slide count shrinks. (Requirement 13.5)
    validIndices: [],
    firstImageTimerId: null // setTimeout id guarding the first-image fallback
  };

  // --- Swipe tracking (Task 4.3) ---
  // Tracks an in-progress touch gesture on the carousel. startX/startY capture
  // the initial touch point; currentX/currentY are updated on each touchmove so
  // touchend can evaluate the final displacement without relying on e.touches
  // (which is empty on touchend). isTracking guards the move/end handlers so
  // they only act during a gesture we actually started. (Requirements 4.1–4.8)
  const swipe = {
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isTracking: false
  };

  // Minimum horizontal displacement (px) required to register a swipe as a
  // navigation gesture. Displacements at or below this are treated as taps /
  // accidental movement and produce no slide change. (Requirement 4.5)
  const SWIPE_THRESHOLD = 50;

  // --- DOM references ---
  // Populated by cacheDom() during init(). Kept in a single object so all
  // handlers share the same cached lookups.
  const dom = {
    carousel: null, // [data-hero-carousel] container (role="region")
    slides: [], // .hero-slide image elements
    dots: [], // .hero-dot indicator buttons
    prevArrow: null, // .hero-arrow-prev
    nextArrow: null, // .hero-arrow-next
    liveRegion: null, // [data-hero-live] aria-live announcer
    slidesContainer: null // .hero-slides wrapper (hidden on first-image failure)
  };

  // --- DOM Update (Task 2.2) ---
  // Reflect state.currentIndex onto the slide elements: exactly the active
  // slide carries .is-active (drives the CSS opacity transition).
  function updateSlides() {
    dom.slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === state.currentIndex);
    });
  }

  // Reflect state.currentIndex onto the indicator dots. The active dot gets
  // both .is-active and aria-current="true"; inactive dots have neither
  // (the aria-current attribute is removed entirely). This guarantees the
  // Property 3 synchronization invariant: exactly one dot is marked active.
  function updateDots() {
    dom.dots.forEach((dot, i) => {
      const isActive = i === state.currentIndex;
      dot.classList.toggle("is-active", isActive);
      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  }

  // Announce the current slide to assistive technology via the polite
  // aria-live region. Uses 1-based numbering for humans (Property 8).
  function updateLiveRegion() {
    if (!dom.liveRegion) return;
    dom.liveRegion.textContent =
      "Slide " + (state.currentIndex + 1) + " de " + state.totalSlides;
  }

  // --- Core navigation (Task 2.2) ---
  // Transition to the slide at `index`. Invalid indices (non-integer or out
  // of [0, totalSlides-1]) are ignored so navigation never lands in an
  // inconsistent state.
  function goTo(index) {
    if (
      typeof index !== "number" ||
      !Number.isInteger(index) ||
      index < 0 ||
      index >= state.totalSlides
    ) {
      return;
    }

    // Task 5.1: never land on a slide whose image failed to load. A dot for a
    // broken slide (or any stale target) is simply ignored. (Requirement 13.5)
    if (state.validIndices.indexOf(index) === -1) {
      return;
    }

    state.currentIndex = index;
    updateSlides();
    updateDots();
    updateLiveRegion();
  }

  // Task 5.1: find the next valid slide index in a given direction (+1 = next,
  // -1 = previous), skipping any slides whose image failed to load and wrapping
  // circularly. The loop is bounded by totalSlides so it can never spin forever,
  // even if every slide is invalid. When zero or one slide remains valid there
  // is nowhere to move, so we return the current index (a no-op). (Requirement 13.5)
  function nextValidIndex(from, direction) {
    if (state.validIndices.length <= 1) {
      return state.currentIndex;
    }

    let idx = from;
    for (let step = 0; step < state.totalSlides; step++) {
      idx = (idx + direction + state.totalSlides) % state.totalSlides;
      if (state.validIndices.indexOf(idx) !== -1) {
        return idx;
      }
    }

    // No valid slide found (shouldn't happen given the guard above) — stay put.
    return state.currentIndex;
  }

  // Advance to the next valid slide, wrapping from the last back to the first
  // and skipping any broken slides.
  function next() {
    goTo(nextValidIndex(state.currentIndex, 1));
  }

  // Retreat to the previous valid slide, wrapping from the first back to the
  // last and skipping any broken slides.
  function prev() {
    goTo(nextValidIndex(state.currentIndex, -1));
  }

  // --- Accessibility guard (Task 3.3) ---
  // Report whether the user has asked the OS/browser to minimize motion.
  // When true we refuse to start auto-play so the carousel never animates on
  // its own, honoring the user's reduced-motion preference. (Requirement 12.6)
  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  // --- Auto-play (Task 3.1) ---
  // Begin auto-advancing the carousel. Guards against a single-slide (or empty)
  // carousel where cycling is meaningless, and always clears any existing timer
  // first so we never leak or run duplicate intervals (single-interval
  // invariant). Sets isPlaying=true / isPaused=false to reflect the running
  // state. (Requirement 1.1)
  //
  // Respects the user's reduced-motion preference: when active we do not start
  // auto-play at all. Placing the guard here means every entry point (the
  // IntersectionObserver path and the no-observer fallback) honors it.
  // (Requirement 12.6)
  function startAutoPlay() {
    if (prefersReducedMotion()) return;
    if (state.totalSlides <= 1) return;

    clearInterval(state.timerId);
    state.timerId = setInterval(next, AUTOPLAY_INTERVAL);
    state.isPlaying = true;
    state.isPaused = false;
  }

  // Pause auto-advancement (e.g., tab hidden or focus inside the hero). Clears
  // the active interval and records that we are paused so resumeAutoPlay() knows
  // it can safely restart. (Requirement 1.5)
  function pauseAutoPlay() {
    clearInterval(state.timerId);
    state.timerId = null;
    state.isPlaying = false;
    state.isPaused = true;
  }

  // Resume auto-advancement after a system-initiated pause (tab visible again /
  // focus leaves the hero). Only acts when currently paused, restarting a fresh
  // interval from the current slide. Reuses the single-interval guard by
  // clearing any stray timer before starting. (Requirement 1.5)
  function resumeAutoPlay() {
    if (!state.isPaused) return;
    if (state.totalSlides <= 1) return;

    clearInterval(state.timerId);
    state.timerId = setInterval(next, AUTOPLAY_INTERVAL);
    state.isPlaying = true;
    state.isPaused = false;
  }

  // Restart the countdown from now. Called after a user interaction so the next
  // auto-advance is a full interval away from the moment of interaction. Only
  // meaningful while auto-play is active; otherwise there is nothing to reset.
  // (Requirement 1.2)
  function resetTimer() {
    if (!state.isPlaying) return;

    clearInterval(state.timerId);
    state.timerId = setInterval(next, AUTOPLAY_INTERVAL);
  }

  // --- Event handlers (implemented in Tasks 3.x & 4.x) ---
  // Task 4.1: handle a click on either navigation arrow. The arrows are
  // <button> elements, so Enter/Space activate them natively via the click
  // event — no extra key handling is needed here. Every user-triggered
  // navigation resets the auto-play countdown so the next auto-advance is a
  // full interval away from the interaction. (Requirements 2.3, 2.4, 12.5)
  function onArrowClick(direction) {
    if (direction === "next") {
      next();
    } else if (direction === "prev") {
      prev();
    } else {
      return;
    }
    resetTimer();
  }

  // Task 4.2: direct dot navigation. Jump straight to the slide represented by
  // the clicked/tapped indicator dot, then reset the auto-play countdown so the
  // next auto-advance is a full interval away from the interaction. The dots are
  // <button> elements, so Enter/Space activate them natively via the click
  // event — no extra key handling is required here.
  // (Requirements 3.4, 3.5, 3.6, 12.5)
  function onDotClick(index) {
    goTo(index);
    resetTimer();
  }

  // Task 4.1: keyboard navigation while focus is within the hero region.
  // Right arrow advances, Left arrow retreats. preventDefault() stops the
  // browser from scrolling the page on these keys, and resetTimer() keeps the
  // auto-play cadence consistent with other user interactions.
  // (Requirements 2.6, 12.7)
  function onKeydown(e) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
      resetTimer();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
      resetTimer();
    }
  }

  // Task 4.3: begin tracking a touch gesture. Record the initial touch point
  // and seed current == start so a touchend with no intervening touchmove
  // yields a zero displacement (no navigation). (Requirements 4.1)
  function onSwipeStart(e) {
    const touch = e.touches && e.touches[0];
    if (!touch) return;

    swipe.startX = touch.clientX;
    swipe.startY = touch.clientY;
    swipe.currentX = touch.clientX;
    swipe.currentY = touch.clientY;
    swipe.isTracking = true;
  }

  // Task 4.3: track the moving touch and, once the gesture reads as horizontal
  // (|deltaX| > |deltaY|), prevent the browser's default vertical scroll so the
  // swipe drives the carousel instead of the page. Requires the listener to be
  // registered with { passive: false } for preventDefault to take effect.
  // (Requirements 4.1, 4.8)
  function onSwipeMove(e) {
    if (!swipe.isTracking) return;

    const touch = e.touches && e.touches[0];
    if (!touch) return;

    swipe.currentX = touch.clientX;
    swipe.currentY = touch.clientY;

    const deltaX = swipe.currentX - swipe.startX;
    const deltaY = swipe.currentY - swipe.startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
    }
  }

  // Task 4.3: evaluate the completed gesture. A horizontal swipe past the
  // threshold navigates: left (deltaX < 0) advances, right (deltaX > 0)
  // retreats — wrapping is handled by next()/prev(). Sub-threshold or
  // vertical-dominant gestures are no-ops (the opacity carousel needs no
  // position reset). resetTimer() keeps the auto-play cadence consistent with
  // other user interactions. Uses the tracked current* values rather than
  // e.touches, which is empty on touchend. (Requirements 4.2, 4.3, 4.5, 4.6, 4.7)
  function onSwipeEnd(e) {
    void e;
    if (!swipe.isTracking) return;

    const deltaX = swipe.currentX - swipe.startX;
    const deltaY = swipe.currentY - swipe.startY;

    if (
      Math.abs(deltaX) > SWIPE_THRESHOLD &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      if (deltaX < 0) {
        next();
      } else {
        prev();
      }
      resetTimer();
    }

    swipe.isTracking = false;
  }

  // Task 3.3: pause auto-play while the tab/document is hidden and resume it
  // when the tab becomes visible again, so no interval fires against an off-
  // screen page and cycling continues on return. (Requirements 1.5, 12.8)
  function onVisibilityChange() {
    if (document.hidden) {
      pauseAutoPlay();
    } else {
      resumeAutoPlay();
    }
  }

  // Task 3.3: pause auto-advance whenever focus lands anywhere inside the hero
  // (e.g., a user tabs onto an arrow or dot) so slides don't shift out from
  // under keyboard users. (Requirements 1.5, 12.8)
  function onFocusIn() {
    pauseAutoPlay();
  }

  // Task 3.3: resume auto-advance only when focus truly leaves the hero. The
  // focusout event also fires when focus moves between children of the hero;
  // in that case relatedTarget (the element receiving focus) is still inside
  // dom.carousel, so we keep auto-play paused. (Requirements 1.5, 12.8)
  function onFocusOut(e) {
    const nextTarget = e && e.relatedTarget;
    if (nextTarget && dom.carousel && dom.carousel.contains(nextTarget)) {
      return;
    }
    resumeAutoPlay();
  }

  // Task 3.2: start/stop auto-play based on hero visibility. The observer is
  // configured with threshold 0.5, so we treat the hero as "on screen" when it
  // is intersecting and at least 50% visible. Entering that state starts
  // auto-play; scrolling out (no longer intersecting) pauses it so no timer
  // runs while the carousel is off screen. (Requirement 1.1)
  function onIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        startAutoPlay();
      } else {
        pauseAutoPlay();
      }
    });
  }

  // --- Image error handling (Task 5.1) ---
  // Report whether an <img> has already loaded successfully. Covers both the
  // "not finished yet" case (complete === false) and the "finished but broken"
  // case (complete === true but naturalWidth === 0). (Requirement 13.5)
  function isImageLoaded(img) {
    return !!img && img.complete && img.naturalWidth > 0;
  }

  // First-slide fallback: the hero cannot show its primary image, so hide the
  // entire slides layer and let the gradient .hero-overlay sit on the carousel's
  // solid fallback background, keeping the text legible. Idempotent — repeated
  // calls (timeout + error) are harmless. (Requirement 13.5)
  function applyFirstImageFallback() {
    // Stop the guard timer; the outcome is now decided.
    clearTimeout(state.firstImageTimerId);
    state.firstImageTimerId = null;

    if (dom.slidesContainer && dom.slidesContainer.style.display !== "none") {
      dom.slidesContainer.style.display = "none";
      console.warn(
        "[hero] First slide image failed to load; falling back to gradient background."
      );
    }
  }

  // Rebuild state.validIndices from the slides that have NOT been marked failed.
  // Keeps ascending order so navigation wrapping stays predictable. (Req 13.5)
  function rebuildValidIndices() {
    state.validIndices = [];
    dom.slides.forEach(function (slide, i) {
      if (!slide.classList.contains("is-failed")) {
        state.validIndices.push(i);
      }
    });
  }

  // Handle a failed load for a subsequent slide (index >= 1). Mark and hide the
  // broken slide, drop it from the navigable set, and — if it happened to be the
  // active slide — advance to the nearest remaining valid slide. (Requirement 13.5)
  function onImageError(e) {
    const img = e && e.target;
    const index = dom.slides.indexOf(img);
    if (index === -1) return;

    // The first slide has its own dedicated fallback path.
    if (index === 0) {
      applyFirstImageFallback();
      return;
    }

    if (img.classList.contains("is-failed")) return; // already handled

    console.warn(
      "[hero] Slide image " + (index + 1) + " failed to load; skipping it."
    );

    img.classList.add("is-failed");
    img.classList.remove("is-active");
    img.style.display = "none";
    rebuildValidIndices();

    // If the broken slide was the active one, move to a valid neighbour so the
    // carousel never rests on an empty slide.
    if (state.currentIndex === index) {
      goTo(nextValidIndex(index, 1));
    }
  }

  // Wire per-image error/load listeners and the first-image 5s timeout. Called
  // once from init() after the DOM is cached. (Requirement 13.5)
  function setupImageErrorHandling() {
    const firstImg = dom.slides[0];

    if (firstImg) {
      // If the first image is already broken by the time we run, fall back now.
      if (firstImg.complete && firstImg.naturalWidth === 0) {
        applyFirstImageFallback();
      } else if (!isImageLoaded(firstImg)) {
        // Otherwise arm a 5s timer; if the image still hasn't loaded, fall back.
        state.firstImageTimerId = setTimeout(function () {
          if (!isImageLoaded(firstImg)) {
            applyFirstImageFallback();
          }
        }, FIRST_IMAGE_TIMEOUT);
      }

      // Immediate fallback if the first image errors before the timer fires.
      firstImg.addEventListener("error", applyFirstImageFallback);
      // A successful load cancels the pending fallback timer.
      firstImg.addEventListener("load", function () {
        clearTimeout(state.firstImageTimerId);
        state.firstImageTimerId = null;
      });
    }

    // Subsequent slides: a load failure removes them from navigation.
    dom.slides.forEach(function (img, i) {
      if (i === 0) return;
      img.addEventListener("error", onImageError);
      // Catch images that already failed before listeners were attached.
      if (img.complete && img.naturalWidth === 0) {
        onImageError({ target: img });
      }
    });
  }

  // --- Init ---
  function init() {
    // Shared/deferred script: safely no-op when the carousel is not present.
    const carousel = document.querySelector("[data-hero-carousel]");
    if (!carousel) return;

    cacheDom(carousel);

    // No slides means nothing to drive — bail out gracefully.
    if (state.totalSlides === 0) return;

    setupInitialState();
    setupImageErrorHandling();
    bindEvents();
    setupObserver();
  }

  // Wire the visibility/focus pause listeners (Task 3.3). Auto-play pauses when
  // the tab is hidden or focus enters the hero, and resumes when the tab is
  // visible again or focus leaves the hero entirely. (Requirements 1.5, 12.8)
  function bindEvents() {
    document.addEventListener("visibilitychange", onVisibilityChange);
    dom.carousel.addEventListener("focusin", onFocusIn);
    dom.carousel.addEventListener("focusout", onFocusOut);

    // Task 4.1: arrow buttons + keyboard navigation. Arrows may be absent in
    // some markup, so guard against null before wiring click handlers.
    if (dom.prevArrow) {
      dom.prevArrow.addEventListener("click", function () {
        onArrowClick("prev");
      });
    }
    if (dom.nextArrow) {
      dom.nextArrow.addEventListener("click", function () {
        onArrowClick("next");
      });
    }

    // Attach keydown to the carousel so Left/Right arrows navigate whenever
    // focus is inside the hero region. (Requirements 2.6, 12.7)
    dom.carousel.addEventListener("keydown", onKeydown);

    // Task 4.2: indicator dots. Each dot navigates directly to its slide. As
    // <button> elements they activate on Enter/Space natively, so a single
    // click listener covers both pointer and keyboard activation.
    // (Requirements 3.4, 3.5, 3.6, 12.5)
    dom.dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        onDotClick(i);
      });
    });

    // Task 4.3: swipe gestures. Feature-detected — only wire touch listeners on
    // touch-capable devices. touchmove uses { passive: false } so onSwipeMove
    // can call preventDefault() to block vertical page scroll during a
    // horizontal swipe (Requirement 4.8). touchstart stays passive since it
    // never prevents default. (Requirements 4.1–4.8)
    if ("ontouchstart" in window) {
      dom.carousel.addEventListener("touchstart", onSwipeStart, {
        passive: true
      });
      dom.carousel.addEventListener("touchmove", onSwipeMove, {
        passive: false
      });
      dom.carousel.addEventListener("touchend", onSwipeEnd);
    }
  }

  // Wire up auto-play triggering based on hero visibility (Requirement 1.1).
  // With IntersectionObserver, auto-play starts once the hero is ≥50% visible
  // and pauses when it scrolls out of view (see onIntersection). When the API
  // is unavailable, fall back to starting auto-play immediately on init so the
  // carousel still cycles. (Note: the prefers-reduced-motion guard is added by
  // Task 3.3.)
  function setupObserver() {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(onIntersection, {
        threshold: 0.5
      });
      observer.observe(dom.carousel);
    } else {
      startAutoPlay();
    }
  }

  // Query and cache all carousel DOM elements.
  function cacheDom(carousel) {
    dom.carousel = carousel;
    dom.slides = Array.from(carousel.querySelectorAll(".hero-slide"));
    dom.dots = Array.from(carousel.querySelectorAll(".hero-dot"));
    dom.prevArrow = carousel.querySelector(".hero-arrow-prev");
    dom.nextArrow = carousel.querySelector(".hero-arrow-next");
    dom.liveRegion = carousel.querySelector("[data-hero-live]");
    dom.slidesContainer = carousel.querySelector(".hero-slides");

    state.totalSlides = dom.slides.length;

    // Task 5.1: every slide starts navigable; entries are pruned as images
    // fail to load. (Requirement 13.5)
    state.validIndices = dom.slides.map(function (_slide, i) {
      return i;
    });
  }

  // Derive the starting index from the DOM (the markup marks the first slide
  // active) and normalize state so exactly one slide is the active one.
  function setupInitialState() {
    const activeIndex = dom.slides.findIndex((slide) =>
      slide.classList.contains("is-active")
    );

    state.currentIndex = activeIndex >= 0 ? activeIndex : 0;
  }

  // Guard DOMContentLoaded: run immediately if the document is already parsed.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
