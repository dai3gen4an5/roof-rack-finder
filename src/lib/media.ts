export type PhotoAssetKey =
  | "home-hero"
  | "generation-5th"
  | "generation-6th"
  | "finder-stage"
  | "product-prinsu-original"
  | "product-prinsu-pro";

/**
 * Single source of truth for which photography asset backs which slot.
 * A `null` value means the asset hasn't been licensed/provided yet — the
 * component rendering that slot must fall back to a neutral placeholder,
 * never a fabricated illustration or an unlicensed image.
 *
 * Swapping an asset (e.g. once Prinsu product photography is licensed) is a
 * one-line change here — no component or layout code should need to change.
 */
export const PHOTO_ASSETS: Record<PhotoAssetKey, string | null> = {
  // NOTE: `design-reference/rackfit-hero-reference.png` is a full design
  // *comp* (nav, headline, CTAs, and trust strip baked into the pixels as a
  // direction reference) — never wire that specific file in here, it would
  // double every overlay text element under the real HTML. This asset
  // (`clean Home Hero.png`) is a genuinely clean, text-free photo.
  "home-hero": "/photography/home-hero.png",
  "generation-5th": "/photography/generation-5th.png",
  "generation-6th": "/photography/generation-6th.png",
  "finder-stage": "/photography/finder-stage.png",
  "product-prinsu-original": null,
  "product-prinsu-pro": null,
};

/**
 * Explicit generation ID -> photo asset key lookup. Deliberately a plain
 * object literal, not a heuristic (e.g. "starts with a number" or "ends in
 * -gen") — an unmapped generation ID (a future vehicle's generation, e.g.
 * "tacoma-3rd-gen") returns `undefined` rather than guessing, so callers
 * fall back to PhotoSlot's normal no-photo placeholder instead of silently
 * borrowing a different vehicle's photo. Add a line here, in this file
 * only, when a new generation gets real photography.
 */
const GENERATION_PHOTO_ASSET_KEYS: Record<string, PhotoAssetKey | undefined> = {
  "4runner-5th-gen": "generation-5th",
  "4runner-6th-gen": "generation-6th",
};

export function getGenerationPhotoAssetKey(generationId: string): PhotoAssetKey | undefined {
  return GENERATION_PHOTO_ASSET_KEYS[generationId];
}

/**
 * Explicit vehicle ID -> hero/stage photo asset key lookup. The
 * "finder-stage" and "home-hero" photos are real photographs of a specific
 * vehicle (a 5th Gen Toyota 4Runner), not generic stock scenery — so unlike
 * a truly vehicle-agnostic background image, they must NOT be shown on
 * another vehicle's pages just because a component defaults to them. An
 * unmapped vehicle ID (e.g. Tacoma, until its own photography is licensed)
 * returns `undefined`, and callers fall back to PhotoSlot's placeholder.
 */
const VEHICLE_HERO_PHOTO_ASSET_KEYS: Record<string, PhotoAssetKey | undefined> = {
  "toyota-4runner": "finder-stage",
};

export function getVehicleHeroPhotoAssetKey(vehicleId: string): PhotoAssetKey | undefined {
  return VEHICLE_HERO_PHOTO_ASSET_KEYS[vehicleId];
}

/**
 * Explicit product ID -> photo asset key lookup — replaces an earlier
 * version that guessed the asset from a "pro" substring in the product
 * name, which would have silently mapped any future non-Prinsu "Pro" line
 * product onto Prinsu's photo. Keyed by product ID (stable, unique),
 * never by name or merchant alone. An unmapped product ID returns
 * `undefined`, not a same-brand or default asset.
 */
const PRODUCT_PHOTO_ASSET_KEYS: Record<string, PhotoAssetKey | undefined> = {
  "prinsu-4runner-5th-gen-full-non-drill": "product-prinsu-original",
  "prinsu-4runner-5th-gen-three-quarter": "product-prinsu-original",
  "prinsu-4runner-5th-gen-pro": "product-prinsu-pro",
  "prinsu-4runner-6th-gen-original": "product-prinsu-original",
  "prinsu-4runner-6th-gen-pro": "product-prinsu-pro",
};

export function getProductPhotoAssetKey(productId: string): PhotoAssetKey | undefined {
  return PRODUCT_PHOTO_ASSET_KEYS[productId];
}

/**
 * Whether a real photo backs this slot. Callers that lay out a dedicated
 * media column (e.g. a product comparison card) should check this and drop
 * the column entirely when false, rather than reserving space for a photo
 * that isn't coming — an empty aspect-ratio panel reads as a broken image,
 * not as "photo pending." Accepts `undefined` so an unmapped generation/
 * product ID (see above) can be passed straight through without callers
 * needing a separate null-check.
 */
export function hasPhotoAsset(key: PhotoAssetKey | undefined): boolean {
  return key != null && PHOTO_ASSETS[key] != null;
}
