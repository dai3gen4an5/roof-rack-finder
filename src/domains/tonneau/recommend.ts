import { isEligibleFitment } from "@/mmfe/recommend/eligibility";
import { getGenerationForYear } from "@/domains/tonneau/data/generations";
import { getFitmentsForGeneration } from "@/domains/tonneau/data/fitments";
import { getProductById } from "@/domains/tonneau/data/products";
import { getMerchantById } from "@/domains/tonneau/data/merchants";
import { getTruckById } from "@/domains/tonneau/data/trucks";
import { getBedLengthsForGeneration } from "@/domains/tonneau/data/bedLengths";
import type {
  Recommendation,
  RecommendationRequest,
  RecommendationResult,
} from "@/domains/tonneau/types";

/**
 * Pure, data-driven recommendation logic for the TonneauFit domain — the
 * second MMFE domain, built to test whether `mmfe/recommend/eligibility.ts`
 * is genuinely reusable unmodified. It is: every gate below composes
 * `isEligibleFitment` exactly the way `domains/roof-rack/recommend.ts`
 * does, with zero changes to Core.
 *
 * The one domain-specific gate Core doesn't (and shouldn't) know about is
 * the factory Deck Rail System requirement — see `isEligibleCandidate`.
 */

/** A candidate before ranking/explanation is applied. */
export type Candidate = Omit<Recommendation, "reasons">;

/**
 * Hard requirements every recommendation must pass, checked in this order,
 * all mandatory, none a scoring weight:
 *   1. the requested year falls within the fitment's own year range, if
 *      narrower than the generation (e.g. AL3's 2024-2025-only 4th Gen fitment)
 *   2. the fitment's bed length matches the requested bed length exactly
 *   3. the fitment itself is manufacturer-verified
 *   4. if the product requires the factory Deck Rail System and the
 *      requester affirmatively said they don't have it, it's excluded
 *
 * The first three are `mmfe/recommend/eligibility.ts`'s `isEligibleFitment`
 * — the same domain-agnostic gates Roof Rack uses, with this domain's own
 * field names (`bedLengthId`, not `variantId`) translated at the call site,
 * exactly like Roof Rack translates `yearStart`/`yearEnd` into a
 * `NumericRangeConstraint`. The fourth gate is Tonneau-specific and has no
 * Core equivalent — Deck Rail System is never assumed; a product that
 * needs it is excluded only when the requester explicitly said `false`,
 * never merely because it wasn't asked (`undefined` never excludes).
 */
export function isEligibleCandidate(
  candidate: Candidate,
  year: RecommendationRequest["year"],
  bedLengthId: RecommendationRequest["bedLengthId"],
  hasDeckRailSystem: RecommendationRequest["hasDeckRailSystem"]
): boolean {
  const coreEligible = isEligibleFitment({
    verificationStatus: candidate.fitment.verificationStatus,
    fitmentVariantId: candidate.fitment.bedLengthId,
    requestedVariantId: bedLengthId,
    range: { min: candidate.fitment.yearStart, max: candidate.fitment.yearEnd },
    point: year,
  });

  if (!coreEligible) return false;

  if (candidate.product.requiresDeckRailSystem && hasDeckRailSystem === false) {
    return false;
  }

  return true;
}

function sortForPreference(
  candidates: Candidate[],
  preference: RecommendationRequest["preference"]
): Candidate[] {
  const sorted = [...candidates];
  switch (preference) {
    case "hard-folding":
      // A hard filter, not just a sort — same pattern as Roof Rack's
      // "smaller-three-quarter" length preference: only show matching
      // products, ranked by price among themselves.
      return sorted
        .filter((c) => c.product.coverType === "hard-folding")
        .sort((a, b) => a.product.referencePrice.min - b.product.referencePrice.min);
    case "lowest-price":
    default:
      sorted.sort((a, b) => a.product.referencePrice.min - b.product.referencePrice.min);
      return sorted;
  }
}

function formatMoney(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

/** Builds 1–2 concrete, rule-based "why this cover" reasons. */
export function buildReasons(
  candidate: Candidate,
  rank: number,
  rankedGroup: Candidate[],
  request: RecommendationRequest
): string[] {
  const reasons: string[] = [];
  const { product } = candidate;
  const top = rankedGroup[0];

  if (request.preference === "hard-folding") {
    reasons.push(`Hard folding cover — low-profile, flat when closed.`);
  }

  if (rank === 0) {
    reasons.push(`Lowest reference price among verified fits: ${formatMoney(product.referencePrice.min)}.`);
  } else if (top) {
    const diff = product.referencePrice.min - top.product.referencePrice.min;
    if (diff > 0) {
      reasons.push(`${formatMoney(diff)} more than the ${top.product.name} above.`);
    }
  }

  if (product.requiresDeckRailSystem) {
    reasons.push(`Requires the factory Deck Rail System to install.`);
  }

  return reasons.slice(0, 3);
}

export function recommendCovers(request: RecommendationRequest): RecommendationResult {
  const generation = getGenerationForYear(request.truckId, request.year);

  if (!generation) {
    return {
      generation: null,
      recommendations: [],
      note: `We don't have verified tonneau cover fitment data for model year ${request.year} yet.`,
    };
  }

  const fitments = getFitmentsForGeneration(generation.id);

  const allCandidates: Candidate[] = fitments.flatMap((fitment) => {
    const product = getProductById(fitment.productId);
    const merchant = product ? getMerchantById(product.merchantId) : undefined;
    if (!product || !merchant) return [];
    return [{ product, merchant, fitment, generation }];
  });

  const eligible = allCandidates.filter((c) =>
    isEligibleCandidate(c, request.year, request.bedLengthId, request.hasDeckRailSystem)
  );
  const sorted = sortForPreference(eligible, request.preference);

  if (sorted.length === 0) {
    const truck = getTruckById(request.truckId);
    const truckLabel = truck ? `${truck.make} ${truck.model}` : "truck";
    const needsBedLength =
      request.bedLengthId == null && getBedLengthsForGeneration(generation.id).length > 0;
    const note = needsBedLength
      ? `Select your bed length to see verified fits for the ${generation.name} ${truckLabel} (${generation.yearStart}–${generation.yearEnd}).`
      : `No verified tonneau cover matches this combination yet for the ${generation.name} ${truckLabel} (${generation.yearStart}–${generation.yearEnd}).`;
    return { generation, recommendations: [], note };
  }

  const recommendations: Recommendation[] = sorted.map((candidate, index) => ({
    ...candidate,
    reasons: buildReasons(candidate, index, sorted, request),
  }));

  return { generation, recommendations, note: null };
}
