## Design Aprimorado

Você é um arquiteto front-end e design system writer com especialidade em interfaces minimalistas de alto padrão. Gere um documento técnico chamado design-system-tecnico-v2.md para o site institucional do Grupo ImperAR.

Contexto fixo (não altere):

Stack: HTML + CSS + JavaScript puros (sem frameworks).
Tipografia: Barlow (headings); Inter (corpo).
Paleta: #3AAEDC primária/CTA · #1A2B5C secundária/estrutura · #2490BA hover · #E8F7FD fundos · #0F6080 acentos · #F4F6F8 fundo alternativo · #4A4A4A texto · #FFFFFF superfície.
Proporção de cores: 60% neutros / 30% #1A2B5C / 10% #3AAEDC. Evitar cores quentes.
Espaçamento: escala em múltiplos de 8px (8 / 16 / 24 / 32 / 48 / 64 / 96 / 128).
Breakpoints: mobile < 768px · tablet 768–1024px · desktop ≥ 1024px.
Páginas: Home, Serviços, Sobre, Contato.
Tom: institucional, objetivo, sem linguagem informal.
UX: nav visível em todas as páginas, menu colapsável no mobile, nav fixa após 100px, cards com hover #E8F7FD, transições 150–300ms, foco visível, touch target 44×44.
Formulário: validação com mensagens inline + CTA primário é WhatsApp.


## Estilo visual: Japandi aplicado
Japandi é a fusão do minimalismo japonês com o funcionalismo escandinavo. Traduza esse estilo nos seguintes tokens e decisões técnicas — não use a palavra "Japandi" como justificativa, apenas implemente:

Espaço em branco generoso: seções com padding-block mínimo de 96px em desktop.
Tipografia leve: preferir font-weight: 400 no corpo; headings em 600, não 700, exceto no H1 do hero.
Sem sombras decorativas: box-shadow apenas para elevação funcional (nav sticky, modal, foco). Nenhum drop-shadow decorativo em cards.
Bordas sutis: 1px solid em tons rgba suaves, nunca cor sólida intensa em bordas de cards.
Animações contidas: easing: cubic-bezier(0.4, 0, 0.2, 1) · duração máxima 300ms · sem bounce · sem parallax.
Iconografia: apenas outline, nunca filled. Stroke width uniforme de 1.5px.
Fotografia/ilustração: não especificar conteúdo, mas reservar espaços (aspect-ratio: 16/9 ou 4/3) com background: var(--color-bg-alt) como placeholder.


## Princípio de orientação do usuário (onboarding implícito)
O site deve guiar visualmente o usuário que nunca o acessou antes, sem tutoriais ou tooltips. Especifique tecnicamente:

Hierarquia visual da Home: H1 hero → subheadline → CTA WhatsApp → seção de serviços → seção sobre → formulário de contato. Cada seção deve ter id de âncora e o scroll entre elas deve ser scroll-behavior: smooth.
Hierarquia de CTAs: apenas um CTA primário visível por viewport. O botão flutuante de WhatsApp não compete com o CTA da hero — usar opacity: 0 nos primeiros 300px de scroll e transição suave para opacity: 1.
Feedback imediato: todo elemento interativo (botão, link, input) deve ter resposta visual em ≤ 150ms.
Sem jargão técnico na hero e nos cards de serviço — os textos placeholder devem ser compreensíveis para leigos.


Novos componentes obrigatórios:

A) Botão flutuante de WhatsApp

Posição: fixed, bottom: 32px, right: 32px, z-index: var(--z-overlay) (300).
Dimensões: 56×56px em desktop · 48×48px em mobile.
Visual: círculo (border-radius: 50%), background var(--color-primary), ícone WhatsApp SVG outline 24×24px branco centralizado.
Comportamento: invisível nos primeiros 300px de scroll (opacity: 0; pointer-events: none); aparece com transition: opacity 300ms ease.
href: https://wa.me/5500000000000?text= com placeholder explícito no código — comentário <!-- substituir número e mensagem -->.
Hover: background: var(--color-primary-hover); transform: scale(1.05).
Foco: outline: 2px solid var(--color-focus-ring); outline-offset: 3px.
aria-label="Fale conosco pelo WhatsApp".
Responsabilidade: controlado por nav.js junto com o scroll da nav, sem arquivo adicional.

B) Placeholders dos campos de formulário
Especifique o atributo placeholder para cada campo, seguindo o tom institucional. Os textos devem orientar sem ser redundantes com o label:

Campo               Label                       Placeholder 
Nome                Nome completo               Ex.: João Silva
Telefone            Telefone / WhatsApp         (11) 90000-0000
E-mail              E-mail                      seu@email.com.br
Assunto             Assunto                     Ex.: Orçamento para ar-condicionado split
Mensagem            Mensagem                       Descreva brevemente sua necessidade...

Regra de acessibilidade: placeholder nunca substitui label. Ambos obrigatórios. Cor do placeholder: color: var(--color-text-muted); opacity: 1 (normaliza comportamento cross-browser).


## Formato e conteúdo obrigatórios (manter da v1):

Design Tokens (CSS Variables) — adicionar tokens de animação Japandi.
Tipografia — escala completa com ajuste de peso para Japandi.
Layout — container, grid, espaçamento de seções.
Componentes — Button, Navigation, Service Card, Form Field, Footer + os dois novos acima.
Acessibilidade — contraste, foco, teclado, ARIA.
Conteúdo placeholder — microcopy sem jargão, sem promessas de prazo/preço/garantia.
Convenções de código — kebab-case, BEM simplificado, organização CSS/JS.

Critérios de qualidade:

Todas as medidas respeitam a escala 8px.
Nenhum token usa cor fora da paleta.
Nenhuma sombra decorativa.
O botão flutuante não aparece antes de 300px de scroll.
Placeholders têm label correspondente em todos os campos.
Coerência institucional em todo o microcopy.

Saída: retorne apenas o conteúdo final do arquivo design-system-tecnico-v2.md, em Markdown, com seções e tabelas onde útil.


## As três mudanças mais importantes que fiz:
O Japandi foi destrinchado em tokens reais — sem isso, cada execução interpretaria o estilo de forma diferente. Agora ele tem valores concretos: cubic-bezier, stroke width de ícone, ausência de sombra decorativa.
A orientação do usuário virou especificação técnica — âncoras com id, scroll-behavior: smooth, hierarquia de CTAs por viewport, opacidade progressiva do botão flutuante. O que era intenção virou comportamento implementável.
O botão flutuante e os placeholders foram especificados com precisão — número placeholder explícito, comentário no código, tabela de microcopy, regra cross-browser de cor do placeholder. Sem isso o desenvolvedor toma essas decisões sozinho.