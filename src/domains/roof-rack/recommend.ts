import { isEligibleFitment } from "@/mmfe/recommend/eligibility";
import { getGenerationForYear } from "@/domains/roof-rack/data/generations";
import { getFitmentsForGeneration } from "@/domains/roof-rack/data/fitments";
import { getProductById } from "@/domains/roof-rack/data/products";
import { getMerchantById } from "@/domains/roof-rack/data/merchants";
import { getUseCaseById } from "@/domains/roof-rack/data/useCases";
import { getVehicleById } from "@/domains/roof-rack/data/vehicles";
import { getVariantsForGeneration } from "@/domains/roof-rack/data/variants";
import { INSTALLATION_TYPE_LABELS } from "@/domains/roof-rack/types";
import type {
  Product,
  Recommendation,
  RecommendationRequest,
  RecommendationResult,
} from "@/domains/roof-rack/types";

/**
 * Pure, data-driven recommendation logic. Nothing here guesses fitment —
 * it only ranks the fitments already declared as manufacturer-verified in
 * src/domains/roof-rack/data, and only ever recommends a fitment that is
 * itself verified. Ranking rules are deliberately simple, rule-based (no
 * learned weights, no per-product-authored copy) and documented so they can
 * be explained to users (see /toyota/4runner#methodology) and asserted on
 * in tests.
 *
 * The verified/variant/year-range eligibility gates below are composed from
 * `mmfe/recommend/eligibility.ts` — the domain-agnostic mechanism shared by
 * every MMFE finder. Everything past that gate (rack length, capacity,
 * installation type, scoring weights, "why it matches" copy) is roof-rack
 * specific and stays here.
 */

/** A candidate before preference-specific ranking/explanation is applied. */
export type Candidate = Omit<Recommendation, "reasons">;

export function capacityLbs(product: Product): number {
  return product.staticCapacityLbs ?? product.dynamicCapacityLbs ?? 0;
}

function isNonDrill(product: Product): boolean {
  return product.installationType !== "drilled";
}

/**
 * Hard requirements every recommendation must pass, independent of ranking
 * preference — checked in this order, all mandatory, none a scoring
 * weight:
 *   1. the requested year falls within the fitment's own year range, if
 *      it has one narrower than the generation
 *   2. if the fitment is scoped to a specific vehicle configuration (e.g.
 *      a cab-specific truck rack), the requested variant matches exactly
 *   3. the fitment itself is manufacturer-verified (never an unverified guess)
 *   4. the product is suited to the requested use case
 *
 * The first three are `mmfe/recommend/eligibility.ts`'s `isEligibleFitment`
 * — domain-agnostic gates shared by every MMFE finder. Variant and
 * year-range matching are both binary eligibility gates, computed before
 * any scoring — never a "closest" or default variant, never a partial-credit
 * year match. A fitment with no `variantId` applies to every variant of its
 * generation (or the generation has none at all, e.g. every 4Runner fitment
 * today) and is always eligible regardless of what `variantId` was
 * requested. The fourth (use case) is roof-rack specific — a product's
 * `useCases` tagging has no Core equivalent — so it's layered on here.
 */
export function isEligibleCandidate(
  candidate: Candidate,
  year: RecommendationRequest["year"],
  useCase: RecommendationRequest["useCase"],
  variantId?: RecommendationRequest["variantId"]
): boolean {
  return (
    isEligibleFitment({
      verificationStatus: candidate.fitment.verificationStatus,
      fitmentVariantId: candidate.fitment.variantId,
      requestedVariantId: variantId,
      range: { min: candidate.fitment.yearStart, max: candidate.fitment.yearEnd },
      point: year,
    }) && candidate.product.useCases.includes(useCase)
  );
}

/**
 * Rack-size preference is also a hard filter: "Smaller / 3/4 rack" only
 * ever shows 3/4-length racks, and every other preference only shows
 * full-length racks (3/4 is opt-in, not a ranking tiebreaker).
 */
function matchesLengthPreference(
  product: Product,
  preference: RecommendationRequest["preference"]
): boolean {
  return preference === "smaller-three-quarter"
    ? product.rackLength === "three-quarter"
    : product.rackLength === "full";
}

/**
 * "Best overall" score (0–100-ish), computed relative to the other
 * candidates in the same request — not the whole catalog — so it stays
 * meaningful as more products are added. Weights are deliberately simple
 * and documented (kept in sync with the Methodology page copy):
 *   - value-for-money (regular price relative to the cheapest in the group): 50%
 *   - manufacturer-stated capacity (relative to the highest in the group): 40%
 *   - installation simplicity (non-drill vs. drilled): 10%
 * This is a fixed formula anyone can recompute by hand — not a black box.
 */
const BEST_OVERALL_WEIGHTS = { capacity: 40, value: 50, installation: 10 };

export function bestOverallScore(product: Product, group: Product[]): number {
  const maxCapacity = Math.max(...group.map(capacityLbs), 1);
  const minPrice = Math.min(...group.map((p) => p.referencePrice.min));
  const capacityPart = (capacityLbs(product) / maxCapacity) * BEST_OVERALL_WEIGHTS.capacity;
  const valuePart = (minPrice / product.referencePrice.min) * BEST_OVERALL_WEIGHTS.value;
  const installationPart = isNonDrill(product)
    ? BEST_OVERALL_WEIGHTS.installation
    : BEST_OVERALL_WEIGHTS.installation * 0.5;
  return capacityPart + valuePart + installationPart;
}

function sortForPreference(
  candidates: Candidate[],
  preference: RecommendationRequest["preference"]
): Candidate[] {
  const products = candidates.map((c) => c.product);
  const sorted = [...candidates];
  switch (preference) {
    case "max-capacity":
      sorted.sort(
        (a, b) =>
          capacityLbs(b.product) - capacityLbs(a.product) ||
          a.product.referencePrice.min - b.product.referencePrice.min
      );
      break;
    case "lower-cost":
      sorted.sort(
        (a, b) =>
          a.product.referencePrice.min - b.product.referencePrice.min ||
          capacityLbs(b.product) - capacityLbs(a.product)
      );
      break;
    case "smaller-three-quarter":
      sorted.sort((a, b) => a.product.referencePrice.min - b.product.referencePrice.min);
      break;
    case "best-overall":
    default:
      sorted.sort(
        (a, b) =>
          bestOverallScore(b.product, products) - bestOverallScore(a.product, products) ||
          a.product.referencePrice.min - b.product.referencePrice.min
      );
      break;
  }
  return sorted;
}

function formatMoney(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

/** Builds 1–3 concrete, rule-based "Why this rack?" reasons for a ranked candidate. */
export function buildReasons(
  candidate: Candidate,
  rank: number,
  rankedGroup: Candidate[],
  request: RecommendationRequest
): string[] {
  const reasons: string[] = [];
  const { product } = candidate;
  const top = rankedGroup[0];
  const runnerUp = rankedGroup.find((c) => c.product.id !== product.id);
  const useCase = getUseCaseById(request.useCase);
  const useCaseLabel = useCase ? useCase.label.toLowerCase() : "your use case";

  switch (request.preference) {
    case "max-capacity": {
      if (rank === 0) {
        reasons.push(
          `Highest verified capacity in this group: ${product.dynamicCapacityLbs ?? "—"} lb dynamic / ${product.staticCapacityLbs ?? "—"} lb static.`
        );
        if (runnerUp) {
          const diff = capacityLbs(product) - capacityLbs(runnerUp.product);
          if (diff > 0) {
            reasons.push(`${diff} lb more static capacity than the ${runnerUp.product.name}.`);
          }
        }
      } else {
        reasons.push(`Verified fit, but lower capacity than the ${top.product.name} above.`);
      }
      break;
    }
    case "lower-cost": {
      if (rank === 0) {
        reasons.push(
          `Lowest reference price among verified fits: ${formatMoney(product.referencePrice.min)}.`
        );
        if (runnerUp) {
          const diff = runnerUp.product.referencePrice.min - product.referencePrice.min;
          if (diff > 0) {
            reasons.push(`${formatMoney(diff)} cheaper than the ${runnerUp.product.name}.`);
          }
        }
      } else {
        reasons.push(
          `Costs more than the ${top.product.name} above, for ${capacityLbs(product)} lb static capacity.`
        );
      }
      break;
    }
    case "smaller-three-quarter": {
      reasons.push(`3/4-length coverage leaves more open roof space than a full-length rack.`);
      if (rank === 0) {
        reasons.push(
          `Lowest reference price among verified 3/4-length options: ${formatMoney(product.referencePrice.min)}.`
        );
      }
      break;
    }
    case "best-overall":
    default: {
      if (rank === 0) {
        reasons.push(
          `Best balance of manufacturer-stated capacity and price among verified, ${useCaseLabel}-suited options.`
        );
        reasons.push(
          `${capacityLbs(product)} lb static capacity for ${formatMoney(product.referencePrice.min)}.`
        );
      } else {
        const capacityDiff = capacityLbs(product) - capacityLbs(top.product);
        if (capacityDiff > 0) {
          reasons.push(
            `${capacityDiff} lb more static capacity than the best-overall pick, at a higher price — worth it if you need the extra headroom.`
          );
        } else {
          reasons.push(`A verified alternative if you'd rather trade price or capacity differently.`);
        }
      }
      break;
    }
  }

  if (isNonDrill(product)) {
    reasons.push(`${INSTALLATION_TYPE_LABELS[product.installationType]} — no permanent vehicle modification.`);
  }

  return reasons.slice(0, 3);
}

/**
 * Which rank-badge (if any) a top-ranked ("rank 0") card should carry, purely
 * a function of which preference produced the ranking — genuine, derived
 * from the same rule that did the sorting, never a fabricated label. Only
 * ever applies to the top result; callers should not badge rank > 0.
 */
export function rankBadgeForPreference(
  preference: RecommendationRequest["preference"]
): "best-overall" | "max-capacity" | "best-value" | "compact-fit" {
  switch (preference) {
    case "max-capacity":
      return "max-capacity";
    case "lower-cost":
      return "best-value";
    case "smaller-three-quarter":
      return "compact-fit";
    case "best-overall":
    default:
      return "best-overall";
  }
}

export function recommendRacks(request: RecommendationRequest): RecommendationResult {
  const generation = getGenerationForYear(request.vehicleId, request.year);

  if (!generation) {
    return {
      generation: null,
      recommendations: [],
      note: `We don't have verified roof rack fitment data for model year ${request.year} yet.`,
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
    isEligibleCandidate(c, request.year, request.useCase, request.variantId)
  );
  const lengthFiltered = eligible.filter((c) => matchesLengthPreference(c.product, request.preference));
  const sorted = sortForPreference(lengthFiltered, request.preference);

  if (sorted.length === 0) {
    const vehicle = getVehicleById(request.vehicleId);
    const vehicleLabel = vehicle ? `${vehicle.make} ${vehicle.model}` : "vehicle";
    const needsVariant = request.variantId == null && getVariantsForGeneration(generation.id).length > 0;
    const note = needsVariant
      ? `Select your vehicle configuration to see verified fits for the ${generation.name} ${vehicleLabel} (${generation.yearStart}–${generation.yearEnd}).`
      : request.preference === "smaller-three-quarter"
        ? `No verified 3/4-length rack is published yet for the ${generation.name} ${vehicleLabel} (${generation.yearStart}–${generation.yearEnd}). Try "Best overall" or "Maximum capacity" for full-length options.`
        : `No verified roof rack matches this combination yet for the ${generation.name} ${vehicleLabel} (${generation.yearStart}–${generation.yearEnd}).`;
    return { generation, recommendations: [], note };
  }

  const recommendations: Recommendation[] = sorted.map((candidate, index) => ({
    ...candidate,
    reasons: buildReasons(candidate, index, sorted, request),
  }));

  return { generation, recommendations, note: null };
}
