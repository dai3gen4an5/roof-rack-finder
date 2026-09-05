import { getFitmentsForGeneration } from "@/lib/data/fitments";
import { getProductById } from "@/lib/data/products";
import { getMerchantById } from "@/lib/data/merchants";
import { capacityLbs } from "@/lib/recommend";
import type { Generation, Recommendation } from "@/lib/types";

/**
 * All manufacturer-verified products for a generation, independent of any
 * particular use case or ranking preference — used for general "here's
 * what fits your 4Runner" listings (e.g. the per-year pages) rather than
 * the preference-driven finder results. `reasons` is always empty here
 * since there's no specific request to explain a ranking against.
 */
export function getVerifiedProductsForGeneration(generation: Generation): Recommendation[] {
  const fitments = getFitmentsForGeneration(generation.id).filter(
    (f) => f.verificationStatus === "verified"
  );

  const items: Recommendation[] = fitments.flatMap((fitment) => {
    const product = getProductById(fitment.productId);
    const merchant = product ? getMerchantById(product.merchantId) : undefined;
    if (!product || !merchant) return [];
    return [{ product, merchant, fitment, generation, reasons: [] }];
  });

  return items.sort((a, b) => {
    if (a.product.rackLength !== b.product.rackLength) {
      return a.product.rackLength === "full" ? -1 : 1;
    }
    return a.product.referencePrice.min - b.product.referencePrice.min;
  });
}

export interface FullLengthComparison {
  cheaper: Recommendation;
  higherCapacity: Recommendation;
  priceDelta: number;
  capacityDelta: number;
}

/**
 * When a generation has more than one verified full-length option, summarizes
 * the price/capacity tradeoff between the cheapest and the highest-capacity
 * one — generic across manufacturers/product names, not hardcoded to any
 * specific product line.
 */
export function compareFullLengthOptions(generation: Generation): FullLengthComparison | null {
  const fullLength = getVerifiedProductsForGeneration(generation).filter(
    (r) => r.product.rackLength === "full"
  );
  if (fullLength.length < 2) return null;

  const cheaper = [...fullLength].sort(
    (a, b) => a.product.referencePrice.min - b.product.referencePrice.min
  )[0];
  const higherCapacity = [...fullLength].sort(
    (a, b) => capacityLbs(b.product) - capacityLbs(a.product)
  )[0];

  if (cheaper.product.id === higherCapacity.product.id) return null;

  return {
    cheaper,
    higherCapacity,
    priceDelta: higherCapacity.product.referencePrice.min - cheaper.product.referencePrice.min,
    capacityDelta: capacityLbs(higherCapacity.product) - capacityLbs(cheaper.product),
  };
}
