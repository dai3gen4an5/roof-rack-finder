import type { Generation } from "@/lib/types";
import { VehicleGenerationMedia } from "@/components/media/VehicleGenerationMedia";

/** Flat, hairline-bordered generation choice for the finder's first step —
 * a real photo thumbnail, not a decorative illustration, but restrained
 * enough to keep the UI's attention on the choice, not the photo. */
export function GenerationOption({
  generation,
  onSelect,
  className,
}: {
  generation: Generation;
  onSelect: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex flex-1 items-center gap-4 border border-line bg-paper p-3 text-left transition-colors hover:border-clay ${className ?? ""}`}
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden">
        <VehicleGenerationMedia
          generationId={generation.id as "4runner-5th-gen" | "4runner-6th-gen"}
          alt={`${generation.name} Toyota 4Runner`}
          className="h-full w-full"
        />
      </div>
      <div>
        <p className="text-xs font-bold tracking-wide text-clay uppercase">
          {generation.yearStart}–{generation.yearEnd}
        </p>
        <p className="font-display text-lg font-semibold text-ink">{generation.name}</p>
        <span className="text-sm font-semibold text-ink-muted group-hover:text-clay">
          Choose this generation →
        </span>
      </div>
    </button>
  );
}
