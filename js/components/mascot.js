/**
 * Mascot — Animated brain mascot that evolves with user level
 * @namespace EduAI.Components.Mascot
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Components = window.EduAI.Components || {};

  const STAGES = [
    { minLevel: 1, emoji: '🧠', label: 'Baby Brain', glow: '' },
    { minLevel: 6, emoji: '🧠', label: 'Growing Mind', glow: 'mascot-stage-2' },
    { minLevel: 16, emoji: '🧠', label: 'Wise Brain', glow: 'mascot-stage-3' },
    { minLevel: 30, emoji: '🧠', label: 'Supreme Intellect', glow: 'mascot-stage-4' },
  ];

  const Mascot = {
    /**
     * Get the current mascot stage based on user level.
     * @returns {Object} { emoji, label, glow, stage }
     */
    getStage() {
      const level = EduAI.state.get('user.level') || 1;
      let current = STAGES[0];
      for (const stage of STAGES) {
        if (level >= stage.minLevel) current = stage;
      }
      return { ...current, stage: STAGES.indexOf(current) + 1 };
    },

    /**
     * Render the mascot HTML.
     * @param {Object} [options]
     * @param {boolean} [options.showLabel=true]
     * @param {string} [options.size='md'] - 'sm', 'md', 'lg'
     * @returns {string} HTML
     */
    render(options) {
      const showLabel = options?.showLabel !== false;
      const size = options?.size || 'md';
      const stage = Mascot.getStage();

      return `
        <div class="mascot-container mascot-container--${size}">
          <div class="mascot-container__sprite">
            <div class="mascot-container__stage-glow"></div>
            <span class="mascot-emoji animate-mascot-bounce ${stage.glow}">${stage.emoji}</span>
          </div>
          ${showLabel ? `<div class="mascot-container__label">Stage ${stage.stage} — ${stage.label}</div>` : ''}
        </div>
      `;
    },
  };

  window.EduAI.Components.Mascot = Mascot;
})();
