# Implementation Plan: Visual Refinement Sections

## Overview

Implementação das melhorias visuais em seções específicas do site Grupo ImperAR. O plano segue uma abordagem incremental: primeiro o gradiente global (base visual), depois os icon cards, a timeline com ícones, e por fim os hover animations da página Sobre. Cada etapa é verificável isoladamente.

## Tasks

- [x] 1. Apply global diagonal gradient and remove section backgrounds
  - [x] 1.1 Add global gradient and min-height to body in css/styles.css
    - Modify the existing `body` rule in `css/styles.css` to replace `background: var(--c-white)` with `background: linear-gradient(to bottom right, #ffffff 0%, #e8f7fd 60%, rgba(58, 174, 220, 0.03) 100%)`
    - Add `min-height: 100vh` to the body rule
    - _Requirements: 3.1, 3.7_

  - [x] 1.2 Remove section background classes from index.html
    - Remove `bg-gradient-to-b from-white to-ice/20` from the "Por que escolher" section
    - Remove `bg-gray-light` from the "Como trabalhamos" section
    - Remove `bg-gradient-to-b from-ice to-primary/5` from the CTA section at the bottom
    - Preserve `bg-gradient-to-br from-primary via-primary-dark to-deep` on the hero section
    - Preserve `bg-deep` on the footer
    - Preserve the portfolio section gradient (`bg-gradient-to-b from-white via-ice/10 to-white`)
    - _Requirements: 3.2, 3.3, 3.4, 3.6_

  - [x] 1.3 Remove section background classes from about.html
    - Remove `bg-gradient-to-b from-white to-ice/20` from the Missão/Visão/Valores section
    - Remove `bg-gradient-to-b from-gray-light to-ice/20` from the "O que você pode esperar" section
    - Remove `bg-gradient-to-b from-ice to-primary/5` from the CTA section
    - Preserve `bg-deep` on the footer
    - _Requirements: 3.2, 3.3, 3.4, 3.6_

  - [x] 1.4 Ensure services.html and contact.html inherit the global gradient
    - Verify no conflicting body background styles exist in these pages
    - Remove any section-level background classes that conflict with the global gradient (if present), excluding hero and footer backgrounds
    - _Requirements: 3.6_

- [x] 2. Refactor "Por que escolher" cards to icon cards in index.html
  - [x] 2.1 Replace image cards with icon cards structure
    - Replace each `<article>` in the "Por que escolher" grid with the icon card component from design
    - Remove `<div class="h-60 overflow-hidden"><img ...></div>` from each card
    - Add `group` class to each article for hover interactions
    - Add Icon_Container: `<div class="w-[60px] h-[60px] rounded-full bg-ice flex items-center justify-center mx-auto mb-6 transition-colors duration-200 group-hover:bg-primary" aria-hidden="true">`
    - Use vertical centered layout with `p-6 text-center`
    - Add `hover:-translate-y-1` to each card for lift effect
    - _Requirements: 1.1, 1.2, 1.6, 1.8, 1.9_

  - [x] 2.2 Add SVG icons for each benefit card
    - "Equipe Especializada": Shield icon (`<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`) with `stroke-width="1.75"` and `class="w-7 h-7 text-primary transition-colors duration-200 group-hover:text-white"`
    - "Atendimento Ágil": Lightning bolt icon (`<polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`)
    - "Qualidade Garantida": Award icon (`<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>`)
    - All icons: `xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"`
    - _Requirements: 1.3, 1.4, 1.5, 1.7, 1.10_

- [x] 3. Refactor "Como trabalhamos" timeline to use icons in index.html
  - [x] 3.1 Replace step numbers with SVG icons in timeline circles
    - Replace "01" text with magnifying glass SVG: `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`
    - Replace "02" text with pen tool SVG: `<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>`
    - Replace "03" text with wrench SVG: `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`
    - All icons: `class="w-8 h-8 text-primary"` with `stroke-width="1.75"`
    - Remove `text-primary text-3xl font-semibold font-heading` from the circle divs
    - Add hover effect: `hover:bg-primary/10 hover:shadow-[0_0_0_4px_rgba(58,174,220,0.15)]` with `transition-all duration-200`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7, 2.9_

  - [x] 3.2 Remove timeline step images
    - Remove `<img>` elements from each timeline step (the ones with `aspect-[16/9]` class)
    - Remove `mb-6` from the paragraph tags that preceded the images
    - _Requirements: 2.8_

- [x] 4. Checkpoint - Verify index.html changes
  - Ensure the Tailwind build compiles without errors: `npx tailwindcss -i css/input.css -o css/output.css`
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Enhance about page card hover animations
  - [x] 5.1 Add hover translateY to Missão/Visão/Valores cards
    - Add `hover:-translate-y-1` to each `<article>` in the Missão/Visão/Valores grid
    - Ensure existing `transition-all duration-200` covers the transform property
    - Verify `border-l-4 border-l-primary` accent is preserved
    - _Requirements: 4.1, 4.5, 4.6_

  - [x] 5.2 Add group hover to "O que você pode esperar" cards
    - Add `group` class to each card wrapper `<div>` in the "O que você pode esperar" section
    - Add `hover:-translate-y-1` and `transition-all duration-200` to each card wrapper
    - Add `transition-colors duration-200 group-hover:bg-primary` to each Icon_Container div (the `w-14 h-14 rounded-full bg-ice` elements)
    - Add `transition-colors duration-200 group-hover:text-white` to each SVG icon inside the containers
    - _Requirements: 4.2, 4.3, 4.6_

- [x] 6. Final checkpoint - Build and verify all changes
  - Run `npx tailwindcss -i css/input.css -o css/output.css` to rebuild CSS
  - Verify no modifications to services.html service cards, tailwind.config.js, header, footer structure, or portfolio grid
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- This feature is purely visual (HTML + CSS/Tailwind) — no JavaScript changes required
- The design specifies inline SVG icons to avoid external dependencies
- `group-hover` pattern is used for icon color transitions within cards
- The global gradient is applied via `css/styles.css` for consistency across all pages
- Property-based tests are not applicable for this feature (UI rendering only)
- Verification is done via Tailwind build compilation and visual inspection
- Each task references specific requirements for traceability

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1", "3.1"] },
    { "id": 3, "tasks": ["2.2", "3.2"] },
    { "id": 4, "tasks": ["5.1", "5.2"] }
  ]
}
```
