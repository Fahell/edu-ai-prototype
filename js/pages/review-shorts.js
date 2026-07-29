/**
 * Review Shorts Page — Quick review cards with SRS-powered flashcards
 * @namespace EduAI.Pages.ReviewShorts
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Pages = window.EduAI.Pages || {};

  const ReviewShorts = {
    /**
     * Render the review shorts page.
     * @returns {string} HTML string
     */
    render() {
      const dueCards = EduAI.Services.SRS.getDueCards();
      const srsStats = EduAI.Services.SRS.getStats();
      const subjects = EduAI.Mock.Subjects || {};

      return `
        <div class="review-shorts">
          <div class="review-shorts__header">
            <h1 class="review-shorts__title">⚡ Quick Review</h1>
            <p class="review-shorts__subtitle">Spaced repetition keeps your knowledge fresh</p>
          </div>

          <div class="review-shorts__stats">
            <div class="review-shorts__stat card">
              <span class="review-shorts__stat-value">${srsStats.due}</span>
              <span class="review-shorts__stat-label">Due Today</span>
            </div>
            <div class="review-shorts__stat card">
              <span class="review-shorts__stat-value">${srsStats.learning}</span>
              <span class="review-shorts__stat-label">Learning</span>
            </div>
            <div class="review-shorts__stat card">
              <span class="review-shorts__stat-value">${srsStats.mastered}</span>
              <span class="review-shorts__stat-label">Mastered</span>
            </div>
          </div>

          ${dueCards.length > 0 ? `
            <div class="review-shorts__session card">
              <div class="card__header">
                <h3 class="card__title">📋 Review Session</h3>
                <span class="card__subtitle">${dueCards.length} cards due</span>
              </div>
              <div class="review-shorts__cards" id="review-cards">
                ${dueCards.map((card, i) => {
                  const subject = subjects[card.subjectId];
                  const mod = subject?.modules?.find((m) => m.id === card.moduleId);
                  return `
                    <div class="review-card" data-subject="${card.subjectId}" data-module="${card.moduleId}">
                      <span class="review-card__icon">${subject?.icon || '📖'}</span>
                      <div class="review-card__info">
                        <div class="review-card__subject">${subject?.name || card.subjectId}</div>
                        <div class="review-card__module">${mod?.name || 'Module ' + card.moduleId}</div>
                      </div>
                      <button class="btn btn--primary btn--sm review-card__btn">Review</button>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : `
            <div class="review-shorts__empty card">
              <div class="empty-state">
                <div class="empty-state__icon">🎉</div>
                <div class="empty-state__title">All caught up!</div>
                <div class="empty-state__text">No cards due for review today. Keep studying to add more cards to your review queue.</div>
                <a href="#/catalog" class="btn btn--primary">Browse Subjects</a>
              </div>
            </div>
          `}

          <div class="review-shorts__warmup card">
            <div class="card__header">
              <h3 class="card__title">🧩 Warm-Up Puzzle</h3>
            </div>
            <div class="review-shorts__puzzle" id="warmup-puzzle">
              ${ReviewShorts._renderWarmup()}
            </div>
          </div>
        </div>
      `;
    },

    /**
     * Initialize review shorts page.
     */
    init() {
      // Review card clicks
      document.querySelectorAll('.review-card__btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const card = btn.closest('.review-card');
          if (card) {
            const subjectId = card.dataset.subject;
            if (subjectId) EduAI.Router.navigate('#/chat/' + subjectId);
          }
        });
      });

      // Warm-up puzzle interaction
      const puzzleContainer = document.getElementById('warmup-puzzle');
      if (puzzleContainer) {
        puzzleContainer.querySelectorAll('.warmup-option').forEach((opt) => {
          opt.addEventListener('click', () => {
            const isCorrect = opt.dataset.correct === 'true';
            puzzleContainer.querySelectorAll('.warmup-option').forEach((o) => {
              o.disabled = true;
              if (o.dataset.correct === 'true') o.classList.add('warmup-option--correct');
            });
            if (!isCorrect) opt.classList.add('warmup-option--wrong');

            if (isCorrect) {
              EduAI.Services.Gamification.addXP(5, 'warmup-puzzle');
              EduAI.Components.Toast.show('+5 XP — Warm-up complete! 🧩', 'xp', 2000);
            }
          });
        });
      }
    },

    /**
     * Render a warm-up puzzle.
     * @returns {string} HTML
     * @private
     */
    _renderWarmup() {
      const puzzle = EduAI.Mock.getRandomPuzzle ? EduAI.Mock.getRandomPuzzle() : null;
      if (!puzzle) return '<p class="text-muted">No puzzles available</p>';

      if (puzzle.type === 'sequence' || puzzle.type === 'math' || puzzle.type === 'pattern') {
        return `
          <div class="warmup-puzzle">
            <div class="warmup-puzzle__prompt">${puzzle.prompt}</div>
            <div class="warmup-puzzle__options">
              ${(puzzle.options || []).map((opt) => `
                <button class="warmup-option btn btn--ghost" data-correct="${opt === puzzle.answer}">${opt}</button>
              `).join('')}
            </div>
          </div>
        `;
      }

      return `
        <div class="warmup-puzzle">
          <div class="warmup-puzzle__prompt">${puzzle.prompt}</div>
          <p class="warmup-puzzle__hint text-muted">${puzzle.hint || 'Think about it!'}</p>
        </div>
      `;
    },
  };

  window.EduAI.Pages.ReviewShorts = ReviewShorts;
})();
