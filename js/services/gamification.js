/**
 * Gamification Service — XP, levels, streaks, coins, badges
 * @namespace EduAI.Services.Gamification
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Services = window.EduAI.Services || {};

  // XP curve: level_n requires floor(100 * 1.5^(n-1)) total XP
  // Level 1: 0, Level 2: 100, Level 3: 250, Level 4: 475, Level 5: 813, ...
  const XP_BASE = 100;
  const XP_GROWTH = 1.5;

  const LEVEL_TITLES = [
    { level: 1, title: 'Newcomer' },
    { level: 5, title: 'Curious Mind' },
    { level: 10, title: 'Dedicated Student' },
    { level: 15, title: 'Knowledge Seeker' },
    { level: 20, title: 'Scholar' },
    { level: 30, title: 'Master Scholar' },
    { level: 50, title: 'Grand Master' },
  ];

  const Gamification = {
    /**
     * Get total XP required to reach a given level.
     * @param {number} level - Target level (1-indexed)
     * @returns {number} Total XP threshold
     */
    getXPForLevel(level) {
      if (level <= 1) return 0;
      let total = 0;
      for (let i = 1; i < level; i++) {
        total += Math.floor(XP_BASE * Math.pow(XP_GROWTH, i - 1));
      }
      return total;
    },

    /**
     * Get XP required to go from current level to next level.
     * @param {number} level - Current level
     * @returns {number} XP needed for next level
     */
    getXPToNextLevel(level) {
      return Math.floor(XP_BASE * Math.pow(XP_GROWTH, level - 1));
    },

    /**
     * Calculate level from total XP.
     * @param {number} totalXP
     * @returns {number} Level (1-indexed)
     */
    getLevel(totalXP) {
      let level = 1;
      let xpNeeded = 0;
      while (xpNeeded <= totalXP) {
        level++;
        xpNeeded += Math.floor(XP_BASE * Math.pow(XP_GROWTH, level - 2));
      }
      return level - 1;
    },

    /**
     * Get the title for a given level.
     * @param {number} level
     * @returns {string}
     */
    getTitle(level) {
      let title = LEVEL_TITLES[0].title;
      for (const entry of LEVEL_TITLES) {
        if (level >= entry.level) title = entry.title;
      }
      return title;
    },

    /**
     * Add XP to the user. Handles level-up detection and notifications.
     * @param {number} amount - XP to add
     * @param {string} [source] - What earned the XP (for logging)
     */
    addXP(amount, source) {
      const currentXP = EduAI.state.get('user.xp') || 0;
      const currentLevel = EduAI.state.get('user.level') || 1;
      const newXP = currentXP + amount;
      const newLevel = Gamification.getLevel(newXP);

      EduAI.state.set('user.xp', newXP);
      EduAI.state.set('user.xpToNext', Gamification.getXPToNextLevel(newLevel));

      // Show XP float animation
      Gamification._showXPFloat(amount);

      // Show toast
      const Toast = EduAI.Components && EduAI.Components.Toast;
      if (Toast) {
        Toast.show(`+${amount} XP`, 'xp', 2000);
      }

      // Check for level up
      if (newLevel > currentLevel) {
        EduAI.state.set('user.level', newLevel);
        Gamification._onLevelUp(newLevel);
      }
    },

    /**
     * Add coins to the user.
     * @param {number} amount
     * @param {string} [source]
     */
    addCoins(amount, source) {
      const current = EduAI.state.get('user.coins') || 0;
      EduAI.state.set('user.coins', current + amount);

      const Toast = EduAI.Components && EduAI.Components.Toast;
      if (Toast) {
        Toast.show(`+${amount} 🪙`, 'coins', 2000);
      }
    },

    /**
     * Check and update the daily streak.
     * Call this once at app startup.
     */
    checkStreak() {
      const lastActive = EduAI.state.get('user.lastActiveDate');
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      if (lastActive === today) return; // Already counted today

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastActive === yesterdayStr) {
        // Consecutive day — increment streak
        const newStreak = (EduAI.state.get('user.streak') || 0) + 1;
        EduAI.state.set('user.streak', newStreak);
        EduAI.state.set('user.lastActiveDate', today);

        // Streak bonus XP
        if (newStreak % 7 === 0) {
          Gamification.addXP(50, 'streak-milestone');
          Gamification.addCoins(50, 'streak-milestone');
        } else {
          Gamification.addXP(10, 'streak-daily');
        }
      } else if (lastActive === null) {
        // First time ever
        EduAI.state.set('user.streak', 1);
        EduAI.state.set('user.lastActiveDate', today);
      } else {
        // Streak broken
        const oldStreak = EduAI.state.get('user.streak') || 0;
        if (oldStreak > 0) {
          const Toast = EduAI.Components && EduAI.Components.Toast;
          if (Toast) {
            Toast.show('Streak broken! Start a new one today. 💪', 'warning', 5000);
          }
        }
        EduAI.state.set('user.streak', 1);
        EduAI.state.set('user.lastActiveDate', today);
      }
    },

    /**
     * Record study activity for today (updates heatmap and streak).
     * @param {number} questionsAnswered
     * @param {number} xpEarned
     */
    recordActivity(questionsAnswered, xpEarned) {
      const today = new Date().toISOString().split('T')[0];
      const heatmap = EduAI.state.get('activityHeatMap') || {};
      const existing = heatmap[today] || { questionsAnswered: 0, xpEarned: 0, minutesStudied: 0 };

      heatmap[today] = {
        questionsAnswered: existing.questionsAnswered + questionsAnswered,
        xpEarned: existing.xpEarned + xpEarned,
        minutesStudied: existing.minutesStudied + 1, // rough estimate
      };

      EduAI.state.set('activityHeatMap', heatmap);
      // Update last active date for streak
      EduAI.state.set('user.lastActiveDate', today);
    },

    /**
     * Award a badge if not already earned.
     * @param {string} badgeId
     * @param {string} badgeName - Display name
     * @param {string} badgeIcon - Emoji icon
     * @returns {boolean} true if newly awarded
     */
    awardBadge(badgeId, badgeName, badgeIcon) {
      const badges = EduAI.state.get('user.badges') || [];
      if (badges.some((b) => b.id === badgeId)) return false;

      const newBadge = {
        id: badgeId,
        name: badgeName,
        icon: badgeIcon,
        date: new Date().toISOString(),
      };
      badges.push(newBadge);
      EduAI.state.set('user.badges', badges);

      const Toast = EduAI.Components && EduAI.Components.Toast;
      if (Toast) {
        Toast.show(`Badge unlocked: ${badgeIcon} ${badgeName}!`, 'badge', 6000);
      }

      return true;
    },

    /**
     * Check if user has earned any new badges based on current state.
     * Call after XP/streak/question changes.
     */
    checkBadgeAwards() {
      const streak = EduAI.state.get('user.streak') || 0;
      const level = EduAI.state.get('user.level') || 1;
      const xp = EduAI.state.get('user.xp') || 0;

      if (xp > 0) {
        Gamification.awardBadge('first-step', 'First Step', '🌟');
      }
      if (streak >= 7) {
        Gamification.awardBadge('on-fire', 'On Fire', '🔥');
      }
      if (streak >= 30) {
        Gamification.awardBadge('streak-legend', 'Streak Legend', '🏆');
      }
      if (level >= 10) {
        Gamification.awardBadge('dedicated', 'Dedicated Learner', '📚');
      }
    },

    /**
     * Show a floating "+XP" indicator near the XP bar.
     * @param {number} amount
     * @private
     */
    _showXPFloat(amount) {
      const xpBar = document.querySelector('.xp-bar');
      if (!xpBar) return;

      const float = document.createElement('div');
      float.className = 'xp-float';
      float.textContent = `+${amount} XP`;

      const rect = xpBar.getBoundingClientRect();
      float.style.left = rect.left + rect.width / 2 + 'px';
      float.style.top = rect.top + 'px';

      document.body.appendChild(float);
      setTimeout(() => float.remove(), 1500);
    },

    /**
     * Handle level-up celebration.
     * @param {number} newLevel
     * @private
     */
    _onLevelUp(newLevel) {
      const Toast = EduAI.Components && EduAI.Components.Toast;
      if (Toast) {
        Toast.show(`Level Up! You are now Level ${newLevel}! 🎉`, 'level-up', 6000);
      }

      // Check for new badge
      Gamification.checkBadgeAwards();
    },
  };

  window.EduAI.Services.Gamification = Gamification;
})();
