import type { Topic } from "../types";
import { PortalsDemo } from "./demo";

/** Registry entry for the `portals` React lesson. */
export const portalsTopic: Topic = {
  slug: "portals",
  title: "Portals — Rendering Outside the Parent DOM Tree",
  shortTitle: "Portals",
  belt: "blue",
  description:
    "Render a dialog, tooltip or toast into document.body, so a scrolling panel or an overflow rule cannot clip it.",
  longDescription:
    "A dialog is supposed to sit above the page: it dims everything, takes the focus, and ignores the panel it was opened from. Build one inside a scrolling panel and it does none of that. The panel clips it, the page scrolls underneath, and raising its `z-index` changes nothing.\n\n" +
    "The problem is in the DOM, not in React. Your component tree says the dialog belongs to that panel, and the browser only knows where the markup landed. Those two trees usually agree. A portal is the case where they should not.\n\n" +
    "`createPortal` moves the markup without moving the component. You hand it the children and a DOM node, and React renders them there while keeping the component where you wrote it:\n\n" +
    "```tsx\ncreatePortal(<DetailsDialog onClose={close} />, document.body);\n```\n\n" +
    "The dialog now lives at the end of `<body>`, outside every panel, scroll container and overflow rule.\n\n" +
    "In the demo, the same dialog renders two ways. In place, it stays inside the panel and its bottom is cut off. Through a portal, it is a child of `document.body` and covers the page. Switch between the two and watch the box escape.\n\n" +
    "`position: fixed` is the obvious shortcut, and it usually works: a fixed element is laid out against the viewport, so a panel's `overflow` does not clip it. What breaks it is a containing block — an ancestor with `transform`, `filter`, `perspective` or `contain: paint` becomes the box its fixed children are positioned and clipped against.\n\n" +
    "The demo's wrapper is transformed for that reason: a fixed child that stayed inside it — a non-portaled toast, say — would be trapped in the wrapper instead of the viewport.\n\n" +
    "The dialog in place takes a simpler route: it is `absolute` inside a panel with `overflow: hidden`, so the panel clips it. A portal renders it in `document.body`, where no ancestor can.\n\n" +
    "Nothing else about the component changes. Props, state and context still work, because the React tree is untouched — the dialog is still a child of the component that rendered it. Events bubble the same way too: a click inside a portaled dialog still reaches a handler on the component that opened it.\n\n" +
    "Reach for a portal when something has to leave its container: a modal, a tooltip, a toast, or a dropdown that a parent's `overflow: hidden` would clip.\n\n" +
    "Do not portal everything. A button that is happy inside its panel belongs there. The portal is for the layer that has to sit above the page.\n\n" +
    "Two habits make portals less error-prone. Style the dialog as a top-level thing, because CSS inherited from its old parent no longer reaches it. And keep the accessibility work: `role` and `aria-modal` on the dialog, focus moved in when it opens, Escape to close, and focus returned when it goes.\n\n" +
    "The demo below does all of that. Switch to 'in place', open the dialog, then switch back to 'through a portal' and compare where it ends up.",
  // Flush against the left margin on purpose: a template literal preserves
  // indentation, so indenting this to match the surrounding code would render as
  // ragged leading whitespace in the "Sample Code" panel.
  //
  // A real mirror of `./demo.tsx` — the two are kept in step. Regenerate with
  // `npm run sync:samples` rather than editing by hand; `npm run check:repo`
  // fails if they drift.
  codeExample: `import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
type RenderMode = "in-place" | "portal";
const TECHNIQUE = "Roundhouse kick";
type ToastProps = {
  id: number;
  message: string;
  index: number;
  onClose: (id: number) => void;
};
function Toast({ id, message, index, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onClose]);
  return createPortal(
    <div
      className="fixed right-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-lg border border-dojo-border bg-dojo-surface px-4 py-3 text-sm text-dojo-text shadow-lg shadow-black/50"
      style={{ bottom: 16 + index * 72 }}
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-dojo-ember" aria-hidden="true" />
      <p className="min-w-0 flex-1">{message}</p>
      <button
        type="button"
        onClick={() => onClose(id)}
        aria-label="Dismiss toast"
        className="shrink-0 rounded-md px-1 text-lg leading-none text-dojo-muted transition hover:text-dojo-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dojo-ember"
      >
        &times;
      </button>
    </div>,
    document.body,
  );
}
type DetailsDialogProps = {
  titleId: string;
  technique: string;
  fixed: boolean;
  onClose: () => void;
  onPin: () => void;
};
function DetailsDialog({ titleId, technique, fixed, onClose, onPin }: DetailsDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
  }, []);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  return (
    <div
      className={\`\${fixed ? "fixed items-center" : "absolute items-start"} inset-0 z-50 flex justify-center bg-dojo-bg/80 p-3\`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-sm rounded-lg border border-dojo-border bg-dojo-surface p-4 shadow-xl shadow-black/50"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h4 id={titleId} className="text-sm font-semibold text-dojo-ember">
            {technique}
          </h4>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-md border border-dojo-border px-2 py-0.5 text-[11px] transition hover:border-dojo-ember hover:text-dojo-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dojo-ember"
          >
            Close
          </button>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-dojo-muted">
          Turn the standing foot, drive the hip through, and keep your guard up. The kick lands
          with the shin, not the foot.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-dojo-muted">
          Relax the shoulders and breathe out on impact. Speed comes from the turn, not from
          swinging the leg harder.
        </p>
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onPin}
            className="rounded-md bg-dojo-ember px-3 py-1 text-xs font-medium text-black transition hover:bg-dojo-ember-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dojo-ember"
          >
            Pin technique
          </button>
        </div>
      </div>
    </div>
  );
}
export function PortalsDemo() {
  const titleId = useId();
  const openRef = useRef<HTMLButtonElement>(null);
  const [mode, setMode] = useState<RenderMode>("portal");
  const [isOpen, setIsOpen] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const [pinned, setPinned] = useState<string | null>(null);
  const addToast = (message: string) => {
    setToasts((prev) => [...prev, { id: Date.now() + Math.random(), message }]);
  };
  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  function closeDialog() {
    setIsOpen(false);
    openRef.current?.focus();
  }
  function handlePin(technique: string) {
    setPinned(technique);
    addToast(\`\${technique} pinned\`);
    closeDialog();
  }
  const dialog = (
    <DetailsDialog
      titleId={titleId}
      technique={TECHNIQUE}
      fixed={mode === "portal"}
      onClose={closeDialog}
      onPin={() => handlePin(TECHNIQUE)}
    />
  );
  return (
    <div className="flex w-full max-w-md flex-col gap-3 [transform:translateZ(0)]">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-dojo-muted">Render:</span>
        <button
          type="button"
          aria-pressed={mode === "in-place"}
          onClick={() => setMode("in-place")}
          className={\`rounded-md border px-2 py-0.5 transition \${
            mode === "in-place"
              ? "border-dojo-ember text-dojo-ember"
              : "border-dojo-border text-dojo-muted hover:text-dojo-text"
          }\`}
        >
          in place
        </button>
        <button
          type="button"
          aria-pressed={mode === "portal"}
          onClick={() => setMode("portal")}
          className={\`rounded-md border px-2 py-0.5 transition \${
            mode === "portal"
              ? "border-dojo-ember text-dojo-ember"
              : "border-dojo-border text-dojo-muted hover:text-dojo-text"
          }\`}
        >
          through a portal
        </button>
      </div>
      <section className="relative h-36 overflow-hidden rounded-lg border border-dojo-border bg-dojo-surface/40 p-3">
        <h4 className="text-xs uppercase tracking-wider text-dojo-muted">Technique panel</h4>
        <p className="mt-1 max-w-xs text-[11px] text-dojo-muted">
          This panel has a fixed height and hides anything that overflows it.
        </p>
        <button
          ref={openRef}
          type="button"
          onClick={() => setIsOpen(true)}
          className="mt-2 rounded-md border border-dojo-border px-3 py-1 text-xs transition hover:border-dojo-ember hover:text-dojo-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dojo-ember"
        >
          Open details
        </button>
        <p className="mt-1 text-[11px] text-dojo-muted">Pinned: {pinned ?? "nothing yet"}</p>
        {isOpen && mode === "in-place" && dialog}
      </section>
      {isOpen && mode === "portal" && createPortal(dialog, document.body)}
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          index={index}
          onClose={removeToast}
        />
      ))}
      <p className="text-xs text-dojo-muted">
        {mode === "portal"
          ? "Portal: the dialog is a child of document.body, so the panel cannot clip it."
          : "In place: the dialog is still inside the panel, so its bottom is cut off."}
      </p>
    </div>
  );
}`,
  component: PortalsDemo,
};
