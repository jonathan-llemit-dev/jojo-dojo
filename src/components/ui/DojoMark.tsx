/**
 * The dojo mark: an actual karate belt, not a buckle. A wide band crosses the
 * mark, a bulky knot sits over it, and two short ends hang below — one tucked,
 * one with the two rank stripes. The ends stop short on purpose: long tails read
 * as a figure at nav size. It inherits `currentColor`; the folds and rank stripes
 * are cut out with the page background.
 */
export function DojoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M1 10 4 8h32l3 2v5l-3 2H4l-3-2z" fill="currentColor" />
      <path
        d="M14 17C13 20 11.5 24 10.5 27l5.5 1C17 25 17.8 21 19 17Z"
        fill="currentColor"
      />
      <path
        d="M26 17c1.5 5 3.5 10 5 14l-5.5 1C24.5 27 23 22 21 17Z"
        fill="currentColor"
      />
      <ellipse cx="20" cy="14" rx="7" ry="5.5" fill="currentColor" />
      <path
        d="M15 10.5c2.5 2 3 5 1.5 8M24 10.5c-2 3-2.5 6-1 8.5"
        stroke="var(--color-dojo-bg)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M27.5 23l4-1M28.5 26l4-1"
        stroke="var(--color-dojo-bg)"
        strokeWidth="1.2"
      />
    </svg>
  );
}
