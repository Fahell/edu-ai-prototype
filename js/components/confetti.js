/**
 * Confetti — Particle burst animation for celebrations
 * @namespace EduAI.Components.Confetti
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Components = window.EduAI.Components || {};

  const Confetti = {
    /** @type {HTMLCanvasElement|null} */
    _canvas: null,
    /** @type {CanvasRenderingContext2D|null} */
    _ctx: null,
    /** @type {Array} */
    _particles: [],
    /** @type {number|null} */
    _animFrame: null,

    /**
     * Fire a confetti burst.
     * @param {Object} [options]
     * @param {number} [options.count=80] - Number of particles
     * @param {number} [options.duration=2000] - Duration in ms
     */
    fire(options) {
      const count = options?.count ?? 80;
      const duration = options?.duration ?? 2000;

      if (!Confetti._canvas) {
        Confetti._canvas = document.getElementById('confetti-canvas');
      }
      if (!Confetti._canvas) return;

      Confetti._canvas.width = window.innerWidth;
      Confetti._canvas.height = window.innerHeight;
      Confetti._ctx = Confetti._canvas.getContext('2d');
      Confetti._canvas.style.display = 'block';

      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFD93D', '#6BCB77'];

      Confetti._particles = [];
      for (let i = 0; i < count; i++) {
        Confetti._particles.push({
          x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
          y: window.innerHeight / 2,
          vx: (Math.random() - 0.5) * 12,
          vy: -Math.random() * 15 - 5,
          size: Math.random() * 8 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          life: 1,
        });
      }

      const startTime = performance.now();

      function animate(now) {
        const elapsed = now - startTime;
        if (elapsed > duration) {
          Confetti._cleanup();
          return;
        }

        const ctx = Confetti._ctx;
        ctx.clearRect(0, 0, Confetti._canvas.width, Confetti._canvas.height);

        Confetti._particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.3; // gravity
          p.rotation += p.rotationSpeed;
          p.life = Math.max(0, 1 - elapsed / duration);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        });

        Confetti._animFrame = requestAnimationFrame(animate);
      }

      Confetti._animFrame = requestAnimationFrame(animate);
    },

    /** @private */
    _cleanup() {
      if (Confetti._animFrame) {
        cancelAnimationFrame(Confetti._animFrame);
        Confetti._animFrame = null;
      }
      if (Confetti._ctx && Confetti._canvas) {
        Confetti._ctx.clearRect(0, 0, Confetti._canvas.width, Confetti._canvas.height);
      }
      if (Confetti._canvas) {
        Confetti._canvas.style.display = 'none';
      }
      Confetti._particles = [];
    },
  };

  window.EduAI.Components.Confetti = Confetti;
})();
