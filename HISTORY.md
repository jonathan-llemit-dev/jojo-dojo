# History

A chronological log of work on this project — what each session changed, and more usefully *why* the
conventions ended up as they did. `CLAUDE.md` holds the current architecture, conventions and next
steps; this file answers "why is it like this?".

Newest first.

---

## Session log

### UI readability pass — numbered path, scannable sidebar, readable prose

Requested before starting the next topic: make the sidebar and the main panel easier to read, and give the
topic cards a clear order.

1. **The sidebar was showing truncated titles.** Rows rendered `topic.title`, and every title is a
   "Concept — subtitle" string, so a 16rem column clipped them to "Components & Props — Dat…" and
   "Conditional Rendering — &…". Added **`shortTitle`** to the `Topic` type — required, so the compiler
   forces every lesson to supply one — and the sidebar shows that instead: "Components & Props",
   "Conditional Rendering", and so on. The full `title` is untouched on the page `<h1>` and the cards.
2. **The order is now visible everywhere.** A two-digit lesson number leads each sidebar row and each
   index card, and the topic page carries a breadcrumb reading "All Topics / Lesson 08 of 08". All three
   derive the number from the item's position in `topicRegistry`, so the reading order lives in exactly
   one place — reordering that array reorders the sidebar, the cards and the breadcrumb together. The
   index grid also became a real `<ol>`, which is what it had always been semantically.
3. **The detail prose was 896px wide** — roughly 120 characters a line, well past the 60–75 that reads
   comfortably. `RichText` now caps paragraphs and bullets at `max-w-prose` (65ch) with `leading-7`,
   while fenced code blocks keep the full width, since code wants the room. Section spacing went from
   `mb-8` to `mb-10`, and the header gained a rule separating it from the body.
4. **Verified**: `tsc` and `npm run lint` green. The visual result is the learner's to confirm — the
   reviewer still cannot run `npm run dev`.

### Forms — fixed, explained, and verified

1. **Both bugs fixed.** The learner's `forms` demo now reads the typed value
   (`onChange={(event) => setName(event.target.value)}`) and its submit handler calls
   `event.preventDefault()` first. `tsc` and `npm run lint` green; the sample was swapped from the fix-it
   exception to a real mirror, verified at **53 of 53** lines.
2. **A detour worth recording.** Beyond the two fixes, the learner added `new FormData(event.currentTarget)`
   plus a `console.log` to read the values back out of the form, reasoning that "FormData is the new way for
   form submission since React 19." Two corrections: `FormData` is the browser's API, not new to React — React
   19 added *form actions* (`<form action={fn}>`), a different pattern — and in a controlled form the values
   already live in state, so re-reading them from the DOM is redundant. Asked to explain, the learner corrected
   it in their own words: `FormData` reads at submit time (uncontrolled), while `useState` keeps the values
   live (controlled). The block was removed.
3. **Also caught this session:** `@types/react` deprecates `FormEvent`/`FormEventHandler`; the lesson teaches
   `SubmitEvent<HTMLFormElement>` instead (see the previous entry).
4. **Box ticked.** `ROADMAP.md` marked verified, `NOTES.md` entry 09 rewritten as `OK (Mastered)` with the
   FormData correction spelled out, the marker flipped to `Status: OK`, and Forms moved into the snapshot's
   "Solid" table. All eight lessons are now verified.

### Forms & controlled inputs — the eighth lesson, a fix-it exercise

1. **Docs audit before building.** `npx tsc -p tsconfig.app.json --noEmit` and `npm run lint` both pass. The
   version chain was consistent (7 topics → `0.08.0` across `package.json`, both `package-lock.json` entries,
   and the `v0.08` badge). All 7 lesson folders wired into the registry and named in all four docs; assets and
   `vercel.json` match their descriptions; every `description` is markup-free and every `longDescription` has
   balanced backticks.
2. **One real drift found and fixed: `use-effect` sample no longer mirrored its demo.** Four lines differed —
   the demo said "Timer running — keep going!" / "Paused - Taking a break is fine, but never give up!" /
   "Timer not started." / "characters logged.", while the Sample Code panel said "Interval running — one
   cleanup away from becoming two." / "Paused. The interval was cleared when you paused." / "Not started." /
   "characters logged". `CLAUDE.md` claimed "64 of 64" parity, which was false (60 of 64). The demo is
   canonical, so the sample was corrected to match and the claim is true again. `NOTES.md` entry 08 was not
   affected (it does not quote those strings).
3. **Probed before designing, per the fix-it rule.** Two candidate bugs survive both gates; two shapes do not:
   - Survives: a no-op `onChange` that writes state back to itself (silent read-only), and a submit handler
     with no `event` parameter (no `preventDefault`, page reloads).
   - Rejected: `value` on a field whose setter is otherwise dead (`noUnusedLocals` → TS6133 'setName' is
     never read), and a submit handler that types the `event` parameter but never uses it
     (`noUnusedParameters` → TS6133 'event' is never read).

   So a fix-it exercise with exactly two bugs is possible — the learner's stated preference.
4. **Shipped `forms` at `/dojo/topic/forms`** — a dojo sign-up form (Name + Email + Sign up) with both
   plantable bugs. The header names the objective and expected values and lists only the symptoms; the Sample
   Code panel teaches the correct pattern (the fix-it exception). Marker `Status: LD`, ROADMAP `IN PROGRESS`.
5. **Version bumped `0.08.0` → `0.09.0`** (eight topics) across `package.json`, both `package-lock.json`
   entries, and the `HomePage` badge.
6. **Understanding checked before building** — two questions, one at a time. Both solid: the controlled
   round-trip (`value` follows state, `onChange` follows the box, and the two failure modes) and the browser's
   default submit behaviour plus why `preventDefault` stops it. Ready for the exercise.
7. **`FormEvent` → `SubmitEvent` correction.** The learner caught that `@types/react` deprecates
   `FormEvent`/`FormEventHandler` ("FormEvent doesn't actually exist" — the DOM has no form event). The
   lesson now teaches `SubmitEvent<HTMLFormElement>` (a `<form>`'s `onSubmit` is typed `SubmitEventHandler<T>`),
   in the sample, the notes, and the demo. `ChangeEvent<HTMLInputElement>` and `MouseEvent<HTMLButtonElement>`
   are unaffected — only the invented "form event" was removed.

### Versioning — the version is now derived, not invented

1. **The learner set the rule:** `0.01` for the initial page, then **`+0.01` per topic**. Seven topics, so the
   project is **`0.08.0`**. It replaces the old hand-picked `v0.1.0` deploy target that never shipped — the
   exact guesswork that once left the `HomePage` badge advertising a release which did not exist.
2. **Applied in five places, not one.** `package.json`, **both** project `"version"` entries at the top of
   `package-lock.json` (the root one and `packages[""]` — dependency versions untouched), the `HomePage` badge
   (short form `v0.08`), and the four docs that had been pitching `v0.1.0`.
3. **Written into `CLAUDE.md` as a convention** with its own section, so a new session derives the number
   instead of choosing one: the rule, the three artefacts that must move together, and why the old approach
   failed. Step 5 of the lesson-adding checklist now covers the bump, which is what makes the version advance
   automatically as topics are added.
4. **Asked rather than assumed.** The learner's two statements initially disagreed — "+0.1 per topic" against
   "7 topics → 0.08" — and `0.01 + (7 × 0.1)` is `0.71`, not `0.08`. Since the difference was between two
   plausible conventions and this one gets written into five files, the ambiguity was put back to the learner
   instead of being resolved by picking the reading that matched the stated number.
5. **One judgement call recorded:** the roadmap's `useState` deep dive is not a topic folder, so it does not
   advance the version. It is a gap *within* a verified topic. Routing, by contrast, has a notes entry but no
   lesson folder — either way the count that matters is the seven `src/topics/` folders.

### Sync pass — making the record readable by a cold session

Before starting a new topic, everything was audited for agreement between the docs, the code, and *each other* —
not just for factual accuracy, but for whether a fresh AI session could pick the project up unassisted.

1. **One genuine code/doc contradiction: `RichText.tsx` said "three rules" while `CLAUDE.md` said four.** The
   parser implements four (fenced blocks, bullets, inline code, blank-line paragraphs), so the source comment
   was wrong, and its sibling comment on `parseBlocks` claimed "three" while listing three *structural* rules
   and silently omitting the fourth. Both comments now name all four and say which function owns each. This is
   the second time a stale comment in this file has been caught — worth knowing this file is a repeat offender.
2. **The version story was ambiguous.** `package.json` says `0.0.0` and the `HomePage` badge matches it, but
   every doc pitched "Deploy v0.1.0" without saying the version has to be *bumped* as part of that work — which
   is why the badge had once advertised a release that never happened. The roadmap and notes deploy lines now
   spell out that bumping `package.json` to `0.1.0` is part of the task.
3. **Added an "Orientation — read this first" section to the top of `CLAUDE.md`.** A cold session previously had
   to infer, from scattered sections, which of the five root docs answers what, whose job the written record is,
   and what "verified" means. It now says so up front, including the rule most likely to be misread: *do not
   tick a box because a lesson file exists.*
4. **Added the missing "Adding a lesson — the checklist".** Adding a lesson touches six places across five
   files, and that procedure existed only as scattered remarks — this project's single most-repeated failure is
   docs drifting out of sync, so the procedure is now written down as a table, including the decision that has
   to be made *before* writing the demo: fix-it exercise, or explainer. That decision now carries the gate-probe
   rule with it.
5. **Made the objective ordering explicit.** `Next session objectives` listed Forms before the `useState` deep
   dive, which read as an oversight since the deep dive is older. It is deliberate — Forms is a **`GAP`** (never
   used at all), the deep dive is a *gap within a verified topic* — and now says so.
6. **Verified by script, not by eye:** 18 claimed paths all exist; dependency majors match `package.json`
   (React 19, Vite 8, Tailwind 4, React Router 7); all 8 notes entries agree with their marker file and roadmap
   box (entry 03 Routing being the documented exception); all 7 lessons are wired into the registry and named in
   all four docs; no stale claims anywhere; and all 7 descriptions still render without literal markup.
7. **Two of my own checkers were wrong first**, and both were reported as problems before being disproved:
   a regex that missed "reviewer-written" text that was present, and one that mapped alphabetically-sorted
   folders against entry numbers. Neither was a repo defect — which is exactly why a failing check is worth
   reading before acting on it.

### `useEffect` — the second lesson that could not be a fix-it exercise
1. **Seven candidate bugs were probed against both gates before anything was designed.** The request was a
   fix-it with two or more bugs; the probes said that is not available here, and the split is clean:
   - **Rejected by `react-hooks/set-state-in-effect`:** derived state synced through an effect
     (`useEffect(() => setCount(prop), [prop])`) — the "you might not need an effect" mistake React's own
     docs lead with — and an object or array used as a dependency.
   - **Rejected by `react-hooks/exhaustive-deps`:** any wrong or missing dependency array, including a
     wrapper handler on the dependency line. It is a *warning* rather than an error, so it does not fail the
     build — but the warning text names the fix ("wrap the definition in its own `useCallback()`"), which
     hands over the answer, so shipping it would be worse than useless.
   - **Passes both gates:** a fetch with no `AbortController` (but with no server here, the race is
     unobservable), and a missing cleanup on an interval or listener.

   That leaves **one** mistake in two shapes, which is too thin for an exercise whose point is diagnosis.
   So: lecture plus quiz, per the stated fallback.
2. **The lesson is live at `/dojo/topic/use-effect`** — a training timer whose only effect starts, stops and
   cleans up an interval. The demo deliberately keeps two independent pieces of state (`seconds` driven by
   the interval, `draft` driven by the textarea) so the dependency array can stay honest: the effect depends
   on `isRunning` and nothing else, and typing never restarts the timer.
3. **The cleanup is the teaching device.** The lesson text walks through deleting the `return` line: nothing
   breaks immediately, each change to `isRunning` leaves the previous interval alive and starts another, and
   the clock ends up ticking two and then three times as fast. A leak **compounds**, so the symptom arrives
   several interactions after the mistake.
4. **Two rules from React's own documentation are included**: use the updater form
   (`setSeconds((s) => s + 1)`) so state does not have to enter the dependency array, and compute derived
   values during render rather than in an effect. The demo's formatted clock is the worked example of the
   second.
5. **Verified**: exact mirror at **64 of 64** lines, `tsc` and `npm run lint` both green with no warnings.
6. **A mistake of my own, caught by the checker rather than by eye.** The first draft of the description used
   Markdown emphasis — `**Cleanup is the half people skip**` plus six more instances of `**bold**` and
   `*italic*`. `RichText` has no emphasis rule, so every one of those would have printed literal asterisks on
   the lesson page. The sweep that caught it now checks all seven descriptions for literal backticks, `**`
   and lone `*` outside code spans; all seven are clean.
7. **Deferred, and recorded as deferred:** a real fetch with loading and error states. There is no server in
   this project, so a fetch demo would have to fake its data and could not show the race condition that makes
   `AbortController` worth teaching. It belongs with Forms, alongside the event object.
8. **Verified by quiz — with one answer wrong first time, which is the first in the journal.** Two of three
   were right immediately: what genuinely needs an effect (`document.title`, because nothing outside React
   re-renders itself), and why a missing cleanup compounds (the previous intervals are never stopped, so each
   re-run adds a contributor rather than replacing one). The third was wrong — shown an effect reading `reps`
   with `[]`, the answer was that an empty array still re-runs when a value the effect reads changes. That is
   backwards: the dependency array is the *only* thing that decides re-runs, so `[]` means once after the
   first render and nothing after.

   The correction landed, and the follow-up answer was right and precise — the callback would still see `0`,
   because it closed over the value from the render it ran in. Recorded in entry 08 with the correction
   spelled out rather than smoothed over, because "an empty array still re-runs when a value changes" is the
   belief that makes someone add dependencies pointlessly or wonder why an effect is not firing.
9. **Box ticked; all seven lessons are now verified.** `ROADMAP.md` has no `IN PROGRESS` or `quiz-passed`
   lines left, and both the "In progress" and "Quiz-passed" sections of the snapshot are empty for the first
   time.

### Event handling — verified by quiz

- **Verified and closed out — by quiz, not by repair.** Event handling had no hands-on exercise to fix, so
  clearance for the box came from three questions, asked one at a time with feedback between each. All
  three correct, and none guessable from the wording of the options:
  - **What the gates object to** in `onClick={handleReset()}` — answered that the handler runs while
    rendering and `onClick` receives its return value instead of the function. That is the fact both `tsc`
    and ESLint point at, from different angles.
  - **Reading four differently-wired buttons** — identified the one correct wiring. The question planted two
    *different* mistakes, and the feedback separated them: calling during render is loud (both gates stop
    you), while failing to supply the argument a handler needs is silent (nothing stops you; the click
    passes the event object where an id was expected).
  - **Choosing the form** for a Rename button needing that row's id — picked the arrow wrapper and gave the
    right reason. The "read the id off the event object" option was offered and would have been accepted as
    a real pattern; it is the one answer that requires the event object this lesson deferred.

  `ROADMAP.md` ticked, `NOTES.md` entry 07 rewritten as verified with the quiz recorded, the marker flipped
  to `Status: OK`, and Event handling moved into the snapshot's "Solid" table.

### Event handling — how the lesson was built

1. **The plan was a fix-it exercise, and the plan was wrong.** The mistake this topic exists to teach —
   `onClick={handler()}` instead of `onClick={handler}` — cannot be shipped as a planted bug in this
   project. A throwaway probe (four wirings in one throwaway file, both gates run against it) showed:
   `tsc` rejects it with *Type 'void' is not assignable to type `MouseEventHandler<HTMLButtonElement>`*,
   and ESLint's `react-hooks/set-state-in-render` rule rejects the same line independently. The fix-it
   convention requires every planted bug to compile and lint clean, so there was nothing to plant.
2. **Two failed attempts before the probe, worth recording because they show why the obvious workarounds
   do not work.** The first version used `handleAddRep` with `reps + 1`; a render-phase call re-rendered,
   which called it again — a genuine infinite loop (26 passes and climbing), which would have frozen the
   lesson page. The second made the handler idempotent by *setting* rather than incrementing, which fixed
   the loop, but the mis-wired Remove then emptied the whole panel on mount and left nothing to click.
   Both were caught by simulation before shipping. The lesson: **check that a candidate bug survives
   `tsc` and lint before designing an exercise around it** — now written into the fix-it convention in
   `CLAUDE.md`.
3. **So it shipped as an explainer instead**, at `/dojo/topic/event-handling`. The Live Demo shows all
   three wirings at once: an inline arrow closing over a row's id, a named handler passed by reference
   (`Reset`), and a named handler taking an argument through an arrow (`Remove`, `Focus`). This is the
   first file in the journal with **named handler functions** — every one of the previous 12 handlers was
   an inline arrow.
4. **The description earns its place by showing the compiler's real message.** The lesson text includes
   the actual `tsc` error for the wrong wiring, so the "you get this right while typing" point is
   demonstrated rather than asserted. Four fenced code blocks, verified to render through `RichText`.
5. **The event object was deliberately left out** — `preventDefault`, `target`, and typing an event
   parameter (`React.MouseEvent<HTMLButtonElement>`) belong with Forms, where they have a real job. Noted
   as deferred, not forgotten.
6. **Verified**: exact mirror between `demo.tsx` and `codeExample` at **105 of 105** lines (the first
   lesson to hit exact parity with no residue lines, by keeping JSX comments out of the demo), `tsc` and
   `npm run lint` green, and the description parsed through the `RichText` logic to confirm four code
   blocks and no stray emphasis.
7. **Box left unticked.** The demonstrated half is satisfied by code that already exists; the explanation
   half is outstanding, and `ROADMAP.md` marks the line `IN PROGRESS` with the reason recorded below the
   checklists.

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
