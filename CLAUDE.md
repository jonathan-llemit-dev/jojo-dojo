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
│   ├── sandbox/                # Scratch components for experiments — NOT lessons, NOT real pages
│   │   └── TestGreeting.tsx     # served at /test/:student/:name/:subjects from App.tsx
│   └── topics/
│       └── TopicDetail.tsx      # Reads useParams, looks up registry, renders demo
├── pages/
│   ├── HomePage.tsx            # Landing hero + About section (has its own small nav)
│   └── TopicIndex.tsx          # Default content at /dojo (topic overview grid)
└── topics/
    ├── types.ts                # BeltRank + Topic interface (single source of truth types)
    ├── beltStyles.ts           # BeltRank -> Tailwind classes (beltBadgeClass / beltDotClass)
    ├── registry.ts             # topicRegistry[] + topicBySlug lookup map
    ├── jsx/
    │   ├── demo.tsx            # JsxDemo — JSX comment, {2 + 2}, {new Date()...}
    │   └── index.ts            # Exports jsxTopic registry entry
    ├── components-props/
    │   ├── demo.tsx            # PropsDemo + Drill — props down; began as a fix-it exercise
    │   └── index.ts            # Exports componentsPropsTopic registry entry
    ├── conditional-rendering/
    │   ├── demo.tsx            # ConditionalDemo + SummaryRow — named boolean + ternary; began as a fix-it exercise
    │   └── index.ts            # Exports conditionalRenderingTopic registry entry
    └── use-state/
        ├── demo.tsx            # CounterDemo — the live useState working component
        └── index.ts            # Exports useStateTopic registry entry
```

**Key patterns to maintain:**

- **Styling**: Tailwind CSS v4 with `@theme` block in `src/index.css`. Custom design tokens (`--color-dojo-*`, `--font-display`) become real Tailwind utilities (e.g., `bg-dojo-bg`, `text-dojo-ember`). Match this approach when adding new custom tokens.
- **Responsive by default**: mobile-first, using Tailwind's `sm:` (640px) and `md:` (768px) breakpoints. The tutorial shell stacks below `md` — the sidebar becomes a horizontally scrollable strip above the content (`w-full md:w-64 md:border-r`) — and switches to the side-by-side layout from `md` up. Both states use the *same* markup, so never duplicate a nav for mobile. Page padding goes `px-4 sm:px-6` and headings scale (`text-2xl md:text-3xl`). Check any new layout at ~375px wide before calling it done.
- **Belt colors live in exactly one place**: `src/topics/beltStyles.ts` exports `beltBadgeClass()` (bordered pill → border + text color) and `beltDotClass()` (filled circle → background color). The palette mapping is white/blue → `dojo-ember` (gold), black → `dojo-crimson` (red). Use these helpers instead of writing belt colors inline: a badge and a dot need *different* utilities, and giving a dot the badge classes renders an invisible dot (`text-*` colors text a dot does not have; `border-*` only sets a border color on an element with no border width).
- **Topic registry is the source of truth**: `src/topics/registry.ts` powers both the sidebar navigation list and the topic content panel. New topics are added as a folder under `src/topics/<name>/` with `demo.tsx` (working component) and `index.ts` (registry entry). Register them in `registry.ts`.
- **Component structure**: `App.tsx` is now just `<Routes>` — all page content lives in `pages/` and `components/`. Do not put section markup back into `App.tsx`.
- **TypeScript**: Two separate configs (`tsconfig.app.json` for `src`, `tsconfig.node.json` for `vite.config.ts`). Shared settings: `verbatimModuleSyntax`, `moduleDetection: force`, `noEmit: true`, `erasableSyntaxOnly`. Note: `verbatimModuleSyntax` requires type-only imports to use the `type` keyword (e.g., `import type { Topic } from "../types"`). `tsconfig.app.json` has `noUnusedLocals: true` / `noUnusedParameters: true` — clean up dangling imports when refactoring.
- **Build tooling**: Vite 8 (built on rolldown) with `@vitejs/plugin-react` and `@tailwindcss/vite`. Vite 8 requires **Node 20.19+ or 22.12+**. The rolldown WASM native binding (`@rolldown/binding-wasm32-wasi`) is an optional dependency — if the build fails with "Cannot find native binding", reinstall with `npm install` (do not use `--omit=optional`). No SSR — `dist/` is a static SPA output.
- **Sandbox / AI-agent note**: both `tsc -b` and `vite build` need to *write* inside `node_modules` (`node_modules/.tmp/*.tsbuildinfo` and `node_modules/.vite-temp`). If `node_modules` is read-only in a sandbox, `npm run build` fails with `EPERM` / "Access to the path is denied" even when the code is perfectly fine. To type-check without the build cache, use `npx tsc -p tsconfig.app.json --noEmit`; run the real build from a normal terminal.
- **Docs to keep in sync**: four root files describe this project and they drift easily — `CLAUDE.md` (architecture, for AI assistants), `README.md` (public-facing: versions, install steps, structure), `NOTES.md` (reviewer-written study record), `ROADMAP.md` (verified-progress checklist). After changing a dependency version, a file path, or a route, update all four that mention it.

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

- **Sample code mirrors the live demo**: a topic's `codeExample` in `index.ts` should be a copy of that lesson's `demo.tsx`, so what the reader sees is exactly what runs and the two cannot drift apart. Write the template literal **flush against the left margin** — a template literal preserves indentation, so indenting it to match the surrounding code renders as ragged leading whitespace in the Sample Code panel.
  - **The import line is not decoration — it follows from the hooks used.** `jsx` correctly has none: it calls no hook, and React 19 needs no `import React`, so adding one would teach the wrong thing. `use-state` and `components-props` both open with `import { useState } from "react";`. Verified: every snippet's imports match its demo's exactly.
  - Current parity, verified by diffing each snippet against its demo: `components-props` is byte-identical (46 lines); `conditional-rendering` is byte-identical (63 lines, escaped — see the next point); `jsx` matches except that the sample omits the leading `export` (accepted — a sample is illustrative, not something to paste); `use-state` is deliberately trimmed for readability (38 code lines down to 11).
  - **If the demo contains its own template literal, escape it.** A bare backtick would terminate the sample's template literal early and `${` would be interpolated, so write `\`` and `\${` in `index.ts`, and make the parity check unescape before comparing. `conditional-rendering` is the worked example.
  - Re-run that diff rather than eyeballing it.
  - **Exception — fix-it exercises.** While a lesson ships deliberately broken, its snippet teaches the *correct* pattern instead of mirroring the buggy demo. Swap it for the real mirror once the exercise is fixed. No lesson is currently in that state.

- **Fix-it exercises**: a lesson may be shipped deliberately broken to teach a concept. The rules: the marker says `Status: LD`; the file's header comment lists the **observed symptoms only** — never the bug locations or the fix — so the learner has to diagnose; every planted bug must still compile, keeping `tsc` and `npm run lint` green; the roadmap line is marked `IN PROGRESS`; and `NOTES.md` explains the concept-level rules, not the answers. When the learner reports it fixed, re-assess, verify `tsc`/lint, then flip the roadmap box and rewrite the notes entry as verified. An exercise must **name its expected values** — otherwise a workaround is a reasonable answer, as happened when bug 1 never said what the second drill should be called. And **simulate a planted bug's symptoms, never describe them from reading the code**: the `conditional-rendering` header first claimed the badge was missing from 1–5 reps, until a five-line simulation showed the guards happen to render correctly in that range and the real symptom is a gap at 0 reps with an overlap from 6.

- **NOTES.md** (at repo root): the **reviewer-written** study record — the Knowledge Snapshot, a numbered entry per topic, and a traps cheat-sheet. **The learner does not write here.** Their hands-on work IS the exercise; this file is what they read between sessions. Notes are never a homework task, and "write your study note" must never be asked of them. The reviewer keeps this file current.

- **ROADMAP.md** (at repo root): a clean checklist of React topics, components, and project features to cover next. Boxes are marked by the **reviewer**, from the Knowledge Snapshot — not merely because a note was written or a lesson file exists. See "Reviewer Responsibilities" below.

- **Deploy note**: `vercel.json` holds a catch-all **`rewrites`** entry to `index.html` so client-side URLs like `/dojo/topic/use-state` resolve after deployment. Do not remove it. It is deliberately a rewrite and not a redirect: rewrites are applied *after* Vercel checks the filesystem, so real files such as `/assets/*.js` are still served as themselves. A catch-all `redirects` entry is evaluated before that check and can answer a JavaScript request with `index.html`, which shows up in the browser as a blank page and `SyntaxError: Unexpected token '<'`.

## Reviewer Responsibilities (AI assistant)

Jonathan is learning React. The AI assistant acts as the **reviewer and assessor** for this journal, and owns three things the learner should not do for themselves:

1. **`NOTES.md` in full** — the Knowledge Snapshot (a dated, honest assessment of what is actually known), the numbered per-topic entries summarising each lesson, and the traps cheat-sheet. This is a reviewer-written document: the learner's hands-on code is the exercise, and their explanation comes out in conversation. Re-assess and update after each new lesson or review session.
2. **The `ROADMAP.md` checkboxes** — mark them from that snapshot. Never tick a box merely because a lesson file exists.
3. **The gap list.** This journal is only worth reading if the gaps are accurate. Do not soften a gap to be encouraging — state it plainly, then teach it.

### Evidence standard for ticking a box

A topic counts as verified only when **both** are true:

- **Demonstrated** — working code exists in this repo that the learner wrote or directed, and it exercises the concept. Inherited scaffold code does not count.
- **Explained** — the learner explained it correctly in their own words, or answered correctly *and* the answer was not guessable from the wording of the options.

A correct multiple-choice answer on its own is **`quiz-passed`, not verified**: record it in the snapshot's "Quiz-passed" list and leave the box unticked. Watch for answers that reveal a misconception behind a plausible-sounding choice, and probe with a second question before recording a verdict.

### How to check knowledge

The interactive question tool renders one question at a time in the GUI and returns the answer immediately, so ask in small batches (2–3), give feedback on each before the next, and prefer questions about code the learner has actually written. A wall of questions at once is counter-productive and was explicitly rejected. Score only well-formed questions: if a question turns out ambiguous, say so and mark it void rather than counting it against the learner.

### Division of labour

The reviewer owns the written record: `NOTES.md` (snapshot, per-topic entries, traps cheat-sheet), the `ROADMAP.md` boxes, and mechanical plumbing such as renames, stale comments, factual errors and formatting. The learner's job is to **build** — write the lesson demos, do the exercises, and explain concepts in their own words when asked. Never assign note-writing as work; it was explicitly declined in favour of hands-on practice.

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
   needs 20.19+ / 22.12+), and still described the pre-router `App.tsx`. The README's own roadmap
   and `ROADMAP.md` also disagreed with each other. All four docs were re-checked against the code.

   *Correction to this entry:* it originally also claimed the README advertised an `src/assets/`
   folder that does not exist. **That was wrong** — `src/assets/` does exist and holds three
   unreferenced scaffold files (`hero.png`, `react.svg`, `vite.svg`). The reviewer had globbed only
   `*.ts`/`*.tsx` and asserted the absence without verifying. The README structure has since been
   corrected to list the folder. Lesson for the reviewer: an absence claim needs its own check.

7. **Verified**: `npx tsc -p tsconfig.app.json --noEmit` and `npm run lint` both pass.

### Learner-knowledge review + documentation model

Following the routing exercises and a five-question assessment, the reviewer's role was formalised
(see "Reviewer Responsibilities" above) and `NOTES.md` was restructured around it:

- Added a **Knowledge Snapshot**: what is solid, what is `quiz-passed`, and the honest gap list.
- Marked `ROADMAP.md` from that snapshot — only `JSX` and `useState` newly ticked. Quiz-correct topics
  (lists & keys, event handlers, `useEffect`) deliberately stay unticked, because a correct
  multiple-choice answer is weak evidence.
- **Changed the notes model:** `NOTES.md` is reviewer-written. The learner declined note-writing in
  favour of hands-on practice, so the reviewer now authors the snapshot, the per-topic entries and the
  traps cheat-sheet. Added entries `02 — JSX`, `03 — Routing`, and the traps table.
- Confirmed the `TestGreeting` `:subjects` / `teacher` mismatch is **intentional** — it reproduces the
  common routing bug on purpose and is documented as such in the file, the notes and the tree above.

### Props lesson (fix-it exercise) + mobile responsive pass

1. **New lesson `components-props`** at `/dojo/topic/components-props` — a third registry entry, added with no new routes.
2. **Shipped deliberately broken, as a fix-it exercise.** Two bugs, both compiling: the parent omits an optional `label` prop (blank heading), and the child copies its `reps` prop into `useState`, so its number freezes at `0` while the parent's total climbs. The file header documents the **symptoms only**, never the locations, so the learner has to diagnose them. Confirmed `tsc` and `npm run lint` stay **green** — a fix-it exercise must still build.
3. **Mobile responsive pass.** The tutorial shell was unusable on a phone: the fixed `w-64` sidebar left roughly 120px of content on a 375px screen. It now stacks below `md` — the sidebar becomes a horizontally scrollable strip (`w-full md:w-64`) — and returns to side-by-side from `md` up, using the *same* markup with no duplicated nav. Also made the landing and top-nav links visible on small screens instead of `hidden sm:*`, tightened padding (`px-4 sm:px-6`), scaled headings down (`text-2xl md:text-3xl`, hero `text-4xl sm:text-5xl md:text-7xl`), and added `min-w-0` / `shrink-0` to card headers so long titles wrap rather than squashing the belt badge.
4. **Responsive layout verified visually by the learner** at phone width — the one thing the reviewer could not check, since the sandbox blocks `npm run dev`. Individual lesson demos are still only type-checked, never observed by the reviewer.
5. **Verified and closed out (attempt 2).** Bug 2 was solved **unaided** — the prop copied into `useState` was deleted and the prop rendered directly. Bug 1 needed a nudge: attempt 1 printed `N/A` for the missing prop, which hid the defect rather than fixing it, so the reviewer pointed at the *type* instead of the render. Making `label` required turned a silent runtime bug into a compile error and forced the second call site to pass a real label; the fallback was then dead code. Closed out: `ROADMAP.md` box ticked, `NOTES.md` entry 04 rewritten as verified with an explicit note on which bug was unaided vs guided, a traps-table row added for the `|| "N/A"` mask, and the stale "deliberately broken" header plus the now-wrong `?`-comment in `demo.tsx` rewritten so the lesson is recorded in the code itself. **Process lesson:** bug 1 never specified what the second drill should be called, which made a fallback a reasonable inference — an exercise must name its expected values.

### Conditional rendering lesson (second fix-it exercise)

1. **New lesson `conditional-rendering`** at `/dojo/topic/conditional-rendering` — a fourth registry entry, added with no new routes, targeting the one fundamental with a wrong answer on record (the falsy-value trap).
2. **Shipped deliberately broken, both bugs compiling.** A bare `0` printed by `{reps && <SummaryRow …/>}` — the trap itself — and two independent `&&` guards standing in for one ternary, which leave the badge blank at 0 reps and show **both** badges from 6 reps on. The header lists the symptoms *and* the expected behaviour, applying the process lesson from the props exercise: **name the expected values**, so a workaround cannot pass as a fix.
3. **The snippet deliberately did not mirror the demo while it shipped broken.** Because the demo was broken, `codeExample` taught the correct patterns — a ternary for either/or, and a *named* boolean (`const reachedMilestone = reps >= 10;`) so the left side of `&&` can never be a number — instead of displaying the bug. That exception is now written into the mirror rule. (Superseded once fixed — see item 7.)
4. **Reuses props on purpose**: the demo renders a `SummaryRow` child taking `label` and `value`, so the previous lesson's concept is reinforced rather than parked.
5. Verified `tsc` and `npm run lint` stay green with both bugs in place.
6. **Verified and closed out.** Both bugs fixed on the first attempt, after a framing hint, and the fix was better than the minimum: the condition was named once (`const isTraining = reps > 0;`) and then reused, so the badge collapsed to a single ternary and `&&` could never receive a number. Recorded as **guided** — the hint plus the named-boolean pattern being visible in the sample — so props bug 2 remains the only unaided fix on record. The learner also added a fatigue warning above 20 reps, which is beyond the exercise; every conditional it added keeps a real boolean on the left.
7. **Sample code swapped for a real mirror** — 63/63 lines against the repaired demo. It is the first sample needing **escaping**: the demo contains its own template literal, so `\`` and `\${` are escaped in `index.ts` and the parity check unescapes before comparing. That rule is now part of the mirror convention.
8. **Found and fixed a stale status line** in `NOTES.md` entry 04, which still read "exercise in progress, not yet verified" long after props was verified — the close-out had updated the evidence section but not the header. Worth checking the status line of any entry being closed out.

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
- Landing page `/` works; "Enter Dojo" → `/dojo` navigates to the tutorial shell, and the About links scroll to the About section.
- **Four lessons populated, all four verified**: `jsx`, `components-props`, `useState` and `conditional-rendering` — all added through the registry, with no new routes written.
- **Layout is mobile-responsive**, and now **confirmed by the learner at phone width**: the sidebar collapses to a swipeable strip below `md`, and the nav/padding/headings scale down. The reviewer cannot run `npm run dev`, so visual checks are the learner's to make.
- A scratch routing playground lives at `/test/:student/:name/:subjects` (`components/sandbox/TestGreeting.tsx`), kept deliberately as a labelled demonstration of the `:param` ↔ `useParams()` name contract.
- The old single-page `App.tsx` is gone — replaced by the routes above. The 3 "technique cards" (Vite/Tailwind/Vercel) were dropped per your decision; the GitHub link survives in `TopNav`.
- **The AI reviewer owns the Knowledge Snapshot in `NOTES.md` and the `ROADMAP.md` boxes** (see "Reviewer Responsibilities" above). Learner knowledge as of the last assessment is summarised there.
- **The reviewer cannot run `npm run dev` or `npm run build`**: both need to write inside `node_modules`, which the AI sandbox blocks. Type-checking and linting pass, and the responsive layout has been confirmed visually by the learner — but each lesson demo is still only type-checked, never observed by the reviewer.

### Next session objectives (priority order)
1. **Lists & keys** — a lesson that renders `.map()` with keys, converting a `quiz-passed` into demonstrated knowledge. The most natural next target: it is the only quiz-passed concept that a lesson already needs.
2. **Event handling** — a lesson to convert the other `quiz-passed` into demonstrated knowledge.
3. **`useEffect`** — real data fetching with a loading state and cleanup. The concept is understood; it has never been written.
4. **Forms & controlled inputs** — the natural companion to `useEffect`.
5. **Deploy v0.1.0 to Vercel** and confirm the SPA rewrite handles deep links on a real refresh.

### Backlog (not yet prioritised)
- "Featured Lessons" preview grid on the landing page, pulling from `topicRegistry`.
- Extract a shared `<Brand />` component — `HomePage.tsx` duplicates the logo markup from `TopNav.tsx`.
- Delete or actually use the unreferenced files in `src/assets/`.
- Add Vitest + Testing Library when you want component tests (no test framework yet).

## ESLint

Flat config (`eslint.config.js`) using `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh` (Vite-optimized rules). Ignore `dist/`.
