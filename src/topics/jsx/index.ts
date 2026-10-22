import type { Topic } from "../types";
import { JsxDemo } from "./demo";

/** Registry entry for the `jsx` React lesson. */
export const jsxTopic: Topic = {
  slug: "jsx",
  title: "JSX — Syntax, Expressions & Rendering",
  shortTitle: "JSX",
  belt: "white",
  description:
    "Write your UI in JavaScript with JSX — curly braces for expressions, className for classes, and one root element per return.",
  longDescription:
    "Open your first React file and it looks like HTML sitting inside a JavaScript function. That is JSX, " +
    "and the reason it surprises people is that it is neither HTML nor a string. It is a shorthand the " +
    "compiler turns into function calls that build the page.\n\n" +
    "Knowing that explains the differences you will bump into:\n" +
    "- You write `className` instead of `class`. `class` is a reserved word in JavaScript, so JSX uses " +
    "another name and React maps it across for you.\n" +
    "- Curly braces mean \"now run some JavaScript\". Nothing in them is special: `{2 + 2}` shows `4`, " +
    "`{new Date().toLocaleDateString()}` shows today's date, `{user.name}` shows a property.\n\n" +
    "```\n<p className=\"score\">{2 + 2} minutes in.</p>\n```\n\n" +
    "Because braces expect an expression, an `if` or a `for` won't compile inside them. You choose " +
    "between things with a ternary, and you build lists with `map()` — both of which get their own " +
    "lessons.\n\n" +
    "Two more things to know on day one. A comment inside JSX is written `{/* like this */}`. A plain " +
    "`//` line is not JSX syntax — between tags it becomes visible text, so keep `//` for the JavaScript " +
    "above the `return`. And a component returns " +
    "one element, so wrap any siblings in a `<div>` or a fragment `<>…</>`.\n\n" +
    "JSX also keeps your components apart from HTML tags by capitalisation. `<div>` is a browser element; " +
    "`<JsxDemo>` is one of yours — note the capital J. Every component name starts with a capital letter, " +
    "or JSX treats it like a plain tag.",
  // A template literal keeps this snippet readable: what you see here is what
  // renders in the "Sample Code" panel, indentation and line breaks included.
  codeExample: `function JsxDemo() {
  return (
    <div className="inline-flex flex-col items-center gap-6 p-6 rounded-xl border border-dojo-border bg-dojo-surface/60">
      {/* This is a JSX comment — it does NOT render */}
      <h2 className="text-2xl text-dojo-ember">{2 + 2} is four</h2>
      <p>Today is {new Date().toLocaleDateString()}</p>
    </div>
  );
}`,
  component: JsxDemo,
};
