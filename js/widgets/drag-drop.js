/**
 * DragDrop Widget — Drag and drop ordering/matching question type
 * @namespace EduAI.Widgets.DragDrop
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Widgets = window.EduAI.Widgets || {};

  class DragDrop extends EduAI.Widgets.WidgetBase {
    constructor(questionData) {
      super(questionData);
      this._order = [];
      this._confirmBtn = null;
      this._draggedEl = null;
    }

    render() {
      const q = this.question;
      const items = q.items || [];

      // Shuffle items for display
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      this._order = shuffled.map((item) => item.id);

      const itemsHTML = shuffled
        .map(
          (item, i) => `
          <div class="drag-drop__item" draggable="true" data-id="${item.id}" data-index="${i}">
            <span class="drag-drop__handle">⠿</span>
            <span class="drag-drop__text">${item.text}</span>
          </div>
        `
        )
        .join('');

      return `
        <div class="widget">
          <div class="widget__header">
            <span class="widget__type-badge">🔀 Drag & Drop</span>
          </div>
          <div class="widget__prompt">${q.prompt}</div>
          <div class="widget__body">
            <div class="drag-drop__target" id="drag-drop-target">${itemsHTML}</div>
          </div>
          <div class="widget__actions">
            <span></span>
            <button class="btn btn--primary btn--sm dd-confirm-btn" disabled>Confirm</button>
          </div>
        </div>
      `;
    }

    _attachListeners() {
      if (!this._container) return;

      const target = this._container.querySelector('.drag-drop__target');
      if (!target) return;

      const items = target.querySelectorAll('.drag-drop__item');
      this._confirmBtn = this._container.querySelector('.dd-confirm-btn');

      items.forEach((item) => {
        item.addEventListener('dragstart', (e) => {
          this._draggedEl = item;
          item.classList.add('drag-drop__item--dragging');
          e.dataTransfer.effectAllowed = 'move';
        });

        item.addEventListener('dragend', () => {
          item.classList.remove('drag-drop__item--dragging');
          this._draggedEl = null;
          this._updateOrder();
          if (this._confirmBtn) this._confirmBtn.disabled = false;
        });

        item.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          if (this._draggedEl && this._draggedEl !== item) {
            const rect = item.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            if (e.clientY < midY) {
              target.insertBefore(this._draggedEl, item);
            } else {
              target.insertBefore(this._draggedEl, item.nextSibling);
            }
          }
        });
      });

      if (this._confirmBtn) {
        this._confirmBtn.addEventListener('click', () => {
          if (this._answered) return;
          this._updateOrder();
          const isCorrect = this.validate();
          this.disable();
          this.showFeedback(isCorrect);
          this._notifyAnswer(isCorrect, this.getAnswer());

          const Gamification = EduAI.Services.Gamification;
          if (isCorrect) {
            Gamification.addXP(20, 'question-correct');
            Gamification.checkBadgeAwards();
          } else {
            Gamification.addXP(3, 'question-incorrect');
          }
        });
      }
    }

    _updateOrder() {
      if (!this._container) return;
      const items = this._container.querySelectorAll('.drag-drop__item');
      this._order = Array.from(items).map((el) => el.dataset.id);
    }

    validate() {
      const correctOrder = this.question.correctOrder || [];
      if (this._order.length !== correctOrder.length) return false;
      return this._order.every((id, i) => id === correctOrder[i]);
    }

    getAnswer() {
      return { order: [...this._order] };
    }

    disable() {
      super.disable();
      if (this._container) {
        this._container.querySelectorAll('.drag-drop__item').forEach((el) => {
          el.draggable = false;
        });
        if (this._confirmBtn) this._confirmBtn.disabled = true;
      }
    }
  }

  window.EduAI.Widgets.DragDrop = DragDrop;
})();
