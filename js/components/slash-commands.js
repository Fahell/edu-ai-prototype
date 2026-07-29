/**
 * Slash Commands — Slash command menu in chat input
 * @namespace EduAI.Components.SlashCommands
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Components = window.EduAI.Components || {};

  const COMMANDS = [
    { command: '/explain', description: 'Get a detailed explanation', icon: '📖' },
    { command: '/example', description: 'See a practical example', icon: '💡' },
    { command: '/hint', description: 'Get a hint for the current question', icon: '🤫' },
    { command: '/skip', description: 'Skip to the next topic', icon: '⏭️' },
    { command: '/review', description: 'Review what you have learned', icon: '🔄' },
    { command: '/quiz', description: 'Generate a quick quiz', icon: '📝' },
    { command: '/persona', description: 'Switch AI persona', icon: '🎭' },
  ];

  const SlashCommands = {
    /** @type {HTMLElement|null} */
    _menu: null,
    /** @type {boolean} */
    _visible: false,

    /**
     * Show the slash command menu near an input element.
     * @param {HTMLElement} inputArea - The chat input area
     * @param {string} [filter=''] - Filter text after /
     */
    show(inputArea, filter) {
      if (!inputArea) return;

      SlashCommands.hide();

      const menu = document.createElement('div');
      menu.className = 'slash-menu';
      menu.id = 'slash-menu';

      const filtered = COMMANDS.filter((cmd) => {
        if (!filter) return true;
        return cmd.command.toLowerCase().includes(filter.toLowerCase());
      });

      if (filtered.length === 0) {
        SlashCommands.hide();
        return;
      }

      menu.innerHTML = filtered
        .map(
          (cmd) => `
          <div class="slash-menu__item" data-command="${cmd.command}">
            <span class="slash-menu__icon">${cmd.icon}</span>
            <span class="slash-menu__cmd">${cmd.command}</span>
            <span class="slash-menu__desc">${cmd.description}</span>
          </div>
        `
        )
        .join('');

      inputArea.appendChild(menu);
      SlashCommands._menu = menu;
      SlashCommands._visible = true;

      // Click handler for items
      menu.querySelectorAll('.slash-menu__item').forEach((item) => {
        item.addEventListener('click', () => {
          const cmd = item.dataset.command;
          SlashCommands.hide();
          const input = inputArea.querySelector('.chat__input');
          if (input) {
            input.value = cmd + ' ';
            input.focus();
          }
        });
      });
    },

    /**
     * Hide the slash command menu.
     */
    hide() {
      const existing = document.getElementById('slash-menu');
      if (existing) existing.remove();
      SlashCommands._menu = null;
      SlashCommands._visible = false;
    },

    /**
     * Check if the menu is currently visible.
     * @returns {boolean}
     */
    isVisible() {
      return SlashCommands._visible;
    },
  };

  window.EduAI.Components.SlashCommands = SlashCommands;
})();
