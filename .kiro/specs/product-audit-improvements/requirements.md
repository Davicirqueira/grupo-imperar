# Requirements Document

## Introduction

Este documento especifica as melhorias prioritárias identificadas na auditoria do produto digital do Grupo ImperAR — site institucional voltado a gerar novos clientes, fortalecer a marca e facilitar o contato comercial. As melhorias focam em retorno financeiro mensurável e experiência do usuário, excluindo alterações puramente estéticas. O site é construído com HTML5, CSS3 (custom properties + Tailwind) e JavaScript vanilla (ES6+), hospedado na Netlify.

## Glossary

- **Site**: O site institucional do Grupo ImperAR (index.html, services.html, about.html, contact.html)
- **Visitante**: Pessoa que acessa o Site pela primeira vez sem conhecimento prévio da empresa
- **Lead**: Visitante que fornece dados de contato através de formulário ou WhatsApp
- **CTA**: Call-to-Action, elemento clicável que direciona o Visitante a realizar uma ação de conversão
- **Schema_Markup**: Dados estruturados em formato JSON-LD que ajudam motores de busca a entender o conteúdo
- **Core_Web_Vitals**: Métricas do Google (LCP, INP, CLS) que medem performance percebida pelo usuário
- **Social_Proof**: Elementos que demonstram credibilidade (depoimentos, números, logos de clientes)
- **Formulário_de_Contato**: Formulário na página contact.html que envia dados via EmailJS
- **WhatsApp_Float**: Botão flutuante que redireciona o Visitante para conversa no WhatsApp
- **SEO_Técnico**: Otimizações no código-fonte que melhoram indexação e ranqueamento em buscas orgânicas
- **Microinteração**: Feedback visual sutil que confirma ação do usuário (hover, clique, envio)

## Requirements

### Requirement 1: SEO Técnico e Dados Estruturados

**User Story:** As a potential client searching for HVAC services in São Paulo, I want the site to appear prominently in search results with rich information, so that I can quickly identify Grupo ImperAR as a relevant provider.

#### Acceptance Criteria

1. THE Site SHALL include JSON-LD Schema_Markup of type "LocalBusiness" on every page (index.html, services.html, about.html, contact.html) with the following properties: name, address, telephone, openingHours, and areaServed, validated without errors by Google's Rich Results Test
2. THE Site SHALL include JSON-LD Schema_Markup of type "Service" on services.html with one entry per service offered by Grupo ImperAR, each containing at minimum the "name" and "description" properties
3. THE Site SHALL provide a sitemap.xml file at the root path conforming to the sitemaps.org XML protocol, listing all 4 pages (index.html, services.html, about.html, contact.html) each with a valid `<lastmod>` date in W3C datetime format
4. THE Site SHALL include a robots.txt file at the root path that permits indexing of all public pages (index.html, services.html, about.html, contact.html) and references the sitemap.xml location
5. WHEN a page is loaded, THE Site SHALL render exactly one `<link rel="canonical">` tag in the `<head>` section containing the absolute production URL (including protocol and domain) of that page
6. THE Site SHALL include unique title tags on each page with a minimum of 30 characters and a maximum of 60 characters, containing at least one keyword relevant to the page content
7. THE Site SHALL include unique meta description tags on each page with a minimum of 70 characters and a maximum of 155 characters, containing at least one HVAC-related keyword and one action-oriented phrase (e.g., verb directing the user to act such as "solicite", "conheça", "entre em contato")
8. IF the JSON-LD Schema_Markup on any page contains syntax errors or missing required properties, THEN THE Site SHALL still render all visible page content without errors

### Requirement 2: Performance e Core Web Vitals

**User Story:** As a visitor on a mobile connection, I want the site to load quickly and respond immediately to my interactions, so that I don't abandon the page before seeing the content.

#### Acceptance Criteria

1. THE Site SHALL achieve a Largest Contentful Paint (LCP) of 2.5 seconds or less when tested on a simulated mobile connection of 9 Mbps throughput with 170ms RTT latency (Lighthouse "Performance" mobile preset)
2. THE Site SHALL achieve a Cumulative Layout Shift (CLS) of 0.1 or less on all pages
3. THE Site SHALL achieve an Interaction to Next Paint (INP) of 200 milliseconds or less on all pages
4. WHEN the hero section loads, THE Site SHALL provide explicit width and height attributes on all images to prevent layout shift
5. THE Site SHALL inline render-blocking CSS rules required to paint the first viewport (header and hero section) within a style tag in the document head, and load remaining CSS via a deferred mechanism such as link[rel=preload] with onload swap or media attribute toggle
6. THE Site SHALL serve images in WebP format with JPEG fallback, sized no larger than 800px width for card images and 1920px for hero images
7. WHEN JavaScript files are loaded, THE Site SHALL use defer or async attributes to avoid render-blocking
8. THE Site SHALL preload the first hero carousel image using a link[rel=preload] tag in the document head
9. WHEN third-party scripts are included (analytics, tracking pixels), THE Site SHALL load them asynchronously so they do not increase LCP or block the main thread for more than 50 milliseconds

### Requirement 3: Social Proof e Credibilidade

**User Story:** As a first-time visitor evaluating HVAC companies, I want to see evidence of real client satisfaction and company credentials, so that I can trust Grupo ImperAR before requesting a quote.

#### Acceptance Criteria

1. THE Site SHALL display a testimonials section on index.html with a minimum of 3 client testimonials, each including client name (first name and last initial), service type, and review text between 20 and 300 characters
2. THE Site SHALL display quantitative credibility indicators on index.html showing years of experience, completed projects count, and service coverage area as numeric values formatted as integers
3. WHEN a Visitante views the about.html page, THE Site SHALL present at least 1 team certification or technical qualification related to HVAC services, displaying the certification name and issuing entity
4. THE Site SHALL display logos or names of at least 3 client or partner brands in a dedicated section on index.html
5. WHEN a Visitante views testimonials, THE Site SHALL display a star-based rating indicator on a scale of 1 to 5 alongside each testimonial
6. WHEN a Visitante views the testimonials section on index.html, THE Site SHALL display each testimonial within a card component that is visually distinct and separated from adjacent testimonials

### Requirement 4: Otimização de Conversão e CTAs

**User Story:** As a visitor interested in requesting a quote, I want clear and compelling calls-to-action throughout my browsing experience, so that I can easily initiate contact at any moment.

#### Acceptance Criteria

1. WHEN a Visitante scrolls past 50% of the total page height on any page, THE Site SHALL display a sticky CTA bar fixed to the bottom of the viewport containing a "Solicitar Orçamento" button that links to WhatsApp or the contact form, positioned with a minimum vertical gap of 72px from the existing WhatsApp floating button (bottom-right) so that both elements remain fully visible and independently tappable
2. IF a Visitante scrolls back above 40% of the total page height, THEN THE Site SHALL hide the sticky CTA bar with a fade-out transition within 300ms
3. THE Site SHALL include at least one CTA element (link or button directing to contact.html or WhatsApp) within each `<section>` of index.html, such that every viewport-height block contains a visible conversion path without requiring additional scrolling
4. WHEN a Visitante views services.html, THE Site SHALL display a contextual CTA within each service card's modal (opened via click on the card) linking to WhatsApp with a pre-filled message that includes the specific service name (e.g., "Olá, gostaria de um orçamento de climatização para [nome do serviço].")
5. THE Site SHALL differentiate primary CTAs from secondary CTAs by rendering primary CTAs with a filled background using the brand primary color (--c-sky) and white text, and secondary CTAs with a transparent background, a 2px solid border using --c-deep at 15% opacity, and --c-deep colored text, ensuring a minimum contrast ratio of 3:1 between the two CTA styles against their background
6. WHEN a Visitante clicks any CTA element that opens a WhatsApp URL (wa.me link), THE Site SHALL call `fbq('trackCustom', 'Lead')` or `fbq('track', 'Lead')` to fire a Meta Pixel Lead event before or upon navigation to the WhatsApp URL
7. IF the Meta Pixel script fails to load (fbq is undefined), THEN THE Site SHALL still allow the CTA click to proceed to the WhatsApp URL without blocking navigation or displaying an error to the visitor

### Requirement 5: Formulário de Contato Otimizado

**User Story:** As a visitor ready to request a quote, I want a fast and intuitive form experience, so that I can submit my information without friction or confusion.

#### Acceptance Criteria

1. WHEN a Visitante submits the Formulário_de_Contato with all required fields valid (nome completo, e-mail, telefone, tipo de serviço, mensagem), THE Site SHALL display a success status message within the form area confirming the submission was sent, and fire a Meta Pixel "Lead" event
2. THE Formulário_de_Contato SHALL include a "tipo de serviço" required select field with the following predefined options: "Apartamentos na planta", "Condomínios residenciais", "Obras de alto padrão", "Infraestrutura de climatização", "Projetos VRF"
3. WHEN a Visitante types in the phone field, THE Site SHALL apply a Brazilian phone mask format (XX) XXXXX-XXXX in real time, limiting input to a maximum of 15 characters (digits plus mask characters)
4. IF the Formulário_de_Contato submission fails due to network error or EmailJS service unavailability, THEN THE Site SHALL display an error status message within the form area indicating the failure and presenting a WhatsApp link (https://wa.me/5511980979915) as an alternative contact method
5. WHEN a Visitante produces the first input event (keystroke or selection) on any field of the Formulário_de_Contato, THE Site SHALL fire a single Meta Pixel "InitiateCheckout" event for funnel tracking, and SHALL NOT fire this event again during the same page session
6. THE Formulário_de_Contato SHALL validate each required field on blur (when the field loses focus) and on subsequent input if the field is in an error state, displaying an inline error message directly below the invalid field before submission
7. THE Formulário_de_Contato SHALL enforce the following field constraints: nome completo between 2 and 100 characters, e-mail in valid format (user@domain.tld), telefone with minimum 10 digits, and mensagem between 10 and 500 characters

### Requirement 6: Acessibilidade WCAG AA

**User Story:** As a visitor using assistive technology or with visual impairments, I want the site to be fully navigable and readable, so that I can access all information and services independently.

#### Acceptance Criteria

1. THE Site SHALL maintain a minimum contrast ratio of 4.5:1 for all normal text (below 18pt regular or 14pt bold) and 3:1 for large text (18pt regular or 14pt bold and above) against their backgrounds
2. WHEN a Visitante navigates using keyboard only, THE Site SHALL provide focus indicators on all interactive elements with a minimum contrast ratio of 3:1 against the adjacent background and a visible outline or border of at least 2px
3. THE Site SHALL include alt text of no more than 125 characters on all informational images (service photos, portfolio items, logo) that communicates the image content or purpose, and SHALL set alt="" on purely decorative images (background patterns, ornamental dividers)
4. WHEN the mobile menu opens or a modal appears, THE Site SHALL trap focus within the dialog, dismiss on Escape key press, and return focus to the trigger element on close
5. THE Site SHALL use semantic HTML landmarks (header, nav, main, footer) with one h1 per page and heading hierarchy (h1-h6) without skipping levels
6. WHEN prefers-reduced-motion is set to "reduce" in the user's operating system, THE Site SHALL disable all scroll-triggered animations and CSS transitions used for decorative motion, while preserving immediate state changes (menu open/close visibility, form validation indicators)
7. THE Site SHALL set aria-expanded on the mobile menu toggle button reflecting menu open/closed state, aria-hidden on the menu panel reflecting its visibility, and role="dialog" with aria-modal="true" on modal containers
8. WHEN a non-button element acts as an interactive trigger (cards with data-modal-trigger), THE Site SHALL assign role="button", tabindex="0", and aria-haspopup="dialog", and SHALL activate on both Enter and Space key press

### Requirement 7: Responsividade e Experiência Mobile

**User Story:** As a mobile user browsing on a smartphone, I want a comfortable and fully functional experience, so that I can explore services and contact the company without needing a desktop.

#### Acceptance Criteria

1. THE Site SHALL render all content within the viewport width without horizontal scrolling at viewport widths from 320px to 1920px, with no text truncated or overlapping adjacent elements
2. WHEN viewed on mobile (viewport below 768px), THE Site SHALL display touch targets with a minimum size of 44x44 CSS pixels and a minimum spacing of 8px between adjacent touch targets
3. WHEN viewed on mobile (viewport below 768px), THE Site SHALL display the WhatsApp_Float button with a minimum touch target of 48x48 CSS pixels, positioned with at least 16px clearance from page content and other interactive elements
4. THE Site SHALL maintain a minimum font size of 16px for body text and 18px for headings on all viewport sizes without requiring user zoom
5. WHEN a Visitante views the services grid on mobile (viewport below 768px), THE Site SHALL display service cards in a single-column stack with full-width images
6. WHEN viewed on mobile (viewport below 768px), THE Site SHALL collapse the navigation menu into a toggle-activated overlay that displays menu items as a vertical list with touch targets of at least 44x44 CSS pixels

### Requirement 8: Conteúdo Orientado a Conversão

**User Story:** As a potential client comparing HVAC companies, I want to understand specifically what Grupo ImperAR offers and why they are the right choice, so that I can make an informed decision.

#### Acceptance Criteria

1. THE Site SHALL display a "Por que nos escolher" section on index.html containing at least 3 distinct differentiators, each with a numeric or quantifiable claim (e.g., response time in hours, warranty period in months, number of completed projects, or team size)
2. WHEN a Visitante views services.html, THE Site SHALL provide for each service listed: a description of no fewer than 2 sentences stating what is included, the target audience (residential, commercial, or industrial), and the expected outcome for the client
3. THE Site SHALL include an FAQ section on index.html or services.html containing at least 4 question-and-answer pairs covering: pricing/budget process, estimated timeline, warranty terms, and service coverage area
4. THE Site SHALL display the company's service area on at least one page, specifying either the neighborhoods served, the regions of São Paulo covered, or a radius in kilometers from the company's address
5. WHEN a Visitante views about.html, THE Site SHALL present at least 3 of the following data points with numeric values: year of founding, years of operation, team size, number of completed projects, or number of clients served

### Requirement 9: Rastreamento e Analytics

**User Story:** As the business owner, I want comprehensive tracking of visitor behavior and conversion events, so that I can measure ROI and optimize marketing spend.

#### Acceptance Criteria

1. THE Site SHALL include the Meta Pixel base code snippet in the `<head>` of all 4 pages (index.html, services.html, about.html, contact.html), firing a "PageView" event on each page's initial document load
2. WHEN a Visitante clicks any anchor element whose `href` contains "wa.me" (WhatsApp link), THE Site SHALL fire a Meta Pixel "Contact" custom event with a parameter identifying the source page filename (e.g., "index.html", "services.html")
3. WHEN a Visitante successfully submits the Formulário_de_Contato (after validation passes and EmailJS send resolves), THE Site SHALL fire a Meta Pixel "Lead" event
4. THE Site SHALL include the Google Analytics 4 (GA4) measurement snippet (gtag.js) in the `<head>` of all 4 pages, initializing with the site's GA4 Measurement ID
5. WHEN a Visitante clicks an element with the class "btn" that navigates to a different page or external URL (CTA button), THE Site SHALL send a GA4 event with event name "cta_click", a "cta_label" parameter containing the button's visible text, and a "source_page" parameter containing the current page filename
6. WHEN the Formulário_de_Contato page loads and the URL contains UTM query parameters, THE Site SHALL parse utm_source, utm_medium, and utm_campaign from the URL and store their values in corresponding hidden form fields so they are included in the form submission payload
7. IF the URL does not contain one or more UTM parameters when the Formulário_de_Contato page loads, THEN THE Site SHALL leave the corresponding hidden fields empty (empty string value)

### Requirement 10: Segurança e Boas Práticas de Desenvolvimento

**User Story:** As the website owner, I want the site to follow security best practices, so that visitors' data is protected and the site maintains its credibility.

#### Acceptance Criteria

1. THE Site SHALL serve all pages over HTTPS with a valid SSL certificate (not expired, domain-matching, issued by a publicly trusted Certificate Authority)
2. THE Site SHALL include the following security headers for all HTML responses via netlify.toml configuration: Content-Security-Policy, X-Content-Type-Options set to "nosniff", X-Frame-Options set to "DENY" or "SAMEORIGIN", and Referrer-Policy set to "strict-origin-when-cross-origin" or stricter
3. THE Formulário_de_Contato SHALL include a honeypot field (a visually hidden input not visible to users) such that IF the honeypot field contains any value upon submission, THEN THE Site SHALL silently discard the submission without sending to EmailJS
4. THE Site SHALL load all third-party scripts over HTTPS, and SHALL include Subresource Integrity (SRI) attributes on scripts where the CDN supports it (EmailJS via jsdelivr.net); for scripts that do not support SRI (Meta Pixel from connect.facebook.net, Google Fonts from fonts.googleapis.com), loading over HTTPS from their official domains is sufficient
5. WHEN the Formulário_de_Contato processes user input, THE Site SHALL strip all HTML tags and trim whitespace from each field value before sending the template parameters to EmailJS
6. IF the EmailJS submission fails, THEN THE Site SHALL display an error message to the user indicating the failure and SHALL NOT expose service IDs, template IDs, or API keys in the error output shown to the user
