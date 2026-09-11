import { describe, expect, it } from "vitest";
import { bestOverallScore, isEligibleCandidate, recommendRacks } from "@/domains/roof-rack/recommend";
import type { Candidate } from "@/domains/roof-rack/recommend";
import { getGenerationForYear } from "@/domains/roof-rack/data/generations";
import { getVariantsForGeneration } from "@/domains/roof-rack/data/variants";
import type { Fitment, Product } from "@/domains/roof-rack/types";

const VEHICLE_ID = "toyota-4runner";
const TACOMA_VEHICLE_ID = "toyota-tacoma";

function recommend(year: number) {
  return recommendRacks({
    vehicleId: VEHICLE_ID,
    year,
    useCase: "overlanding",
    preference: "best-overall",
  });
}

function recommendTacoma(year: number, variantId?: string) {
  return recommendRacks({
    vehicleId: TACOMA_VEHICLE_ID,
    year,
    variantId,
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
      vehicleId: "toyota-tundra",
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
    expect(isEligibleCandidate(candidate(), 2018, "overlanding")).toBe(true);
  });

  it("rejects an unverified fitment even if the use case matches", () => {
    expect(
      isEligibleCandidate(candidate({ verificationStatus: "unverified" }), 2018, "overlanding")
    ).toBe(false);
  });

  it("rejects a verified fitment for an unsupported use case", () => {
    expect(isEligibleCandidate(candidate(), 2018, "kayak-surf")).toBe(false);
  });

  it("rejects a fitment whose own narrowed year range excludes the requested year", () => {
    expect(isEligibleCandidate(candidate({ yearStart: 2015 }), 2012, "overlanding")).toBe(false);
    expect(isEligibleCandidate(candidate({ yearEnd: 2020 }), 2022, "overlanding")).toBe(false);
  });

  it("accepts a fitment whose narrowed year range includes the requested year", () => {
    expect(isEligibleCandidate(candidate({ yearStart: 2015, yearEnd: 2020 }), 2018, "overlanding")).toBe(
      true
    );
  });
});

describe("isEligibleCandidate - variant matching (synthetic fixtures, no real vehicle data)", () => {
  // Generic "variant-a" / "variant-b" labels deliberately — this mechanism
  // must work for any future vehicle's configuration axis (cab type, door
  // count, etc.), not just a specific one, so the tests don't name any.
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
    generationId: "test-generation",
    sourceUrl: "https://example.com",
    verificationStatus: "verified",
    lastVerifiedDate: "2026-09-04",
  };
  const baseGeneration = {
    id: "test-generation",
    vehicleId: "test-vehicle",
    name: "Test Generation",
    yearStart: 2020,
    yearEnd: 2025,
  };

  function candidate(fitmentOverrides: Partial<Fitment> = {}): Candidate {
    return {
      product: baseProduct,
      merchant: { id: "prinsu", name: "Prinsu", websiteUrl: "https://prinsu.com" },
      fitment: { ...baseFitment, ...fitmentOverrides },
      generation: baseGeneration,
    };
  }

  it("includes a fitment scoped to variant-a when variant-a is requested", () => {
    expect(
      isEligibleCandidate(candidate({ variantId: "variant-a" }), 2022, "overlanding", "variant-a")
    ).toBe(true);
  });

  it("excludes a fitment scoped to variant-a when variant-b is requested", () => {
    expect(
      isEligibleCandidate(candidate({ variantId: "variant-a" }), 2022, "overlanding", "variant-b")
    ).toBe(false);
  });

  it("excludes a variant-scoped fitment when no variant is requested at all", () => {
    expect(
      isEligibleCandidate(candidate({ variantId: "variant-a" }), 2022, "overlanding", undefined)
    ).toBe(false);
  });

  it("excludes a variant-scoped fitment when an unknown/stale variant id is requested", () => {
    expect(
      isEligibleCandidate(
        candidate({ variantId: "variant-a" }),
        2022,
        "overlanding",
        "variant-does-not-exist"
      )
    ).toBe(false);
  });

  it("includes a fitment with no variantId regardless of which variant (or none) is requested", () => {
    // variantId omitted entirely (undefined) — the default shape for every
    // existing 4Runner fitment today.
    expect(isEligibleCandidate(candidate(), 2022, "overlanding", undefined)).toBe(true);
    expect(isEligibleCandidate(candidate(), 2022, "overlanding", "variant-a")).toBe(true);
    expect(isEligibleCandidate(candidate(), 2022, "overlanding", "variant-b")).toBe(true);
    // variantId explicitly null — same meaning as omitted.
    expect(isEligibleCandidate(candidate({ variantId: null }), 2022, "overlanding", "variant-a")).toBe(
      true
    );
  });
});

describe("recommendRacks - Tacoma generation resolution by year", () => {
  it("2005 and 2015 resolve to 2nd Gen only", () => {
    for (const year of [2005, 2015]) {
      expect(getGenerationForYear(TACOMA_VEHICLE_ID, year)?.id).toBe("tacoma-2nd-gen");
    }
  });

  it("2016 and 2023 resolve to 3rd Gen only", () => {
    for (const year of [2016, 2023]) {
      expect(getGenerationForYear(TACOMA_VEHICLE_ID, year)?.id).toBe("tacoma-3rd-gen");
    }
  });

  it("2024 and 2026 resolve to 4th Gen only", () => {
    for (const year of [2024, 2026]) {
      expect(getGenerationForYear(TACOMA_VEHICLE_ID, year)?.id).toBe("tacoma-4th-gen");
    }
  });
});

describe("recommendRacks - Tacoma variant (cab configuration) eligibility", () => {
  it("2015 Double Cab returns only 2nd Gen products, never a 3rd Gen product", () => {
    const result = recommendTacoma(2015, "tacoma-2nd-gen-double-cab");
    expect(result.generation?.id).toBe("tacoma-2nd-gen");
    expect(result.recommendations.length).toBeGreaterThan(0);
    for (const rec of result.recommendations) {
      expect(rec.generation.id).toBe("tacoma-2nd-gen");
    }
  });

  it("2016 Double Cab returns only 3rd Gen products, never a 2nd Gen product", () => {
    const result = recommendTacoma(2016, "tacoma-3rd-gen-double-cab");
    expect(result.generation?.id).toBe("tacoma-3rd-gen");
    expect(result.recommendations.length).toBeGreaterThan(0);
    for (const rec of result.recommendations) {
      expect(rec.generation.id).toBe("tacoma-3rd-gen");
    }
  });

  it("2022 Access Cab includes the Access Rack", () => {
    const result = recommendTacoma(2022, "tacoma-3rd-gen-access-cab");
    expect(result.recommendations.map((r) => r.product.id)).toContain("prinsu-tacoma-access-rack");
  });

  it("2023 Access Cab returns a safe empty result — no Access Rack, and no Cab Rack substituted either", () => {
    // 2023 falls outside the Access Rack's verified 2005-2022 range, and the
    // Cab Rack products are Double Cab-verified, not Access Cab-verified —
    // so nothing may be substituted. This is the core "no guessing" case:
    // a manufacturer-year gap must surface as an honest empty result, never
    // silently filled by the nearest available product.
    const result = recommendTacoma(2023, "tacoma-3rd-gen-access-cab");
    expect(result.recommendations).toHaveLength(0);
    expect(result.note).not.toBeNull();
  });

  it("2023 Double Cab returns the Double-Cab-verified Cab Rack products", () => {
    const result = recommendTacoma(2023, "tacoma-3rd-gen-double-cab");
    const ids = result.recommendations.map((r) => r.product.id);
    expect(ids).toContain("prinsu-tacoma-cab-rack-original");
    expect(ids).toContain("prinsu-tacoma-cab-rack-pro");
    expect(ids).not.toContain("prinsu-tacoma-access-rack");
  });

  it("Double Cab never receives the Access Rack, and Access Cab never receives a Cab Rack product", () => {
    const doubleCab = recommendTacoma(2020, "tacoma-3rd-gen-double-cab");
    expect(doubleCab.recommendations.map((r) => r.product.id)).not.toContain("prinsu-tacoma-access-rack");
    const accessCab = recommendTacoma(2020, "tacoma-3rd-gen-access-cab");
    expect(accessCab.recommendations.map((r) => r.product.id)).not.toContain(
      "prinsu-tacoma-cab-rack-original"
    );
    expect(accessCab.recommendations.map((r) => r.product.id)).not.toContain("prinsu-tacoma-cab-rack-pro");
    for (const rec of accessCab.recommendations) {
      expect(rec.fitment.variantId).toBe("tacoma-3rd-gen-access-cab");
    }
  });

  it("requesting no variant at all on a generation that has variants returns a safe, helpful empty result", () => {
    // Every 2nd/3rd Gen fitment is now variant-scoped (Double Cab or Access
    // Cab) — there is no verified variant-agnostic product left for these
    // generations, so skipping the configuration step must never silently
    // default to either cab's products.
    const result = recommendTacoma(2018, undefined);
    expect(result.generation?.id).toBe("tacoma-3rd-gen");
    expect(result.recommendations).toHaveLength(0);
    expect(result.note).toMatch(/configuration/i);
  });

  it("4th Gen (no variants) returns recommendations with no variantId required", () => {
    const result = recommendTacoma(2024, undefined);
    expect(result.generation?.id).toBe("tacoma-4th-gen");
    expect(result.recommendations.length).toBeGreaterThan(0);
  });
});

describe("recommendRacks - cross-vehicle isolation", () => {
  it("the same model year never mixes 4Runner and Tacoma products or generations", () => {
    const fourRunner = recommend(2018);
    const tacoma = recommendTacoma(2018, "tacoma-3rd-gen-double-cab");
    expect(fourRunner.generation?.id).toBe("4runner-5th-gen");
    expect(tacoma.generation?.id).toBe("tacoma-3rd-gen");

    const fourRunnerIds = new Set(fourRunner.recommendations.map((r) => r.product.id));
    const tacomaIds = new Set(tacoma.recommendations.map((r) => r.product.id));
    for (const id of tacomaIds) {
      expect(fourRunnerIds.has(id)).toBe(false);
    }
    for (const rec of fourRunner.recommendations) {
      expect(rec.generation.vehicleId).toBe(VEHICLE_ID);
    }
    for (const rec of tacoma.recommendations) {
      expect(rec.generation.vehicleId).toBe(TACOMA_VEHICLE_ID);
    }
  });
});

describe("getVariantsForGeneration - Tacoma has cab-configuration variants where verified", () => {
  it("2nd and 3rd Gen each expose Double Cab and Access Cab", () => {
    for (const genId of ["tacoma-2nd-gen", "tacoma-3rd-gen"]) {
      const labels = getVariantsForGeneration(genId).map((v) => v.label);
      expect(labels).toContain("Double Cab");
      expect(labels).toContain("Access Cab");
    }
  });

  it("4th Gen has no variants (no manufacturer-stated cab restriction found)", () => {
    expect(getVariantsForGeneration("tacoma-4th-gen")).toEqual([]);
  });
});

describe("getVariantsForGeneration - 4Runner has no configuration axis today", () => {
  it("returns an empty array for both existing 4Runner generations", () => {
    expect(getVariantsForGeneration("4runner-5th-gen")).toEqual([]);
    expect(getVariantsForGeneration("4runner-6th-gen")).toEqual([]);
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
