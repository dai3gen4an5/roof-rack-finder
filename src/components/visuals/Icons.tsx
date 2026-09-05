/**
 * Small original line-icon set (stroke, currentColor) used across the
 * finder's selection cards and trust strip. Kept as one file since each
 * icon is a handful of path lines.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function TentIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 L21 19H3Z" />
      <path d="M12 3 L6 19" />
      <path d="M12 3 L18 19" />
      <path d="M9.5 19 L12 13.5 L14.5 19" />
    </svg>
  );
}

export function CargoBoxIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z" />
      <path d="M3 8.5v7L12 20l9-4.5v-7" />
      <path d="M12 13v7" />
    </svg>
  );
}

export function KayakIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2 15c3-4 6-6 10-6s7 2 10 6c-3 2-6 3-10 3s-7-1-10-3Z" />
      <path d="M12 9v9" />
      <path d="M6 6l3 2M18 6l-3 2" />
    </svg>
  );
}

export function BikeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="6" cy="17" r="3.2" />
      <circle cx="18" cy="17" r="3.2" />
      <path d="M6 17 10 9h4l4 8" />
      <path d="M10 9 9 6h-2" />
      <path d="M10 9l3 4" />
    </svg>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5 13 13l-3.5 1.5L11 11z" />
    </svg>
  );
}

export function ScaleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v18M7 21h10" />
      <path d="M4 7h16" />
      <path d="M4 7 2 12a2.5 2.5 0 0 0 5 0Z" />
      <path d="M20 7l-2 5a2.5 2.5 0 0 0 5 0Z" />
    </svg>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3h6a2 2 0 0 1 2 2v6l-9 9-8-8Z" />
      <circle cx="16.5" cy="7.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function StarBalanceIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v18" />
      <path d="M5 8h14" />
      <path d="M5 8 3 13a2.2 2.2 0 0 0 4.4 0Z" />
      <path d="M19 8l-2 5a2.2 2.2 0 0 0 4.4 0Z" />
    </svg>
  );
}

export function CompactRackIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="10" width="10" height="3" rx="1" />
      <path d="M6 10V7M12 10V7" />
      <path d="M4 16h16" />
    </svg>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 4 6v6c0 4.5 3.4 7.4 8 9 4.6-1.6 8-4.5 8-9V6Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function NoAiIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="7" width="16" height="12" rx="2" />
      <path d="M9 7V5.5A2.5 2.5 0 0 1 11.5 3h1A2.5 2.5 0 0 1 15 5.5V7" />
      <circle cx="9" cy="13" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13" r="1.1" fill="currentColor" stroke="none" />
      <path d="M9 16.5h6" />
    </svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12a8 8 0 0 1 14-5.3L20 8" />
      <path d="M20 4v4h-4" />
      <path d="M20 12a8 8 0 0 1-14 5.3L4 16" />
      <path d="M4 20v-4h4" />
    </svg>
  );
}
