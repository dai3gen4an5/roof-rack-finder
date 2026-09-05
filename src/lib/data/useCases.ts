import type { UseCase } from "@/lib/types";

export const useCases: UseCase[] = [
  {
    id: "rooftop-tent",
    label: "Rooftop Tent",
    description: "Sleeping platform mounted on the rack.",
  },
  {
    id: "cargo-storage",
    label: "Cargo / Storage",
    description: "Boxes, bins, or a cargo basket for gear.",
  },
  {
    id: "kayak-surf",
    label: "Kayak / Surf",
    description: "Kayaks, surfboards, or paddleboards.",
  },
  {
    id: "bike-ski",
    label: "Bike / Ski",
    description: "Bike trays/forks or ski and snowboard carriers.",
  },
  {
    id: "overlanding",
    label: "General Overlanding",
    description: "A mix of gear, recovery equipment, and accessories.",
  },
];

export function getUseCaseById(id: string): UseCase | undefined {
  return useCases.find((u) => u.id === id);
}
