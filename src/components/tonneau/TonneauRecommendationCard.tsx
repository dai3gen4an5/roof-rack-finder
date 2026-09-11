import type { PriceRange, Recommendation } from "@/domains/tonneau/types";
import { VerifiedFitBadge } from "@/components/finder/Badge";

function formatPrice(price: PriceRange): string {
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  return price.min === price.max ? fmt(price.min) : `${fmt(price.min)}–${fmt(price.max)}`;
}

const COVER_TYPE_LABELS: Record<string, string> = {
  "hard-folding": "Hard folding",
  "hard-rolling": "Hard rolling",
  "hard-quick-latch": "Hard quick-latch",
  "hard-flip-up": "Hard flip-up",
};

/**
 * Deliberately its own component, not a reuse/fork of Roof Rack's
 * `RecommendationCard.tsx` — same reasoning as `TonneauFinderWizard.tsx`.
 * Reuses only the genuinely generic `VerifiedFitBadge` (no roof-rack
 * vocabulary in it at all), the same way both domains' recommend.ts reuse
 * MMFE Core.
 */
export function TonneauRecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const { product, merchant, fitment, generation, reasons } = recommendation;
  const ctaUrl = product.affiliateUrl ?? product.outboundUrl;

  return (
    <article className="flex flex-col border border-line bg-paper">
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-wide text-ink-soft uppercase">{merchant.name}</p>
            <h3 className="font-display text-lg font-semibold text-ink">{product.name}</h3>
          </div>
          <VerifiedFitBadge verified={fitment.verificationStatus === "verified"} />
        </div>

        <p className="text-sm text-ink-muted">
          Verified fit: {generation.name} ({generation.yearStart}–{generation.yearEnd})
        </p>

        {reasons.length > 0 && (
          <div className="border-l-2 border-clay pl-4">
            <p className="text-xs font-bold tracking-wide text-ink-soft uppercase">Why it matches</p>
            <ul className="mt-1.5 space-y-1 text-sm text-ink-muted">
              {reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-4 text-sm">
          <div>
            <dt className="text-ink-soft">Cover type</dt>
            <dd className="text-ink">{COVER_TYPE_LABELS[product.coverType] ?? product.coverType}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Requires Deck Rail System</dt>
            <dd className="text-ink">{product.requiresDeckRailSystem ? "Yes" : "Not stated"}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
          <p className="text-xl font-bold text-ink">
            {formatPrice(product.referencePrice)}{" "}
            <span className="text-xs font-normal text-ink-soft">reference price</span>
          </p>
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-clay"
          >
            View at manufacturer
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-soft">
          <a
            href={fitment.sourceUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="underline decoration-dotted underline-offset-2 hover:text-ink"
          >
            Fitment source: manufacturer/seller product page ↗
          </a>
          <span>Verified · Last checked {fitment.lastVerifiedDate}</span>
        </div>
      </div>
    </article>
  );
}
