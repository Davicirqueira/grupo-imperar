# Requirements Document

## Introduction

Refinamento visual de seções específicas do site Grupo ImperAR, incluindo substituição de cards com imagem por cards com ícone na seção "Por que escolher", substituição de imagens por ícones na timeline "Como trabalhamos", aplicação de gradiente diagonal global no body, e melhoria visual dos cards na página Sobre. Todas as alterações devem manter a paleta de cores existente e os design tokens do projeto.

## Glossary

- **Site**: O website do Grupo ImperAR composto por index.html, about.html, services.html e contact.html
- **Icon_Card**: Card com layout vertical contendo ícone SVG em container circular no topo, título e texto abaixo
- **Icon_Container**: Elemento circular de 56–64px com fundo `ice` (#E8F7FD) que contém o ícone SVG
- **Timeline_Circle**: Círculo de 80px na timeline "Como trabalhamos" que contém um ícone representativo da etapa
- **Global_Gradient**: Gradiente diagonal aplicado no body de todas as páginas (branco → ice → primary/3)
- **Hover_Animation**: Transição visual ao passar o cursor sobre um elemento interativo
- **Design_Tokens**: Variáveis CSS e configuração Tailwind que definem cores, espaçamentos e sombras do projeto

## Requirements

### Requirement 1: Icon Cards na seção "Por que escolher o Grupo ImperAR"

**User Story:** As a visitor, I want to see clear visual icons representing each benefit, so that I can quickly understand the value propositions without relying on generic stock photos.

#### Acceptance Criteria

1. WHEN the "Por que escolher" section is rendered, THE Icon_Card SHALL display an SVG line icon (stroke-width 1.5–2px, dimensions 28px × 28px) inside an Icon_Container centered at the top of each card, with 24px of spacing between the Icon_Container and the card title
2. THE Icon_Container SHALL have a circular shape with dimensions of 60px × 60px and a background color of `ice` (#E8F7FD), centered horizontally within the card with 24px top padding from the card edge
3. WHEN the "Equipe Especializada" card is rendered, THE Icon_Card SHALL display a shield or certificate SVG line icon representing the concept of expertise
4. WHEN the "Atendimento Ágil" card is rendered, THE Icon_Card SHALL display a clock or lightning SVG line icon representing the concept of speed
5. WHEN the "Qualidade Garantida" card is rendered, THE Icon_Card SHALL display a seal or star SVG line icon representing the concept of quality assurance
6. THE Icon_Card SHALL maintain a vertical layout with the Icon_Container centered on top, followed by the title (font-heading, text-2xl, font-semibold) and descriptive text (text-gray-text, leading-relaxed) below, all within a padding of 24px
7. WHEN the user hovers over an Icon_Card, THE Icon_Container SHALL transition its background color from `ice` (#E8F7FD) to `primary` (#3AAEDC) and the icon stroke color from `primary` (#3AAEDC) to white (#FFFFFF) with a transition duration of 200ms
8. WHEN the user hovers over an Icon_Card, THE Icon_Card SHALL apply a `translateY(-4px)` transform with a transition duration of 200ms
9. THE Icon_Card SHALL replace the existing image element (`<div class="h-60">` with `<img>`) with the Icon_Container, removing the image entirely and preserving the card's rounded-2xl border and border-deep/8 styling
10. IF the SVG icon fails to load or is absent, THEN THE Icon_Card SHALL still render the Icon_Container with its circular background, displaying an empty container without breaking the card layout

### Requirement 2: Ícones na timeline "Como trabalhamos"

**User Story:** As a visitor, I want to see representative icons in the timeline steps, so that I can visually identify each phase of the work process without large images.

#### Acceptance Criteria

1. WHEN the "Como trabalhamos" timeline is rendered, THE Timeline_Circle SHALL display an inline SVG line icon (stroke-based, no fill) sized at 32×32 pixels instead of the step number text (01, 02, 03)
2. WHEN the "Diagnóstico" step is rendered, THE Timeline_Circle SHALL display a magnifying glass icon representing inspection or analysis
3. WHEN the "Projeto" step is rendered, THE Timeline_Circle SHALL display a ruler or drafting icon representing planning
4. WHEN the "Execução" step is rendered, THE Timeline_Circle SHALL display a wrench or gear icon representing hands-on work
5. THE Timeline_Circle SHALL contain only the SVG icon element with no step number text visible in the rendered output
6. WHILE the viewport width is at or above the lg breakpoint (1024px), THE Site SHALL display the vertical connecting line (border-l-2 border-primary) between timeline steps
7. WHEN the user hovers over a Timeline_Circle, THE Timeline_Circle SHALL display a background of primary color (#3AAEDC) at 10% opacity and a box-shadow of 0 0 0 4px rgba(58, 174, 220, 0.15)
8. THE Site SHALL not render any `<img>` element with aspect-[16/9] class within each timeline step container
9. THE Timeline_Circle SHALL preserve its existing dimensions (w-20 h-20), circular shape (rounded-full), and primary-colored border (border-2 border-primary) when displaying the icon

### Requirement 3: Gradiente diagonal global no body

**User Story:** As a visitor, I want to perceive a cohesive visual flow as I scroll through the site, so that the pages feel unified and visually polished.

#### Acceptance Criteria

1. THE Site SHALL apply a diagonal gradient on the `body` element using `background: linear-gradient(to bottom right, ...)` with three color stops: `#FFFFFF` at 0%, `#E8F7FD` (ice) at 60%, and `rgba(58, 174, 220, 0.03)` (primary at 3% opacity) at 100%
2. THE Site SHALL remove the following background classes from content sections in index.html and about.html: `bg-gray-light`, `bg-gradient-to-b from-white to-ice/20`, `bg-gradient-to-b from-gray-light to-ice/20`, and `bg-gradient-to-b from-ice to-primary/5`
3. THE Site SHALL preserve the hero section background (`bg-gradient-to-br from-primary via-primary-dark to-deep`) without modification
4. THE Site SHALL preserve the footer background (`bg-deep`) without modification
5. WHEN a visitor scrolls from the top to the bottom of any page, THE Global_Gradient SHALL produce a visible color transition where the difference between the top region (white) and the mid-lower region (ice) is distinguishable without visual aids at standard screen brightness
6. THE Global_Gradient SHALL be applied consistently to all four pages: index.html, about.html, services.html, and contact.html
7. THE Site SHALL set `min-height: 100vh` on the `body` element so that the diagonal gradient is fully rendered even on pages whose content is shorter than the viewport height

### Requirement 4: Melhoria visual dos cards na página Sobre

**User Story:** As a visitor, I want the about page cards to feel visually refined and consistent with the new icon-card style, so that the entire site has a cohesive modern appearance.

#### Acceptance Criteria

1. WHEN the user hovers over a card in the "Missão/Visão/Valores" section, THE card SHALL apply a `translateY(-4px)` transform with a transition duration of 200ms using `cubic-bezier(0.4, 0, 0.2, 1)` easing, matching the Icon_Card hover behavior
2. WHEN the user hovers over a card in the "O que você pode esperar" section, THE card SHALL apply a `translateY(-4px)` transform with a transition duration of 200ms using `cubic-bezier(0.4, 0, 0.2, 1)` easing
3. WHEN the user hovers over a card in the "O que você pode esperar" section, THE Icon_Container SHALL transition its background from `ice` (#E8F7FD) to `primary` (#3AAEDC) and the SVG icon stroke color from `primary` (#3AAEDC) to white (#FFFFFF) over 200ms
4. THE cards in the about page SHALL maintain their existing content (text, icons, structure) without modification to the information displayed
5. THE cards in the "Missão/Visão/Valores" section SHALL keep the left border accent (`border-l-4 border-l-primary`) as a visual differentiator
6. WHEN the user moves the pointer away from a hovered card in either section, THE card SHALL return to its original position (`translateY(0)`) and the Icon_Container SHALL revert to its default background and icon colors using the same 200ms transition duration

### Requirement 5: Escopo de não-alteração

**User Story:** As a developer, I want clear boundaries on what should not change, so that existing working sections remain intact.

#### Acceptance Criteria

1. THE Site SHALL NOT modify the service cards with images on services.html
2. THE Site SHALL NOT alter the existing color palette defined in tailwind.config.js and css/styles.css design tokens
3. THE Site SHALL NOT modify the header navigation or footer structure on any page
4. THE Site SHALL NOT change the portfolio grid section in index.html
5. THE Site SHALL NOT modify the CTA (call-to-action) sections at the bottom of pages
