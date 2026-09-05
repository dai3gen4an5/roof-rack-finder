import Image from "next/image";
import { PHOTO_ASSETS } from "@/lib/media";
import type { PhotoAssetKey } from "@/lib/media";

/**
 * The single place that decides "real photo or placeholder" for any
 * photography slot in the app. Every specialized media component
 * (HeroMedia, VehicleGenerationMedia, FinderStageMedia, ProductMedia) is a
 * thin wrapper over this — swapping an asset in `src/lib/media.ts` is the
 * only change needed to go from placeholder to real photography anywhere.
 *
 * The placeholder is a flat, wordless neutral panel at the same aspect
 * ratio as the real photo would be — never a fabricated illustration and
 * never user-facing "coming soon" copy, so a missing asset never reads as
 * a broken or unfinished page.
 */
export function PhotoSlot({
  assetKey,
  alt,
  priority = false,
  sizes = "100vw",
  quality = 82,
  className,
  imgClassName,
  objectPositionClassName = "object-center",
}: {
  assetKey: PhotoAssetKey;
  alt: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  /** Classes for the aspect-ratio-bearing container (sets height/aspect-ratio). */
  className?: string;
  /** Classes for the <img> itself (rarely needed beyond object-position). */
  imgClassName?: string;
  /** Tailwind object-position utility classes (can include responsive
   * variants, e.g. "object-[78%_50%] sm:object-[65%_50%] lg:object-center")
   * so a subject that sits off-center in the source photo doesn't crop out
   * of frame on narrow viewports. */
  objectPositionClassName?: string;
}) {
  const src = PHOTO_ASSETS[assetKey];

  return (
    <div className={`relative overflow-hidden bg-warmgray ${className ?? ""}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          quality={quality}
          style={{ objectFit: "cover" }}
          className={`${objectPositionClassName} ${imgClassName ?? ""}`}
        />
      ) : null}
    </div>
  );
}
