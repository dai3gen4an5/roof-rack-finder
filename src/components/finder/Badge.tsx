export type RankBadgeVariant = "best-overall" | "max-capacity" | "best-value" | "compact-fit";

const RANK_BADGE_LABELS: Record<RankBadgeVariant, string> = {
  "best-overall": "Best Overall",
  "max-capacity": "Max Capacity",
  "best-value": "Best Value",
  "compact-fit": "Compact Fit",
};

/** Monochrome outline chip — rank badges never compete with Verified Fit's
 * accent fill for attention. Color is reserved for the one trust signal. */
export function RankBadge({ variant, className }: { variant: RankBadgeVariant; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-line-strong px-3 py-1 text-[11px] font-bold tracking-wide text-ink uppercase ${className ?? ""}`}
    >
      {RANK_BADGE_LABELS[variant]}
    </span>
  );
}

/** The single accent-filled badge in the system — reserved for the core
 * trust claim (manufacturer-verified fitment). */
export function VerifiedFitBadge({ verified = true }: { verified?: boolean }) {
  if (!verified) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1 text-[11px] font-bold tracking-wide text-ink-muted uppercase">
        Unverified Fit
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-clay px-3 py-1 text-[11px] font-bold tracking-wide text-paper uppercase">
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
        <path
          fillRule="evenodd"
          d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
          clipRule="evenodd"
        />
      </svg>
      Verified Fit
    </span>
  );
}
