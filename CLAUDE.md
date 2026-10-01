# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**React Jojo Dojo** — a personal React skill journal and training ground by Jonathan Llemit Jr. It is a **multi-page tutorial site** (W3Schools-style): a public landing page at `/` with an "Enter Dojo" CTA that navigates to the dojo at `/dojo`, where each React lesson lives behind a sidebar navigation. Clicking a topic shows its description, sample code, and a live working component in a main content panel.

The **learning journal** is the primary goal — deploy-ability is secondary. The site is Vercel-ready (see `vercel.json`).

## Commands

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start the Vite dev server with HMR (`localhost:5173`; may shift to another port if 5173 is in use) |
| `npm run build` | Type-check (`tsc -b`) then build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project (`eslint .`) |

No test framework is installed. There are no tests to run.

## Architecture

The app uses **React Router v7** with a nested layout route so the sidebar persists across all topic views:

```
/                       → HomePage           (landing hero + "Enter Dojo" CTA)
/doj                    → TutorialLayout    (shared top nav + sidebar shell)
   /                     → TopicIndex        (overview grid of all topics)
   /topic/:slug         → TopicDetail        (description + code block + live demo)
```

Key files:

```
src/
├── main.tsx                 # Entry — <BrowserRouter> wraps <App>
├── App.tsx                  # Root <Routes> orchestrator (no page content here)
├── index.css                # Tailwind @theme block — UNCHANGED, shared by all pages
├── components/
│   ├── layout/
│   │   ├── TutorialLayout.tsx  # <TopNav /> + <Sidebar /> + <Outlet />
│   │   ├── Sidebar.tsx         # Topic list from registry; active highlight via useMatch
│   │   └── TopNav.tsx          # Logo + "Dojo" link + GitHub external icon
│   └── topics/
│       └── TopicDetail.tsx      # Reads useParams, looks up registry, renders demo
├── pages/
│   ├── HomePage.tsx            # Landing hero (extracted from old App.tsx)
│   └── TopicIndex.tsx          # Default content at /dojo (topic overview grid)
└── topics/
    ├── types.ts                # BeltRank + Topic interface (single source of truth types)
    ├── registry.ts             # topicRegistry[] + bySlug lookup map
    └── use-state/
        ├── demo.tsx            # CounterDemo — the live useState working component
        └── index.ts            # Exports useStateTopic registry entry
```

**Key patterns to maintain:**

- **Styling**: Tailwind CSS v4 with `@theme` block in `src/index.css`. Custom design tokens (`--color-dojo-*`, `--font-display`) become real Tailwind utilities (e.g., `bg-dojo-bg`, `text-dojo-ember`). Match this approach when adding new custom tokens. Belt rank badges map to the palette: white/blue → `dojo-ember` (gold), black → `dojo-crimson` (red).
- **Topic registry is the source of truth**: `src/topics/registry.ts` powers both the sidebar navigation list and the topic content panel. New topics are added as a folder under `src/topics/<name>/` with `demo.tsx` (working component) and `index.ts` (registry entry). Register them in `registry.ts`.
- **Component structure**: `App.tsx` is now just `<Routes>` — all page content lives in `pages/` and `components/`. Do not put section markup back into `App.tsx`.
- **TypeScript**: Two separate configs (`tsconfig.app.json` for `src`, `tsconfig.node.json` for `vite.config.ts`). Shared settings: `verbatimModuleSyntax`, `moduleDetection: force`, `noEmit: true`, `erasableSyntaxOnly`. Note: `verbatimModuleSyntax` requires type-only imports to use the `type` keyword (e.g., `import type { Topic } from "../types"`). `tsconfig.app.json` has `noUnusedLocals: true` / `noUnusedParameters: true` — clean up dangling imports when refactoring.
- **Build tooling**: Vite 8 (built on rolldown) with `@vitejs/plugin-react` and `@tailwindcss/vite`. The rolldown WASM native binding (`@rolldown/binding-wasm32-wasi`) is an optional dependency — if the build fails with "Cannot find native binding", reinstall with `npm install` (do not use `--omit=optional`). No SSR — `dist/` is a static SPA output.

## React Lesson Tracking Convention

The journal convention keeps every topic traceable for review and for AI reading the repo:

- **Topic marker comment**: each new topic's `demo.tsx` starts with a doc-style comment header:
  ```tsx
  // ─────────────────────────────────────────────
  // Topic: <React Concept> — <one-line description>
  // Added: 2026-10-01 | Status: OK / LD / RV
  // ─────────────────────────────────────────────
  ```
  (Statuses: `OK` = Mastered, `LD` = Learning, `RV` = Reviewing.)

- **NOTES.md** (at repo root): per-topic **study notes**. Each entry has an explanation of the concept, the sample code you wrote, and a "Where Applied" reference pointing to the file + route in the app. This is the primary review document — read it first to see what's been covered.

- **ROADMAP.md** (at repo root): a clean checklist of React topics, components, and project features to cover next. Check off an item once its note is written in NOTES.md.

- **Deploy note**: `vercel.json` serves `index.html` on all routes (SPA fallback) so direct URLs like `/dojo/topic/use-state` work after deployment. Do not remove it.

## Session Handoff — What We Did & Next Objectives

### This session (what was accomplished)
The repo was migrated from a **single-page landing app** (`App.tsx` = hero → techniques → training counter → about → footer, all in one file) into a **multi-page W3Schools-style tutorial site**:

1. **Installed `react-router-dom` v7** (v7.18.4, compatible with React 19.2). Fixed a gotcha: `--omit=optional`/`--no-optional` strips the rolldown WASM native binding (`@rolldown/binding-wasm32-wasi`) — Vite 8 needs it. Always reinstall with a plain `npm install`, never with `--omit=optional`.
2. **Created the tutorial shell**: `TutorialLayout.tsx` (nested layout route w/ `<Outlet />` so the sidebar persists), `Sidebar.tsx` (topic list, active highlight via `useMatch`), `TopNav.tsx` (logo + Dojo link + GitHub icon).
3. **Split pages off `App.tsx`**: `HomePage.tsx` (landing hero), `TopicIndex.tsx` (overview grid at `/dojo`), `TopicDetail.tsx` (lesson detail at `/dojo/topic/:slug` — description + code block + live `<Demo />`).
4. **Built the topic registry system**: `types.ts` (`BeltRank` + `Topic` interface), `registry.ts` (topic list + `bySlug` lookup), and the first lesson `use-state/` with `demo.tsx` (extracted `CounterDemo`) and `index.ts`.
5. **Updated entry point & routes**: `main.tsx` wraps `<BrowserRouter>`; `App.tsx` is now just `<Routes>`.
6. **Verified**: `tsc -b` passes, `vite build` succeeds, all three routes return 200 in dev with no runtime errors.
7. **Docs**: `CLAUDE.md` (arch guide), `NOTES.md` (study notes — layout fixed, ASCII-safe tables), `ROADMAP.md` (checklist), `vercel.json` (SPA deploy fallback).

### Current project state
- Landing page `/` works; "Enter Dojo" → `/dojo` navigates to the tutorial shell.
- **One lesson populated**: `useState` at `/dojo/topic/use-state` (live counter demo working).
- The old single-page `App.tsx` is gone — replaced by the routes above. The 3 "technique cards" (Vite/Tailwind/Vercel) were dropped per your decision; the GitHub link survives in `TopNav`.

### Next session objectives (priority order)
1. **Add the next React lesson** to the registry — e.g., `jsx` or `components-props`: create `src/topics/<name>/demo.tsx` + `index.ts`, register in `registry.ts`, write the study note in `NOTES.md`, check it off in `ROADMAP.md`. Keep the marker comment header convention.
2. **Populate more topics** from ROADMAP.md (JSX, props, event handling, conditional rendering, lists & keys) so the sidebar isn't empty — each becomes a shareable `/dojo/topic/:slug` page for other devs.
3. **Improve the landing page** if desired — currently minimal (hero + About link). Could add a "Featured Lessons" preview grid pulling from `topicRegistry`.
4. **Add `@types/testing-library__react`/Vitest** when you're ready to write component tests (currently no test framework).

## ESLint

Flat config (`eslint.config.js`) using `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh` (Vite-optimized rules). Ignore `dist/`.
