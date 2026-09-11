import type { Truck } from "@/domains/tonneau/types";

export const trucks: Truck[] = [
  { id: "toyota-tacoma", make: "Toyota", model: "Tacoma", slug: ["toyota", "tacoma"] },
];

export function getTruckById(id: string): Truck | undefined {
  return trucks.find((t) => t.id === id);
}
