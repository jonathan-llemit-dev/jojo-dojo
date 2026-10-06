# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Session history lives in `HISTORY.md`** — what each past session changed and the reasoning behind the
conventions below. Read it when you need to know *why* something is the way it is. This file is the
current state of play.

## Project Overview

**React Jojo Dojo** — a personal React skill journal and training ground by Jonathan Llemit Jr. It is a **multi-page tutorial site** (W3Schools-style): a public landing page at `/` with an "Enter Dojo" CTA that navigates to the dojo at `/dojo`, where each React lesson lives behind a sidebar navigation. Clicking a topic shows its description, sample code, and a live working component in a main content panel.

The **learning journal** is the primary goal — deploy-ability is secondary. The site is Vercel-ready (see `vercel.json`).

## Orientation — read this first

Five files describe this repo, and a new session should know which answers what before reading any of them:

| File | Answers | Written by |
| ---- | ------- | ---------- |
| **`CLAUDE.md`** (this file) | How does the project work? What are the conventions? What state is it in, and what is next? | reviewer |
| **`NOTES.md`** | What does the learner actually *know*, with evidence? One numbered entry per topic, plus a traps cheat-sheet. | reviewer |
| **`ROADMAP.md`** | Which topics are verified, and which are still open? | reviewer |
| **`HISTORY.md`** | Why is a convention the way it is? A session log, newest first. | reviewer |
| **`README.md`** | The public-facing summary: versions, install steps, structure. | reviewer |

**The working arrangement, in one paragraph.** Jonathan is learning React; the AI assistant is the
**reviewer and assessor**, not merely a coder. His job is to **build** — write lesson demos, do exercises,
and explain concepts in his own words. The reviewer's job is the **written record**: `NOTES.md` in full, the
`ROADMAP.md` boxes, `HISTORY.md`, and mechanical plumbing (renames, stale comments, factual errors). **Never
assign note-writing as learner work** — it was explicitly declined in favour of hands-on practice, and
"write your study note" must never be asked of him. The learner's explanation comes out in **conversation**,
often as a short quiz.

**A topic is verified only when both halves are met** — working code the learner wrote or directed
(**demonstrated**), *and* a correct explanation in his own words or a non-guessable correct answer
(**explained**). A right multiple-choice answer alone is `quiz-passed`, not verified. The full standard, and
how to check knowledge, are under "Reviewer Responsibilities" below. That is the rule most likely to be
misread by a fresh session: **do not tick a box because a lesson file exists.**

**Current state, one line:** eight lessons registered and all eight verified.

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
│   │   ├── Sidebar.tsx         # Topic list; burger dropdown below md, vertical sidebar above
│   │   └── TopNav.tsx          # Logo + "Dojo" link + GitHub external icon (tutorial shell only)
│   ├── sandbox/                # Scratch components for experiments — NOT lessons, NOT real pages
│   │   └── TestGreeting.tsx     # served at /test/:student/:name/:subjects from App.tsx
│   └── topics/
│       ├── TopicDetail.tsx      # Reads useParams, looks up registry, renders demo
│       └── RichText.tsx         # longDescription -> paragraphs, bullets, inline + block code
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
    ├── event-handling/
    │   ├── demo.tsx            # EventHandlingDemo + ExerciseRow — named handlers, references, arrow-wrapped arguments
    │   └── index.ts            # Exports eventHandlingTopic registry entry
    ├── lists-and-keys/
    │   ├── demo.tsx            # ListsKeysDemo + ExerciseRow — keyed by exercise.id; fix-it exercise, fixed & verified
    │   └── index.ts            # Exports listsKeysTopic registry entry
    ├── use-effect/
    │   ├── demo.tsx            # UseEffectDemo — interval effect, dependency array and cleanup
    │   └── index.ts            # Exports useEffectTopic registry entry
    ├── forms/
    │   ├── demo.tsx            # FormsDemo — controlled inputs; fix-it exercise, fixed & verified
    │   └── index.ts            # Exports formsTopic registry entry
    └── use-state/
        ├── demo.tsx            # CounterDemo — the live useState working component
        └── index.ts            # Exports useStateTopic registry entry
```

**Key patterns to maintain:**

- **Styling**: Tailwind CSS v4 with `@theme` block in `src/index.css`. Custom design tokens (`--color-dojo-*`, `--font-display`) become real Tailwind utilities (e.g., `bg-dojo-bg`, `text-dojo-ember`). Match this approach when adding new custom tokens.
- **Responsive by default**: mobile-first, using Tailwind's `sm:` (640px) and `md:` (768px) breakpoints. The tutorial shell stacks below `md` and goes side-by-side from `md` up, using the *same* markup — never duplicate a nav for mobile. Below `md` the topic list is a **burger dropdown** (`Sidebar.tsx`): a button that expands the list in place, capped at `70vh` with its own scroll, closing when a link is tapped. It expands in place rather than floating, because the shell's `overflow-hidden` would clip an absolutely-positioned panel. Page padding goes `px-4 sm:px-6` and headings scale (`text-2xl md:text-3xl`). Check any new layout at ~375px wide before calling it done.
- **Belt colors live in exactly one place**: `src/topics/beltStyles.ts` exports `beltBadgeClass()` (bordered pill → border + text color) and `beltDotClass()` (filled circle → background color). The palette mapping is white/blue → `dojo-ember` (gold), black → `dojo-crimson` (red). Use these helpers instead of writing belt colors inline: a badge and a dot need *different* utilities, and giving a dot the badge classes renders an invisible dot (`text-*` colors text a dot does not have; `border-*` only sets a border color on an element with no border width).
- **Long descriptions are rendered by `RichText`**: `src/components/topics/RichText.tsx` turns `topic.longDescription` into real elements, so code references show as code instead of raw backticks. It builds plain React nodes and never uses `dangerouslySetInnerHTML`, so a description cannot inject markup. The markup is deliberately tiny — four rules:
  - `` `like this` `` → **inline code**, styled to match the Sample Code panel. Use it for identifiers, keywords and short expressions (`useState`, `className`, `{reps && <p>…</p>}`).
  - three backticks alone on a line → a fenced **code block**. Use this for anything that is a snippet or a usage example, rather than inline code.
  - `- ` at the start of a line → a bullet; a plain line following one continues that bullet, so long bullets can wrap in the source.
  - a blank line separates paragraphs.
  Every description must therefore have **balanced backticks** — an unpaired one renders literally. `description` reaches the reader only as plain text in the topic grid (`TopicIndex.tsx`); the sidebar and the mobile burger show `title` instead. So keep `description` markup-free.
- **Component structure**: `App.tsx` is now just `<Routes>` — all page content lives in `pages/` and `components/`. Do not put section markup back into `App.tsx`.
- **TypeScript**: Two separate configs (`tsconfig.app.json` for `src`, `tsconfig.node.json` for `vite.config.ts`). Shared settings: `verbatimModuleSyntax`, `moduleDetection: force`, `noEmit: true`, `erasableSyntaxOnly`. Note: `verbatimModuleSyntax` requires type-only imports to use the `type` keyword (e.g., `import type { Topic } from "../types"`). `tsconfig.app.json` has `noUnusedLocals: true` / `noUnusedParameters: true` — clean up dangling imports when refactoring.
- **Build tooling**: Vite 8 (built on rolldown) with `@vitejs/plugin-react` and `@tailwindcss/vite`. Vite 8 requires **Node 20.19+ or 22.12+**. Rolldown ships one native binary per platform as an *optional* dependency (here `@rolldown/binding-win32-x64-msvc`) — installing with `--omit=optional` strips it and the build then fails with "Cannot find native binding". Always use a plain `npm install`. No SSR — `dist/` is a static SPA output.
- **Sandbox / AI-agent note**: both `tsc -b` and `vite build` need to *write* inside `node_modules` (`node_modules/.tmp/*.tsbuildinfo` and `node_modules/.vite-temp`). If `node_modules` is read-only in a sandbox, `npm run build` fails with `EPERM` / "Access to the path is denied" even when the code is perfectly fine. To type-check without the build cache, use `npx tsc -p tsconfig.app.json --noEmit`; run the real build from a normal terminal.
- **Docs to keep in sync**: five root files describe this project and they drift easily — `CLAUDE.md` (this file: architecture, conventions, current state), `HISTORY.md` (session log: what changed and why), `README.md` (public-facing: versions, install steps, structure), `NOTES.md` (reviewer-written study record), `ROADMAP.md` (verified-progress checklist). After changing a dependency version, a file path, or a route, update every one that mentions it. **Add a new session's work to `HISTORY.md`, not here** — this file should stay a description of the present.

## React Lesson Tracking Convention

The journal convention keeps every topic traceable for review and for AI reading the repo:

### Adding a lesson — the checklist

Adding a lesson touches **seven places**. Miss one and the docs drift, which is the failure this project has
hit most often. Do them in this order:

| # | Where | What |
| - | ----- | ---- |
| 1 | `src/topics/<slug>/demo.tsx` | The live component, opening with the **topic marker** header. |
| 2 | `src/topics/<slug>/index.ts` | The registry entry: `slug`, `title`, `belt`, `description`, `longDescription`, `codeExample`, `component`. |
| 3 | `src/topics/registry.ts` | Import it and add it to `topicRegistry`. **This is the only wiring needed** — the sidebar link, the `/dojo/topic/<slug>` route and the index-grid card all follow from it. No route is ever written by hand. |
| 4 | `CLAUDE.md` | Add the folder to the "Key files" tree, and update "Current project state" (the lesson count). |
| 5 | `package.json` + `HomePage.tsx` | Bump the **version** by one topic step — see "Versioning" below — and match the badge in `HomePage.tsx`. |
| 6 | `NOTES.md` + `ROADMAP.md` | A numbered entry for the topic (reviewer's job), and the roadmap line's status. |
| 7 | `README.md` + `HISTORY.md` | The lesson folder in the README structure, and a session entry in HISTORY explaining what changed and why. |

**Before step 6**, decide the lesson's *kind*, because it changes what steps 1 and 6 look like:

- **Explainer** — a correct demo, assessed by quiz. Use when the characteristic mistake is rejected by the
  gates (see "Fix-it exercises" below), since no compiling version of the bug exists.
- **Fix-it exercise** — a deliberately broken demo, assessed by repair. **Probe the candidate bug against
  `tsc` and `npm run lint` first**; if either rejects it, the exercise is impossible and it must be an
  explainer instead. Two lessons have already been converted after the fact.

### Versioning — one step per topic

The version tracks **how many lessons the dojo holds**. The learner's rule:

```
initial page = 0.01        each new topic = +0.01
```

So with eight topics the version is **0.09** — the initial page plus eight steps. `package.json` is the
source of truth (`0.09.0`; the third digit stays `0`), and three things must move together whenever a topic
is added or the count changes:

1. `"version"` in `package.json` — and the **two** `"version"` entries at the top of `package-lock.json`
   (the root one and the `packages[""]` one). Never hand-edit dependency versions in the lock.
2. The badge in `src/pages/HomePage.tsx`, which shows the short form: `v0.09`.
3. The lesson count sentence in "Current project state" below.

*History note: the pre-convention target was a hand-picked `v0.1.0` that never shipped, while `package.json`
sat at `0.0.0` — which is why the HomePage badge once advertised a release that did not exist. The rule above
replaces that guesswork: the version is derived from the topic count, so it is never invented.*

### The conventions themselves

- **Topic marker comment**: each new topic's `demo.tsx` starts with a doc-style comment header:
  ```tsx
  // ─────────────────────────────────────────────
  // Topic: <React Concept> — <one-line description>
  // Added: 2026-10-01 | Status: OK / LD / RV
  // ─────────────────────────────────────────────
  ```
  (Statuses: `OK` = Mastered, `LD` = Learning, `RV` = Reviewing.)

- **Sample code mirrors the live demo**: a topic's `codeExample` in `index.ts` should reproduce that lesson's `demo.tsx` **line for line, in the same order, with every comment and blank line removed** — so the reader sees exactly the code that runs, and the two cannot drift apart. Two things to get right:
  - Write the template literal **flush against the left margin**. A template literal preserves indentation, so indenting it to match the surrounding code renders as ragged leading whitespace in the Sample Code panel.
  - **If the demo contains its own template literal, escape it.** A bare backtick would terminate the sample's template literal early and `${` would be interpolated, so write `` \` `` and `\${` in `index.ts`, and make the parity check unescape before comparing. `conditional-rendering` is the worked example.
- **The import line is not decoration — it follows from the hooks used.** `jsx` correctly has none: it calls no hook, and React 19 needs no `import React`, so adding one would teach the wrong thing. `use-state`, `components-props` and `conditional-rendering` all open with `import { useState } from "react";`. Verified: every snippet's imports match its demo's exactly.
- **Current parity**, re-verified by diffing each snippet against its demo after stripping comments and blank lines: `components-props` matches at 46 of 46 code lines; `conditional-rendering` matches at **63 of 63** (its backticks escaped — see above; the demo's stripped JSX comment leaves one extra empty `{}` line, so compare against the demo with that line removed); `event-handling` matches at **105 of 105**; `lists-and-keys` matches at **62 of 62** (same one-line `{}` residue); `use-effect` matches at **64 of 64**; `jsx` matches at 9 except that the sample omits the leading `export` keyword (accepted — a sample is illustrative, not something to paste); `use-state` is deliberately trimmed for readability, 38 code lines down to 11; `forms` matches at **53 of 53** (fixed — now a real mirror). **`NOTES.md` quotes the same snippets** — when a snippet changes, the notes' copy of it is part of the mirror and has drifted before.
- **Re-run that diff rather than eyeballing it.**
- **Exception — fix-it exercises.** While a lesson ships deliberately broken, its snippet teaches the *correct* pattern instead of mirroring the buggy demo. Swap it for the real mirror once the exercise is fixed. No lesson is currently in that state — `forms` was the most recent one and became a real mirror when its exercise was fixed.

- **Fix-it exercises**: a lesson may be shipped deliberately broken to teach a concept. The rules: the marker says `Status: LD`; the file's header comment lists the **observed symptoms only** — never the bug locations or the fix — so the learner has to diagnose; every planted bug must still compile, keeping `tsc` and `npm run lint` green; the roadmap line is marked `IN PROGRESS`; and `NOTES.md` explains the concept-level rules, not the answers. When the learner reports it fixed, re-assess, verify `tsc`/lint, then flip the roadmap box and rewrite the notes entry as verified. Two hard-won rules: an exercise must **name its expected values** (otherwise a workaround is a reasonable answer), and its symptoms must be **simulated, never described from reading the code** (the first `conditional-rendering` header claimed the badge was missing from 1–5 reps, until a five-line simulation showed the real symptom is a gap at 0 reps with an overlap from 6). **Not every topic can be one:** if the mistake the lesson would teach is rejected by `tsc` or by an ESLint rule, no compiling version of it exists, so the lesson has to be an explainer instead. **Check a candidate bug against both gates *before* designing an exercise around it** — two lessons have now been converted after the fact. The rules responsible so far:
  - `react-hooks/set-state-in-render` and `tsc` (`void` not assignable to `MouseEventHandler`) kill every "called during render" wiring — `event-handling`.
  - `react-hooks/set-state-in-effect` kills the derived-state family (`useEffect(() => setCount(prop), [prop])`), and `react-hooks/exhaustive-deps` kills every wrong dependency array — `use-effect`.
  - What survives: cleanup mistakes (a missing `clearInterval` / `removeEventListener`), which is one mistake in two shapes — too thin for an exercise that needs diagnosis.

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

If a box is ticked, both halves of the standard must be on the record. A tick that rests on code evidence alone is a contradiction — either ask the question that supplies the missing half, or untick the box.

### How to check knowledge

The interactive question tool renders one question at a time in the GUI and returns the answer immediately, so ask in small batches (2–3), give feedback on each before the next, and prefer questions about code the learner has actually written. A wall of questions at once is counter-productive and was explicitly rejected. Score only well-formed questions: if a question turns out ambiguous, say so and mark it void rather than counting it against the learner.

### Division of labour

The reviewer owns the written record: `NOTES.md` (snapshot, per-topic entries, traps cheat-sheet), the `ROADMAP.md` boxes, `HISTORY.md`, and mechanical plumbing such as renames, stale comments, factual errors and formatting. The learner's job is to **build** — write the lesson demos, do the exercises, and explain concepts in their own words when asked. Never assign note-writing as work; it was explicitly declined in favour of hands-on practice.

## Session Handoff — Current State & Next Objectives

Per-session history lives in **`HISTORY.md`**. This section is only the present: where the project
stands and what comes next.

### Current project state
- Landing page `/` works; "Enter Dojo" → `/dojo` navigates to the tutorial shell, and the About links scroll to the About section.
- **Version `0.09.0`**, derived from the topic count — `0.01` for the initial page plus one step per topic. It is not hand-picked; see "Versioning" below. The badge in `HomePage.tsx` shows the short form `v0.09`.
- **Eight lessons registered, all eight verified**: `jsx`, `components-props`, `useState`, `conditional-rendering`, `lists-and-keys`, `event-handling`, `use-effect` and `forms` — all added through the registry, with no new routes written. No `IN PROGRESS`, `quiz-passed` or `GAP` line remains among them.
- **Two lessons are lectures rather than fix-it exercises** — `event-handling` and `use-effect` — because their characteristic mistakes cannot be shipped as compiling, lint-clean bugs. Both were cleared by quiz, and both are recorded in the fix-it convention below, which now requires checking a candidate bug against both gates before designing an exercise around it.
- **Layout is mobile-responsive**, confirmed by the learner at phone width: below `md` the topic list is a burger dropdown, and the nav/padding/headings scale down. The reviewer cannot run `npm run dev`, so visual checks are the learner's to make.
- A scratch routing playground lives at `/test/:student/:name/:subjects` (`components/sandbox/TestGreeting.tsx`), kept deliberately as a labelled demonstration of the `:param` ↔ `useParams()` name contract.
- The old single-page `App.tsx` is gone — replaced by the routes above. The 3 "technique cards" (Vite/Tailwind/Vercel) were dropped per your decision; the GitHub link survives in `TopNav`.
- **The AI reviewer owns the Knowledge Snapshot in `NOTES.md` and the `ROADMAP.md` boxes** (see "Reviewer Responsibilities" above). Learner knowledge as of the last assessment is summarised there.
- **The reviewer cannot run `npm run dev` or `npm run build`**: both need to write inside `node_modules`, which the AI sandbox blocks. `npx tsc -p tsconfig.app.json --noEmit` and `npm run lint` both pass (re-verified this session — lint had been failing on an editor worktree under `.kilo`, now ignored), and the responsive layout has been confirmed visually by the learner — but each lesson demo is still only type-checked, never observed by the reviewer.

### Next session objectives (priority order)

Ordering note: `Forms` is now verified, so it no longer appears among the open lines. The real fetch (loading
+ error states) that `useEffect` deferred to Forms is still deferred — there is no server in this project, so a
fetch demo would have to fake its data. The remaining open lines, in priority order:

1. **`useState` deep dive** — object/array state, lazy initialisers, two setters in one handler. Still a `GAP`: every `useState` in the repo holds a primitive.
2. **`useRef`** — the next hook with an obvious use: `Sidebar.tsx` deliberately has no Escape-to-close, and the keydown listener it needs is a natural `useEffect` + `useRef` job.
3. **Deploy to Vercel** — the current version is `0.09.0` (see "Versioning" above; it moves one step per topic, so re-check it before deploying). Confirm the SPA rewrite handles deep links on a real refresh.

### Backlog (not yet prioritised)
- "Featured Lessons" preview grid on the landing page, pulling from `topicRegistry`.
- Extract a shared `<Brand />` component — `HomePage.tsx` duplicates the logo markup from `TopNav.tsx`.
- Delete or actually use the unreferenced files in `src/assets/`.
- Add Vitest + Testing Library when you want component tests (no test framework yet).

## ESLint

Flat config (`eslint.config.js`) using `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh` (Vite-optimized rules). Ignore `dist/` and `.kilo/`.

**Why `.kilo/` is ignored:** that folder holds editor-agent git worktrees — complete copies of this project, each with its own `tsconfig.json`. Because `npm run lint` is `eslint .`, ESLint walked into the worktree, `typescript-eslint` saw two candidate `tsconfigRootDir` values, and it refused to parse **every** file in both trees: 44 parse errors with nothing wrong with the code. Adding the folder to `globalIgnores` is the fix. If a future tool drops another full checkout inside the repo, expect the same failure and ignore it the same way.
