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
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
