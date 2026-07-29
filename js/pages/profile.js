/**
 * Profile Page — User profile with stats, achievements, and activity
 * @namespace EduAI.Pages.Profile
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Pages = window.EduAI.Pages || {};

  const Profile = {
    /**
     * Render the profile page.
     * @returns {string} HTML string
     */
    render() {
      const user = EduAI.state.get('user') || {};
      const name = user.name || 'Student';
      const level = user.level || 1;
      const xp = user.xp || 0;
      const coins = user.coins || 0;
      const streak = user.streak || 0;
      const badges = user.badges || [];
      const title = EduAI.Services.Gamification.getTitle(level);
      const xpToNext = EduAI.Services.Gamification.getXPToNextLevel(level);
      const xpForLevel = EduAI.Services.Gamification.getXPForLevel(level);
      const progress = xpToNext > 0 ? ((xp - xpForLevel) / xpToNext) * 100 : 0;

      // Radar data
      const radarData = EduAI.Services.MasteryPredictor.getRadarData();

      return `
        <div class="profile">
          <div class="profile__header card">
            <div class="profile__user-block">
              ${EduAI.Components.Avatar.render({ size: 'xl' })}
              <div class="profile__user-info">
                <h1 class="profile__name">${name}</h1>
                <div class="profile__title">${title}</div>
                <div class="profile__level">Level ${level}</div>
              </div>
            </div>
            <div class="profile__stats">
              <div class="profile__stat">
                <span class="profile__stat-value">${xp}</span>
                <span class="profile__stat-label">Total XP</span>
              </div>
              <div class="profile__stat">
                <span class="profile__stat-value">${coins}</span>
                <span class="profile__stat-label">Coins</span>
              </div>
              <div class="profile__stat">
                <span class="profile__stat-value">🔥 ${streak}</span>
                <span class="profile__stat-label">Day Streak</span>
              </div>
            </div>
          </div>

          <div class="profile__xp-section card">
            <div class="card__header">
              <h3 class="card__title">Progress to Level ${level + 1}</h3>
            </div>
            ${EduAI.Components.XPBar.render()}
          </div>

          <div class="profile__mastery card">
            <div class="card__header">
              <h3 class="card__title">📊 Subject Mastery</h3>
            </div>
            ${EduAI.Components.RadarChart.render(radarData)}
          </div>

          <div class="profile__activity card">
            <div class="card__header">
              <h3 class="card__title">📅 Activity</h3>
            </div>
            ${EduAI.Components.HeatMap.render({ weeks: 12 })}
          </div>

          <div class="profile__achievements card">
            <div class="card__header">
              <h3 class="card__title">🏆 Achievements</h3>
            </div>
            ${badges.length > 0
              ? `<div class="badges-grid">${badges.map((b) => `
                  <div class="badge-item">
                    <span class="badge-item__icon">${b.icon}</span>
                    <span class="badge-item__name">${b.name}</span>
                  </div>
                `).join('')}</div>`
              : '<div class="empty-state"><div class="empty-state__icon">🏅</div><div class="empty-state__text">Complete lessons to earn badges!</div></div>'
            }
          </div>

          <div class="profile__knowledge card">
            <div class="card__header">
              <h3 class="card__title">🕸️ Knowledge Graph</h3>
            </div>
            ${EduAI.Components.KnowledgeGraph.render()}
          </div>
        </div>
      `;
    },

    /**
     * Initialize profile page (attach event handlers).
     */
    init() {
      // XPBar and StreakBadge auto-initialize via state subscriptions
    },
  };

  window.EduAI.Pages.Profile = Profile;
})();
