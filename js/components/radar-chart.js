/**
 * Radar Chart — SVG-based radar/spider chart for subject mastery
 * @namespace EduAI.Components.RadarChart
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Components = window.EduAI.Components || {};

  const RadarChart = {
    /**
     * Render a radar chart from mastery data.
     * @param {Array<{subject: string, icon: string, mastery: number}>} data
     * @param {Object} [options]
     * @param {number} [options.size=280] - SVG size in pixels
     * @returns {string} SVG HTML
     */
    render(data, options) {
      if (!data || data.length === 0) {
        return '<div class="empty-state"><div class="empty-state__icon">📊</div><div class="empty-state__text">No mastery data yet. Start studying to see your radar chart!</div></div>';
      }

      const size = options?.size || 280;
      const cx = size / 2;
      const cy = size / 2;
      const radius = size * 0.38;
      const n = data.length;
      const angleStep = (2 * Math.PI) / n;

      // Grid circles
      const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
      const gridHTML = gridLevels
        .map((level) => {
          const points = Array.from({ length: n }, (_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            return `${cx + radius * level * Math.cos(angle)},${cy + radius * level * Math.sin(angle)}`;
          }).join(' ');
          return `<polygon points="${points}" class="radar-chart__grid" fill="none" stroke="var(--color-border)" stroke-width="0.5" opacity="0.3"/>`;
        })
        .join('');

      // Data polygon
      const dataPoints = data.map((d, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = (d.mastery / 100) * radius;
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
      }).join(' ');

      // Labels
      const labelsHTML = data.map((d, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const lx = cx + (radius + 20) * Math.cos(angle);
        const ly = cy + (radius + 20) * Math.sin(angle);
        return `<text x="${lx}" y="${ly}" class="radar-chart__label" text-anchor="middle" dominant-baseline="middle" font-size="11">${d.icon}</text>`;
      }).join('');

      return `
        <div class="radar-chart-container">
          <svg viewBox="0 0 ${size} ${size}" class="radar-chart" role="img" aria-label="Subject mastery radar chart">
            ${gridHTML}
            <polygon points="${dataPoints}" class="radar-chart__data" fill="var(--color-primary)" fill-opacity="0.2" stroke="var(--color-primary)" stroke-width="2"/>
            ${labelsHTML}
          </svg>
        </div>
      `;
    },
  };

  window.EduAI.Components.RadarChart = RadarChart;
})();
