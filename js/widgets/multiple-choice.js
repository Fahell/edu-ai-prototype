/**
 * MultipleChoice Widget — Clickable A/B/C/D options
 * @namespace EduAI.Widgets.MultipleChoice
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Widgets = window.EduAI.Widgets || {};

  class MultipleChoice extends EduAI.Widgets.WidgetBase {
    constructor(questionData) {
      super(questionData);
      this._selectedIndex = null;
      this._confirmBtn = null;
    }

    render() {
      const q = this.question;
      const options = q.options || [];

      const optionsHTML = options
        .map(
          (opt, i) => `
        <div class="mc-option" data-index="${i}">
          <span class="mc-option__label">${opt.label || String.fromCharCode(65 + i)}</span>
          <span class="mc-option__text">${opt.text}</span>
          <span class="mc-option__check"></span>
        </div>
      `
        )
        .join('');

      return `
        <div class="widget">
          <div class="widget__header">
            <span class="widget__type-badge">📝 Multiple Choice</span>
          </div>
          <div class="widget__prompt">${q.prompt}</div>
          <div class="widget__body">
            <div class="mc-options">${optionsHTML}</div>
          </div>
          <div class="widget__actions">
            <span></span>
            <button class="btn btn--primary btn--sm mc-confirm-btn" disabled>Confirm</button>
          </div>
        </div>
      `;
    }

    _attachListeners() {
      if (!this._container) return;

      const options = this._container.querySelectorAll('.mc-option');
      options.forEach((opt) => {
        opt.addEventListener('click', () => {
          if (this._answered) return;

          // Deselect all
          options.forEach((o) => o.classList.remove('mc-option--selected'));

          // Select clicked
          opt.classList.add('mc-option--selected');
          this._selectedIndex = parseInt(opt.dataset.index, 10);

          // Enable confirm button
          if (this._confirmBtn) this._confirmBtn.disabled = false;
        });
      });

      this._confirmBtn = this._container.querySelector('.mc-confirm-btn');
      if (this._confirmBtn) {
        this._confirmBtn.addEventListener('click', () => {
          if (this._answered || this._selectedIndex === null) return;
          const isCorrect = this.validate();
          this._showAnswerFeedback(isCorrect);
          this.disable();
          this.showFeedback(isCorrect);
          this._notifyAnswer(isCorrect, this.getAnswer());

          // Gamification
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
      const q = this.question;
      if (this._selectedIndex === null) return false;
      return q.options[this._selectedIndex]?.correct === true;
    }

    getAnswer() {
      if (this._selectedIndex === null) return null;
      return {
        selectedIndex: this._selectedIndex,
        selectedLabel: this.question.options[this._selectedIndex]?.label,
        selectedText: this.question.options[this._selectedIndex]?.text,
      };
    }

    _showAnswerFeedback(isCorrect) {
      if (!this._container) return;
      const options = this._container.querySelectorAll('.mc-option');

      options.forEach((opt, i) => {
        const isThisCorrect = this.question.options[i]?.correct === true;

        if (isThisCorrect) {
          opt.classList.add('mc-option--correct');
          opt.querySelector('.mc-option__check').textContent = '✓';
        }

        if (i === this._selectedIndex && !isCorrect) {
          opt.classList.add('mc-option--wrong');
          opt.querySelector('.mc-option__check').textContent = '✗';
        }
      });
    }

    disable() {
      super.disable();
      if (this._confirmBtn) this._confirmBtn.disabled = true;
    }
  }

  window.EduAI.Widgets.MultipleChoice = MultipleChoice;
})();
