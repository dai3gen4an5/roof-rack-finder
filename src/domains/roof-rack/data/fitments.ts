import type { Fitment } from "@/domains/roof-rack/types";

/**
 * Each fitment record is the manufacturer's own statement that a given
 * product fits a given generation. Verified directly against the product
 * page named in `sourceUrl` — never inferred from year math alone.
 */
export const fitments: Fitment[] = [
  {
    id: "fitment-prinsu-full-nondrill-5th-gen",
    productId: "prinsu-4runner-5th-gen-full-non-drill",
    generationId: "4runner-5th-gen",
    sourceUrl: "https://prinsu.com/product/t4r5-prinsu-roofrack-full-no-drill-2/",
    verificationStatus: "verified",
    lastVerifiedDate: "2026-09-04",
  },
  {
    id: "fitment-prinsu-three-quarter-5th-gen",
    productId: "prinsu-4runner-5th-gen-three-quarter",
    generationId: "4runner-5th-gen",
    sourceUrl:
      "https://prinsu.com/product/2010-2024-toyota-4runner-prinsu-roofrac-3-4-2/",
    verificationStatus: "verified",
    lastVerifiedDate: "2026-09-04",
  },
  {
    id: "fitment-prinsu-pro-5th-gen",
    productId: "prinsu-4runner-5th-gen-pro",
    generationId: "4runner-5th-gen",
    sourceUrl:
      "https://prinsu.com/product/prinsu-pro-toyota-4runner-full-roof-rack-2010-current/",
    verificationStatus: "verified",
    lastVerifiedDate: "2026-09-04",
  },
  {
    id: "fitment-prinsu-original-6th-gen",
    productId: "prinsu-4runner-6th-gen-original",
    generationId: "4runner-6th-gen",
    sourceUrl: "https://prinsu.com/product/toyota-4runner-original-prinsu-roof-rack-2025/",
    verificationStatus: "verified",
    lastVerifiedDate: "2026-09-04",
  },
  {
    id: "fitment-prinsu-pro-6th-gen",
    productId: "prinsu-4runner-6th-gen-pro",
    generationId: "4runner-6th-gen",
    sourceUrl: "https://prinsu.com/product/toyota-4runner-prinsu-pro-roof-rack-2025/",
    verificationStatus: "verified",
    lastVerifiedDate: "2026-09-04",
  },

  // --- Toyota Tacoma (Prinsu) ---------------------------------------------
  // Both "Cab Rack" products (Original, Pro) state 2005-2023 consistently
  // across their own product-page title/features/body — that range spans
  // both the 2nd Gen (2005-2015) and 3rd Gen (2016-2023) generations, so
  // each gets its own fitment row against the same product.
  //
  // variantId = Double Cab on every row below. This is NOT inferred from
  // the absence of a restriction on the product page (that would be
  // exactly the "absence of restriction = universal fitment" guess this
  // project forbids). It's based on an explicit, separate, first-party
  // statement on Prinsu's own official buying guide
  // (https://prinsu.com/choosing-the-right-tacoma-roof-rack/, 2024-12-18):
  // "Both racks are compatible with the double cab configuration of the
  // Toyota Tacoma." That guide never mentions Access Cab or Regular Cab,
  // so no claim is made for those — Access Cab fitment for this year range
  // is covered separately and only by the dedicated Access Rack below.
  {
    id: "fitment-tacoma-cab-rack-original-2nd-gen",
    productId: "prinsu-tacoma-cab-rack-original",
    generationId: "tacoma-2nd-gen",
    variantId: "tacoma-2nd-gen-double-cab",
    sourceUrl: "https://prinsu.com/product/2005-2023-toyota-tacoma-prinsu-cabrac/",
    verificationStatus: "verified",
    lastVerifiedDate: "2026-09-07",
  },
  {
    id: "fitment-tacoma-cab-rack-original-3rd-gen",
    productId: "prinsu-tacoma-cab-rack-original",
    generationId: "tacoma-3rd-gen",
    variantId: "tacoma-3rd-gen-double-cab",
    sourceUrl: "https://prinsu.com/product/2005-2023-toyota-tacoma-prinsu-cabrac/",
    verificationStatus: "verified",
    lastVerifiedDate: "2026-09-07",
  },
  {
    id: "fitment-tacoma-cab-rack-pro-2nd-gen",
    productId: "prinsu-tacoma-cab-rack-pro",
    generationId: "tacoma-2nd-gen",
    variantId: "tacoma-2nd-gen-double-cab",
    sourceUrl: "https://prinsu.com/product/prinsu-pro-toyota-tacoma-roof-rack-2005-2023/",
    verificationStatus: "verified",
    lastVerifiedDate: "2026-09-07",
  },
  {
    id: "fitment-tacoma-cab-rack-pro-3rd-gen",
    productId: "prinsu-tacoma-cab-rack-pro",
    generationId: "tacoma-3rd-gen",
    variantId: "tacoma-3rd-gen-double-cab",
    sourceUrl: "https://prinsu.com/product/prinsu-pro-toyota-tacoma-roof-rack-2005-2023/",
    verificationStatus: "verified",
    lastVerifiedDate: "2026-09-07",
  },

  // Access Rack: consistently states "Fits Access Cab Tacomas from
  // 2005-2022" across its meta description, feature bullets, and
  // breadcrumb/schema data. (An earlier pass recorded a supposed
  // "2010-2023" conflict from the page body; re-verified directly against
  // the raw page HTML on 2026-09-07 and that text does not actually exist
  // anywhere on the page — it was an artifact of an AI-summarized fetch,
  // not a real second manufacturer statement. Corrected here: no
  // conflict, no narrowed yearStart needed for the 2nd Gen row.) The
  // page's own <title>/post-title metadata separately says "2005-2018" —
  // but that's a stale SEO/browser-tab field inconsistent with every
  // customer-visible statement on the same page (including on the
  // near-identical Cab Rack Original page, which has the identical stale
  // "2005-2018" title despite consistently saying 2005-2023 everywhere
  // else) — treated as site technical debt, not a competing fitment claim.
  // Only the 3rd Gen row needs narrowing, via yearEnd (2022 < the
  // generation's own 2023 end). 2023 Access Cab is deliberately NOT
  // verified fitment.
  {
    id: "fitment-tacoma-access-rack-2nd-gen",
    productId: "prinsu-tacoma-access-rack",
    generationId: "tacoma-2nd-gen",
    variantId: "tacoma-2nd-gen-access-cab",
    sourceUrl: "https://prinsu.com/product/2005-2023-toyota-tacoma-prinsu-accessrac/",
    verificationStatus: "verified",
    lastVerifiedDate: "2026-09-07",
  },
  {
    id: "fitment-tacoma-access-rack-3rd-gen",
    productId: "prinsu-tacoma-access-rack",
    generationId: "tacoma-3rd-gen",
    variantId: "tacoma-3rd-gen-access-cab",
    yearEnd: 2022,
    sourceUrl: "https://prinsu.com/product/2005-2023-toyota-tacoma-prinsu-accessrac/",
    verificationStatus: "verified",
    lastVerifiedDate: "2026-09-07",
  },

  // 4th Gen (2024-2026): neither product's page states a cab restriction,
  // and no Variant rows exist for this generation — both fitments are
  // generation-wide. The Double Cab confirmation used above for the
  // 2005-2023 Cab Rack products (from Prinsu's buying guide) is
  // deliberately NOT extended here: unlike 2005-2023, no dedicated
  // Access-Cab-specific (or any other cab-specific) Prinsu SKU exists for
  // the 4th Gen, so there's no evidence cab configuration is even a
  // fitment-relevant axis for this era's products.
  {
    id: "fitment-tacoma-4th-gen-original",
    productId: "prinsu-tacoma-4th-gen-original",
    generationId: "tacoma-4th-gen",
    sourceUrl: "https://prinsu.com/product/toyota-tacoma-original-prinsu-roof-rack-2024/",
    verificationStatus: "verified",
    lastVerifiedDate: "2026-09-07",
  },
  {
    id: "fitment-tacoma-4th-gen-pro",
    productId: "prinsu-tacoma-4th-gen-pro",
    generationId: "tacoma-4th-gen",
    sourceUrl: "https://prinsu.com/product/prinsu-pro-toyota-tacoma-cab-rack-2024/",
    verificationStatus: "verified",
    lastVerifiedDate: "2026-09-07",
  },
];

export function getFitmentsForProduct(productId: string): Fitment[] {
  return fitments.filter((f) => f.productId === productId);
}

export function getFitmentsForGeneration(generationId: string): Fitment[] {
  return fitments.filter((f) => f.generationId === generationId);
}
