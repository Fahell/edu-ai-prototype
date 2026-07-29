/**
 * WidgetBase — Abstract base class for interactive question widgets
 * @namespace EduAI.Widgets.WidgetBase
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Widgets = window.EduAI.Widgets || {};

  class WidgetBase {
    /**
     * @param {Object} questionData - Question object from Mock.Questions
     */
    constructor(questionData) {
      this.question = questionData;
      this._answered = false;
      this._callbacks = [];
      this._container = null;
    }

    /**
     * Render the widget HTML. Must be overridden by subclasses.
     * @returns {string} HTML string
     */
    render() {
      throw new Error('WidgetBase.render() must be overridden');
    }

    /**
     * Mount the widget into a container element and attach event listeners.
     * @param {HTMLElement} container
     */
    mount(container) {
      this._container = container;
      container.innerHTML = this.render();
      this._attachListeners();
    }

    /**
     * Attach event listeners. Must be overridden by subclasses.
     * @protected
     */
    _attachListeners() {
      // Override in subclass
    }

    /**
     * Validate the user's answer. Must be overridden by subclasses.
     * @returns {boolean} true if correct
     */
    validate() {
      throw new Error('WidgetBase.validate() must be overridden');
    }

    /**
     * Get the user's current answer. Must be overridden by subclasses.
     * @returns {*}
     */
    getAnswer() {
      throw new Error('WidgetBase.getAnswer() must be overridden');
    }

    /**
     * Show feedback after answering.
     * @param {boolean} isCorrect
     */
    showFeedback(isCorrect) {
      if (!this._container) return;

      const feedbackClass = isCorrect ? 'widget__feedback--correct' : 'widget__feedback--incorrect';
      const icon = isCorrect ? '✅' : '❌';
      const text = isCorrect ? 'Correct!' : 'Not quite.';

      const feedbackEl = document.createElement('div');
      feedbackEl.className = 'widget__feedback ' + feedbackClass;
      feedbackEl.innerHTML = `
        <span class="widget__feedback-icon">${icon}</span>
        <span class="widget__feedback-text"><strong>${text}</strong></span>
        ${this.question.explanation ? `<div class="widget__explanation">${this.question.explanation}</div>` : ''}
        ${!isCorrect && this.question.socraticHint ? `<div class="widget__hint">💡 ${this.question.socraticHint}</div>` : ''}
      `;

      this._container.appendChild(feedbackEl);
    }

    /**
     * Disable all interactive elements after answering.
     */
    disable() {
      if (this._container) {
        const widget = this._container.querySelector('.widget');
        if (widget) widget.classList.add('widget--disabled');
      }
    }

    /**
     * Register a callback for when the answer is submitted.
     * @param {Function} callback - Called with (isCorrect, answer)
     */
    onAnswer(callback) {
      this._callbacks.push(callback);
    }

    /**
     * Notify all registered callbacks.
     * @param {boolean} isCorrect
     * @param {*} answer
     * @protected
     */
    _notifyAnswer(isCorrect, answer) {
      if (this._answered) return;
      this._answered = true;
      this._callbacks.forEach((cb) => {
        try {
          cb(isCorrect, answer);
        } catch (err) {
          console.error('[Widget] Callback error:', err);
        }
      });
    }

    /**
     * Check if the widget has been answered.
     * @returns {boolean}
     */
    isAnswered() {
      return this._answered;
    }
  }

  window.EduAI.Widgets.WidgetBase = WidgetBase;
})();
