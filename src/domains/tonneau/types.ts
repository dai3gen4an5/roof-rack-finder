/**
 * TonneauFit domain types — Toyota Tacoma tonneau covers.
 *
 * The second MMFE domain (after Roof Rack), built specifically to test
 * whether `src/mmfe/types.ts` and `src/mmfe/recommend/eligibility.ts` are
 * genuinely reusable without modification. As with Roof Rack, these are the
 * domain's own readable vocabulary — NOT mechanical renames of Core's
 * Entity / EntityScope / Variant / Fitment (see the Phase 1 report for why
 * that choice was made; it applies identically here for a brand-new
 * domain, since there's no existing-consumer rename cost to weigh either
 * way, and readable domain-native names were still judged better than
 * generic ones).
 *
 * Key Phase 2 finding baked into this file: unlike Roof Rack (where Cab
 * type is the fitment-relevant configuration axis, because a roof rack
 * bolts to the cab), every manufacturer fitment statement gathered for
 * tonneau covers is keyed by **Bed Length**, not Cab type — a tonneau cover
 * bolts to the bed. So Bed Length fills the role Core's `Variant` was
 * designed for, under a domain-readable field name (`bedLengthId`, not
 * `variantId`) that still round-trips through
 * `mmfe/recommend/eligibility.ts`'s `matchesVariant` unchanged. Cab type is
 * deliberately NOT modeled anywhere in this file — no manufacturer fitment
 * statement gathered so far treats it as a fitment condition, so giving it
 * a field here would be exactly the kind of unverified/speculative modeling
 * this project avoids. When a Finder is built (Phase 3+), Cab becomes pure
 * navigation data (which Bed Lengths a given Cab can select) that never
 * reaches `Fitment` or Core.
 */
import type {
  Merchant as CoreMerchant,
  PriceRange as CorePriceRange,
  Product as CoreProduct,
  VerificationStatus as CoreVerificationStatus,
} from "@/mmfe/types";

export type Merchant = CoreMerchant;
export type VerificationStatus = CoreVerificationStatus;
export type PriceRange = CorePriceRange;

/** A truck nameplate, e.g. Toyota Tacoma. Domain-native counterpart of
 * `mmfe/types.ts`'s `Entity`. Tacoma-only for this MVP — not every truck
 * RackFit might one day cover, just the one with verified data today. */
export interface Truck {
  id: string;
  make: string;
  model: string;
  /** URL slug segments, e.g. ["toyota", "tacoma"]. Not wired to any route
   * yet (no Finder/route exists for this domain in Phase 2). */
  slug: [string, string];
}

/** A model-year range sharing the same bed/frame platform, e.g. "3rd Gen".
 * Domain-native counterpart of `mmfe/types.ts`'s `EntityScope` — like Roof
 * Rack's `Generation`, this domain has a natural numeric range, so it keeps
 * `yearStart`/`yearEnd` as real fields rather than routing through Core's
 * (deliberately range-less) `EntityScope`. */
export interface Generation {
  id: string;
  truckId: Truck["id"];
  name: string;
  yearStart: number;
  yearEnd: number;
}

/**
 * A bed length within a generation — the actual fitment-determining
 * configuration axis for tonneau covers. Domain-native counterpart of
 * `mmfe/types.ts`'s `Variant`, scoped to a generation the same way. `id` is
 * a stable identifier (`tacoma-3g-5ft`); `label` is the user-facing string.
 * Deliberately kept separate from any one manufacturer's own bed-length
 * notation — Toyota/BAK/Worksport each write the "same" bed length
 * differently (5'1" vs 5 ft vs 60.3") — the id is the single source of
 * truth for eligibility matching, never a parsed manufacturer string.
 */
export interface BedLength {
  id: string;
  generationId: Generation["id"];
  label: string;
}

export type CoverType =
  | "hard-folding"
  | "hard-rolling"
  | "hard-quick-latch"
  | "hard-flip-up";

/**
 * The tonneau-specific attributes layered onto `mmfe/types.ts`'s generic
 * `Product<TAttrs>` — this domain's `TAttrs`.
 *
 * `requiresDeckRailSystem` is modeled at the PRODUCT level, not on
 * `Fitment`: every verified fitment gathered for every product in this
 * dataset requires the truck's factory Deck Rail System, and the
 * requirement is intrinsic to how a given product line's hardware clamps
 * onto the bed rail — it does not vary between that same product's own
 * fitment rows (e.g. Worksport AL4's 3rd Gen fitment and its 4th Gen
 * fitment both need the same rail system). If a future product is found
 * whose deck-rail requirement genuinely differs generation-to-generation,
 * that would be real evidence to promote this field onto `Fitment`
 * instead — no such evidence exists yet, so it isn't modeled there
 * speculatively.
 */
export interface TonneauProductAttributes {
  coverType: CoverType;
  material?: string;
  /** Whether this product requires the factory Deck Rail System /
   * Utility Track System to install. `undefined`/omitted only if no
   * manufacturer source states either way — never defaulted to `false`. */
  requiresDeckRailSystem?: boolean;
}

/**
 * `CoreProduct<TonneauProductAttributes>` — the same zero-rename
 * intersection reuse as Roof Rack's `Product = CoreProduct<RoofRackProductAttributes>`.
 * Every field stays flat (`product.coverType`, `product.referencePrice`),
 * exactly like every existing Core-`Product` consumer.
 */
export type Product = CoreProduct<TonneauProductAttributes>;

/**
 * Confirms a product fits a specific generation + bed length. Domain-native
 * counterpart of `mmfe/types.ts`'s `Fitment`, with the same year-narrowing
 * pattern Roof Rack's `Fitment` uses (optional `yearStart`/`yearEnd`,
 * translated into Core's `NumericRangeConstraint` by `isEligibleCandidate`
 * in recommend.ts) — needed here too: Worksport's AL3 states 2024–2025 for
 * the 4th Gen, narrower than the 2024–2026 generation boundary.
 */
export interface Fitment {
  id: string;
  productId: Product["id"];
  generationId: Generation["id"];
  /**
   * The bed length this fitment applies to — this domain's equivalent of
   * Core `Fitment.variantId`, translated by name in `isEligibleCandidate`.
   * Typed optional for the same reason Core's is (never force a variant no
   * source states), but in practice every real fitment gathered so far
   * names an exact bed length — no manufacturer statement found says "fits
   * any bed length."
   */
  bedLengthId?: BedLength["id"] | null;
  yearStart?: number;
  yearEnd?: number;
  /** URL of the manufacturer/current-seller's own fitment statement. */
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  lastVerifiedDate: string;
}

/** A recommended product bundled with the fitment record that qualified
 * it. Domain-native counterpart of `mmfe/types.ts`'s `Recommendation`. */
export interface Recommendation {
  product: Product;
  merchant: Merchant;
  fitment: Fitment;
  generation: Generation;
  reasons: string[];
}

/**
 * Deliberately small: only preferences that produce a genuinely different,
 * verifiable ranking with today's 6-product dataset. No "best-overall" yet
 * — this domain has no independently-verified secondary spec (Roof Rack
 * had manufacturer-stated load capacity; no comparable, consistently
 * published number was found across tonneau brands during Step 1/2
 * research), so a composite score would need invented weights. Add it once
 * a genuine differentiator is verified, not before.
 */
export type TonneauPreferenceId = "lowest-price" | "hard-folding";

export interface RecommendationRequest {
  truckId: Truck["id"];
  year: number;
  /** Required in practice to get a specific-enough result whenever the
   * resolved generation has more than one bed length fitment (true for
   * every generation in this dataset) — never inferred or defaulted. */
  bedLengthId?: BedLength["id"];
  preference: TonneauPreferenceId;
  /** Whether the requester's truck has the factory Deck Rail System.
   * `undefined` = unknown — never assumed true OR false. A product that
   * requires the rail system is only ever excluded when the requester
   * affirmatively said they don't have it (`false`); it's never excluded
   * just because this wasn't asked. See `isEligibleCandidate`. */
  hasDeckRailSystem?: boolean;
}

export interface RecommendationResult {
  generation: Generation | null;
  recommendations: Recommendation[];
  note: string | null;
}
