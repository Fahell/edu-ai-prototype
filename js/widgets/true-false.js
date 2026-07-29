/**
 * TrueFalse Widget — True or False question type
 * @namespace EduAI.Widgets.TrueFalse
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Widgets = window.EduAI.Widgets || {};

  class TrueFalse extends EduAI.Widgets.WidgetBase {
    constructor(questionData) {
      super(questionData);
      this._selectedAnswer = null;
      this._confirmBtn = null;
    }

    render() {
      const q = this.question;
      return `
        <div class="widget">
          <div class="widget__header">
            <span class="widget__type-badge">✅ True or False</span>
          </div>
          <div class="widget__prompt">${q.prompt}</div>
          <div class="widget__body">
            <div class="tf-options">
              <button class="tf-option" data-value="true">
                <span class="tf-option__icon">✓</span>
                <span class="tf-option__label">True</span>
              </button>
              <button class="tf-option" data-value="false">
                <span class="tf-option__icon">✗</span>
                <span class="tf-option__label">False</span>
              </button>
            </div>
          </div>
          <div class="widget__actions">
            <span></span>
            <button class="btn btn--primary btn--sm tf-confirm-btn" disabled>Confirm</button>
          </div>
        </div>
      `;
    }

    _attachListeners() {
      if (!this._container) return;

      const options = this._container.querySelectorAll('.tf-option');
      options.forEach((opt) => {
        opt.addEventListener('click', () => {
          if (this._answered) return;
          options.forEach((o) => o.classList.remove('tf-option--selected'));
          opt.classList.add('tf-option--selected');
          this._selectedAnswer = opt.dataset.value === 'true';
          if (this._confirmBtn) this._confirmBtn.disabled = false;
        });
      });

      this._confirmBtn = this._container.querySelector('.tf-confirm-btn');
      if (this._confirmBtn) {
        this._confirmBtn.addEventListener('click', () => {
          if (this._answered || this._selectedAnswer === null) return;
          const isCorrect = this.validate();
          this._showAnswerFeedback(isCorrect);
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
      return this._selectedAnswer === this.question.correctAnswer;
    }

    getAnswer() {
      return { answer: this._selectedAnswer };
    }

    _showAnswerFeedback(isCorrect) {
      if (!this._container) return;
      const options = this._container.querySelectorAll('.tf-option');
      options.forEach((opt) => {
        const val = opt.dataset.value === 'true';
        if (val === this.question.correctAnswer) {
          opt.classList.add('tf-option--correct');
        }
        if (val === this._selectedAnswer && !isCorrect) {
          opt.classList.add('tf-option--wrong');
        }
      });
    }
  }

  window.EduAI.Widgets.TrueFalse = TrueFalse;
})();
