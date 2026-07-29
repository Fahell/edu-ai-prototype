/**
 * App Bootstrapper — Initializes all services, renders shell, registers routes
 * @namespace EduAI.App
 * @description Must be loaded LAST in index.html (after all other scripts).
 *              Entry point that turns static HTML into a running SPA.
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};

  const App = {
    /** @type {boolean} Whether the app has been bootstrapped */
    _booted: false,

    /**
     * Bootstrap the application.
     * 1. Initialize state (async — loads from localStorage / default JSON)
     * 2. Apply saved theme
     * 3. Initialize components that need DOM refs
     * 4. Render sidebar
     * 5. Register routes
     * 6. Initialize router (renders first page)
     * 7. Check streak (silent at startup)
     * 8. Remove loading state
     * @returns {Promise<void>}
     */
    async boot() {
      if (App._booted) return;
      App._booted = true;

      console.log('[App] Booting EduAI...');

      // ── 1. Initialize State ────────────────────────────────
      try {
        await EduAI.state.init();
        console.log('[App] State initialized');
      } catch (err) {
        console.error('[App] State init failed:', err);
        // Continue with empty state rather than blocking
      }

      // ── 2. Apply Theme ─────────────────────────────────────
      const theme = EduAI.state.get('settings.theme') || 'light';
      document.documentElement.setAttribute('data-theme', theme);
      console.log('[App] Theme applied:', theme);

      // ── 3. Initialize Standalone Components ────────────────
      // Modal needs to listen for overlay clicks globally
      if (EduAI.Components.Modal) {
        EduAI.Components.Modal.init();
      }

      // ── 4. Render Sidebar ──────────────────────────────────
      const sidebarEl = document.getElementById('sidebar');
      if (sidebarEl && EduAI.Components.Sidebar) {
        sidebarEl.innerHTML = EduAI.Components.Sidebar.render();
        EduAI.Components.Sidebar.init();
        console.log('[App] Sidebar rendered');
      }

      // ── 5. Register Routes ─────────────────────────────────
      const Router = EduAI.Router;
      if (Router) {
        Router.register('#/dashboard', 'Dashboard');
        Router.register('#/catalog', 'Catalog');
        Router.register('#/chat/:subjectId', 'Study');
        Router.register('#/review', 'ReviewShorts');
        Router.register('#/profile', 'Profile');
        Router.register('#/triagem', 'Triagem');
        console.log('[App] Routes registered');
      }

      // ── 6. Initialize Router (renders initial page) ────────
      if (Router) {
        Router.init();
        console.log('[App] Router initialized');
      }

      // ── 7. Check Streak (silent at startup) ────────────────
      if (EduAI.Services.Gamification) {
        EduAI.Services.Gamification.checkStreak({ silent: true });
      }

      // ── 8. Remove Loading State ────────────────────────────
      App._removeLoadingState();

      // ── 9. Wire Keyboard Shortcuts ─────────────────────────
      App._setupGlobalKeyboardShortcuts();

      // ── 10. First-Run Experience ───────────────────────────
      App._checkFirstRun();

      console.log('[App] EduAI ready ✓');
    },

    /**
     * Remove the initial loading spinner and reveal the app shell.
     * @private
     */
    _removeLoadingState() {
      const loadingEl = document.querySelector('.page-loading');
      if (loadingEl) {
        loadingEl.style.opacity = '0';
        loadingEl.style.transition = 'opacity 0.3s ease';
        setTimeout(() => loadingEl.remove(), 300);
      }

      // Ensure app shell is visible
      const appEl = document.getElementById('app');
      if (appEl) {
        appEl.classList.add('app--ready');
      }
    },

    /**
     * Set up global keyboard shortcuts.
     * @private
     */
    _setupGlobalKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K — Focus search (if on catalog page)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          const searchInput = document.getElementById('catalog-search');
          if (searchInput) {
            searchInput.focus();
          }
        }

        // Escape — Close modal
        if (e.key === 'Escape') {
          if (EduAI.Components.Modal) {
            EduAI.Components.Modal.close();
          }
        }
      });
    },

    /**
     * Check if this is the user's first visit and show a welcome toast.
     * @private
     */
    _checkFirstRun() {
      const hasVisited = EduAI.Services.Storage.has('has_visited');
      if (!hasVisited) {
        EduAI.Services.Storage.save('has_visited', true);

        // Show welcome toast after a brief delay
        setTimeout(() => {
          if (EduAI.Components.Toast) {
            EduAI.Components.Toast.show(
              'Welcome to EduAI! Pick a subject to start learning. 🧠',
              'success',
              5000
            );
          }
        }, 1000);
      }
    },
  };

  window.EduAI.App = App;

  // ── Auto-boot on DOMContentLoaded ─────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.boot());
  } else {
    // DOM already loaded (script at bottom of body)
    App.boot();
  }
})();
