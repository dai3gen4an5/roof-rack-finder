import { describe, expect, it } from "vitest";
import {
  getGenerationPhotoAssetKey,
  getProductPhotoAssetKey,
  getVehicleHeroPhotoAssetKey,
  hasPhotoAsset,
} from "@/lib/media";

describe("getGenerationPhotoAssetKey - no silent cross-generation fallback", () => {
  it("resolves known 4Runner generations to their own photo", () => {
    expect(getGenerationPhotoAssetKey("4runner-5th-gen")).toBe("generation-5th");
    expect(getGenerationPhotoAssetKey("4runner-6th-gen")).toBe("generation-6th");
  });

  it("returns undefined for an unmapped generation id, never another generation's photo", () => {
    expect(getGenerationPhotoAssetKey("unknown-generation")).toBeUndefined();
  });

  it("Tacoma generations have no approved photography yet and never fall back to a 4Runner photo", () => {
    // Regression test for the blocker fixed in 04be2d9 (an unsafe generation
    // id -> asset cast that could silently borrow another vehicle's photo).
    // Now that real Tacoma generation ids exist in the data layer, this
    // asserts none of them resolve to any 4Runner asset key.
    for (const genId of ["tacoma-2nd-gen", "tacoma-3rd-gen", "tacoma-4th-gen"]) {
      const key = getGenerationPhotoAssetKey(genId);
      expect(key).toBeUndefined();
      expect(key).not.toBe("generation-5th");
      expect(key).not.toBe("generation-6th");
    }
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

  it("Tacoma products (including 'Pro'-named ones) have no photography yet and never inherit a 4Runner Prinsu image", () => {
    // Real Tacoma product ids, including "prinsu-tacoma-cab-rack-pro" and
    // "prinsu-tacoma-4th-gen-pro" which contain the same "pro" substring the
    // old heuristic keyed off of. Both must resolve to undefined, never to
    // the 4Runner Pro asset key.
    for (const productId of [
      "prinsu-tacoma-cab-rack-original",
      "prinsu-tacoma-cab-rack-pro",
      "prinsu-tacoma-access-rack",
      "prinsu-tacoma-4th-gen-original",
      "prinsu-tacoma-4th-gen-pro",
    ]) {
      const key = getProductPhotoAssetKey(productId);
      expect(key).toBeUndefined();
      expect(key).not.toBe("product-prinsu-original");
      expect(key).not.toBe("product-prinsu-pro");
    }
  });
});

describe("getVehicleHeroPhotoAssetKey - no silent cross-vehicle hero photo", () => {
  it("resolves the 4Runner to its own hero/stage photo", () => {
    expect(getVehicleHeroPhotoAssetKey("toyota-4runner")).toBe("finder-stage");
  });

  it("Tacoma has no licensed hero photo yet and never inherits the 4Runner's", () => {
    // "finder-stage" is a real photograph of a 5th Gen Toyota 4Runner, not
    // vehicle-agnostic stock scenery — showing it on a Tacoma page would be
    // factually wrong, not just an asset-lookup technicality.
    expect(getVehicleHeroPhotoAssetKey("toyota-tacoma")).toBeUndefined();
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
