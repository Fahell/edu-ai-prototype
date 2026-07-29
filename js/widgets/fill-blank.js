/**
 * FillBlank Widget — Fill in the blank question type
 * @namespace EduAI.Widgets.FillBlank
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Widgets = window.EduAI.Widgets || {};

  class FillBlank extends EduAI.Widgets.WidgetBase {
    constructor(questionData) {
      super(questionData);
      this._inputEl = null;
      this._confirmBtn = null;
    }

    render() {
      const q = this.question;
      // Prompt may contain ___ which gets replaced with an input field
      const promptHTML = q.prompt.replace(/___/g, '<input type="text" class="fill-blank__input" placeholder="..." aria-label="Your answer" autocomplete="off">');

      return `
        <div class="widget">
          <div class="widget__header">
            <span class="widget__type-badge">✏️ Fill in the Blank</span>
          </div>
          <div class="widget__prompt fill-blank__prompt">${promptHTML}</div>
          <div class="widget__actions">
            <span></span>
            <button class="btn btn--primary btn--sm fill-blank-confirm-btn" disabled>Confirm</button>
          </div>
        </div>
      `;
    }

    _attachListeners() {
      if (!this._container) return;

      this._inputEl = this._container.querySelector('.fill-blank__input');
      this._confirmBtn = this._container.querySelector('.fill-blank-confirm-btn');

      if (this._inputEl) {
        this._inputEl.addEventListener('input', () => {
          if (this._confirmBtn) {
            this._confirmBtn.disabled = !this._inputEl.value.trim();
          }
        });
        this._inputEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && this._inputEl.value.trim()) {
            this._confirmBtn?.click();
          }
        });
      }

      if (this._confirmBtn) {
        this._confirmBtn.addEventListener('click', () => {
          if (this._answered || !this._inputEl?.value.trim()) return;
          const isCorrect = this.validate();
          this._showAnswerFeedback(isCorrect);
          this.disable();
          this.showFeedback(isCorrect);
          this._notifyAnswer(isCorrect, this.getAnswer());

          const Gamification = EduAI.Services.Gamification;
          if (isCorrect) {
            Gamification.addXP(15, 'question-correct');
            Gamification.checkBadgeAwards();
          } else {
            Gamification.addXP(3, 'question-incorrect');
          }
        });
      }
    }

    validate() {
      const answer = (this._inputEl?.value || '').trim().toLowerCase();
      const acceptable = this.question.acceptableAnswers || [this.question.correctAnswer];
      return acceptable.some((a) => a.toLowerCase() === answer);
    }

    getAnswer() {
      return { text: (this._inputEl?.value || '').trim() };
    }

    _showAnswerFeedback(isCorrect) {
      if (!this._inputEl) return;
      this._inputEl.classList.add(isCorrect ? 'fill-blank__input--correct' : 'fill-blank__input--wrong');
      if (!isCorrect) {
        const correctEl = document.createElement('div');
        correctEl.className = 'fill-blank__correct-answer';
        correctEl.innerHTML = `<strong>Answer:</strong> ${this.question.correctAnswer}`;
        this._container.appendChild(correctEl);
      }
    }

    disable() {
      super.disable();
      if (this._inputEl) this._inputEl.disabled = true;
      if (this._confirmBtn) this._confirmBtn.disabled = true;
    }
  }

  window.EduAI.Widgets.FillBlank = FillBlank;
})();
