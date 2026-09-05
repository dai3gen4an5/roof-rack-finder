import { describe, expect, it } from "vitest";
import { bestOverallScore, isEligibleCandidate, recommendRacks } from "@/lib/recommend";
import type { Candidate } from "@/lib/recommend";
import type { Fitment, Product } from "@/lib/types";

const VEHICLE_ID = "toyota-4runner";

function recommend(year: number) {
  return recommendRacks({
    vehicleId: VEHICLE_ID,
    year,
    useCase: "overlanding",
    preference: "best-overall",
  });
}

describe("recommendRacks - generation matching by year", () => {
  it("2010 recommends only 5th Gen products", () => {
    const result = recommend(2010);
    expect(result.generation?.id).toBe("4runner-5th-gen");
    expect(result.recommendations.length).toBeGreaterThan(0);
    for (const rec of result.recommendations) {
      expect(rec.generation.id).toBe("4runner-5th-gen");
    }
  });

  it("2024 recommends only 5th Gen products", () => {
    const result = recommend(2024);
    expect(result.generation?.id).toBe("4runner-5th-gen");
    expect(result.recommendations.length).toBeGreaterThan(0);
    for (const rec of result.recommendations) {
      expect(rec.generation.id).toBe("4runner-5th-gen");
    }
  });

  it("2025 recommends only 6th Gen products", () => {
    const result = recommend(2025);
    expect(result.generation?.id).toBe("4runner-6th-gen");
    expect(result.recommendations.length).toBeGreaterThan(0);
    for (const rec of result.recommendations) {
      expect(rec.generation.id).toBe("4runner-6th-gen");
    }
  });

  it("2026 recommends only 6th Gen products", () => {
    const result = recommend(2026);
    expect(result.generation?.id).toBe("4runner-6th-gen");
    expect(result.recommendations.length).toBeGreaterThan(0);
    for (const rec of result.recommendations) {
      expect(rec.generation.id).toBe("4runner-6th-gen");
    }
  });

  it("out-of-range years recommend nothing", () => {
    for (const year of [2005, 2009, 2027, 2030]) {
      const result = recommend(year);
      expect(result.generation).toBeNull();
      expect(result.recommendations).toHaveLength(0);
      expect(result.note).not.toBeNull();
    }
  });
});

describe("recommendRacks - preferences", () => {
  it("smaller-three-quarter only returns 3/4-length racks", () => {
    const result = recommendRacks({
      vehicleId: VEHICLE_ID,
      year: 2018,
      useCase: "cargo-storage",
      preference: "smaller-three-quarter",
    });
    expect(result.recommendations.length).toBeGreaterThan(0);
    for (const rec of result.recommendations) {
      expect(rec.product.rackLength).toBe("three-quarter");
    }
  });

  it("smaller-three-quarter returns an honest empty result for 6th Gen (no 3/4 rack published yet)", () => {
    const result = recommendRacks({
      vehicleId: VEHICLE_ID,
      year: 2025,
      useCase: "cargo-storage",
      preference: "smaller-three-quarter",
    });
    expect(result.generation?.id).toBe("4runner-6th-gen");
    expect(result.recommendations).toHaveLength(0);
    expect(result.note).toMatch(/3\/4/);
  });

  it("max-capacity prefers the Pro rack (highest manufacturer-stated capacity) for both generations", () => {
    for (const year of [2018, 2026]) {
      const result = recommendRacks({
        vehicleId: VEHICLE_ID,
        year,
        useCase: "overlanding",
        preference: "max-capacity",
      });
      expect(result.recommendations[0].product.id).toMatch(/-pro$/);
      const capacities = result.recommendations.map((r) => r.product.staticCapacityLbs ?? 0);
      expect(capacities).toEqual([...capacities].sort((a, b) => b - a));
    }
  });

  it("lower-cost prefers the cheapest full-length rack (Original, not Pro) for both generations", () => {
    for (const year of [2018, 2026]) {
      const result = recommendRacks({
        vehicleId: VEHICLE_ID,
        year,
        useCase: "overlanding",
        preference: "lower-cost",
      });
      expect(result.recommendations[0].product.id).not.toMatch(/-pro$/);
      const prices = result.recommendations.map((r) => r.product.referencePrice.min);
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    }
  });

  it("best-overall favors the cheaper, still-capable option over the pricier max-capacity option", () => {
    // With the documented 40/50/10 weighting, a rack that is both cheaper
    // and has strong capacity-per-dollar should outrank a rack that only
    // wins on raw capacity. This keeps "best overall" distinct from
    // "maximum capacity" rather than being the same ranking twice.
    for (const year of [2018, 2026]) {
      const result = recommend(year);
      expect(result.recommendations[0].product.id).not.toMatch(/-pro$/);
    }
  });

  it("every recommendation includes 1-3 non-empty reasons", () => {
    const result = recommend(2018);
    for (const rec of result.recommendations) {
      expect(rec.reasons.length).toBeGreaterThanOrEqual(1);
      expect(rec.reasons.length).toBeLessThanOrEqual(3);
      for (const reason of rec.reasons) {
        expect(reason.length).toBeGreaterThan(0);
      }
    }
  });

  it("only recommends products whose useCases include the requested use case", () => {
    const result = recommendRacks({
      vehicleId: VEHICLE_ID,
      year: 2018,
      useCase: "rooftop-tent",
      preference: "best-overall",
    });
    for (const rec of result.recommendations) {
      expect(rec.product.useCases).toContain("rooftop-tent");
    }
  });
});

describe("recommendRacks - unknown vehicle", () => {
  it("returns no recommendations for an unsupported vehicle id", () => {
    const result = recommendRacks({
      vehicleId: "toyota-tacoma",
      year: 2020,
      useCase: "overlanding",
      preference: "best-overall",
    });
    expect(result.generation).toBeNull();
    expect(result.recommendations).toHaveLength(0);
  });
});

describe("isEligibleCandidate - verified fit is mandatory", () => {
  const baseProduct: Product = {
    id: "test-product",
    name: "Test Rack",
    merchantId: "prinsu",
    rackLength: "full",
    installationType: "bolt-on-non-drill",
    dynamicCapacityLbs: 500,
    staticCapacityLbs: 900,
    referencePrice: { min: 500, max: 500, currency: "USD" },
    salePrice: null,
    priceVerifiedAt: "2026-09-04",
    useCases: ["overlanding"],
    outboundUrl: "https://example.com",
    affiliateUrl: null,
    sourceUrl: "https://example.com",
    verificationStatus: "verified",
    lastVerifiedDate: "2026-09-04",
  };
  const baseFitment: Fitment = {
    id: "test-fitment",
    productId: "test-product",
    generationId: "4runner-5th-gen",
    sourceUrl: "https://example.com",
    verificationStatus: "verified",
    lastVerifiedDate: "2026-09-04",
  };

  function candidate(overrides: Partial<Fitment> = {}): Candidate {
    return {
      product: baseProduct,
      merchant: { id: "prinsu", name: "Prinsu", websiteUrl: "https://prinsu.com" },
      fitment: { ...baseFitment, ...overrides },
      generation: {
        id: "4runner-5th-gen",
        vehicleId: VEHICLE_ID,
        name: "5th Generation",
        yearStart: 2010,
        yearEnd: 2024,
      },
    };
  }

  it("accepts a verified fitment matching the use case", () => {
    expect(isEligibleCandidate(candidate(), "overlanding")).toBe(true);
  });

  it("rejects an unverified fitment even if the use case matches", () => {
    expect(isEligibleCandidate(candidate({ verificationStatus: "unverified" }), "overlanding")).toBe(
      false
    );
  });

  it("rejects a verified fitment for an unsupported use case", () => {
    expect(isEligibleCandidate(candidate(), "kayak-surf")).toBe(false);
  });
});

describe("bestOverallScore", () => {
  it("is a deterministic function of capacity, price, and installation type within a group", () => {
    const cheaper: Product = {
      id: "a",
      name: "A",
      merchantId: "prinsu",
      rackLength: "full",
      installationType: "bolt-on-non-drill",
      dynamicCapacityLbs: 600,
      staticCapacityLbs: 1000,
      referencePrice: { min: 980, max: 980, currency: "USD" },
      salePrice: null,
      priceVerifiedAt: "2026-09-04",
      useCases: ["overlanding"],
      outboundUrl: "https://example.com",
      affiliateUrl: null,
      sourceUrl: "https://example.com",
      verificationStatus: "verified",
      lastVerifiedDate: "2026-09-04",
    };
    const pricier: Product = {
      ...cheaper,
      id: "b",
      name: "B",
      dynamicCapacityLbs: 700,
      staticCapacityLbs: 1200,
      referencePrice: { min: 1380, max: 1380, currency: "USD" },
    };
    const group = [cheaper, pricier];
    expect(bestOverallScore(cheaper, group)).toBeGreaterThan(bestOverallScore(pricier, group));
  });
});
