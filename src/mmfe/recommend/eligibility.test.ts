import { describe, expect, it } from "vitest";
import {
  isEligibleFitment,
  isVerifiedFitment,
  matchesRangeConstraint,
  matchesVariant,
} from "@/mmfe/recommend/eligibility";

// Domain-agnostic on purpose: no roof-rack/vehicle vocabulary anywhere in
// this file. These are the mechanisms every MMFE domain shares.

describe("matchesRangeConstraint", () => {
  it("accepts a value inside an explicit [min, max] window", () => {
    expect(matchesRangeConstraint({ min: 2015, max: 2020 }, 2018)).toBe(true);
  });

  it("rejects a value below min or above max", () => {
    expect(matchesRangeConstraint({ min: 2015 }, 2012)).toBe(false);
    expect(matchesRangeConstraint({ max: 2020 }, 2022)).toBe(false);
  });

  it("treats an omitted bound as unconstrained on that side", () => {
    expect(matchesRangeConstraint({ min: 2015 }, 2099)).toBe(true);
    expect(matchesRangeConstraint({ max: 2020 }, 1)).toBe(true);
  });

  it("with no constraint at all, every value matches", () => {
    expect(matchesRangeConstraint(undefined, 1)).toBe(true);
    expect(matchesRangeConstraint({}, -999)).toBe(true);
  });

  it("boundary values are inclusive", () => {
    expect(matchesRangeConstraint({ min: 2015, max: 2020 }, 2015)).toBe(true);
    expect(matchesRangeConstraint({ min: 2015, max: 2020 }, 2020)).toBe(true);
  });
});

describe("matchesVariant", () => {
  it("a fitment with no variantId matches any requested variant, or none", () => {
    expect(matchesVariant(undefined, undefined)).toBe(true);
    expect(matchesVariant(null, "variant-a")).toBe(true);
  });

  it("a variant-scoped fitment matches only the exact same variant", () => {
    expect(matchesVariant("variant-a", "variant-a")).toBe(true);
  });

  it("a variant-scoped fitment never matches a different variant", () => {
    expect(matchesVariant("variant-a", "variant-b")).toBe(false);
  });

  it("a variant-scoped fitment never matches when no variant was requested", () => {
    expect(matchesVariant("variant-a", undefined)).toBe(false);
  });
});

describe("isVerifiedFitment", () => {
  it("only 'verified' passes", () => {
    expect(isVerifiedFitment("verified")).toBe(true);
    expect(isVerifiedFitment("unverified")).toBe(false);
  });
});

describe("isEligibleFitment", () => {
  const base = {
    verificationStatus: "verified" as const,
    fitmentVariantId: undefined,
    requestedVariantId: undefined,
    range: undefined,
    point: 2018,
  };

  it("passes when verified, variant-agnostic, and in range", () => {
    expect(isEligibleFitment(base)).toBe(true);
  });

  it("fails when unverified, even if variant and range match", () => {
    expect(isEligibleFitment({ ...base, verificationStatus: "unverified" })).toBe(false);
  });

  it("fails when the point falls outside the range constraint", () => {
    expect(isEligibleFitment({ ...base, range: { min: 2020 }, point: 2018 })).toBe(false);
  });

  it("fails when the fitment is variant-scoped and the request doesn't match", () => {
    expect(
      isEligibleFitment({ ...base, fitmentVariantId: "variant-a", requestedVariantId: "variant-b" })
    ).toBe(false);
  });

  it("passes when every gate is satisfied together", () => {
    expect(
      isEligibleFitment({
        verificationStatus: "verified",
        fitmentVariantId: "variant-a",
        requestedVariantId: "variant-a",
        range: { min: 2015, max: 2020 },
        point: 2018,
      })
    ).toBe(true);
  });
});
