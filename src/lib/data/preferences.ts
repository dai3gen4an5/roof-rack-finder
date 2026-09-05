import type { Preference } from "@/lib/types";

export const preferences: Preference[] = [
  {
    id: "best-overall",
    label: "Best overall",
    description: "A balanced pick across capacity, price, and coverage.",
  },
  {
    id: "max-capacity",
    label: "Maximum capacity",
    description: "Prioritize the highest manufacturer-stated load capacity.",
  },
  {
    id: "lower-cost",
    label: "Lower cost",
    description: "Prioritize the lowest reference price.",
  },
  {
    id: "smaller-three-quarter",
    label: "Smaller / 3/4 rack",
    description: "Prioritize a 3/4-length rack over full-length.",
  },
];

export function getPreferenceById(id: string): Preference | undefined {
  return preferences.find((p) => p.id === id);
}
