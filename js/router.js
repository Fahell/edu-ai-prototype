/**
 * Router — Hash-based SPA routing
 * @namespace EduAI.Router
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};

  /** @type {Array<{pattern: RegExp, keys: string[], pageName: string}>} */
  const routes = [];

  /** @type {string|null} Current page name */
  let currentPageName = null;

  /** @type {HTMLElement|null} */
  let pageContainer = null;

  const DEFAULT_ROUTE = '#/dashboard';

  // ── Helpers ──────────────────────────────────────────────────────────

  /**
   * Convert a route pattern like "#/chat/:subjectId" into a regex.
   * @param {string} pattern
   * @returns {{ regex: RegExp, keys: string[] }}
   */
  function compilePattern(pattern) {
    const keys = [];
    // Escape special regex chars, then replace :param with capture groups
    const regexStr = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, key) => {
        keys.push(key);
        return '([^/]+)';
      });
    const regex = new RegExp('^' + regexStr + '$');
    return { regex, keys };
  }

  /**
   * Get the current hash, normalized.
   * @returns {string}
   */
  function getCurrentHash() {
    const hash = window.location.hash || DEFAULT_ROUTE;
    return hash.startsWith('#') ? hash : '#' + hash;
  }

  // ── Public API ───────────────────────────────────────────────────────

  const Router = {
    /**
     * Register a route.
     * @param {string} pattern - e.g. "#/dashboard", "#/chat/:subjectId"
     * @param {string} pageName - Name of the page module (EduAI.Pages[pageName])
     */
    register(pattern, pageName) {
      const { regex, keys } = compilePattern(pattern);
      routes.push({ pattern: regex, keys, pageName });
    },

    /**
     * Navigate to a hash route.
     * @param {string} path - e.g. "#/dashboard" or "#/chat/mathematics"
     */
    navigate(path) {
      if (!path.startsWith('#')) {
        path = '#' + path;
      }
      window.location.hash = path;
    },

    /**
     * Get the current route info.
     * @returns {{ pageName: string|null, params: Object }}
     */
    getCurrentRoute() {
      const hash = getCurrentHash();

      for (const route of routes) {
        const match = hash.match(route.pattern);
        if (match) {
          const params = {};
          route.keys.forEach((key, i) => {
            params[key] = decodeURIComponent(match[i + 1]);
          });
          return { pageName: route.pageName, params };
        }
      }

      return { pageName: null, params: {} };
    },

    /**
     * Initialize the router. Listens for hash changes and renders the initial route.
     * Must be called after all pages are registered.
     */
    init() {
      pageContainer = document.getElementById('page-container');
      if (!pageContainer) {
        console.error('[Router] #page-container not found');
        return;
      }

      // Listen for hash changes
      window.addEventListener('hashchange', () => {
        Router.renderCurrentRoute();
      });

      // Render initial route
      if (!window.location.hash) {
        window.location.hash = DEFAULT_ROUTE;
      } else {
        Router.renderCurrentRoute();
      }

      console.log('[Router] Initialized');
    },

    /**
     * Parse the current hash and render the matching page.
     */
    renderCurrentRoute() {
      const { pageName, params } = Router.getCurrentRoute();

      if (!pageName) {
        console.warn('[Router] No route matched for:', getCurrentHash());
        Router.navigate(DEFAULT_ROUTE);
        return;
      }

      // Get the page module
      const page = window.EduAI.Pages && window.EduAI.Pages[pageName];
      if (!page) {
        console.error(`[Router] Page module "${pageName}" not found`);
        return;
      }

      // Skip re-render if same page (allow re-render for param changes)
      const isSamePage = currentPageName === pageName;
      currentPageName = pageName;

      // Dispatch route change event (for sidebar active state, etc.)
      document.dispatchEvent(
        new CustomEvent('routechange', {
          detail: { pageName, params, hash: getCurrentHash() },
        })
      );

      // Render the page
      Router._renderPage(page, params, isSamePage);
    },

    /**
     * Render a page into the container with transition.
     * @param {Object} page - Page module with render(params) method
     * @param {Object} params - Route parameters
     * @param {boolean} isSamePage - Whether we're re-rendering the same page
     * @private
     */
    _renderPage(page, params, isSamePage) {
      if (!pageContainer) return;

      // Exit animation on current content
      if (!isSamePage && pageContainer.children.length > 0) {
        pageContainer.classList.add('page-exit');
      }

      const renderNewPage = () => {
        // Clear container
        pageContainer.innerHTML = '';
        pageContainer.classList.remove('page-exit');
        pageContainer.classList.add('page-enter');

        // Call the page's render method
        try {
          const result = page.render(params);

          // Handle async render
          if (result instanceof Promise) {
            result
              .then((html) => {
                if (typeof html === 'string') {
                  pageContainer.innerHTML = html;
                }
                if (page.init) page.init(params);
              })
              .catch((err) => {
                console.error(`[Router] Async render error:`, err);
                pageContainer.innerHTML =
                  '<div class="page-loading"><p>Error loading page</p></div>';
              });
          } else if (typeof result === 'string') {
            pageContainer.innerHTML = result;
            if (page.init) page.init(params);
          }
        } catch (err) {
          console.error(`[Router] Render error for "${currentPageName}":`, err);
          pageContainer.innerHTML =
            '<div class="page-loading"><p>Error loading page</p></div>';
        }

        // Remove enter animation class after it completes
        setTimeout(() => {
          pageContainer.classList.remove('page-enter');
        }, 250);

        // Scroll to top
        const mainContent = document.querySelector('.main-content');
        if (mainContent) mainContent.scrollTop = 0;
      };

      // Delay slightly for exit animation, or render immediately
      if (!isSamePage && pageContainer.children.length > 0) {
        setTimeout(renderNewPage, 150);
      } else {
        renderNewPage();
      }
    },
  };

  window.EduAI.Router = Router;
})();
