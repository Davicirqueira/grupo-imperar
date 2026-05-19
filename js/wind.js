/**
 * Wind Animation - Grupo ImperAR
 * Subtle ambient wind effect with floating particles and curved flow lines.
 * Uses the brand blue palette at very low opacity for an almost imperceptible ambiance.
 */
(function () {
  'use strict';

  const canvas = document.createElement('canvas');
  canvas.id = 'wind-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.7;';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width, height, particles, flowLines, animId;
  let time = 0;

  const COLORS = [
    'rgba(58, 174, 220, 0.25)',  // Azul ImperAR
    'rgba(36, 144, 186, 0.18)',  // Azul médio
    'rgba(26, 43, 92, 0.1)',     // Azul profundo
    'rgba(58, 174, 220, 0.15)',  // Azul ImperAR lighter
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  // --- Particles ---
  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: Math.random() * 0.3 + 0.1,
      speedY: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.4 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      drift: Math.random() * Math.PI * 2,
      driftSpeed: Math.random() * 0.005 + 0.002,
    };
  }

  function initParticles() {
    const count = Math.min(Math.floor((width * height) / 25000), 40);
    particles = Array.from({ length: count }, createParticle);
  }

  function updateParticle(p) {
    p.drift += p.driftSpeed;
    p.x += p.speedX + Math.sin(p.drift) * 0.2;
    p.y += p.speedY + Math.cos(p.drift) * 0.1;

    if (p.x > width + 10) { p.x = -10; p.y = Math.random() * height; }
    if (p.y < -10) p.y = height + 10;
    if (p.y > height + 10) p.y = -10;
  }

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  }

  // --- Flow Lines ---
  function createFlowLine() {
    return {
      startX: -50,
      startY: Math.random() * height,
      length: Math.random() * 200 + 100,
      speed: Math.random() * 0.4 + 0.2,
      amplitude: Math.random() * 30 + 10,
      frequency: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.12 + 0.06,
      progress: Math.random() * width,
      lineWidth: Math.random() * 1 + 0.3,
    };
  }

  function initFlowLines() {
    const count = Math.min(Math.floor(width / 200), 6);
    flowLines = Array.from({ length: count }, createFlowLine);
  }

  function updateFlowLine(fl) {
    fl.progress += fl.speed;
    if (fl.progress > width + fl.length + 50) {
      fl.progress = -fl.length;
      fl.startY = Math.random() * height;
      fl.phase = Math.random() * Math.PI * 2;
    }
  }

  function drawFlowLine(fl) {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(58, 174, 220, ${fl.opacity})`;
    ctx.lineWidth = fl.lineWidth;
    ctx.lineCap = 'round';

    const startX = fl.progress - fl.length;
    const endX = fl.progress;

    for (let x = startX; x <= endX; x += 3) {
      const relX = x - startX;
      const fadeIn = Math.min(relX / 40, 1);
      const fadeOut = Math.min((fl.length - relX) / 40, 1);
      const fade = fadeIn * fadeOut;

      const y = fl.startY + Math.sin(x * fl.frequency + fl.phase + time * 0.001) * fl.amplitude * fade;

      if (x === startX) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }

  // --- Animation Loop ---
  function animate() {
    time++;
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => { updateParticle(p); drawParticle(p); });
    flowLines.forEach(fl => { updateFlowLine(fl); drawFlowLine(fl); });

    animId = requestAnimationFrame(animate);
  }

  function init() {
    resize();
    initParticles();
    initFlowLines();
    animate();
  }

  // Debounced resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
      initParticles();
      initFlowLines();
    }, 200);
  });

  // Pause when tab is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      animate();
    }
  });

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
