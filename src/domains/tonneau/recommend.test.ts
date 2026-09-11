import { describe, expect, it } from "vitest";
import { recommendCovers, isEligibleCandidate } from "@/domains/tonneau/recommend";
import type { Candidate } from "@/domains/tonneau/recommend";
import type { Fitment, Product, Merchant, Generation } from "@/domains/tonneau/types";

// Integration-style: exercises the real seed data in data/*.ts, the same
// way domains/roof-rack/recommend.test.ts does — not synthetic fixtures,
// except in the "isEligibleCandidate - synthetic fixtures" block below,
// which isolates edge cases (unverified, deck-rail-undefined) that aren't
// naturally present in today's small verified dataset.

describe("recommendCovers - generation matching by year", () => {
  it("2010 resolves to 2nd Gen only", () => {
    const result = recommendCovers({
      truckId: "toyota-tacoma",
      year: 2010,
      bedLengthId: "tacoma-2g-5ft",
      preference: "lowest-price",
    });
    expect(result.generation?.id).toBe("tacoma-2g");
  });

  it("2020 resolves to 3rd Gen only", () => {
    const result = recommendCovers({
      truckId: "toyota-tacoma",
      year: 2020,
      bedLengthId: "tacoma-3g-5ft",
      preference: "lowest-price",
    });
    expect(result.generation?.id).toBe("tacoma-3g");
  });

  it("2024, 2025, and 2026 all resolve to 4th Gen", () => {
    for (const year of [2024, 2025, 2026]) {
      const result = recommendCovers({
        truckId: "toyota-tacoma",
        year,
        bedLengthId: "tacoma-4g-5ft",
        preference: "lowest-price",
      });
      expect(result.generation?.id).toBe("tacoma-4g");
    }
  });

  it("out-of-range years (before 2005, after 2026) return no generation and an honest note", () => {
    for (const year of [2004, 2027]) {
      const result = recommendCovers({
        truckId: "toyota-tacoma",
        year,
        preference: "lowest-price",
      });
      expect(result.generation).toBeNull();
      expect(result.recommendations).toEqual([]);
      expect(result.note).toMatch(/don't have verified/i);
    }
  });
});

describe("recommendCovers - bed length eligibility (exact verified combination inclusion)", () => {
  it("2020 / 5ft returns only 5ft-fitment products, never a 6ft-only product", () => {
    const result = recommendCovers({
      truckId: "toyota-tacoma",
      year: 2020,
      bedLengthId: "tacoma-3g-5ft",
      preference: "lowest-price",
    });
    const ids = result.recommendations.map((r) => r.product.id);
    expect(ids).toContain("worksport-al3");
    expect(ids).toContain("bak-bakflip-mx4-3g");
    expect(ids).toContain("worksport-al4"); // AL4 has both a 5ft and a 6ft fitment row — correctly appears here too
    expect(ids).not.toContain("bak-revolver-x4s-3g"); // 6ft-only, must be excluded
  });

  it("2020 / 6ft returns only 6ft-fitment products, never a 5ft-only product", () => {
    const result = recommendCovers({
      truckId: "toyota-tacoma",
      year: 2020,
      bedLengthId: "tacoma-3g-6ft",
      preference: "lowest-price",
    });
    const ids = result.recommendations.map((r) => r.product.id);
    expect(ids).toContain("worksport-al4");
    expect(ids).toContain("bak-revolver-x4s-3g");
    expect(ids).not.toContain("bak-bakflip-mx4-3g"); // 5ft-only, must be excluded
  });

  it("omitting bedLengthId on a generation that has bed-length fitments returns an honest empty result, never a guess", () => {
    const result = recommendCovers({
      truckId: "toyota-tacoma",
      year: 2020,
      preference: "lowest-price",
    });
    expect(result.recommendations).toEqual([]);
    expect(result.note).toMatch(/select your bed length/i);
  });
});

describe("recommendCovers - year-narrowed fitment (Worksport AL3, 4th Gen)", () => {
  it("2024 / 6ft includes the AL3 (its stated 2024-2025 window)", () => {
    const result = recommendCovers({
      truckId: "toyota-tacoma",
      year: 2024,
      bedLengthId: "tacoma-4g-6ft",
      preference: "lowest-price",
    });
    expect(result.recommendations.map((r) => r.product.id)).toEqual(["worksport-al3"]);
  });

  it("2025 / 6ft still includes the AL3", () => {
    const result = recommendCovers({
      truckId: "toyota-tacoma",
      year: 2025,
      bedLengthId: "tacoma-4g-6ft",
      preference: "lowest-price",
    });
    expect(result.recommendations.map((r) => r.product.id)).toEqual(["worksport-al3"]);
  });

  it("2026 / 6ft returns an honest empty result — no verified source covers a 6ft bed for the 2026 model year", () => {
    const result = recommendCovers({
      truckId: "toyota-tacoma",
      year: 2026,
      bedLengthId: "tacoma-4g-6ft",
      preference: "lowest-price",
    });
    expect(result.recommendations).toEqual([]);
    expect(result.note).toMatch(/no verified tonneau cover/i);
  });

  it("2024 / 5ft includes the AL4, never the AL3 (bed length mismatch)", () => {
    const result = recommendCovers({
      truckId: "toyota-tacoma",
      year: 2024,
      bedLengthId: "tacoma-4g-5ft",
      preference: "lowest-price",
    });
    const ids = result.recommendations.map((r) => r.product.id);
    expect(ids).toEqual(["worksport-al4"]);
  });
});

describe("recommendCovers - Deck Rail System gating", () => {
  const base = {
    truckId: "toyota-tacoma",
    year: 2020,
    bedLengthId: "tacoma-3g-5ft" as const,
    preference: "lowest-price" as const,
  };

  it("hasDeckRailSystem: false excludes every product, since every current product requires it", () => {
    const result = recommendCovers({ ...base, hasDeckRailSystem: false });
    expect(result.recommendations).toEqual([]);
    expect(result.note).toMatch(/no verified tonneau cover/i);
  });

  it("hasDeckRailSystem: true includes the otherwise-eligible products", () => {
    const result = recommendCovers({ ...base, hasDeckRailSystem: true });
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("omitting hasDeckRailSystem never excludes — unknown is not treated as false", () => {
    const result = recommendCovers(base);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });
});

describe("recommendCovers - cross-generation isolation", () => {
  it("2010 (2nd Gen) and 2020 (3rd Gen) requests for the same nominal bed length never share a product", () => {
    const gen2 = recommendCovers({
      truckId: "toyota-tacoma",
      year: 2010,
      bedLengthId: "tacoma-2g-5ft",
      preference: "lowest-price",
    });
    const gen3 = recommendCovers({
      truckId: "toyota-tacoma",
      year: 2020,
      bedLengthId: "tacoma-3g-5ft",
      preference: "lowest-price",
    });
    const gen2Ids = new Set(gen2.recommendations.map((r) => r.product.id));
    const gen3Ids = new Set(gen3.recommendations.map((r) => r.product.id));
    for (const id of gen2Ids) {
      expect(gen3Ids.has(id)).toBe(false);
    }
  });
});

describe("recommendCovers - preferences", () => {
  it("lowest-price sorts ascending by reference price", () => {
    const result = recommendCovers({
      truckId: "toyota-tacoma",
      year: 2020,
      bedLengthId: "tacoma-3g-5ft",
      preference: "lowest-price",
    });
    const prices = result.recommendations.map((r) => r.product.referencePrice.min);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("hard-folding only returns hard-folding products", () => {
    const result = recommendCovers({
      truckId: "toyota-tacoma",
      year: 2020,
      bedLengthId: "tacoma-3g-5ft",
      preference: "hard-folding",
    });
    expect(result.recommendations.length).toBeGreaterThan(0);
    for (const r of result.recommendations) {
      expect(r.product.coverType).toBe("hard-folding");
    }
  });

  it("hard-folding returns an honest empty result for a bed length with no hard-folding product", () => {
    const result = recommendCovers({
      truckId: "toyota-tacoma",
      year: 2020,
      bedLengthId: "tacoma-3g-6ft",
      preference: "hard-folding",
    });
    expect(result.recommendations).toEqual([]);
  });

  it("every recommendation includes at least one non-empty reason", () => {
    const result = recommendCovers({
      truckId: "toyota-tacoma",
      year: 2020,
      bedLengthId: "tacoma-3g-5ft",
      preference: "lowest-price",
    });
    for (const r of result.recommendations) {
      expect(r.reasons.length).toBeGreaterThan(0);
      for (const reason of r.reasons) expect(reason.length).toBeGreaterThan(0);
    }
  });
});

describe("recommendCovers - unsupported truck", () => {
  it("returns no recommendations for an unsupported truck id", () => {
    const result = recommendCovers({
      truckId: "ford-ranger",
      year: 2020,
      bedLengthId: "tacoma-3g-5ft",
      preference: "lowest-price",
    });
    expect(result.generation).toBeNull();
    expect(result.recommendations).toEqual([]);
  });
});

describe("isEligibleCandidate - synthetic fixtures (edge cases not present in today's small verified dataset)", () => {
  const product: Product = {
    id: "test-product",
    name: "Test Cover",
    merchantId: "test-merchant",
    coverType: "hard-folding",
    requiresDeckRailSystem: true,
    referencePrice: { min: 1000, max: 1000, currency: "USD" },
    salePrice: null,
    priceVerifiedAt: "2026-01-01",
    outboundUrl: "https://example.com",
    affiliateUrl: null,
    sourceUrl: "https://example.com",
    verificationStatus: "verified",
    lastVerifiedDate: "2026-01-01",
  };
  const merchant: Merchant = { id: "test-merchant", name: "Test Merchant", websiteUrl: "https://example.com" };
  const generation: Generation = { id: "test-gen", truckId: "test-truck", name: "Test Gen", yearStart: 2016, yearEnd: 2023 };
  const fitment: Fitment = {
    id: "test-fitment",
    productId: "test-product",
    generationId: "test-gen",
    bedLengthId: "test-gen-5ft",
    sourceUrl: "https://example.com",
    verificationStatus: "verified",
    lastVerifiedDate: "2026-01-01",
  };
  const candidate = (overrides: { product?: Partial<Product>; fitment?: Partial<Fitment> } = {}): Candidate => ({
    product: { ...product, ...overrides.product },
    merchant,
    fitment: { ...fitment, ...overrides.fitment },
    generation,
  });

  it("accepts a verified fitment matching bed length and year", () => {
    expect(isEligibleCandidate(candidate(), 2020, "test-gen-5ft", true)).toBe(true);
  });

  it("rejects an unverified fitment even if everything else matches", () => {
    expect(
      isEligibleCandidate(candidate({ fitment: { verificationStatus: "unverified" } }), 2020, "test-gen-5ft", true)
    ).toBe(false);
  });

  it("rejects a bed-length mismatch", () => {
    expect(isEligibleCandidate(candidate(), 2020, "test-gen-6ft", true)).toBe(false);
  });

  it("rejects a year outside the fitment's own narrowed range", () => {
    const narrowed = candidate({ fitment: { yearStart: 2020, yearEnd: 2021 } });
    expect(isEligibleCandidate(narrowed, 2018, "test-gen-5ft", true)).toBe(false);
    expect(isEligibleCandidate(narrowed, 2020, "test-gen-5ft", true)).toBe(true);
  });

  it("Deck Rail required + hasDeckRailSystem false → excluded", () => {
    expect(isEligibleCandidate(candidate(), 2020, "test-gen-5ft", false)).toBe(false);
  });

  it("Deck Rail required + hasDeckRailSystem true → included", () => {
    expect(isEligibleCandidate(candidate(), 2020, "test-gen-5ft", true)).toBe(true);
  });

  it("Deck Rail required + hasDeckRailSystem undefined → included (unknown is never treated as false)", () => {
    expect(isEligibleCandidate(candidate(), 2020, "test-gen-5ft", undefined)).toBe(true);
  });

  it("Deck Rail NOT required + hasDeckRailSystem false → still included (the gate only ever applies when the product needs it)", () => {
    const noRail = candidate({ product: { requiresDeckRailSystem: false } });
    expect(isEligibleCandidate(noRail, 2020, "test-gen-5ft", false)).toBe(true);
  });
});

describe("buildReasons", () => {
  it("never returns an empty reasons array for an eligible candidate", () => {
    const result = recommendCovers({
      truckId: "toyota-tacoma",
      year: 2020,
      bedLengthId: "tacoma-3g-5ft",
      preference: "lowest-price",
    });
    expect(result.recommendations[0]?.reasons.length).toBeGreaterThan(0);
  });
});
