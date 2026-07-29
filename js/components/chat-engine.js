/**
 * Chat Engine — Orchestrates chat messages, typing indicator, and widgets
 * @namespace EduAI.Components.ChatEngine
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Components = window.EduAI.Components || {};

  const ChatEngine = {
    /** @type {HTMLElement|null} */
    _container: null,

    /** @type {HTMLElement|null} */
    _inputArea: null,

    /** @type {Object|null} Current subject context */
    _context: null,

    /** @type {boolean} Whether the engine is busy (typing/animating) */
    _busy: false,

    /**
     * Initialize the chat engine.
     * @param {HTMLElement} messagesContainer - The .chat__messages element
     * @param {HTMLElement} inputArea - The .chat__input-area element
     * @param {Object} context - { subjectId, subjectName, moduleName }
     */
    init(messagesContainer, inputArea, context) {
      this._container = messagesContainer;
      this._inputArea = inputArea;
      this._context = context;
      this._busy = false;

      if (this._container) {
        this._container.innerHTML = '';
      }

      this._attachInputHandlers();
    },

    /**
     * Attach input handlers for text submission and slash commands.
     * @private
     */
    _attachInputHandlers() {
      if (!this._inputArea) return;

      const input = this._inputArea.querySelector('.chat__input');
      const sendBtn = this._inputArea.querySelector('.chat__send-btn');

      if (input) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this._handleUserInput(input);
          }
        });

        // Auto-resize textarea
        input.addEventListener('input', () => {
          input.style.height = 'auto';
          input.style.height = Math.min(input.scrollHeight, 120) + 'px';
        });
      }

      if (sendBtn) {
        sendBtn.addEventListener('click', () => {
          if (input) this._handleUserInput(input);
        });
      }
    },

    /**
     * Handle user text input — either a slash command or a regular message.
     * @param {HTMLTextAreaElement} input
     * @private
     */
    _handleUserInput(input) {
      const text = input.value.trim();
      if (!text || this._busy) return;

      input.value = '';
      input.style.height = 'auto';

      // Check for slash command
      if (text.startsWith('/')) {
        this._handleSlashCommand(text);
        return;
      }

      // Regular user message
      this.addUserMessage(text);
    },

    /**
     * Handle a slash command.
     * @param {string} text - The full slash command text
     * @private
     */
    _handleSlashCommand(text) {
      const parts = text.split(' ');
      const command = parts[0].toLowerCase().replace('/', '');
      const arg = parts.slice(1).join(' ');

      const validCommands = ['explain', 'example', 'hint', 'pula', 'skip', 'review', 'quiz', 'persona'];
      if (!validCommands.includes(command)) {
        this.addSystemMessage('Unknown command. Try /explain, /example, /hint, /skip, or /review.');
        return;
      }

      // Map aliases
      const mapped = command === 'skip' ? 'pula' : command;

      // Show user's command as a message
      this.addUserMessage(text);

      // Get AI response for the slash command
      const response = EduAI.Services.AI.getSlashResponse(mapped, {
        concept: this._context?.moduleName || 'this topic',
        hint: arg || 'Think about what you learned.',
      });

      this.addAIMessage(response.text, response.persona);
    },

    /**
     * Add an AI message with typing indicator delay.
     * @param {string} text - Message content
     * @param {string} [persona='sage'] - Persona key
     * @param {number} [delay] - Delay in ms (default: random 800-1500)
     * @returns {Promise<void>}
     */
    async addAIMessage(text, persona, delay) {
      if (!persona) persona = 'sage';
      if (delay == null) delay = 800 + Math.random() * 700;

      this._busy = true;

      // Show typing indicator
      const typingHTML = EduAI.Components.TypingIndicator.render(persona);
      const typingEl = document.createElement('div');
      typingEl.innerHTML = typingHTML;
      this._container.appendChild(typingEl.firstElementChild);
      this._scrollToBottom();

      // Wait
      await this._wait(delay);

      // Remove typing indicator
      const indicator = document.getElementById('typing-indicator');
      if (indicator) indicator.remove();

      // Add actual message
      const personaNames = { sage: 'Prof. Sage', spark: 'Coach Spark', quiz: 'Quiz Master' };
      const personaAvatars = { sage: '🧙', spark: '⚡', quiz: '🎯' };

      const messageEl = document.createElement('div');
      messageEl.className = `chat-message chat-message--ai chat-message--${persona}`;
      messageEl.innerHTML = `
        <div class="chat-message__avatar">${personaAvatars[persona] || '🧠'}</div>
        <div class="chat-message__bubble">
          <div class="chat-message__persona">${personaNames[persona] || 'AI'}</div>
          <div class="chat-message__content">${this._formatText(text)}</div>
        </div>
      `;

      this._container.appendChild(messageEl);
      this._scrollToBottom();
      this._busy = false;
    },

    /**
     * Add a user message to the chat.
     * @param {string} text
     */
    addUserMessage(text) {
      if (!this._container) return;

      const messageEl = document.createElement('div');
      messageEl.className = 'chat-message chat-message--user';
      messageEl.innerHTML = `
        <div class="chat-message__avatar">🎓</div>
        <div class="chat-message__bubble">
          <div class="chat-message__content">${this._escapeHTML(text)}</div>
        </div>
      `;

      this._container.appendChild(messageEl);
      this._scrollToBottom();
    },

    /**
     * Add a system message (centered, muted).
     * @param {string} text
     */
    addSystemMessage(text) {
      if (!this._container) return;

      const messageEl = document.createElement('div');
      messageEl.className = 'chat-message chat-message--system';
      messageEl.innerHTML = `
        <div class="chat-message__bubble">${this._escapeHTML(text)}</div>
      `;

      this._container.appendChild(messageEl);
      this._scrollToBottom();
    },

    /**
     * Add an interactive widget to the chat.
     * @param {EduAI.Widgets.WidgetBase} widgetInstance
     * @returns {Promise<{isCorrect: boolean, answer: *}>}
     */
    addWidget(widgetInstance) {
      return new Promise((resolve) => {
        if (!this._container) {
          resolve({ isCorrect: false, answer: null });
          return;
        }

        this._busy = true;

        const wrapper = document.createElement('div');
        wrapper.className = 'chat-message chat-message--ai chat-message--quiz';
        wrapper.innerHTML = `
          <div class="chat-message__avatar">🎯</div>
          <div class="chat-message__bubble">
            <div class="chat-message__persona">Quiz Master</div>
            <div class="chat-message__widget"></div>
          </div>
        `;

        this._container.appendChild(wrapper);
        const widgetContainer = wrapper.querySelector('.chat-message__widget');

        widgetInstance.onAnswer((isCorrect, answer) => {
          this._busy = false;
          this._scrollToBottom();
          resolve({ isCorrect, answer });
        });

        widgetInstance.mount(widgetContainer);
        this._scrollToBottom();
      });
    },

    /**
     * Scroll the messages container to the bottom.
     * @private
     */
    _scrollToBottom() {
      if (this._container) {
        requestAnimationFrame(() => {
          this._container.scrollTop = this._container.scrollHeight;
        });
      }
    },

    /**
     * Wait for a specified duration.
     * @param {number} ms
     * @returns {Promise<void>}
     * @private
     */
    _wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    /**
     * Format text with basic markdown-like syntax.
     * Bold: **text**, Code: `text`, Newlines: \n
     * @param {string} text
     * @returns {string} HTML
     * @private
     */
    _formatText(text) {
      if (!text) return '';
      let html = this._escapeHTML(text);
      html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/`(.+?)`/g, '<code>$1</code>');
      html = html.replace(/\n/g, '<br>');
      return html;
    },

    /**
     * Escape HTML special characters.
     * @param {string} text
     * @returns {string}
     * @private
     */
    _escapeHTML(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    /**
     * Check if the engine is currently busy (typing/animating).
     * @returns {boolean}
     */
    isBusy() {
      return this._busy;
    },

    /**
     * Clear all messages.
     */
    clear() {
      if (this._container) {
        this._container.innerHTML = '';
      }
      this._busy = false;
    },
  };

  window.EduAI.Components.ChatEngine = ChatEngine;
})();
