import { PhotoSlot } from "@/components/media/PhotoSlot";
import { getGenerationPhotoAssetKey } from "@/lib/media";

/**
 * Large generation-specific vehicle photography (5th Gen / 6th Gen, and any
 * future generation added to `getGenerationPhotoAssetKey`). Meant to be
 * wrapped by the caller in a `group` container for the hover-scale (max
 * 1.02) and in `RevealOnScroll` for the on-enter reveal — kept out of this
 * component so it stays a plain, server-renderable media slot.
 *
 * `generationId` is a plain string (any `Generation["id"]`), not a literal
 * union of today's known IDs — an unrecognized ID (e.g. a future vehicle's
 * generation before its photo is wired in) resolves to `undefined` via
 * `getGenerationPhotoAssetKey` and falls through to PhotoSlot's normal
 * placeholder, never to a different generation's photo.
 */
export function VehicleGenerationMedia({
  generationId,
  alt,
  className,
  priority = false,
}: {
  generationId: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <PhotoSlot
      assetKey={getGenerationPhotoAssetKey(generationId)}
      alt={alt}
      priority={priority}
      sizes="(min-width: 1024px) 50vw, 100vw"
      className={className}
      imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.02]"
    />
  );
}
