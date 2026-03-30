# SportX · GiG Senior Frontend Challenge

A sports betting interface built with **React 19 + Vite**, following **Hexagonal Architecture** and **Domain-Driven Design** principles. The goal was not just to make it work, but to structure it in a way that a real team could maintain, extend, and test confidently.

---

## Getting started

**Requirements:** Node.js ≥ 18, Yarn (or npm).

```bash
# Install dependencies
yarn install

# Start dev server → http://localhost:5173
yarn dev

# Run unit tests (pure domain, no DOM required)
yarn test

# Production build
yarn build
```

---

## Architecture

The project is split into four explicit layers. Each layer has a single responsibility and strict import rules — outer layers depend on inner ones, never the reverse.

```
src/
├── domain/                        # Core business logic. Zero framework dependencies.
│   ├── bet-slip/
│   │   ├── bet-slip.service.js    # Toggle / remove selections (pure functions)
│   │   └── calculations.service.js # Total, potential gain, amount validation
│   ├── event/
│   │   ├── event.model.js         # JSDoc typedefs: Event, Choice
│   │   └── event.mapper.js        # Anti-corruption layer: raw API → domain model
│   ├── selection/
│   │   └── selection.model.js     # JSDoc typedef: Selection
│   └── shared/
│       └── date.utils.js          # Pure date formatting utility
│
├── application/                   # Orchestration. Knows domain, ignores React.
│   └── use-cases/
│       └── getEvents.js           # Transforms raw data source into domain Events
│
├── infrastructure/                # External data and adapters.
│   └── data/
│       └── events.data.js         # Static JSON data source (would be an API call in production)
│
├── ui/                            # React presentation layer. No business logic lives here.
│   ├── components/
│   │   ├── event-card/            # Single event card with toggleable choice buttons
│   │   ├── events-section/        # Events list with sport/category breadcrumb
│   │   └── bet-slip-section/      # Selections panel, stake input, totals, submit
│   ├── hooks/
│   │   ├── useEvents.js           # React adapter for the getEvents use case
│   │   └── useBetSlip.js          # All bet slip state: selections, amount, validation
│   ├── pages/
│   │   └── HomePage.jsx           # Composes events + bet slip into the page layout
│   └── styles/
│       └── global.css             # Design tokens (CSS variables) + base styles
│
└── __tests__/                     # Unit tests — pure Node, no jsdom needed
    ├── bet-slip.service.test.js
    ├── calculations.service.test.js
    ├── event.mapper.test.js
    └── date.utils.test.js
```

### Import rules

| Layer            | Can import from                     | Cannot import from              |
| ---------------- | ----------------------------------- | ------------------------------- |
| `domain`         | nothing external                    | application, infrastructure, ui |
| `application`    | domain                              | infrastructure, ui              |
| `infrastructure` | —                                   | domain, application, ui         |
| `ui`             | domain, application, infrastructure | —                               |

This means the domain is completely isolated. You can run, test, or reuse it with zero knowledge of React, Vite, or anything else in the stack.

---

## Features

### Mandatory (challenge requirements)

- [x] Events rendered from the provided JSON data via domain mapper
- [x] Choice buttons toggle on/off — selected state is visually highlighted
- [x] Clicking a selected choice removes it from the bet slip (toggle behaviour)
- [x] Multiple choices from the same event can coexist in the slip
- [x] Each bet slip entry has a remove button (`✕`) that works independently
- [x] Bet slip shows "No bets chosen" when empty
- [x] Proper date formatting — output example: `24 March · 20:45`
- [x] README with run instructions and time spent

### Bonus (non-mandatory desired features)

- [x] `+` / `−` stepper buttons to adjust the stake
- [x] Free-text stake input — the user can type any value directly
- [x] Input validation: minimum €1, maximum €10,000, must be numeric; error shown inline
- [x] Total and Potential Gain recalculate live as selections change or stake changes
- [x] Unit tests covering all domain services and the mapper (Vitest, 25+ cases)

---

## Key design decisions

### Hexagonal Architecture (Ports & Adapters)

The domain layer is the centre of the application. It contains all business rules and knows nothing about React, the DOM, or the data format. The UI and infrastructure are adapters that plug into it from the outside.

In practice this means: if tomorrow the data came from a REST API instead of a static file, only `infrastructure/data/events.data.js` would change. If the UI moved from React to Vue, only the `ui/` folder would change. The domain and application layers would remain untouched.

### The event mapper as an Anti-Corruption Layer

The raw JSON has an unstable shape — the `bet` field uses dynamic numeric keys (`{ "953125720": { ... } }`), and some events are missing a `label`. The mapper is the single place that absorbs this messiness and translates it into a clean, predictable domain `Event` object. Nothing outside `event.mapper.js` ever touches the raw API shape.

**Label derivation:** when an event has no `label` field, the mapper builds one from the available choices. It filters out neutral/draw actors (those with `actorId === 1`, a reserved id in this dataset) and joins the first two participant labels: `"Turquie / Pays-Bas"`. This produces a meaningful display name without relying on the API to always provide one.

### Domain services as pure functions

`bet-slip.service.js` and `calculations.service.js` are collections of pure functions — they receive state and return new state, with no side effects. This makes them trivially testable (no mocking, no setup) and completely independent of React. The hooks in the `ui/` layer call these functions and own the `useState` calls — the domain never does.

### `useBetSlip` — thin hook, rich domain

The hook manages React state but delegates every decision to the domain: toggling uses `toggleSelection()`, amounts go through `validateAmount()`, calculations use `calculateTotal()` and `calculatePotentialGain()`. The hook itself has no `if` branches about business rules — it is purely an orchestrator.

### JSDoc over TypeScript

The project uses `.js` files with JSDoc typedefs (`@typedef`, `@param`, `@returns`). This gives full type inference in VSCode and WebStorm without adding a TypeScript compiler, a `tsconfig.json`, or a build step. The tradeoff is that type errors are surfaced by the IDE rather than the compiler — acceptable for a project of this size, and trivially upgradeable to TypeScript by renaming files and removing the JSDoc syntax.

### BEM + CSS custom properties over CSS Modules

Components use co-located CSS files with BEM class names (`.event-card__choice--selected`) and a central design token system via CSS custom properties (`--color-green-500`, `--space-4`, etc.). This is intentionally simple: no build-time hashing, no CSS-in-JS runtime, readable class names in DevTools. For a larger app with more contributors, CSS Modules or a utility framework like Tailwind would be the natural next step.

### Accessibility

Basic but correct: choice buttons use `aria-pressed` to communicate selected state to screen readers, stake input has a proper `<label>` and `aria-describedby` pointing at the error message, the error paragraph uses `role="alert"` for live announcement, and the event date uses a semantic `<time>` element with a `dateTime` attribute.

---

## What would come next in a production context

- **Repository pattern** — `getEvents` currently imports the data directly. In production, an `EventRepository` interface (port) would be defined in the application layer, and the infrastructure layer would provide the concrete adapter (fetch, localStorage, WebSocket, etc.).
- **TypeScript** — straightforward migration: rename `.js` → `.ts`, replace JSDoc typedefs with `interface`/`type`, and the logic stays identical.
- **React Router** — add multi-page support (live events, event detail, my bets) without touching any domain code.
- **Integration / component tests** — the unit tests cover the domain thoroughly. The next layer would be component tests with React Testing Library for the hooks and key UI interactions.
- **Error boundaries + loading states** — the current data is synchronous. Wrapping `useEvents` in an async pattern with proper loading/error states would be the production upgrade.

---

## Time spent

| Task                                                                  | Time            |
| --------------------------------------------------------------------- | --------------- |
| Architecture review + planning                                        | 20 min          |
| Domain layer (models, services, mapper)                               | 35 min          |
| `useBetSlip` hook (validation, increment/decrement, controlled input) | 25 min          |
| UI components + CSS design system                                     | 60 min          |
| Label derivation from choices (mapper improvement)                    | 15 min          |
| Unit tests (4 files, 25+ cases)                                       | 30 min          |
| README                                                                | 15 min          |
| **Total**                                                             | **~3 h 20 min** |
