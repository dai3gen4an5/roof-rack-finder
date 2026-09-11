import type { NumericRangeConstraint, VerificationStatus } from "@/mmfe/types";

/**
 * MMFE Core — the domain-agnostic eligibility gates every finder needs:
 * verification status, variant scoping, and numeric-range narrowing (year
 * ranges today; any other bounded numeric axis a future domain has).
 *
 * Deliberately does NOT know about `Fitment`, `Product`, or use-case
 * matching — those involve domain-specific field names and product
 * attributes. A domain composes these primitives into its own eligibility
 * function; see `domains/roof-rack/recommend.ts` `isEligibleCandidate`.
 */

/** Whether `value` falls inside an optional `[min, max]` window. A missing
 * bound on either side means "no constraint on that side" — never treated
 * as zero or as excluding the value. */
export function matchesRangeConstraint(
  constraint: NumericRangeConstraint | undefined,
  value: number
): boolean {
  const min = constraint?.min ?? -Infinity;
  const max = constraint?.max ?? Infinity;
  return value >= min && value <= max;
}

/**
 * A fitment with no `variantId` applies to every variant of its scope (or
 * the scope has no variants at all) and is always eligible, regardless of
 * what was requested. A fitment scoped to a specific variant only matches
 * an EXACT request for that same variant — never a "closest" or default
 * variant, and never eligible when no variant was requested at all.
 */
export function matchesVariant(
  fitmentVariantId: string | null | undefined,
  requestedVariantId: string | undefined
): boolean {
  return fitmentVariantId == null || fitmentVariantId === requestedVariantId;
}

/** A fitment is only ever eligible when it is itself source-verified —
 * never an unverified guess. */
export function isVerifiedFitment(status: VerificationStatus): boolean {
  return status === "verified";
}

/**
 * Combines the three universal eligibility gates, checked in this order, all
 * mandatory, none a scoring weight. Domain-specific gates (e.g. "the product
 * supports the requested use case") are layered on top by the calling
 * domain — this function only knows about generic Fitment concerns.
 */
export function isEligibleFitment(params: {
  verificationStatus: VerificationStatus;
  fitmentVariantId?: string | null;
  requestedVariantId?: string;
  range?: NumericRangeConstraint;
  point: number;
}): boolean {
  return (
    isVerifiedFitment(params.verificationStatus) &&
    matchesVariant(params.fitmentVariantId, params.requestedVariantId) &&
    matchesRangeConstraint(params.range, params.point)
  );
}
