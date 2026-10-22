// ─────────────────────────────────────────────
// Topic: Portals — render a component outside the parent DOM tree
// Added: 2026-10-19 | Status: OK (build-on task complete — toast through a portal, 2026-10-20)
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
// The toast in this file is the build-on feature: a second portal surface, verified 2026-10-20.

import { useCallback, useEffect, useId, useRef, useState } from "react";
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
  // Auto-dismiss after 4 seconds. The cleanup clears the timer when the toast goes away
  // (dismissed, closed, or replaced) — otherwise a stale timer could fire `onClose` again.
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

/**
 * A modal dialog for details. `fixed` controls positioning: `fixed` (portal mode) anchors
 * to the viewport; `absolute` (in-place mode) anchors to the nearest positioned ancestor —
 * which is why it gets clipped inside the panel.
 *
 * Accessibility notes: it moves focus to the Close button on open, closes on Escape, and
 * returns focus to the Open button when it closes — so a screen reader user is never lost
 * in the overlay.
 */
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
    addToast(`${technique} pinned`);
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

  // `transform: translateZ(0)` makes this card a containing block for fixed children. The
  // in-place dialog is `absolute` and the panel clips it; the transform is what would trap
  // a fixed child that stayed here — a non-portaled toast, for example.
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
}
