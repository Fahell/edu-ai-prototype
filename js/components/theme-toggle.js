/**
 * Theme Toggle — Switches between light and dark themes
 * @namespace EduAI.Components.ThemeToggle
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Components = window.EduAI.Components || {};

  const ThemeToggle = {
    /** @type {HTMLElement|null} */
    _button: null,

    /**
     * Render the theme toggle button HTML.
     * @returns {string} HTML string
     */
    render() {
      const currentTheme = EduAI.state.get('settings.theme') || 'light';
      const icon = currentTheme === 'dark' ? '☀️' : '🌙';
      const label = currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

      return `
        <button class="icon-btn theme-toggle" aria-label="${label}" title="${label}">
          <span class="theme-toggle__icon">${icon}</span>
        </button>
      `;
    },

    /**
     * Initialize the theme toggle. Applies saved theme and attaches click handler.
     * Should be called after the toggle is in the DOM.
     */
    init() {
      // Apply saved theme immediately
      const theme = EduAI.state.get('settings.theme') || 'light';
      document.documentElement.setAttribute('data-theme', theme);

      // Find and bind the button
      this._button = document.querySelector('.theme-toggle');
      if (this._button) {
        this._button.addEventListener('click', () => this._toggle());
      }

      // Listen for external theme changes
      EduAI.state.on('settings.theme', (newTheme) => {
        this._apply(newTheme);
        this._updateIcon(newTheme);
      });
    },

    /**
     * Toggle between light and dark themes.
     * @private
     */
    _toggle() {
      const current = EduAI.state.get('settings.theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      EduAI.state.set('settings.theme', next);
    },

    /**
     * Apply theme to the document.
     * @param {string} theme - 'light' or 'dark'
     * @private
     */
    _apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
    },

    /**
     * Update the toggle button icon.
     * @param {string} theme
     * @private
     */
    _updateIcon(theme) {
      const iconEl = document.querySelector('.theme-toggle__icon');
      if (iconEl) {
        iconEl.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
      if (this._button) {
        const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        this._button.setAttribute('aria-label', label);
        this._button.setAttribute('title', label);
      }
    },
  };

  window.EduAI.Components.ThemeToggle = ThemeToggle;
})();
