/**
 * Typing Indicator — Animated dots showing "AI is typing"
 * @namespace EduAI.Components.TypingIndicator
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Components = window.EduAI.Components || {};

  const TypingIndicator = {
    /**
     * Render the typing indicator HTML.
     * @param {string} [persona='sage'] - Which persona is "typing"
     * @returns {string} HTML string
     */
    render(persona) {
      if (!persona) persona = 'sage';
      const personaNames = { sage: 'Prof. Sage', spark: 'Coach Spark', quiz: 'Quiz Master' };
      const personaAvatars = { sage: '🧙', spark: '⚡', quiz: '🎯' };
      const name = personaNames[persona] || 'AI';
      const avatar = personaAvatars[persona] || '🧠';

      return `
        <div class="chat-message chat-message--ai chat-message--${persona}" id="typing-indicator">
          <div class="chat-message__avatar">${avatar}</div>
          <div class="chat-message__bubble">
            <div class="chat-message__persona">${name}</div>
            <div class="typing-dots">
              <span class="typing-dots__dot"></span>
              <span class="typing-dots__dot"></span>
              <span class="typing-dots__dot"></span>
            </div>
          </div>
        </div>
      `;
    },

    /**
     * Inject the typing dots CSS if not already present.
     */
    injectStyles() {
      if (document.getElementById('typing-indicator-styles')) return;
      const style = document.createElement('style');
      style.id = 'typing-indicator-styles';
      style.textContent = `
        .typing-dots {
          display: inline-flex;
          gap: 4px;
          padding: 4px 0;
        }
        .typing-dots__dot {
          width: 8px;
          height: 8px;
          background: var(--color-text-muted);
          border-radius: 50%;
          animation: typingDot 1.4s ease-in-out infinite;
        }
        .typing-dots__dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots__dot:nth-child(3) { animation-delay: 0.4s; }
      `;
      document.head.appendChild(style);
    },
  };

  // Inject styles on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TypingIndicator.injectStyles());
  } else {
    TypingIndicator.injectStyles();
  }

  window.EduAI.Components.TypingIndicator = TypingIndicator;
})();
