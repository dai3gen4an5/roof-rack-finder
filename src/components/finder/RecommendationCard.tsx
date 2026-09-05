import { INSTALLATION_TYPE_LABELS } from "@/lib/types";
import type { PreferenceId, PriceRange, Recommendation, UseCaseId } from "@/lib/types";
import { RankBadge, VerifiedFitBadge } from "@/components/finder/Badge";
import { OverlandScene } from "@/components/visuals/OverlandScene";
import { rankBadgeForPreference } from "@/lib/recommend";

function formatPrice(price: PriceRange): string {
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  return price.min === price.max ? fmt(price.min) : `${fmt(price.min)}–${fmt(price.max)}`;
}

const TOPPER_FOR_USE_CASE: Record<UseCaseId, "tent" | "cargo" | "bike"> = {
  "rooftop-tent": "tent",
  "cargo-storage": "cargo",
  "kayak-surf": "cargo",
  "bike-ski": "bike",
  overlanding: "cargo",
};

export function RecommendationCard({
  recommendation,
  variant = "secondary",
  rank,
  preference,
  useCase,
}: {
  recommendation: Recommendation;
  /** "primary" gives the card the larger, lead-result treatment. */
  variant?: "primary" | "secondary";
  /** 0-indexed position within the current ranked list; drives the rank badge on rank 0. */
  rank?: number;
  preference?: PreferenceId;
  useCase?: UseCaseId;
}) {
  const { product, merchant, fitment, generation, reasons } = recommendation;
  const ctaUrl = product.affiliateUrl ?? product.outboundUrl;
  const isPrimary = variant === "primary";
  const rankBadge = rank === 0 && preference ? rankBadgeForPreference(preference) : null;
  const topper = useCase ? TOPPER_FOR_USE_CASE[useCase] : product.rackLength === "full" ? "cargo" : "tent";

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border bg-paper shadow-sm transition-shadow hover:shadow-lg sm:flex-row ${
        isPrimary ? "border-clay/40 shadow-md" : "border-line"
      }`}
    >
      <div className={`relative shrink-0 bg-cream ${isPrimary ? "sm:w-64" : "sm:w-44"}`}>
        <OverlandScene topper={topper} className="h-32 w-full object-cover sm:h-full" />
        {rankBadge && (
          <RankBadge variant={rankBadge} className="absolute top-3 left-3 shadow-sm" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-wide text-ink-soft uppercase">{merchant.name}</p>
            <h3
              className={`font-display font-semibold text-ink ${isPrimary ? "text-2xl" : "text-lg"}`}
            >
              {product.name}
            </h3>
          </div>
          <VerifiedFitBadge verified={fitment.verificationStatus === "verified"} />
        </div>

        <div className="flex items-baseline gap-2">
          <span className={`font-display font-bold text-ink ${isPrimary ? "text-3xl" : "text-2xl"}`}>
            {formatPrice(product.referencePrice)}
          </span>
          <span className="text-xs text-ink-soft">reference price</span>
        </div>
        {product.salePrice && (
          <p className="-mt-3 text-xs font-semibold text-clay">
            Sale price as of {product.priceVerifiedAt}: {formatPrice(product.salePrice)} — confirm
            it&apos;s still active before buying.
          </p>
        )}

        {reasons.length > 0 && (
          <div className="rounded-xl bg-cream/70 p-3.5">
            <p className="text-xs font-bold tracking-wide text-olive-dark uppercase">
              Why it matches your setup
            </p>
            <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-ink-muted">
              {reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-ink-soft">Verified fit</dt>
            <dd className="text-ink">
              {generation.name} ({generation.yearStart}–{generation.yearEnd})
            </dd>
          </div>
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

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <div className="text-xs text-ink-soft">
            <p>
              <a
                href={fitment.sourceUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="underline decoration-dotted underline-offset-2 hover:text-ink"
              >
                Fitment source: manufacturer product page ↗
              </a>
            </p>
            <p className="mt-0.5">
              ✓ Verified from manufacturer · Last checked {fitment.lastVerifiedDate}
            </p>
          </div>
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-clay-dark"
          >
            View at manufacturer
          </a>
        </div>
      </div>
    </article>
  );
}
