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
