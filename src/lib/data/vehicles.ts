import type { Vehicle } from "@/lib/types";

export const vehicles: Vehicle[] = [
  {
    id: "toyota-4runner",
    make: "Toyota",
    model: "4Runner",
    slug: ["toyota", "4runner"],
  },
];

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}

export function getVehicleBySlug(make: string, model: string): Vehicle | undefined {
  return vehicles.find(
    (v) => v.slug[0] === make.toLowerCase() && v.slug[1] === model.toLowerCase()
  );
}
