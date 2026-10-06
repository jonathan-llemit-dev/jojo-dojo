// ─────────────────────────────────────────────
// Topic: Forms & Controlled Inputs — value + onChange, and preventDefault
// Added: 2026-10-07 | Status: OK (verified — fixed and explained)
// ─────────────────────────────────────────────
// (Statuses: OK = Mastered, LD = Learning, RV = Reviewing.)
//
// FIX-IT EXERCISE — fixed 2026-10-07.
//
// OBJECTIVE (as set)
//   Fill in Name and Email, press "Sign up", and a confirmation line should read
//   "Welcome, <name> — we'll email you at <email>." without the page reloading.
//
// The two planted bugs, now fixed:
//   1. The Name input's onChange wrote state back to itself — onChange={() => setName(name)}
//      — instead of reading the typed value, so typing never changed state and the field
//      looked frozen. Now it reads the event: onChange={(event) => setName(event.target.value)}.
//   2. The submit handler took no event parameter and never called preventDefault(), so the
//      browser ran its default submit (a page reload) and the confirmation was lost. Now it
//      takes SubmitEvent<HTMLFormElement> and calls event.preventDefault() first.
//
// The Sample Code panel and this file are a real mirror — see "Sample code mirrors the
// live demo" in CLAUDE.md.

import { useState, type SubmitEvent } from "react";

/** Live demo: a dojo sign-up form. Two bugs are planted — see the header. */
export function FormsDemo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [signedUp, setSignedUp] = useState(false);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault(); // prevent the page from reloading
    setSignedUp(true);
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-dojo-border bg-dojo-surface/30 p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-dojo-muted">
            Name
          </span>
          <input
            type="text"
            value={name}
            name="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Jonathan"
            className="w-full rounded-md border border-dojo-border bg-dojo-bg/60 px-3 py-2 text-sm text-dojo-text outline-none focus:border-dojo-ember"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-dojo-muted">
            Email
          </span>
          <input
            type="email"
            value={email}
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border border-dojo-border bg-dojo-bg/60 px-3 py-2 text-sm text-dojo-text outline-none focus:border-dojo-ember"
          />
        </label>

        <button
          type="submit"
          className="rounded-lg bg-dojo-ember px-4 py-2 font-medium text-black transition hover:bg-dojo-ember-bright"
        >
          Sign up
        </button>
      </form>

      {signedUp && (
        <p className="border-t border-dojo-border pt-4 text-sm text-dojo-muted">
          Welcome, {name} — we'll email you at {email}.
        </p>
      )}
    </div>
  );
}
