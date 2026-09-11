import type { Product } from "@/domains/tonneau/types";

/**
 * Six products, two merchants, all three generations represented. Every
 * fitment claim below (generation/bed length) was checked directly against
 * the manufacturer's own current product page (Worksport) or its current
 * authoritative retail page (BAK Industries' own
 * `bakindustries.com/product-detail/...` URLs now 301-redirect to
 * `realtruck.com` — RealTruck is BAK's current distributor/site operator,
 * so its product pages are treated as the current first-party source, not
 * a secondary reseller).
 *
 * Price confidence is NOT uniform across these six rows — recorded
 * per-product below. Where a page rendered a static price server-side
 * (every BAK/RealTruck row), it's used directly and is high-confidence.
 * Worksport's own product pages render price client-side (not visible to
 * a static fetch); those two rows use the clearest single number found on
 * a specific named secondary retailer instead, flagged explicitly — this
 * is a materially weaker source than the rest of this file and should be
 * re-verified directly against worksport.com before this ships anywhere
 * user-facing. This does not affect fitment eligibility (Worksport's own
 * page WAS used for the fitment/deck-rail claims), only price.
 *
 * `salePrice` stays `null` throughout, same policy as
 * `domains/roof-rack/data/products.ts`: a reseller's active discount is
 * not baked into source-controlled seed data.
 *
 * --- Deck Rail System re-audit (Phase 2 Step 3A) ---------------------
 * An earlier pass set `requiresDeckRailSystem: true` on all six products.
 * Re-checked each product's current source directly for "required for
 * installation" language, distinct from "Deck Rail System" merely
 * appearing as a fitment/SKU descriptor:
 *
 * - Worksport AL3 / AL4: worksport.com's own installation guide table
 *   pairs EVERY Tacoma row (both products, every generation/bed-length
 *   combination listed) with "W/ Deck Rail System" — the table format
 *   itself (which for other trucks in Worksport's broader catalog also
 *   has "W/O Deck Rail System" rows) confirms this is a real compatibility
 *   condition, not incidental naming, and no Deck-Rail-free Tacoma
 *   fitment is published for either product. Kept as `true`.
 * - All four BAK products: the "w-deck-rail-system" phrase in the
 *   PREVIOUS pass came only from the retired `bakindustries.com` URL
 *   slug. Re-fetched the current live page (realtruck.com, which is what
 *   that URL now redirects to) for each of the four parts directly —
 *   every one describes a "simple bolt-on"/"clamp-on... no drilling"
 *   installation with NO mention of a Deck Rail System requirement, and
 *   no compatibility note states one. This is "not established by
 *   current source," not "not required" — so `requiresDeckRailSystem` is
 *   left unset (`undefined`) on all four, never defaulted to `false`
 *   either. Correction from the earlier pass, which had over-inferred
 *   this from stale URL-slug naming — exactly the "uses a deck rail" vs.
 *   "cannot install without one" conflation this re-audit was asked to
 *   check for.
 */
const PRICE_VERIFIED_AT = "2026-09-11";
const SPEC_VERIFIED_AT = "2026-09-11";

export const products: Product[] = [
  {
    id: "worksport-al3",
    name: "Worksport AL3 Quick Latch Hard Tonneau Cover",
    merchantId: "worksport",
    coverType: "hard-quick-latch",
    // Every Tacoma row in Worksport's own install guide table is "W/ Deck
    // Rail System"; no Deck-Rail-free Tacoma fitment is published for this
    // product — see file header re-audit note.
    requiresDeckRailSystem: true,
    // Price: $869 regular / $699 promo, sourced from aggregated retail
    // listings (incl. RealTruck) via shopping search — worksport.com's own
    // product page renders price client-side and did not return a number
    // to a static fetch. Weaker source than the BAK rows below; re-verify
    // against worksport.com directly before production use.
    referencePrice: { min: 869, max: 869, currency: "USD" },
    salePrice: null,
    priceVerifiedAt: PRICE_VERIFIED_AT,
    outboundUrl: "https://www.worksport.com/products/al3",
    affiliateUrl: null,
    sourceUrl: "https://www.worksport.com/products/al3",
    verificationStatus: "verified",
    lastVerifiedDate: SPEC_VERIFIED_AT,
  },
  {
    id: "worksport-al4",
    name: "Worksport AL4 Flip-Up Hard Tonneau Cover",
    merchantId: "worksport",
    coverType: "hard-flip-up",
    // Every Tacoma row in Worksport's own install guide table is "W/ Deck
    // Rail System"; no Deck-Rail-free Tacoma fitment is published for this
    // product — see file header re-audit note.
    requiresDeckRailSystem: true,
    // Price: $1,299 regular ($1,049 promo seen at a secondary retailer,
    // not recorded as salePrice — see file header). Same weaker-source
    // caveat as AL3 above.
    referencePrice: { min: 1299, max: 1299, currency: "USD" },
    salePrice: null,
    priceVerifiedAt: PRICE_VERIFIED_AT,
    outboundUrl: "https://www.worksport.com/products/al4",
    affiliateUrl: null,
    sourceUrl: "https://www.worksport.com/products/al4",
    verificationStatus: "verified",
    lastVerifiedDate: SPEC_VERIFIED_AT,
  },
  {
    id: "bak-bakflip-mx4-2g",
    name: "BAK BAKFlip MX4 (GEN 3) Hard Folding Tonneau Cover — 448406",
    merchantId: "bak",
    coverType: "hard-folding",
    // Deck Rail requirement: not established by current source — see file
    // header re-audit note. Live page describes bolt-on/clamp-on install,
    // no drilling, no deck-rail prerequisite stated.
    // Price fetched directly from the live product page (server-rendered),
    // high confidence.
    referencePrice: { min: 1199.99, max: 1199.99, currency: "USD" },
    salePrice: null,
    priceVerifiedAt: PRICE_VERIFIED_AT,
    outboundUrl: "https://realtruck.com/p/bakflip-mx4-tonneau-cover/bak-448406/",
    affiliateUrl: null,
    sourceUrl: "https://realtruck.com/p/bakflip-mx4-tonneau-cover/bak-448406/",
    verificationStatus: "verified",
    lastVerifiedDate: SPEC_VERIFIED_AT,
  },
  {
    id: "bak-revolver-x4-2g",
    name: "BAK Revolver X4 Hard Rolling Tonneau Cover — 80407",
    merchantId: "bak",
    coverType: "hard-rolling",
    // Deck Rail requirement: not established by current source — see file
    // header re-audit note.
    referencePrice: { min: 1549.99, max: 1549.99, currency: "USD" },
    salePrice: null,
    priceVerifiedAt: PRICE_VERIFIED_AT,
    outboundUrl: "https://realtruck.com/p/bak-revolver-x4-tonneau-cover/bak-80407/",
    affiliateUrl: null,
    sourceUrl: "https://realtruck.com/p/bak-revolver-x4-tonneau-cover/bak-80407/",
    verificationStatus: "verified",
    lastVerifiedDate: SPEC_VERIFIED_AT,
  },
  {
    id: "bak-bakflip-mx4-3g",
    name: "BAK BAKFlip MX4 Hard Folding Tonneau Cover — 448426",
    merchantId: "bak",
    coverType: "hard-folding",
    // Deck Rail requirement: not established by current source — see file
    // header re-audit note.
    // Page also states "Will NOT Work w/ Factory Bed Storage Boxes" (a
    // trim-level incompatibility distinct from deck-rail — e.g. 4th Gen
    // Trail Special Edition/Trailhunter-style in-bed storage boxes on 3rd
    // Gen trims, if equipped). Not modeled as a field in this phase (no
    // schema for it was requested); preserved here so the fact isn't lost.
    referencePrice: { min: 1249.99, max: 1249.99, currency: "USD" },
    salePrice: null,
    priceVerifiedAt: PRICE_VERIFIED_AT,
    outboundUrl: "https://realtruck.com/p/bakflip-mx4-tonneau-cover/bak-448426/",
    affiliateUrl: null,
    sourceUrl: "https://realtruck.com/p/bakflip-mx4-tonneau-cover/bak-448426/",
    verificationStatus: "verified",
    lastVerifiedDate: SPEC_VERIFIED_AT,
  },
  {
    id: "bak-revolver-x4s-3g",
    name: "BAK Revolver X4s Hard Rolling Tonneau Cover — 80427",
    merchantId: "bak",
    coverType: "hard-rolling",
    // Deck Rail requirement: not established by current source — see file
    // header re-audit note.
    referencePrice: { min: 1549.99, max: 1549.99, currency: "USD" },
    salePrice: null,
    priceVerifiedAt: PRICE_VERIFIED_AT,
    outboundUrl: "https://realtruck.com/p/bak-revolver-x4-tonneau-cover/bak-80427/",
    affiliateUrl: null,
    sourceUrl: "https://realtruck.com/p/bak-revolver-x4-tonneau-cover/bak-80427/",
    verificationStatus: "verified",
    lastVerifiedDate: SPEC_VERIFIED_AT,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
