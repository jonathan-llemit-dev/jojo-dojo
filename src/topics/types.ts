import type { ComponentType } from "react";

/** Dojo belt rank — also drives the sidebar badge color. */
export type BeltRank = "white" | "blue" | "black";

/** A single React lesson / topic served by the tutorial site. */
export interface Topic {
  /** URL-friendly identifier, e.g. "use-state" -> /dojo/topic/use-state */
  slug: string;
  /** Shown in the sidebar list and as the topic heading. */
  title: string;
  /** Dojo belt rank — white (beginner) -> blue -> black (advanced). */
  belt: BeltRank;
  /** One-line summary shown in the sidebar topic list. */
  description: string;
  /** Full lesson explanation rendered in the content panel (optional). */
  longDescription?: string;
  /** Sample code snippet displayed in a <pre><code> block (optional). */
  codeExample?: string;
  /** The live working component rendered in the content panel. */
  component: ComponentType;
}
