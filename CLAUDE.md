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
/                       → HomePage        (landing hero + About + "Enter Dojo" CTA)
/dojo                   → TutorialLayout  (shared top nav + sidebar shell)
/dojo        (index)    → TopicIndex      (overview grid of all topics)
/dojo/topic/:slug       → TopicDetail     (description + code block + live demo)
```

`/dojo` is a nested layout route: it renders the shell once and swaps only the `<Outlet />`
content, which is what keeps the sidebar on screen while you move between lessons.

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
│   │   └── TopNav.tsx          # Logo + "Dojo" link + GitHub external icon (tutorial shell only)
│   └── topics/
│       └── TopicDetail.tsx      # Reads useParams, looks up registry, renders demo
├── pages/
│   ├── HomePage.tsx            # Landing hero + About section (has its own small nav)
│   └── TopicIndex.tsx          # Default content at /dojo (topic overview grid)
└── topics/
    ├── types.ts                # BeltRank + Topic interface (single source of truth types)
    ├── beltStyles.ts           # BeltRank -> Tailwind classes (beltBadgeClass / beltDotClass)
    ├── registry.ts             # topicRegistry[] + topicBySlug lookup map
    └── use-state/
        ├── demo.tsx            # CounterDemo — the live useState working component
        └── index.ts            # Exports useStateTopic registry entry
```

**Key patterns to maintain:**

- **Styling**: Tailwind CSS v4 with `@theme` block in `src/index.css`. Custom design tokens (`--color-dojo-*`, `--font-display`) become real Tailwind utilities (e.g., `bg-dojo-bg`, `text-dojo-ember`). Match this approach when adding new custom tokens.
- **Belt colors live in exactly one place**: `src/topics/beltStyles.ts` exports `beltBadgeClass()` (bordered pill → border + text color) and `beltDotClass()` (filled circle → background color). The palette mapping is white/blue → `dojo-ember` (gold), black → `dojo-crimson` (red). Use these helpers instead of writing belt colors inline: a badge and a dot need *different* utilities, and giving a dot the badge classes renders an invisible dot (`text-*` colors text a dot does not have; `border-*` only sets a border color on an element with no border width).
- **Topic registry is the source of truth**: `src/topics/registry.ts` powers both the sidebar navigation list and the topic content panel. New topics are added as a folder under `src/topics/<name>/` with `demo.tsx` (working component) and `index.ts` (registry entry). Register them in `registry.ts`.
- **Component structure**: `App.tsx` is now just `<Routes>` — all page content lives in `pages/` and `components/`. Do not put section markup back into `App.tsx`.
- **TypeScript**: Two separate configs (`tsconfig.app.json` for `src`, `tsconfig.node.json` for `vite.config.ts`). Shared settings: `verbatimModuleSyntax`, `moduleDetection: force`, `noEmit: true`, `erasableSyntaxOnly`. Note: `verbatimModuleSyntax` requires type-only imports to use the `type` keyword (e.g., `import type { Topic } from "../types"`). `tsconfig.app.json` has `noUnusedLocals: true` / `noUnusedParameters: true` — clean up dangling imports when refactoring.
- **Build tooling**: Vite 8 (built on rolldown) with `@vitejs/plugin-react` and `@tailwindcss/vite`. Vite 8 requires **Node 20.19+ or 22.12+**. The rolldown WASM native binding (`@rolldown/binding-wasm32-wasi`) is an optional dependency — if the build fails with "Cannot find native binding", reinstall with `npm install` (do not use `--omit=optional`). No SSR — `dist/` is a static SPA output.
- **Sandbox / AI-agent note**: both `tsc -b` and `vite build` need to *write* inside `node_modules` (`node_modules/.tmp/*.tsbuildinfo` and `node_modules/.vite-temp`). If `node_modules` is read-only in a sandbox, `npm run build` fails with `EPERM` / "Access to the path is denied" even when the code is perfectly fine. To type-check without the build cache, use `npx tsc -p tsconfig.app.json --noEmit`; run the real build from a normal terminal.
- **Docs to keep in sync**: four root files describe this project and they drift easily — `CLAUDE.md` (architecture, for AI assistants), `README.md` (public-facing: versions, install steps, structure), `NOTES.md` (per-topic study notes), `ROADMAP.md` (checklist). After changing a dependency version, a file path, or a route, update all four that mention it.

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

- **Deploy note**: `vercel.json` holds a catch-all **`rewrites`** entry to `index.html` so client-side URLs like `/dojo/topic/use-state` resolve after deployment. Do not remove it. It is deliberately a rewrite and not a redirect: rewrites are applied *after* Vercel checks the filesystem, so real files such as `/assets/*.js` are still served as themselves. A catch-all `redirects` entry is evaluated before that check and can answer a JavaScript request with `index.html`, which shows up in the browser as a blank page and `SyntaxError: Unexpected token '<'`.

## Session Handoff — What We Did & Next Objectives

### Review session — code & docs audit

1. **Fixed the invisible belt dots.** All three views called a local `beltColor()` helper that
   returned `text-*` / `border-*` classes, then used it on empty `<span>` dots, which need a
   *background* — so every lesson dot rendered with no color at all. (Only the "All Topics" dot
   was visible, because it had `bg-dojo-ember` hardcoded.) The mapping now lives in
   `src/topics/beltStyles.ts` as `beltBadgeClass()` + `beltDotClass()`, replacing three
   near-identical copies that had already drifted in their typing.
2. **Fixed the dead `#about` links.** The landing page's nav and hero both link to `#about`, but
   no element had `id="about"` once the old About section was dropped — the links scrolled
   nowhere. A short About section is back on `HomePage.tsx`.
3. **Removed a cast that lied to the type system.** `TopicDetail.tsx` had
   `useParams<{ slug: string }>() as { slug: string }`, which asserts the param always exists.
   It is now a plain `useParams()` plus a `slug ?` check, and `topicBySlug` is typed
   `Record<string, Topic | undefined>` so the "topic not found" branch is genuinely reachable
   as far as TypeScript is concerned.
4. **Readability**: the `codeExample` snippet is a template literal instead of `+`-joined
   strings, `use-state/index.ts` dropped a pointless `as BeltRank`, and `use-state/demo.tsx`
   now actually carries the topic-marker header that the convention section above describes.
5. **Deploy config**: `vercel.json` switched from a catch-all `redirects` entry to `rewrites`
   (see the Deploy note above for the reasoning). Worth confirming on the first preview deploy.
6. **Docs re-synced**: the README claimed React 18 (it is React 19), required Node 18 (Vite 8
   needs 20.19+ / 22.12+), advertised an `src/assets/` folder that does not exist, and still
   described the pre-router `App.tsx`. The README's own roadmap and `ROADMAP.md` also disagreed
   with each other. All four docs were re-checked against the code.
7. **Verified**: `npx tsc -p tsconfig.app.json --noEmit` and `npm run lint` both pass.

### Earlier session — routing migration

The repo was migrated from a **single-page landing app** (`App.tsx` = hero → techniques → training counter → about → footer, all in one file) into a **multi-page W3Schools-style tutorial site**:

1. **Installed `react-router-dom` v7** (v7.18.4, compatible with React 19.2). Fixed a gotcha: `--omit=optional`/`--no-optional` strips the rolldown WASM native binding (`@rolldown/binding-wasm32-wasi`) — Vite 8 needs it. Always reinstall with a plain `npm install`, never with `--omit=optional`.
2. **Created the tutorial shell**: `TutorialLayout.tsx` (nested layout route w/ `<Outlet />` so the sidebar persists), `Sidebar.tsx` (topic list, active highlight via `useMatch`), `TopNav.tsx` (logo + Dojo link + GitHub icon).
3. **Split pages off `App.tsx`**: `HomePage.tsx` (landing hero), `TopicIndex.tsx` (overview grid at `/dojo`), `TopicDetail.tsx` (lesson detail at `/dojo/topic/:slug` — description + code block + live `<Demo />`).
4. **Built the topic registry system**: `types.ts` (`BeltRank` + `Topic` interface), `registry.ts` (topic list + `bySlug` lookup), and the first lesson `use-state/` with `demo.tsx` (extracted `CounterDemo`) and `index.ts`.
5. **Updated entry point & routes**: `main.tsx` wraps `<BrowserRouter>`; `App.tsx` is now just `<Routes>`.
6. **Verified**: `tsc -b` passes, `vite build` succeeds, all three routes return 200 in dev with no runtime errors.
7. **Docs**: `CLAUDE.md` (arch guide), `NOTES.md` (study notes — layout fixed, ASCII-safe tables), `ROADMAP.md` (checklist), `vercel.json` (SPA deploy fallback).

### Current project state
- Landing page `/` works; "Enter Dojo" → `/dojo` navigates to the tutorial shell, and the About links now scroll to the About section.
- **One lesson populated**: `useState` at `/dojo/topic/use-state` (live counter demo working; belt dots now actually visible).
- The old single-page `App.tsx` is gone — replaced by the routes above. The 3 "technique cards" (Vite/Tailwind/Vercel) were dropped per your decision; the GitHub link survives in `TopNav`.
- **Runtime was not verified in this session**: `npm run dev` and `npm run build` both need to write inside `node_modules`, which the AI sandbox blocks. Type-checking and linting passed; please eyeball the pages yourself with `npm run dev`.

### Next session objectives (priority order)
1. **Add the next React lesson** to the registry — e.g., `jsx` or `components-props`: create `src/topics/<name>/demo.tsx` + `index.ts`, register in `registry.ts`, write the study note in `NOTES.md`, check it off in `ROADMAP.md`. Keep the marker comment header convention.
2. **Populate more topics** from ROADMAP.md (JSX, props, event handling, conditional rendering, lists & keys) so the sidebar isn't empty — each becomes a shareable `/dojo/topic/:slug` page for other devs.
3. **Improve the landing page** if desired — still minimal (hero + About + footer). A "Featured Lessons" preview grid pulling from `topicRegistry` is the natural next step, and would show visitors what the dojo actually contains.
4. **Consider unifying the two nav bars.** `HomePage.tsx` duplicates the logo/wordmark markup from `TopNav.tsx` because the landing nav links to `#about` while the tutorial nav links to `/dojo`. If they keep drifting, extract a `<Brand />` component used by both.
5. **Add `@types/testing-library__react`/Vitest** when you're ready to write component tests (currently no test framework).

## ESLint

Flat config (`eslint.config.js`) using `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh` (Vite-optimized rules). Ignore `dist/`.
