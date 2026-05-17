# Implementation Plan: Landing Page Tailwind CSS Rebuild

## Overview

This implementation plan converts the Grupo ImperAR landing page from vanilla CSS to Tailwind CSS while maintaining HTML structure and vanilla JavaScript functionality. The approach follows a mobile-first responsive design strategy with progressive enhancement for animations and interactions.

**Implementation Strategy**:
1. Set up Tailwind CSS build pipeline with PostCSS
2. Configure custom design tokens (colors, spacing, typography)
3. Migrate HTML pages to use Tailwind utility classes
4. Implement scroll-triggered animations with Intersection Observer
5. Add interactive states and microinteractions
6. Optimize images and implement lazy loading
7. Ensure accessibility compliance and cross-browser compatibility

## Tasks

- [x] 1. Set up Tailwind CSS build pipeline
  - Initialize npm project with package.json if not exists
  - Install Tailwind CSS, PostCSS, and Autoprefixer as dependencies
  - Create tailwind.config.js with custom configuration (colors, spacing, fonts, breakpoints)
  - Create postcss.config.js with Tailwind and Autoprefixer plugins
  - Create css/input.css with @tailwind directives (base, components, utilities)
  - Add build scripts to package.json (build, watch, production)
  - Configure PurgeCSS content paths to scan HTML and JS files
  - Test build pipeline by generating css/output.css
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 2. Configure Tailwind design system
  - [x] 2.1 Configure custom color palette in tailwind.config.js
    - Add primary (#3AAEDC), primary-dark (#2490BA), deep (#1A2B5C)
    - Add ice (#E8F7FD), accent (#0F6080), gray-light (#F4F6F8)
    - Add gray-text (#4A4A4A), whatsapp (#25D366)
    - _Requirements: 1.2, 11.1_
  
  - [x] 2.2 Configure custom spacing scale
    - Extend spacing with 8px-based scale (18: 4.5rem, 22: 5.5rem)
    - Verify default spacing values align with 8px system
    - _Requirements: 1.3_
  
  - [x] 2.3 Configure typography system
    - Add font families: Barlow for headings, Inter for body
    - Configure custom font sizes (display, h1, h2, h3, lead)
    - Set line heights and letter spacing for each size
    - Add Google Fonts preconnect links to HTML files
    - _Requirements: 1.5, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10_
  
  - [x] 2.4 Configure responsive breakpoints
    - Set custom breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1440px)
    - _Requirements: 1.4_
  
  - [x] 2.5 Configure custom utilities
    - Add custom border radius values (xl: 1rem, 2xl: 1.25rem)
    - Add custom box shadows (sm, md, lg with deep color)
    - Add custom scale values (102: 1.02, 98: 0.98)
    - Add safelist for dynamic classes (is-visible, is-scrolled, is-open, has-error, has-success, is-loading)
    - _Requirements: 1.6_

- [x] 3. Checkpoint - Verify Tailwind configuration
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Migrate Header component to Tailwind
  - [x] 4.1 Convert header HTML structure to use Tailwind classes
    - Apply fixed positioning with z-50
    - Add glassmorphism effect (bg-white/90, backdrop-blur-md)
    - Implement responsive padding (py-3.5 mobile, lg:py-5 desktop)
    - Add border-b with deep/8 opacity
    - Create flexbox layout for logo and navigation
    - _Requirements: 2.1, 2.3, 2.4, 2.7, 2.8_
  
  - [x] 4.2 Implement sticky header scroll behavior
    - Write JavaScript to detect scroll position > 50px
    - Toggle .is-scrolled class on header element
    - Add shadow-sm class when scrolled
    - Implement smooth transition (duration-200)
    - _Requirements: 2.2, 19.7, 19.8_
  
  - [x] 4.3 Style navigation links with hover states
    - Apply text color and font weight
    - Add hover underline animation (left to right, 200ms)
    - Implement focus states with visible outline
    - Add aria-current styling for active page
    - _Requirements: 2.9, 19.1_

- [x] 5. Implement mobile navigation menu
  - [x] 5.1 Create hamburger menu button
    - Build three-line icon with spans (2px height, 24px width)
    - Add aria-label and aria-expanded attributes
    - Position button for mobile viewports (<768px)
    - Hide button on desktop with lg:hidden
    - _Requirements: 2.5, 15.1, 15.2, 14.6_
  
  - [x] 5.2 Build mobile menu panel
    - Create slide-in menu with 80% width (max 320px)
    - Apply white background with box-shadow
    - Stack navigation links vertically with 16px spacing
    - Position menu off-screen by default (translate-x-full)
    - _Requirements: 15.4, 15.5, 15.6_
  
  - [x] 5.3 Implement mobile menu interactions
    - Toggle .is-open class on button click
    - Animate menu slide-in/out (300ms transition)
    - Transform hamburger icon to X when open
    - Close menu on Escape key press
    - Close menu on outside click
    - Trap focus within menu when open
    - Prevent body scroll when menu is open
    - _Requirements: 2.6, 15.3, 15.7, 15.8, 15.9, 15.10, 15.11_

- [x] 6. Checkpoint - Test header and navigation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Migrate Hero Section to Tailwind
  - [x] 7.1 Convert hero HTML structure
    - Apply min-h-screen and flex items-center
    - Add gradient background (from-primary via-primary-dark to-deep)
    - Create 2-column grid for desktop (lg:grid-cols-2)
    - Add responsive padding and gap
    - Apply text-white color
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [x] 7.2 Style hero text content
    - Apply headline styles (text-5xl lg:text-6xl, font-bold, font-heading)
    - Style description (text-lg lg:text-xl, leading-relaxed)
    - Ensure proper spacing between elements
    - _Requirements: 3.3, 3.4, 10.4, 10.8_
  
  - [x] 7.3 Style hero CTA buttons
    - Create primary button (bg-primary, hover:bg-primary-dark, hover:scale-102)
    - Create secondary button (border-2 border-white, hover:bg-white/10)
    - Apply consistent padding (px-8 py-3) and border-radius (rounded-2xl)
    - Add transition-all duration-200
    - _Requirements: 3.5, 12.1, 12.2, 12.3, 12.4, 12.5, 12.8, 12.9_
  
  - [x] 7.4 Implement hero entrance animations
    - Add data-animate attributes to headline, description, CTAs, image
    - Set initial state (opacity-0 translate-y-6) in CSS
    - Add data-animate-delay attributes (0ms, 100ms, 200ms, 300ms)
    - Configure animation durations (600ms for text, 800ms for image)
    - _Requirements: 3.7, 3.8, 3.9, 3.10, 3.11_
  
  - [x] 7.5 Optimize hero image
    - Add responsive image with proper width/height attributes
    - Use loading="eager" for hero image
    - Implement WebP format with JPEG fallback
    - Add object-fit cover and rounded corners
    - _Requirements: 3.6, 13.2, 13.3, 13.5, 13.6_

- [x] 8. Migrate Service Cards section to Tailwind
  - [x] 8.1 Create card grid layout
    - Apply responsive grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
    - Add gap between cards (gap-8 lg:gap-12)
    - Add section padding and container
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 8.2 Style individual card components
    - Apply white background with rounded-2xl
    - Add border (border-deep/8) and subtle shadow
    - Create image container with h-60 and overflow-hidden
    - Style card content with padding (p-6)
    - Apply heading styles (text-2xl font-semibold text-deep)
    - Style description (text-gray-text leading-relaxed)
    - _Requirements: 4.5, 4.6, 4.7, 4.8, 10.6, 10.7_
  
  - [x] 8.3 Implement card hover effects
    - Add hover state (hover:bg-ice hover:border-deep/12)
    - Implement scale animation (hover:scale-102)
    - Add smooth transition (transition-all duration-200)
    - Increase shadow on hover
    - _Requirements: 4.9, 4.12, 19.2_
  
  - [x] 8.4 Add card scroll animations
    - Add data-animate attributes to each card
    - Implement staggered delays (100ms per card)
    - Configure fade-in and slide-up animation
    - _Requirements: 4.10, 4.11_

- [x] 9. Migrate Process Timeline section to Tailwind
  - [x] 9.1 Create timeline layout structure
    - Build vertical layout for mobile (grid gap-24)
    - Create horizontal layout for desktop (lg:grid-cols-[80px_1fr])
    - Add responsive spacing and alignment
    - _Requirements: 5.1, 5.2_
  
  - [x] 9.2 Style timeline step elements
    - Create circular number indicator (w-20 h-20 rounded-full border-2 border-primary)
    - Style step heading (text-2xl font-semibold text-deep)
    - Style step description (text-gray-text leading-relaxed)
    - Add step image with rounded-2xl and proper sizing
    - _Requirements: 5.3, 5.4, 5.5, 5.6_
  
  - [x] 9.3 Implement timeline connecting line
    - Add connecting line between steps for desktop (border-l-2 border-primary)
    - Position line correctly in grid layout
    - Hide line on mobile viewports
    - _Requirements: 5.7, 5.8_
  
  - [x] 9.4 Add timeline scroll animations
    - Add data-animate attributes to each step
    - Implement sequential animation with 200ms delays
    - Configure fade-in effect (500ms duration)
    - _Requirements: 5.9, 5.10_

- [x] 10. Checkpoint - Verify sections are rendering correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Migrate Portfolio Grid section to Tailwind
  - [x] 11.1 Create portfolio grid layout
    - Apply responsive grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
    - Add gap between items (gap-12)
    - Add section container and padding
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [x] 11.2 Style portfolio grid items
    - Create relative container with rounded-2xl and overflow-hidden
    - Set aspect ratio (aspect-[4/3])
    - Add border (border-deep/6) with hover state (hover:border-deep/12)
    - Apply object-fit cover to images
    - _Requirements: 6.5, 6.10_
  
  - [x] 11.3 Implement portfolio overlay effect
    - Create absolute overlay with gradient (bg-gradient-to-t from-deep/70 to-transparent)
    - Position content at bottom with padding (p-6)
    - Style heading and description with white text
    - Add hover transition (hover:from-deep/80, duration-300)
    - _Requirements: 6.6, 6.7, 6.8_
  
  - [x] 11.4 Add portfolio hover animations
    - Implement image scale on hover (hover:scale-105)
    - Add overlay opacity transition
    - Ensure smooth transitions (transition-all duration-300)
    - _Requirements: 6.8, 6.9_

- [x] 12. Implement WhatsApp floating button
  - [x] 12.1 Create floating button structure
    - Position button fixed at bottom-right (bottom-8 right-8)
    - Create circular button (w-14 h-14 rounded-full)
    - Apply primary background color
    - Add WhatsApp SVG icon (w-7 h-7 text-white)
    - Set z-index (z-40)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 12.2 Implement button visibility logic
    - Set initial state (opacity-0 pointer-events-none)
    - Write JavaScript to detect scroll position > 300px
    - Toggle .is-visible class (opacity-100 pointer-events-auto)
    - Add fade-in and scale animation (transition-all duration-300)
    - _Requirements: 7.6, 7.7_
  
  - [x] 12.3 Style button hover and focus states
    - Add hover effects (hover:bg-primary-dark hover:scale-110)
    - Increase shadow on hover (shadow-lg hover:shadow-xl)
    - Add visible focus state (focus:outline focus:outline-2 focus:outline-whatsapp)
    - Add smooth transitions (duration-200)
    - _Requirements: 7.8, 7.9, 7.12_
  
  - [x] 12.4 Configure button link and accessibility
    - Set href to https://wa.me/5511980979915
    - Add target="_blank" and rel="noopener noreferrer"
    - Add aria-label "Fale conosco pelo WhatsApp"
    - _Requirements: 7.10, 7.11_

- [x] 13. Migrate Footer component to Tailwind
  - [x] 13.1 Create footer layout structure
    - Apply deep background color (bg-deep)
    - Create 3-column grid for desktop (lg:grid-cols-3)
    - Stack columns on mobile (grid-cols-1)
    - Add responsive padding (p-8 lg:p-16)
    - _Requirements: 8.1, 8.2, 8.9_
  
  - [x] 13.2 Style footer content sections
    - Display company logo with white text
    - Style navigation links column
    - Style contact information column
    - Apply ice color with opacity (text-ice/88)
    - _Requirements: 8.3, 8.4, 8.5, 8.7_
  
  - [x] 13.3 Implement footer link hover states
    - Add hover color transition (hover:text-primary)
    - Set transition duration (duration-200)
    - _Requirements: 8.8_
  
  - [x] 13.4 Add footer copyright section
    - Display copyright text with current year
    - Center text on mobile, align left on desktop
    - Apply appropriate text color and size
    - _Requirements: 8.6_

- [x] 14. Implement scroll animation system
  - [x] 14.1 Create Intersection Observer controller
    - Write ScrollAnimationController class in animations.js
    - Initialize IntersectionObserver with threshold 0.1 and rootMargin -50px
    - Query all elements with data-animate attribute
    - Observe each element for viewport intersection
    - _Requirements: 9.1, 9.7, 9.8_
  
  - [x] 14.2 Implement animation trigger logic
    - Add .is-visible class when element intersects viewport
    - Unobserve element after animation triggers (one-time animation)
    - Respect data-animate-delay attribute for staggered animations
    - _Requirements: 9.2, 9.3, 9.6_
  
  - [x] 14.3 Create animation CSS classes
    - Define initial state (opacity-0 translate-y-6) for [data-animate]
    - Define visible state (opacity-100 translate-y-0) for .is-visible
    - Set transition properties (duration-600 ease-out)
    - Use cubic-bezier(0.4, 0.0, 0.2, 1) easing function
    - _Requirements: 9.4, 9.5_
  
  - [x] 14.4 Add browser compatibility fallbacks
    - Check for IntersectionObserver support
    - Show all elements immediately if not supported
    - Check for prefers-reduced-motion preference
    - Disable animations if user prefers reduced motion
    - _Requirements: 20.8, 20.9_

- [x] 15. Checkpoint - Test animations and interactions
  - Ensure all tests pass, ask the user if questions arise.

- [x] 16. Implement smooth scroll behavior
  - [x] 16.1 Add CSS smooth scroll
    - Add scroll-behavior: smooth to html element in input.css
    - _Requirements: 17.5_
  
  - [x] 16.2 Implement JavaScript smooth scroll with offset
    - Write smoothScrollTo function in main.js
    - Calculate scroll position with 80px offset for sticky header
    - Implement proportional duration (300ms-1000ms based on distance)
    - Use ease-in-out easing function
    - Add scroll cancellation on user interaction
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.6_
  
  - [x] 16.3 Attach smooth scroll to navigation links
    - Query all anchor links with href starting with #
    - Add click event listeners
    - Prevent default behavior and call smoothScrollTo
    - Update active navigation state after scroll
    - _Requirements: 17.1_

- [x] 17. Implement button ripple effect
  - [x] 17.1 Create ripple animation CSS
    - Define @keyframes for ripple expansion and fade
    - Style ripple span element (absolute positioning, rounded-full)
    - Set animation duration and easing
    - _Requirements: 19.3_
  
  - [x] 17.2 Add ripple effect to buttons
    - Write createRipple function in main.js
    - Calculate click position relative to button
    - Create and append ripple span element
    - Remove ripple element after animation completes
    - Attach to all CTA buttons
    - _Requirements: 19.3_

- [x] 18. Optimize images for performance
  - [x] 18.1 Add lazy loading attributes
    - Add loading="lazy" to all images except hero
    - Add loading="eager" to hero image
    - _Requirements: 13.1, 13.2_
  
  - [x] 18.2 Add image dimensions and object-fit
    - Specify width and height attributes for all images
    - Add object-cover class to prevent layout shift
    - _Requirements: 13.3, 13.4_
  
  - [x] 18.3 Implement WebP with fallback
    - Convert images to WebP format
    - Use picture element with source for WebP
    - Provide JPEG fallback in img element
    - _Requirements: 13.5, 13.6_
  
  - [x] 18.4 Compress and optimize images
    - Compress images to maximum 200KB file size
    - Maintain visual quality during compression
    - Create responsive image variants (1x, 2x, 3x)
    - Add srcset attribute for responsive images
    - _Requirements: 13.7, 13.8_

- [x] 19. Implement accessibility features
  - [x] 19.1 Add skip link
    - Create skip link as first element in body
    - Style with sr-only class (visually hidden)
    - Show on focus with absolute positioning and high z-index
    - Link to main content area with id="main"
    - _Requirements: 14.1, 14.2, 14.3_
  
  - [x] 19.2 Add semantic HTML and ARIA attributes
    - Ensure proper semantic elements (header, nav, main, section, footer)
    - Add alt text to all images
    - Add aria-label to icon-only buttons
    - Add aria-expanded to hamburger menu button
    - Add aria-controls to hamburger menu button
    - Add aria-hidden="true" to decorative SVG icons
    - _Requirements: 14.4, 14.5, 14.6, 14.9, 14.10, 14.12_
  
  - [x] 19.3 Ensure keyboard accessibility
    - Verify all interactive elements are keyboard accessible
    - Add visible focus indicators (focus:outline-2 focus:outline-offset-2)
    - Test Tab navigation through all interactive elements
    - Ensure proper heading hierarchy (h1 → h2 → h3)
    - _Requirements: 14.7, 14.8, 14.11_
  
  - [x] 19.4 Verify color contrast compliance
    - Check all text-background combinations meet WCAG AA (4.5:1)
    - Test with color contrast analyzer tool
    - Adjust colors if needed to meet requirements
    - _Requirements: 11.7_

- [x] 20. Migrate contact page form to Tailwind
  - [x] 20.1 Style form fields with Tailwind
    - Apply input styles (border, padding, rounded, focus states)
    - Style labels with proper typography
    - Add consistent spacing between fields
    - Style submit button with primary CTA styles
    - _Requirements: 18.10_
  
  - [x] 20.2 Implement form validation
    - Write validation functions for required, email, phone, minLength
    - Add blur event listeners to all form fields
    - Validate field on blur and show error if invalid
    - _Requirements: 18.1, 18.2, 18.3, 18.4_
  
  - [x] 20.3 Style validation error states
    - Add red border to invalid fields (border-red-600)
    - Display error message below field (text-red-600 text-sm)
    - Fade out error message when field becomes valid (transition-opacity duration-200)
    - _Requirements: 18.2, 18.5, 18.6_
  
  - [x] 20.4 Implement form submission handling
    - Validate all fields on submit
    - Scroll to first invalid field if validation fails
    - Disable submit button during submission (disabled:opacity-50)
    - Show loading spinner on button during submission
    - Display success message with green background on success
    - Display error message with red background on failure
    - _Requirements: 18.7, 18.8, 18.9, 18.10_

- [x] 21. Checkpoint - Test form functionality
  - Ensure all tests pass, ask the user if questions arise.

- [x] 22. Add microinteractions and polish
  - [x] 22.1 Implement navigation link underline animation
    - Create CSS for underline pseudo-element
    - Animate width from 0 to 100% on hover (duration-200)
    - Use transform-origin left for left-to-right animation
    - _Requirements: 19.1_
  
  - [x] 22.2 Add skeleton loaders for images
    - Create skeleton loader component with shimmer animation
    - Apply gradient animation from gray-light to ice (duration-1500 infinite)
    - Display skeleton while image is loading
    - Hide skeleton when image loads
    - _Requirements: 19.5, 19.6_
  
  - [x] 22.3 Implement header height transition on scroll
    - Reduce header height from 80px to 64px when scrolled > 100px
    - Animate height change (transition-all duration-200)
    - Expand back to 80px when scrolled back to top
    - _Requirements: 19.7, 19.8_

- [x] 23. Configure production build optimization
  - [x] 23.1 Set up PurgeCSS configuration
    - Configure content paths in tailwind.config.js
    - Test that unused classes are removed
    - Verify safelist classes are preserved
    - _Requirements: 1.7, 16.8_
  
  - [x] 23.2 Add minification to build process
    - Install cssnano for CSS minification
    - Add cssnano to postcss.config.js for production
    - Create production build script in package.json
    - Test minified output
    - _Requirements: 16.7_
  
  - [x] 23.3 Configure Autoprefixer
    - Verify Autoprefixer is in PostCSS config
    - Set browserslist in package.json (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
    - Test that vendor prefixes are added correctly
    - _Requirements: 20.6_

- [x] 24. Add cross-browser compatibility features
  - [x] 24.1 Implement backdrop-filter fallback
    - Add @supports rule for backdrop-filter
    - Provide solid background fallback for unsupported browsers
    - Test in browsers without backdrop-filter support
    - _Requirements: 20.5, 20.7_
  
  - [x] 24.2 Add Intersection Observer polyfill
    - Include polyfill script for older browsers
    - Test graceful degradation when not supported
    - _Requirements: 20.8_
  
  - [x] 24.3 Test cross-browser rendering
    - Test in Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
    - Verify visual consistency across browsers
    - Test JavaScript functionality in all browsers
    - Document any browser-specific issues
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.9_

- [x] 25. Performance testing and optimization
  - [x] 25.1 Run Lighthouse performance audit
    - Test on desktop and mobile
    - Verify Performance score ≥90
    - Check FCP ≤1.5s, LCP ≤2.5s, CLS ≤0.1
    - _Requirements: 16.1, 16.2, 16.3, 16.4_
  
  - [x] 25.2 Optimize font loading
    - Add preconnect link for Google Fonts
    - Use font-display: swap for custom fonts
    - Test font loading performance
    - _Requirements: 16.5_
  
  - [x] 25.3 Optimize JavaScript execution
    - Add defer attribute to script tags
    - Verify scripts don't block rendering
    - Test JavaScript load performance
    - _Requirements: 16.6_
  
  - [x] 25.4 Implement scroll event debouncing
    - Debounce scroll event listeners to 16ms (60fps)
    - Test scroll performance with DevTools
    - Verify smooth scrolling without jank
    - _Requirements: 16.10_
  
  - [x] 25.5 Add CSS containment for performance
    - Add contain: layout style paint to card components
    - Test rendering performance improvement
    - _Requirements: 16.9_

- [x] 26. Final checkpoint and testing
  - Run complete manual testing across all pages
  - Verify all animations and interactions work correctly
  - Test responsive behavior at all breakpoints
  - Verify accessibility with screen reader
  - Run final Lighthouse audit
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks focus on code implementation that can be performed by a coding agent
- Tasks reference specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- No property-based testing tasks included (design document indicates PBT not applicable for UI/CSS work)
- Testing will be performed through visual regression, integration tests, and manual QA
- Build pipeline setup is critical first step before any HTML/CSS migration
- Mobile-first approach: implement mobile styles first, then add responsive variants
- Accessibility is integrated throughout rather than added at the end
- Performance optimization is continuous, with final audit at the end

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5"] },
    { "id": 2, "tasks": ["4.1", "4.2", "4.3"] },
    { "id": 3, "tasks": ["5.1", "5.2"] },
    { "id": 4, "tasks": ["5.3"] },
    { "id": 5, "tasks": ["7.1", "7.2", "7.3"] },
    { "id": 6, "tasks": ["7.4", "7.5"] },
    { "id": 7, "tasks": ["8.1", "8.2", "9.1", "9.2"] },
    { "id": 8, "tasks": ["8.3", "8.4", "9.3", "9.4"] },
    { "id": 9, "tasks": ["11.1", "11.2"] },
    { "id": 10, "tasks": ["11.3", "11.4"] },
    { "id": 11, "tasks": ["12.1", "12.2", "12.3", "12.4", "13.1", "13.2"] },
    { "id": 12, "tasks": ["13.3", "13.4"] },
    { "id": 13, "tasks": ["14.1", "14.2", "14.3", "14.4"] },
    { "id": 14, "tasks": ["16.1", "16.2"] },
    { "id": 15, "tasks": ["16.3", "17.1"] },
    { "id": 16, "tasks": ["17.2", "18.1", "18.2"] },
    { "id": 17, "tasks": ["18.3", "18.4"] },
    { "id": 18, "tasks": ["19.1", "19.2", "19.3", "19.4"] },
    { "id": 19, "tasks": ["20.1", "20.2"] },
    { "id": 20, "tasks": ["20.3", "20.4"] },
    { "id": 21, "tasks": ["22.1", "22.2", "22.3"] },
    { "id": 22, "tasks": ["23.1", "23.2", "23.3"] },
    { "id": 23, "tasks": ["24.1", "24.2"] },
    { "id": 24, "tasks": ["24.3"] },
    { "id": 25, "tasks": ["25.1", "25.2", "25.3", "25.4", "25.5"] }
  ]
}
```
