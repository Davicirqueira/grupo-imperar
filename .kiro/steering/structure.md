# Project Structure

## Directory Organization

```
grupoimperar/
├── .git/                    # Git repository
├── .kiro/                   # Kiro configuration and specs
│   ├── specs/              # Feature specifications
│   └── steering/           # Project guidance documents
├── .vscode/                # VS Code settings
├── css/
│   ├── styles.css          # Main stylesheet with design tokens
│   └── animations.css      # Scroll animations and transitions
├── js/
│   ├── main.js            # Core functionality (nav, year, WhatsApp)
│   ├── animations.js      # Intersection Observer animations
│   └── contact.js         # Form validation and EmailJS integration
├── images/                 # Project images (imagem1-7.jpeg)
├── logos/                  # Brand assets (ImperAR logo SVG/PNG)
├── prompts/               # AI prompt templates
├── scripts/
│   └── optimize-images.js # Image optimization utility
├── index.html             # Homepage
├── services.html          # Services page
├── about.html            # About page
├── contact.html          # Contact page
├── package.json          # Project metadata and scripts
└── *.md                  # Documentation files
```

## HTML Pages

All pages follow consistent structure:

1. **Semantic HTML5** with proper document outline
2. **Sticky header** with navigation
3. **Main content** area with sections
4. **Footer** with contact info and links
5. **WhatsApp floating button** (appears on scroll)

### Common Elements

- Skip link for accessibility
- Meta tags (charset, viewport, description, Open Graph)
- Google Fonts preconnect
- CSS loaded in `<head>`
- JavaScript deferred at end of `<body>`

## CSS Architecture

### styles.css Structure

1. **Design tokens** (`:root` custom properties)
2. **Base reset** (box-sizing, defaults)
3. **Typography** (headings, paragraphs, lead text)
4. **Header/Navigation** (sticky header, mobile menu)
5. **Buttons** (primary, ghost, loading states)
6. **Sections** (spacing, backgrounds)
7. **Hero** (gradient background, two-column layout)
8. **Cards/Grid** (service cards, visual cards)
9. **Process Timeline** (numbered steps with images)
10. **Portfolio Grid** (project showcase with overlays)
11. **Contact Form** (fields, validation states, feedback)
12. **Footer** (dark background, three-column layout)
13. **WhatsApp Float** (fixed position, scroll-triggered)
14. **Responsive** (media queries for tablet/mobile)

### animations.css

- Fade-in animations triggered by Intersection Observer
- Staggered delays using `data-animate-delay` attributes

## JavaScript Modules

### main.js
- Mobile navigation toggle
- Scroll-based header shadow
- WhatsApp button visibility on scroll
- Dynamic year in footer
- Ripple effect on buttons

### animations.js
- Intersection Observer setup
- Scroll-triggered fade-in animations
- Staggered animation delays

### contact.js
- Real-time form validation
- Field-level error messages
- EmailJS integration
- Success/error feedback
- Character counter for message field

## Naming Conventions

### CSS Classes

- **kebab-case**: `.site-header`, `.hero-content`, `.btn-primary`
- **BEM-inspired** for components: `.card`, `.card-image`, `.card-content`
- **State classes**: `.is-open`, `.is-visible`, `.is-scrolled`, `.is-loading`
- **Validation states**: `.has-error`, `.has-success`
- **Utility classes**: `.sr-only`, `.skip-link`, `.muted`

### Data Attributes

- `data-nav-toggle`: Navigation toggle button
- `data-nav-links`: Navigation menu
- `data-whatsapp-float`: WhatsApp button
- `data-animate`: Elements with scroll animations
- `data-animate-delay`: Animation delay value (ms)
- `data-year`: Dynamic year placeholder

### File Naming

- HTML: lowercase with hyphens (e.g., `contact.html`)
- CSS: lowercase with hyphens (e.g., `styles.css`)
- JS: lowercase with hyphens (e.g., `main.js`)
- Images: lowercase with numbers (e.g., `imagem1.jpeg`)

## Component Patterns

### Cards

Two variants:
- **Standard card**: Icon + title + description, hover changes background
- **Visual card**: Image + content section, hover changes content background

### Buttons

- **Primary**: Sky blue background, white text
- **Ghost**: Transparent with border, hover adds background
- **States**: hover, active, disabled, loading (with spinner)
- **Ripple effect**: Material Design-inspired click feedback

### Forms

- Label + input/textarea structure
- Real-time validation with visual feedback
- Error messages below fields
- Success/error icons
- Character counter for textarea
- Submit button with loading state

## Asset Management

### Images

- Original images in `images/` folder
- Optimization via `npm run optimize-images` (uses sharp)
- Lazy loading for below-the-fold images
- `loading="eager"` for hero image only
- Width/height attributes for layout stability

### Logos

- SVG format preferred (scalable, small file size)
- PNG fallback available
- Used in header and footer

## Documentation Files

- `requirements.md`: Detailed project requirements
- `stack-tech.md`: Technology stack overview
- `grupo-imperar.md`: Company information
- `paleta-de-cores.md`: Color palette reference
- `emailJS.md`: EmailJS integration guide

## Code Organization Principles

1. **Separation of concerns**: HTML structure, CSS presentation, JS behavior
2. **Progressive enhancement**: Core content works without JS
3. **Mobile-first**: Base styles for mobile, media queries for larger screens
4. **Consistent spacing**: Use CSS custom properties (`--space-*`)
5. **Consistent colors**: Use CSS custom properties (`--c-*`)
6. **Semantic HTML**: Use appropriate elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
7. **Accessibility**: ARIA labels, focus states, keyboard navigation
8. **Performance**: Lazy loading, deferred scripts, optimized images
