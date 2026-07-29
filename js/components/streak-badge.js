/**
 * Streak Badge — Fire icon with consecutive day count
 * @namespace EduAI.Components.StreakBadge
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Components = window.EduAI.Components || {};

  const StreakBadge = {
    /**
     * Render the streak badge HTML.
     * @returns {string} HTML string
     */
    render() {
      const streak = EduAI.state.get('user.streak') || 0;
      const isActive = streak > 0;

      const badgeClass = isActive ? 'streak-badge' : 'streak-badge streak-badge--inactive';
      const icon = isActive ? '🔥' : '💤';

      return `
        <div class="${badgeClass}" title="${streak} day streak">
          <span class="streak-badge__icon">${icon}</span>
          <span class="streak-badge__count">${streak}</span>
        </div>
      `;
    },

    /**
     * Initialize the streak badge. Subscribes to state changes.
     */
    init() {
      EduAI.state.on('user.streak', () => StreakBadge.update());
    },

    /**
     * Update the streak badge display without full re-render.
     */
    update() {
      const streak = EduAI.state.get('user.streak') || 0;
      const isActive = streak > 0;

      const badge = document.querySelector('.streak-badge');
      if (!badge) return;

      // Update class
      badge.className = isActive ? 'streak-badge' : 'streak-badge streak-badge--inactive';
      badge.title = streak + ' day streak';

      // Update icon
      const iconEl = badge.querySelector('.streak-badge__icon');
      if (iconEl) {
        iconEl.textContent = isActive ? '🔥' : '💤';
      }

      // Update count
      const countEl = badge.querySelector('.streak-badge__count');
      if (countEl) {
        countEl.textContent = streak;
      }
    },
  };

  window.EduAI.Components.StreakBadge = StreakBadge;
})();
