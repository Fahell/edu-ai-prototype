/**
 * Slider Widget — Numeric slider question type
 * @namespace EduAI.Widgets.Slider
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Widgets = window.EduAI.Widgets || {};

  class Slider extends EduAI.Widgets.WidgetBase {
    constructor(questionData) {
      super(questionData);
      this._value = null;
      this._confirmBtn = null;
      this._valueDisplay = null;
    }

    render() {
      const q = this.question;
      const min = q.min ?? 0;
      const max = q.max ?? 100;
      const step = q.step ?? 1;
      const defaultVal = q.defaultValue ?? Math.round((min + max) / 2);
      this._value = defaultVal;

      return `
        <div class="widget">
          <div class="widget__header">
            <span class="widget__type-badge">🎚️ Slider</span>
          </div>
          <div class="widget__prompt">${q.prompt}</div>
          <div class="widget__body">
            <div class="slider-widget">
              <span class="slider-widget__min">${min}</span>
              <input type="range" class="slider-widget__input" min="${min}" max="${max}" step="${step}" value="${defaultVal}" aria-label="Slider answer">
              <span class="slider-widget__max">${max}</span>
            </div>
            <div class="slider-widget__value" id="slider-value">${defaultVal}</div>
          </div>
          <div class="widget__actions">
            <span></span>
            <button class="btn btn--primary btn--sm slider-confirm-btn">Confirm</button>
          </div>
        </div>
      `;
    }

    _attachListeners() {
      if (!this._container) return;

      const slider = this._container.querySelector('.slider-widget__input');
      this._valueDisplay = this._container.querySelector('#slider-value');
      this._confirmBtn = this._container.querySelector('.slider-confirm-btn');

      if (slider) {
        slider.addEventListener('input', () => {
          this._value = parseFloat(slider.value);
          if (this._valueDisplay) this._valueDisplay.textContent = this._value;
        });
      }

      if (this._confirmBtn) {
        this._confirmBtn.addEventListener('click', () => {
          if (this._answered) return;
          const isCorrect = this.validate();
          this.disable();
          this.showFeedback(isCorrect);
          this._notifyAnswer(isCorrect, this.getAnswer());

          const Gamification = EduAI.Services.Gamification;
          if (isCorrect) {
            Gamification.addXP(10, 'question-correct');
            Gamification.checkBadgeAwards();
          } else {
            Gamification.addXP(2, 'question-incorrect');
          }
        });
      }
    }

    validate() {
      const tolerance = this.question.tolerance ?? 0;
      return Math.abs(this._value - this.question.correctValue) <= tolerance;
    }

    getAnswer() {
      return { value: this._value };
    }

    disable() {
      super.disable();
      const slider = this._container?.querySelector('.slider-widget__input');
      if (slider) slider.disabled = true;
      if (this._confirmBtn) this._confirmBtn.disabled = true;
    }
  }

  window.EduAI.Widgets.Slider = Slider;
})();
