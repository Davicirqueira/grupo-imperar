# Implementation Plan: Hero Section Carousel

## Overview

This plan implements the full-viewport hero section carousel for the Grupo ImperAR homepage. Development follows a standalone-first approach: build and validate the carousel in isolation (`hero.html`), then integrate into `index.html`. All code uses vanilla HTML, CSS, and JavaScript with no external libraries.

## Tasks

- [x] 1. Create standalone HTML structure and CSS foundation
  - [x] 1.1 Create `hero.html` with complete carousel HTML markup
    - Create standalone page referencing `css/styles.css` and `js/hero.js`
    - Include all semantic elements: `role="region"`, `aria-label`, `aria-live` region
    - Add 4 slide `<img>` elements (first with `loading="eager"`, rest `loading="lazy"`)
    - Add navigation arrows with SVG chevrons and `aria-label` attributes
    - Add indicator dots with `role="tablist"`, individual `role="tab"`, and `aria-label` per dot
    - Add hero text content (heading, subtitle, CTA buttons)
    - Add `<script src="js/hero.js" defer></script>`
    - _Requirements: 5.1, 5.2, 8.4, 8.5, 10.1, 10.4, 12.2, 12.3, 12.4, 13.1, 13.2, 13.4, 15.1, 15.2_

  - [x] 1.2 Add hero carousel CSS block to `css/styles.css`
    - Add section comment header `/* ====== Hero Carousel ====== */`
    - Implement `.hero-carousel` container: `position: relative`, `min-height: 100vh` / `100dvh`, `overflow: hidden`
    - Implement `.hero-slides` and `.hero-slide`: absolute fill, `object-fit: cover`, opacity transitions
    - Implement `.hero-overlay`: horizontal gradient using `--c-deep` and `--c-sky` with specified alpha values
    - Implement `.hero-body` and `.hero-content`: relative positioning, left alignment, responsive max-width
    - Implement `.hero-heading` and `.hero-subtitle`: Barlow 700 / Inter 400, `clamp()` font sizes, white color
    - Implement `.hero-actions` and CTA button styles (`.hero-btn-primary`, `.hero-btn-secondary`)
    - Implement `.hero-arrow` styles: absolute positioned, vertically centered, hover/focus transitions, hidden below 768px
    - Implement `.hero-dots` and `.hero-dot`: bottom-left position, 44×44px touch targets, active state (pill shape)
    - Implement `.hero-controls` layout
    - Add `will-change: opacity` and `transform: translateZ(0)` for GPU acceleration on slides
    - Add `prefers-reduced-motion` media query to disable transitions
    - Add responsive rules for mobile (<768px), tablet (768-1023px), and desktop (≥1024px)
    - Use only CSS custom properties from design tokens (`--c-*`, `--space-*`, etc.)
    - _Requirements: 2.1, 2.2, 2.5, 3.2, 3.3, 5.4, 5.5, 5.6, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3, 10.2, 10.3, 11.1, 11.2, 11.3, 11.4, 13.3, 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 2. Implement carousel JavaScript core logic
  - [x] 2.1 Create `js/hero.js` with IIFE structure and state management
    - Create IIFE wrapper with state object: `currentIndex`, `totalSlides`, `isPlaying`, `isPaused`, `timerId`, `transitionDuration`
    - Implement `init()` function that runs on `DOMContentLoaded`
    - Query all DOM elements using `data-hero-carousel` and class selectors
    - Set up initial state from DOM (count slides, verify first slide is active)
    - _Requirements: 15.4_

  - [x] 2.2 Implement core navigation functions (`goTo`, `next`, `prev`)
    - `goTo(index)`: update `currentIndex`, call `updateSlides()`, `updateDots()`, `updateLiveRegion()`
    - `next()`: call `goTo((currentIndex + 1) % totalSlides)`
    - `prev()`: call `goTo((currentIndex - 1 + totalSlides) % totalSlides)`
    - `updateSlides()`: toggle `.is-active` class on slide elements
    - `updateDots()`: toggle `.is-active` and `aria-current` on dot elements
    - `updateLiveRegion()`: set textContent to `"Slide {n} de {total}"`
    - _Requirements: 1.3, 1.4, 2.3, 2.4, 3.4, 12.1, 12.3_

  - [ ]* 2.3 Write property test: circular navigation (Property 1)
    - **Property 1: Slide navigation is circular**
    - Test that `next()` from any index i produces `(i + 1) % N` and `prev()` produces `(i - 1 + N) % N`
    - Use fast-check with arbitrary integers in range [0, N-1] for N in [2, 20]
    - **Validates: Requirements 1.4, 2.3, 2.4, 4.2, 4.3, 4.6, 4.7**

  - [ ]* 2.4 Write property test: dot-slide synchronization (Property 3)
    - **Property 3: Active slide indicator synchronization**
    - Test that after `goTo(i)`, exactly one dot has `.is-active` and `aria-current="true"` at position i
    - Use fast-check with arbitrary index in [0, N-1]
    - **Validates: Requirements 3.3, 12.3**

  - [ ]* 2.5 Write property test: dot count equals slide count (Property 4)
    - **Property 4: Indicator dot count equals slide count**
    - Test that rendered dot elements count always equals slide image elements count
    - **Validates: Requirements 3.1**

  - [ ]* 2.6 Write property test: direct dot navigation (Property 5)
    - **Property 5: Direct dot navigation targets correct slide**
    - Test that clicking dot at index i results in `currentIndex === i`
    - Use fast-check with arbitrary index in [0, N-1]
    - **Validates: Requirements 3.4**

  - [ ]* 2.7 Write property test: aria-live announcement (Property 8)
    - **Property 8: Aria-live region announcement on slide change**
    - Test that after `goTo(i)`, live region text equals `"Slide {i+1} de {N}"`
    - Use fast-check with arbitrary index and total
    - **Validates: Requirements 12.1**

- [x] 3. Implement auto-play and visibility handling
  - [x] 3.1 Implement auto-play functions (`startAutoPlay`, `pauseAutoPlay`, `resumeAutoPlay`, `resetTimer`)
    - `startAutoPlay()`: set `isPlaying = true`, start `setInterval` at 6000ms calling `next()`
    - `pauseAutoPlay()`: clear interval, set `isPaused = true`
    - `resumeAutoPlay()`: if not `isPaused` by user, restart interval
    - `resetTimer()`: clear current interval, start new 6000ms interval
    - _Requirements: 1.1, 1.2, 1.5_

  - [x] 3.2 Implement IntersectionObserver for auto-play trigger
    - Create observer with `threshold: 0.5` on the hero container
    - Start auto-play when hero is ≥50% visible, stop when scrolled out
    - Fallback: if `IntersectionObserver` not supported, start auto-play on `DOMContentLoaded`
    - _Requirements: 1.1_

  - [x] 3.3 Implement visibility and focus pause logic
    - Listen to `document.visibilitychange`: pause when `document.hidden`, resume when visible
    - Listen to `focusin`/`focusout` on hero container: pause on focus in, resume on focus out
    - Check `prefers-reduced-motion: reduce`: if active, do not start auto-play
    - _Requirements: 1.5, 12.6, 12.8_

  - [ ]* 3.4 Write property test: timer reset on interaction (Property 2)
    - **Property 2: Auto-play timer resets on any user interaction**
    - Test that any interaction (arrow click, dot click, swipe, keyboard) cancels existing timer and starts fresh 6s interval
    - Use fast-check to generate random interaction sequences
    - **Validates: Requirements 1.2**

- [x] 4. Implement user interaction handlers
  - [x] 4.1 Implement arrow click and keyboard event handlers
    - Add click listeners to prev/next arrow buttons
    - Add `keydown` listener: Left arrow → `prev()`, Right arrow → `next()`
    - Ensure arrows are focusable and activate on Enter/Space
    - Call `resetTimer()` on every user-triggered navigation
    - _Requirements: 2.3, 2.4, 2.6, 12.5, 12.7_

  - [x] 4.2 Implement dot click handlers
    - Add click listeners to each dot button
    - On click, call `goTo(dotIndex)` and `resetTimer()`
    - Ensure dots are focusable and activate on Enter/Space
    - _Requirements: 3.4, 3.5, 3.6, 12.5_

  - [x] 4.3 Implement swipe gesture handler
    - Track `touchstart`, `touchmove`, `touchend` events on hero container
    - Calculate horizontal and vertical displacement
    - Trigger `next()` on left swipe > 50px (where `abs(deltaX) > abs(deltaY)`)
    - Trigger `prev()` on right swipe > 50px (where `abs(deltaX) > abs(deltaY)`)
    - Call `preventDefault()` on `touchmove` when horizontal swipe detected to prevent scroll
    - Do nothing if displacement ≤ 50px
    - Feature-detect touch support via `'ontouchstart' in window`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

  - [ ]* 4.4 Write property test: swipe threshold enforcement (Property 6)
    - **Property 6: Swipe threshold enforcement**
    - Test that swipes with `abs(deltaX) ≤ 50` do not change `currentIndex`
    - Use fast-check to generate random deltaX values in [-50, 50]
    - **Validates: Requirements 4.5**

  - [ ]* 4.5 Write property test: scroll prevention during horizontal swipe (Property 7)
    - **Property 7: Scroll prevention during horizontal swipe**
    - Test that when `abs(deltaX) > abs(deltaY)`, `preventDefault` is called on the touchmove event
    - Use fast-check with arbitrary deltaX/deltaY pairs where `abs(deltaX) > abs(deltaY)`
    - **Validates: Requirements 4.8**

- [x] 5. Implement error handling and image fallback
  - [x] 5.1 Implement image error handling and fallback
    - Add `onerror` handler on each slide image
    - If first image fails within 5s: hide slides container, show overlay as solid gradient background
    - If subsequent images fail: skip them in navigation, reduce effective `totalSlides`
    - Log warnings to console for failed images
    - _Requirements: 13.5_

- [x] 6. Checkpoint — Validate standalone carousel
  - Ensure all tests pass, ask the user if questions arise.
  - Open `hero.html` in browser and verify: auto-play, arrow navigation, dot navigation, swipe, keyboard accessibility, reduced-motion behavior, and image fallback

- [x] 7. Integrate into index.html and update header behavior
  - [x] 7.1 Replace existing hero section in `index.html` with carousel markup
    - Remove the current hero `<section>` (gradient + typewriter)
    - Paste the carousel HTML structure from `hero.html`
    - Add `<script src="js/hero.js" defer></script>` before closing `</body>`
    - _Requirements: 15.2_

  - [x] 7.2 Update `js/main.js` for transparent header integration
    - Modify `setupStickyHeader()` to add `.header-transparent` class when scroll is at 0 and hero is present
    - Remove `.header-transparent` and apply existing scroll behavior when scroll > 50px
    - Remove `setupTypewriter` function and its invocation (no longer needed)
    - _Requirements: 9.1, 9.2, 9.4_

  - [x] 7.3 Add header transparent state CSS rules to `css/styles.css`
    - Add `.header-transparent` styles: background transparent, no box-shadow, white text/logo
    - Add CSS transition for background/color change (≤ 300ms)
    - Ensure 4.5:1 contrast ratio for header text over hero gradient
    - _Requirements: 9.1, 9.2, 9.3, 9.5_

  - [ ]* 7.4 Write property test: text content position invariant (Property 9)
    - **Property 9: Text content position invariant during transitions**
    - Test that hero text container's `offsetTop`, `offsetLeft`, and `opacity` remain constant during any slide transition
    - Use jsdom or DOM simulation to verify position stability across transitions
    - **Validates: Requirements 5.3**

- [x] 8. Final checkpoint — Full integration validation
  - Ensure all tests pass, ask the user if questions arise.
  - Verify carousel works correctly within `index.html` alongside existing page content
  - Verify header transparent/solid transition on scroll
  - Verify no CSS conflicts with existing components

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using fast-check
- Unit tests validate specific examples and edge cases
- The standalone `hero.html` approach (Requirement 15) enables isolated testing before integration
- All CSS must use existing design tokens (`--c-*`, `--space-*`) per Requirement 11.1
- The IIFE pattern in `js/hero.js` ensures zero global namespace pollution per Requirement 15.4

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "3.1"] },
    { "id": 3, "tasks": ["2.3", "2.4", "2.5", "2.6", "2.7", "3.2", "3.3"] },
    { "id": 4, "tasks": ["3.4", "4.1", "4.2", "4.3"] },
    { "id": 5, "tasks": ["4.4", "4.5", "5.1"] },
    { "id": 6, "tasks": ["7.1"] },
    { "id": 7, "tasks": ["7.2", "7.3"] },
    { "id": 8, "tasks": ["7.4"] }
  ]
}
```
