import type { Generation } from "@/lib/types";

export const generations: Generation[] = [
  {
    id: "4runner-5th-gen",
    vehicleId: "toyota-4runner",
    name: "5th Generation",
    yearStart: 2010,
    yearEnd: 2024,
  },
  {
    id: "4runner-6th-gen",
    vehicleId: "toyota-4runner",
    name: "6th Generation",
    yearStart: 2025,
    yearEnd: 2026,
  },
];

/** Returns the generation whose year range covers `year`, for the given vehicle. */
export function getGenerationForYear(
  vehicleId: string,
  year: number
): Generation | undefined {
  return generations.find(
    (g) => g.vehicleId === vehicleId && year >= g.yearStart && year <= g.yearEnd
  );
}

export function getGenerationById(id: string): Generation | undefined {
  return generations.find((g) => g.id === id);
}

export function getGenerationsForVehicle(vehicleId: string): Generation[] {
  return generations.filter((g) => g.vehicleId === vehicleId);
}

/** All model years covered by any generation of this vehicle, newest first. */
export function getYearsForVehicle(vehicleId: string): number[] {
  const vehicleGenerations = getGenerationsForVehicle(vehicleId);
  const years = new Set<number>();
  for (const gen of vehicleGenerations) {
    for (let year = gen.yearStart; year <= gen.yearEnd; year++) {
      years.add(year);
    }
  }
  return Array.from(years).sort((a, b) => b - a);
}
