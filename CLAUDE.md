# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Session history lives in `HISTORY.md`** — what each past session changed and the reasoning behind the
conventions below. Read it when you need to know *why* something is the way it is. This file is the
current state of play.

## Project Overview

**React Jojo Dojo** — a React skill journal and training ground by Jonathan Llemit Jr., begun as a personal practice space and since opened up to anyone learning React or revising the fundamentals. It is a **multi-page tutorial site** (W3Schools-style): a public landing page at `/` with an "Enter Dojo" CTA that navigates to the dojo at `/dojo`, where each React lesson lives behind a sidebar navigation. Clicking a topic shows its description, sample code, and a live working component in a main content panel.

The **learning journal** is the primary goal — deploy-ability is secondary, and in practice it is settled: the site has been live on Vercel since the beginning (see the deploy note below).

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

**Do not commit. The learner makes every commit.** Stated directly on 2026-10-07, after the reviewer made two
unrequested commits in one session. Editing files is the job — `NOTES.md`, the roadmap boxes, `HISTORY.md`,
`CLAUDE.md`, lesson prose — but **staging, committing, amending and pushing are the learner's**, even when a
change is obviously finished and even when an instruction like "install it" seems to imply the follow-up.
Finish the work, leave it in the working tree, and say what changed. If a commit seems warranted, say so and
let him make it. Checking state with `git status` / `git log` / `git diff` is always fine; the line is at
*writing* history, not reading it.

**A topic is verified only when both halves are met** — working code the learner wrote or directed
(**demonstrated**), *and* a correct explanation in his own words or a non-guessable correct answer
(**explained**). A right multiple-choice answer alone is `quiz-passed`, not verified. The full standard, and
how to check knowledge, are under "Reviewer Responsibilities" below. That is the rule most likely to be
misread by a fresh session: **do not tick a box because a lesson file exists.**

**Current state, one line:** eleven lessons registered — ten verified, one awaiting its build task.

## Commands

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start the Vite dev server with HMR (`localhost:5173`; may shift to another port if 5173 is in use) |
| `npm run build` | Type-check (`tsc -b`) then build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project (`eslint .`) |
| `npm run check:prose` | Validate every lesson's `longDescription` — RichText safety rules *and* the voice limits. Run it after editing any description. |
| `npm run check:repo` | Verify the repo against what the docs claim — version in all three artefacts, registry/folder/marker counts, every sample↔demo parity number, and the doc-policy invariants. Run it at the start of a session and after any doc edit. |

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
│   │   ├── Sidebar.tsx         # Numbered topic list; burger dropdown below md, vertical sidebar above
│   │   └── TopNav.tsx          # Logo + "Dojo" link + GitHub external icon (tutorial shell only)
│   ├── sandbox/                # Scratch components for experiments — NOT lessons, NOT real pages
│   │   └── TestGreeting.tsx     # served at /test/:student/:name/:subjects from App.tsx
│   └── topics/
│       ├── TopicDetail.tsx      # Reads useParams, looks up registry, renders demo + lesson breadcrumb
│       └── RichText.tsx         # longDescription -> paragraphs, bullets, code, inline code, bold/italic
├── pages/
│   ├── HomePage.tsx            # Landing hero + About section (has its own small nav)
│   └── TopicIndex.tsx          # Default content at /dojo (numbered topic overview grid)
└── topics/
    ├── types.ts                # BeltRank + Topic interface (single source of truth types)
    ├── beltStyles.ts           # BeltRank -> Tailwind classes (beltBadgeClass / beltDotClass)
    ├── registry.ts             # topicRegistry[] + topicBySlug lookup map
    ├── jsx/
    │   ├── demo.tsx            # JsxDemo — JSX comment, {2 + 2}, {new Date()...}
    │   └── index.ts            # Exports jsxTopic registry entry
    ├── components-props/
    │   ├── demo.tsx            # PropsDemo + Drill — props down, events up
    │   └── index.ts            # Exports componentsPropsTopic registry entry
    ├── conditional-rendering/
    │   ├── demo.tsx            # ConditionalDemo + SummaryRow — named boolean + ternary
    │   └── index.ts            # Exports conditionalRenderingTopic registry entry
    ├── event-handling/
    │   ├── demo.tsx            # EventHandlingDemo + ExerciseRow — named handlers, references, arrow-wrapped arguments
    │   └── index.ts            # Exports eventHandlingTopic registry entry
    ├── lists-and-keys/
    │   ├── demo.tsx            # ListsKeysDemo + ExerciseRow — keyed by exercise.id
    │   └── index.ts            # Exports listsKeysTopic registry entry
    ├── use-effect/
    │   ├── demo.tsx            # UseEffectDemo — interval effect, dependency array and cleanup
    │   └── index.ts            # Exports useEffectTopic registry entry
    ├── forms/
    │   ├── demo.tsx            # FormsDemo — controlled inputs, typed submit handler
    │   └── index.ts            # Exports formsTopic registry entry
    ├── use-state/
    │   ├── demo.tsx            # CounterDemo — the live useState working component
    │   └── index.ts            # Exports useStateTopic registry entry
    ├── use-state-deep-dive/
    │   ├── demo.tsx            # UseStateDeepDiveDemo — object & array state, replace don't mutate
    │   └── index.ts            # Exports useStateDeepDiveTopic registry entry
    ├── use-ref/
    │   ├── demo.tsx            # UseRefDemo — DOM handles, and a ref tally that outlives a render
    │   └── index.ts            # Exports useRefTopic registry entry
    └── use-context-reducer/
        ├── demo.tsx            # UseContextReducerDemo — one reducer, three context-reading panels
        └── index.ts            # Exports useContextReducerTopic registry entry
```

**Key patterns to maintain:**

- **Styling**: Tailwind CSS v4 with `@theme` block in `src/index.css`. Custom design tokens (`--color-dojo-*`, `--font-display`) become real Tailwind utilities (e.g., `bg-dojo-bg`, `text-dojo-ember`). Match this approach when adding new custom tokens.
- **Responsive by default**: mobile-first, using Tailwind's `sm:` (640px) and `md:` (768px) breakpoints. The tutorial shell stacks below `md` and goes side-by-side from `md` up, using the *same* markup — never duplicate a nav for mobile. Below `md` the topic list is a **burger dropdown** (`Sidebar.tsx`): a button that expands the list in place, capped at `70vh` with its own scroll, closing when a link is tapped. It expands in place rather than floating, because the shell's `overflow-hidden` would clip an absolutely-positioned panel. Page padding goes `px-4 sm:px-6` and headings scale (`text-2xl md:text-3xl`). Check any new layout at ~375px wide before calling it done, and at wide widths where a capped column starts to look shrunken. The main panel is one full-width column: the lecture text and the sample code take the whole width (no `max-w-prose` cap), while the Live Demo keeps the width it was designed at — its panel is `w-fit`, so it does not stretch into a mostly-empty bordered box. A `2xl` two-column split was tried and reverted: the demo components are built at `max-w-md` / `max-w-lg`, and a narrower side column made their own controls wrap.
- **Belt colors live in exactly one place**: `src/topics/beltStyles.ts` exports `beltBadgeClass()` (bordered pill → border + text color) and `beltDotClass()` (filled circle → background color). The palette mapping is white/blue → `dojo-ember` (gold), black → `dojo-crimson` (red). Use these helpers instead of writing belt colors inline: a badge and a dot need *different* utilities, and giving a dot the badge classes renders an invisible dot (`text-*` colors text a dot does not have; `border-*` only sets a border color on an element with no border width).
- **The registry array is the reading order**: the sidebar rows, the index cards and the `Lesson NN of NN` breadcrumb all take their number from an item's position in `topicRegistry`, so the order the reader sees lives in exactly one place. Never hardcode a lesson number — reorder the array instead. Sidebar rows and the mobile burger show `topic.shortTitle` (compact, one or two words); the page `<h1>` and the index cards show the full `topic.title`.
- **Long descriptions are rendered by `RichText`**: `src/components/topics/RichText.tsx` turns `topic.longDescription` into real elements, so code references show as code instead of raw backticks. It builds plain React nodes and never uses `dangerouslySetInnerHTML`, so a description cannot inject markup. The markup is deliberately tiny — five rules:
  - `` `like this` `` → **inline code**, styled to match the Sample Code panel. Use it for identifiers, keywords and short expressions (`useState`, `className`, `{reps && <p>…</p>}`).
  - three backticks alone on a line → a fenced **code block**. Use this for anything that is a snippet or a usage example, rather than inline code.
  - `- ` at the start of a line → a bullet; a plain line following one continues that bullet, so long bullets can wrap in the source.
  - a blank line separates paragraphs.
  - `**like this**` → **bold**, and `*like this*` → *italic*, for the key terms in a sentence. Inline code is split out **first**, so an asterisk inside backticks stays literal — `setReps(reps * 2)` keeps its `*`. Bold is tried before italic, because `**` also opens a `*` run.
  - **Known limitation:** `*` is not Markdown-aware, so **two or more unmatched asterisks on one line get paired into italics** — `3 * 4 * 5` renders as `3 <em> 4 </em> 5`. A single unmatched `*` is safe (`reps * 2` is left alone). No current lesson contains the risky pattern, and a description that needs to show two bare asterisks should put them in backticks. Fixing it properly would mean a real Markdown tokenizer, which is more machinery than this document needs.
  Every description must therefore have **balanced backticks** — an unpaired one renders literally. `description` reaches the reader only as plain text in the topic grid (`TopicIndex.tsx`); the sidebar and the mobile burger show `shortTitle` instead. So keep `description` markup-free.
  - **History, because this bit twice:** emphasis was *added* on 2026-10-07 after a session wrote `**bold**` into a new lesson and saw literal asterisks on the page. The earlier fix had been to **ban emphasis in descriptions** — a previous session caught its own `**` the same way and added a sweep to police it. Banning it was the wrong call: it left a trap for every future lesson, and the trap duly fired. Adding the rule removed the workaround instead of enforcing it.
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
| 2 | `src/topics/<slug>/index.ts` | The registry entry: `slug`, `title`, `shortTitle`, `belt`, `description`, `longDescription`, `codeExample`, `component`. |
| 3 | `src/topics/registry.ts` | Import it and add it to `topicRegistry`. **This is the only wiring needed** — the sidebar link, the `/dojo/topic/<slug>` route and the index-grid card all follow from it. No route is ever written by hand. |
| 4 | `CLAUDE.md` | Add the folder to the "Key files" tree, and update "Current project state" (the lesson count). |
| 5 | `package.json` + `HomePage.tsx` | Bump the **version** by one topic step — see "Versioning" below — and match the badge in `HomePage.tsx`. |
| 6 | `NOTES.md` + `ROADMAP.md` | A numbered entry for the topic (reviewer's job), and the roadmap line's status. For a build-on task the entry also carries the **acceptance criteria** the learner will be measured against. |
| 7 | `README.md` + `HISTORY.md` | The lesson folder in the README structure, and a session entry in HISTORY explaining what changed and why. |

**Before step 6**, decide the lesson's *kind*, because it changes what steps 1 and 6 look like. There are
three, and the **build-on task is the default** — the learner's call, 2026-10-08:

- **Build-on task** — a correct lecture and a correct demo, and the learner's hands-on work is **a new
  component, or a new feature added to the demo**, that applies the topic. Nothing is planted, so there is no
  bug to design and no gate to clear. Assessed by reviewing *their* code against acceptance criteria agreed
  before they build, plus a few questions anchored in that code.
- **Fix-it exercise** — a deliberately broken demo, assessed by repair. Still the better shape when a topic
  turns on a mistake worth **diagnosing**. **Probe the candidate bug against `tsc` and `npm run lint` first**;
  if either rejects it, the exercise is impossible and it has to be one of the other two. Two lessons have
  been converted after the fact.
- **Explainer** — a correct demo and nothing more; the topic is closed by conversation alone. Kept for topics
  where the characteristic mistake cannot be shipped and a build task would add nothing — `event-handling`
  and `use-effect` are the two.

**The build-on task — the working agreement.** It became the default because most of what is left on the
roadmap has no plantable bug at all (the gates close that door), and because writing a component is closer to
the real work than repairing one. Four rules turn it into evidence rather than busywork:

1. **The acceptance criteria are written down before the learner starts**, in the `NOTES.md` entry for the
   topic. A criterion that appears afterwards is a moving goalpost, and the journal's oldest lesson — *name
   the expected values* — applies here exactly as it did to the fix-it exercises.
2. **The task must force the concept to be re-derived, not copied.** Putting the new consumer somewhere the
   demo does not already cover, or requiring an action the reducer does not yet handle, is the difference
   between an exercise and a paste.
3. **Both halves still apply.** Their code is the *demonstrated* half. The *explained* half is still their own
   words: two or three questions anchored in the code they wrote, or a prose explanation handed over with it.
   Reading intent out of code alone is not evidence — pattern-matching a demo can produce code that looks
   right for the wrong reason.
4. **A failed criterion is named, with the line.** The box stays open until it passes.

### Versioning — one step per topic

The learner's rule: **every new topic adds `0.01` to whatever the version currently is**.

```
new topic = current version + 0.01
```

The version is therefore a **running number, not a formula**. It is *not* computed from the topic count, and
the learner may also adjust it deliberately — a milestone, a deploy, a fresh start. What is fixed is the step:
one new lesson, one `+0.01`. At the time of writing the project is at **`0.13.0`** with eleven topics.

Three artefacts must move together whenever the version changes:

1. `"version"` in `package.json` — and the **two** `"version"` entries at the top of `package-lock.json`
   (the root one and the `packages[""]` one). Never hand-edit dependency versions in the lock.
2. The badge in `src/pages/HomePage.tsx`, which shows the short form: `v0.13`.
3. The version sentence in "Current project state" below.

*History note: this section used to claim the version was "derived from the topic count, so it is never
invented" — the reviewer's misreading, which made `0.09` the only legal value for eight topics and turned a
deliberate `0.10` into a contradiction. The rule is the running `+0.01` step above. The older story still
stands as the reason the three artefacts must stay in step: a hand-picked `v0.1.0` once shipped while
`package.json` said `0.0.0`, advertising a release that did not exist.*

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
- **Current parity**, re-verified by character-level diffing (not regex — see the note below) after stripping comments and blank lines: `components-props` matches at 46 of 46 code lines; `conditional-rendering` matches at **63 of 63**, and the demo strips to 64 lines because the removed JSX comment leaves one empty `{}` line, so compare against the demo with that line removed; `event-handling` matches at **105 of 105**; `lists-and-keys` matches at **62 of 62** with the same one-line `{}` residue (demo strips to 63); `use-effect` matches at **64 of 64**; `jsx` matches at 9 except that the sample omits the leading `export` keyword (accepted — a sample is illustrative, not something to paste); `use-state` is deliberately trimmed for readability, 38 code lines down to 11; `forms` matches at **53 of 53**; `use-state-deep-dive` matches at **114 of 114**; `use-ref` matches at **77 of 77**; `use-context-reducer` matches at **132 of 132**. **`NOTES.md` quotes the same snippets** — when a snippet changes, the notes' copy of it is part of the mirror and has drifted before.
- **Re-run that diff rather than eyeballing it** — and write the checker carefully. Two plausible one-liners both lie: starting the strip at "the first `import`" returns **zero lines** for `jsx/demo.tsx`, which has no import, producing a false EXACT MIRROR; and a stripper that only removes `//` lines counts JSDoc blocks as code, inflating every demo by 8–10 lines. The reliable form tracks block-comment state character by character. Both mistakes were made in one session before the numbers reconciled.
- **The reader is a stranger, not the learner.** Anything a visitor can see — every `longDescription`, the Sample Code panel, the Live Demo — must read as an ordinary tutorial page. **Never narrate the authoring process in reader-facing text.** No "this lesson shipped as a fix-it exercise", no "this is not a fix-it exercise because…", no "the two planted bugs were…", no "the demo and the sample are the same component", no "the exercise is fixed". A reader has no idea what any of that means, and it makes the page read like someone's homework file. The same goes for reasoning about `CLAUDE.md`, `NOTES.md` or a convention: those are for whoever maintains the repo, not for the person learning React.
  - **Where that material belongs instead:** the lesson's `demo.tsx` header may carry a marker plus a short *teaching* paragraph (the rule the demo illustrates); the *why* of how the lesson was authored, what was once broken, and which gate forced a design change belongs in `HISTORY.md`, `NOTES.md` or this file. If a description currently justifies a lesson's existence by an internal rule, that sentence is a defect, not documentation.
  - **Fixed 2026-10-07:** five reader-facing passages across `use-state-deep-dive`, `lists-and-keys`, `event-handling`, `forms` and `use-effect` carried this leak, and every `demo.tsx` header still narrated its fix-it history. All were rewritten to keep the *teaching* and drop the *process* — the descriptions now say what the code does, not how the lesson came to exist.
- **Write to a person, not to a compiler.** The learner's note, 2026-10-07, and it was right: the descriptions had drifted into "pure AI" prose — technically correct and hard to follow. The rules, which every `longDescription` must now follow:
  - **Open with a situation, not a definition.** "Imagine a search box that should be focused the moment the page opens" teaches; "`useRef` returns a single object with one property, `current`" is a dictionary entry with no reason to care attached.
  - **Second person, plain words.** Say "you" and "your component". Prefer "hand React a function" to "supply a callback".
  - **Never announce the explanation.** "Two jobs come out of it, and they are worth naming separately" and "the rule that keeps refs honest" are hollow — they promise insight instead of giving it. Delete the framing and state the thing.
  - **No hedges that blame the reader.** "a consequence worth expecting rather than debugging" implies they would have got it wrong.
  - **Keep every paragraph short.** A hard cap of **70 words**, and a bullet list counts as one block *per bullet*. The worst offender before this rewrite was a 146-word paragraph in `use-state-deep-dive`; `use-effect` had five over 60 and `use-ref` had four.
  - **Say what breaks, concretely.** "the clock counts two seconds per second" lands; "a leak compounds rather than appearing" does not.
  - **A measured trap:** Flesch reading ease rated `use-ref` the *easiest* of all ten lessons (81) while it was the hardest to read. Sentence-length scores are blind to abstraction — do not use one to check this. Run **`npm run check:prose`** instead (`scripts/check-prose.mjs`): it enforces the RichText safety rules and these voice limits together, and currently passes on all eleven with a longest block of 67 words.
  - Caveat kept from the entry above: this is about *reader-facing* text. `demo.tsx` headers, `NOTES.md`, `ROADMAP.md` and `HISTORY.md` are maintenance documents and may say exactly what they mean, in whatever register is clearest.

- **Exception — fix-it exercises.** While a lesson ships deliberately broken, its snippet teaches the *correct* pattern instead of mirroring the buggy demo. Swap it for the real mirror once the exercise is fixed. **No lesson is currently in that state** — `use-state-deep-dive` was the most recent one and became a real mirror when its exercise was fixed, measured at 114 of 114 lines after regeneration.

- **Fix-it exercises — the exception, not the default.** A lesson may be shipped deliberately broken to teach a concept. The rules: the marker says `Status: LD`; the file's header comment lists the **observed symptoms only** — never the bug locations or the fix — so the learner has to diagnose; every planted bug must still compile, keeping `tsc` and `npm run lint` green; the roadmap line is marked `IN PROGRESS`; and `NOTES.md` explains the concept-level rules, not the answers. When the learner reports it fixed, re-assess, verify `tsc`/lint, then flip the roadmap box and rewrite the notes entry as verified. Two hard-won rules: an exercise must **name its expected values** (otherwise a workaround is a reasonable answer), and its symptoms must be **simulated, never described from reading the code** (the first `conditional-rendering` header claimed the badge was missing from 1–5 reps, until a five-line simulation showed the real symptom is a gap at 0 reps with an overlap from 6). **Not every topic can be one:** if the mistake the lesson would teach is rejected by `tsc` or by an ESLint rule, no compiling version of it exists, so the lesson has to be an explainer instead. **Check a candidate bug against both gates *before* designing an exercise around it** — two lessons have now been converted after the fact. The rules responsible so far:
  - `react-hooks/set-state-in-render` and `tsc` (`void` not assignable to `MouseEventHandler`) kill the "called during render" wiring — `event-handling`. The rule's boundary was measured on 2026-10-08: it fires on an **unconditional** `setState` during render (*"Cannot call setState during render"*), but a **guarded** one — `if (count === 0) setCount(1)` — is accepted, because that is React's documented "adjust state during render". It does not fire on `dispatch` at all. So the wording is narrower than "every called-during-render wiring"; the event-handling conclusion holds because `onClick={handleReset()}` is unconditional and `tsc` rejects it regardless.
  - `react-hooks/set-state-in-effect` kills the derived-state family (`useEffect(() => setCount(prop), [prop])`), and `react-hooks/exhaustive-deps` kills every wrong dependency array — `use-effect`.
  - `react-hooks/immutability` kills every way of writing a property to a `useState` object — directly (`student.name = …`), through an alias (`const next = student; next.name = …`), through a nested field, inside a component-local function, and via `Object.assign(student, …)`. All five were probed. It does **not** reach array *methods*: `list.push(…)` and `list.sort(…)` both pass, so an array-mutation bug is plantable while an object-field mutation bug is not — `use-state-deep-dive`.
  - `react-hooks/refs` kills every way of reading a ref **during render** — in the component body, in JSX, or in a value derived from one — which is why the `useRef` hook has no fix-it shape at all. Thirteen candidates were probed, and the rule's boundary is exact: `ref.current` in the body or JSX is rejected, the identical expression in an effect or an event handler passes. Every `useRef` mistake with an *observable symptom* needs a ref value to reach the render, so all of them are rejected. `tsc` independently kills the surrounding family: a DOM ref on a function component (`TS2322`), an unguarded `ref.current` (`TS18047`), and a ref callback that returns a value (`TS2322`). What survives is either correct code or a mistake that is not about `useRef` — `use-ref`.
  - `react-hooks/immutability` **does not analyse a reducer's own `state` parameter.** Mutating the value `useContext()` returned (*"Modifying a value returned from 'useContext()' is not allowed"*) and mutating the state `useReducer()` returned, in the body or in a handler, are both rejected — but `state.count += 1; return state;` *inside a reducer* passes both gates, and so do `Object.assign(state, …)`, a nested-field write, and `state.items.push(…)`. The classic reducer-purity bug is therefore **plantable**, while the same mutation in the component is not. Measured 2026-10-08 with a 35-file probe harness — `use-context-reducer`.
  - What survives: cleanup mistakes (a missing `clearInterval` / `removeEventListener`), which is one mistake in two shapes — too thin for an exercise that needs diagnosis.

- **NOTES.md** (at repo root): the **reviewer-written** study record — the Knowledge Snapshot, a numbered entry per topic, and a traps cheat-sheet. **The learner does not write here.** Their hands-on work IS the exercise; this file is what they read between sessions. Notes are never a homework task, and "write your study note" must never be asked of them. The reviewer keeps this file current.

- **ROADMAP.md** (at repo root): a clean checklist of **React and TypeScript topics** to cover next — deliberately not a project-chore list. Boxes are marked by the **reviewer**, from the Knowledge Snapshot — not merely because a note was written or a lesson file exists. See "Reviewer Responsibilities" below.

- **Deploy note**: **the site is already live** at <https://jojo-dojo.vercel.app/> — connected since the first commit, so every push to `main` publishes automatically and there is no deploy work to schedule. `vercel.json` still matters, because it holds a catch-all **`rewrites`** entry to `index.html` so client-side URLs like `/dojo/topic/use-state` resolve on a hard refresh or a direct link. Do not remove it. It is deliberately a rewrite and not a redirect: rewrites are applied *after* Vercel checks the filesystem, so real files such as `/assets/*.js` are still served as themselves. A catch-all `redirects` entry is evaluated before that check and can answer a JavaScript request with `index.html`, which shows up in the browser as a blank page and `SyntaxError: Unexpected token '<'`.

## Reviewer Responsibilities (AI assistant)

Jonathan is learning React. The AI assistant acts as the **reviewer and assessor** for this journal, and owns three things the learner should not do for themselves:

1. **`NOTES.md` in full** — the Knowledge Snapshot (a dated, honest assessment of what is actually known), the numbered per-topic entries summarising each lesson, and the traps cheat-sheet. This is a reviewer-written document: the learner's hands-on code is the exercise, and their explanation comes out in conversation. Re-assess and update after each new lesson or review session.
2. **The `ROADMAP.md` checkboxes** — mark them from that snapshot. Never tick a box merely because a lesson file exists.
3. **The gap list.** This journal is only worth reading if the gaps are accurate. Do not soften a gap to be encouraging — state it plainly, then teach it.

### Evidence standard for ticking a box

A topic counts as verified only when **both** are true:

- **Demonstrated** — working code exists in this repo that the learner wrote or directed, and it exercises the concept. Inherited scaffold code does not count. Under a **build-on task** this is the component or feature the learner added themselves; the lesson's own demo is the *reference*, and however good it is, it is not their evidence.
- **Explained** — the learner explained it correctly in their own words, or answered correctly *and* the answer was not guessable from the wording of the options.

A correct multiple-choice answer on its own is **`quiz-passed`, not verified**: record it in the snapshot's "Quiz-passed" list and leave the box unticked. Watch for answers that reveal a misconception behind a plausible-sounding choice, and probe with a second question before recording a verdict.

If a box is ticked, both halves of the standard must be on the record. A tick that rests on code evidence alone is a contradiction — either ask the question that supplies the missing half, or untick the box.

### How to check knowledge

The interactive question tool renders one question at a time in the GUI and returns the answer immediately, so ask in small batches (2–3), give feedback on each before the next, and prefer questions about code the learner has actually written. A wall of questions at once is counter-productive and was explicitly rejected. Score only well-formed questions: if a question turns out ambiguous, say so and mark it void rather than counting it against the learner.

**Under a build-on task the questions come out of the learner's own new code, not out of the lesson.** Point at a line they wrote and ask why it is written that way — why the reducer returns a new object rather than changing the one it was handed, where the value their panel reads actually comes from. That is what makes the *explained* half cheap for them to give and hard to fake by copying the demo.

### Division of labour

The reviewer owns the written record: `NOTES.md` (snapshot, per-topic entries, traps cheat-sheet), the `ROADMAP.md` boxes, `HISTORY.md`, and mechanical plumbing such as renames, stale comments, factual errors and formatting. The learner's job is to **build** — write the lesson demos, do the exercises, and explain concepts in their own words when asked. Never assign note-writing as work; it was explicitly declined in favour of hands-on practice.

## Session Handoff — Current State & Next Objectives

Per-session history lives in **`HISTORY.md`**. This section is only the present: where the project
stands and what comes next.

### Current project state
- Landing page `/` works; "Enter Dojo" → `/dojo` navigates to the tutorial shell, and the About links scroll to the About section.
- **Version `0.13.0`** — a running number, advanced by `0.01` for each new topic and adjustable deliberately. See "Versioning" below. The badge in `HomePage.tsx` shows the short form `v0.13`.
- **Eleven lessons registered — ten verified, one in progress**: `jsx`, `components-props`, `useState`, `conditional-rendering`, `lists-and-keys`, `event-handling`, `use-effect`, `forms`, `use-state-deep-dive`, `useRef` and `use-context-reducer`. The eleventh is the first **build-on task**: the lecture and its demo are live at `/dojo/topic/use-context-reducer`, and the learner's own component is the outstanding half (acceptance criteria in entry 12 of `NOTES.md`). `use-state-deep-dive` was a fix-it exercise, fixed by the learner with both gates green and its sample now a true mirror. `useRef` became the tenth and took three passes to clear — the barrier was a real misconception, not a wording slip: it held that refs are *uninitialised* until an effect runs, when `useRef(1)` already holds `1` during the first render. Both are verified because the mechanism was explained in their own words. All eleven are added through the registry, with no new routes written.
- **The exercise model changed on 2026-10-08 — a build-on task is now the default.** `event-handling`, `use-effect` and `useRef` are explainers, because their characteristic mistakes cannot be shipped as compiling, lint-clean bugs; `use-context-reducer` is the first build-on task. Under a build-on task the learner writes a **new component or a new feature on the demo** as the hands-on half, measured against acceptance criteria agreed beforehand. The fix-it exercise is kept for topics that turn on a bug worth diagnosing. `use-state-deep-dive` *was* a fix-it exercise, but its *object*-state bug had to be dropped for the same reason (see the gate list under "Fix-it exercises"); its three array-shaped bugs are now fixed.
- **Layout is mobile-responsive**, confirmed by the learner at phone width: below `md` the topic list is a burger dropdown, and the nav/padding/headings scale down. The reviewer can now re-check this directly in the browser (see the browser-automation note below).
- A scratch routing playground lives at `/test/:student/:name/:subjects` (`components/sandbox/TestGreeting.tsx`), kept deliberately as a labelled demonstration of the `:param` ↔ `useParams()` name contract.
- The old single-page `App.tsx` is gone — replaced by the routes above. The 3 "technique cards" (Vite/Tailwind/Vercel) were dropped per your decision; the GitHub link survives in `TopNav`.
- **The AI reviewer owns the Knowledge Snapshot in `NOTES.md` and the `ROADMAP.md` boxes** (see "Reviewer Responsibilities" above). Learner knowledge as of the last assessment is summarised there.
- **The reviewer CAN now observe the UI (set up 2026-10-07).** The browser-automation path works: `bsk` 0.3.2 is installed at `~/.local/bin/bsk.exe` (SHA-256 verified against the vendor manifest), `bskPath` is pinned in the DSH profile's `cordis.patch.yml`, and the BrowserSkill extension is installed in Chrome. `browser_*` tools drive the learner's real browser. **Two host quirks to know:** (1) the daemon must be started with **`bsk daemon start` — WITHOUT `--foreground`**; foreground mode ties it to a terminal/supervisor, and every process the agent spawns belongs to a job object the host reaps, so it dies immediately; (2) **this machine's schannel is broken** — `curl` and PowerShell `Invoke-WebRequest` fail with `SEC_E_NO_CREDENTIALS` against any HTTPS host, while **Node's `fetch` works**, so downloads must go through Node. A sandboxed shell also cannot reach the daemon's named pipe (`Access is denied`, os error 5) — expected confinement, not a fault, and the plugin's own calls are unaffected.
- **First real UI verification, 2026-10-07.** `/dojo/topic/use-state-deep-dive` was driven in Chrome: "Log two reps" moved the counter 0 → 2 → 4, "Add technique" grew the list 2 → 3 and cleared the box, a row toggle flipped to "Drilled", and "Reset" returned the list to its original two. That closed the standing gap — before this, **every** demo was type-checked and reasoned about but never seen. Earlier notes claiming the reviewer cannot run `npm run dev` still hold *inside the sandbox*: Vite's config loader spawns a child process and `tsc -b` writes into `node_modules`, so both need an escalated one-shot or a normal terminal.

### Next session objectives (priority order)

The roadmap is **React and TypeScript topics only** (decided 2026-10-07) — infrastructure is not tracked
there, and three items were removed from it: **Vercel** (already live and auto-deploying), **social links**
(the GitHub link in `TopNav` is enough), and a **custom domain** (not happening). Do not re-add them.

Ordering note: `Forms` is now verified, so it no longer appears among the open lines. The real fetch (loading
+ error states) that `useEffect` deferred to Forms is still deferred — there is no server in this project, so a
fetch demo would have to fake its data. The remaining open lines, in priority order:

1. **`useContext` / `useReducer`** — lecture live at `/dojo/topic/use-context-reducer` as a **build-on task**, so the open half is the learner's own component rather than a lesson to write. Entry 12 of `NOTES.md` holds the task and the seven acceptance criteria; the box stays unticked until the code *and* the explanation are both on the record.
2. **Custom hooks** — extracting a repeated hook sequence into one place.
3. **`React.memo` / `useMemo` / `useCallback`** — and, more usefully, when *not* to reach for them.
4. **Portals** — rendering outside the parent DOM hierarchy.
5. **One left-over surface from the `useState` deep dive** — **lazy initialisers** (`useState(() => build())`) are written up in lesson 10's prose but have never been exercised, so they are the one part of that topic not on the "Solid" table. It needs a lesson of its own or a question in a future review, not a new claim.

Further out, and deliberately not scheduled: **Redux** and **Next.js**. Both are recorded in `ROADMAP.md`
under "Later — not now" so they are known to have been considered rather than forgotten.

*Closed line:* **`useRef`** — verified 2026-10-07. Lesson live at `/dojo/topic/use-ref`, both gates green, sample a true mirror at 77 of 77, and the hands-on half built (the Escape-to-close in `Sidebar.tsx`). It is an **explainer**, because thirteen probed candidates showed `react-hooks/refs` plus `tsc` reject every `useRef` mistake with an observable symptom (see the gate list under "Fix-it exercises"). The *explained* half took three passes and is the more interesting record: the learner held that refs are uninitialised until an effect runs, and what dislodged it was not a repeat of the correction but laying the answer against their own earlier wording — a box that holds nothing cannot be "one render behind". See entry 11.

*Closed line:* **`useState` deep dive** — verified 2026-10-07. The exercise at `/dojo/topic/use-state-deep-dive` was fixed by the learner, both gates are green, its Sample Code panel is a true mirror (114 of 114), and the snapshot mechanism was explained in their own words. That lesson also corrected a gap stated too broadly in the old notes: `lists-and-keys` already held an **array** of objects and `event-handling` / `use-effect` already called two setters in one handler.

### Backlog (not yet prioritised)
- "Featured Lessons" preview grid on the landing page, pulling from `topicRegistry`.
- Extract a shared `<Brand />` component — `HomePage.tsx` duplicates the logo markup from `TopNav.tsx`.
- Delete or actually use the unreferenced files in `src/assets/`.
- Add Vitest + Testing Library when you want component tests (no test framework yet).

## ESLint

Flat config (`eslint.config.js`) using `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh` (Vite-optimized rules). Ignore `dist/` and `.kilo/`.

**Why `.kilo/` is ignored:** that folder holds editor-agent git worktrees — complete copies of this project, each with its own `tsconfig.json`. Because `npm run lint` is `eslint .`, ESLint walked into the worktree, `typescript-eslint` saw two candidate `tsconfigRootDir` values, and it refused to parse **every** file in both trees: 44 parse errors with nothing wrong with the code. Adding the folder to `globalIgnores` is the fix. If a future tool drops another full checkout inside the repo, expect the same failure and ignore it the same way.
