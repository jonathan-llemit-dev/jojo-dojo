// ─────────────────────────────────────────────
// Topic: Forms & Controlled Inputs — value + onChange, and preventDefault
// Added: 2026-10-07 | Status: OK
// ─────────────────────────────────────────────
// (Statuses: OK = Mastered, LD = Learning, RV = Reviewing.)
//
// A controlled input needs both halves: `value` makes the box follow state, and
// `onChange` makes state follow the box. The submit handler calls
// `event.preventDefault()` so the browser does not reload the page and throw the
// state away.

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
