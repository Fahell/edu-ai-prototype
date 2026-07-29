/**
 * Triagem Page — AI-powered questionnaire for custom subject creation
 * @namespace EduAI.Pages.Triagem
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Pages = window.EduAI.Pages || {};

  /** @type {number} Current triage step */
  let _step = 0;

  /** @type {Object} Collected triage data */
  let _data = {};

  const TRIAGE_STEPS = [
    {
      question: 'What subject or topic would you like to learn?',
      placeholder: 'e.g., Raciocínio Lógico, Machine Learning, Guitar...',
      key: 'subject',
      type: 'text',
    },
    {
      question: 'What is your current level of knowledge?',
      options: [
        { label: '🌱 Complete Beginner', value: 'beginner' },
        { label: '📗 Some Basics', value: 'basic' },
        { label: '📘 Intermediate', value: 'intermediate' },
        { label: '📙 Advanced', value: 'advanced' },
      ],
      key: 'level',
      type: 'options',
    },
    {
      question: 'What is your goal for studying this?',
      options: [
        { label: '🎓 Exam / Contest prep', value: 'exam' },
        { label: '💼 Career / Professional', value: 'career' },
        { label: '🧠 Personal curiosity', value: 'curiosity' },
        { label: '📚 School / University', value: 'school' },
      ],
      key: 'goal',
      type: 'options',
    },
    {
      question: 'How much time can you dedicate per day?',
      options: [
        { label: '⚡ 5-15 minutes (quick sessions)', value: '5-15' },
        { label: '⏱️ 15-30 minutes', value: '15-30' },
        { label: '⏰ 30-60 minutes', value: '30-60' },
        { label: '📚 1+ hours (intensive)', value: '60+' },
      ],
      key: 'time',
      type: 'options',
    },
    {
      question: 'Any specific subtopics you want to focus on?',
      placeholder: 'e.g., just probability, or only speaking skills...',
      key: 'focus',
      type: 'text',
    },
  ];

  const Triagem = {
    /**
     * Render the triagem page.
     * @returns {string} HTML string
     */
    render() {
      _step = 0;
      _data = {};

      return `
        <div class="triagem">
          <div class="triagem__header">
            <h1 class="triagem__title">🎯 Custom Subject Setup</h1>
            <p class="triagem__subtitle">Let our AI build a personalized study plan for you</p>
          </div>
          <div class="triagem__progress">
            <div class="triagem__progress-bar">
              <div class="triagem__progress-fill" id="triagem-progress" style="width: 0%"></div>
            </div>
            <span class="triagem__progress-label" id="triagem-step-label">Step 1 of ${TRIAGE_STEPS.length}</span>
          </div>
          <div class="triagem__content" id="triagem-content">
            ${Triagem._renderStep(0)}
          </div>
        </div>
      `;
    },

    /**
     * Initialize triagem page.
     */
    init() {
      Triagem._attachStepHandlers();
    },

    /**
     * Render a single triage step.
     * @param {number} stepIndex
     * @returns {string} HTML
     * @private
     */
    _renderStep(stepIndex) {
      const step = TRIAGE_STEPS[stepIndex];
      if (!step) return Triagem._renderResults();

      let inputHTML = '';
      if (step.type === 'text') {
        inputHTML = `
          <input type="text" class="triagem__input" id="triagem-input" placeholder="${step.placeholder || ''}" autocomplete="off">
          <button class="btn btn--primary btn--lg triagem__next-btn" id="triagem-next">Continue →</button>
        `;
      } else if (step.type === 'options') {
        inputHTML = `
          <div class="triagem__options">
            ${step.options.map((opt) => `
              <button class="triagem__option" data-value="${opt.value}">
                <span class="triagem__option-label">${opt.label}</span>
              </button>
            `).join('')}
          </div>
        `;
      }

      return `
        <div class="triagem__step animate-fadeIn">
          <h2 class="triagem__question">${step.question}</h2>
          ${inputHTML}
        </div>
      `;
    },

    /**
     * Render the final results/loading screen.
     * @returns {string} HTML
     * @private
     */
    _renderResults() {
      // Simulate AI processing
      setTimeout(() => {
        const content = document.getElementById('triagem-content');
        if (content) {
          content.innerHTML = `
            <div class="triagem__complete animate-fadeIn">
              <div class="triagem__complete-icon">✅</div>
              <h2 class="triagem__complete-title">Study Plan Ready!</h2>
              <p class="triagem__complete-text">We have created a personalized study plan for <strong>${_data.subject || 'your subject'}</strong>.</p>
              <div class="triagem__plan-preview">
                <div class="triagem__plan-card">
                  <span class="triagem__plan-icon">📖</span>
                  <div class="triagem__plan-info">
                    <div class="triagem__plan-name">${_data.subject || 'Custom Subject'}</div>
                    <div class="triagem__plan-meta">5 modules · ~${_data.time || '30'} min/day</div>
                  </div>
                </div>
              </div>
              <div class="triagem__actions">
                <button class="btn btn--primary btn--lg" id="triagem-start">Start Learning →</button>
                <a href="#/catalog" class="btn btn--ghost">Back to Catalog</a>
              </div>
            </div>
          `;

          const startBtn = document.getElementById('triagem-start');
          if (startBtn) {
            startBtn.addEventListener('click', () => {
              // In a real app, this would create the custom subject
              EduAI.Components.Toast.show('Custom subject created! Starting your first lesson...', 'success', 3000);
              EduAI.Router.navigate('#/catalog');
            });
          }
        }
      }, 2000);

      return `
        <div class="triagem__loading">
          <div class="triagem__loading-spinner"></div>
          <p>🧠 AI is analyzing your preferences...</p>
          <p class="triagem__loading-sub">Building your personalized study plan</p>
        </div>
      `;
    },

    /**
     * Attach event handlers for the current step.
     * @private
     */
    _attachStepHandlers() {
      const step = TRIAGE_STEPS[_step];
      if (!step) return;

      if (step.type === 'text') {
        const input = document.getElementById('triagem-input');
        const nextBtn = document.getElementById('triagem-next');

        if (input) {
          input.focus();
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
              Triagem._advance(input.value.trim());
            }
          });
        }
        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            if (input && input.value.trim()) {
              Triagem._advance(input.value.trim());
            }
          });
        }
      } else if (step.type === 'options') {
        const options = document.querySelectorAll('.triagem__option');
        options.forEach((opt) => {
          opt.addEventListener('click', () => {
            Triagem._advance(opt.dataset.value);
          });
        });
      }
    },

    /**
     * Advance to the next triage step.
     * @param {string} answer
     * @private
     */
    _advance(answer) {
      const step = TRIAGE_STEPS[_step];
      if (step) {
        _data[step.key] = answer;
      }

      _step++;
      const content = document.getElementById('triagem-content');
      const progress = document.getElementById('triagem-progress');
      const label = document.getElementById('triagem-step-label');

      if (content) {
        content.innerHTML = Triagem._renderStep(_step);
      }
      if (progress) {
        progress.style.width = Math.min(100, (_step / TRIAGE_STEPS.length) * 100) + '%';
      }
      if (label) {
        label.textContent = _step < TRIAGE_STEPS.length
          ? `Step ${_step + 1} of ${TRIAGE_STEPS.length}`
          : 'Complete!';
      }

      Triagem._attachStepHandlers();
    },
  };

  window.EduAI.Pages.Triagem = Triagem;
})();
