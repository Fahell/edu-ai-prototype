# Changelog

All notable changes to this project are documented here. This log is updated every development turn to keep all agents and contributors aligned on project status.

---

## [Unreleased]

- Phase 1 implementation in progress (Batches 1+2 complete, Batches 3-7 pending)


## [2026-07-29] — Batch 3: Mock Data

### Added
- **js/mock/subjects.js** — 8 subjects with 4-6 modules each, knowledge graph with 30+ prerequisite edges (intra-subject and cross-subject), 8 custom subject suggestions for the triage flow
- **js/mock/questions.js** — Question bank covering 8 subjects with 25+ questions across all 6 types (multiple-choice, true-false, fill-blank, drag-drop, slider, canvas), each with explanation and Socratic hint. Helper functions: getQuestions(subjectId, moduleId), getQuestionById(questionId)
- **js/mock/ai-responses.js** — AI response templates for 3 personas (Prof. Sage, Coach Spark, Quiz Master) across 10 contexts: greeting, explanation, correct, incorrect-socratic, moduleComplete, streakActive, streakBroken, frustrated, speedLearner, slashCommands, warmup, fallback. All use {name}, {subject}, {module} placeholders
- **js/mock/npcs.js** — 10 NPCs with names, avatars, XP, levels, ghost race speeds, weekly XP scores. Live ticker with 5 name templates, badge names, subject names, 8 event templates. Helper functions: generateTickerEvent(), getWeeklyLeaderboard(), getGhostRacer(difficulty)
- **js/mock/shop-items.js** — Shop catalog: 5 visual themes, 7 avatar accessories (face/head/held slots), 6 mascot accessories (face/head/aura/neck slots), 7 titles. Helper functions: getAllItems(), getShopItemById(itemId)
- **js/mock/warmup-puzzles.js** — 17 warm-up puzzles across 6 types (sequence, pattern, logic, math, riddle, rotation) with difficulty ratings. Helper functions: getRandomPuzzle(difficulty), getPuzzleById(puzzleId), getPuzzles(type)
- **Bug fix**: questions.js math-0-1 — prompt was "15-9 is even" (true) but correctAnswer was false. Changed to "15-9 is odd" (false) to match answer key
- **Bug fix**: warmup-puzzles.js math-02 — confusing prompt about "triangles" replaced with clear "What is 7 + 8?"
---

## [2026-07-29] — Batch 1+2: CSS Design System & JS Core

### Added
- **CSS Design System (Batch 2)**
  - `css/variables.css` — Complete design tokens: colors (light/dark/gamification/personas), typography (Inter font family, 8 size scale), spacing (4px base, 12-step scale), shadows (6 elevation levels), border radius, transitions, z-index scale, layout dimensions
  - `css/base.css` — CSS reset, global typography (h1-h6, p, a, code), scrollbar styling, focus states, 60+ utility classes (flex, grid, spacing, text, display, overflow, border-radius, transitions)
  - `css/themes.css` — Dark theme overrides via `html[data-theme="dark"]` selector, all tokens overridden for dark backgrounds, smooth theme transition, prefers-reduced-motion support
  - `css/layout.css` — App shell structure: sidebar (240px fixed, nav links, ticker, user block), main content (flex-1, scrollable), page container with enter/exit transitions, toast container (bottom-right), modal overlay (backdrop blur), confetti/matrix canvas overlays
  - `css/animations.css` — 20+ keyframe animations: page transitions (fadeIn, fadeSlideIn, scaleIn), gamification (floatUp, fireFlicker, mascotBounce, mascotCelebrate, levelUpBurst), feedback (shake, correctPop, wrongShake), UI (pulse, glow, bounce, spin, typingDot), toast (toastIn, toastOut), plus utility classes and prefers-reduced-motion respect

- **JS Core (Batch 1)**
  - `js/services/storage.js` — localStorage wrapper with `eduai_` prefix, JSON serialization/deserialization, error handling for private browsing, methods: save, load, remove, clear, has
  - `js/state.js` — Centralized state management: dot-path get/set, event listener system (on/off with parent-path matching), auto-persist to localStorage on every set, deep merge of saved state with defaults, batchSet for atomic multi-path updates, async init with fetch from state-default.json, reset to defaults
  - `js/router.js` — Hash-based SPA router: pattern compilation with regex and parameter extraction, hashchange listener, page rendering with exit/enter transitions, async render support, route change events for sidebar active state, default route fallback to #/dashboard

### Fixed
- Router `compilePattern` parameter extraction — colon `:` was never escaped by the regex step (not a special char), so the second replace looking for `\\:` never matched routes like `#/chat/:subjectId`. Fixed to match bare `:` instead.

---

## [2026-07-29] — App Shell, Default State & Docs

### Added
- `index.html` — Full app shell with CSS/JS references in correct load order per agents.md, Google Fonts (Inter), favicon, semantic HTML structure (sidebar, main, toast/modal/confetti containers), 40+ script/link tags
- `data/state-default.json` — Default user state with 8 subjects (mathematics, portuguese, logical-reasoning, history, science, english, programming, law), each with 4-6 named modules, SRS tracking, activity heatmap, shop purchases, settings (theme, persona, slash commands)
- `docs/spec.md` — Complete product specification (moved from root)
- `docs/insights.md` — Creative research and wow-factor ideas (moved from root)

---

## [2026-07-29] — Phase 1 Implementation Plan

### Added
- `docs/phase-1-plan.md` — Detailed implementation plan: 7 dependency-based batches covering 30 files (~2,200 LoC), each file specified with namespace, public API, estimated LoC, and tricky implementation notes, validation checklist for Phase 1 completion

---

## [2026-07-29] — Project Scaffold & Documentation

### Added
- Full project scaffold: 59 files across css/, js/ (mock, services, components, widgets, pages), assets/, data/
- `README.md` — Project overview, key features, getting started, project structure, design system, implementation phases, technical decisions
- `agents.md` — Agent guidelines: architecture (SPA, global namespace, state-driven), code conventions (CSS BEM, ES6+, JSDoc), key patterns (adding pages, widgets, components), state management API, file load order, design tokens, mock system, testing checklist, constraints
- `.gitignore` — Standard vanilla web project ignores
- Git initialized, GitHub repository created at https://github.com/Fahell/edu-ai-prototype

---

## [2026-07-29] — Creative Research & Spec Refinement

### Added
- `edu-ai-insights.md` — Research across EdTech trends 2025-2026, analysis of Duolingo/Khanmigo/Brilliant/Desmos/DataCamp/Quizlet, brainstorming with Gemini thinker agent. Top 10 wow features identified: Matrix Upload animation, Evolving Mascot (Tamagotchi), Knowledge Graph, Ghost Racing, Canvas Shape Recognition, AI Typo simulation, Slash Commands, Spaced Repetition, Activity Heat Map, Daily Study Mix

### Updated
- `edu-ai-prototype-spec.md` — Integrated all creative insights: 3 AI personas (Prof. Sage, Coach Spark, Quiz Master), mascot evolution system, Matrix Upload post-triage animation, Ghost Racing in quizzes, SRS with memory half-life tracking, Knowledge Graph interactive visualization, Heat Map (GitHub-style), Radar Chart competencies, Daily Mix (Spotify-style), Slash Commands (/explain, /example, /quiz, /skip, /review, /hint), warm-up puzzles, Socratic teaching method, stateful AI callbacks, emotional AI reactions, fake live ticker, toast notifications, TikTok-style review shorts, shape recognition in canvas widget

---

## [2026-07-29] — Interview & Initial Spec

### Added
- `edu-ai-prototype-spec.md` — Complete product specification created from 3 rounds of user interview covering: navigation (sidebar fixed), gamification (XP, streaks, badges, ranking, coins, shop), question types (6 types), visual style (minimalist modern, light+dark), AI tone (adaptive), progress tracking (by completed modules), custom subject flow (hybrid: suggestion cards + chat wizard), mock strategy (pre-written responses)

---

## [2026-07-29] — Perchance API Viability Test (Pre-Project)

### Notes
- Investigated `eeemoon/perchance` Python library for AI text/image generation
- Library is broken since April 2026 (Perchance changed verification mechanism)
- Confirmed via GitHub issues #7, #8 — no maintainer response
- Cloud Shell environment verified: 15GB RAM, 9GB disk free, Python 3.12, Node 24
- Cleanup performed: removed perchance-mvp directory, Playwright cache, apt packages

## [2026-07-29] — Batch 4: Shared Components & Gamification Services

### Added
- **css/components.css** — Component library: buttons (5 variants, 3 sizes, icon variant), cards (interactive, elevated, accent/success/warning), inputs/textareas with focus/error states, badges (6 color variants + dot), chips with active state, tooltips, avatars (4 sizes), generic progress bar, empty states, icon buttons
- **css/gamification.css** — XP bar with shimmer animation and floating XP indicator, streak badge with fire flicker, coins display, level-up overlay with burst and text animations, badges grid (locked/unlocked), leaderboard table (top 3 colored), mascot container with glow effect, gamification-specific toast variants
- **js/components/theme-toggle.js** — Sun/moon toggle: reads theme from state, applies data-theme to document, persists to state, subscribes to external changes
- **js/components/toast.js** — Toast notification system: show(message, type, duration), auto-dismiss, manual dismiss, 8 types (success/error/info/warning/xp/badge/coins/level-up), injects fallback CSS styles inline
- **js/services/gamification.js** — Core gamification engine: XP curve (100 * 1.5^(n-1)), level calculation, title system (7 tiers from Newcomer to Grand Master), addXP with level-up detection, addCoins, daily streak checking (consecutive/broken/reset), activity heatmap recording, badge award system with automatic checks, floating XP animation
- **js/components/xp-bar.js** — Animated XP progress bar: renders level badge + title + fill bar, subscribes to user.xp and user.level state changes, smooth CSS transition on width
- **js/components/streak-badge.js** — Fire icon badge: shows streak count with fire animation, inactive state with sleep icon, subscribes to user.streak changes

## [2026-07-29] — Code Review Fixes (Batch 4)

### Fixed
- **css/components.css** — Added toast base styles and all variant styles (success, error, warning, xp, badge, coins, level-up, streak) — previously only variants were in gamification.css while base styles were injected inline by JS
- **js/components/toast.js** — Removed inline style injection (`document.head.appendChild(style)`). Toast styles now live solely in css/components.css
- **js/services/gamification.js** — Added `silent` option to `addXP(amount, source, {silent})` and `addCoins(amount, source, {silent})` to suppress toasts/animations. `checkStreak()` now defaults to silent=true at startup to avoid showing XP toasts before user interaction. Also fixed date comparison to use local time (`toLocaleDateString('en-CA')`) instead of UTC (`toISOString`) to prevent timezone-related streak misfires. `addXP` now automatically calls `recordActivity()` so callers don't need to remember to call both.

## [2026-07-29] — Batch 5: Sidebar, Dashboard & Catalog

### Added
- **js/components/sidebar.js** — Full sidebar: brand header, 4 nav links with active state tracking via routechange event, live activity ticker (NPC events every 8-15s, max 5 visible), user block with avatar/name/level/title, XP bar mount, streak badge mount, coins display, theme toggle mount, View Profile link. Subscribes to user.coins, user.level, user.name for live updates. Ticker cleanup via stopTicker()
- **css/pages/dashboard.css** — 12-column CSS grid dashboard: greeting card with gradient, XP section, mascot container, daily mix list, subject progress cards, achievements badges grid, leaderboard table, coins card. Responsive: 2-col at 1024px, 1-col at 640px
- **js/pages/dashboard.js** — Dashboard page: time-based greeting (morning/afternoon/evening), streak encouragement, XP bar with level, mascot with stage evolution (4 stages based on level), daily mix (4 random subjects with new/review/SRS labels), subjects in progress (from state, filtered by activity), achievements grid (last 6 badges), weekly leaderboard (top 5 NPCs + user position), coins with shop link. Subject card clicks navigate to #/chat/:id
- **css/pages/catalog.css** — Catalog page: search bar with icon, difficulty filter chips, subject grid (auto-fill 260px min), subject cards (icon, title, difficulty badge color-coded, description, module count, hours, studying count, progress bar, SRS badge, continue/start button), custom subject dashed card, no-results empty state. Responsive at 768px
- **js/pages/catalog.js** — Catalog page: renders 8 subjects from Mock.Subjects, search input filters by name, difficulty chips filter (all/beginner/intermediate/advanced), subject cards show progress from state, custom subject card routes to #/triagem, no-results handling with dynamic message

### Fixed (Batch 5 review)
- **sidebar.js** — Fixed type annotation from NodeJS.Timeout to number (browser API). Fixed block div inside inline span for XPBar wrapper.
- **catalog.js** — Removed dead srsHTML variable (always empty string). Changed random studying count to deterministic hash-based count for consistent rendering across page visits.

## [2026-07-29] — Batch 6: Chat Engine, Widgets & Study Page

### Added
- **css/chat.css** — Chat interface: message bubbles (AI left-aligned, user right-aligned, system centered), persona-specific border colors (sage=indigo, spark=orange, quiz=green), persona name labels, input area with auto-resize textarea, slash command dropdown menu, responsive styling
- **css/widgets.css** — Question widget styles: widget container with header/prompt/body/actions/feedback sections, multiple-choice options with label/text/checkmark and selected/correct/wrong states with animations (correctPop, wrongShake), true-false toggle buttons, fill-blank inline inputs, drag-drop source/target zones with grab cursor, slider with custom thumb styling, canvas draw with tool/color selectors
- **js/components/typing-indicator.js** — Typing dots animation: renders 3 pulsing dots inside a chat message bubble with persona avatar, injects CSS keyframes on load
- **js/services/ai-service.js** — AI response service: selectPersona by context (explanation→sage, correct→spark, incorrect→sage), getResponse with placeholder replacement ({name}, {subject}, {module}, {streak}), helpers for getGreeting/getExplanation/getCorrectFeedback/getIncorrectFeedback/getModuleComplete/getWarmupIntro/getSlashResponse, fallback handling
- **js/widgets/widget-base.js** — Abstract WidgetBase class: constructor with questionData, abstract render/validate/getAnswer, mount into container with _attachListeners, showFeedback with correct/incorrect styling and explanation/socratic hint, disable after answer, onAnswer callback registration with _notifyAnswer
- **js/widgets/multiple-choice.js** — MultipleChoice extends WidgetBase: renders A/B/C/D options, click-to-select with visual highlight, confirm button (disabled until selection), validate against correct flag, visual feedback (green checkmark on correct, red X on wrong with shake), auto-awards XP (15 correct, 3 incorrect) via Gamification service
- **js/components/chat-engine.js** — Chat orchestrator: init with messages container + input + context, addAIMessage with typing indicator delay (800-1500ms random), addUserMessage, addSystemMessage, addWidget returns Promise resolving on answer, slash command detection (/explain, /example, /hint, /skip, /review, /quiz, /persona), basic markdown formatting (**bold**, `code`, newlines), auto-scroll, busy state tracking
- **js/pages/study.js** — Study page: renders chat shell with header (subject icon+name, module progress bar, back button), initializes ChatEngine, runs async lesson flow (greeting→explanation→loop{question→feedback}→module complete→XP+coins+badges), creates widget instances by question type (only multiple-choice implemented, others show placeholder), updates module state on completion (completed flag, question counts, currentModule advance)

### Fixed (Batch 6 review)
- **css/widgets.css** — Added Firefox slider thumb (`::-moz-range-thumb`) alongside webkit thumb for cross-browser support
- **js/mock/ai-responses.js** — Added slash command templates for `/skip`, `/review`, `/quiz`, `/persona` (previously returned fallback)
- **js/pages/study.js** — Wrapped `_startLesson()` in try/catch with user-facing error message and state cleanup on failure

## [2026-07-29] — Batch 7: App Bootstrapper & Complete Implementation

### Added
- **js/app.js** — Main bootstrapper: async state init → theme application → Modal.init → Sidebar render+init → 6 route registrations → Router.init → silent streak check → loading state removal → keyboard shortcuts (Ctrl+K search, Escape close modal) → first-run welcome toast
- **js/services/srs.js** — Spaced Repetition System: getNextReviewDate (ease-based intervals), getDueCards, recordReview, getStats (due/learning/mastered)
- **js/services/mastery-predictor.js** — Mastery prediction: predictModuleMastery (correct/total %), predictSubjectMastery (per-module breakdown), getRadarData (all subjects)
- **js/widgets/true-false.js** — True/False widget: clickable buttons, correct/wrong feedback, XP integration (10/2)
- **js/widgets/fill-blank.js** — Fill-in-the-blank: inline input with acceptable answers array, Enter key submit, XP (15/3)
- **js/widgets/drag-drop.js** — Drag & Drop ordering: HTML5 drag events, shuffle, touch support, XP (20/3)
- **js/widgets/slider.js** — Slider range: numeric input with tolerance-based validation, XP (10/2)
- **js/widgets/canvas-draw.js** — Canvas drawing: multi-color picker, touch support, clear button, XP (10)
- **js/components/modal.js** — Modal dialog: overlay click/Escape close, open/close API, onClose callback
- **js/components/confetti.js** — Canvas particle burst: 80 particles, gravity, rotation, fade, configurable duration
- **js/components/avatar.js** — Avatar renderer: user (with level ring) and NPC variants, 4 sizes
- **js/components/mascot.js** — Mascot with 4 evolution stages (Lv 1/6/16/30), glow effects
- **js/components/slash-commands.js** — Slash command menu: 7 commands, text filtering, click-to-insert
- **js/components/ghost-race.js** — Ghost race widget: NPC vs user progress bars, configurable speed
- **js/components/heat-map.js** — GitHub-style heatmap: 12-week grid, 5 intensity levels from activityHeatMap state
- **js/components/radar-chart.js** — SVG radar chart: mastery data visualization, grid circles, data polygon, icon labels
- **js/components/knowledge-graph.js** — SVG knowledge graph: circular node layout, edge arrows, completed node highlighting
- **js/components/daily-mix.js** — Daily mix generator: SRS due cards + in-progress + new subjects, configurable count
- **js/components/matrix-upload.js** — Matrix canvas animation: falling green characters, auto-stop, configurable duration
- **js/pages/profile.js** — Profile page: header with avatar/stats, XP bar, radar chart, heatmap, achievements, knowledge graph
- **js/pages/triagem.js** — Triage page: 5-step questionnaire (text + options), progress bar, AI loading simulation, completion screen
- **js/pages/review-shorts.js** — Review page: SRS due cards, stats (due/learning/mastered), warm-up puzzle with XP
- **css/pages/profile.css** — Profile grid layout, gradient header, responsive breakpoints
- **css/pages/triagem.css** — Triage form, option cards, progress bar, loading spinner, completion state
- **css/pages/review-shorts.css** — Stats row, review cards, warm-up puzzle options with correct/wrong states

### Changed
- **index.html** — Added css/pages/review-shorts.css to CSS load order

