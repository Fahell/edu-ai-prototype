/**
 * SRS Service — Spaced Repetition System for review scheduling
 * @namespace EduAI.Services.SRS
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Services = window.EduAI.Services || {};

  // Default intervals in days for each ease level
  const DEFAULT_INTERVALS = [1, 3, 7, 14, 30];

  const SRS = {
    /**
     * Get the next review date for a card based on its ease level.
     * @param {number} ease - Ease level (0-4)
     * @param {Date} [lastReview] - Date of last review (default: now)
     * @returns {Date} Next review date
     */
    getNextReviewDate(ease, lastReview) {
      const base = lastReview || new Date();
      const interval = DEFAULT_INTERVALS[Math.min(Math.max(ease, 0), DEFAULT_INTERVALS.length - 1)];
      const next = new Date(base);
      next.setDate(next.getDate() + interval);
      return next;
    },

    /**
     * Get all cards due for review today.
     * @returns {Array} Array of { subjectId, moduleId, ease, nextReview }
     */
    getDueCards() {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const srsState = EduAI.state.get('srs') || { cards: [] };
      return (srsState.cards || []).filter((card) => card.nextReview <= today);
    },

    /**
     * Record a review result and update the card's ease and next review date.
     * @param {string} subjectId
     * @param {number} moduleId
     * @param {boolean} wasCorrect
     */
    recordReview(subjectId, moduleId, wasCorrect) {
      const srsState = EduAI.state.get('srs') || { cards: [] };
      const cards = srsState.cards || [];
      const key = subjectId + ':' + moduleId;
      let card = cards.find((c) => c.key === key);

      if (!card) {
        card = { key, subjectId, moduleId, ease: 0, nextReview: '', reviews: 0 };
        cards.push(card);
      }

      card.ease = wasCorrect
        ? Math.min(card.ease + 1, DEFAULT_INTERVALS.length - 1)
        : Math.max(card.ease - 1, 0);
      card.reviews = (card.reviews || 0) + 1;
      card.nextReview = SRS.getNextReviewDate(card.ease).toISOString().split('T')[0];

      EduAI.state.set('srs', { cards });
    },

    /**
     * Get SRS summary stats.
     * @returns {{ due: number, learning: number, mastered: number }}
     */
    getStats() {
      const srsState = EduAI.state.get('srs') || { cards: [] };
      const cards = srsState.cards || [];
      const today = new Date().toISOString().split('T')[0];

      return {
        due: cards.filter((c) => c.nextReview <= today).length,
        learning: cards.filter((c) => c.ease <= 2).length,
        mastered: cards.filter((c) => c.ease >= 4).length,
      };
    },
  };

  window.EduAI.Services.SRS = SRS;
})();
