/**
 * Heat Map — GitHub-style activity heatmap
 * @namespace EduAI.Components.HeatMap
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Components = window.EduAI.Components || {};

  const HeatMap = {
    /**
     * Render an activity heatmap for the last N weeks.
     * @param {Object} [options]
     * @param {number} [options.weeks=12] - Number of weeks to show
     * @returns {string} HTML
     */
    render(options) {
      const weeks = options?.weeks || 12;
      const heatmap = EduAI.state.get('activityHeatMap') || {};
      const today = new Date();
      const cells = [];

      for (let w = weeks - 1; w >= 0; w--) {
        for (let d = 6; d >= 0; d--) {
          const date = new Date(today);
          date.setDate(date.getDate() - (w * 7 + d));
          const key = date.toISOString().split('T')[0];
          const activity = heatmap[key];
          const level = activity ? Math.min(4, Math.ceil(activity.xpEarned / 25)) : 0;
          const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          cells.push(`<div class="heat-map__cell heat-map__cell--level-${level}" title="${label}: ${activity?.xpEarned || 0} XP"></div>`);
        }
      }

      return `
        <div class="heat-map">
          <div class="heat-map__grid">${cells.join('')}</div>
          <div class="heat-map__legend">
            <span class="heat-map__legend-label">Less</span>
            <div class="heat-map__cell heat-map__cell--level-0"></div>
            <div class="heat-map__cell heat-map__cell--level-1"></div>
            <div class="heat-map__cell heat-map__cell--level-2"></div>
            <div class="heat-map__cell heat-map__cell--level-3"></div>
            <div class="heat-map__cell heat-map__cell--level-4"></div>
            <span class="heat-map__legend-label">More</span>
          </div>
        </div>
      `;
    },
  };

  window.EduAI.Components.HeatMap = HeatMap;
})();
