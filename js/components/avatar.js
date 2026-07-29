/**
 * Avatar — User avatar with level ring and accessories
 * @namespace EduAI.Components.Avatar
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Components = window.EduAI.Components || {};

  const Avatar = {
    /**
     * Render an avatar element.
     * @param {Object} [options]
     * @param {number} [options.size='md'] - 'sm', 'md', 'lg', 'xl'
     * @param {boolean} [options.showRing=true] - Show level ring
     * @returns {string} HTML
     */
    render(options) {
      const size = options?.size || 'md';
      const showRing = options?.showRing !== false;
      const user = EduAI.state.get('user') || {};
      const level = user.level || 1;
      const ringClass = showRing ? ` avatar--ring avatar--level-${Math.min(level, 50)}` : '';

      return `
        <div class="avatar avatar--${size}${ringClass}" role="img" aria-label="User avatar">
          <span class="avatar__emoji">🎓</span>
        </div>
      `;
    },

    /**
     * Get the avatar HTML for an NPC.
     * @param {Object} npc
     * @param {string} [size='sm']
     * @returns {string} HTML
     */
    renderNPC(npc, size) {
      return `
        <div class="avatar avatar--${size || 'sm'}" role="img" aria-label="${npc?.name || 'NPC'}">
          <span class="avatar__emoji">${npc?.avatar || '👤'}</span>
        </div>
      `;
    },
  };

  window.EduAI.Components.Avatar = Avatar;
})();
