import type { Variant } from "@/lib/types";

/**
 * Configuration-axis rows (e.g. cab type on a truck), scoped by generation.
 * A generation with no rows here has no variant step in the finder and no
 * variant constraint on its fitments.
 *
 * Toyota Tacoma 2nd/3rd Gen: Double Cab and Access Cab are real,
 * Toyota-documented body styles for these generations — that's a vehicle
 * configuration fact, not a rack-fitment claim, so listing both as
 * selectable options here is not "guessing fitment." What IS a fitment
 * claim is which `Fitment` rows reference a `variantId` — see
 * src/lib/data/fitments.ts. As of this data's last check: the Access Rack
 * (Prinsu) is Access Cab-specific per its own product page; the "Cab Rack"
 * (Original/Pro) is Double Cab-specific per Prinsu's official buying guide
 * (a separate first-party page, not the product pages themselves, which
 * state no cab restriction on their own). Neither product line makes any
 * claim about Access Cab and Double Cab respectively — there is currently
 * no verified Access-Cab-eligible Cab Rack, nor a verified Double-Cab-
 * eligible Access Rack.
 *
 * Toyota Tacoma 4th Gen (2024–2026): no variant rows. Neither of the two
 * Prinsu products found for this generation states any cab restriction,
 * so there is nothing to model a configuration axis around yet.
 */
export const variants: Variant[] = [
  { id: "tacoma-2nd-gen-double-cab", generationId: "tacoma-2nd-gen", label: "Double Cab" },
  { id: "tacoma-2nd-gen-access-cab", generationId: "tacoma-2nd-gen", label: "Access Cab" },
  { id: "tacoma-3rd-gen-double-cab", generationId: "tacoma-3rd-gen", label: "Double Cab" },
  { id: "tacoma-3rd-gen-access-cab", generationId: "tacoma-3rd-gen", label: "Access Cab" },
];

export function getVariantsForGeneration(generationId: string): Variant[] {
  return variants.filter((v) => v.generationId === generationId);
}

export function getVariantById(id: string): Variant | undefined {
  return variants.find((v) => v.id === id);
}
