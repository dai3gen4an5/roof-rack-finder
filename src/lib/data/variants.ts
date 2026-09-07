import type { Variant } from "@/lib/types";

/**
 * Configuration-axis rows (e.g. cab type on a truck), scoped by generation.
 * Empty today — no vehicle in this dataset has fitment that depends on
 * anything other than model year yet. A generation with no rows here has
 * no variant step in the finder and no variant constraint on its fitments;
 * that is the correct, unconfigured default, not a placeholder to fill in
 * speculatively.
 */
export const variants: Variant[] = [];

export function getVariantsForGeneration(generationId: string): Variant[] {
  return variants.filter((v) => v.generationId === generationId);
}

export function getVariantById(id: string): Variant | undefined {
  return variants.find((v) => v.id === id);
}
