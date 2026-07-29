/**
 * Modal — Reusable modal dialog
 * @namespace EduAI.Components.Modal
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Components = window.EduAI.Components || {};

  const Modal = {
    /** @type {HTMLElement|null} */
    _overlay: null,
    /** @type {HTMLElement|null} */
    _content: null,

    /**
     * Initialize modal references.
     */
    init() {
      Modal._overlay = document.getElementById('modal-overlay');
      Modal._content = document.getElementById('modal-content');

      if (Modal._overlay) {
        Modal._overlay.addEventListener('click', (e) => {
          if (e.target === Modal._overlay) Modal.close();
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') Modal.close();
      });
    },

    /**
     * Open the modal with content.
     * @param {string} html - HTML content
     * @param {Object} [options]
     * @param {string} [options.className] - Additional class on content
     * @param {Function} [options.onClose] - Called when modal closes
     */
    open(html, options) {
      if (!Modal._overlay || !Modal._content) Modal.init();
      if (!Modal._overlay || !Modal._content) return;

      Modal._content.innerHTML = html;
      Modal._content.className = 'modal-content' + (options?.className ? ' ' + options.className : '');
      Modal._overlay.hidden = false;
      Modal._overlay.classList.add('modal-overlay--active');
      Modal._onClose = options?.onClose || null;
    },

    /**
     * Close the modal.
     */
    close() {
      if (!Modal._overlay) return;
      Modal._overlay.classList.remove('modal-overlay--active');
      Modal._overlay.hidden = true;
      if (Modal._content) Modal._content.innerHTML = '';
      if (Modal._onClose) {
        Modal._onClose();
        Modal._onClose = null;
      }
    },

    /** @type {Function|null} */
    _onClose: null,
  };

  window.EduAI.Components.Modal = Modal;
})();
