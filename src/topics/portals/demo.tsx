// ─────────────────────────────────────────────
// Topic: Portals — render a component outside the parent DOM tree
// Added: 2026-10-19 | Status: LD (lecture live — build-on task outstanding)
// ─────────────────────────────────────────────
// (Statuses: OK = Mastered, LD = Learning, RV = Reviewing.)
//
// A dialog opened from inside a scrolling panel has a DOM problem, not a React one: the panel
// clips whatever is inside it. `createPortal` renders the markup into `document.body` while
// leaving the component in the React tree, so props, state and event bubbling do not change.
//
// The demo renders the same dialog two ways — inside the panel and through a portal — so the
// clipping is visible rather than described.
//
// Build-on task for this topic: see NOTES.md entry 15.

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type RenderMode = "in-place" | "portal";

type DetailsDialogProps = {
  titleId: string;
  fixed: boolean;
  onClose: () => void;
};

function DetailsDialog({ titleId, fixed, onClose }: DetailsDialogProps) {
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
      className={`${fixed ? "fixed items-center" : "absolute items-start"} inset-0 z-50 flex justify-center bg-dojo-bg/80 p-3`}
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
            Roundhouse kick
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
      </div>
    </div>
  );
}

export function PortalsDemo() {
  const titleId = useId();
  const openRef = useRef<HTMLButtonElement>(null);
  const [mode, setMode] = useState<RenderMode>("portal");
  const [isOpen, setIsOpen] = useState(false);

  function closeDialog() {
    setIsOpen(false);
    openRef.current?.focus();
  }

  const dialog = (
    <DetailsDialog titleId={titleId} fixed={mode === "portal"} onClose={closeDialog} />
  );

  // A transformed ancestor is common on cards (animations, stacking contexts), and it becomes the
  // containing block for `fixed` children. The portal is what escapes it.
  return (
    <div className="flex w-full max-w-md flex-col gap-3 [transform:translateZ(0)]">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-dojo-muted">Render:</span>
        <button
          type="button"
          aria-pressed={mode === "in-place"}
          onClick={() => setMode("in-place")}
          className={`rounded-md border px-2 py-0.5 transition ${
            mode === "in-place"
              ? "border-dojo-ember text-dojo-ember"
              : "border-dojo-border text-dojo-muted hover:text-dojo-text"
          }`}
        >
          in place
        </button>
        <button
          type="button"
          aria-pressed={mode === "portal"}
          onClick={() => setMode("portal")}
          className={`rounded-md border px-2 py-0.5 transition ${
            mode === "portal"
              ? "border-dojo-ember text-dojo-ember"
              : "border-dojo-border text-dojo-muted hover:text-dojo-text"
          }`}
        >
          through a portal
        </button>
      </div>

      <section className="relative h-32 overflow-hidden rounded-lg border border-dojo-border bg-dojo-surface/40 p-3">
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

        {isOpen && mode === "in-place" && dialog}
      </section>

      {isOpen && mode === "portal" && createPortal(dialog, document.body)}

      <p className="text-xs text-dojo-muted">
        {mode === "portal"
          ? "Portal: the dialog is a child of document.body, so the panel cannot clip it."
          : "In place: the dialog is still inside the panel, so its bottom is cut off."}
      </p>
    </div>
  );
}
