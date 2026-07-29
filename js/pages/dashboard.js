/**
 * Dashboard Page — Main landing page with overview cards
 * @namespace EduAI.Pages.Dashboard
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Pages = window.EduAI.Pages || {};

  const Dashboard = {
    /**
     * Render the dashboard page.
     * @returns {string} HTML string
     */
    render() {
      const user = EduAI.state.get('user') || {};
      const name = user.name || 'Student';
      const streak = user.streak || 0;
      const coins = user.coins || 0;
      const badges = user.badges || [];
      const level = user.level || 1;

      // Get subjects in progress
      const subjects = EduAI.Mock.Subjects;
      const subjectState = EduAI.state.get('subjects') || {};
      const subjectsInProgress = Object.keys(subjectState)
        .filter((id) => {
          const s = subjectState[id];
          return s && s.modules && s.modules.some((m) => m.questionsAnswered > 0 || m.completed);
        })
        .slice(0, 4);

      // Leaderboard
      const leaderboard = EduAI.Mock.getWeeklyLeaderboard().slice(0, 5);

      // Time-based greeting
      const hour = new Date().getHours();
      let greeting = 'Good morning';
      if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
      else if (hour >= 18) greeting = 'Good evening';

      // Mascot stage
      const mascotStage = level >= 30 ? 4 : level >= 16 ? 3 : level >= 6 ? 2 : 1;
      const mascotEmojis = { 1: '🧠', 2: '🧠', 3: '🧠', 4: '🧠' };
      const mascotClasses = { 1: '', 2: 'mascot-stage-2', 3: 'mascot-stage-3', 4: 'mascot-stage-4' };

      // Daily mix (mock: 3-4 items from different subjects)
      const dailyMix = Dashboard._generateDailyMix(subjectState);

      return `
        <div class="dashboard">
          <!-- Greeting -->
          <div class="dashboard__greeting card">
            <div class="dashboard__greeting-text">
              <h1>${greeting}, ${name}!</h1>
              <p>${streak > 0 ? `🔥 ${streak} day streak — keep it going!` : 'Ready to start learning today?'}</p>
            </div>
            <div class="dashboard__greeting-cta">
              <a href="#/catalog" class="btn btn--lg">Start Studying →</a>
            </div>
          </div>

          <!-- XP Section -->
          <div class="dashboard__xp card">
            <div class="card__header">
              <h3 class="card__title">Your Progress</h3>
            </div>
            ${EduAI.Components.XPBar.render()}
          </div>

          <!-- Mascot -->
          <div class="dashboard__mascot card">
            <div class="mascot-container">
              <div class="mascot-container__sprite">
                <div class="mascot-container__stage-glow"></div>
                <span class="mascot-emoji animate-mascot-bounce ${mascotClasses[mascotStage]}">${mascotEmojis[mascotStage]}</span>
              </div>
              <div class="mascot-container__label">Stage ${mascotStage} — ${EduAI.Services.Gamification.getTitle(level)}</div>
            </div>
          </div>

          <!-- Daily Mix -->
          <div class="dashboard__daily-mix card">
            <div class="card__header">
              <h3 class="card__title">📚 Today's Mix</h3>
            </div>
            <div class="daily-mix">
              ${dailyMix}
            </div>
          </div>

          <!-- Subjects in Progress -->
          <div class="dashboard__subjects card">
            <div class="card__header">
              <h3 class="card__title">📖 Continue Learning</h3>
              <a href="#/catalog" class="btn btn--ghost btn--sm">View All</a>
            </div>
            <div class="subjects-progress">
              ${subjectsInProgress.length > 0
                ? subjectsInProgress.map((id) => Dashboard._renderSubjectProgress(id, subjectState[id], subjects[id])).join('')
                : '<div class="empty-state"><div class="empty-state__icon">📚</div><div class="empty-state__title">No subjects started yet</div><div class="empty-state__text">Pick a subject from the catalog to begin your learning journey!</div><a href="#/catalog" class="btn btn--primary">Browse Subjects</a></div>'
              }
            </div>
          </div>

          <!-- Achievements -->
          <div class="dashboard__achievements card">
            <div class="card__header">
              <h3 class="card__title">🏆 Achievements</h3>
              <a href="#/profile" class="btn btn--ghost btn--sm">View All</a>
            </div>
            ${badges.length > 0
              ? `<div class="badges-grid">${badges.slice(0, 6).map((b) => `
                  <div class="badge-item">
                    <span class="badge-item__icon">${b.icon}</span>
                    <span class="badge-item__name">${b.name}</span>
                  </div>
                `).join('')}</div>`
              : '<div class="empty-state"><div class="empty-state__icon">🏅</div><div class="empty-state__text">Complete lessons to earn badges!</div></div>'
            }
          </div>

          <!-- Ranking -->
          <div class="dashboard__ranking card">
            <div class="card__header">
              <h3 class="card__title">📊 Weekly Ranking</h3>
            </div>
            <div class="leaderboard">
              ${leaderboard.map((npc, i) => `
                <div class="leaderboard__row">
                  <span class="leaderboard__position">${i + 1}</span>
                  <span class="leaderboard__avatar">${npc.avatar}</span>
                  <span class="leaderboard__name">${npc.name}</span>
                  <span class="leaderboard__xp">${npc.weeklyXP} XP</span>
                </div>
              `).join('')}
              <div class="leaderboard__row leaderboard__row--current">
                <span class="leaderboard__position">—</span>
                <span class="leaderboard__avatar">🎓</span>
                <span class="leaderboard__name">${name} (You)</span>
                <span class="leaderboard__xp">${user.xp || 0} XP</span>
              </div>
            </div>
          </div>

          <!-- Coins -->
          <div class="dashboard__coins card">
            <div class="card__header">
              <h3 class="card__title">🪙 Coins</h3>
            </div>
            <div class="coins-card">
              <span class="coins-card__icon">🪙</span>
              <span class="coins-card__amount">${coins}</span>
              <a href="#/shop" class="btn btn--secondary btn--sm">Visit Shop</a>
            </div>
          </div>
        </div>
      `;
    },

    /**
     * Initialize dashboard (attach click handlers).
     */
    init() {
      // Subject progress card clicks
      document.querySelectorAll('.subject-progress-card').forEach((card) => {
        card.addEventListener('click', () => {
          const subjectId = card.dataset.subject;
          if (subjectId) EduAI.Router.navigate('#/chat/' + subjectId);
        });
      });

      // Daily mix item clicks
      document.querySelectorAll('.daily-mix__item').forEach((item) => {
        item.addEventListener('click', () => {
          const subjectId = item.dataset.subject;
          if (subjectId) EduAI.Router.navigate('#/chat/' + subjectId);
        });
      });
    },

    /**
     * Generate the daily mix HTML.
     * @param {Object} subjectState
     * @returns {string} HTML
     * @private
     */
    _generateDailyMix(subjectState) {
      const subjects = EduAI.Mock.Subjects;
      const subjectIds = Object.keys(subjects);
      const mix = [];

      // Pick 3-4 subjects for the mix
      const picked = subjectIds.sort(() => Math.random() - 0.5).slice(0, 4);

      picked.forEach((id, i) => {
        const subject = subjects[id];
        const state = subjectState[id];
        const isStarted = state && state.modules && state.modules.some((m) => m.questionsAnswered > 0);
        const type = i === 0 ? 'new' : isStarted ? 'review' : 'srs';
        const typeLabel = type === 'new' ? 'New' : type === 'review' ? 'Review' : 'SRS';
        const typeClass = 'daily-mix__type--' + type;
        const duration = Math.floor(Math.random() * 10) + 3;

        mix.push(`
          <div class="daily-mix__item" data-subject="${id}">
            <span class="daily-mix__icon">${subject.icon}</span>
            <div class="daily-mix__info">
              <div class="daily-mix__name">${subject.name}</div>
              <div class="daily-mix__meta">~${duration} min</div>
            </div>
            <span class="daily-mix__type ${typeClass}">${typeLabel}</span>
          </div>
        `);
      });

      return mix.join('');
    },

    /**
     * Render a subject progress card.
     * @param {string} id
     * @param {Object} state
     * @param {Object} subject
     * @returns {string} HTML
     * @private
     */
    _renderSubjectProgress(id, state, subject) {
      if (!subject) return '';
      const modules = state.modules || [];
      const completed = modules.filter((m) => m.completed).length;
      const total = modules.length;
      const progress = total > 0 ? (completed / total) * 100 : 0;
      const currentModule = modules.find((m) => !m.completed) || modules[0];
      const moduleName = currentModule ? subject.modules[currentModule.id]?.name || 'Unknown' : 'Complete!';

      return `
        <div class="subject-progress-card" data-subject="${id}">
          <span class="subject-progress-card__icon">${subject.icon}</span>
          <div class="subject-progress-card__info">
            <div class="subject-progress-card__name">${subject.name}</div>
            <div class="subject-progress-card__module">${moduleName}</div>
            <div class="subject-progress-card__bar">
              <div class="subject-progress-card__bar-fill" style="width: ${progress}%"></div>
            </div>
          </div>
          <div class="subject-progress-card__action">
            <span class="btn btn--primary btn--sm">Continue</span>
          </div>
        </div>
      `;
    },
  };

  window.EduAI.Pages.Dashboard = Dashboard;
})();
