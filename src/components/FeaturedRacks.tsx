import { getGenerationById } from "@/lib/data/generations";
import { compareFullLengthOptions } from "@/lib/generationProducts";
import { RecommendationCard } from "@/components/finder/RecommendationCard";

/** A no-finder-required preview of real, verified racks for site visitors
 * who haven't run the finder yet. Badges are genuinely spec-derived
 * (lowest price / highest capacity within this pair) — never fabricated
 * popularity or ratings. */
export function FeaturedRacks() {
  const generation = getGenerationById("4runner-6th-gen");
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
