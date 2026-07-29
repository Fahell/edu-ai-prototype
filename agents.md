# Agent Guidelines — EduAI Prototype

This file provides context and conventions for AI agents working on this project.

## Project Overview

EduAI is a **vanilla HTML/CSS/JavaScript prototype** of a gamified educational platform with AI tutoring. There are no frameworks, no build tools, no dependencies, and no backend. Everything is client-side with data persisted in `localStorage`.

## Architecture

- **SPA with hash routing** — `#/dashboard`, `#/catalog`, `#/chat`, `#/profile`, `#/review`
- **No modules/import** — All JS files are loaded via `<script>` tags in `index.html` order (dependencies first)
- **Global namespace** — Components and services register on a global `EduAI` namespace object
- **State-driven rendering** — Pages read from `EduAI.state` and re-render when state changes
- **Component pattern** — Each component exports a `render()` function that returns HTML string or mounts to a DOM element

## Code Conventions

### Language
- **All code, comments, documentation, and variable names must be in English**
- No Portuguese or any other language in source files

### CSS
- Use CSS Custom Properties defined in `variables.css`
- BEM-like naming: `.block__element--modifier`
- Page-specific styles in `css/pages/`
- Dark theme overrides in `themes.css` using `[data-theme="dark"]` selector
- Animations defined in `animations.css`, referenced by components

### JavaScript
- ES6+ syntax (classes, arrow functions, template literals, destructuring)
- No TypeScript, no JSX, no transpilation
- Each file defines one primary class or module on `window.EduAI`
- JSDoc comments for public methods
- Event-driven communication between components (custom events on `document`)
- All mock data in `js/mock/`
- All business logic in `js/services/`
- All UI components in `js/components/`
- All question widgets in `js/widgets/` (extend `WidgetBase`)
- All page controllers in `js/pages/`

### HTML
- Semantic HTML5 elements (`<nav>`, `<main>`, `<section>`, `<article>`)
- ARIA labels on interactive elements
- Single `index.html` with all script/CSS references

## Key Patterns

### Adding a New Page
1. Create `js/pages/your-page.js` with a `render()` function
2. Add CSS in `css/pages/your-page.css`
3. Register route in `js/router.js`
4. Add nav link in `js/components/sidebar.js`
5. Add `<script>` and `<link>` tags in `index.html`

### Adding a New Widget
1. Extend `EduAI.Widgets.WidgetBase` in `js/widgets/your-widget.js`
2. Implement `render()`, `validate()`, `getAnswer()`, `showFeedback()`
3. Add styles in `css/widgets.css`
4. Register in `js/mock/ai-responses.js` question type mapping

### Adding a New Component
1. Create `js/components/your-component.js`
2. Export on `EduAI.Components.YourComponent`
3. Add styles in `css/components.css` or a dedicated section
4. Initialize in `js/app.js` during boot

### State Management
- Read: `EduAI.state.get('user.xp')`
- Write: `EduAI.state.set('user.xp', 150)`
- Subscribe: `EduAI.state.on('user.xp', callback)`
- All state changes auto-persist to `localStorage`

## File Load Order in index.html

CSS files load in this order:
1. `variables.css` (tokens)
2. `base.css` (reset)
3. `themes.css` (theme overrides)
4. `layout.css` (grid)
5. `components.css` (UI elements)
6. `chat.css` (chat UI)
7. `widgets.css` (question widgets)
8. `gamification.css` (XP, badges, etc.)
9. `animations.css` (transitions)
10. `pages/*.css` (page-specific)

JS files load in this order:
1. `state.js` (must be first — other modules depend on it)
2. `router.js`
3. `storage.js`
4. `mock/*.js` (all mock data)
5. `services/*.js` (business logic)
6. `widgets/widget-base.js` then other widgets
7. `components/*.js` (UI components)
8. `pages/*.js` (page controllers)
9. `app.js` (must be last — initializes everything)

## Design Tokens

Refer to `css/variables.css` for the complete token set. Key values:
- Primary accent: `#6366F1` (indigo)
- Success: `#10B981` (green)
- Error: `#EF4444` (red)
- Warning: `#F59E0B` (amber)
- XP color: `#8B5CF6` (purple)
- Streak color: `#F97316` (orange)
- Coin color: `#EAB308` (gold)
- Font: Inter, system-ui, sans-serif

## Mock System

The AI is fully mocked. When adding new responses:
- Add templates to `js/mock/ai-responses.js` with persona + context keys
- Use placeholders: `{name}`, `{subject}`, `{module}`, `{persona}`
- The `ai-service.js` selects responses based on current state and persona
- Include Socratic variants for wrong answers (question-guiding, not answer-giving)
- Include stateful callbacks referencing past user actions from localStorage

## Testing

There is no test framework. Validate by:

### Manual Browser Testing
1. Serve files: `python3 -m http.server 8090` or `node serve.js`
2. Open `http://localhost:8090/` in a browser
3. Navigate all routes via sidebar (Dashboard, Subjects, Quick Review, Profile)
4. Complete a full lesson flow: pick a subject → greeting → explanation → 3 questions → module complete
5. Test light/dark theme toggle
6. Verify localStorage persistence across page refresh
7. Test slash commands in chat input (`/explain`, `/example`, `/hint`)
8. Check mascot evolution reacts to level changes
9. Verify responsive layout at different viewport widths

### Automated Boot Simulation (Node.js)
A headless simulation can verify all scripts load without errors:
```bash
node /tmp/eduai-test.js  # (script must be recreated if /tmp is cleared)
```
The simulation:
- Loads all 45 JS files in index.html order via Node.js VM context
- Sets `window` to equal the global scope (matching real browser behavior)
- Verifies all 52 expected namespaces register on `window.EduAI`
- Checks all 6 pages have `render()` and `init()` methods
- Reports pass/fail for each script and namespace

## Changelog Maintenance

**This is a mandatory rule for all agents working on this project.**

- `CHANGELOG.md` must be updated **every development turn** (i.e., every time code or docs are committed)
- Each entry should include: date, what was added/changed/fixed, which files were affected, and a brief description of the rationale
- Use the format: `## [YYYY-MM-DD] — Short Title` followed by `### Added`, `### Changed`, `### Fixed` sections as appropriate
- **When the changelog grows long**, summarize older entries into condensed blocks (e.g., group multiple small fixes under a single bullet) to maintain readability without losing historical context
- Keep the `[Unreleased]` section at the top for work-in-progress items
- The changelog serves as the **single source of truth** for any agent joining the project — it should be possible to understand the full project history by reading only this file
- Do not duplicate information that is already in `docs/spec.md` or `docs/phase-1-plan.md` — the changelog tracks *what happened*, not *what is planned*

## Constraints

- **Zero external dependencies** — No CDN libraries, no npm packages
- **No build step** — Files served as-is
- **English only** — All code, comments, docs, variable names
- **Desktop-first** — Should not break on smaller screens, but mobile optimization is not required
- **No backend** — Everything runs client-side
