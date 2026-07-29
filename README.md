# EduAI — Educational AI Platform Prototype

A conceptual prototype of a gamified, AI-powered educational platform built with **vanilla HTML, CSS, and JavaScript** — no frameworks, no dependencies, no backend.

> This is a **visual prototype** designed to demonstrate the UX and interaction model. All AI responses, content, and data are mocked/simulated.

## What Is This?

EduAI is a platform where users can study **any subject** with an AI tutor that adapts to their goals, level, and learning style. The AI doesn't just teach — it quizzes, tracks progress, uses spaced repetition, and gamifies the entire learning experience.

### Key Features

- **Custom Subject Triaging** — Tell the AI what you want to learn; it interviews you to understand your goals, level, and available time, then generates a personalized study plan
- **3 AI Personas** — Prof. Sage (theory), Coach Spark (motivation), Quiz Master (assessments) — each with distinct personality and visual style
- **6 Interactive Question Widgets** — Multiple choice, true/false, fill-in-the-blanks, drag-and-drop, numerical slider, and canvas drawing with AI shape recognition
- **Socratic Teaching Method** — The AI guides you to discover answers through questions, not spoon-feeding
- **Spaced Repetition (SRS)** — Scientifically-timed review of past concepts before you forget them
- **Gamification Suite** — XP, levels, streaks, badges, coins, shop, mascot evolution, leaderboard
- **Ghost Racing** — Race against NPC progress bars during quizzes
- **Knowledge Graph** — Interactive visual map of how topics connect
- **Activity Heat Map** — GitHub-style calendar showing study consistency
- **Radar Chart** — Multi-axis competency visualization
- **Daily Study Mix** — Spotify-style curated daily lesson plan across subjects
- **Slash Commands** — `/explain`, `/example`, `/quiz`, `/skip`, `/review`, `/hint`
- **Matrix Upload Animation** — Canvas-based galaxy animation after subject triage
- **Evolution Mascot** — Tamagotchi-style brain that evolves as you learn

### AI Persona System

| Persona | Icon | Used For | Tone |
|---------|------|----------|------|
| Prof. Sage | 🧙 | Theory, explanations, deep concepts | Academic but accessible, uses analogies |
| Coach Spark | ⚡ | Motivation, celebrations, encouragement | Enthusiastic, supportive, energetic |
| Quiz Master | 🎯 | Questions, assessments, challenges | Direct, focused, challenging |

## Getting Started

This is a zero-dependency vanilla project. Simply open `index.html` in a browser:

```bash
# Option 1: Direct file open
open index.html

# Option 2: Local server (recommended for module support)
python3 -m http.server 8080
# Then visit http://localhost:8080

# Option 3: Using npx
npx serve .
```

## Project Structure

```
edu-ai-prototype/
├── index.html                  # Entry point, app shell
├── css/
│   ├── variables.css           # Design tokens (colors, spacing, typography)
│   ├── base.css                # Reset, global typography, utilities
│   ├── layout.css              # Sidebar, main grid, responsiveness
│   ├── components.css          # Buttons, cards, inputs, badges, modals
│   ├── chat.css                # Chat interface styles
│   ├── widgets.css             # Interactive question widgets
│   ├── gamification.css        # XP bar, streaks, badges, ranking, shop, mascot
│   ├── themes.css              # Light and dark theme overrides
│   ├── animations.css          # Global animations (confetti, shake, float, matrix)
│   └── pages/                  # Page-specific styles
├── js/
│   ├── app.js                  # Initialization, routing, global state
│   ├── router.js               # Hash-based SPA router
│   ├── state.js                # State management (userData, progress, etc.)
│   ├── mock/                   # Mock data
│   │   ├── ai-responses.js     # Pre-written AI responses by persona/context
│   │   ├── subjects.js         # Subject data + dependency graph
│   │   ├── questions.js        # Question bank by subject/type
│   │   ├── shop-items.js       # Shop items (themes, accessories, titles)
│   │   ├── npcs.js             # NPC data (ranking, ghost racing, ticker)
│   │   └── warmup-puzzles.js   # Warm-up puzzle templates
│   ├── services/               # Business logic
│   │   ├── ai-service.js       # AI simulation (persona, tone, callbacks)
│   │   ├── gamification.js     # XP, levels, streaks, coins, badges
│   │   ├── srs.js              # Spaced Repetition System
│   │   ├── mastery-predictor.js # "When will you master this?" predictions
│   │   └── storage.js          # localStorage wrapper
│   ├── components/             # Reusable UI components
│   │   ├── sidebar.js          # Fixed sidebar navigation + live ticker
│   │   ├── chat-engine.js      # Chat message rendering engine
│   │   ├── typing-indicator.js # Typing dots with occasional human-like typos
│   │   ├── mascot.js           # Evolution mascot (SVG with layers)
│   │   ├── knowledge-graph.js  # Interactive topic dependency graph
│   │   ├── heat-map.js         # GitHub-style activity calendar
│   │   ├── radar-chart.js      # Multi-axis competency radar
│   │   ├── matrix-upload.js    # Post-triage galaxy animation (Canvas 2D)
│   │   ├── ghost-race.js       # NPC progress bar race during quizzes
│   │   ├── slash-commands.js   # Slash command parser and handler
│   │   └── ...                 # toast, confetti, modal, daily-mix, etc.
│   ├── widgets/                # Interactive question widgets
│   │   ├── widget-base.js      # Base class for all widgets
│   │   ├── multiple-choice.js  # Multiple choice buttons
│   │   ├── true-false.js       # True/false toggle
│   │   ├── fill-blank.js       # Inline fill-in-the-blanks
│   │   ├── drag-drop.js        # Drag and drop with physics-based snapping
│   │   ├── slider.js           # Numerical slider input
│   │   └── canvas-draw.js      # Canvas with AI shape recognition
│   └── pages/                  # Page controllers
│       ├── dashboard.js        # Dashboard (mascot, graph, heatmap, daily mix)
│       ├── catalog.js          # Subject catalog
│       ├── study.js            # Study chat (main page)
│       ├── review-shorts.js    # TikTok-style flashcard review mode
│       ├── profile.js          # Student profile (radar, badges, history)
│       └── triagem.js          # Custom subject triage wizard
├── assets/
│   ├── icons/                  # SVG icons
│   └── avatars/                # Avatar and mascot SVG layers
└── data/
    └── state-default.json      # Default user state for reset
```

## Design System

- **Theme:** Minimalist modern with light and dark modes
- **Primary color:** Indigo (#6366F1)
- **Typography:** Inter (system fallback)
- **Spacing:** 4px base unit
- **Border radius:** 6px / 10px / 16px / 9999px
- **Shadows:** 3 elevation levels (sm, md, lg)

## Implementation Phases

| Phase | Status | Focus | Key Deliverables |
|-------|--------|-------|-----------------|
| **Phase 1** | ✅ **Complete** | Essential MVP | All 7 batches delivered: scaffold, design system, sidebar, routing, dashboard, catalog, chat with 6 widgets, full gamification, SRS, knowledge graph, radar chart, heatmap, triage, profile, review shorts |
| **Phase 2** | 🔲 Planned | Polish & Interactivity | Warm-up puzzle flow in chat, shop page, stateful AI callbacks, improved drag-drop physics, avatar/mascot customization, mobile optimization |
| **Phase 3** | 🔲 Planned | Real AI Integration | Replace mocks with real AI (LLM API), web content ingestion, vector DB per user, real-time content fetching, OCR for PDFs/videos |
| **Phase 4** | 🔲 Planned | Production | Backend, auth, multi-tenant, payment, deployment, analytics, accessibility audit |

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| No frameworks | Pure vanilla for zero overhead and maximum demo clarity |
| Hash-based SPA | Client-side routing without a server (`#/dashboard`, `#/chat`) |
| localStorage | Data survives page refresh without backend |
| Canvas 2D | Knowledge graph, heat map, radar chart, Matrix Upload — zero dependencies |
| SVG layers | Mascot evolution and shape recognition — scalable and animatable |
| CSS Custom Properties | Efficient light/dark theming, easy to extend |
| JS classes for widgets | Reusable, encapsulated, easy to add new types |

## Browser Support

Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+).

## License

MIT
