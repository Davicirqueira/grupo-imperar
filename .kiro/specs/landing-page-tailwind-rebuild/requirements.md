# Requirements Document

## Introduction

This document specifies the requirements for rebuilding the Grupo ImperAR landing page using Tailwind CSS. The landing page is the primary digital presence for Grupo ImperAR, a company specializing in air conditioning and refrigeration services in São Paulo, Brazil. The current implementation uses vanilla CSS and lacks visual impact, professional polish, and modern interaction patterns.

The rebuild aims to create a minimalist, high-performance, and visually compelling landing page that communicates professionalism, technical expertise, and trustworthiness. The page must convert visitors into leads through clear calls-to-action, intuitive navigation, and immediate visual feedback.

The technical foundation will migrate from vanilla CSS to Tailwind CSS while maintaining HTML and vanilla JavaScript, ensuring maintainability, consistency, and rapid iteration capability.

## Glossary

- **Landing_Page**: The single-page website (index.html) that serves as the primary entry point for visitors
- **Header**: The sticky navigation bar at the top of the page containing logo and navigation links
- **Hero_Section**: The first full-viewport section containing headline, description, CTAs, and hero image
- **Card**: A contained UI element with background, padding, and optional image displaying service or feature information
- **CTA**: Call-to-action button or link designed to drive user conversion (contact, quote request)
- **WhatsApp_Button**: Fixed floating button in bottom-right corner linking to WhatsApp contact
- **Portfolio_Grid**: Grid layout displaying completed project images with overlay information
- **Process_Timeline**: Sequential visual representation of the company's work methodology
- **Footer**: Bottom section containing company information, links, and contact details
- **Viewport**: The visible area of the web page in the user's browser window
- **Hover_State**: Visual feedback displayed when user's cursor is positioned over an interactive element
- **Focus_State**: Visual feedback displayed when an interactive element receives keyboard focus
- **Scroll_Reveal**: Animation technique where elements become visible as user scrolls down the page
- **Breakpoint**: Screen width threshold that triggers responsive layout changes (mobile: <768px, tablet: 768px-1024px, desktop: ≥1024px)
- **Intersection_Observer**: Browser API that detects when elements enter or exit the viewport
- **Tailwind_Utility**: Atomic CSS class provided by Tailwind CSS framework
- **Color_System**: The defined palette of brand colors used consistently throughout the interface
- **Spacing_System**: The 8px-based scale used for margins, padding, and gaps (8, 16, 24, 32, 48, 64, 96, 128)
- **Typography_System**: The defined hierarchy of font sizes, weights, and line heights using Barlow and Inter fonts
- **Glassmorphism**: Visual effect combining background blur, transparency, and subtle borders
- **Lazy_Loading**: Technique that defers loading of images until they are about to enter the viewport
- **Skip_Link**: Accessibility feature allowing keyboard users to jump directly to main content

## Requirements

### Requirement 1: Tailwind CSS Integration

**User Story:** As a developer, I want to integrate Tailwind CSS into the project, so that I can use utility classes for consistent styling and rapid development.

#### Acceptance Criteria

1. THE Landing_Page SHALL include Tailwind CSS via CDN or npm installation
2. THE Landing_Page SHALL configure Tailwind to use the custom Color_System (#3AAEDC, #1A2B5C, #2490BA, #E8F7FD, #0F6080, #F4F6F8, #4A4A4A, #FFFFFF, #25D366)
3. THE Landing_Page SHALL configure Tailwind to use the Spacing_System (multiples of 8px)
4. THE Landing_Page SHALL configure Tailwind to use custom Breakpoints (mobile: <768px, tablet: 768px-1024px, desktop: ≥1024px)
5. THE Landing_Page SHALL configure Tailwind to extend with custom font families (Barlow for headings, Inter for body)
6. THE Landing_Page SHALL enable Tailwind's JIT (Just-In-Time) mode for optimal performance
7. THE Landing_Page SHALL configure PurgeCSS to remove unused utility classes in production builds

### Requirement 2: Responsive Header with Sticky Navigation

**User Story:** As a visitor, I want a persistent navigation bar at the top of the page, so that I can access different sections without scrolling back to the top.

#### Acceptance Criteria

1. THE Header SHALL remain fixed at the top of the Viewport during scroll
2. WHEN the page is scrolled beyond 50px, THE Header SHALL apply a glassmorphism effect (backdrop-blur, semi-transparent background)
3. THE Header SHALL display the company logo on the left side
4. THE Header SHALL display navigation links (Início, Serviços, Sobre, Contato) on the right side on desktop
5. WHEN viewport width is less than 768px, THE Header SHALL display a hamburger menu button instead of navigation links
6. WHEN the hamburger menu button is clicked, THE Header SHALL toggle the mobile navigation menu with slide-in animation
7. THE Header SHALL maintain a minimum height of 64px on mobile and 80px on desktop
8. THE Header SHALL use z-index value ensuring it appears above all other page content
9. FOR ALL interactive elements in the Header, hover and focus states SHALL be visually distinct with transition duration of 200ms

### Requirement 3: Hero Section with Visual Impact

**User Story:** As a visitor, I want an immediately compelling first impression, so that I understand the company's value proposition within 3 seconds.

#### Acceptance Criteria

1. THE Hero_Section SHALL occupy 100% of the Viewport height on desktop and minimum 600px on mobile
2. THE Hero_Section SHALL display a gradient background transitioning from #3AAEDC to #2490BA
3. THE Hero_Section SHALL contain a headline with maximum 60 characters using Barlow font at 48px (mobile) and 64px (desktop)
4. THE Hero_Section SHALL contain a description paragraph with maximum 160 characters using Inter font at 18px (mobile) and 20px (desktop)
5. THE Hero_Section SHALL display two CTAs: primary "Solicitar orçamento" and secondary "Ver projetos"
6. THE Hero_Section SHALL display a hero image on the right side (desktop) or below text (mobile)
7. WHEN the page loads, THE Hero_Section SHALL animate the headline with fade-in and slide-up effect over 600ms
8. WHEN the page loads, THE Hero_Section SHALL animate the description with fade-in and slide-up effect over 600ms with 100ms delay
9. WHEN the page loads, THE Hero_Section SHALL animate the CTAs with fade-in and slide-up effect over 600ms with 200ms delay
10. WHEN the page loads, THE Hero_Section SHALL animate the hero image with fade-in effect over 800ms with 300ms delay
11. THE Hero_Section SHALL use easing function cubic-bezier(0.4, 0.0, 0.2, 1) for all animations

### Requirement 4: Service Cards with Visual Hierarchy

**User Story:** As a visitor, I want to quickly understand the company's key differentiators, so that I can evaluate if they meet my needs.

#### Acceptance Criteria

1. THE Landing_Page SHALL display a "Por que escolher" section with 3 Cards in a grid layout
2. WHEN viewport width is greater than or equal to 1024px, THE Cards SHALL display in a 3-column grid
3. WHEN viewport width is between 768px and 1023px, THE Cards SHALL display in a 2-column grid
4. WHEN viewport width is less than 768px, THE Cards SHALL display in a single column
5. THE Card SHALL contain an image with aspect ratio 4:3 and object-fit cover
6. THE Card SHALL contain a heading using Barlow font at 24px
7. THE Card SHALL contain a description using Inter font at 16px
8. THE Card SHALL have a background color of #FFFFFF with border-radius of 8px
9. THE Card SHALL have a subtle box-shadow that increases on hover
10. WHEN the Card enters the Viewport, THE Card SHALL animate with fade-in and slide-up effect over 400ms
11. THE Card animations SHALL stagger by 100ms for each subsequent Card
12. WHEN the user hovers over a Card, THE Card SHALL scale to 102% over 200ms with easing ease-out

### Requirement 5: Process Timeline Visualization

**User Story:** As a visitor, I want to understand the company's work process, so that I know what to expect when hiring their services.

#### Acceptance Criteria

1. THE Landing_Page SHALL display a "Como trabalhamos" section with a Process_Timeline containing 3 steps
2. THE Process_Timeline SHALL display steps vertically on mobile and horizontally on desktop
3. THE Process_Timeline step SHALL contain a number indicator (01, 02, 03) with size 48px using Barlow font
4. THE Process_Timeline step SHALL contain a heading using Barlow font at 24px
5. THE Process_Timeline step SHALL contain a description using Inter font at 16px
6. THE Process_Timeline step SHALL contain an image with aspect ratio 4:3
7. WHEN viewport width is greater than or equal to 1024px, THE Process_Timeline SHALL display a connecting line between steps
8. THE Process_Timeline connecting line SHALL use color #3AAEDC with width 2px
9. WHEN a Process_Timeline step enters the Viewport, THE step SHALL animate with fade-in effect over 500ms
10. THE Process_Timeline step animations SHALL trigger sequentially with 200ms delay between steps

### Requirement 6: Portfolio Grid with Overlay

**User Story:** As a visitor, I want to see examples of completed projects, so that I can assess the quality of the company's work.

#### Acceptance Criteria

1. THE Landing_Page SHALL display a "Projetos realizados" section with a Portfolio_Grid containing at least 4 project images
2. WHEN viewport width is greater than or equal to 1024px, THE Portfolio_Grid SHALL display 4 columns
3. WHEN viewport width is between 768px and 1023px, THE Portfolio_Grid SHALL display 2 columns
4. WHEN viewport width is less than 768px, THE Portfolio_Grid SHALL display 1 column
5. THE Portfolio_Grid item SHALL display an image with object-fit cover
6. THE Portfolio_Grid item SHALL display an overlay with gradient from transparent to rgba(26, 43, 92, 0.9)
7. THE Portfolio_Grid item overlay SHALL contain a heading and description using white text
8. WHEN the user hovers over a Portfolio_Grid item, THE overlay SHALL transition from opacity 0 to opacity 100 over 300ms
9. WHEN the user hovers over a Portfolio_Grid item, THE image SHALL scale to 105% over 300ms
10. THE Portfolio_Grid item SHALL have overflow hidden to prevent scaled image from exceeding boundaries

### Requirement 7: WhatsApp Floating Button

**User Story:** As a visitor, I want quick access to contact the company via WhatsApp, so that I can initiate a conversation without navigating away from the page.

#### Acceptance Criteria

1. THE WhatsApp_Button SHALL be fixed at the bottom-right corner of the Viewport
2. THE WhatsApp_Button SHALL have a circular shape with diameter 56px
3. THE WhatsApp_Button SHALL use background color #25D366
4. THE WhatsApp_Button SHALL contain a WhatsApp SVG icon in white color
5. THE WhatsApp_Button SHALL maintain 24px distance from the right edge and 24px from the bottom edge of the Viewport
6. WHEN the page is scrolled less than 300px from the top, THE WhatsApp_Button SHALL be hidden with opacity 0
7. WHEN the page is scrolled 300px or more from the top, THE WhatsApp_Button SHALL appear with fade-in and scale animation over 300ms
8. WHEN the user hovers over the WhatsApp_Button, THE button SHALL scale to 110% over 200ms
9. WHEN the user hovers over the WhatsApp_Button, THE button box-shadow SHALL increase from 0 4px 12px rgba(37, 211, 102, 0.3) to 0 8px 24px rgba(37, 211, 102, 0.5)
10. WHEN the WhatsApp_Button is clicked, THE button SHALL open https://wa.me/5511980979915 in a new browser tab
11. THE WhatsApp_Button SHALL have aria-label "Fale conosco pelo WhatsApp" for screen readers
12. THE WhatsApp_Button SHALL have a visible focus state with 2px outline in #25D366 color

### Requirement 8: Footer with Company Information

**User Story:** As a visitor, I want to find company contact information and additional links, so that I can reach out or explore other pages.

#### Acceptance Criteria

1. THE Footer SHALL have a background color of #1A2B5C
2. THE Footer SHALL display content in a 3-column grid on desktop and single column on mobile
3. THE Footer SHALL display the company logo with white text color
4. THE Footer SHALL display navigation links (Serviços, Sobre, Contato) in the second column
5. THE Footer SHALL display contact information (WhatsApp, phone, email, location) in the third column
6. THE Footer SHALL display copyright text with current year dynamically inserted
7. THE Footer text SHALL use color #E8F7FD with opacity 88% for secondary text
8. THE Footer links SHALL have hover state with color transition to #3AAEDC over 200ms
9. THE Footer SHALL have padding of 64px on desktop and 32px on mobile

### Requirement 9: Scroll-Triggered Animations

**User Story:** As a visitor, I want smooth animations as I scroll through the page, so that the experience feels polished and engaging.

#### Acceptance Criteria

1. THE Landing_Page SHALL use Intersection_Observer API to detect when elements enter the Viewport
2. WHEN an element with data-animate attribute enters the Viewport, THE element SHALL trigger its entrance animation
3. THE entrance animation SHALL only trigger once per element (not on every scroll)
4. THE entrance animation SHALL use opacity transition from 0 to 1 and transform translateY from 24px to 0
5. THE entrance animation SHALL have duration of 600ms with easing cubic-bezier(0.4, 0.0, 0.2, 1)
6. WHERE an element has data-animate-delay attribute, THE animation SHALL delay by the specified milliseconds
7. THE Intersection_Observer SHALL use a threshold of 0.1 (trigger when 10% of element is visible)
8. THE Intersection_Observer SHALL use a rootMargin of "-50px" to trigger slightly before element enters Viewport

### Requirement 10: Responsive Typography System

**User Story:** As a visitor, I want text to be readable and appropriately sized on all devices, so that I can consume content comfortably.

#### Acceptance Criteria

1. THE Landing_Page SHALL use Barlow font family for all headings (h1, h2, h3)
2. THE Landing_Page SHALL use Inter font family for all body text (p, a, li)
3. THE Landing_Page SHALL load fonts from Google Fonts with preconnect for performance
4. THE h1 heading SHALL use font-size 48px on mobile and 64px on desktop with font-weight 700
5. THE h2 heading SHALL use font-size 32px on mobile and 48px on desktop with font-weight 700
6. THE h3 heading SHALL use font-size 24px on mobile and 32px on desktop with font-weight 600
7. THE body text SHALL use font-size 16px on mobile and 18px on desktop with font-weight 400
8. THE lead text SHALL use font-size 18px on mobile and 20px on desktop with font-weight 400
9. THE Landing_Page SHALL use line-height 1.2 for headings and 1.6 for body text
10. THE Landing_Page SHALL use letter-spacing -0.02em for large headings (h1, h2)

### Requirement 11: Color System Implementation

**User Story:** As a developer, I want a consistent color system throughout the page, so that the brand identity is maintained and code is maintainable.

#### Acceptance Criteria

1. THE Landing_Page SHALL define custom Tailwind colors: primary (#3AAEDC), primary-dark (#2490BA), deep (#1A2B5C), ice (#E8F7FD), accent (#0F6080), gray-light (#F4F6F8), gray-text (#4A4A4A), whatsapp (#25D366)
2. THE Landing_Page SHALL use primary color for primary CTAs, hero gradient, and navigation active states
3. THE Landing_Page SHALL use deep color for headings, footer background, and text on light backgrounds
4. THE Landing_Page SHALL use ice color for card backgrounds and alternating section backgrounds
5. THE Landing_Page SHALL use gray-text color for body text and descriptions
6. THE Landing_Page SHALL use whatsapp color exclusively for the WhatsApp_Button
7. THE Landing_Page SHALL maintain WCAG AA contrast ratio minimum 4.5:1 for all text-background combinations
8. THE Landing_Page SHALL use primary-dark color for hover states of primary-colored elements

### Requirement 12: Interactive Button States

**User Story:** As a visitor, I want immediate visual feedback when interacting with buttons, so that I know my actions are registered.

#### Acceptance Criteria

1. THE CTA SHALL have three visual states: default, hover, and active
2. THE primary CTA SHALL use background color #3AAEDC in default state
3. WHEN the user hovers over a primary CTA, THE button SHALL transition background color to #2490BA over 200ms
4. WHEN the user hovers over a primary CTA, THE button SHALL scale to 102% over 200ms
5. WHEN the user clicks a primary CTA, THE button SHALL scale to 98% over 100ms
6. THE secondary CTA SHALL have transparent background with 2px border in #3AAEDC color
7. WHEN the user hovers over a secondary CTA, THE button SHALL transition background color to rgba(58, 174, 220, 0.1) over 200ms
8. THE CTA SHALL have border-radius of 8px and padding of 16px 32px
9. THE CTA SHALL have font-weight 600 and font-size 16px
10. THE CTA SHALL have a visible focus state with 2px outline offset by 2px in #3AAEDC color
11. THE CTA SHALL use cursor pointer on hover

### Requirement 13: Image Optimization and Lazy Loading

**User Story:** As a visitor, I want the page to load quickly, so that I can access information without waiting.

#### Acceptance Criteria

1. THE Landing_Page SHALL use loading="lazy" attribute for all images except hero image
2. THE Landing_Page SHALL use loading="eager" attribute for the hero image
3. THE Landing_Page SHALL specify width and height attributes for all images to prevent layout shift
4. THE Landing_Page SHALL use object-fit cover for all images in Cards and Portfolio_Grid
5. THE Landing_Page SHALL use WebP format for images where browser support is available
6. THE Landing_Page SHALL provide fallback to JPEG format for browsers without WebP support
7. THE Landing_Page SHALL compress images to maximum 200KB file size while maintaining visual quality
8. THE Landing_Page SHALL use srcset attribute for responsive images with 1x, 2x, and 3x variants

### Requirement 14: Accessibility Compliance

**User Story:** As a visitor using assistive technology, I want to navigate and understand the page content, so that I have equal access to information.

#### Acceptance Criteria

1. THE Landing_Page SHALL include a Skip_Link as the first focusable element
2. WHEN the Skip_Link receives focus, THE link SHALL become visible with position absolute and z-index 9999
3. WHEN the Skip_Link is activated, THE page SHALL scroll to the main content area
4. THE Landing_Page SHALL use semantic HTML5 elements (header, nav, main, section, article, footer)
5. THE Landing_Page SHALL provide alt text for all images describing their content or function
6. THE Landing_Page SHALL provide aria-label attributes for icon-only buttons (hamburger menu, WhatsApp_Button)
7. THE Landing_Page SHALL ensure all interactive elements are keyboard accessible with Tab key
8. THE Landing_Page SHALL provide visible focus indicators for all interactive elements
9. THE Landing_Page SHALL use aria-expanded attribute on hamburger menu button to indicate menu state
10. THE Landing_Page SHALL use aria-controls attribute on hamburger menu button to reference the menu element
11. THE Landing_Page SHALL maintain heading hierarchy without skipping levels (h1 → h2 → h3)
12. THE Landing_Page SHALL use aria-hidden="true" for decorative SVG icons

### Requirement 15: Mobile Navigation Menu

**User Story:** As a mobile visitor, I want an accessible navigation menu, so that I can explore different sections of the site.

#### Acceptance Criteria

1. WHEN viewport width is less than 768px, THE Header SHALL display a hamburger menu button
2. THE hamburger menu button SHALL consist of three horizontal lines (spans) with height 2px and width 24px
3. WHEN the hamburger menu button is clicked, THE mobile navigation menu SHALL slide in from the right over 300ms
4. THE mobile navigation menu SHALL have a background color of #FFFFFF with box-shadow
5. THE mobile navigation menu SHALL display navigation links vertically with 16px spacing
6. THE mobile navigation menu SHALL occupy 80% of the Viewport width with maximum 320px
7. WHEN the mobile navigation menu is open, THE page body SHALL have overflow hidden to prevent scrolling
8. WHEN the mobile navigation menu is open, THE hamburger menu button SHALL transform into an X icon
9. WHEN the user clicks outside the mobile navigation menu, THE menu SHALL close with slide-out animation
10. WHEN the user presses Escape key, THE mobile navigation menu SHALL close
11. WHEN the mobile navigation menu opens, THE first navigation link SHALL receive keyboard focus

### Requirement 16: Performance Optimization

**User Story:** As a visitor, I want the page to load and respond quickly, so that I have a smooth browsing experience.

#### Acceptance Criteria

1. THE Landing_Page SHALL achieve a Lighthouse Performance score of at least 90
2. THE Landing_Page SHALL achieve First Contentful Paint (FCP) within 1.5 seconds
3. THE Landing_Page SHALL achieve Largest Contentful Paint (LCP) within 2.5 seconds
4. THE Landing_Page SHALL achieve Cumulative Layout Shift (CLS) score below 0.1
5. THE Landing_Page SHALL use preconnect link for Google Fonts to reduce DNS lookup time
6. THE Landing_Page SHALL defer loading of non-critical JavaScript using defer attribute
7. THE Landing_Page SHALL minify HTML, CSS, and JavaScript files for production
8. THE Landing_Page SHALL configure Tailwind PurgeCSS to remove unused utility classes reducing CSS file size by at least 90%
9. THE Landing_Page SHALL use CSS containment (contain: layout style paint) on Cards to improve rendering performance
10. THE Landing_Page SHALL debounce scroll event listeners to maximum 16ms (60fps) execution frequency

### Requirement 17: Smooth Scroll Behavior

**User Story:** As a visitor, I want smooth scrolling when clicking anchor links, so that navigation feels polished and intentional.

#### Acceptance Criteria

1. WHEN a navigation link with anchor href is clicked, THE page SHALL scroll smoothly to the target section
2. THE smooth scroll animation SHALL have duration proportional to distance (minimum 300ms, maximum 1000ms)
3. THE smooth scroll animation SHALL use easing function ease-in-out
4. WHEN smooth scrolling to a section, THE target section SHALL be positioned 80px from the top to account for sticky Header
5. THE Landing_Page SHALL use CSS scroll-behavior: smooth as baseline with JavaScript fallback for unsupported browsers
6. WHEN smooth scrolling is in progress and user manually scrolls, THE automatic scroll SHALL be cancelled

### Requirement 18: Form Validation and Feedback (Contact Page)

**User Story:** As a visitor, I want clear feedback when filling out the contact form, so that I know if my input is valid before submitting.

#### Acceptance Criteria

1. THE contact form SHALL validate required fields (name, email, phone, message) on blur event
2. WHEN a required field is empty on blur, THE field SHALL display a red border and error message below
3. WHEN an email field contains invalid format, THE field SHALL display error message "Digite um e-mail válido"
4. WHEN a phone field contains invalid format, THE field SHALL display error message "Digite um telefone válido"
5. THE error message SHALL use color #DC2626 and font-size 14px
6. WHEN a field with error receives valid input, THE error message SHALL fade out over 200ms
7. WHEN the form is submitted with invalid fields, THE page SHALL scroll to the first invalid field
8. WHEN the form is successfully submitted, THE page SHALL display a success message with green background
9. WHEN the form submission fails, THE page SHALL display an error message with red background
10. THE form submit button SHALL be disabled during submission with loading spinner

### Requirement 19: Microinteractions and Feedback

**User Story:** As a visitor, I want subtle feedback for my interactions, so that the interface feels responsive and alive.

#### Acceptance Criteria

1. WHEN the user hovers over a navigation link, THE link SHALL display an underline animation from left to right over 200ms
2. WHEN the user hovers over a Card, THE Card box-shadow SHALL transition from 0 2px 8px rgba(0,0,0,0.1) to 0 8px 24px rgba(0,0,0,0.15) over 200ms
3. WHEN the user clicks a CTA, THE button SHALL display a ripple effect emanating from the click point
4. WHEN the page is loading, THE cursor SHALL display a progress indicator
5. WHEN an image is loading, THE image container SHALL display a skeleton loader with shimmer animation
6. THE skeleton loader SHALL use gradient animation from #F4F6F8 to #E8F7FD over 1500ms infinite
7. WHEN the user scrolls down 100px, THE Header SHALL reduce its height from 80px to 64px over 200ms
8. WHEN the user scrolls back to top, THE Header SHALL expand to original height over 200ms

### Requirement 20: Cross-Browser Compatibility

**User Story:** As a visitor using any modern browser, I want the page to display and function correctly, so that I have a consistent experience.

#### Acceptance Criteria

1. THE Landing_Page SHALL display correctly in Chrome version 90 and above
2. THE Landing_Page SHALL display correctly in Firefox version 88 and above
3. THE Landing_Page SHALL display correctly in Safari version 14 and above
4. THE Landing_Page SHALL display correctly in Edge version 90 and above
5. THE Landing_Page SHALL use CSS feature detection with @supports to provide fallbacks for unsupported properties
6. THE Landing_Page SHALL use autoprefixer to add vendor prefixes for CSS properties requiring them
7. THE Landing_Page SHALL test backdrop-filter support and provide solid background fallback for browsers without support
8. THE Landing_Page SHALL use Intersection_Observer polyfill for browsers without native support
9. THE Landing_Page SHALL degrade gracefully in browsers without JavaScript enabled (display static content without animations)
