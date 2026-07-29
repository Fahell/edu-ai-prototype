/**
 * Ghost Race — Animated NPC ghost racing sidebar widget
 * @namespace EduAI.Components.GhostRace
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Components = window.EduAI.Components || {};

  const GhostRace = {
    /** @type {number|null} */
    _interval: null,

    /**
     * Render a ghost race widget.
     * @param {Object} [options]
     * @param {number} [options.duration=30000] - Race duration in ms
     * @returns {string} HTML
     */
    render(options) {
      const npc = EduAI.Mock.getGhostRacer ? EduAI.Mock.getGhostRacer() : null;
      if (!npc) return '<div class="ghost-race"><p class="ghost-race__empty">No race available</p></div>';

      return `
        <div class="ghost-race" id="ghost-race">
          <div class="ghost-race__header">
            <span class="ghost-race__title">👻 Ghost Race</span>
            <span class="ghost-race__vs">vs ${npc.name}</span>
          </div>
          <div class="ghost-race__track">
            <div class="ghost-race__lane ghost-race__lane--user">
              <span class="ghost-race__runner">🎓</span>
              <div class="ghost-race__bar"><div class="ghost-race__bar-fill ghost-race__bar-fill--user" id="ghost-user-bar"></div></div>
            </div>
            <div class="ghost-race__lane ghost-race__lane--npc">
              <span class="ghost-race__runner">${npc.avatar || '👻'}</span>
              <div class="ghost-race__bar"><div class="ghost-race__bar-fill ghost-race__bar-fill--npc" id="ghost-npc-bar"></div></div>
            </div>
          </div>
        </div>
      `;
    },

    /**
     * Start the ghost race animation.
     * @param {Object} [options]
     * @param {Function} [options.onComplete] - Called when race ends
     */
    start(options) {
      const npc = EduAI.Mock.getGhostRacer ? EduAI.Mock.getGhostRacer() : null;
      if (!npc) return;

      const userBar = document.getElementById('ghost-user-bar');
      const npcBar = document.getElementById('ghost-npc-bar');
      if (!userBar || !npcBar) return;

      const duration = options?.duration || 30000;
      const npcSpeed = npc.ghostSpeed || 0.5;
      let userProgress = 0;
      let npcProgress = 0;

      GhostRace._interval = setInterval(() => {
        userProgress = Math.min(100, userProgress + (Math.random() * 3 + 1));
        npcProgress = Math.min(100, npcProgress + npcSpeed * (Math.random() * 2 + 0.5));

        userBar.style.width = userProgress + '%';
        npcBar.style.width = npcProgress + '%';

        if (userProgress >= 100 || npcProgress >= 100) {
          GhostRace.stop();
          if (options?.onComplete) {
            options.onComplete({ userWon: userProgress >= npcProgress });
          }
        }
      }, duration / 100);
    },

    /**
     * Stop the ghost race animation.
     */
    stop() {
      if (GhostRace._interval) {
        clearInterval(GhostRace._interval);
        GhostRace._interval = null;
      }
    },
  };

  window.EduAI.Components.GhostRace = GhostRace;
})();
