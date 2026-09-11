/**
 * Roof Rack domain types for RackFit.
 *
 * These are the domain's own, readable vocabulary (Vehicle / Generation /
 * Variant / Fitment / rack-specific Product attributes) — NOT a
 * field-for-field rename onto `mmfe/types.ts`'s Entity / EntityScope /
 * Variant / Fitment. That's a deliberate Phase 1 choice: `Vehicle.make`/
 * `.model` and `Generation.vehicleId`/`.yearStart`/`.yearEnd` (etc.) read
 * naturally here and are used throughout this domain's data, components,
 * and tests, so they're kept exactly as they were rather than mechanically
 * renamed to match Core's generic field names. See the Phase 1 report for
 * the full reasoning.
 *
 * `Merchant`, `VerificationStatus`, and `PriceRange` ARE identical in shape
 * to their Core counterparts, so those are genuine re-exports, not
 * redeclarations. `Product` is built directly on Core's `Product<TAttrs>` —
 * the one type where doing so costs zero renames (see below).
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

/** A vehicle nameplate, e.g. Toyota 4Runner. The domain-native counterpart
 * of `mmfe/types.ts`'s `Entity`. */
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  /** URL slug segments, e.g. ["toyota", "4runner"]. */
  slug: [string, string];
}

/** A model-year range that shares the same body/platform, e.g. "5th Gen".
 * The domain-native counterpart of `mmfe/types.ts`'s `EntityScope` — this is
 * exactly the kind of domain that DOES have a natural numeric range, so it
 * keeps `yearStart`/`yearEnd` as real fields rather than routing through
 * Core's (deliberately range-less) `EntityScope`. */
export interface Generation {
  id: string;
  vehicleId: Vehicle["id"];
  name: string;
  yearStart: number;
  yearEnd: number;
}

/**
 * A configuration axis within a generation that fitment can depend on
 * independent of model year — e.g. cab type on a truck. Not every vehicle
 * has any; today's Toyota 4Runner data has none at all (see
 * `data/variants.ts`). Scoped to a generation the same way `Fitment` is,
 * since which variants exist can change across a redesign. The
 * domain-native counterpart of `mmfe/types.ts`'s `Variant`.
 */
export interface Variant {
  id: string;
  generationId: Generation["id"];
  label: string;
}

export type RackLength = "full" | "three-quarter";

export type InstallationType =
  | "factory-mount-non-drill"
  | "bolt-on-non-drill"
  | "drilled";

export const INSTALLATION_TYPE_LABELS: Record<InstallationType, string> = {
  "factory-mount-non-drill": "Factory mounting points (non-drill)",
  "bolt-on-non-drill": "Bolt-on (non-drill)",
  drilled: "Drilled installation",
};

export type UseCaseId =
  | "rooftop-tent"
  | "cargo-storage"
  | "kayak-surf"
  | "bike-ski"
  | "overlanding";

export interface UseCase {
  id: UseCaseId;
  label: string;
  description: string;
}

export type PreferenceId =
  | "best-overall"
  | "max-capacity"
  | "lower-cost"
  | "smaller-three-quarter";

export interface Preference {
  id: PreferenceId;
  label: string;
  description: string;
}

/**
 * The roof-rack-specific attributes layered onto `mmfe/types.ts`'s generic
 * `Product<TAttrs>` commerce/trust fields. This is the `TAttrs` of this
 * domain's `Product` below — a named, typed interface, never an untyped bag.
 */
export interface RoofRackProductAttributes {
  rackLength: RackLength;
  installationType: InstallationType;
  /** Manufacturer-stated dynamic (moving/driving) load capacity in lb, if published. */
  dynamicCapacityLbs: number | null;
  /** Manufacturer-stated static (stationary, e.g. parked camping) load capacity in lb, if published. */
  staticCapacityLbs: number | null;
  /** Use cases this product is generally suited for. */
  useCases: UseCaseId[];
}

/**
 * A product a merchant sells. Fit information is stored separately in
 * {@link Fitment} records so the same product can (in principle) be linked
 * to more than one vehicle/generation.
 *
 * `CoreProduct<RoofRackProductAttributes>` is an intersection type (Core's
 * commerce/trust fields & this domain's rack fields), so every field below
 * stays flat and top-level exactly as before — `product.rackLength`,
 * `product.referencePrice`, etc. — with zero changes needed anywhere this
 * type is consumed (components, scoring, the data literals in
 * `data/products.ts`).
 */
export type Product = CoreProduct<RoofRackProductAttributes>;

/**
 * Confirms that a product fits a specific vehicle generation. Kept separate
 * from Product so fit claims always carry their own source/verification
 * trail, distinct from the product's general spec sourcing. The
 * domain-native counterpart of `mmfe/types.ts`'s `Fitment` — this domain
 * needs a numeric (year) narrowing, which Core's `Fitment` deliberately
 * does not carry, so those two optional fields live here instead of on a
 * shared type. `isEligibleCandidate` (see `recommend.ts`) translates them
 * into Core's `NumericRangeConstraint` when calling
 * `mmfe/recommend/eligibility`'s range check.
 */
export interface Fitment {
  id: string;
  productId: Product["id"];
  generationId: Generation["id"];
  /**
   * Null/omitted = this fitment applies to every variant of the generation
   * (or the generation has no variants at all — true for every existing
   * 4Runner fitment today). Set to a specific `Variant["id"]` only when the
   * manufacturer's own fitment statement is variant-specific (e.g. a
   * cab-specific truck rack) — never inferred or defaulted.
   */
  variantId?: Variant["id"] | null;
  /**
   * Narrows this fitment's applicable years to less than the full
   * generation range. Omit both for a fitment that applies across the
   * whole generation (the common case, and every existing 4Runner
   * fitment). Needed when a product's own manufacturer-stated year range
   * doesn't line up with the generation boundary — e.g. a product
   * discontinued mid-generation, or (as found for one Tacoma product)
   * conflicting year statements on the manufacturer's own page, resolved
   * by taking the most conservative overlap. Never invent a generation
   * boundary to avoid this — use the override instead.
   */
  yearStart?: number;
  yearEnd?: number;
  /** URL of the manufacturer's own fitment statement (fit guide, product page, etc.). */
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  lastVerifiedDate: string;
}

/** A recommended product bundled with the fitment record that qualified it.
 * The domain-native counterpart of `mmfe/types.ts`'s `Recommendation` (which
 * uses the generic field name `scope` in place of `generation`). */
export interface Recommendation {
  product: Product;
  merchant: Merchant;
  fitment: Fitment;
  generation: Generation;
  /**
   * 1–3 concrete, rule-based reasons this product ranked where it did
   * ("Why this rack?"). Empty when the recommendation is being shown
   * outside of a specific use-case/preference request (e.g. a general
   * per-year product listing).
   */
  reasons: string[];
}

export interface RecommendationRequest {
  vehicleId: Vehicle["id"];
  year: number;
  /** Required in practice whenever the resolved generation has any
   * `Variant` rows; omit for vehicles/generations that don't (e.g. every
   * 4Runner request today). Never inferred or defaulted — see
   * `isEligibleCandidate` in recommend.ts. */
  variantId?: Variant["id"];
  useCase: UseCaseId;
  preference: PreferenceId;
}

export interface RecommendationResult {
  generation: Generation | null;
  recommendations: Recommendation[];
  /** Set when the request is valid but nothing matched, e.g. no 3/4 rack
   * exists yet for the matched generation. */
  note: string | null;
}
