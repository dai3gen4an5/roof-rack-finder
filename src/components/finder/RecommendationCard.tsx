import { INSTALLATION_TYPE_LABELS } from "@/lib/types";
import type { PreferenceId, PriceRange, Recommendation } from "@/lib/types";
import { RankBadge, VerifiedFitBadge } from "@/components/finder/Badge";
import { ProductMedia } from "@/components/media/ProductMedia";
import { rankBadgeForPreference } from "@/lib/recommend";

function formatPrice(price: PriceRange): string {
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  return price.min === price.max ? fmt(price.min) : `${fmt(price.min)}–${fmt(price.max)}`;
}

/**
 * Visual hierarchy, deliberately in this order: product media, product
 * identity, verified fit, why it matches, specifications, price, CTA.
 * Price is real information, not the card's visual climax — the product
 * itself is.
 */
export function RecommendationCard({
  recommendation,
  variant = "secondary",
  rank,
  preference,
}: {
  recommendation: Recommendation;
  /** "primary" gives the card the larger, lead-result treatment. */
  variant?: "primary" | "secondary";
  /** 0-indexed position within the current ranked list; drives the rank badge on rank 0. */
  rank?: number;
  preference?: PreferenceId;
}) {
  const { product, merchant, fitment, generation, reasons } = recommendation;
  const ctaUrl = product.affiliateUrl ?? product.outboundUrl;
  const isPrimary = variant === "primary";
  const rankBadge = rank === 0 && preference ? rankBadgeForPreference(preference) : null;

  return (
    <article className={`flex flex-col border bg-paper sm:flex-row ${isPrimary ? "border-ink" : "border-line"}`}>
      <ProductMedia
        productName={product.name}
        className={`shrink-0 ${isPrimary ? "aspect-square sm:w-72" : "aspect-square sm:w-48"}`}
      />

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-wide text-ink-soft uppercase">{merchant.name}</p>
            <h3
              className={`font-display font-semibold text-ink ${isPrimary ? "text-2xl" : "text-lg"}`}
            >
              {product.name}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {rankBadge && <RankBadge variant={rankBadge} />}
            <VerifiedFitBadge verified={fitment.verificationStatus === "verified"} />
          </div>
        </div>

        <p className="text-sm text-ink-muted">
          Verified fit: {generation.name} ({generation.yearStart}–{generation.yearEnd})
        </p>

        {reasons.length > 0 && (
          <div className="border-l-2 border-clay pl-4">
            <p className="text-xs font-bold tracking-wide text-ink-soft uppercase">
              Why it matches your setup
            </p>
            <ul className="mt-1.5 space-y-1 text-sm text-ink-muted">
              {reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-ink-soft">Coverage</dt>
            <dd className="text-ink">{product.rackLength === "full" ? "Full-length" : "3/4-length"}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Installation</dt>
            <dd className="text-ink">{INSTALLATION_TYPE_LABELS[product.installationType]}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Dynamic capacity</dt>
            <dd className="text-ink">
              {product.dynamicCapacityLbs != null ? `${product.dynamicCapacityLbs} lb` : "Not published"}
            </dd>
          </div>
          <div>
            <dt className="text-ink-soft">Static capacity</dt>
            <dd className="text-ink">
              {product.staticCapacityLbs != null ? `${product.staticCapacityLbs} lb` : "Not published"}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
          <div>
            <p className="text-xl font-bold text-ink">
              {formatPrice(product.referencePrice)}{" "}
              <span className="text-xs font-normal text-ink-soft">reference price</span>
            </p>
            {product.salePrice && (
              <p className="text-xs font-semibold text-clay">
                Sale price as of {product.priceVerifiedAt}: {formatPrice(product.salePrice)} — confirm
                it&apos;s still active.
              </p>
            )}
          </div>
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
            Fitment source: manufacturer product page ↗
          </a>
          <span>Verified from manufacturer · Last checked {fitment.lastVerifiedDate}</span>
        </div>
      </div>
    </article>
  );
}
