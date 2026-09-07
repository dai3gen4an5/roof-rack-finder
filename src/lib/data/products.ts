import type { Product } from "@/lib/types";

/**
 * All fields below (price, capacities, install type) were checked directly
 * against the manufacturer's own product pages on prinsu.com.
 *
 * `referencePrice` is always the manufacturer's regular/list price, never a
 * temporary promo. Prinsu was running a sitewide "Labor Day Sale" (10% off)
 * at verification time; that sale price is deliberately NOT baked into this
 * static seed data as `salePrice` — a promo hardcoded into source control
 * goes stale the moment the sale ends, which is exactly the failure mode to
 * avoid. `salePrice` stays `null` here; only set it from a verification step
 * that happens close to when the page is actually served.
 */
const ALL_USE_CASES: Product["useCases"] = [
  "rooftop-tent",
  "cargo-storage",
  "kayak-surf",
  "bike-ski",
  "overlanding",
];

const PRICE_VERIFIED_AT = "2026-09-04";
const SPEC_VERIFIED_AT = "2026-09-04";

const TACOMA_PRICE_VERIFIED_AT = "2026-09-07";
const TACOMA_SPEC_VERIFIED_AT = "2026-09-07";

export const products: Product[] = [
  {
    id: "prinsu-4runner-5th-gen-full-non-drill",
    name: "5th Gen Toyota 4Runner Prinsu Roof Rack Full Non-Drill",
    merchantId: "prinsu",
    rackLength: "full",
    installationType: "factory-mount-non-drill",
    dynamicCapacityLbs: 600,
    staticCapacityLbs: 1000,
    referencePrice: { min: 980, max: 980, currency: "USD" },
    salePrice: null,
    priceVerifiedAt: PRICE_VERIFIED_AT,
    useCases: ALL_USE_CASES,
    outboundUrl: "https://prinsu.com/product/t4r5-prinsu-roofrack-full-no-drill-2/",
    affiliateUrl: null,
    sourceUrl: "https://prinsu.com/product/t4r5-prinsu-roofrack-full-no-drill-2/",
    verificationStatus: "verified",
    lastVerifiedDate: SPEC_VERIFIED_AT,
  },
  {
    id: "prinsu-4runner-5th-gen-three-quarter",
    name: "Toyota 4Runner Prinsu Roof Rack 3/4",
    merchantId: "prinsu",
    rackLength: "three-quarter",
    installationType: "factory-mount-non-drill",
    dynamicCapacityLbs: 600,
    staticCapacityLbs: 1000,
    referencePrice: { min: 960, max: 1060, currency: "USD" },
    salePrice: null,
    priceVerifiedAt: PRICE_VERIFIED_AT,
    useCases: ALL_USE_CASES,
    outboundUrl:
      "https://prinsu.com/product/2010-2024-toyota-4runner-prinsu-roofrac-3-4-2/",
    affiliateUrl: null,
    sourceUrl:
      "https://prinsu.com/product/2010-2024-toyota-4runner-prinsu-roofrac-3-4-2/",
    verificationStatus: "verified",
    lastVerifiedDate: SPEC_VERIFIED_AT,
  },
  {
    id: "prinsu-4runner-5th-gen-pro",
    name: "Prinsu Pro Toyota 4Runner Full Roof Rack",
    merchantId: "prinsu",
    rackLength: "full",
    installationType: "bolt-on-non-drill",
    dynamicCapacityLbs: 700,
    staticCapacityLbs: 1200,
    referencePrice: { min: 1380, max: 1380, currency: "USD" },
    salePrice: null,
    priceVerifiedAt: PRICE_VERIFIED_AT,
    useCases: ALL_USE_CASES,
    outboundUrl:
      "https://prinsu.com/product/prinsu-pro-toyota-4runner-full-roof-rack-2010-current/",
    affiliateUrl: null,
    sourceUrl:
      "https://prinsu.com/product/prinsu-pro-toyota-4runner-full-roof-rack-2010-current/",
    verificationStatus: "verified",
    lastVerifiedDate: SPEC_VERIFIED_AT,
  },
  {
    id: "prinsu-4runner-6th-gen-original",
    name: "Toyota 4Runner Original Prinsu Roof Rack",
    merchantId: "prinsu",
    rackLength: "full",
    installationType: "bolt-on-non-drill",
    dynamicCapacityLbs: 600,
    staticCapacityLbs: 1000,
    referencePrice: { min: 980, max: 980, currency: "USD" },
    salePrice: null,
    priceVerifiedAt: PRICE_VERIFIED_AT,
    useCases: ALL_USE_CASES,
    outboundUrl: "https://prinsu.com/product/toyota-4runner-original-prinsu-roof-rack-2025/",
    affiliateUrl: null,
    sourceUrl: "https://prinsu.com/product/toyota-4runner-original-prinsu-roof-rack-2025/",
    verificationStatus: "verified",
    lastVerifiedDate: SPEC_VERIFIED_AT,
  },
  {
    id: "prinsu-4runner-6th-gen-pro",
    name: "Toyota 4Runner Prinsu Pro Roof Rack",
    merchantId: "prinsu",
    rackLength: "full",
    installationType: "bolt-on-non-drill",
    dynamicCapacityLbs: 700,
    staticCapacityLbs: 1200,
    referencePrice: { min: 1380, max: 1380, currency: "USD" },
    salePrice: null,
    priceVerifiedAt: PRICE_VERIFIED_AT,
    useCases: ALL_USE_CASES,
    outboundUrl: "https://prinsu.com/product/toyota-4runner-prinsu-pro-roof-rack-2025/",
    affiliateUrl: null,
    sourceUrl: "https://prinsu.com/product/toyota-4runner-prinsu-pro-roof-rack-2025/",
    verificationStatus: "verified",
    lastVerifiedDate: SPEC_VERIFIED_AT,
  },
  // --- Toyota Tacoma (Prinsu) ---------------------------------------------
  // Re-verified directly against prinsu.com raw HTML (WooCommerce variation
  // data) on 2026-09-07, correcting an earlier pass that had recorded the
  // active "10% OFF" sale price as if it were the regular price. Every
  // product below currently shows a sitewide 10% discount; `referencePrice`
  // is the pre-discount `display_regular_price`, `salePrice` is the active
  // `display_price`, taken directly from each product's variation JSON.
  //
  // Cab-configuration note: Prinsu's own official buying guide
  // (https://prinsu.com/choosing-the-right-tacoma-roof-rack/, dated
  // 2024-12-18) states in its own prose: "Both racks are compatible with
  // the double cab configuration of the Toyota Tacoma" — referring
  // generically to the Original and Pro tiers (it links to filtered
  // category pages, not a specific product page). This is a genuine,
  // first-party, explicit confirmation, not an absence-of-restriction
  // inference — so the Cab Rack Original/Pro fitment rows for 2005-2023
  // (2nd/3rd Gen) now carry a Double Cab variantId; see fitments.ts. The
  // guide never mentions Access Cab or Regular Cab, so no claim is made
  // there. This guide's generic Original/Pro framing is NOT extended to the
  // 4th Gen (2024-2026) products below — unlike 2005-2023, no competing
  // cab-specific Prinsu SKU exists for the 4th Gen to establish that cab
  // configuration is even a fitment-relevant axis for that era, so no
  // variant is modeled for it (see variants.ts).
  {
    id: "prinsu-tacoma-cab-rack-original",
    name: "Toyota Tacoma Prinsu Cab Rack",
    merchantId: "prinsu",
    rackLength: "full",
    installationType: "factory-mount-non-drill",
    dynamicCapacityLbs: 600,
    staticCapacityLbs: 1000,
    referencePrice: { min: 780, max: 880, currency: "USD" },
    salePrice: { min: 702, max: 792, currency: "USD" },
    priceVerifiedAt: TACOMA_PRICE_VERIFIED_AT,
    useCases: ALL_USE_CASES,
    outboundUrl: "https://prinsu.com/product/2005-2023-toyota-tacoma-prinsu-cabrac/",
    affiliateUrl: null,
    sourceUrl: "https://prinsu.com/product/2005-2023-toyota-tacoma-prinsu-cabrac/",
    verificationStatus: "verified",
    lastVerifiedDate: TACOMA_SPEC_VERIFIED_AT,
  },
  {
    id: "prinsu-tacoma-cab-rack-pro",
    name: "Prinsu Pro Toyota Tacoma Cab Rack",
    merchantId: "prinsu",
    rackLength: "full",
    installationType: "bolt-on-non-drill",
    dynamicCapacityLbs: 700,
    staticCapacityLbs: 1200,
    referencePrice: { min: 1080, max: 1180, currency: "USD" },
    salePrice: { min: 972, max: 1062, currency: "USD" },
    priceVerifiedAt: TACOMA_PRICE_VERIFIED_AT,
    useCases: ALL_USE_CASES,
    outboundUrl: "https://prinsu.com/product/prinsu-pro-toyota-tacoma-roof-rack-2005-2023/",
    affiliateUrl: null,
    sourceUrl: "https://prinsu.com/product/prinsu-pro-toyota-tacoma-roof-rack-2005-2023/",
    verificationStatus: "verified",
    lastVerifiedDate: TACOMA_SPEC_VERIFIED_AT,
  },
  {
    id: "prinsu-tacoma-access-rack",
    name: "Toyota Tacoma Prinsu Access Rack",
    merchantId: "prinsu",
    rackLength: "full",
    installationType: "drilled",
    dynamicCapacityLbs: 600,
    staticCapacityLbs: 1000,
    referencePrice: { min: 780, max: 960, currency: "USD" },
    salePrice: { min: 702, max: 864, currency: "USD" },
    priceVerifiedAt: TACOMA_PRICE_VERIFIED_AT,
    useCases: ALL_USE_CASES,
    outboundUrl: "https://prinsu.com/product/2005-2023-toyota-tacoma-prinsu-accessrac/",
    affiliateUrl: null,
    sourceUrl: "https://prinsu.com/product/2005-2023-toyota-tacoma-prinsu-accessrac/",
    verificationStatus: "verified",
    lastVerifiedDate: TACOMA_SPEC_VERIFIED_AT,
  },
  {
    id: "prinsu-tacoma-4th-gen-original",
    name: "Toyota Tacoma Original Prinsu Roof Rack",
    merchantId: "prinsu",
    rackLength: "full",
    installationType: "bolt-on-non-drill",
    dynamicCapacityLbs: 600,
    staticCapacityLbs: 1000,
    referencePrice: { min: 780, max: 880, currency: "USD" },
    salePrice: { min: 702, max: 792, currency: "USD" },
    priceVerifiedAt: TACOMA_PRICE_VERIFIED_AT,
    useCases: ALL_USE_CASES,
    outboundUrl: "https://prinsu.com/product/toyota-tacoma-original-prinsu-roof-rack-2024/",
    affiliateUrl: null,
    sourceUrl: "https://prinsu.com/product/toyota-tacoma-original-prinsu-roof-rack-2024/",
    verificationStatus: "verified",
    lastVerifiedDate: TACOMA_SPEC_VERIFIED_AT,
  },
  {
    id: "prinsu-tacoma-4th-gen-pro",
    name: "Prinsu Pro Toyota Tacoma Cab Rack",
    merchantId: "prinsu",
    rackLength: "full",
    installationType: "bolt-on-non-drill",
    dynamicCapacityLbs: 700,
    staticCapacityLbs: 1200,
    referencePrice: { min: 1140, max: 1140, currency: "USD" },
    salePrice: { min: 1026, max: 1026, currency: "USD" },
    priceVerifiedAt: TACOMA_PRICE_VERIFIED_AT,
    useCases: ALL_USE_CASES,
    outboundUrl: "https://prinsu.com/product/prinsu-pro-toyota-tacoma-cab-rack-2024/",
    affiliateUrl: null,
    sourceUrl: "https://prinsu.com/product/prinsu-pro-toyota-tacoma-cab-rack-2024/",
    verificationStatus: "verified",
    lastVerifiedDate: TACOMA_SPEC_VERIFIED_AT,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
