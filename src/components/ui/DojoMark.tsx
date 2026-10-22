/**
 * The dojo mark: an actual karate belt, not a buckle. A wide belt crosses the
 * mark, a bulky knot sits over it, and two wide ends hang below with angled tips
 * and two rank stripes. It inherits `currentColor`; the folds, stitching and rank
 * stripes are cut out with the page background.
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
      <path
        d="M1 10 4 8h32l3 2v5l-3 2H4l-3-2z"
        fill="currentColor"
      />
      <path
        d="M14 17C12 24 9 31 7 36l5.5 1C14.5 31 16.5 24 19 17Z"
        fill="currentColor"
      />
      <path
        d="M26 17c2 7 5 14 7 19l-5.5 1C25.5 31 23.5 24 21 17Z"
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
        d="M5 10.5h30M5 15.5h30"
        stroke="var(--color-dojo-bg)"
        strokeWidth="0.8"
        strokeDasharray="2 2"
      />
      <path
        d="M28.5 29.5l4.5-1M29.4 32.5l4.5-1"
        stroke="var(--color-dojo-bg)"
        strokeWidth="1.2"
      />
    </svg>
  );
}
