import { describe, expect, it } from "vitest";
import { getGenerationPhotoAssetKey, getProductPhotoAssetKey, hasPhotoAsset } from "@/lib/media";

describe("getGenerationPhotoAssetKey - no silent cross-generation fallback", () => {
  it("resolves known 4Runner generations to their own photo", () => {
    expect(getGenerationPhotoAssetKey("4runner-5th-gen")).toBe("generation-5th");
    expect(getGenerationPhotoAssetKey("4runner-6th-gen")).toBe("generation-6th");
  });

  it("returns undefined for an unmapped generation id, never another generation's photo", () => {
    // Simulates a future vehicle's generation landing before its photo does.
    expect(getGenerationPhotoAssetKey("tacoma-3rd-gen")).toBeUndefined();
    expect(getGenerationPhotoAssetKey("unknown-generation")).toBeUndefined();
  });
});

describe("getProductPhotoAssetKey - explicit id mapping, no name heuristic", () => {
  it("resolves known Prinsu product ids to their own asset key", () => {
    expect(getProductPhotoAssetKey("prinsu-4runner-5th-gen-full-non-drill")).toBe(
      "product-prinsu-original"
    );
    expect(getProductPhotoAssetKey("prinsu-4runner-5th-gen-pro")).toBe("product-prinsu-pro");
    expect(getProductPhotoAssetKey("prinsu-4runner-6th-gen-pro")).toBe("product-prinsu-pro");
  });

  it("never maps an unknown/other-merchant product onto a Prinsu photo, even if its name contains 'Pro'", () => {
    // A future merchant's product whose name happens to contain "Pro" (e.g.
    // "Sherpa Pro Roof Rack") must not inherit Prinsu's asset key just
    // because the old name-substring heuristic would have matched it.
    expect(getProductPhotoAssetKey("sherpa-4runner-pro")).toBeUndefined();
    expect(getProductPhotoAssetKey("unknown-product")).toBeUndefined();
  });
});

describe("hasPhotoAsset", () => {
  it("is false for an undefined key (unmapped generation/product)", () => {
    expect(hasPhotoAsset(undefined)).toBe(false);
  });

  it("is true only for a key whose asset is actually wired in", () => {
    expect(hasPhotoAsset("generation-5th")).toBe(true);
    // Product photography isn't licensed yet — both product keys stay null.
    expect(hasPhotoAsset("product-prinsu-original")).toBe(false);
    expect(hasPhotoAsset("product-prinsu-pro")).toBe(false);
  });
});
