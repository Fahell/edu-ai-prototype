/**
 * Daily Mix — Generates a personalized daily study mix
 * @namespace EduAI.Components.DailyMix
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Components = window.EduAI.Components || {};

  const DailyMix = {
    /**
     * Generate daily mix items based on user progress and SRS.
     * @param {Object} [options]
     * @param {number} [options.count=4] - Number of items
     * @returns {Array<{ subjectId: string, type: string, label: string, icon: string, duration: number }>}
     */
    generate(options) {
      const count = options?.count || 4;
      const subjects = EduAI.Mock.Subjects || {};
      const subjectState = EduAI.state.get('subjects') || {};
      const dueCards = EduAI.Services.SRS.getDueCards();
      const mix = [];

      // Add SRS due cards first
      if (dueCards.length > 0) {
        const card = dueCards[0];
        const subject = subjects[card.subjectId];
        if (subject) {
          mix.push({
            subjectId: card.subjectId,
            moduleId: card.moduleId,
            type: 'srs',
            label: 'Review',
            icon: subject.icon,
            name: subject.name,
            duration: 5,
          });
        }
      }

      // Add subjects in progress
      const inProgress = Object.keys(subjectState).filter((id) => {
        const s = subjectState[id];
        return s?.modules?.some((m) => m.questionsAnswered > 0 && !m.completed);
      });

      inProgress.slice(0, 2).forEach((id) => {
        const subject = subjects[id];
        if (subject && !mix.some((m) => m.subjectId === id)) {
          mix.push({
            subjectId: id,
            type: 'continue',
            label: 'Continue',
            icon: subject.icon,
            name: subject.name,
            duration: 10,
          });
        }
      });

      // Fill remaining with new subjects
      const allIds = Object.keys(subjects);
      const shuffled = allIds.sort(() => Math.random() - 0.5);
      for (const id of shuffled) {
        if (mix.length >= count) break;
        if (!mix.some((m) => m.subjectId === id)) {
          const subject = subjects[id];
          mix.push({
            subjectId: id,
            type: 'new',
            label: 'New',
            icon: subject.icon,
            name: subject.name,
            duration: 8,
          });
        }
      }

      return mix.slice(0, count);
    },

    /**
     * Render the daily mix HTML.
     * @returns {string} HTML
     */
    render() {
      const items = DailyMix.generate();
      if (items.length === 0) {
        return '<div class="empty-state"><div class="empty-state__icon">📚</div><div class="empty-state__text">Start studying to build your daily mix!</div></div>';
      }

      return items
        .map((item) => {
          const typeClass = `daily-mix__type--${item.type}`;
          return `
            <div class="daily-mix__item" data-subject="${item.subjectId}">
              <span class="daily-mix__icon">${item.icon}</span>
              <div class="daily-mix__info">
                <div class="daily-mix__name">${item.name}</div>
                <div class="daily-mix__meta">~${item.duration} min</div>
              </div>
              <span class="daily-mix__type ${typeClass}">${item.label}</span>
            </div>
          `;
        })
        .join('');
    },
  };

  window.EduAI.Components.DailyMix = DailyMix;
})();
