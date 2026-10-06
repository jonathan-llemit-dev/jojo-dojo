import type { Topic } from "../types";
import { FormsDemo } from "./demo";

/** Registry entry for the `forms` React lesson. */
export const formsTopic: Topic = {
  slug: "forms",
  title: "Forms & Controlled Inputs",
  belt: "white",
  description:
    "Make an input controlled with value + onChange, and stop the browser's default submit with preventDefault.",
  longDescription:
    "A controlled input has two halves, and each half is doing a different job:\n\n" +
    "- `value={name}` makes the input follow state. On every render the box shows whatever " +
    "`name` is right now, so state is the single source of truth.\n" +
    "- `onChange={(event) => setName(event.target.value)}` makes state follow the input. Every " +
    "keystroke hands the new text back to state.\n\n" +
    "Drop the `value` and the box stops reflecting state — it still types, but nothing you set " +
    "programmatically will show. Drop the `onChange` and the box freezes — React keeps re-rendering " +
    "it back to the state value, so your keystrokes never land. A controlled input needs both " +
    "halves: state in through `value`, text out through `onChange`.\n\n" +
    "The text you typed arrives on the event object as `event.target.value`. This is the same " +
    "event object the event-handling lesson deferred — here it finally has a job, because the " +
    "input's text is nowhere else.\n\n" +
    "The other half of a form is the submit. A `<form>` has a default behaviour: when a submit " +
    "button is clicked, the browser builds an HTTP request from the form's `action` and `method` " +
    "and navigates to it, which reloads the page and throws away your state. To keep the submit " +
    "in React you stop that default:\n\n" +
    "```\nfunction handleSubmit(event: SubmitEvent<HTMLFormElement>) {\n  event.preventDefault();\n  setSignedUp(true);\n}\n```\n\n" +
    "`preventDefault()` tells the browser \"do not do your default thing\", so React code runs " +
    "instead of a page reload. Notice the parameter is typed — and the type depends on the event: " +
    "`SubmitEvent<HTMLFormElement>` for a form submit, `ChangeEvent<HTMLInputElement>` for an input " +
    "change, `MouseEvent<HTMLButtonElement>` for a button click.\n\n" +
    "This lesson shipped as a fix-it exercise and is now fixed. The demo and the sample below " +
    "are the same component.",
  // Flush against the left margin on purpose: a template literal preserves
  // indentation, so indenting this to match the surrounding code would render as
  // ragged leading whitespace in the "Sample Code" panel.
  //
  // A real mirror of ./demo.tsx — the exercise is fixed, so the two are kept in step.
  codeExample: `import { useState, type SubmitEvent } from "react";

export function FormsDemo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [signedUp, setSignedUp] = useState(false);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
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
}`,
  component: FormsDemo,
};
