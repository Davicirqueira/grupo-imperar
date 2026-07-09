# Requirements Document

## Introduction

This document specifies the requirements for a Hero Section with an image carousel for the Grupo ImperAR homepage. The Hero Section serves as the primary visual introduction to the website, communicating premium quality, comfort, and technical expertise in HVAC services. The component uses full-viewport background images with a fade carousel, fixed text content aligned to the left, and call-to-action buttons — all built with vanilla HTML, CSS, and JavaScript consistent with the existing project architecture.

## Glossary

- **Hero_Section**: The full-viewport introductory section at the top of the homepage that contains the carousel, text content, navigation controls, and calls to action.
- **Carousel**: The automatic image slideshow system that cycles through background slides using fade transitions.
- **Slide**: A single full-viewport background image within the Carousel, displayed behind the text content and overlay.
- **Overlay**: A translucent gradient layer rendered above each Slide using brand colors to ensure text legibility without obscuring the photography entirely.
- **Navigation_Arrows**: Left and right arrow controls positioned at the lateral extremes of the Hero_Section, allowing manual slide advancement on Desktop and Tablet viewports.
- **Indicator_Dots**: Clickable dot elements representing each Slide, allowing direct navigation to a specific Slide and indicating the currently active Slide.
- **Auto_Play**: The automatic cycling behavior that advances the Carousel to the next Slide at a defined interval.
- **Swipe_Handler**: The vanilla JavaScript touch event system that detects horizontal swipe gestures on mobile devices to navigate between Slides.
- **Site_Header**: The global navigation bar that overlays the Hero_Section transparently and acquires a solid background on scroll.
- **Primary_CTA**: The primary call-to-action button labeled "Solicite um Orçamento" linking to contact.html.
- **Secondary_CTA**: The secondary call-to-action button labeled "Conheça nossos serviços" linking to the #projetos section.
- **Desktop**: Viewport width ≥ 1024px.
- **Tablet**: Viewport width between 768px and 1023px.
- **Mobile**: Viewport width < 768px.

## Requirements

### Requirement 1: Carousel Auto-Play Behavior

**User Story:** As a visitor, I want the hero images to cycle automatically, so that I can see the variety of premium environments without manual interaction.

#### Acceptance Criteria

1. WHEN the Hero_Section is loaded and at least 50% visible in the viewport (via Intersection Observer), THE Carousel SHALL begin Auto_Play by displaying the first Slide and advancing to the next Slide every 6 seconds.
2. WHEN a user interacts with Navigation_Arrows, Indicator_Dots, Swipe_Handler, or keyboard controls, THE Carousel SHALL reset the Auto_Play timer to 6 seconds from the moment of interaction.
3. WHEN the Carousel advances to the next Slide, THE Carousel SHALL use a CSS opacity-based fade transition with a duration between 600ms and 1000ms.
4. WHEN the Carousel reaches the last Slide, THE Carousel SHALL loop back to the first Slide on the next transition.
5. WHILE the browser tab or page is not visible (document.hidden is true), THE Carousel SHALL pause Auto_Play and resume from the current Slide when the page becomes visible again.

### Requirement 2: Manual Navigation via Arrows

**User Story:** As a desktop or tablet user, I want navigation arrows on the hero, so that I can manually browse slides at my own pace.

#### Acceptance Criteria

1. WHILE the viewport width is ≥ 768px, THE Hero_Section SHALL display Navigation_Arrows positioned at the left and right lateral extremes, vertically centered relative to the Hero_Section content area.
2. WHILE the viewport width is < 768px, THE Hero_Section SHALL hide Navigation_Arrows completely.
3. WHEN a user clicks or activates the right Navigation_Arrow, THE Carousel SHALL advance to the next Slide.
4. WHEN a user clicks or activates the left Navigation_Arrow, THE Carousel SHALL return to the previous Slide.
5. WHEN a user hovers over or focuses a Navigation_Arrow, THE Navigation_Arrow SHALL transition its opacity from 0.7 to 1.0 within 200ms to indicate interactivity.
6. THE Navigation_Arrows SHALL be keyboard-focusable and activatable via Enter or Space key.

### Requirement 3: Manual Navigation via Indicator Dots

**User Story:** As a visitor, I want indicator dots showing the current slide, so that I can jump directly to a specific slide and understand my position in the sequence.

#### Acceptance Criteria

1. THE Hero_Section SHALL display one Indicator_Dot for each Slide in the Carousel.
2. THE Indicator_Dots SHALL be positioned at the bottom-left of the Hero_Section, aligned with the text content area, with each dot meeting a minimum interactive target size of 44×44px.
3. WHEN a Slide becomes active, THE corresponding Indicator_Dot SHALL transition to an active state within 200ms to 400ms using a CSS transition, displaying a visible change in width or opacity that distinguishes it from inactive dots.
4. WHEN a user clicks or taps an Indicator_Dot, THE Carousel SHALL navigate directly to the corresponding Slide using the same CSS opacity-based fade transition defined for Carousel advancement.
5. THE Indicator_Dots SHALL be keyboard-focusable and activatable via Enter or Space key.
6. THE Indicator_Dots SHALL display a visible focus indicator when receiving keyboard focus.

### Requirement 4: Mobile Swipe Navigation

**User Story:** As a mobile user, I want to swipe left or right on the hero, so that I can browse slides using familiar touch gestures.

#### Acceptance Criteria

1. WHILE the viewport width is < 768px, THE Swipe_Handler SHALL detect horizontal swipe gestures using touchstart, touchmove, and touchend events.
2. WHEN a user swipes left with a horizontal displacement greater than 50px and the horizontal displacement exceeds the vertical displacement, THE Carousel SHALL advance to the next Slide.
3. WHEN a user swipes right with a horizontal displacement greater than 50px and the horizontal displacement exceeds the vertical displacement, THE Carousel SHALL return to the previous Slide.
4. THE Swipe_Handler SHALL use only vanilla JavaScript without external libraries.
5. IF the horizontal displacement is less than or equal to 50px, THEN THE Swipe_Handler SHALL not trigger a slide change and SHALL return the Slide to its original position.
6. IF the user swipes left on the last Slide, THEN THE Carousel SHALL wrap around and display the first Slide.
7. IF the user swipes right on the first Slide, THEN THE Carousel SHALL wrap around and display the last Slide.
8. WHILE a swipe gesture is in progress and the horizontal displacement exceeds the vertical displacement, THE Swipe_Handler SHALL prevent vertical page scrolling for the duration of that gesture.

### Requirement 5: Fixed Text Content Display

**User Story:** As a visitor, I want to immediately understand what Grupo ImperAR offers, so that I can decide whether to engage further with the company.

#### Acceptance Criteria

1. THE Hero_Section SHALL display the heading "Instalação, Vendas e Projetos de Alto Padrão em São Paulo" using the Barlow font family with font-weight 700.
2. THE Hero_Section SHALL display the subtitle "Instalação, manutenção e suporte técnico em climatização e refrigeração para residências e empresas, com transparência e excelência do início ao fim." using the Inter font family with font-weight 400.
3. WHILE background Slide transitions are occurring, THE text content SHALL remain in a fixed position and display unchanged text without movement, opacity change, or re-render.
4. THE text content SHALL be aligned to the left side of the Hero_Section with a minimum left padding of 16px on mobile viewports (below 768px) and 64px on desktop viewports (1024px and above).
5. THE heading SHALL use a responsive font size defined with CSS clamp() that scales from a minimum of 32px (at viewport width 320px) to a maximum of 48px (at viewport width 1024px and above).
6. THE heading and subtitle SHALL be rendered in white (#FFFFFF) with the subtitle at 90% opacity, ensuring a minimum contrast ratio of 4.5:1 against the Hero_Section background.

### Requirement 6: Call-to-Action Buttons

**User Story:** As a potential client, I want clear action buttons in the hero, so that I can quickly request a quote or explore services.

#### Acceptance Criteria

1. THE Hero_Section SHALL display the Primary_CTA with the label "Solicite um Orçamento" linking to contact.html.
2. THE Hero_Section SHALL display the Secondary_CTA with the label "Conheça nossos serviços" linking to the #projetos section.
3. THE Primary_CTA SHALL use a filled button style with the --c-sky background color and --c-white text color.
4. THE Secondary_CTA SHALL use a ghost/outline button style with a border at 30% opacity of --c-white and --c-white text color.
5. THE Primary_CTA and Secondary_CTA SHALL meet a minimum touch target size of 44×44 CSS pixels (height and width).
6. WHEN a user hovers over or focuses the Primary_CTA, THE Primary_CTA SHALL transition to the --c-hover background color within 200ms.
7. WHEN a user hovers over or focuses the Secondary_CTA, THE Secondary_CTA SHALL display a semi-transparent --c-white background fill at 10% opacity within 200ms.
8. THE Primary_CTA and Secondary_CTA SHALL be displayed inline (side by side) on viewports at or above 768px and shall wrap to a stacked layout on viewports below 768px.

### Requirement 7: Background Image Overlay

**User Story:** As a visitor, I want the hero text to be clearly readable over the background images, so that I can understand the content without visual strain.

#### Acceptance Criteria

1. THE Overlay SHALL use a horizontal (left-to-right) gradient composed exclusively of translucent variations of the brand colors (--c-deep and --c-sky), without using pure black (rgb(0,0,0) or #000000).
2. THE Overlay SHALL cover the full width and height of the hero section, applying an alpha value of no less than 0.75 on the left 50% of the hero (where text content is positioned) and tapering to an alpha value of no more than 0.3 at the right edge.
3. THE Overlay SHALL allow the background photography to remain visually recognizable in at least the right 40% of the hero section, meaning distinguishable shapes and colors of the image are perceptible through the overlay at that region.
4. THE Overlay SHALL maintain a minimum contrast ratio of 4.5:1 between body text and the composite background (overlay + image), and a minimum contrast ratio of 3:1 between large text (heading at 18pt bold or larger) and the composite background, as measured against the lightest region of any active background image beneath the text area.
5. THE Overlay SHALL span the full hero section without visible hard edges or banding between gradient color stops.

### Requirement 8: Hero Section Height and Layout

**User Story:** As a visitor, I want the hero to fill my entire screen on arrival, so that I experience an immersive introduction to the brand.

#### Acceptance Criteria

1. WHILE the viewport width is ≥ 768px, THE Hero_Section SHALL have a minimum height of 100vh.
2. WHILE the viewport width is < 768px, THE Hero_Section SHALL have a minimum height of 100dvh to account for mobile browser address bars.
3. IF the text content exceeds the viewport height minus internal padding within the Hero_Section, THEN THE Hero_Section SHALL expand its height to fit all content without clipping or overflow.
4. THE Hero_Section SHALL position its top edge at 0px from the top of the browser viewport so that it renders behind the overlaying Site_Header.
5. THE Hero_Section SHALL offset its internal content from the top by at least the height of the Site_Header (64px on viewports < 1024px, 80px on viewports ≥ 1024px) to prevent text or interactive elements from being obscured by the header.

### Requirement 9: Header Integration with Hero

**User Story:** As a visitor, I want a seamless visual experience between the header and hero, so that the page feels immersive and premium.

#### Acceptance Criteria

1. WHILE the page scroll position is at 0px, THE Site_Header SHALL display with a fully transparent background and no box-shadow, visually floating over the Hero_Section.
2. WHEN the user scrolls beyond 50px from the top, THE Site_Header SHALL transition to a solid or semi-transparent background with backdrop blur, using a CSS transition of no more than 300ms.
3. THE Site_Header text, navigation links, and logo SHALL maintain a minimum contrast ratio of 4.5:1 against the transparent-state background (over the Hero_Section gradient) and against the solid-state background (over page content).
4. THE Hero_Section content SHALL apply top padding equal to or greater than the Site_Header rendered height (64px on viewports below 1024px, 80px on viewports at or above 1024px) to prevent content from being obscured by the fixed header.
5. WHEN the Site_Header is in transparent state over the Hero_Section, THE Site_Header navigation links and logo SHALL use white or light-colored text that meets criterion 3 contrast requirements against the Hero_Section dark gradient background.

### Requirement 10: Slide Images

**User Story:** As a brand owner, I want the hero to showcase premium architectural environments, so that visitors perceive the company as high-end and trustworthy.

#### Acceptance Criteria

1. THE Carousel SHALL use exactly 4 images stored in the hero-section/ folder as full-background Slides.
2. THE Slide images SHALL cover the entire Hero_Section area using CSS object-fit: cover without distortion.
3. THE Slide images SHALL be positioned using CSS object-position: center (or a per-image override) so that the main architectural subject of each photograph remains visible across all supported viewport sizes (320px to 1920px width).
4. THE first Slide image SHALL use the loading="eager" attribute to ensure it renders without waiting for lazy-loading thresholds.
5. THE Slide images SHALL have a minimum resolution of 1920×1080 pixels to prevent visible pixelation on viewports up to 1920px wide.

### Requirement 11: CSS Architecture Consistency

**User Story:** As a developer, I want the hero component to follow the existing CSS architecture, so that the codebase remains maintainable and consistent.

#### Acceptance Criteria

1. THE Hero_Section styles SHALL use only CSS custom properties defined in the project's design token system (--c-*, --space-*, --radius-*, --shadow-*, --z-*, --font-*, --container, --feedback-*) for all design-related values, while standard CSS values (inherit, auto, none, 0, percentages, calc expressions, and unitless line-heights) are permitted without tokens.
2. THE Hero_Section styles SHALL follow the existing flat kebab-case naming convention where class names use a component prefix followed by a hyphenated descriptor (e.g., .hero, .hero-content, .hero-visual, .hero-actions) and state classes use the .is-* prefix pattern.
3. THE Hero_Section SHALL use only pure CSS without preprocessors or utility-framework classes (no Tailwind).
4. THE Hero_Section styles SHALL be grouped as a single contiguous block within styles.css, preceded by a CSS comment header identifying the section, with no class selectors that depend on classes defined in other component sections.

### Requirement 12: Accessibility Compliance

**User Story:** As a user with assistive technology, I want the hero carousel to be fully accessible, so that I can perceive and navigate the content without barriers.

#### Acceptance Criteria

1. WHEN the active Slide changes, THE Carousel SHALL update an aria-live="polite" region to announce the current Slide number and total count (e.g., "Slide 2 de 4").
2. THE Navigation_Arrows SHALL include aria-label attributes indicating their function (e.g., "Próximo slide", "Slide anterior").
3. THE Indicator_Dots SHALL include aria-label attributes indicating which Slide each dot corresponds to (e.g., "Ir para slide 3") and aria-current="true" on the dot corresponding to the active Slide.
4. THE Hero_Section SHALL include a role="region" with an aria-label that identifies the component as a carousel (e.g., "Carrossel de destaques").
5. ALL interactive elements within the Hero_Section (Navigation_Arrows, Indicator_Dots, CTAs) SHALL be reachable via sequential keyboard Tab navigation and operable via Enter or Space key press.
6. IF the User has enabled prefers-reduced-motion at the operating system level, THEN THE Carousel SHALL not auto-advance slides.
7. WHEN the User activates a Navigation_Arrow or Indicator_Dot via keyboard, THE Carousel SHALL move focus to the newly active Slide content or maintain focus on the activated control.
8. WHILE Auto_Play is active, WHEN the User places keyboard focus on any interactive element within the Hero_Section, THE Carousel SHALL pause auto-advancement until focus leaves the Hero_Section.

### Requirement 13: Performance Optimization

**User Story:** As a visitor on a variable connection, I want the hero to load quickly, so that I see meaningful content without delay.

#### Acceptance Criteria

1. THE first Slide image SHALL be loaded eagerly (loading="eager" or omitting the loading attribute) to ensure the hero is visually complete on initial render without waiting for JavaScript execution.
2. THE remaining 3 Slide images SHALL use loading="lazy" or be injected via JavaScript after the initial page load to reduce initial page weight.
3. THE Carousel animations SHALL use exclusively CSS opacity and transform properties to enable GPU-accelerated rendering and avoid triggering layout recalculations during Slide transitions.
4. THE Hero_Section JavaScript SHALL be loaded with the defer attribute on its script tag to avoid blocking the initial page render.
5. IF the first Slide image fails to load within 5 seconds, THEN THE Hero_Section SHALL display the Overlay gradient as a fallback background so that the text content remains legible.
6. THE first Slide image file SHALL not exceed 300 KB in size to ensure the hero is visually complete within 3 seconds on a 3G connection (approximately 750 Kbps throughput).

### Requirement 14: Responsive Behavior

**User Story:** As a visitor on any device, I want the hero to look polished and functional, so that my experience is consistent regardless of screen size.

#### Acceptance Criteria

1. WHILE the viewport width is ≥ 1024px, THE Hero_Section SHALL display Navigation_Arrows, Indicator_Dots, and the text content aligned to the left within the container width with a maximum content width of 600px.
2. WHILE the viewport width is between 768px and 1023px, THE Hero_Section SHALL display Navigation_Arrows, Indicator_Dots, and the text content adapted to a maximum content width of 500px.
3. WHILE the viewport width is < 768px, THE Hero_Section SHALL hide Navigation_Arrows, display Indicator_Dots, enable Swipe_Handler, and adjust the text content to occupy full available width minus 32px horizontal padding.
4. THE heading font size SHALL scale responsively using CSS clamp() from a minimum of 32px to a maximum of 48px.
5. THE subtitle font size SHALL scale responsively using CSS clamp() from a minimum of 16px to a maximum of 20px.

### Requirement 15: Isolated Component Development

**User Story:** As a developer, I want the hero built as a standalone component first, so that I can test and validate it independently before integrating into the homepage.

#### Acceptance Criteria

1. THE Hero_Section SHALL be developed initially as a standalone file (hero.html) containing all necessary HTML, CSS references, and JavaScript references for independent testing.
2. THE Hero_Section HTML structure SHALL be designed for direct copy-paste integration into index.html, replacing the existing hero section without requiring modifications to surrounding markup.
3. THE Hero_Section CSS SHALL be written as a self-contained block within styles.css that does not create side effects on other page components (no global element selectors, no overrides of classes used outside the hero).
4. THE Hero_Section JavaScript SHALL be encapsulated in an IIFE or module pattern to avoid global namespace pollution, exposing no variables or functions to the window object.
