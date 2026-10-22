/**
 * The dojo mark: a belt with a buckle, prong and two holes. The belt ranks every
 * lesson on the site, so the mark and the title describe the same place. It is a
 * buckle rather than a knot because the knot read as a stick figure at 28px.
 * It inherits `currentColor`.
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
      <rect
        x="4"
        y="15.5"
        width="32"
        height="9"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <rect
        x="14.5"
        y="11.5"
        width="11"
        height="17"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M20 15.5v9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="20" r="0.9" fill="currentColor" />
      <circle cx="11" cy="20" r="0.9" fill="currentColor" />
    </svg>
  );
}
