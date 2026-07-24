# Implementation Plan: Product Audit Improvements

## Overview

Implementação incremental das 10 áreas de melhoria identificadas na auditoria do produto digital do Grupo ImperAR. Cada área é tratada como módulo independente, integrando-se ao stack existente (HTML5 + Tailwind CSS + JS vanilla) sem introduzir frameworks ou dependências de runtime. A ordem prioriza fundação técnica (SEO, performance, segurança) antes de features voltadas ao usuário (social proof, conversão, conteúdo).

## Tasks

- [x] 1. SEO Técnico e Infraestrutura Base
  - [x] 1.1 Create sitemap.xml and robots.txt static files
    - Create `sitemap.xml` at root listing all 4 pages (index.html, services.html, about.html, contact.html) with valid `<lastmod>` dates in W3C datetime format, conforming to sitemaps.org XML protocol
    - Create `robots.txt` at root permitting indexing of all public pages and referencing sitemap.xml location
    - _Requirements: 1.3, 1.4_

  - [x] 1.2 Add JSON-LD Schema Markup to all pages
    - Add `<script type="application/ld+json">` with LocalBusiness schema (name, address, telephone, openingHours, areaServed) in the `<head>` of index.html, services.html, about.html, and contact.html
    - Add Service schema entries (5 services with name and description) to services.html
    - Ensure valid JSON syntax so page renders normally even if schema has issues
    - _Requirements: 1.1, 1.2, 1.8_

  - [x] 1.3 Add canonical tags and optimize meta tags on all pages
    - Add `<link rel="canonical">` with absolute production URL in `<head>` of each page
    - Update `<title>` tags to be unique, 30-60 characters, containing relevant keywords
    - Update `<meta name="description">` to be unique, 70-155 characters, with HVAC keyword and action-oriented phrase
    - _Requirements: 1.5, 1.6, 1.7_

- [x] 2. Security Headers and Netlify Configuration
  - [x] 2.1 Add security headers to netlify.toml
    - Add `[[headers]]` block for `/*` with Content-Security-Policy, X-Content-Type-Options "nosniff", X-Frame-Options "SAMEORIGIN", and Referrer-Policy "strict-origin-when-cross-origin"
    - CSP must allow self, inline styles/scripts, connect.facebook.net, googletagmanager.com, cdn.jsdelivr.net, fonts.googleapis.com, fonts.gstatic.com, api.emailjs.com
    - _Requirements: 10.1, 10.2_

  - [x] 2.2 Add SRI attributes to third-party scripts
    - Add `integrity` and `crossorigin="anonymous"` attributes to the EmailJS CDN script tag (`cdn.jsdelivr.net`) on contact.html
    - Ensure all third-party scripts load over HTTPS from their official domains
    - _Requirements: 10.4_

- [x] 3. Checkpoint - Ensure SEO and security foundation is solid
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Performance Optimizations
  - [x] 4.1 Implement critical CSS inline and deferred stylesheet loading
    - Extract critical CSS rules for header and hero section into inline `<style>` tag in `<head>` of each page
    - Change `output.css` loading to `<link rel="preload" as="style" onload="this.rel='stylesheet'">` with `<noscript>` fallback
    - _Requirements: 2.5_

  - [x] 4.2 Optimize images with WebP format and explicit dimensions
    - Extend `scripts/optimize-images.js` to generate WebP versions of all images
    - Replace `<img>` tags with `<picture>` elements containing `<source type="image/webp">` + JPEG `<img>` fallback
    - Ensure hero images max 1920px width, card images max 800px width
    - Add explicit `width` and `height` attributes to all `<img>` tags that are missing them
    - _Requirements: 2.4, 2.6_

  - [x] 4.3 Add preload for hero image and defer scripts
    - Add `<link rel="preload" as="image" type="image/webp">` for the first hero carousel image in index.html `<head>`
    - Verify all `<script>` tags use `defer` or `async` attributes; fix any that don't
    - Ensure third-party scripts (analytics, tracking) load asynchronously without blocking LCP
    - _Requirements: 2.7, 2.8, 2.9_

- [x] 5. Analytics Module (js/analytics.js)
  - [x] 5.1 Create js/analytics.js centralized tracking module
    - Implement `window.ImperarAnalytics` object with methods: `trackPageView()`, `trackWhatsAppClick(sourcePage)`, `trackCTAClick(label, sourcePage)`, `trackFormStart()`, `trackFormSubmit()`, `trackCustomEvent(name, params)`
    - Add graceful fallback: if `fbq` or `gtag` is undefined, skip respective events without errors
    - Implement `formStartFired` session flag to ensure InitiateCheckout fires only once
    - _Requirements: 9.1, 9.2, 9.3, 9.5_

  - [x] 5.2 Add GA4 (gtag.js) snippet to all pages
    - Add Google Analytics 4 measurement snippet (gtag.js) with async loading in `<head>` of all 4 pages
    - Initialize with the site's GA4 Measurement ID
    - Wire `trackCTAClick` to send GA4 event with `event_name: 'cta_click'`, `cta_label`, and `source_page` parameters
    - _Requirements: 9.4, 9.5_

  - [x] 5.3 Include js/analytics.js in all page HTML files
    - Add `<script src="js/analytics.js" defer></script>` to all 4 pages before other JS modules
    - Call `ImperarAnalytics.trackPageView()` on DOMContentLoaded
    - _Requirements: 9.1_

  - [ ]* 5.4 Write property test for InitiateCheckout single-fire behavior
    - **Property 4: InitiateCheckout event fires exactly once per session**
    - **Validates: Requirements 5.5**

  - [ ]* 5.5 Write property test for UTM parameter extraction
    - **Property 5: UTM parameter extraction round-trip**
    - **Validates: Requirements 9.6, 9.7**

- [x] 6. CTA Module (js/cta.js) and Conversion Optimization
  - [x] 6.1 Create js/cta.js with sticky CTA bar and WhatsApp tracking
    - Implement scroll listener (with requestAnimationFrame debounce) showing sticky CTA bar at ≥50% scroll, hiding at <40% with 300ms fade-out transition
    - Position bar as `fixed bottom-0` with z-index 35 and 72px gap from WhatsApp floating button
    - Set `aria-hidden` appropriately based on visibility
    - Add event delegation on `[href*="wa.me"]` links to call `ImperarAnalytics.trackWhatsAppClick()` and `fbq('track', 'Contact')` before navigation
    - If `fbq` is undefined, allow navigation to proceed without blocking
    - _Requirements: 4.1, 4.2, 4.6, 4.7, 9.2_

  - [x] 6.2 Add contextual CTAs to service card modals on services.html
    - Ensure each service modal contains a WhatsApp CTA with pre-filled message including the service name (e.g., "Olá, gostaria de um orçamento de climatização para [nome do serviço].")
    - Verify existing modals already have this; add missing ones if needed
    - _Requirements: 4.4_

  - [x] 6.3 Ensure CTA presence in every section of index.html and style differentiation
    - Add CTA elements (link or button to contact.html or WhatsApp) within any `<section>` of index.html that doesn't already have one
    - Style primary CTAs with filled background (--c-sky) and white text; secondary CTAs with transparent bg, 2px solid border at --c-deep 15% opacity, --c-deep text
    - Ensure minimum 3:1 contrast ratio between the two CTA styles
    - _Requirements: 4.3, 4.5_

  - [x] 6.4 Include js/cta.js in all page HTML files
    - Add `<script src="js/cta.js" defer></script>` to all 4 pages
    - Respect `prefers-reduced-motion` for CTA bar transitions (appear/disappear instantly)
    - _Requirements: 4.1, 4.2, 6.6_

  - [ ]* 6.5 Write property test for sticky CTA visibility threshold
    - **Property 2: Sticky CTA visibility is determined by scroll position**
    - **Validates: Requirements 4.1, 4.2**

- [x] 7. Checkpoint - Ensure analytics and CTA modules work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Contact Form Enhancements (js/contact.js)
  - [x] 8.1 Add service-type select field and honeypot to contact.html form
    - Add `<select name="service-type">` with required attribute and options: "Apartamentos na planta", "Condomínios residenciais", "Obras de alto padrão", "Infraestrutura de climatização", "Projetos VRF"
    - Add honeypot field: `<input name="website" data-honeypot>` hidden via CSS (`position:absolute; left:-9999px; opacity:0; pointer-events:none`)
    - Add hidden UTM fields: `<input type="hidden" name="utm_source">`, `utm_medium`, `utm_campaign`
    - _Requirements: 5.2, 10.3, 9.6_

  - [x] 8.2 Enhance contact.js with honeypot check, HTML stripping, UTM population, and analytics hooks
    - Implement `stripHtml(str)` function to remove all HTML tags and trim whitespace
    - Implement `checkHoneypot(form)` — if honeypot has value, simulate success silently without calling EmailJS
    - Implement `populateUTMFields()` to parse URL query params on page load and populate hidden fields
    - Call `ImperarAnalytics.trackFormStart()` on first input event (once per session)
    - Call `ImperarAnalytics.trackFormSubmit()` on successful EmailJS submission
    - Fire `fbq('track', 'Lead')` on successful submission
    - On EmailJS failure, display error message with WhatsApp fallback link; do NOT expose service IDs or API keys
    - Strip HTML from all field values before sending to EmailJS
    - Update `templateParams` to include `service_type`, `utm_source`, `utm_medium`, `utm_campaign`
    - Update form validation to include service-type field (required) and name min length to 2 chars
    - _Requirements: 5.1, 5.4, 5.5, 5.6, 5.7, 9.3, 9.6, 9.7, 10.3, 10.5, 10.6_

  - [ ]* 8.3 Write property test for phone mask formatting
    - **Property 1: Phone mask formatting preserves digits and produces valid format**
    - **Validates: Requirements 5.3**

  - [ ]* 8.4 Write property test for form field validation constraints
    - **Property 3: Form field validation correctly enforces constraints**
    - **Validates: Requirements 5.6, 5.7**

  - [ ]* 8.5 Write property test for HTML stripping
    - **Property 6: HTML stripping removes all tags while preserving text content**
    - **Validates: Requirements 10.5**

  - [ ]* 8.6 Write property test for honeypot rejection
    - **Property 7: Honeypot non-empty value causes silent form rejection**
    - **Validates: Requirements 10.3**

- [x] 9. Social Proof and Content Sections
  - [x] 9.1 Add testimonials section to index.html
    - Create testimonials section with minimum 3 client testimonials, each in a visually distinct card component
    - Each testimonial includes: client name (first name + last initial), service type, review text (20-300 chars), and star-based rating (1-5 scale)
    - Use `<blockquote>`, `<cite>`, and aria-label for star ratings for accessibility
    - Add a CTA within this section
    - _Requirements: 3.1, 3.5, 3.6_

  - [x] 9.2 Add stats/credibility indicators and partner logos to index.html
    - Add quantitative stats section: years of experience, completed projects count, service coverage area as numeric integers
    - Add partner logos section with at least 3 client/partner brand logos or names
    - _Requirements: 3.2, 3.4_

  - [x] 9.3 Add "Por que nos escolher" differentiators with quantifiable claims to index.html
    - Enhance existing "Por que escolher o Grupo ImperAR" section to include numeric/quantifiable claims (e.g., response time in hours, warranty period in months, number of completed projects, team size)
    - Ensure at least 3 distinct differentiators with quantifiable data
    - _Requirements: 8.1_

  - [x] 9.4 Add FAQ section to index.html or services.html
    - Create FAQ section using native `<details>/<summary>` elements (accessible without additional JS)
    - Include at least 4 Q&A pairs covering: pricing/budget process, estimated timeline, warranty terms, service coverage area
    - _Requirements: 8.3_

  - [x] 9.5 Enhance services.html with detailed service descriptions
    - For each service listed, ensure description includes: at least 2 sentences stating what's included, target audience (residential/commercial/industrial), and expected outcome for the client
    - _Requirements: 8.2_

  - [x] 9.6 Add service area information and about.html enhancements
    - Display company service area on at least one page (neighborhoods, regions of SP, or radius in km)
    - On about.html, present at least 3 numeric data points (year founded, years of operation, team size, completed projects, or clients served)
    - Add at least 1 team certification/technical qualification related to HVAC (certification name + issuing entity)
    - _Requirements: 8.4, 8.5, 3.3_

- [x] 10. Checkpoint - Ensure content and social proof sections render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Accessibility Improvements
  - [x] 11.1 Ensure contrast ratios and focus indicators across all pages
    - Verify minimum 4.5:1 contrast for normal text and 3:1 for large text; fix any violations
    - Add visible focus indicators (2px outline, 3:1 contrast against adjacent background) on all interactive elements
    - _Requirements: 6.1, 6.2_

  - [x] 11.2 Add proper alt text, ARIA attributes, and semantic landmarks
    - Audit all `<img>` tags: informational images get descriptive alt (≤125 chars), decorative images get `alt=""`
    - Ensure semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>` present; one `<h1>` per page; no skipped heading levels
    - Set `aria-expanded` on mobile menu toggle; `aria-hidden` on menu panel; `role="dialog"` + `aria-modal="true"` on modals
    - _Requirements: 6.3, 6.5, 6.7_

  - [x] 11.3 Implement focus trap in modals and keyboard interaction for card triggers
    - Ensure modal focus trap: trap focus within dialog, dismiss on Escape, return focus to trigger on close
    - Add `role="button"`, `tabindex="0"`, `aria-haspopup="dialog"` to non-button elements with `data-modal-trigger`
    - Activate card triggers on both Enter and Space key press
    - _Requirements: 6.4, 6.8_

  - [x] 11.4 Implement prefers-reduced-motion support
    - When `prefers-reduced-motion: reduce` is set, disable scroll-triggered animations and decorative CSS transitions
    - Preserve immediate state changes (menu visibility, form validation indicators)
    - Apply to CTA bar transitions, hero carousel, and scroll animations
    - _Requirements: 6.6_

- [x] 12. Responsiveness and Mobile Experience
  - [x] 12.1 Ensure responsive layout and touch targets across viewports
    - Verify all content renders within viewport width without horizontal scrolling from 320px to 1920px
    - Ensure touch targets minimum 44x44 CSS pixels with 8px spacing on mobile (<768px)
    - WhatsApp float button minimum 48x48px with 16px clearance from content
    - Minimum font size 16px for body text, 18px for headings on all viewports
    - Services grid displays as single-column on mobile with full-width images
    - Mobile navigation collapses to toggle-activated overlay with 44x44px touch targets for menu items
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 13. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document using fast-check library
- The project uses vanilla JavaScript (ES6+), HTML5, and Tailwind CSS — no frameworks
- All changes must be compatible with Netlify deployment
- Analytics module (js/analytics.js) and CTA module (js/cta.js) are new files
- Security headers are configured via netlify.toml
- Images optimization extends the existing `scripts/optimize-images.js`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "2.2"] },
    { "id": 2, "tasks": ["4.1", "4.2", "5.1"] },
    { "id": 3, "tasks": ["4.3", "5.2", "5.3"] },
    { "id": 4, "tasks": ["5.4", "5.5", "6.1"] },
    { "id": 5, "tasks": ["6.2", "6.3", "6.4"] },
    { "id": 6, "tasks": ["6.5", "8.1"] },
    { "id": 7, "tasks": ["8.2"] },
    { "id": 8, "tasks": ["8.3", "8.4", "8.5", "8.6"] },
    { "id": 9, "tasks": ["9.1", "9.2", "9.3", "9.4"] },
    { "id": 10, "tasks": ["9.5", "9.6"] },
    { "id": 11, "tasks": ["11.1", "11.2", "11.3", "11.4"] },
    { "id": 12, "tasks": ["12.1"] }
  ]
}
```
