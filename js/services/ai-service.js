/**
 * AI Service — Selects and formats mock AI responses by persona and context
 * @namespace EduAI.Services.AI
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Services = window.EduAI.Services || {};

  /**
   * Select a random item from an array.
   * @param {Array} arr
   * @returns {*}
   */
  function pick(arr) {
    if (!arr || arr.length === 0) return '';
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const personaAvatars = { sage: '🧙', spark: '⚡', quiz: '🎯' };
  const personaNames = { sage: 'Prof. Sage', spark: 'Coach Spark', quiz: 'Quiz Master' };

  const AI = {
    /**
     * Get the avatar emoji for a persona.
     * @param {string} persona
     * @returns {string}
     */
    getAvatar(persona) {
      return personaAvatars[persona] || '🧠';
    },

    /**
     * Get the display name for a persona.
     * @param {string} persona
     * @returns {string}
     */
    getName(persona) {
      return personaNames[persona] || 'AI';
    },

    /**
     * Select the appropriate persona for a given context.
     * @param {string} context - 'explanation', 'correct', 'incorrect', 'greeting', 'moduleComplete', 'warmup'
     * @returns {string} Persona key
     */
    selectPersona(context) {
      const mapping = {
        explanation: 'sage',
        greeting: 'sage',
        moduleComplete: 'spark',
        correct: 'spark',
        incorrect: 'sage',
        warmup: 'spark',
        frustrated: 'spark',
        speedLearner: 'quiz',
      };
      return mapping[context] || 'sage';
    },

    /**
     * Get a response for a given context and persona.
     * Replaces placeholders with actual values.
     * @param {string} context - Response context key
     * @param {string} [persona] - Persona key (auto-selected if omitted)
     * @param {Object} [vars] - Variables to replace in template
     * @returns {{ text: string, persona: string }}
     */
    getResponse(context, persona, vars) {
      const responses = EduAI.Mock.AIResponses;
      if (!responses) return { text: '...', persona: persona || 'sage' };

      if (!persona) persona = AI.selectPersona(context);

      // Get template array
      let templates;
      if (context === 'slashCommands') {
        // Slash commands have nested structure
        templates = null;
      } else {
        const ctxResponses = responses[context];
        if (ctxResponses && ctxResponses[persona]) {
          templates = ctxResponses[persona];
        } else if (ctxResponses) {
          // Try any available persona
          const available = Object.values(ctxResponses);
          templates = available.length > 0 ? available[0] : null;
        }
      }

      if (!templates || templates.length === 0) {
        // Fallback
        const fallback = responses.fallback;
        if (fallback && fallback[persona]) {
          templates = fallback[persona];
        } else {
          return { text: '...', persona };
        }
      }

      let text = pick(templates);

      // Replace placeholders
      const user = EduAI.state.get('user') || {};
      const defaults = {
        name: user.name || 'Student',
        subject: vars?.subject || 'this subject',
        module: vars?.module || 'this topic',
        persona: AI.getName(persona),
        streak: String(user.streak || 0),
        xp: String(vars?.xp || 0),
        coins: String(vars?.coins || 0),
        hint: vars?.hint || '',
        concept: vars?.concept || '',
      };

      const allVars = { ...defaults, ...vars };
      for (const [key, value] of Object.entries(allVars)) {
        text = text.replace(new RegExp('\\{' + key + '\\}', 'g'), String(value));
      }

      return { text, persona };
    },

    /**
     * Get a greeting response for starting a lesson.
     * @param {string} subjectName
     * @param {string} moduleName
     * @returns {{ text: string, persona: string }}
     */
    getGreeting(subjectName, moduleName) {
      return AI.getResponse('greeting', 'sage', {
        subject: subjectName,
        module: moduleName,
      });
    },

    /**
     * Get an explanation response.
     * @param {string} subjectName
     * @param {string} moduleName
     * @returns {{ text: string, persona: string }}
     */
    getExplanation(subjectName, moduleName) {
      return AI.getResponse('explanation', 'sage', {
        subject: subjectName,
        module: moduleName,
      });
    },

    /**
     * Get feedback for a correct answer.
     * @returns {{ text: string, persona: string }}
     */
    getCorrectFeedback() {
      return AI.getResponse('correct', 'spark');
    },

    /**
     * Get feedback for an incorrect answer (Socratic).
     * @param {string} hint - The question's Socratic hint
     * @returns {{ text: string, persona: string }}
     */
    getIncorrectFeedback(hint) {
      return AI.getResponse('incorrect', 'sage', { hint: hint || 'Think about it differently.' });
    },

    /**
     * Get a module completion response.
     * @param {string} subjectName
     * @param {string} moduleName
     * @param {number} xpEarned
     * @param {number} coinsEarned
     * @returns {{ text: string, persona: string }}
     */
    getModuleComplete(subjectName, moduleName, xpEarned, coinsEarned) {
      return AI.getResponse('moduleComplete', 'spark', {
        subject: subjectName,
        module: moduleName,
        xp: String(xpEarned || 50),
        coins: String(coinsEarned || 20),
      });
    },

    /**
     * Get a warm-up puzzle intro.
     * @returns {{ text: string, persona: string }}
     */
    getWarmupIntro() {
      return AI.getResponse('warmup', 'spark');
    },

    /**
     * Get a slash command response.
     * @param {string} command - Slash command name (e.g., 'explain', 'example', 'hint')
     * @param {Object} vars
     * @returns {{ text: string, persona: string }}
     */
    getSlashResponse(command, vars) {
      const responses = EduAI.Mock.AIResponses;
      if (!responses || !responses.slashCommands || !responses.slashCommands[command]) {
        return { text: 'Command not recognized.', persona: 'sage' };
      }

      const cmdResponses = responses.slashCommands[command];
      const persona = Object.keys(cmdResponses)[0]; // First available persona
      const templates = cmdResponses[persona];

      let text = pick(templates || ['...']);

      // Replace vars
      if (vars) {
        for (const [key, value] of Object.entries(vars)) {
          text = text.replace(new RegExp('\\{' + key + '\\}', 'g'), String(value));
        }
      }

      return { text, persona };
    },
  };

  window.EduAI.Services.AI = AI;
})();
