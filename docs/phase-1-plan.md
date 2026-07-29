# Phase 1 Implementation Plan — EduAI Prototype

> MVP visual: design system, sidebar, routing, dashboard, catalog, basic chat, 1 question type, minimal gamification display.

---

## Dependency Graph

```
Batch 1 (Core)  ──────────────────────────────┐
  storage → state → router                     │
                                                │
Batch 2 (CSS)   ──────────────────────────────┤  (can run in parallel with Batch 1)
  variables → base → themes → layout →         │
  components → animations                      │
                                                │
Batch 3 (Mock Data) ──────────────────────────┤  (can run in parallel with Batches 1-2)
  subjects, questions, ai-responses             │
                                                ▼
Batch 4 (Components & Services) ◄──────────── Batches 1-3
  theme-toggle, toast, gamification,
  xp-bar, streak-badge, components.css,
  gamification.css

Batch 5 (Layout & Pages) ◄─────────────────── Batch 4
  sidebar, dashboard, catalog

Batch 6 (Chat & Widgets) ◄─────────────────── Batches 3-5
  chat.css, widgets.css, ai-service,
  typing-indicator, widget-base,
  multiple-choice, chat-engine, study page

Batch 7 (Assembly) ◄───────────────────────── All above
  app.js
```

---

## Batch 1: Core State & Routing (Foundation)

**Must be implemented first. Everything depends on these.**

### 1.1 `js/services/storage.js` (~20 LoC)
- Namespace: `EduAI.Services.Storage`
- Functions:
  - `save(key, data)` — JSON.stringify and store in localStorage
  - `load(key, defaultData)` — JSON.parse from localStorage, return default if missing
  - `remove(key)` — delete key from localStorage
  - `clear()` — clear all EduAI keys
- Error handling: wrap JSON.parse in try/catch, return default on failure

### 1.2 `js/state.js` (~80 LoC)
- Namespace: `EduAI.state`
- Core API:
  - `get(dotPath)` — traverse object by dot notation (`user.xp` → `state.user.xp`)
  - `set(dotPath, value)` — set value at path, trigger listeners, auto-save to Storage
  - `on(dotPath, callback)` — register listener for path changes
  - `off(dotPath, callback)` — unregister listener
  - `getAll()` — return full state object
  - `reset()` — reload from `data/state-default.json` and clear localStorage
- Initialization:
  - On load, try `Storage.load('eduai-state')`
  - If empty, fetch `data/state-default.json` via `fetch()` and merge
  - Deep merge default with saved (so new fields are added on updates)
- Listeners:
  - Store as `Map<string, Set<Function>>`
  - On `set()`, find all matching listeners (exact path + parent paths) and call them
  - Example: setting `user.xp` triggers listeners for both `user.xp` and `user`

### 1.3 `js/router.js` (~60 LoC)
- Namespace: `EduAI.Router`
- API:
  - `init()` — listen to `hashchange`, render initial route
  - `navigate(path)` — set `window.location.hash`
  - `register(pattern, pageName)` — register route pattern → page module name
  - `getCurrentRoute()` — parse current hash
- Route patterns:
  - `#/dashboard` → `EduAI.Pages.Dashboard`
  - `#/catalog` → `EduAI.Pages.Catalog`
  - `#/chat/:subjectId` → `EduAI.Pages.Study`
  - `#/review` → `EduAI.Pages.ReviewShorts`
  - `#/profile` → `EduAI.Pages.Profile`
- Route matching:
  - Convert patterns to regex: `#/chat/:subjectId` → `/^#\/chat\/([^/]+)$/`
  - Extract params and pass to `page.render(params)`
- Rendering:
  - Get `#page-container` element
  - Fade out current content (150ms)
  - Call `page.render(params)` which returns HTML string or mounts directly
  - Fade in new content (200ms)
  - Update sidebar active state via custom event

---

## Batch 2: Design System & CSS Foundation

**Can be done in parallel with Batch 1.**

### 2.1 `css/variables.css` (~60 LoC)
- `:root` block with all design tokens:
  - **Colors:** bg-primary, bg-secondary, bg-tertiary, text-primary, text-secondary, text-muted, accent, accent-hover, accent-light, success, warning, error, streak, xp, coin, mascot, graph-node, graph-mastered, graph-progress, graph-review, border
  - **Shadows:** sm, md, lg
  - **Border radius:** sm (6px), md (10px), lg (16px), full (9999px)
  - **Typography:** font-sans, font-mono, text-xs through text-4xl
  - **Spacing:** 4px base unit, scale (1=4px, 2=8px, 3=12px, 4=16px, 5=20px, 6=24px, 8=32px, 10=40px, 12=48px, 16=64px)
  - **Layout:** sidebar-width (240px), header-height (56px)
  - **Transitions:** fast (150ms), normal (200ms), slow (300ms)
  - **Z-index scale:** sidebar (100), modal (200), toast (300), confetti (400)

### 2.2 `css/base.css` (~50 LoC)
- CSS reset (box-sizing, margin, padding)
- Body: font-family, background, color, line-height
- Typography: h1-h6 scale, p, a, strong, em, code
- Utility classes: `.sr-only`, `.truncate`, `.flex`, `.grid`, `.hidden`
- Scrollbar styling (thin, themed)
- Selection color

### 2.3 `css/themes.css` (~40 LoC)
- `html[data-theme="dark"]` overrides:
  - All `--color-bg-*` variables
  - All `--color-text-*` variables
  - Adjusted shadows (more subtle on dark)
  - Border colors
- Transition on `html` for smooth theme switch: `transition: background-color 0.3s, color 0.3s`

### 2.4 `css/layout.css` (~50 LoC)
- `.app` — flex row, full viewport height
- `.sidebar` — fixed 240px width, flex column, full height, overflow-y auto
- `.main-content` — flex 1, overflow-y auto, padding
- `.page-container` — full width/height, position relative
- `.page-loading` — centered spinner
- Responsive: sidebar collapses to icon-only at < 1024px (optional for Phase 1)

### 2.5 `css/components.css` (~100 LoC)
- `.btn` — base button (padding, border-radius, font, cursor, transition)
- `.btn--primary`, `.btn--secondary`, `.btn--ghost`, `.btn--danger` — variants
- `.btn--sm`, `.btn--lg` — sizes
- `.card` — base card (bg, shadow, border-radius, padding)
- `.card__header`, `.card__body`, `.card__footer` — card sections
- `.input`, `.textarea` — form inputs
- `.badge` — small status badge
- `.chip` — filter/tag chip
- `.tooltip` — hover tooltip
- `.divider` — horizontal line
- `.avatar` — circular avatar container

### 2.6 `css/animations.css` (~50 LoC)
- `@keyframes fadeIn` — opacity 0 → 1
- `@keyframes fadeOut` — opacity 1 → 0
- `@keyframes slideUp` — translateY(10px) → 0
- `@keyframes floatUp` — translateY(0) → -30px + fade
- `@keyframes shake` — translateX oscillation (for wrong answers)
- `@keyframes pulse` — scale 1 → 1.05 → 1
- `@keyframes bounce` — elastic bounce
- `@keyframes glow` — box-shadow pulse
- `@keyframes spin` — rotate 360deg
- `.animate-fade-in`, `.animate-slide-up`, `.animate-shake`, `.animate-pulse` — utility classes

---

## Batch 3: Mock Data

**Can be done in parallel with Batches 1-2.**

### 3.1 `js/mock/subjects.js` (~100 LoC)
- Namespace: `EduAI.Mock.Subjects`
- Object with all 8 subjects matching `state-default.json` structure
- Each subject: `{ id, name, icon, description, difficulty, modules: [{ id, name }] }`
- Include module dependency graph for knowledge graph (future use)

### 3.2 `js/mock/questions.js` (~50 LoC)
- Namespace: `EduAI.Mock.Questions`
- Keyed by `subjectId:moduleId:questionIndex`
- Phase 1: only need 1 multiple-choice question for Math Module 0
- Structure: `{ id, type, subject, module, prompt, options: [{label, text, correct}], explanation, socraticHint }`

### 3.3 `js/mock/ai-responses.js` (~80 LoC)
- Namespace: `EduAI.Mock.AIResponses`
- Templates organized by:
  - `greeting[persona]` — welcome messages
  - `explanation[persona]` — teaching content
  - `correct[persona]` — celebration on correct answer
  - `incorrect[persona]` — Socratic hint on wrong answer
  - `moduleComplete[persona]` — congratulations
  - `warmup[puzzleType]` — warm-up puzzle prompts
- Placeholders: `{name}`, `{subject}`, `{module}`, `{persona}`
- Phase 1: implement `greeting` and `explanation` for Prof. Sage, `correct` and `incorrect` for Quiz Master

---

## Batch 4: Shared Components & Gamification Services

**Depends on Batches 1-3.**

### 4.1 `css/gamification.css` (~60 LoC)
- `.xp-bar` — container with background track
- `.xp-bar__fill` — animated fill with gradient (xp color)
- `.xp-bar__label` — text overlay showing "340/500 XP"
- `.xp-bar__level` — level badge next to bar
- `.streak-badge` — fire icon + number, orange color, pulse animation
- `.coins-display` — gold coin icon + amount
- `.level-up-overlay` — fullscreen celebration overlay

### 4.2 `js/components/theme-toggle.js` (~30 LoC)
- Namespace: `EduAI.Components.ThemeToggle`
- `render()` — returns HTML for sun/moon toggle button
- `init()` — attach click handler, read current theme from state, toggle `data-theme` on `<html>`, save to state

### 4.3 `js/components/toast.js` (~40 LoC)
- Namespace: `EduAI.Components.Toast`
- `show(message, type, duration)` — render toast in `#toast-container`
- Types: `success`, `error`, `info`, `warning` — different accent colors
- Auto-dismiss after `duration` (default 5000ms)
- Slide-in animation from bottom-right

### 4.4 `js/services/gamification.js` (~80 LoC)
- Namespace: `EduAI.Services.Gamification`
- `addXP(amount)` — add XP, check for level up, trigger toast
- `addCoins(amount)` — add coins
- `checkStreak()` — compare `lastActiveDate` with today, update streak
- `getLevel(xp)` — calculate level from XP using exponential curve
- `getXPForLevel(level)` — return XP threshold for given level
- `awardBadge(badgeId)` — add badge if not already earned, trigger toast
- XP curve: `level_n = floor(100 * 1.5^(n-1))` (100, 150, 225, 338, 507, ...)

### 4.5 `js/components/xp-bar.js` (~40 LoC)
- Namespace: `EduAI.Components.XPBar`
- `render()` — returns HTML for XP bar with current values
- `init()` — subscribe to `user.xp` state changes, update fill width and label
- Animated width transition via CSS

### 4.6 `js/components/streak-badge.js` (~30 LoC)
- Namespace: `EduAI.Components.StreakBadge`
- `render()` — returns HTML for streak fire icon + count
- `init()` — subscribe to `user.streak` state changes

---

## Batch 5: Layout, Sidebar & Main Pages

**Depends on Batches 1-4. Dashboard and Catalog can be implemented in parallel.**

### 5.1 `js/components/sidebar.js` (~100 LoC)
- Namespace: `EduAI.Components.Sidebar`
- `render()` — returns full sidebar HTML:
  - Logo/brand at top
  - Nav links (Dashboard, Catalog, Study, Profile) with icons
  - Active state based on current hash route
  - Fake Live Ticker placeholder (empty for Phase 1, wired later)
  - User block at bottom (avatar, name, level, coins)
  - Theme toggle
- `init()` — attach click handlers, listen for route changes to update active state
- Mounts `XPBar` and `StreakBadge` in the user block

### 5.2 `css/pages/dashboard.css` (~80 LoC)
- `.dashboard` — CSS Grid layout (2-3 columns)
- `.dashboard__greeting` — full-width greeting card
- `.dashboard__xp-card` — XP bar card
- `.dashboard__subjects` — horizontal scroll of subject cards
- `.dashboard__achievements` — recent badges grid
- `.dashboard__ranking` — leaderboard table
- `.dashboard__coins` — coin balance card
- Responsive: stack to 1 column on smaller screens

### 5.3 `js/pages/dashboard.js` (~120 LoC)
- Namespace: `EduAI.Pages.Dashboard`
- `render()` — builds dashboard HTML with these cards:
  1. **Greeting:** "Good morning, {name}! 🔥 {streak} day streak"
  2. **XP Card:** mounts `XPBar` component, shows level
  3. **Subjects in Progress:** horizontal cards from state, "Continue" button → `#/chat/{id}`
  4. **Recent Achievements:** last 3 badges (or "No badges yet" placeholder)
  5. **Ranking:** mock top 5 NPC leaderboard table
  6. **Coins:** balance display + "Visit Shop" link
- `init()` — after render, initialize sub-components (XPBar, etc.)

### 5.4 `css/pages/catalog.css` (~60 LoC)
- `.catalog` — CSS Grid (3-4 columns)
- `.catalog__search` — search bar at top
- `.subject-card` — card with icon, name, description, difficulty badge, progress bar
- `.subject-card--custom` — special "+" card with dashed border
- `.subject-card:hover` — elevation + scale

### 5.5 `js/pages/catalog.js` (~90 LoC)
- Namespace: `EduAI.Pages.Catalog`
- `render()` — builds catalog HTML:
  - Search input (filters cards by name, client-side)
  - Grid of 8 subject cards from `EduAI.Mock.Subjects`
  - "+ Create Custom Subject" card at end
  - Each card: icon, name, description, difficulty badge, "Start"/"Continue" button
- `init()` — attach search filter, card click handlers

---

## Batch 6: Chat Engine & Question Widgets

**The most complex batch. Depends on all previous batches.**

### 6.1 `css/chat.css` (~80 LoC)
- `.chat` — flex column, full height
- `.chat__header` — subject name, module info, back button
- `.chat__messages` — flex column, overflow-y auto, padding
- `.chat__message` — message bubble container
- `.chat__message--ai` — left-aligned, AI persona background
- `.chat__message--user` — right-aligned, accent color
- `.chat__message--system` — centered, muted
- `.chat__persona-icon` — avatar next to AI message
- `.chat__input-area` — bottom bar with text input + send button
- `.typing-indicator` — three dots animation

### 6.2 `css/widgets.css` (~70 LoC)
- `.widget` — container card for question widgets
- `.widget__prompt` — question text
- `.widget__options` — grid/flex of option buttons
- `.widget__option` — individual option (border, padding, cursor)
- `.widget__option--selected` — accent border
- `.widget__option--correct` — green background
- `.widget__option--wrong` — red background + shake
- `.widget__feedback` — explanation area below widget
- `.widget__confirm-btn` — confirm answer button

### 6.3 `js/services/ai-service.js` (~60 LoC)
- Namespace: `EduAI.Services.AI`
- `generateResponse(context, persona)` — select template from `Mock.AIResponses`, replace placeholders
- `getGreeting(persona, subject)` — greeting for lesson start
- `getExplanation(persona, subject, module)` — teaching content
- `getFeedback(persona, isCorrect, question)` — correct celebration or Socratic hint
- `getModuleComplete(persona, subject, module)` — completion message
- Persona selection: context-based (explanation → Sage, celebration → Spark, question → Quiz Master)

### 6.4 `js/components/typing-indicator.js` (~30 LoC)
- Namespace: `EduAI.Components.TypingIndicator`
- `render(persona)` — returns HTML with 3 animated dots + persona avatar
- CSS animation: dots wave (scale up/down in sequence)
- Optional: 5% chance of "typo" simulation (type wrong char, backspace, retype)

### 6.5 `js/widgets/widget-base.js` (~50 LoC)
- Namespace: `EduAI.Widgets.WidgetBase`
- Abstract base class:
  - `constructor(questionData)` — store question config
  - `render()` — abstract, returns HTML string
  - `mount(container)` — insert HTML, attach event listeners
  - `validate()` — abstract, check if answer is correct
  - `getAnswer()` — abstract, return user's answer
  - `showFeedback(isCorrect)` — show correct/wrong styling + explanation
  - `onAnswer(callback)` — register callback for when answer is submitted
  - `disable()` — disable all inputs after answering

### 6.6 `js/widgets/multiple-choice.js` (~70 LoC)
- Namespace: `EduAI.Widgets.MultipleChoice`
- Extends `WidgetBase`
- `render()` — card with prompt + option buttons (A, B, C, D)
- Event handling: click on option → highlight selected, enable confirm button
- `validate()` — compare selected with correct answer
- `showFeedback(isCorrect)`:
  - Correct: green highlight, checkmark, "+15 XP" float
  - Wrong: red highlight on selected, green on correct, shake animation, Socratic hint
- `disable()` — remove click handlers, dim options

### 6.7 `js/components/chat-engine.js` (~150 LoC)
- Namespace: `EduAI.Components.ChatEngine`
- Core chat orchestrator:
  - `init(container, subjectId)` — set up message array, clear container
  - `addMessage(content, type, persona)` — append message to array and DOM
    - `type`: `'text'`, `'widget'`, `'system'`
    - For text: render as AI/user bubble
    - For widget: mount widget instance inline
  - `addAIMessage(content, persona)` — show typing indicator → delay → replace with actual message
  - `addUserMessage(content)` — render user bubble
  - `addSystemMessage(content)` — centered muted text
  - `addWidget(widgetInstance)` — mount widget inline, listen for answer
  - `scrollToBottom()` — smooth scroll to latest message
  - `clear()` — empty all messages
- Typing indicator orchestration:
  1. Insert typing indicator into chat
  2. scrollToBottom()
  3. Wait 800-1500ms (random)
  4. Remove typing indicator
  5. Insert actual message
  6. scrollToBottom()

### 6.8 `js/pages/study.js` (~80 LoC)
- Namespace: `EduAI.Pages.Study`
- `render(params)` — `params.subjectId` from router
  - Get subject data from state/mock
  - Get current module
  - Render chat header (subject name, module, back button)
  - Initialize `ChatEngine`
  - Start lesson flow:
    1. AI greeting (Prof. Sage)
    2. AI explanation (1-2 messages)
    3. AI presents question (Quiz Master) → mounts MultipleChoice widget
    4. On answer: AI feedback (correct/incorrect persona)
    5. Module complete message (Coach Spark) + XP awarded
- `init()` — nothing extra needed, chat handles itself

---

## Batch 7: Final Assembly

**Must be last. Wires everything together.**

### 7.1 `js/app.js` (~50 LoC)
- Namespace: `EduAI.App`
- `init()` — called on `DOMContentLoaded`:
  1. Initialize `EduAI.state` (loads from localStorage or default JSON)
  2. Check and update streak via `Gamification.checkStreak()`
  3. Render sidebar into `#sidebar`
  4. Register all routes with Router:
     - `#/dashboard` → Dashboard
     - `#/catalog` → Catalog
     - `#/chat/:subjectId` → Study
     - `#/profile` → Profile (stub for Phase 1)
     - `#/review` → ReviewShorts (stub for Phase 1)
  5. Initialize Router
  6. If no hash, navigate to `#/dashboard`
- Boot sequence logged to console: `"EduAI v0.1.0 — Phase 1 MVP"`

---

## Implementation Order Summary

| Step | Files | Dependencies | Can Parallelize? |
|------|-------|-------------|-----------------|
| 1 | `storage.js`, `state.js`, `router.js` | None | Sequential |
| 2 | `variables.css`, `base.css`, `themes.css`, `layout.css`, `animations.css` | None | Yes, with Step 1 |
| 3 | `subjects.js`, `questions.js`, `ai-responses.js` | None | Yes, with Steps 1-2 |
| 4 | `components.css`, `gamification.css`, `theme-toggle.js`, `toast.js`, `gamification.js`, `xp-bar.js`, `streak-badge.js` | Steps 1-2 | Sequential within batch |
| 5 | `sidebar.js`, `dashboard.css`, `dashboard.js`, `catalog.css`, `catalog.js` | Steps 1-4 | Dashboard ∥ Catalog |
| 6 | `chat.css`, `widgets.css`, `ai-service.js`, `typing-indicator.js`, `widget-base.js`, `multiple-choice.js`, `chat-engine.js`, `study.js` | Steps 1-5 | Sequential within batch |
| 7 | `app.js` | All above | Last |

**Total files to implement: 30**
**Estimated total LoC: ~2,200**

---

## Validation Checklist

After implementing Phase 1, verify:
- [ ] Open `index.html` — no console errors
- [ ] Sidebar renders with all nav links
- [ ] Clicking Dashboard → shows greeting, XP bar, subjects
- [ ] Clicking Catalog → shows 8 subject cards + custom button
- [ ] Clicking a subject card → navigates to `#/chat/{id}`
- [ ] Chat shows AI greeting → explanation → question widget
- [ ] Selecting correct answer → green feedback, XP toast
- [ ] Selecting wrong answer → red feedback, Socratic hint
- [ ] Theme toggle switches light ↔ dark
- [ ] Refresh page → state persists from localStorage
- [ ] XP bar animates when XP is gained
- [ ] Streak badge shows in sidebar
