import { getGenerationById } from "@/lib/data/generations";
import { compareFullLengthOptions } from "@/lib/generationProducts";
import { RecommendationCard } from "@/components/finder/RecommendationCard";

/** A no-finder-required preview of real, verified racks for site visitors
 * who haven't run the finder yet. Badges are genuinely spec-derived
 * (lowest price / highest capacity within this pair) — never fabricated
 * popularity or ratings. Defaults to the current 4Runner 6th Gen so every
 * existing call site keeps today's behavior unchanged; pass `generationId`
 * to feature a different generation/vehicle elsewhere. */
export function FeaturedRacks({ generationId = "4runner-6th-gen" }: { generationId?: string }) {
  const generation = getGenerationById(generationId);
  if (!generation) return null;

  const comparison = compareFullLengthOptions(generation);
  if (!comparison) return null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <RecommendationCard recommendation={comparison.cheaper} rank={0} preference="lower-cost" />
      <RecommendationCard
        recommendation={comparison.higherCapacity}
        rank={0}
        preference="max-capacity"
      />
    </div>
  );
}
