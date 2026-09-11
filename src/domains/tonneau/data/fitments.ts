import type { Fitment } from "@/domains/tonneau/types";

const VERIFIED_AT = "2026-09-11";

/**
 * Every row below is `verified` — sourced from the product's own
 * manufacturer/current-seller page (see products.ts header for the
 * source-confidence note on price vs. fitment). No fitment is inferred
 * from "no restriction mentioned" — every generation × bed-length
 * combination NOT listed here (e.g. 4th Gen 6 ft bed for anything except
 * the AL3's narrowed 2024–2025 window, or any 2026 6 ft combination at
 * all) has zero verified rows on purpose, and `recommendCovers` returns an
 * honest empty result for it rather than guessing.
 */
export const fitments: Fitment[] = [
  // --- Worksport AL3 -------------------------------------------------
  {
    id: "fit-al3-3g-5ft",
    productId: "worksport-al3",
    generationId: "tacoma-3g",
    bedLengthId: "tacoma-3g-5ft",
    // Worksport's own install-guide table: "2016-2023 Toyota Tacoma, 5'1"
    // bed with Deck Rail System" — matches the full 3rd Gen boundary, no
    // narrowing needed.
    sourceUrl: "https://www.worksport.com/products/al3",
    verificationStatus: "verified",
    lastVerifiedDate: VERIFIED_AT,
  },
  {
    id: "fit-al3-4g-6ft",
    productId: "worksport-al3",
    generationId: "tacoma-4g",
    bedLengthId: "tacoma-4g-6ft",
    // Worksport's own install-guide table states "2024-2025 Toyota
    // Tacoma, 6'2" bed with Deck Rail System" — narrower than the 4th
    // Gen's full 2024-2026 boundary. 2026 is deliberately NOT covered:
    // no verified source states this product fits the 2026 model year.
    yearStart: 2024,
    yearEnd: 2025,
    sourceUrl: "https://www.worksport.com/products/al3",
    verificationStatus: "verified",
    lastVerifiedDate: VERIFIED_AT,
  },
  // --- Worksport AL4 -------------------------------------------------
  {
    id: "fit-al4-3g-5ft",
    productId: "worksport-al4",
    generationId: "tacoma-3g",
    bedLengthId: "tacoma-3g-5ft",
    sourceUrl: "https://www.worksport.com/products/al4",
    verificationStatus: "verified",
    lastVerifiedDate: VERIFIED_AT,
  },
  {
    id: "fit-al4-3g-6ft",
    productId: "worksport-al4",
    generationId: "tacoma-3g",
    bedLengthId: "tacoma-3g-6ft",
    sourceUrl: "https://www.worksport.com/products/al4",
    verificationStatus: "verified",
    lastVerifiedDate: VERIFIED_AT,
  },
  {
    id: "fit-al4-4g-5ft",
    productId: "worksport-al4",
    generationId: "tacoma-4g",
    bedLengthId: "tacoma-4g-5ft",
    // Worksport's own install-guide table: "2024-2026 Toyota Tacoma, 5'1"
    // bed with Deck Rail System" — no 6'2" bed row exists for the 4th Gen
    // on this product; deliberately not added here.
    sourceUrl: "https://www.worksport.com/products/al4",
    verificationStatus: "verified",
    lastVerifiedDate: VERIFIED_AT,
  },
  // --- BAK / RealTruck, 2nd Gen ---------------------------------------
  {
    id: "fit-bak-mx4-2g-5ft",
    productId: "bak-bakflip-mx4-2g",
    generationId: "tacoma-2g",
    bedLengthId: "tacoma-2g-5ft",
    // realtruck.com/p/bakflip-mx4-tonneau-cover/bak-448406/: "Fits
    // 2005-2015 Toyota Tacoma, 5'1" Bed" — matches the full 2nd Gen
    // boundary.
    sourceUrl: "https://realtruck.com/p/bakflip-mx4-tonneau-cover/bak-448406/",
    verificationStatus: "verified",
    lastVerifiedDate: VERIFIED_AT,
  },
  {
    id: "fit-bak-x4-2g-6ft",
    productId: "bak-revolver-x4-2g",
    generationId: "tacoma-2g",
    bedLengthId: "tacoma-2g-6ft",
    // realtruck.com/p/bak-revolver-x4-tonneau-cover/bak-80407/: "Fits
    // 2005-2015 Toyota Tacoma, 6'2" Bed".
    sourceUrl: "https://realtruck.com/p/bak-revolver-x4-tonneau-cover/bak-80407/",
    verificationStatus: "verified",
    lastVerifiedDate: VERIFIED_AT,
  },
  // --- BAK / RealTruck, 3rd Gen ---------------------------------------
  {
    id: "fit-bak-mx4-3g-5ft",
    productId: "bak-bakflip-mx4-3g",
    generationId: "tacoma-3g",
    bedLengthId: "tacoma-3g-5ft",
    // realtruck.com/p/bakflip-mx4-tonneau-cover/bak-448426/: "2016-2023
    // Toyota Tacoma, 5'1" Bed" — confirmed current (this resolves the
    // Step 1 "16-21 vs 16-22 vs 16-23" source conflict: the live
    // authoritative page states 2016-2023, matching the full 3rd Gen
    // boundary).
    sourceUrl: "https://realtruck.com/p/bakflip-mx4-tonneau-cover/bak-448426/",
    verificationStatus: "verified",
    lastVerifiedDate: VERIFIED_AT,
  },
  {
    id: "fit-bak-x4s-3g-6ft",
    productId: "bak-revolver-x4s-3g",
    generationId: "tacoma-3g",
    bedLengthId: "tacoma-3g-6ft",
    // realtruck.com/p/bak-revolver-x4-tonneau-cover/bak-80427/:
    // "2016-2023 Toyota Tacoma, 6'2" Bed".
    sourceUrl: "https://realtruck.com/p/bak-revolver-x4-tonneau-cover/bak-80427/",
    verificationStatus: "verified",
    lastVerifiedDate: VERIFIED_AT,
  },
];

export function getFitmentsForGeneration(generationId: string): Fitment[] {
  return fitments.filter((f) => f.generationId === generationId);
}
