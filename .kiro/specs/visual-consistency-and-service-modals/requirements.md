# Requirements Document

## Introduction

This feature addresses visual consistency issues across the Grupo ImperAR website and introduces interactive modals for service cards (services.html) and "Por que nos escolher" cards (index.html). It also adds a rotating gradient border animation on hover for the "Por que nos escolher" cards, using brand colors. The goal is to unify the design language, eliminate dead code, and enhance user engagement through rich modal content.

## Glossary

- **Site**: The Grupo ImperAR institutional website (index.html, services.html, about.html, contact.html)
- **Service_Card**: One of the 5 clickable article cards on services.html representing a service category
- **Service_Modal**: A dialog overlay displayed when a Service_Card is clicked, containing expanded service information
- **Why_Card**: One of the 3 cards in the "Por que escolher o Grupo ImperAR" section on index.html
- **Why_Modal**: A dialog overlay displayed when a Why_Card is clicked, containing expanded content
- **Rotating_Gradient_Border**: A CSS-only animation where a gradient bar (sky → deep) rotates around a card on hover
- **Focus_Trap**: A keyboard navigation pattern that constrains Tab/Shift+Tab cycling within a modal while it is open
- **CTA_Button**: A call-to-action button labeled "Solicitar orçamento" linking to contact.html
- **Brand_Colors**: primary (#3AAEDC), deep (#1A2B5C), ice (#E8F7FD), accent (#0F6080)
- **Dead_CSS**: The css/styles.css file that is never referenced by any HTML page via a link element

## Requirements

### Requirement 1: Remove Dead CSS File

**User Story:** As a developer, I want unused files removed from the project, so that the codebase remains clean and maintainable.

#### Acceptance Criteria

1. THE Site SHALL NOT contain the file css/styles.css in the repository
2. WHEN any HTML page (index.html, services.html, about.html, contact.html) is loaded, THE Site SHALL reference only css/output.css as its stylesheet link in the `<head>` element
3. IF css/styles.css is referenced by any configuration file, build script, or documentation in the repository, THEN THE Site SHALL have those references removed or updated to reflect the file's deletion

### Requirement 2: Normalize Contact Page Heading Size

**User Story:** As a visitor, I want consistent heading sizes across subpages, so that the site feels visually cohesive.

#### Acceptance Criteria

1. THE contact.html h1 element SHALL use font size classes `text-4xl lg:text-5xl` to match services.html and about.html
2. WHEN the contact.html page is rendered, THE h1 heading SHALL appear at the same visual scale as h1 headings on other subpages

### Requirement 3: Standardize Card Padding

**User Story:** As a visitor, I want cards to have consistent internal spacing, so that the layout looks polished and intentional.

#### Acceptance Criteria

1. THE Site SHALL use a single consistent padding value (`p-6`) for all card components across index.html, services.html, and about.html
2. WHEN a card component is rendered on any page, THE card SHALL display identical internal spacing to cards on other pages

### Requirement 4: Fix Portfolio Grid Gap Inconsistency

**User Story:** As a visitor, I want the portfolio grid on index.html to have uniform spacing, so that the layout appears balanced.

#### Acceptance Criteria

1. THE index.html portfolio grid SHALL use a consistent gap value (`gap-6`) across all breakpoints
2. WHEN the portfolio grid is rendered on medium screens, THE gap between items SHALL match the gap on large screens

### Requirement 5: Replace Generic Border Color in Contact Form

**User Story:** As a visitor, I want the contact form to use brand colors, so that the form feels integrated with the site identity.

#### Acceptance Criteria

1. THE contact.html form inputs SHALL use `border-deep/16` as their default border color instead of `border-gray-300`
2. WHEN a form input is in its default (unfocused) state, THE input border SHALL render using the deep brand color at 16% opacity

### Requirement 6: Replace Generic Error Color in Contact Form

**User Story:** As a visitor, I want error messages to use brand colors, so that the visual feedback is consistent with the site palette.

#### Acceptance Criteria

1. THE contact.html form error messages SHALL use `text-accent` instead of `text-red-600`
2. WHEN a validation error is displayed, THE error text SHALL render in the accent brand color (#0F6080)

### Requirement 7: Standardize Icon Container Sizes

**User Story:** As a visitor, I want icon containers to appear uniform, so that the interface feels well-crafted.

#### Acceptance Criteria

1. THE Site SHALL use consistent icon container dimensions (width and height) for circular icon holders within card components across all pages
2. WHEN icon containers are rendered in the "Por que nos escolher" section and in service card badges, THE containers SHALL use a standardized size from the project spacing scale

### Requirement 8: Add Defer Attribute to EmailJS Script

**User Story:** As a visitor, I want the contact page to load quickly, so that I can interact with the form without delay.

#### Acceptance Criteria

1. THE contact.html EmailJS script tag SHALL include the `defer` attribute
2. WHEN contact.html is loaded, THE EmailJS script SHALL NOT block the HTML parser during page rendering

### Requirement 9: Service Card Modal Interaction

**User Story:** As a visitor, I want to click a service card to learn more about the service, so that I can make an informed decision before requesting a quote.

#### Acceptance Criteria

1. WHEN a visitor clicks a Service_Card, THE Service_Modal SHALL open displaying the service image, an expanded description text (between 40 and 200 characters), and a CTA_Button
2. THE Service_Modal image SHALL be the same image used in the corresponding Service_Card, rendered at 100% of the modal content width
3. THE Service_Modal expanded text SHALL be written in third person, use factual language without superlatives, and maintain a professional tone consistent with the brand
4. THE Service_Modal CTA_Button SHALL be an anchor element linking to contact.html with the visible label "Solicitar orçamento"
5. WHEN the close button is clicked, THE Service_Modal SHALL close and return focus to the triggering Service_Card within 300ms
6. WHEN the overlay (backdrop) outside the modal content is clicked, THE Service_Modal SHALL close and return focus to the triggering Service_Card
7. WHEN the Escape key is pressed while a Service_Modal is open, THE Service_Modal SHALL close and return focus to the triggering Service_Card
8. WHILE the Service_Modal is open, THE System SHALL prevent scrolling on the background page and set aria-modal="true" on the modal element
9. WHEN the Service_Modal opens, THE System SHALL trap keyboard focus within the modal so that Tab and Shift+Tab cycle only through the modal's focusable elements (close button and CTA_Button)

### Requirement 10: Service Modal Accessibility

**User Story:** As a visitor using assistive technology, I want the service modal to be fully accessible, so that I can navigate and interact with it using a keyboard or screen reader.

#### Acceptance Criteria

1. THE Service_Modal SHALL have `role="dialog"` and `aria-modal="true"` attributes
2. THE Service_Modal SHALL have an `aria-labelledby` attribute referencing the modal title element
3. WHILE a Service_Modal is open, THE Focus_Trap SHALL constrain Tab and Shift+Tab navigation within the modal content, wrapping focus from the last focusable element back to the first, and from the first back to the last
4. WHEN a Service_Modal opens, THE Focus_Trap SHALL move focus to the close button within 100ms of the modal becoming visible
5. WHEN a Service_Modal closes, THE Focus_Trap SHALL restore focus to the element that triggered the modal
6. WHEN the user presses the Escape key while a Service_Modal is open, THE Service_Modal SHALL close and restore focus to the triggering element
7. WHILE a Service_Modal is open, THE Service_Modal SHALL prevent scroll on the underlying page content

### Requirement 11: "Por que nos escolher" Card Modals

**User Story:** As a visitor, I want to click a "Por que nos escolher" card to see more details, so that I can better understand the company differentials.

#### Acceptance Criteria

1. WHEN a visitor clicks a Why_Card, THE Why_Modal SHALL open displaying the card's icon, title, and an expanded description paragraph (minimum 2 sentences beyond the card's short description) about that differential
2. THE Why_Card SHALL display a pointer cursor on hover to indicate it is clickable
3. WHEN the close button is clicked, THE Why_Modal SHALL close and return focus to the triggering Why_Card
4. WHEN the overlay (backdrop) outside the modal content is clicked, THE Why_Modal SHALL close
5. WHEN the Escape key is pressed while a Why_Modal is open, THE Why_Modal SHALL close
6. THE Why_Modal SHALL have `role="dialog"` and `aria-modal="true"` attributes and an `aria-labelledby` attribute referencing the modal title element
7. WHILE a Why_Modal is open, THE Focus_Trap SHALL constrain Tab and Shift+Tab navigation within the modal content, moving focus to the first focusable element on open and restoring focus to the triggering Why_Card on close
8. THE Why_Modal SHALL open within 300ms of the click event

### Requirement 12: Rotating Gradient Border Animation

**User Story:** As a visitor, I want a visual indicator on the "Por que nos escolher" cards when I hover, so that the interactive nature of the cards is clear and visually appealing.

#### Acceptance Criteria

1. WHILE a Why_Card is hovered, THE Rotating_Gradient_Border SHALL display a gradient bar rotating around the card perimeter using a conic-gradient from sky (#3AAEDC) to deep (#1A2B5C), completing one full rotation every 3 seconds with linear timing
2. WHILE a Why_Card is hovered, THE Why_Card interior content area SHALL remain white (#FFFFFF) by using a positioned inner element with z-index layering above the rotating pseudo-element
3. WHILE a Why_Card is hovered, THE Rotating_Gradient_Border SHALL produce a glow effect via a CSS blur filter of 8px applied to a separate pseudo-element layer behind the gradient bar
4. WHEN the mouse leaves a Why_Card, THE Rotating_Gradient_Border animation SHALL pause by setting animation-play-state to paused, preserving the current rotation angle
5. THE Rotating_Gradient_Border SHALL be implemented using CSS-only techniques (no JavaScript animation), relying on @keyframes, pseudo-elements (::before and ::after), and animation-play-state for hover control
6. THE Rotating_Gradient_Border SHALL adapt the "ElSombrero2" pattern from Uiverse.io using Brand_Colors (sky #3AAEDC and deep #1A2B5C) instead of the default pink/blue palette
7. WHILE prefers-reduced-motion is set to reduce, THE Rotating_Gradient_Border SHALL disable the rotation animation and instead display a static gradient border using the same sky-to-deep color stops
