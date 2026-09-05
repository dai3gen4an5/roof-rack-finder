import type { Merchant } from "@/lib/types";

export const merchants: Merchant[] = [
  {
    id: "prinsu",
    name: "Prinsu",
    websiteUrl: "https://prinsu.com",
  },
];

export function getMerchantById(id: string): Merchant | undefined {
  return merchants.find((m) => m.id === id);
}
