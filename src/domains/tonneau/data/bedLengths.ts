import type { BedLength } from "@/domains/tonneau/types";

/**
 * Bed length is the fitment-determining configuration axis for tonneau
 * covers (see the doc comment on `BedLength` in types.ts) — this is this
 * domain's equivalent of a Core `Variant` row per generation.
 *
 * Labels are the rounded "5 ft" / "6 ft" nominal class every manufacturer
 * markets by, not any one manufacturer's own precise notation (Toyota's
 * own spec sheets say 60.3"/60.5" and 73.5"/73.7"; BAK/Worksport write
 * 5'1"/6'2"). The `id` is the stable match key; the differing precise
 * inches and manufacturer notations are recorded per-product/per-fitment
 * in comments in products.ts/fitments.ts where they matter, not baked into
 * this label.
 */
export const bedLengths: BedLength[] = [
  { id: "tacoma-2g-5ft", generationId: "tacoma-2g", label: "5 ft bed" },
  { id: "tacoma-2g-6ft", generationId: "tacoma-2g", label: "6 ft bed" },
  { id: "tacoma-3g-5ft", generationId: "tacoma-3g", label: "5 ft bed" },
  { id: "tacoma-3g-6ft", generationId: "tacoma-3g", label: "6 ft bed" },
  { id: "tacoma-4g-5ft", generationId: "tacoma-4g", label: "5 ft bed" },
  { id: "tacoma-4g-6ft", generationId: "tacoma-4g", label: "6 ft bed" },
];

export function getBedLengthsForGeneration(generationId: string): BedLength[] {
  return bedLengths.filter((b) => b.generationId === generationId);
}

export function getBedLengthById(id: string): BedLength | undefined {
  return bedLengths.find((b) => b.id === id);
}
