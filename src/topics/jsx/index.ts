import type { Topic } from "../types";
import { JsxDemo } from "./demo";

/** Registry entry for the `jsx` React lesson. */
export const jsxTopic: Topic = {
  slug: "jsx",
  title: "JSX — Syntax, Expressions & Rendering",
  belt: "white",
  description:
    "JSX is a syntax extension for JavaScript that allows you to write HTML-like code within your React components.",
  longDescription:
    "JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like code within your React components. " +
    "It is not a string or HTML, but a syntax that gets transformed into JavaScript function calls. " +
    "JSX makes it easier to visualize the structure of your UI and allows you to embed expressions and components seamlessly.\n\n" +
    "Key points:\n" +
    "- You write `className`, not `class`. React maps it to the DOM's real class attribute for you.\n" +
    "- You can embed any JavaScript expression inside curly braces: `{2 + 2}`, " +
    "`{new Date().toLocaleDateString()}`, `{user.name}`.\n" +
    "- Components can be defined as functions or classes and can accept props to customize their behavior.\n" +
    "- JSX allows for conditional rendering and dynamic content based on state or props.",
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
