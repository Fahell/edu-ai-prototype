# Changelog

All notable changes to this project are documented here. This log is updated every development turn to keep all agents and contributors aligned on project status.

---

## [Unreleased]

- Phase 2 planning pending (see README.md for roadmap)

---

## [2026-07-29] — Phase 1 Complete: Full Prototype Implementation

### Summary

Phase 1 is **complete**. The prototype is a fully functional vanilla HTML/CSS/JS SPA with 45 JS files, 14 CSS files, ~10,900 lines of code, and zero external dependencies. All 7 implementation batches have been delivered, reviewed, and bug-fixed.

**Capabilities delivered:**
- SPA hash-based routing with 6 pages (Dashboard, Catalog, Study, Review, Profile, Triagem)
- Centralized observable state management with localStorage persistence
- 8 subjects with 30+ modules, 25+ questions across 6 widget types
- AI tutoring chat with 3 personas (Prof. Sage, Coach Spark, Quiz Master)
- Gamification: XP/levels (exponential curve), daily streaks, coins, badges
- SRS (Spaced Repetition System) for review scheduling
- Interactive widgets: Multiple Choice, True/False, Fill-in-the-blank, Drag & Drop, Slider, Canvas Draw
- Knowledge graph (SVG), radar chart (SVG), activity heatmap, mascot evolution
- Custom subject triage (5-step AI questionnaire)
- Live NPC ticker, ghost racing, slash commands, confetti, matrix upload animation
- Light/dark theme toggle
- Boot simulation test passing: all 45 scripts load, all 52 namespaces register, all 6 pages verified

### Bug Fixes (across all batches)

| File | Bug | Fix |
|------|-----|-----|
| `router.js` | `compilePattern` couldn't extract `:param` from routes | Regex didn't escape `:` (not a special char); fixed to match bare `:` |
| `questions.js` | math-0-1 prompt "15-9 is even" (true) but answer was false | Changed prompt to "15-9 is odd" |
| `warmup-puzzles.js` | math-02 confusing "triangles" prompt | Replaced with "What is 7 + 8?" |
| `toast.js` | Inline CSS duplicated in JS and gamification.css | Moved all styles to components.css, removed JS injection |
| `gamification.js` | `checkStreak()` fired toasts on startup | Added `silent` flag, default true at startup |
| `gamification.js` | `addXP()` didn't call `recordActivity()` | Wired automatically |
| `gamification.js` | Date used UTC (`toISOString`) | Changed to local time (`toLocaleDateString('en-CA')`) |
| `sidebar.js` | `NodeJS.Timeout` type annotation | Fixed to `number` (browser API) |
| `sidebar.js` | `<span>` wrapping `<div>` | Fixed to `<div>` wrapping `<div>` |
| `catalog.js` | `Math.random()` studying count | Made deterministic via ID hash |
| `catalog.js` | Dead `srsHTML` variable | Removed |
| `widgets.css` | No Firefox slider thumb | Added `::-moz-range-thumb` |
| `ai-responses.js` | Missing slash command templates | Added `/skip`, `/review`, `/quiz`, `/persona` |
| `study.js` | No try/catch in `_startLesson` | Added error handling with user-facing message |
| `heat-map.js` | UTC date vs local time mismatch | Fixed to `toLocaleDateString('en-CA')` |
| `ghost-race.js` | Race always finished in ~12s regardless of `duration` | Fixed with 200ms ticks and proportional increments |
| `widget-base.js` | Two trailing commas in class body caused SyntaxError | Removed commas (class ≠ object literal) |

### Batch Details

<details>
<summary><strong>Batch 1+2: CSS Design System & JS Core</strong> (8 files, ~1,700 LoC)</summary>

- `css/variables.css` — Design tokens (colors, typography, spacing, shadows, layout)
- `css/base.css` — CSS reset, global typography, 60+ utility classes
- `css/themes.css` — Dark mode via `data-theme="dark"`
- `css/layout.css` — App shell (sidebar 240px, main content, page transitions, modal, toast)
- `css/animations.css` — 20+ keyframes (fade, slide, shake, float, pulse, glow, typing, fire, mascot, level-up)
- `js/services/storage.js` — localStorage wrapper with prefix `eduai_`
- `js/state.js` — Centralized state with dot-path get/set, listeners, auto-persist, deep merge
- `js/router.js` — SPA router hash-based with pattern matching, param extraction, transitions
</details>

<details>
<summary><strong>Batch 3: Mock Data</strong> (6 files, ~1,300 LoC)</summary>

- `js/mock/subjects.js` — 8 subjects, 30+ knowledge graph edges, 8 custom suggestions
- `js/mock/questions.js` — 25+ questions across 8 subjects, 6 types
- `js/mock/ai-responses.js` — 3 personas × 10+ contexts with placeholders
- `js/mock/npcs.js` — 10 NPCs, ghost speed, ticker templates, leaderboard
- `js/mock/shop-items.js` — Themes, avatar/mascot accessories, titles
- `js/mock/warmup-puzzles.js` — 17 puzzles across 6 types
</details>

<details>
<summary><strong>Batch 4: Components & Gamification</strong> (7 files, ~1,600 LoC)</summary>

- `css/components.css` — Buttons (5 variants), cards, inputs, badges, chips, tooltips, avatars, toasts
- `css/gamification.css` — XP bar, streak, coins, level-up overlay, badges, leaderboard, mascot
- `js/components/theme-toggle.js` — Light/dark toggle with state persistence
- `js/components/toast.js` — Auto-dismiss notifications (8 types)
- `js/services/gamification.js` — XP curve (100×1.5ⁿ), streak, coins, badges, heatmap recording
- `js/components/xp-bar.js` — Animated XP progress bar
- `js/components/streak-badge.js` — Fire streak badge
</details>

<details>
<summary><strong>Batch 5: Sidebar, Dashboard & Catalog</strong> (5 files, ~1,280 LoC)</summary>

- `js/components/sidebar.js` — Nav, user block, XP bar, streak, theme toggle, live ticker
- `css/pages/dashboard.css` — 12-col CSS grid, greeting gradient, responsive
- `js/pages/dashboard.js` — Greeting, XP, mascot, daily mix, subjects, achievements, leaderboard
- `css/pages/catalog.css` — Search, filters, subject grid, custom card
- `js/pages/catalog.js` — 8 subjects, search, difficulty filters, custom subject flow
</details>

<details>
<summary><strong>Batch 6: Chat Engine, Widgets & Study Page</strong> (8 files, ~1,960 LoC)</summary>

- `css/chat.css` — Chat layout, persona colors, slash menu
- `css/widgets.css` — Widget container, MC options, true-false, fill-blank, drag-drop, slider, canvas
- `js/components/typing-indicator.js` — Animated typing dots
- `js/services/ai-service.js` — Response selection by persona/context, 7 helper methods
- `js/widgets/widget-base.js` — Abstract class: render/mount/validate/getAnswer/showFeedback
- `js/widgets/multiple-choice.js` — A/B/C/D options, XP integration
- `js/components/chat-engine.js` — Message orchestrator, slash commands, markdown
- `js/pages/study.js` — Chat shell, lesson flow (greeting→explanation→questions→complete)
</details>

<details>
<summary><strong>Batch 7: App Bootstrapper & Complete Implementation</strong> (27 files, ~3,000 LoC)</summary>

- `js/app.js` — Boot sequence: state→theme→Modal→Sidebar→6 routes→Router→streak→loading→shortcuts→first-run
- `js/services/srs.js` — Spaced Repetition: ease-based intervals, due cards, review recording
- `js/services/mastery-predictor.js` — Mastery: per-module %, subject breakdown, radar data
- 5 widgets: True/False, Fill-blank, Drag & Drop, Slider, Canvas Draw
- 11 components: Modal, Confetti, Avatar, Mascot, Slash Commands, Ghost Race, Heat Map, Radar Chart, Knowledge Graph, Daily Mix, Matrix Upload
- 3 pages: Profile (stats/radar/heatmap), Triage (5-step questionnaire), Review Shorts (SRS + puzzles)
- 3 CSS files: profile.css, triagem.css, review-shorts.css
</details>

---

## [2026-07-29] — Project Scaffold & Documentation

### Added
- Full project scaffold: 59 files across css/, js/, assets/, data/
- `README.md` — Project overview, features, getting started, structure, design system, phases
- `agents.md` — Agent guidelines: architecture, conventions, patterns, state API, load order
- `.gitignore`, Git initialized, GitHub repo at https://github.com/Fahell/edu-ai-prototype

## [2026-07-29] — Creative Research & Spec

### Added
- `docs/spec.md` — Complete product specification
- `docs/insights.md` — Creative research: Matrix Upload, Mascote, Knowledge Graph, Ghost Racing, SRS
- `docs/phase-1-plan.md` — 7-batch implementation plan with file-level specs
