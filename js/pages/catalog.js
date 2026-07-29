/**
 * Catalog Page — Subject browser with search and custom subject creation
 * @namespace EduAI.Pages.Catalog
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Pages = window.EduAI.Pages || {};

  const Catalog = {
    /** @type {string[]} All subject IDs */
    _allIds: [],

    /**
     * Render the catalog page.
     * @returns {string} HTML string
     */
    render() {
      const subjects = EduAI.Mock.Subjects;
      const subjectState = EduAI.state.get('subjects') || {};
      Catalog._allIds = Object.keys(subjects);

      const subjectCards = Catalog._allIds.map((id) => {
        return Catalog._renderSubjectCard(id, subjects[id], subjectState[id]);
      }).join('');

      return `
        <div class="catalog">
          <div class="catalog__header">
            <h1 class="catalog__title">📚 Subject Catalog</h1>
            <div class="catalog__search">
              <span class="catalog__search-icon">🔍</span>
              <input
                type="text"
                class="catalog__search-input"
                id="catalog-search"
                placeholder="Search subjects..."
                aria-label="Search subjects"
              >
            </div>
          </div>

          <div class="catalog__filters" id="catalog-filters">
            <button class="chip chip--active" data-filter="all">All</button>
            <button class="chip" data-filter="beginner">Beginner</button>
            <button class="chip" data-filter="intermediate">Intermediate</button>
            <button class="chip" data-filter="advanced">Advanced</button>
          </div>

          <div class="catalog__grid" id="catalog-grid">
            ${subjectCards}
            ${Catalog._renderCustomCard()}
          </div>
        </div>
      `;
    },

    /**
     * Initialize the catalog page — attach search, filter, and click handlers.
     */
    init() {
      // Search input
      const searchInput = document.getElementById('catalog-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          Catalog._filterCards(e.target.value, Catalog._getActiveDifficulty());
        });
      }

      // Difficulty filter chips
      document.querySelectorAll('#catalog-filters .chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          // Update active state
          document.querySelectorAll('#catalog-filters .chip').forEach((c) => c.classList.remove('chip--active'));
          chip.classList.add('chip--active');

          const difficulty = chip.dataset.filter;
          const searchTerm = document.getElementById('catalog-search')?.value || '';
          Catalog._filterCards(searchTerm, difficulty);
        });
      });

      // Subject card clicks
      document.querySelectorAll('.subject-card[data-subject]').forEach((card) => {
        card.addEventListener('click', () => {
          const subjectId = card.dataset.subject;
          if (subjectId) EduAI.Router.navigate('#/chat/' + subjectId);
        });
      });

      // Custom subject button
      const customCard = document.querySelector('.subject-card--custom');
      if (customCard) {
        customCard.addEventListener('click', () => {
          Catalog._showCustomSubjectFlow();
        });
      }
    },

    /**
     * Render a single subject card.
     * @param {string} id
     * @param {Object} subject
     * @param {Object} state
     * @returns {string} HTML
     * @private
     */
    _renderSubjectCard(id, subject, state) {
      const difficultyLabel = subject.difficulty.charAt(0).toUpperCase() + subject.difficulty.slice(1);
      const modules = subject.modules || [];
      const moduleCount = modules.length;
      const hours = subject.estimatedHours || '?';
      const studying = Math.floor(Math.random() * 50) + 10;

      // Progress
      let progressHTML = '';
      let srsHTML = '';
      if (state && state.modules) {
        const completed = state.modules.filter((m) => m.completed).length;
        const progress = moduleCount > 0 ? (completed / moduleCount) * 100 : 0;
        if (completed > 0) {
          progressHTML = `
            <div class="subject-card__progress">
              <div class="subject-card__progress-bar">
                <div class="subject-card__progress-fill" style="width: ${progress}%"></div>
              </div>
            </div>
          `;
        }
      }

      const buttonText = (state && state.modules && state.modules.some((m) => m.questionsAnswered > 0)) ? 'Continue' : 'Start';

      return `
        <div class="subject-card" data-subject="${id}" data-difficulty="${subject.difficulty}" data-name="${subject.name.toLowerCase()}">
          <div class="subject-card__header">
            <div class="subject-card__icon">${subject.icon}</div>
            <div>
              <div class="subject-card__title">${subject.name}</div>
              <div class="subject-card__difficulty subject-card__difficulty--${subject.difficulty}">${difficultyLabel}</div>
            </div>
          </div>
          <div class="subject-card__description">${subject.description}</div>
          <div class="subject-card__meta">
            <span class="subject-card__modules">📋 ${moduleCount} modules</span>
            <span class="subject-card__hours">⏱️ ~${hours}h</span>
            <span class="subject-card__studying">👥 ${studying} studying</span>
          </div>
          ${progressHTML}
          <div class="subject-card__footer">
            ${srsHTML}
            <span class="btn btn--primary btn--sm">${buttonText}</span>
          </div>
        </div>
      `;
    },

    /**
     * Render the "Create Custom Subject" card.
     * @returns {string} HTML
     * @private
     */
    _renderCustomCard() {
      return `
        <div class="subject-card subject-card--custom" role="button" tabindex="0" aria-label="Create a custom subject">
          <div class="subject-card__icon">➕</div>
          <div class="subject-card__title">Create Custom Subject</div>
          <div class="subject-card__description">Tell us what you want to learn and our AI will build a personalized study plan.</div>
        </div>
      `;
    },

    /**
     * Filter visible cards by search term and difficulty.
     * @param {string} searchTerm
     * @param {string} difficulty - 'all', 'beginner', 'intermediate', 'advanced'
     * @private
     */
    _filterCards(searchTerm, difficulty) {
      const term = searchTerm.toLowerCase().trim();
      const cards = document.querySelectorAll('.subject-card[data-subject]');

      let visibleCount = 0;

      cards.forEach((card) => {
        const name = card.dataset.name || '';
        const diff = card.dataset.difficulty || '';

        const matchesSearch = !term || name.includes(term);
        const matchesDifficulty = difficulty === 'all' || diff === difficulty;

        if (matchesSearch && matchesDifficulty) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Handle no results
      let noResults = document.querySelector('.catalog__no-results');
      if (visibleCount === 0 && !noResults) {
        const grid = document.getElementById('catalog-grid');
        if (grid) {
          const el = document.createElement('div');
          el.className = 'catalog__no-results';
          el.innerHTML = `
            <div class="catalog__no-results-icon">🔍</div>
            <div class="catalog__no-results-text">No subjects found matching "${searchTerm || difficulty}"</div>
          `;
          grid.appendChild(el);
        }
      } else if (visibleCount > 0 && noResults) {
        noResults.remove();
      }
    },

    /**
     * Get the currently active difficulty filter.
     * @returns {string}
     * @private
     */
    _getActiveDifficulty() {
      const active = document.querySelector('#catalog-filters .chip--active');
      return active ? active.dataset.filter : 'all';
    },

    /**
     * Show custom subject creation flow.
     * For now, navigates to the triagem page.
     * @private
     */
    _showCustomSubjectFlow() {
      // Show suggestion cards first (simplified: go to triagem page)
      EduAI.Router.navigate('#/triagem');
    },
  };

  window.EduAI.Pages.Catalog = Catalog;
})();
