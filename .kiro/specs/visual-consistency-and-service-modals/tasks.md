# Implementation Plan: Visual Consistency and Service Modals

## Overview

This plan implements visual consistency fixes across the Grupo ImperAR website (Requirements 1–8), a reusable modal system for service cards and "Por que nos escolher" cards (Requirements 9–11), and a CSS-only rotating gradient border animation for the Why Cards (Requirement 12). All changes use vanilla HTML, CSS, and JavaScript with Tailwind utility classes from css/output.css.

## Tasks

- [x] 1. Visual consistency fixes across all pages
  - [x] 1.1 Delete css/styles.css and verify no HTML pages reference it
    - Remove css/styles.css from the repository
    - Search all HTML files (index.html, services.html, about.html, contact.html) for any `<link>` referencing css/styles.css and remove it
    - Check configuration files, build scripts, and docs for references to css/styles.css
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.2 Normalize contact.html heading size and fix form brand colors
    - Update the h1 on contact.html to use `text-4xl lg:text-5xl` classes matching services.html and about.html
    - Replace `border-gray-300` with `border-deep/16` on all form inputs
    - Replace `text-red-600` with `text-accent` on error messages
    - _Requirements: 2.1, 2.2, 5.1, 5.2, 6.1, 6.2_

  - [x] 1.3 Standardize card padding and icon container sizes
    - Audit all card components across index.html, services.html, and about.html for padding consistency (`p-6`)
    - Standardize icon container dimensions in "Por que nos escolher" section and service badges to use consistent sizing from the project spacing scale
    - _Requirements: 3.1, 3.2, 7.1, 7.2_

  - [x] 1.4 Fix portfolio grid gap and add defer to EmailJS script
    - Update the index.html portfolio grid to use `gap-6` consistently across all breakpoints (replace `md:gap-12` with `gap-6`)
    - Add the `defer` attribute to the EmailJS script tag in contact.html
    - _Requirements: 4.1, 4.2, 8.1, 8.2_

- [x] 2. Checkpoint - Verify visual fixes
  - Ensure all visual consistency changes render correctly across pages, ask the user if questions arise.

- [x] 3. Implement modal system core (JS)
  - [x] 3.1 Create modal HTML container and implement openModal/closeModal/createFocusTrap functions in js/main.js
    - Add a shared modal overlay container to both index.html and services.html with proper ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`)
    - Implement `openModal(config)` function that: populates modal content dynamically, shows the overlay with opacity transition, locks page scroll (`overflow: hidden` on body), activates focus trap, moves focus to close button within 100ms
    - Implement `closeModal(modalElement, triggerElement)` that: hides overlay, restores scroll, deactivates focus trap, restores focus to trigger element within 300ms
    - Implement `createFocusTrap(container)` that: returns `{ activate, deactivate }`, constrains Tab/Shift+Tab to focusable elements within container, wraps from last to first and first to last
    - Add event listeners for Escape key and overlay click dismissal
    - Register modal initialization in the DOMContentLoaded handler
    - _Requirements: 9.5, 9.6, 9.7, 9.8, 9.9, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

  - [ ]* 3.2 Write property test for focus trap cycling invariant
    - **Property 1: Focus trap cycling invariant**
    - For any modal with N focusable elements (N ≥ 1) and any sequence of Tab/Shift+Tab presses of length K, the focused element is always within the modal's focusable elements; Tab from last wraps to first, Shift+Tab from first wraps to last
    - **Validates: Requirements 9.9, 10.3, 11.7**

  - [ ]* 3.3 Write property test for focus restoration round-trip
    - **Property 2: Focus restoration round-trip**
    - For any triggering element T, after the modal is closed (by close button, overlay click, or Escape), `document.activeElement` equals T
    - **Validates: Requirements 10.5, 9.5, 9.6, 9.7, 11.3**

- [x] 4. Implement service card modals on services.html
  - [x] 4.1 Add data attributes and click handlers for service cards
    - Add `data-modal-image`, `data-modal-title`, and `data-modal-description` attributes to each of the 5 service card `<article>` elements on services.html
    - Write expanded descriptions (40–200 characters each) in third person with factual language and professional tone
    - Add click event listeners to each service card that call `openModal` with the card's data attributes
    - Render modal content with: image at 100% modal width, title, description paragraph, and CTA button linking to contact.html with label "Solicitar orçamento"
    - Handle missing `data-modal-*` attributes gracefully with fallback text ("Informação não disponível")
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9_

  - [ ]* 4.2 Write unit tests for service modal content rendering
    - Test that clicking each service card opens modal with correct image, title, and description
    - Test that CTA button links to contact.html
    - Test fallback text when data attributes are missing
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 5. Checkpoint - Verify service modals
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement Why Card modals on index.html
  - [x] 6.1 Add data attributes, click handlers, and pointer cursor for Why Cards
    - Add `data-modal-title` and `data-modal-description` attributes to each of the 3 Why Card `<article>` elements on index.html
    - Write expanded descriptions (minimum 2 sentences beyond the short card description) for each differential
    - Add `cursor-pointer` class to Why Cards to indicate interactivity
    - Add click event listeners that call `openModal` with the card's icon SVG, title, and expanded description
    - Modal opens within 300ms of click
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8_

  - [ ]* 6.2 Write unit tests for Why Card modals
    - Test that clicking each Why Card opens modal with correct icon, title, and expanded description
    - Test pointer cursor on hover
    - Test modal opens within 300ms
    - _Requirements: 11.1, 11.2, 11.8_

- [x] 7. Implement rotating gradient border animation for Why Cards
  - [x] 7.1 Add rotating gradient border CSS to css/animations.css and update Why Card HTML structure
    - Add `.why-card` and `.why-card-inner` classes to css/animations.css implementing the ElSombrero2 pattern with brand colors (sky #3AAEDC, deep #1A2B5C)
    - Implement `::before` pseudo-element with `conic-gradient` rotating 360° every 3s with linear timing
    - Implement `::after` pseudo-element with `filter: blur(8px)` for glow effect
    - Set `animation-play-state: paused` by default, `running` on `:hover`
    - Add `opacity: 0` by default transitioning to `opacity: 1` on hover
    - Inner content area stays white (#FFFFFF) via `.why-card-inner` with `position: relative; z-index: 1; background: #fff`
    - Add `@media (prefers-reduced-motion: reduce)` rule disabling animation (static gradient border instead)
    - Update the Why Card `<article>` elements in index.html to use `.why-card` class and wrap content in `.why-card-inner`
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

  - [ ]* 7.2 Write unit tests for rotating gradient border
    - Test that .why-card::before has correct conic-gradient
    - Test animation-play-state toggles between paused and running on hover
    - Test prefers-reduced-motion disables animation
    - _Requirements: 12.1, 12.4, 12.5, 12.7_

- [x] 8. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All code uses vanilla HTML, CSS, and JavaScript — no frameworks
- The modal system reuses a single shared container per page with dynamic content injection
- Focus trap utility is shared between Service_Modal and Why_Modal

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4"] },
    { "id": 1, "tasks": ["3.1"] },
    { "id": 2, "tasks": ["3.2", "3.3", "4.1", "6.1", "7.1"] },
    { "id": 3, "tasks": ["4.2", "6.2", "7.2"] }
  ]
}
```
