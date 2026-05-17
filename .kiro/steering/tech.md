# Technology Stack

## Core Technologies

This project uses **vanilla web technologies** without frameworks or build tools:

- **HTML5**: Semantic markup, no templating engines
- **CSS3**: Pure CSS with custom properties (CSS variables), no preprocessors
- **JavaScript**: Vanilla ES6+, no frameworks or libraries

## Typography

- **Barlow**: Headings and titles (weights: 600, 700)
- **Inter**: Body text and UI elements (weights: 400, 600)
- Loaded via Google Fonts with preconnect optimization

## Color System

CSS custom properties defined in `:root`:

```css
--c-sky: #3aaedc        /* Primary brand color */
--c-deep: #1a2b5c       /* Secondary/headings */
--c-hover: #2490ba      /* Interactive states */
--c-ice: #e8f7fd        /* Light backgrounds */
--c-accent: #0f6080     /* Accents/errors */
--c-neutral: #f4f6f8    /* Alternative backgrounds */
--c-text: #4a4a4a       /* Body text */
--c-white: #ffffff      /* White */
```

**Color proportions**: ~60% neutral, 30% deep blue, 10% sky blue

## Spacing System

Base unit of **8px** with predefined scale:

```css
--space-1: 8px
--space-2: 16px
--space-3: 24px
--space-4: 32px
--space-5: 48px
--space-6: 64px
--space-7: 96px
--space-8: 128px
```

## Responsive Breakpoints

- **Mobile**: < 768px (single column layouts)
- **Tablet**: 768px - 1024px (2-column grids)
- **Desktop**: ≥ 1024px (3-column grids)
- **Large Desktop**: ≥ 1440px (wider container)

## File Structure

```
/
├── index.html              # Homepage
├── services.html           # Services page
├── about.html             # About page
├── contact.html           # Contact page
├── css/
│   ├── styles.css         # Main styles
│   └── animations.css     # Animation utilities
├── js/
│   ├── main.js           # Core functionality
│   ├── animations.js     # Scroll animations
│   └── contact.js        # Form handling
├── images/               # Optimized images
├── logos/               # Brand assets
└── scripts/
    └── optimize-images.js # Image optimization utility
```

## Development Tools

- **sharp**: Image optimization (devDependency)
- **Node.js**: For running optimization scripts only

## Common Commands

```bash
# Optimize images
npm run optimize-images

# No build step required - serve files directly
# Use any static server (Live Server, Python http.server, etc.)
```

## Browser Support

Target latest 2 versions of:
- Chrome
- Firefox
- Safari
- Edge

## Performance Guidelines

- Load CSS before render to prevent FOUC
- Defer non-critical JavaScript
- Lazy load below-the-fold images
- Minify CSS/JS for production
- Optimize images with sharp script

## Accessibility Standards

- WCAG AA compliance (4.5:1 contrast for normal text, 3:1 for large text)
- Semantic HTML5 elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators on interactive elements
- Alt text for all images

## Form Integration

Contact forms use **EmailJS** for email delivery without backend infrastructure.
