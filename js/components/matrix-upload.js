/**
 * Matrix Upload — Matrix-style falling characters animation for content upload
 * @namespace EduAI.Components.MatrixUpload
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Components = window.EduAI.Components || {};

  const MatrixUpload = {
    /** @type {HTMLCanvasElement|null} */
    _canvas: null,
    /** @type {number|null} */
    _animFrame: null,
    /** @type {Array} */
    _columns: [],

    /**
     * Show the matrix upload animation.
     * @param {Object} [options]
     * @param {number} [options.duration=5000] - Duration in ms
     * @param {Function} [options.onComplete] - Called when animation ends
     */
    show(options) {
      const duration = options?.duration || 5000;

      if (!MatrixUpload._canvas) {
        MatrixUpload._canvas = document.getElementById('matrix-canvas');
      }
      if (!MatrixUpload._canvas) return;

      const canvas = MatrixUpload._canvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.display = 'block';

      const ctx = canvas.getContext('2d');
      const fontSize = 14;
      const columns = Math.floor(canvas.width / fontSize);
      MatrixUpload._columns = new Array(columns).fill(0);

      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789αβγδεζηθ<>{}[]';

      function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00FF41';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < MatrixUpload._columns.length; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          const y = MatrixUpload._columns[i] * fontSize;

          ctx.fillStyle = Math.random() > 0.98 ? '#FFFFFF' : '#00FF41';
          ctx.fillText(char, x, y);

          if (y > canvas.height && Math.random() > 0.975) {
            MatrixUpload._columns[i] = 0;
          }
          MatrixUpload._columns[i]++;
        }

        MatrixUpload._animFrame = requestAnimationFrame(draw);
      }

      MatrixUpload._animFrame = requestAnimationFrame(draw);

      // Auto-stop
      setTimeout(() => {
        MatrixUpload.hide();
        if (options?.onComplete) options.onComplete();
      }, duration);
    },

    /**
     * Hide the matrix animation.
     */
    hide() {
      if (MatrixUpload._animFrame) {
        cancelAnimationFrame(MatrixUpload._animFrame);
        MatrixUpload._animFrame = null;
      }
      if (MatrixUpload._canvas) {
        const ctx = MatrixUpload._canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, MatrixUpload._canvas.width, MatrixUpload._canvas.height);
        MatrixUpload._canvas.style.display = 'none';
      }
      MatrixUpload._columns = [];
    },
  };

  window.EduAI.Components.MatrixUpload = MatrixUpload;
})();
