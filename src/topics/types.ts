import type { ComponentType } from "react";

/**
 * Dojo belt rank — how advanced a lesson is. `beltStyles.ts` owns what each one is
 * called and what colour it gets; nothing else should hardcode either.
 */
export type BeltRank = "white" | "blue" | "black";

/** A single React lesson / topic served by the tutorial site. */
export interface Topic {
  /** URL-friendly identifier, e.g. "use-state" -> /dojo/topic/use-state */
  slug: string;
  /** Full topic heading — the page `<h1>` and the index-card title. */
  title: string;
  /**
   * Compact label for the sidebar list. The full `title` is a "Concept — subtitle"
   * string that gets truncated in a 16rem sidebar, so navigation shows this instead:
   * the concept alone, short enough to scan at a glance.
   */
  shortTitle: string;
  /**
   * Dojo belt rank — how advanced the lesson is: white for the fundamentals, blue for
   * the hook material that needs care, black for topics combining several ideas.
   * Shown to the reader as a plain word ("Beginner" / "Intermediate" / "Advanced") with
   * the belt name kept for the lesson header.
   */
  belt: BeltRank;
  /** One-line summary rendered as plain text in the topic grid (`TopicIndex.tsx`). */
  description: string;
  /** Full lesson explanation rendered in the content panel (optional). */
  longDescription?: string;
  /** Sample code snippet displayed in a <pre><code> block (optional). */
  codeExample?: string;
  /** The live working component rendered in the content panel. */
  component: ComponentType;
}
