/**
 * Sidebar — Fixed navigation with user block, XP bar, streak, ticker, theme toggle
 * @namespace EduAI.Components.Sidebar
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Components = window.EduAI.Components || {};

  /** @type {number|null} */
  let _tickerInterval = null;

  const NAV_ITEMS = [
    { hash: '#/dashboard', icon: '🏠', label: 'Dashboard' },
    { hash: '#/catalog', icon: '📚', label: 'Subjects' },
    { hash: '#/review', icon: '⚡', label: 'Quick Review' },
    { hash: '#/profile', icon: '👤', label: 'My Profile' },
  ];

  const Sidebar = {
    /**
     * Render the full sidebar HTML.
     * @returns {string} HTML string
     */
    render() {
      const user = EduAI.state.get('user') || {};
      const name = user.name || 'Student';
      const level = user.level || 1;
      const coins = user.coins || 0;
      const streak = user.streak || 0;
      const title = EduAI.Services.Gamification.getTitle(level);
      const currentHash = window.location.hash || '#/dashboard';

      const navLinks = NAV_ITEMS.map((item) => {
        const isActive = currentHash.startsWith(item.hash);
        const activeClass = isActive ? ' sidebar__nav-item--active' : '';
        return `
          <a href="${item.hash}" class="sidebar__nav-item${activeClass}" data-route="${item.hash}">
            <span class="sidebar__nav-icon">${item.icon}</span>
            <span class="sidebar__nav-label">${item.label}</span>
          </a>
        `;
      }).join('');

      return `
        <div class="sidebar__header">
          <a href="#/dashboard" class="sidebar__logo">
            <span class="sidebar__logo-icon">🧠</span>
            <span class="sidebar__logo-text">EduAI</span>
          </a>
        </div>

        <nav class="sidebar__nav" aria-label="Main navigation">
          <div class="sidebar__nav-list">
            ${navLinks}
          </div>
        </nav>

        <div class="sidebar__ticker" id="sidebar-ticker">
          <div class="sidebar__ticker-header">Live Activity</div>
          <div class="sidebar__ticker-feed" id="ticker-feed"></div>
        </div>

        <div class="sidebar__user">
          <div class="sidebar__user-info">
            <div class="sidebar__user-avatar">🎓</div>
            <div class="sidebar__user-details">
              <div class="sidebar__user-name">${name}</div>
              <div class="sidebar__user-level">Lv.${level} — ${title}</div>
            </div>
          </div>

          <div class="sidebar__user-stats">
            <div class="sidebar__user-stat">
              <div id="sidebar-xp-bar">${EduAI.Components.XPBar.render()}</div>
            </div>
          </div>

          <div class="sidebar__user-stats" style="gap: var(--space-3);">
            <span id="sidebar-streak">${EduAI.Components.StreakBadge.render()}</span>
            <span class="sidebar__user-stat">
              <span class="coins-display">
                <span class="coins-display__icon">🪙</span>
                <span id="sidebar-coins">${coins}</span>
              </span>
            </span>
          </div>

          <div class="sidebar__user-actions">
            <a href="#/profile" class="btn btn--ghost btn--sm">View Profile</a>
            <span id="sidebar-theme-toggle">${EduAI.Components.ThemeToggle.render()}</span>
          </div>
        </div>
      `;
    },

    /**
     * Initialize sidebar: mount sub-components, attach listeners, start ticker.
     */
    init() {
      // Initialize sub-components
      EduAI.Components.ThemeToggle.init();
      EduAI.Components.XPBar.init();
      EduAI.Components.StreakBadge.init();

      // Listen for route changes to update active state
      document.addEventListener('routechange', (e) => {
        Sidebar._updateActiveNav(e.detail.hash);
      });

      // Listen for user stat changes
      EduAI.state.on('user.coins', (val) => {
        const el = document.getElementById('sidebar-coins');
        if (el) el.textContent = val || 0;
      });

      EduAI.state.on('user.level', (val) => {
        const el = document.querySelector('.sidebar__user-level');
        if (el) {
          const title = EduAI.Services.Gamification.getTitle(val || 1);
          el.textContent = `Lv.${val || 1} — ${title}`;
        }
      });

      EduAI.state.on('user.name', (val) => {
        const el = document.querySelector('.sidebar__user-name');
        if (el) el.textContent = val || 'Student';
      });

      // Start live ticker
      Sidebar._startTicker();
    },

    /**
     * Update the active nav link based on current hash.
     * @param {string} hash
     * @private
     */
    _updateActiveNav(hash) {
      const links = document.querySelectorAll('.sidebar__nav-item');
      links.forEach((link) => {
        const route = link.getAttribute('data-route');
        if (hash && hash.startsWith(route)) {
          link.classList.add('sidebar__nav-item--active');
        } else {
          link.classList.remove('sidebar__nav-item--active');
        }
      });
    },

    /**
     * Start the live ticker that shows random NPC events.
     * @private
     */
    _startTicker() {
      const feed = document.getElementById('ticker-feed');
      if (!feed) return;

      // Initial events
      for (let i = 0; i < 3; i++) {
        const event = EduAI.Mock.generateTickerEvent();
        const el = document.createElement('div');
        el.className = 'sidebar__ticker-event';
        el.textContent = event;
        feed.appendChild(el);
      }

      // Add new events periodically
      _tickerInterval = setInterval(() => {
        const event = EduAI.Mock.generateTickerEvent();
        const el = document.createElement('div');
        el.className = 'sidebar__ticker-event';
        el.textContent = event;

        // Insert at top
        feed.insertBefore(el, feed.firstChild);

        // Keep only last 5 events
        while (feed.children.length > 5) {
          feed.removeChild(feed.lastChild);
        }
      }, 8000 + Math.random() * 7000); // 8-15 seconds
    },

    /**
     * Stop the ticker (for cleanup).
     */
    stopTicker() {
      if (_tickerInterval) {
        clearInterval(_tickerInterval);
        _tickerInterval = null;
      }
    },
  };

  window.EduAI.Components.Sidebar = Sidebar;
})();
