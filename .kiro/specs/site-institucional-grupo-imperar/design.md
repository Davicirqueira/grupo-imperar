# Design Document - Site Institucional Grupo ImperAR

## Overview

### Purpose and Scope

O site institucional do Grupo ImperAR é uma aplicação web estática desenvolvida para apresentar a empresa de climatização e refrigeração, seus serviços, projetos e canais de contato. A solução prioriza performance, acessibilidade e conversão de leads através de múltiplos CTAs estrategicamente posicionados.

**Objetivos principais:**
- Estabelecer presença digital profissional alinhada à identidade visual da marca
- Converter visitantes em leads qualificados através de formulário de contato e WhatsApp
- Apresentar portfólio de serviços e projetos com galeria de imagens
- Garantir experiência responsiva e acessível em todos os dispositivos
- Otimizar para SEO local e performance em conexões lentas

**Escopo técnico:**
- 5 páginas HTML estáticas (Home, Sobre, Serviços, Galeria, Contato)
- Stack: HTML5 puro + CSS3 + JavaScript vanilla (sem frameworks)
- Hospedagem: Servidor estático (Hostinger) com HTTPS
- Integração: Google Analytics 4, Google Tag Manager, Google Workspace (e-mail)
- Domínio: grupoimperar.com.br

### Technology Stack

**Frontend:**
- HTML5 semântico (validação W3C)
- CSS3 com variáveis CSS para sistema de design
- JavaScript ES6+ vanilla (sem bibliotecas externas)
- Google Fonts: Barlow (títulos) + Inter (corpo)

**APIs nativas do navegador:**
- Intersection Observer API (scroll animations)
- Fetch API (envio de formulário)
- LocalStorage API (persistência de preferências)
- History API (navegação suave)

**Ferramentas de build:**
- Minificação CSS: cssnano ou clean-css
- Minificação JS: Terser
- Otimização de imagens: ImageOptim ou Squoosh
- Validação HTML: W3C Validator

**Infraestrutura:**
- Hospedagem: Hostinger (plano Business ou superior)
- SSL: Let's Encrypt (renovação automática)
- DNS: Cloudflare (opcional para CDN e proteção DDoS)
- E-mail: Google Workspace (contato@, suporte@)

**Analytics e monitoramento:**
- Google Analytics 4 (GA4)
- Google Tag Manager (GTM)
- Google Search Console
- PageSpeed Insights (monitoramento de performance)

### Key Design Decisions

**1. HTML puro ao invés de frameworks**
- **Decisão:** Usar HTML5 puro sem React, Vue ou outros frameworks
- **Rationale:** Site institucional com conteúdo estático não justifica overhead de framework. HTML puro garante:
  - Tempo de carregamento mínimo (sem bundle JS de 100KB+)
  - SEO otimizado (conteúdo renderizado no servidor)
  - Manutenção simples sem dependências externas
  - Compatibilidade universal com navegadores
- **Valida requisitos:** 1, 10, 16, 18

**2. JavaScript vanilla sem bibliotecas**
- **Decisão:** Implementar toda interatividade com JavaScript nativo
- **Rationale:** Funcionalidades necessárias (validação de formulário, animações, lazy loading) são suportadas nativamente por navegadores modernos. Evita:
  - Dependências externas que podem ficar desatualizadas
  - Vulnerabilidades de segurança de terceiros
  - Overhead de download e parsing
- **Valida requisitos:** 10, 16, 17

**3. Sistema de design baseado em variáveis CSS**
- **Decisão:** Centralizar cores, espaçamentos e tipografia em variáveis CSS
- **Rationale:** Garante consistência visual e facilita manutenção. Mudanças na paleta de cores são aplicadas globalmente alterando apenas as variáveis.
- **Valida requisitos:** 2, 16

**4. Mobile-first responsive design**
- **Decisão:** Desenvolver primeiro para mobile, depois expandir para desktop
- **Rationale:** Maioria dos acessos vem de dispositivos móveis. Abordagem mobile-first garante:
  - Performance otimizada em dispositivos com menos recursos
  - Conteúdo priorizado (o que cabe em mobile é essencial)
  - Progressive enhancement natural
- **Valida requisitos:** 3, 10

**5. Lazy loading de imagens com Intersection Observer**
- **Decisão:** Carregar imagens apenas quando entram no viewport
- **Rationale:** Reduz tempo de carregamento inicial e consumo de dados. Intersection Observer é API nativa com suporte universal (polyfill para navegadores antigos).
- **Valida requisitos:** 7, 10

**6. Animações CSS com fallback para prefers-reduced-motion**
- **Decisão:** Implementar animações via CSS transitions/animations, não JavaScript
- **Rationale:** Animações CSS são aceleradas por GPU e respeitam automaticamente preferências de acessibilidade. JavaScript apenas adiciona/remove classes.
- **Valida requisitos:** 12, 21

**7. Formulário com validação client-side e server-side**
- **Decisão:** Validar no cliente para UX imediata, mas sempre revalidar no servidor
- **Rationale:** Validação client-side pode ser contornada. Validação server-side garante integridade dos dados.
- **Valida requisitos:** 8, 9, 17

**8. Hospedagem estática ao invés de servidor dinâmico**
- **Decisão:** Hospedar arquivos estáticos sem backend (exceto para envio de formulário)
- **Rationale:** Site institucional não requer processamento server-side. Hospedagem estática oferece:
  - Custo reduzido
  - Performance superior (servido via CDN)
  - Segurança aumentada (sem vulnerabilidades de backend)
  - Escalabilidade automática
- **Valida requisitos:** 18

## Architecture

### System Architecture

```mermaid
graph TB
    subgraph "Client Browser"
        HTML[HTML Pages]
        CSS[CSS Stylesheets]
        JS[JavaScript Modules]
        Assets[Images & Fonts]
    end
    
    subgraph "Core Components"
        Nav[Navegação_Principal]
        Form[Formulário_Contato]
        Gallery[Galeria]
        Loader[Carregador_Imagens]
        Animator[Motor_Animação]
    end
    
    subgraph "External Services"
        GA4[Google Analytics 4]
        GTM[Google Tag Manager]
        GWS[Google Workspace Email]
        GMaps[Google Maps API]
    end
    
    subgraph "Infrastructure"
        CDN[Hostinger CDN]
        SSL[SSL Certificate]
        DNS[DNS grupoimperar.com.br]
    end
    
    HTML --> Nav
    HTML --> Form
    HTML --> Gallery
    
    JS --> Loader
    JS --> Animator
    JS --> Form
    
    Form --> GWS
    Gallery --> Loader
    Nav --> Animator
    
    HTML --> GA4
    GA4 --> GTM
    
    CDN --> SSL
    DNS --> CDN
    
    Assets --> Loader
