/**
 * Core domain types for RackFit.
 *
 * These are intentionally generic (not 4Runner-specific) so the same model
 * can later cover other vehicles (Tacoma, Subaru, Jeep, ...) and other
 * manufacturers without a redesign.
 */

/** A vehicle nameplate, e.g. Toyota 4Runner. */
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  /** URL slug segments, e.g. ["toyota", "4runner"]. */
  slug: [string, string];
}

/** A model-year range that shares the same body/platform, e.g. "5th Gen". */
export interface Generation {
  id: string;
  vehicleId: Vehicle["id"];
  name: string;
  yearStart: number;
  yearEnd: number;
}

/** The company selling/manufacturing a rack. */
export interface Merchant {
  id: string;
  name: string;
  websiteUrl: string;
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

export type VerificationStatus = "verified" | "unverified";

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

/** A price range. Racks are sometimes sold across a small range (e.g. by color/option). */
export interface PriceRange {
  min: number;
  max: number;
  currency: "USD";
}

/**
 * A product a merchant sells. Fit information is stored separately in
 * {@link Fitment} records so the same product can (in principle) be linked
 * to more than one vehicle/generation.
 */
export interface Product {
  id: string;
  name: string;
  merchantId: Merchant["id"];
  rackLength: RackLength;
  installationType: InstallationType;
  /** Manufacturer-stated dynamic (moving/driving) load capacity in lb, if published. */
  dynamicCapacityLbs: number | null;
  /** Manufacturer-stated static (stationary, e.g. parked camping) load capacity in lb, if published. */
  staticCapacityLbs: number | null;
  /**
   * The manufacturer's regular/list price — NOT a temporary sale price.
   * This is what ranking math and "reference price" display use, so a
   * short-lived promo never gets baked in as if it were the normal price.
   */
  referencePrice: PriceRange;
  /**
   * An actively-confirmed current sale price, only when one is genuinely
   * in effect. Leave `null` rather than hardcoding a promo we can't keep
   * current — a stale "sale" price baked into source is worse than none.
   * When present, the UI must present it as temporary, not as the price.
   */
  salePrice: PriceRange | null;
  /** ISO date (YYYY-MM-DD) `referencePrice`/`salePrice` were last checked against `sourceUrl`. */
  priceVerifiedAt: string;
  /** Use cases this product is generally suited for. */
  useCases: UseCaseId[];
  /** Current outbound link. This is a normal manufacturer/retailer link today;
   * it can be swapped for an affiliate link later without changing callers. */
  outboundUrl: string;
  /** Affiliate tracking link, once a program exists. Null until then — never fabricate one. */
  affiliateUrl: string | null;
  /** Where the product's specs (capacity, price, install type) were sourced from. */
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  /** ISO date (YYYY-MM-DD) the capacity/installation specs above were last checked against the source. */
  lastVerifiedDate: string;
}

/**
 * Confirms that a product fits a specific vehicle generation. Kept separate
 * from Product so fit claims always carry their own source/verification
 * trail, distinct from the product's general spec sourcing.
 */
export interface Fitment {
  id: string;
  productId: Product["id"];
  generationId: Generation["id"];
  /** URL of the manufacturer's own fitment statement (fit guide, product page, etc.). */
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  lastVerifiedDate: string;
}

/** A recommended product bundled with the fitment record that qualified it. */
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
