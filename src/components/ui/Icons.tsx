import type { ReactNode } from "react";

/**
 * A tiny authored icon set — one stroke weight, one box, `currentColor`.
 * Icons are drawn here rather than pulled from a library: the site needs
 * seven, and a dependency would ship a few hundred more.
 */
function Icon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

export function MenuIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Icon>
  );
}

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}

export function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M12 19V5m0 0-6 6m6-6 6 6" />
    </Icon>
  );
}

export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M5 12h14m0 0-6-6m6 6-6 6" />
    </Icon>
  );
}

export function BoltIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </Icon>
  );
}

export function FlaskIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" />
      <path d="M7.5 15h9" />
    </Icon>
  );
}

export function CodeIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />
    </Icon>
  );
}

export function CompassIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </Icon>
  );
}
