import type { Generation } from "@/domains/tonneau/types";

/**
 * Generation boundaries match the same Toyota Tacoma generation years
 * already used in `src/domains/roof-rack/data/generations.ts` (2005–2015 /
 * 2016–2023 / 2024–2026) — that boundary is a Toyota platform fact, not a
 * roof-rack-specific claim, so it's independently verified and re-declared
 * here rather than imported, per the "no shared dataset between domains"
 * instruction for this phase. IDs use this domain's own `tacoma-Ng`
 * convention (distinct from roof-rack's `tacoma-Nth-gen` convention) —
 * the two domains' data modules are fully independent and never
 * cross-import.
 */
export const generations: Generation[] = [
  { id: "tacoma-2g", truckId: "toyota-tacoma", name: "2nd Gen", yearStart: 2005, yearEnd: 2015 },
  { id: "tacoma-3g", truckId: "toyota-tacoma", name: "3rd Gen", yearStart: 2016, yearEnd: 2023 },
  { id: "tacoma-4g", truckId: "toyota-tacoma", name: "4th Gen", yearStart: 2024, yearEnd: 2026 },
];

export function getGenerationForYear(truckId: string, year: number): Generation | undefined {
  return generations.find(
    (g) => g.truckId === truckId && year >= g.yearStart && year <= g.yearEnd
  );
}

export function getGenerationById(id: string): Generation | undefined {
  return generations.find((g) => g.id === id);
}
