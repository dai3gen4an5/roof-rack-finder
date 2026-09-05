import { PhotoSlot } from "@/components/media/PhotoSlot";

/**
 * The finder's backdrop photography. Deliberately calmer than HeroMedia —
 * no scroll-tied motion, since the finder prioritizes interaction over
 * spectacle. Named/keyed separately from HeroMedia so a generation- or
 * use-case-specific stage image can be swapped in later without touching
 * callers (see `src/lib/media.ts`).
 */
export function FinderStageMedia({ alt, className }: { alt: string; className?: string }) {
  return (
    <PhotoSlot
      assetKey="finder-stage"
      alt={alt}
      sizes="100vw"
      quality={80}
      className={className}
    />
  );
}
