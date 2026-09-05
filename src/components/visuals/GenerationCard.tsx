import Link from "next/link";
import type { Generation } from "@/lib/types";
import { OverlandScene } from "@/components/visuals/OverlandScene";

interface GenerationCardContentProps {
  generation: Generation;
  ctaLabel?: string;
  topper?: "tent" | "cargo" | "bike" | "none";
}

function GenerationCardContent({ generation, ctaLabel, topper = "tent" }: GenerationCardContentProps) {
  return (
    <>
      <div className="overflow-hidden rounded-t-2xl bg-cream">
        <OverlandScene topper={topper} className="h-40 w-full object-cover sm:h-48" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <p className="text-xs font-bold tracking-wide text-clay uppercase">
          {generation.yearStart}–{generation.yearEnd}
        </p>
        <h3 className="font-display text-2xl font-semibold text-ink">{generation.name}</h3>
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-clay">
          {ctaLabel}
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 0 1 .75-.75h10.638L11.29 6.16a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.098-3.09H3.75A.75.75 0 0 1 3 10Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
    </>
  );
}

/** A big visual card linking to a generation's landing page. */
export function GenerationLinkCard({
  generation,
  href,
  ctaLabel = "Explore this generation",
  topper,
}: GenerationCardContentProps & { href: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <GenerationCardContent generation={generation} ctaLabel={ctaLabel} topper={topper} />
    </Link>
  );
}

/** The same big visual card as a selectable button, for the finder's generation step. */
export function GenerationSelectCard({
  generation,
  onSelect,
  ctaLabel = "Choose this generation",
  topper,
}: GenerationCardContentProps & { onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper text-left shadow-sm transition-all hover:-translate-y-1 hover:border-clay hover:shadow-lg"
    >
      <GenerationCardContent generation={generation} ctaLabel={ctaLabel} topper={topper} />
    </button>
  );
}
