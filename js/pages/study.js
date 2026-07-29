/**
 * Study Page — Chat-based lesson interface
 * @namespace EduAI.Pages.Study
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Pages = window.EduAI.Pages || {};

  const Study = {
    /** @type {Object|null} Current subject data */
    _subject: null,

    /** @type {Object|null} Current module data */
    _module: null,

    /** @type {string|null} Current subject ID */
    _subjectId: null,

    /**
     * Render the study page shell (chat container + input area).
     * @param {Object} params - Route params { subjectId }
     * @returns {string} HTML string
     */
    render(params) {
      const subjectId = params?.subjectId;
      if (!subjectId) {
        return '<div class="empty-state"><div class="empty-state__icon">📚</div><div class="empty-state__title">No subject selected</div><a href="#/catalog" class="btn btn--primary">Browse Subjects</a></div>';
      }

      const subjects = EduAI.Mock.Subjects;
      const subject = subjects[subjectId];
      if (!subject) {
        return `<div class="empty-state"><div class="empty-state__icon">❓</div><div class="empty-state__title">Subject not found</div><a href="#/catalog" class="btn btn--primary">Browse Subjects</a></div>`;
      }

      // Get current module from state
      const subjectState = EduAI.state.get('subjects.' + subjectId);
      const modules = subject.modules || [];
      let currentModuleIndex = 0;
      if (subjectState && subjectState.currentModule != null) {
        currentModuleIndex = subjectState.currentModule;
      }
      // Find first incomplete module
      if (subjectState && subjectState.modules) {
        const incomplete = subjectState.modules.findIndex((m) => !m.completed);
        if (incomplete >= 0) currentModuleIndex = incomplete;
      }

      const currentModule = modules[currentModuleIndex] || modules[0];
      const moduleLabel = currentModule ? `Module ${currentModuleIndex + 1} of ${modules.length} — ${currentModule.name}` : '';

      Study._subjectId = subjectId;
      Study._subject = subject;
      Study._module = currentModule;

      return `
        <div class="chat">
          <div class="chat__header">
            <a href="#/catalog" class="chat__back-btn" aria-label="Back to catalog">←</a>
            <div class="chat__header-info">
              <div class="chat__header-subject">${subject.icon} ${subject.name}</div>
              <div class="chat__header-module">${moduleLabel}</div>
            </div>
            <div class="chat__header-progress">
              <div class="progress-bar progress-bar--sm">
                <div class="progress-bar__fill" style="width: ${(currentModuleIndex / modules.length) * 100}%"></div>
              </div>
            </div>
          </div>

          <div class="chat__messages" id="chat-messages"></div>

          <div class="chat__input-area" id="chat-input-area" style="position: relative;">
            <textarea class="chat__input" id="chat-input" placeholder="Type a message or / for commands..." rows="1" aria-label="Chat input"></textarea>
            <button class="chat__send-btn" aria-label="Send message">➤</button>
          </div>
        </div>
      `;
    },

    /**
     * Initialize the study page — start the lesson flow.
     * @param {Object} params - Route params
     */
    init(params) {
      const messagesEl = document.getElementById('chat-messages');
      const inputArea = document.getElementById('chat-input-area');

      if (!messagesEl || !inputArea) return;

      // Initialize chat engine
      EduAI.Components.ChatEngine.init(messagesEl, inputArea, {
        subjectId: Study._subjectId,
        subjectName: Study._subject?.name,
        moduleName: Study._module?.name,
      });

      // Start the lesson flow
      Study._startLesson();
    },

    /**
     * Run the lesson flow: greeting → explanation → questions → module complete.
     * @private
     */
    async _startLesson() {
      const engine = EduAI.Components.ChatEngine;
      const AI = EduAI.Services.AI;
      const subject = Study._subject;
      const module = Study._module;
      const subjectId = Study._subjectId;

      if (!subject || !module) return;

      // Check for streak update
      EduAI.Services.Gamification.checkStreak();

      // 1. Greeting
      const greeting = AI.getGreeting(subject.name, module.name);
      await engine.addAIMessage(greeting.text, greeting.persona);

      // 2. Explanation
      const explanation = AI.getExplanation(subject.name, module.name);
      await engine.addAIMessage(explanation.text, explanation.persona);

      // 3. Questions
      const questions = EduAI.Mock.getQuestions(subjectId, module.id);
      let correctCount = 0;

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const widget = Study._createWidget(q);

        if (!widget) {
          // No widget for this question type, skip
          await engine.addAIMessage(`(${q.type} question — widget not yet implemented)`, 'quiz');
          continue;
        }

        const result = await engine.addWidget(widget);
        const isCorrect = result.isCorrect;

        if (isCorrect) correctCount++;

        // Feedback
        if (isCorrect) {
          const feedback = AI.getCorrectFeedback();
          await engine.addAIMessage(feedback.text, feedback.persona);
        } else {
          const feedback = AI.getIncorrectFeedback(q.socraticHint);
          await engine.addAIMessage(feedback.text, feedback.persona);
        }
      }

      // 4. Module complete
      const xpEarned = 50;
      const coinsEarned = 20;
      EduAI.Services.Gamification.addXP(xpEarned, 'module-complete');
      EduAI.Services.Gamification.addCoins(coinsEarned, 'module-complete');

      // Update module state
      Study._completeModule(subjectId, module.id, questions.length, correctCount);

      const completion = AI.getModuleComplete(subject.name, module.name, xpEarned, coinsEarned);
      await engine.addAIMessage(completion.text, completion.persona);

      // Check badges
      EduAI.Services.Gamification.checkBadgeAwards();

      // Offer next module or catalog
      const subjects = EduAI.Mock.Subjects;
      const subjectModules = subjects[subjectId]?.modules || [];
      const nextModuleIndex = module.id + 1;

      if (nextModuleIndex < subjectModules.length) {
        engine.addSystemMessage(`Next: ${subjectModules[nextModuleIndex].name} — Continue when ready!`);
      } else {
        engine.addSystemMessage(`🎉 You've completed all modules in ${subject.name}!`);
      }
    },

    /**
     * Create a widget instance for a question.
     * @param {Object} question
     * @returns {EduAI.Widgets.WidgetBase|null}
     * @private
     */
    _createWidget(question) {
      const Widgets = EduAI.Widgets;

      switch (question.type) {
        case 'multiple-choice':
          return new Widgets.MultipleChoice(question);
        case 'true-false':
        case 'fill-blank':
        case 'drag-drop':
        case 'slider':
        case 'canvas':
          // Placeholder for unimplemented widget types
          return null;
        default:
          return null;
      }
    },

    /**
     * Update module state after completion.
     * @param {string} subjectId
     * @param {number} moduleId
     * @param {number} questionsAnswered
     * @param {number} correctAnswers
     * @private
     */
    _completeModule(subjectId, moduleId, questionsAnswered, correctAnswers) {
      const statePath = 'subjects.' + subjectId;
      const subjectState = EduAI.state.get(statePath);

      if (!subjectState || !subjectState.modules) return;

      const moduleState = subjectState.modules.find((m) => m.id === moduleId);
      if (moduleState) {
        moduleState.completed = true;
        moduleState.questionsAnswered = (moduleState.questionsAnswered || 0) + questionsAnswered;
        moduleState.correctAnswers = (moduleState.correctAnswers || 0) + correctAnswers;
      }

      // Move to next module
      const nextModule = moduleId + 1;
      const totalModules = subjectState.modules.length;
      if (nextModule < totalModules) {
        subjectState.currentModule = nextModule;
      }

      EduAI.state.set(statePath, subjectState);
    },
  };

  window.EduAI.Pages.Study = Study;
})();
