import type { Merchant } from "@/domains/tonneau/types";

/**
 * Both current candidate merchants for this domain run their affiliate
 * programs through Impact — the same network RackFit already carries a
 * verified Media Property tag for (see `src/app/layout.tsx`). No affiliate
 * application/link has been obtained in this phase (explicitly out of
 * scope); `affiliateUrl` on every Tonneau product stays `null`.
 */
export const merchants: Merchant[] = [
  { id: "worksport", name: "Worksport", websiteUrl: "https://worksport.com" },
  { id: "bak", name: "BAK Industries", websiteUrl: "https://bakindustries.com" },
];

export function getMerchantById(id: string): Merchant | undefined {
  return merchants.find((m) => m.id === id);
}
