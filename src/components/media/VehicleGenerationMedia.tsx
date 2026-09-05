import { PhotoSlot } from "@/components/media/PhotoSlot";

/**
 * Large generation-specific vehicle photography (5th Gen / 6th Gen). Meant
 * to be wrapped by the caller in a `group` container for the hover-scale
 * (max 1.02) and in `RevealOnScroll` for the on-enter reveal — kept out of
 * this component so it stays a plain, server-renderable media slot.
 */
export function VehicleGenerationMedia({
  generationId,
  alt,
  className,
  priority = false,
}: {
  generationId: "4runner-5th-gen" | "4runner-6th-gen";
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const assetKey = generationId === "4runner-5th-gen" ? "generation-5th" : "generation-6th";

  return (
    <PhotoSlot
      assetKey={assetKey}
      alt={alt}
      priority={priority}
      sizes="(min-width: 1024px) 50vw, 100vw"
      className={className}
      imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.02]"
    />
  );
}
