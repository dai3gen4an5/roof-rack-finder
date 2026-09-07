import { PhotoSlot } from "@/components/media/PhotoSlot";
import type { PhotoAssetKey } from "@/lib/media";

/**
 * The finder's backdrop photography. Deliberately calmer than HeroMedia —
 * no scroll-tied motion, since the finder prioritizes interaction over
 * spectacle. Named/keyed separately from HeroMedia so a generation- or
 * use-case-specific stage image can be swapped in later without touching
 * callers (see `src/lib/media.ts`).
 *
 * `assetKey` is required (no default) and deliberately not vehicle-agnostic
 * stock scenery — "finder-stage" is a real photograph of a 5th Gen Toyota
 * 4Runner. Callers must resolve it per-vehicle via
 * `getVehicleHeroPhotoAssetKey` (which returns `undefined` for a vehicle
 * with no licensed hero photo yet) rather than relying on any default, so a
 * future vehicle never silently inherits the 4Runner's photo.
 */
export function FinderStageMedia({
  alt,
  className,
  assetKey,
}: {
  alt: string;
  className?: string;
  assetKey: PhotoAssetKey | undefined;
}) {
  return (
    <PhotoSlot
      assetKey={assetKey}
      alt={alt}
      sizes="100vw"
      quality={80}
      className={className}
    />
  );
}
