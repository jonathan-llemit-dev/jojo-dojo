import type { BeltRank } from "./types";

/**
 * Belt rank -> what the reader is told, and what colour it is.
 *
 * Why this file exists: the sidebar, the topic grid, and the topic detail page all
 * needed the same belt colours. Keeping the mapping here means adding a new belt (or
 * changing a label) is a one-line edit in one file, instead of three edits that can
 * drift apart.
 *
 * One entry per belt rather than an if/else chain, because three belts need three
 * *different* looks. The chain this replaced sent white and blue both to `dojo-ember`,
 * so a blue belt was indistinguishable from a white one — invisible for as long as every
 * topic was white, and wrong the moment that stopped being true.
 *
 * Two helpers on purpose, because a badge and a dot need different classes:
 * - a `badge` is a bordered pill  -> needs a border colour, a text colour and a tint
 * - a `dot`   is a filled circle  -> needs a background colour
 * Passing the badge classes to a dot is why the little coloured dots used to be
 * invisible: `text-dojo-ember` colours text (a dot has none) and `border-dojo-ember`
 * only sets a border colour (a dot has no border width).
 *
 * **Why "black" is crimson.** The page background is `#0f0d0b`, so a literally black dot
 * is invisible on it. Crimson is the strongest accent the dark palette has, which is
 * what the top rank should look like; the belt's *name* still reads "Black belt"
 * wherever the word is shown.
 *
 * **Why the reader gets a word and not a colour.** "Beginner" needs no explaining, and a
 * belt name alone does not survive translation or a first visit. Every belt therefore
 * carries a plain-language `level` alongside its `name`, and the topic grid shows the
 * level — the metaphor is taught once, in that grid's legend.
 */
const BELTS: Record<BeltRank, { level: string; name: string; badge: string; dot: string }> = {
  white: {
    level: "Beginner",
    name: "White belt",
    badge: "border-dojo-muted/60 bg-dojo-muted/10 text-dojo-muted",
    dot: "bg-dojo-muted",
  },
  blue: {
    level: "Intermediate",
    name: "Blue belt",
    badge: "border-dojo-azure/60 bg-dojo-azure/10 text-dojo-azure",
    dot: "bg-dojo-azure",
  },
  black: {
    level: "Advanced",
    name: "Black belt",
    badge: "border-dojo-crimson/60 bg-dojo-crimson/10 text-dojo-crimson",
    dot: "bg-dojo-crimson",
  },
};

/** Easiest -> hardest. Drives the grid's legend, so the key cannot drift from the cards. */
export const BELT_ORDER: BeltRank[] = ["white", "blue", "black"];

/** The plain word the reader gets: "Beginner" | "Intermediate" | "Advanced". */
export function beltLevel(belt: BeltRank): string {
  return BELTS[belt].level;
}

/** The belt's own name, for the lesson header where there is room for the metaphor. */
export function beltName(belt: BeltRank): string {
  return BELTS[belt].name;
}

/** Classes for a bordered badge/pill, e.g. `<span className={\`rounded-full border ${beltBadgeClass(belt)}\`}>`. */
export function beltBadgeClass(belt: BeltRank): string {
  return BELTS[belt].badge;
}

/** Classes for a small filled dot, e.g. `<span className={\`h-2 w-2 rounded-full ${beltDotClass(belt)}\`} />`. */
export function beltDotClass(belt: BeltRank): string {
  return BELTS[belt].dot;
}
