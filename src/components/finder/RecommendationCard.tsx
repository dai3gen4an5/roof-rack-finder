import { INSTALLATION_TYPE_LABELS } from "@/lib/types";
import type { PriceRange, Recommendation } from "@/lib/types";
import { VerifiedFitBadge } from "@/components/finder/VerifiedFitBadge";

function formatPrice(price: PriceRange): string {
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  return price.min === price.max ? fmt(price.min) : `${fmt(price.min)}–${fmt(price.max)}`;
}

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const { product, merchant, fitment, generation, reasons } = recommendation;
  const ctaUrl = product.affiliateUrl ?? product.outboundUrl;

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-950">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
            {product.name}
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">{merchant.name}</p>
        </div>
        <VerifiedFitBadge status={fitment.verificationStatus} />
      </div>

      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
        ✓ Verified from manufacturer · Last checked: {fitment.lastVerifiedDate}
      </p>

      {reasons.length > 0 && (
        <div className="rounded-md bg-stone-50 p-3 dark:bg-stone-900">
          <p className="text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">
            Why this rack?
          </p>
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-stone-700 dark:text-stone-300">
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <dt className="text-stone-500 dark:text-stone-400">Verified fit</dt>
        <dd className="text-stone-800 dark:text-stone-200">
          {generation.name} ({generation.yearStart}–{generation.yearEnd})
        </dd>

        <dt className="text-stone-500 dark:text-stone-400">Coverage</dt>
        <dd className="text-stone-800 dark:text-stone-200">
          {product.rackLength === "full" ? "Full-length" : "3/4-length"}
        </dd>

        <dt className="text-stone-500 dark:text-stone-400">Installation</dt>
        <dd className="text-stone-800 dark:text-stone-200">
          {INSTALLATION_TYPE_LABELS[product.installationType]}
        </dd>

        <dt className="text-stone-500 dark:text-stone-400">Dynamic capacity</dt>
        <dd className="text-stone-800 dark:text-stone-200">
          {product.dynamicCapacityLbs != null
            ? `${product.dynamicCapacityLbs} lb (manufacturer-stated)`
            : "Not published"}
        </dd>

        <dt className="text-stone-500 dark:text-stone-400">Static capacity</dt>
        <dd className="text-stone-800 dark:text-stone-200">
          {product.staticCapacityLbs != null
            ? `${product.staticCapacityLbs} lb (manufacturer-stated)`
            : "Not published"}
        </dd>

        <dt className="text-stone-500 dark:text-stone-400">Reference price</dt>
        <dd className="text-stone-800 dark:text-stone-200">
          {formatPrice(product.referencePrice)}
          {product.salePrice && (
            <span className="mt-0.5 block text-xs text-orange-700 dark:text-orange-400">
              Sale price as of {product.priceVerifiedAt}: {formatPrice(product.salePrice)} —
              confirm it&apos;s still active before buying.
            </span>
          )}
        </dd>
      </dl>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-3 dark:border-stone-800">
        <a
          href={fitment.sourceUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-xs text-stone-500 underline decoration-dotted underline-offset-2 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
        >
          Fitment source: manufacturer product page ↗
        </a>
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
        >
          View at manufacturer
        </a>
      </div>
      <p className="text-[11px] text-stone-400 dark:text-stone-500">
        Reference price and specs last verified {product.priceVerifiedAt}. Prices change —
        confirm current price on the manufacturer&apos;s site.
      </p>
    </article>
  );
}
