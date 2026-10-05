# History

A chronological log of work on this project — what each session changed, and more usefully *why* the
conventions ended up as they did. `CLAUDE.md` holds the current architecture, conventions and next
steps; this file answers "why is it like this?".

Newest first.

---

## Session log

### Lists & keys — fixed, explained, and verified

1. **The learner fixed it in one change**: `key={index}` became `key={exercise.id}` at the `.map()`. Nothing
   else in the component moved — no conditionals, no restructuring, no patching of the symptom — which is
   the point of the exercise.
2. **Verified by simulation, not by assertion.** The harness was re-run against the component's real Rotate
   logic (`[...current.slice(1), current[0]]`): tick Front kicks, rotate three times, and the tick is still
   on Front kicks. Before the fix the same harness put it on Knee strikes after one rotate. `tsc` and
   `npm run lint` green with the fix in place.
3. **The explanation half closed the exercise.** Asked what React does with the row when Rotate is pressed,
   the answer was the mechanism itself: *"React reuses the row component, and the tick lives inside that
   reused component."* That is the whole bug in one sentence — the key decides which instance is reused, so
   a key that names a position glues the row's state to the position while the data moves on. Both halves of
   the evidence standard are therefore on the record, and this is the **second unaided fix** in the journal
   (props bug 2 was the first).
4. **The box is ticked.** `ROADMAP.md` marked verified, `NOTES.md` entry 06 rewritten as `OK (Mastered)` with
   the learner's own wording quoted, the marker in `demo.tsx` flipped to `Status: OK (verified — fixed and
   explained)`, and Lists & keys moved from "Quiz-passed" into the snapshot's "Solid" table.
5. **Recorded in the code**, following the props lesson: the header reads "FIX-IT EXERCISE — fixed" with the
   diagnosis steps kept, and a comment at the `.map()` explains why an index key fails and an id key works.
   Reviewer-added, not learner-added — the learner's own change was the one-line key fix.
6. **The Sample Code became a real mirror.** It had been the fix-it exception (correct pattern, buggy demo);
   now demo and snippet are the same 62-line component, with the same empty-`{}` residue from stripping the
   JSX comment that `conditional-rendering` has. The exception note in `CLAUDE.md` now points at no lesson,
   and the mirror rule is unqualified again.
7. **One exchange beyond the fix, kept because it is instructive.** The learner's rule — index is unsafe "if
   there's any addition, removal, and reordering of data" — is correct to code by but *stricter* than the
   truth: appending at the end preserves every index, so React reuses each instance against the same data and
   nothing moves. Asked that case directly, they correctly called it safe. The reviewer had framed the
   question expecting the conservative answer and would have been wrong to mark "safe" down. The traps-table
   row for `key={index}` now says an index names a slot rather than an item, and that append-at-end is the
   harmless case.
8. **One rule-of-thumb overreach, taught rather than scored.** Asked about `RichText`, which renders its
   paragraphs with `key={index}`, the learner said index is unsafe because the content can change. It is safe
   there: content arriving as props flows through a reused instance perfectly well, which is the normal path
   of every re-render. The deciding factor is whether items can be **reordered** and whether any row carries
   its own state — not whether the content is static. The learner had the deciding factor right when asked
   for it directly (row-level state); this was an over-broad application, so it was corrected in conversation
   and not counted against them.

*Reviewer note on process:* this exercise promoted cleanly because the demo was cut down to 62 lines before
it shipped. The first draft (two lists, two wrong key styles, per-row text inputs) had to be discarded — the
objective was unclear and two mistakes competed for attention. Worth applying to the next fix-it lesson up
front: state the objective explicitly, and keep the surface to one noticeable bug.

### Docs audit, lint repair, and the Lists & keys exercise

**A. The audit found four doc errors — this is the third session in a row where an audit found some.**

1. **`npm run lint` was failing outright** — 44 parse errors, none of them in this code's fault. A Kilo
   Code git worktree at `.kilo/worktrees/wiry-cup` is a complete second checkout with its own
   `tsconfig.json`; because lint is `eslint .`, `typescript-eslint` saw two candidate `tsconfigRootDir`
   values and refused to parse every file in *both* trees. `npx eslint src vite.config.ts` exited 0, which
   is what proved the code was clean. Fixed by adding `.kilo` to `globalIgnores`. Both checks now pass.
2. **The conditional-rendering parity claim was off by one.** `CLAUDE.md` said "63 of 63 lines identical".
   Re-measured: the sample is 63 stripped lines and the demo is 64, the extra line being an empty `{}`
   left behind when the demo's JSX comment is stripped. All 63 sample lines do match. Claim rewritten.
3. **The `useState` entry in `NOTES.md` contradicted both the code and itself.** It showed a 19-line
   `CounterDemo` and described it as "the same logic as the lesson component, with the `className`
   styling trimmed" — but it contained the whole milestone block that the lesson's own snippet omits,
   restructured the markup, and was a *different* 11-line snippet from the one on the lesson page. The
   notes now quote the lesson's real snippet, with the milestone block shown separately and labelled as
   the extra the live component does.
4. **"Type-checking and linting pass" had become false** (current-state section, twice, plus the audit
   entry further down this file, which is now corrected in place).
   Minor, same pass: `HomePage.tsx` advertised `v0.1.0` while `package.json` is `0.0.0` and the deploy is
   unticked, now `v0.0.0`; and `NOTES.md` called `toLocaleDateString()` "today's date" rather than a
   locale-formatted date string.

**B. New lesson — `lists-and-keys`, a fix-it exercise (entry 06).**

1. **The exercise.** One list of three exercises, a single "Rotate" control, and one "Done" toggle per
   row. Rows are keyed by array index, so after a rotate the tick sits on whichever exercise took that
   slot. A row's own `useState` is the only thing that knows which exercise was ticked, which makes the
   identity mistake visible on screen instead of inferred. The header states the **objective** and the
   click-by-click steps, then names what you should see — never where the bug is or how to fix it.
2. **The first version was too big and was cut down.** It had shipped with two lists, two wrong key
   styles, per-row text notes and two controls. That buried the lesson: the objective was never stated,
   and two different key mistakes competed for attention. The rewrite is a third of the size, states the
   objective in the header, and leaves exactly one thing to notice. The whole demo is now 62 code lines
   and the fix is two of them.
3. **The symptoms were simulated before they were written down**, per the rule that cost the
   `conditional-rendering` exercise a rewrite. That caught two things. In the first design, per-row state
   was a numeric "+1", and because every row then showed a *different* number the mismatch was invisible —
   three scenarios all looked healthy. Switching the row's state to something readable (a tick) made the
   symptom visible. The simulation also caught that the first seed data was already in the desired order,
   so the "sort" reordered nothing and proved nothing. The simplified design was simulated the same way
   and pinned to exact values: tick Front kicks, rotate once, and the tick is on Knee strikes.
4. **The sample code teaches the correct pattern, not the bug** — `key={exercise.id}` instead of
   `key={index}`. It is otherwise the *same* component: 62 lines each, differing at exactly those two key
   lines. That is the documented fix-it exception, and it keeps the scope of the fix obvious once the
   learner goes looking. Excluded from the parity counts until then.
5. **Registered with no new routes** — one registry entry and one lesson folder, and the sidebar link,
   `/dojo/topic/lists-and-keys` URL and grid card follow automatically. `tsc` and `lint` verified green
   with the bug in place.
6. **`ROADMAP.md` marked `IN PROGRESS`**, not ticked, and `NOTES.md` moved Lists & keys out of
   "quiz-passed" into a new "In progress" section — the concept was quiz-passed, but a live exercise is
   not evidence of a *fix*, so the box stays open until the demo works and the reasoning is explained.
7. Concept-level traps added to the notes, including the one that matters most here: two siblings sharing
   a key.

*Correction to this entry:* item A1 initially read as though `.kilo` were inside this repo's own source
tree. It is not — it holds **editor-agent worktrees**, a complete copy of the project on a detached HEAD,
which is exactly why it carries a second `tsconfig.json` and confused the parser.

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

7. **Verified**: `npx tsc -p tsconfig.app.json --noEmit` and `npm run lint` both pass. *(True when written. `npm run lint` later began failing when an editor worktree appeared under `.kilo` with a second `tsconfig.json` — see the newest entry above, where it was diagnosed and fixed.)*

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
3. **Mobile responsive pass.** The tutorial shell was unusable on a phone: the fixed `w-64` sidebar left roughly 120px of content on a 375px screen. It now stacks below `md` — the sidebar became a horizontally scrollable strip (`w-full md:w-64`, since replaced by the burger dropdown logged below) — and returns to side-by-side from `md` up, using the *same* markup with no duplicated nav. Also made the landing and top-nav links visible on small screens instead of `hidden sm:*`, tightened padding (`px-4 sm:px-6`), scaled headings down (`text-2xl md:text-3xl`, hero `text-4xl sm:text-5xl md:text-7xl`), and added `min-w-0` / `shrink-0` to card headers so long titles wrap rather than squashing the belt badge.
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

### UI convention — code in descriptions now renders as code

1. **Fixed a real defect, not just polish.** `topic.longDescription` was rendered as a single `<p>` with `whitespace-pre-line`, so every backtick and bullet dash the content already contained was appearing **literally** on the lesson pages: readers saw `` `useState` `` complete with backticks, and `- ` lists as run-on prose.
2. **Added `src/components/topics/RichText.tsx`** — a small renderer that turns the string into paragraphs, bullets, inline `<code>` and fenced `<pre><code>` blocks. It builds ordinary React nodes and never uses `dangerouslySetInnerHTML`, so description text can never inject markup. Hand-rolled instead of adding a Markdown dependency: four documented rules, nothing to install, and short enough to actually read.
3. **Wired into `TopicDetail`**, replacing that `<p>`.
4. **Marked up the existing content.** `components-props` had two snippets sitting in prose (`<Drill … />` and `function Drill({ … })`), now proper code blocks; `use-state` had `(setCount(c => c + 1))` and a bare `useState`; `jsx` had three unmarked brace expressions. `conditional-rendering` was already well marked up.
5. **Verified mechanically**, since the reviewer cannot run the app: the same parse logic was re-run in Node against all four extracted description strings — correct block structure, both `components-props` snippets fenced, and **every backtick pair and fence balanced** (an unpaired backtick would render literally). Worth repeating whenever description content changes.
6. **Documented the convention** under Key Patterns, including that `description` — the one-line summary in the topic grid — is plain text and must stay markup-free.

### Mobile nav — horizontal strip → burger dropdown

The sidebar's phone layout was a horizontally scrolling strip of topic links. With four lessons that was already awkward; with the dozen the roadmap plans it would be unusable, because a horizontal scroller **hides** items rather than showing them.

1. **Replaced with a burger dropdown** in `Sidebar.tsx`: a button reading `☰ Lessons` plus the current topic, expanding the list in place. `aria-expanded` / `aria-controls` are wired up and `aria-current="page"` is kept on the active link.
2. **It expands in place instead of floating.** `TutorialLayout` wraps the shell in `overflow-hidden`, which would clip an absolutely-positioned panel — and pushing the content down is both simpler and perfectly good mobile behaviour.
3. **Capped at `70vh` with its own scroll**, since the topic list will keep growing; the cap is lifted from `md` up so the desktop sidebar is untouched.
4. **One topic list, two presentations** — no duplicated markup, matching the existing responsive rule.
5. **Closes when a link is tapped**, so the panel never sits on top of the lesson you just opened.
6. **Escape-to-close deliberately omitted.** It needs a keydown listener, which in React means `useEffect` — a hook the journal has not taught yet. That is noted in the file as a good first job for the topic, rather than smuggling the hook in early.
7. Verified `tsc` / `npm run lint`. The mobile behaviour itself is the learner's to eyeball at ~375px.

### Earlier session — routing migration

The repo was migrated from a **single-page landing app** (`App.tsx` = hero → techniques → training counter → about → footer, all in one file) into a **multi-page W3Schools-style tutorial site**:

1. **Installed `react-router-dom` v7** (v7.18.4, compatible with React 19.2). Fixed a gotcha: `--omit=optional`/`--no-optional` strips the rolldown WASM native binding (`@rolldown/binding-wasm32-wasi`) — Vite 8 needs it. Always reinstall with a plain `npm install`, never with `--omit=optional`.

   *Correction (found during the docs audit):* **the package named above is wrong.** Rolldown 1.2.12
   ships 15 platform-specific bindings as optional dependencies and **no** `wasm32-wasi` package; the
   one in use here is `@rolldown/binding-win32-x64-msvc`, and `package-lock.json` has no `wasm32-wasi`
   entry at all. The *advice* stands — `--omit=optional` does strip the binding and the build then fails
   with "Cannot find native binding" — so always use a plain `npm install`.
2. **Created the tutorial shell**: `TutorialLayout.tsx` (nested layout route w/ `<Outlet />` so the sidebar persists), `Sidebar.tsx` (topic list, active highlight via `useMatch`), `TopNav.tsx` (logo + Dojo link + GitHub icon).
3. **Split pages off `App.tsx`**: `HomePage.tsx` (landing hero), `TopicIndex.tsx` (overview grid at `/dojo`), `TopicDetail.tsx` (lesson detail at `/dojo/topic/:slug` — description + code block + live `<Demo />`).
4. **Built the topic registry system**: `types.ts` (`BeltRank` + `Topic` interface), `registry.ts` (topic list + `bySlug` lookup), and the first lesson `use-state/` with `demo.tsx` (extracted `CounterDemo`) and `index.ts`.
5. **Updated entry point & routes**: `main.tsx` wraps `<BrowserRouter>`; `App.tsx` is now just `<Routes>`.
6. **Verified**: `tsc -b` passes, `vite build` succeeds, all three routes return 200 in dev with no runtime errors.
7. **Docs**: `CLAUDE.md` (arch guide), `NOTES.md` (study notes — layout fixed, ASCII-safe tables), `ROADMAP.md` (checklist), `vercel.json` (SPA deploy fallback).
