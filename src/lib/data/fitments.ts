import type { Fitment } from "@/lib/types";

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
];

export function getFitmentsForProduct(productId: string): Fitment[] {
  return fitments.filter((f) => f.productId === productId);
}

export function getFitmentsForGeneration(generationId: string): Fitment[] {
  return fitments.filter((f) => f.generationId === generationId);
}
