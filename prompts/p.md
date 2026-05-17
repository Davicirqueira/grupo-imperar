Contexto do projeto:
Site estático em HTML/CSS/Tailwind com animations.js centralizado. Arquivos principais: index.html, services.html, about.html, contact.html. Imagens em /assets/img/. Sem build step — tudo é vanilla.
Restrições:

Não alterar estrutura de navegação nem URLs existentes
Não introduzir dependências novas (sem npm, sem frameworks JS)
WebP só se o arquivo .webp existir em /assets/img/ — caso contrário, usar JPG/PNG fallback
Manter compatibilidade com Safari 15+

Implementação — ordem sugerida:

Fix hero image (menor risco, valida o ambiente)
animations.js em todas as páginas
Footer redesign + WhatsApp button (componente reutilizável)
Timeline images
services.html → novo layout
about.html → novo layout
Backgrounds com gradientes sutis

Critério de pronto para cada item:

Renderiza corretamente em mobile (375px) e desktop (1280px)
Sem erros no console
Animações não travam scroll
WhatsApp abre wa.me/ com número correto (use placeholder +5511999999999 se não definido)

Entrega:

Mostre o diff dos arquivos alterados após cada grupo de mudanças
Se uma mudança for destrutiva ou irreversível, me avise antes de executar
Não pergunte confirmação para itens já aprovados acima — execute e reporte

Pode começar.


Os ganhos desse formato são: a ordem explícita evita que o agente comece pelo mais complexo e quebre o ambiente; as restrições evitam que ele instale dependências ou gere WebPs fantasmas; e o critério de pronto substitui o loop de "ficou bom?" que consome tokens sem adicionar valor.