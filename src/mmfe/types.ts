/**
 * MMFE Core — domain-agnostic types shared by every Money Miner Fitment
 * Engine site (RackFit today; a Tonneau/Printer/CPAP/Appliance finder later).
 *
 * Nothing in this file may reference roof-rack vocabulary (no "vehicle",
 * "generation", "rack", "cab", ...). Domain-specific shapes live under
 * `src/domains/<domain>/types.ts`.
 *
 * Phase 1 scope note: `Entity` / `EntityScope` / `Variant` / `Fitment` exist
 * here as the general concepts and are ready for a second domain to build on
 * directly. RackFit's own domain types are NOT mechanically rewritten to
 * extend these field-for-field in Phase 1 (e.g. `Vehicle.make/model` is not
 * renamed to `Entity.brand/line`) — the goal of this phase is a working
 * Core/domain *boundary*, not a repository-wide rename. `Product` is the one
 * type RackFit's domain layer builds directly on top of this file (via
 * `Product<TAttrs>`), because it costs zero renames to do so — see
 * `domains/roof-rack/types.ts`.
 */

/** A brand + product-line nameplate the finder resolves down to a specific
 * scope of — e.g. "Toyota 4Runner", "Brother MFC-L2710DW", "ResMed AirSense 11". */
export interface Entity {
  id: string;
  brand: string;
  line: string;
  /** URL slug segments identifying this entity, e.g. ["toyota", "4runner"]. */
  slug: readonly string[];
}

/**
 * A named sub-scope of an Entity that fitment/compatibility is verified
 * against — e.g. a vehicle generation, or (for a domain with no natural
 * sub-scoping, like a single printer model) the entity's one scope.
 *
 * Deliberately has NO numeric range field: not every domain has one (a
 * printer model isn't a year range). A domain that needs range-bounded scope
 * resolution (e.g. "which generation covers model year 2018") adds its own
 * numeric fields when it defines its domain-level scope type. The narrower,
 * per-fitment use of a range (a fitment's own stated range, when tighter
 * than its scope) is `NumericRangeConstraint` below, consumed by
 * `mmfe/recommend/eligibility.ts` — never required to live on `EntityScope`
 * or `Fitment` itself.
 */
export interface EntityScope {
  id: string;
  entityId: Entity["id"];
  name: string;
}

/** A configuration axis within a scope that fitment can depend on
 * independently of the scope itself — e.g. cab type on a truck, mask size on
 * a CPAP. Not every domain/scope has one. */
export interface Variant {
  id: string;
  scopeId: EntityScope["id"];
  label: string;
}

export interface Merchant {
  id: string;
  name: string;
  websiteUrl: string;
}

export type VerificationStatus = "verified" | "unverified";

/** A price range. Some products are sold across a small range (e.g. by
 * color/option). */
export interface PriceRange {
  min: number;
  max: number;
  currency: "USD";
}

/**
 * An optional numeric narrowing — e.g. a fitment's own stated year range,
 * when it's tighter than the scope it belongs to. Both bounds are optional
 * so a fitment can narrow just one side; a domain with no numeric axis at
 * all simply never constructs one. This is the one piece of "year-shaped"
 * mechanism Core owns — see `mmfe/recommend/eligibility.ts`.
 */
export interface NumericRangeConstraint {
  min?: number;
  max?: number;
}

/**
 * The commerce/trust fields every MMFE product needs, generic over `TAttrs`
 * — the domain's own product attributes (rack length + capacity for
 * RackFit; cartridge color/yield for a future printer-ink domain; etc.).
 *
 * Implemented as an intersection (`CoreFields & TAttrs`), not a nested
 * `attributes` bag, so a domain's own fields stay flat and directly
 * accessible (`product.rackLength`, not `product.attributes.rackLength`) —
 * that keeps every existing RackFit consumer (components, scoring, data
 * literals) unchanged when the domain type is defined as
 * `type Product = CoreProduct<RoofRackAttributes>`. `TAttrs` is always a
 * domain-declared, named interface — never an untyped `Record<string, unknown>`
 * bag.
 */
export type Product<TAttrs = Record<string, never>> = {
  id: string;
  name: string;
  merchantId: Merchant["id"];
  /** The regular/list price — never a temporary promo. */
  referencePrice: PriceRange;
  /** An actively-confirmed current sale price, only when one is genuinely in
   * effect. Never defaulted or fabricated; `null` when there isn't one. */
  salePrice: PriceRange | null;
  /** ISO date (YYYY-MM-DD) `referencePrice`/`salePrice` were last checked. */
  priceVerifiedAt: string;
  /** Current outbound link — an ordinary manufacturer/retailer link until an
   * affiliate program exists for it. */
  outboundUrl: string;
  /** Affiliate tracking link. Null until a program exists — never fabricate one. */
  affiliateUrl: string | null;
  /** Where this product's specs were sourced from. */
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  /** ISO date (YYYY-MM-DD) the specs above were last checked against the source. */
  lastVerifiedDate: string;
} & TAttrs;

/**
 * Confirms that a product fits/is compatible with a specific EntityScope.
 * Kept separate from Product so fit claims always carry their own
 * source/verification trail, distinct from the product's general spec
 * sourcing.
 *
 * No numeric range field here — a domain that narrows fitment eligibility by
 * a numeric axis (year, etc.) keeps its own optional fields on its
 * domain-level Fitment type and translates them into a
 * `NumericRangeConstraint` when calling `isEligibleFitment` below. See
 * `domains/roof-rack/types.ts` `Fitment` (`yearStart?`/`yearEnd?`) and
 * `domains/roof-rack/recommend.ts` (`isEligibleCandidate`).
 */
export interface Fitment {
  id: string;
  productId: string;
  scopeId: EntityScope["id"];
  /** Null/omitted = applies to every variant of the scope (or the scope has
   * no variants at all). Set only when the source's own fitment statement is
   * variant-specific — never inferred or defaulted. */
  variantId?: Variant["id"] | null;
  /** URL of the source's own fitment/compatibility statement. */
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  lastVerifiedDate: string;
}

/**
 * The general "ranked product + the record that qualified it" shape.
 *
 * Phase 1 note: RackFit's own `Recommendation`/`RecommendationRequest`/
 * `RecommendationResult` types are NOT rewritten to extend these — their
 * natural field names (`generation`, `vehicleId`, `year`) read better in
 * that domain than the generic `scope`/`entityId`/`point` used here, and
 * nothing in `mmfe/recommend/eligibility.ts` needs them to match. These
 * exist so a *second* domain can adopt the generic names directly, and as
 * the documented shape RackFit's own types are understood to mirror.
 */
export interface Recommendation<TAttrs = Record<string, never>> {
  product: Product<TAttrs>;
  merchant: Merchant;
  fitment: Fitment;
  scope: EntityScope;
  /** 1–3 concrete, rule-based reasons this product ranked where it did.
   * Empty when shown outside of a specific ranked request. */
  reasons: string[];
}

export interface RecommendationRequest<
  TUseCase extends string = string,
  TPreference extends string = string,
> {
  entityId: Entity["id"];
  /** The value matched against a scope/fitment's numeric range, e.g. a
   * model year. A domain with no numeric axis can ignore range matching
   * entirely and resolve its scope by id instead. */
  point: number;
  variantId?: Variant["id"];
  useCase: TUseCase;
  preference: TPreference;
}

export interface RecommendationResult<TAttrs = Record<string, never>> {
  scope: EntityScope | null;
  recommendations: Recommendation<TAttrs>[];
  /** Set when the request is valid but nothing matched. */
  note: string | null;
}
