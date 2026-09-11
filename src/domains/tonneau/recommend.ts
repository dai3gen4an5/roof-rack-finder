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

/** The three Core-composed gates only — no Deck Rail check. Split out so
 * `recommendCovers` can tell "excluded by year/bed-length/verification"
 * apart from "excluded only because of Deck Rail," which is what makes
 * `hiddenByUnconfirmedDeckRail` possible without guessing. */
function isCoreEligible(
  candidate: Candidate,
  year: RecommendationRequest["year"],
  bedLengthId: RecommendationRequest["bedLengthId"]
): boolean {
  return isEligibleFitment({
    verificationStatus: candidate.fitment.verificationStatus,
    fitmentVariantId: candidate.fitment.bedLengthId,
    requestedVariantId: bedLengthId,
    range: { min: candidate.fitment.yearStart, max: candidate.fitment.yearEnd },
    point: year,
  });
}

/**
 * Hard requirements every recommendation must pass, checked in this order,
 * all mandatory, none a scoring weight:
 *   1. the requested year falls within the fitment's own year range, if
 *      narrower than the generation (e.g. AL3's 2024-2025-only 4th Gen fitment)
 *   2. the fitment's bed length matches the requested bed length exactly
 *   3. the fitment itself is manufacturer-verified
 *   4. if the product requires the factory Deck Rail System, the requester
 *      must have affirmatively confirmed they have it
 *
 * The first three are `isCoreEligible` above, composed from
 * `mmfe/recommend/eligibility.ts`'s `isEligibleFitment` — the same
 * domain-agnostic gates Roof Rack uses, with this domain's own field names
 * (`bedLengthId`, not `variantId`) translated at the call site, exactly
 * like Roof Rack translates `yearStart`/`yearEnd` into a
 * `NumericRangeConstraint`. The fourth gate is Tonneau-specific and has no
 * Core equivalent — deliberately conservative: a product whose own
 * verified fitment requires the factory Deck Rail System is only ever
 * eligible when the requester affirmatively confirmed they have it
 * (`hasDeckRailSystem === true`). Both `false` AND `undefined`
 * (unconfirmed) exclude it — recommending a cover whose stated fitment
 * condition is unconfirmed is exactly the kind of guess this project
 * doesn't make, even though the guess would only be "optimistic" rather
 * than a wrong generation/bed-length match. (Only two of today's six
 * products — the Worksport AL3/AL4 — actually carry this requirement; see
 * `data/products.ts`'s Deck Rail re-audit note. For the rest, this gate
 * never triggers.)
 */
export function isEligibleCandidate(
  candidate: Candidate,
  year: RecommendationRequest["year"],
  bedLengthId: RecommendationRequest["bedLengthId"],
  hasDeckRailSystem: RecommendationRequest["hasDeckRailSystem"]
): boolean {
  if (!isCoreEligible(candidate, year, bedLengthId)) return false;

  if (candidate.product.requiresDeckRailSystem && hasDeckRailSystem !== true) {
    return false;
  }

  return true;
}

/** Cover-type filter, then always sorted by reference price ascending —
 * price is never a filter, and cover type is never a sort; conflating the
 * two (Step 3's original `"lowest-price" | "hard-folding"` single
 * preference) made `hard-folding` behave inconsistently with a genuine
 * price-sort option, so Step 3A split them. */
function filterAndSort(
  candidates: Candidate[],
  coverTypeFilter: RecommendationRequest["coverTypeFilter"]
): Candidate[] {
  const filtered =
    coverTypeFilter === "hard-folding"
      ? candidates.filter((c) => c.product.coverType === "hard-folding")
      : candidates;
  return [...filtered].sort((a, b) => a.product.referencePrice.min - b.product.referencePrice.min);
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

  if (request.coverTypeFilter === "hard-folding") {
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
      hiddenByUnconfirmedDeckRail: false,
    };
  }

  const fitments = getFitmentsForGeneration(generation.id);

  const allCandidates: Candidate[] = fitments.flatMap((fitment) => {
    const product = getProductById(fitment.productId);
    const merchant = product ? getMerchantById(product.merchantId) : undefined;
    if (!product || !merchant) return [];
    return [{ product, merchant, fitment, generation }];
  });

  // Computed separately from the final eligible set so a caller can tell
  // "nothing verified for this year/bed-length at all" apart from
  // "something exists, but it's gated on Deck Rail System confirmation" —
  // see `hiddenByUnconfirmedDeckRail` on `RecommendationResult`.
  const coreEligible = allCandidates.filter((c) => isCoreEligible(c, request.year, request.bedLengthId));
  const eligible = coreEligible.filter(
    (c) => !c.product.requiresDeckRailSystem || request.hasDeckRailSystem === true
  );
  const hiddenByUnconfirmedDeckRail = request.hasDeckRailSystem !== true && eligible.length < coreEligible.length;

  const sorted = filterAndSort(eligible, request.coverTypeFilter);

  const truck = getTruckById(request.truckId);
  const truckLabel = truck ? `${truck.make} ${truck.model}` : "truck";
  const generationLabel = `${generation.name} ${truckLabel} (${generation.yearStart}–${generation.yearEnd})`;

  if (sorted.length === 0) {
    const needsBedLength =
      request.bedLengthId == null && getBedLengthsForGeneration(generation.id).length > 0;
    let note: string;
    if (needsBedLength) {
      note = `Select your bed length to see verified fits for the ${generationLabel}.`;
    } else if (hiddenByUnconfirmedDeckRail) {
      note =
        request.hasDeckRailSystem === false
          ? `No verified tonneau cover matches this combination for the ${generationLabel} — the option(s) that fit require the factory Deck Rail System, and you said your truck doesn't have it.`
          : `No verified tonneau cover is shown for the ${generationLabel} yet — some options require the factory Deck Rail System, and that status is unknown. Confirm your truck has it to see them.`;
    } else {
      note = `No verified tonneau cover matches this combination yet for the ${generationLabel}.`;
    }
    return { generation, recommendations: [], note, hiddenByUnconfirmedDeckRail };
  }

  const recommendations: Recommendation[] = sorted.map((candidate, index) => ({
    ...candidate,
    reasons: buildReasons(candidate, index, sorted, request),
  }));

  const note = hiddenByUnconfirmedDeckRail
    ? request.hasDeckRailSystem === false
      ? `Some options are hidden because your Deck Rail System status is No.`
      : `Some options may be hidden because your Deck Rail System status is unknown.`
    : null;

  return { generation, recommendations, note, hiddenByUnconfirmedDeckRail };
}
