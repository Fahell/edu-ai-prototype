/**
 * XP Bar — Animated progress bar showing XP and level
 * @namespace EduAI.Components.XPBar
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Components = window.EduAI.Components || {};

  const XPBar = {
    /**
     * Render the XP bar HTML.
     * @returns {string} HTML string
     */
    render() {
      const xp = EduAI.state.get('user.xp') || 0;
      const level = EduAI.state.get('user.level') || 1;
      const xpToNext = EduAI.state.get('user.xpToNext') || EduAI.Services.Gamification.getXPToNextLevel(level);
      const xpForCurrentLevel = EduAI.Services.Gamification.getXPForLevel(level);
      const xpInLevel = xp - xpForCurrentLevel;
      const progress = xpToNext > 0 ? Math.min((xpInLevel / xpToNext) * 100, 100) : 0;
      const title = EduAI.Services.Gamification.getTitle(level);

      return `
        <div class="xp-bar">
          <div class="xp-bar__header">
            <div class="xp-bar__level">
              <span class="xp-bar__level-badge">${level}</span>
              <span class="xp-bar__level-title">${title}</span>
            </div>
            <span class="xp-bar__xp-text">${xpInLevel} / ${xpToNext} XP</span>
          </div>
          <div class="xp-bar__track">
            <div class="xp-bar__fill" style="width: ${progress}%" role="progressbar" aria-valuenow="${xpInLevel}" aria-valuemin="0" aria-valuemax="${xpToNext}" aria-label="Experience points progress"></div>
          </div>
        </div>
      `;
    },

    /**
     * Initialize the XP bar. Subscribes to state changes for live updates.
     */
    init() {
      EduAI.state.on('user.xp', () => XPBar.update());
      EduAI.state.on('user.level', () => XPBar.update());
    },

    /**
     * Update the XP bar display without full re-render.
     * Smoothly animates the bar width change.
     */
    update() {
      const xp = EduAI.state.get('user.xp') || 0;
      const level = EduAI.state.get('user.level') || 1;
      const xpToNext = EduAI.state.get('user.xpToNext') || EduAI.Services.Gamification.getXPToNextLevel(level);
      const xpForCurrentLevel = EduAI.Services.Gamification.getXPForLevel(level);
      const xpInLevel = xp - xpForCurrentLevel;
      const progress = xpToNext > 0 ? Math.min((xpInLevel / xpToNext) * 100, 100) : 0;
      const title = EduAI.Services.Gamification.getTitle(level);

      // Update fill width
      const fill = document.querySelector('.xp-bar__fill');
      if (fill) {
        fill.style.width = progress + '%';
        fill.setAttribute('aria-valuenow', xpInLevel);
      }

      // Update text
      const xpText = document.querySelector('.xp-bar__xp-text');
      if (xpText) {
        xpText.textContent = `${xpInLevel} / ${xpToNext} XP`;
      }

      // Update level badge
      const levelBadge = document.querySelector('.xp-bar__level-badge');
      if (levelBadge) {
        levelBadge.textContent = level;
      }

      // Update title
      const levelTitle = document.querySelector('.xp-bar__level-title');
      if (levelTitle) {
        levelTitle.textContent = title;
      }
    },
  };

  window.EduAI.Components.XPBar = XPBar;
})();
