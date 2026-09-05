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
  // `design-reference/rackfit-hero-reference.png` is a full design *comp*
  // (nav, headline, CTAs, and trust strip already rendered into the pixels
  // as a direction reference) — not a clean background photo. Using it here
  // would double every piece of overlay text under the real HTML. Leave
  // this null (falls back to the flat placeholder) until a clean,
  // text-free hero photo is provided; see the Home Hero row in the image
  // asset spec for what's needed.
  "home-hero": null,
  "generation-5th": "/photography/generation-5th.png",
  "generation-6th": "/photography/generation-6th.png",
  "finder-stage": "/photography/finder-stage.png",
  "product-prinsu-original": null,
  "product-prinsu-pro": null,
};

/**
 * Maps a product to its product-photography asset key. Name-based (not a
 * hardcoded id list) so any future "Pro" line product picks up the same
 * asset key automatically. Both keys currently resolve to `null` in
 * `PHOTO_ASSETS` pending manufacturer licensing — see ProductMedia.
 */
export function getProductPhotoAssetKey(productName: string): PhotoAssetKey {
  return productName.toLowerCase().includes("pro") ? "product-prinsu-pro" : "product-prinsu-original";
}
