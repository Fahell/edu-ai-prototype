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

  // Inject toast styles if not already in components.css
  // (These are intentionally inline as a fallback)
  const style = document.createElement('style');
  style.textContent = `
    .toast {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      font-size: var(--text-sm);
      color: var(--color-text-primary);
      max-width: 380px;
      pointer-events: auto;
    }
    .toast__icon { font-size: var(--text-lg); flex-shrink: 0; }
    .toast__message { flex: 1; }
    .toast__close {
      background: none;
      border: none;
      font-size: var(--text-lg);
      color: var(--color-text-muted);
      cursor: pointer;
      padding: 0 var(--space-1);
      line-height: 1;
    }
    .toast__close:hover { color: var(--color-text-primary); }
    .toast--xp { border-left: 3px solid var(--color-xp); }
    .toast--streak { border-left: 3px solid var(--color-streak); }
    .toast--badge { border-left: 3px solid var(--color-coin); }
    .toast--coins { border-left: 3px solid var(--color-coin); }
    .toast--level-up { border-left: 3px solid var(--color-xp); background: var(--color-accent-light); }
    .toast--success { border-left: 3px solid var(--color-success); }
    .toast--error { border-left: 3px solid var(--color-error); }
    .toast--warning { border-left: 3px solid var(--color-warning); }
  `;
  document.head.appendChild(style);

  window.EduAI.Components.Toast = Toast;
})();
