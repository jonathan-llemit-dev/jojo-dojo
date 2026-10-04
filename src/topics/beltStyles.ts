import type { BeltRank } from "./types";

/**
 * Belt rank -> Tailwind class strings.
 *
 * Why this file exists: the sidebar, the topic grid, and the topic detail page all
 * needed the same belt colors. Keeping the mapping here means adding a new belt (or
 * changing a color) is a one-line edit in one file, instead of three edits that can
 * drift apart.
 *
 * There are two helpers on purpose, because a badge and a dot need different classes:
 * - a `badge` is a bordered pill  -> needs a border color + a text color
 * - a `dot`   is a filled circle  -> needs a background color
 * Passing the badge classes to a dot is why the little colored dots used to be
 * invisible: `text-dojo-ember` colors text (a dot has none) and `border-dojo-ember`
 * only sets a border color (a dot has no border width).
 */

/** Classes for a bordered badge/pill, e.g. `<span className={\`rounded-full border ${beltBadgeClass(belt)}\`}>`. */
export function beltBadgeClass(belt: BeltRank): string {
  return belt === "black"
    ? "text-dojo-crimson border-dojo-crimson"
    : "text-dojo-ember border-dojo-ember"; // white | blue share the gold accent
}

/** Classes for a small filled dot, e.g. `<span className={\`h-2 w-2 rounded-full ${beltDotClass(belt)}\`} />`. */
export function beltDotClass(belt: BeltRank): string {
  return belt === "black" ? "bg-dojo-crimson" : "bg-dojo-ember";
}
