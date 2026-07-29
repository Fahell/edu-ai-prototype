/**
 * Toast — Notification system with auto-dismiss
 * @namespace EduAI.Components.Toast
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Components = window.EduAI.Components || {};

  /** @type {HTMLElement|null} */
  let _container = null;

  /** @type {number} Counter for unique IDs */
  let _counter = 0;

  const DEFAULT_DURATION = 5000;

  const Toast = {
    /**
     * Show a toast notification.
     * @param {string} message - Text to display
     * @param {string} [type='info'] - Type: 'success', 'error', 'info', 'warning', 'xp', 'badge', 'coins', 'level-up'
     * @param {number} [duration=5000] - Auto-dismiss in ms. Use 0 for persistent.
     * @returns {string} The toast ID (for programmatic dismiss)
     */
    show(message, type, duration) {
      if (type == null) type = 'info';
      if (duration == null) duration = DEFAULT_DURATION;

      if (!_container) {
        _container = document.getElementById('toast-container');
      }
      if (!_container) {
        console.warn('[Toast] #toast-container not found');
        return '';
      }

      const id = 'toast-' + (++_counter);
      const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️',
        xp: '✨',
        badge: '🏆',
        coins: '🪙',
        'level-up': '🎉',
      };

      const icon = icons[type] || icons.info;
      const toastClass = type !== 'info' ? ' toast--' + type : '';

      const el = document.createElement('div');
      el.id = id;
      el.className = 'toast' + toastClass;
      el.setAttribute('role', 'alert');
      el.innerHTML = `
        <span class="toast__icon">${icon}</span>
        <span class="toast__message">${message}</span>
        <button class="toast__close" aria-label="Dismiss">&times;</button>
      `;

      // Dismiss on click
      el.querySelector('.toast__close').addEventListener('click', () => {
        Toast.dismiss(id);
      });

      // Animate in
      el.style.animation = 'toastIn var(--transition-normal) forwards';
      _container.appendChild(el);

      // Auto-dismiss
      if (duration > 0) {
        setTimeout(() => Toast.dismiss(id), duration);
      }

      return id;
    },

    /**
     * Dismiss a toast by ID.
     * @param {string} id
     */
    dismiss(id) {
      const el = document.getElementById(id);
      if (!el) return;

      el.style.animation = 'toastOut var(--transition-fast) forwards';
      el.addEventListener('animationend', () => {
        el.remove();
      }, { once: true });
    },

    /**
     * Dismiss all active toasts.
     */
    dismissAll() {
      if (!_container) return;
      const toasts = _container.querySelectorAll('.toast');
      toasts.forEach((el) => {
        el.style.animation = 'toastOut var(--transition-fast) forwards';
        el.addEventListener('animationend', () => el.remove(), { once: true });
      });
    },
  };

  // Toast styles are defined in css/components.css

  window.EduAI.Components.Toast = Toast;
})();
