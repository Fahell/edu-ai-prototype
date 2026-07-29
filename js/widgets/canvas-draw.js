/**
 * CanvasDraw Widget — Free-form drawing/sketch question type
 * @namespace EduAI.Widgets.CanvasDraw
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Widgets = window.EduAI.Widgets || {};

  class CanvasDraw extends EduAI.Widgets.WidgetBase {
    constructor(questionData) {
      super(questionData);
      this._canvas = null;
      this._ctx = null;
      this._drawing = false;
      this._confirmBtn = null;
      this._clearBtn = null;
      this._currentColor = '#000000';
      this._hasDrawn = false;
    }

    render() {
      const q = this.question;
      const colors = ['#000000', '#FF0000', '#0000FF', '#00AA00', '#FF8800'];

      return `
        <div class="widget">
          <div class="widget__header">
            <span class="widget__type-badge">🎨 Canvas Draw</span>
          </div>
          <div class="widget__prompt">${q.prompt}</div>
          <div class="widget__body">
            <div class="canvas-draw">
              <div class="canvas-draw__tools">
                ${colors
                  .map(
                    (c) =>
                      `<button class="canvas-draw__color${c === this._currentColor ? ' canvas-draw__color--active' : ''}" data-color="${c}" style="background:${c}"></button>`
                  )
                  .join('')}
                <button class="btn btn--ghost btn--sm canvas-draw__clear-btn">Clear</button>
              </div>
              <canvas class="canvas-draw__canvas" width="400" height="300" aria-label="Drawing canvas"></canvas>
            </div>
          </div>
          <div class="widget__actions">
            <span></span>
            <button class="btn btn--primary btn--sm canvas-confirm-btn" disabled>Submit Drawing</button>
          </div>
        </div>
      `;
    }

    _attachListeners() {
      if (!this._container) return;

      this._canvas = this._container.querySelector('.canvas-draw__canvas');
      this._confirmBtn = this._container.querySelector('.canvas-confirm-btn');
      this._clearBtn = this._container.querySelector('.canvas-draw__clear-btn');

      if (!this._canvas) return;
      this._ctx = this._canvas.getContext('2d');
      this._ctx.lineCap = 'round';
      this._ctx.lineWidth = 3;
      this._ctx.strokeStyle = this._currentColor;

      // Drawing events
      this._canvas.addEventListener('mousedown', (e) => this._startDraw(e));
      this._canvas.addEventListener('mousemove', (e) => this._draw(e));
      this._canvas.addEventListener('mouseup', () => this._endDraw());
      this._canvas.addEventListener('mouseleave', () => this._endDraw());

      // Touch support
      this._canvas.addEventListener('touchstart', (e) => { e.preventDefault(); this._startDraw(e.touches[0]); });
      this._canvas.addEventListener('touchmove', (e) => { e.preventDefault(); this._draw(e.touches[0]); });
      this._canvas.addEventListener('touchend', () => this._endDraw());

      // Color buttons
      this._container.querySelectorAll('.canvas-draw__color').forEach((btn) => {
        btn.addEventListener('click', () => {
          this._currentColor = btn.dataset.color;
          if (this._ctx) this._ctx.strokeStyle = this._currentColor;
          this._container.querySelectorAll('.canvas-draw__color').forEach((b) => b.classList.remove('canvas-draw__color--active'));
          btn.classList.add('canvas-draw__color--active');
        });
      });

      // Clear
      if (this._clearBtn) {
        this._clearBtn.addEventListener('click', () => {
          if (this._ctx) {
            this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
            this._hasDrawn = false;
            if (this._confirmBtn) this._confirmBtn.disabled = true;
          }
        });
      }

      // Confirm — for canvas, any drawing is accepted (manual grading concept)
      if (this._confirmBtn) {
        this._confirmBtn.addEventListener('click', () => {
          if (this._answered) return;
          // Canvas questions are always "accepted" in the prototype
          const dataURL = this._canvas ? this._canvas.toDataURL() : '';
          this.disable();
          this.showFeedback(true);
          this._notifyAnswer(true, { drawing: dataURL });

          EduAI.Services.Gamification.addXP(10, 'canvas-draw');
          EduAI.Services.Gamification.checkBadgeAwards();
        });
      }
    }

    _startDraw(e) {
      if (!this._ctx || !this._canvas) return;
      this._drawing = true;
      const rect = this._canvas.getBoundingClientRect();
      this._ctx.beginPath();
      this._ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }

    _draw(e) {
      if (!this._drawing || !this._ctx || !this._canvas) return;
      const rect = this._canvas.getBoundingClientRect();
      this._ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      this._ctx.stroke();
      this._hasDrawn = true;
      if (this._confirmBtn) this._confirmBtn.disabled = false;
    }

    _endDraw() {
      this._drawing = false;
    }

    validate() {
      return this._hasDrawn;
    }

    getAnswer() {
      return { drawing: this._canvas ? this._canvas.toDataURL() : '' };
    }

    disable() {
      super.disable();
      if (this._canvas) {
        this._canvas.style.pointerEvents = 'none';
      }
      if (this._confirmBtn) this._confirmBtn.disabled = true;
    }
  }

  window.EduAI.Widgets.CanvasDraw = CanvasDraw;
})();
