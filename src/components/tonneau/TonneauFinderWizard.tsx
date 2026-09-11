"use client";

import { useMemo, useState } from "react";
import { getGenerationForYear } from "@/domains/tonneau/data/generations";
import { getBedLengthsForGeneration } from "@/domains/tonneau/data/bedLengths";
import { recommendCovers } from "@/domains/tonneau/recommend";
import type { BedLength, CoverTypeFilter, Generation } from "@/domains/tonneau/types";
import { StepShell } from "@/components/finder/StepShell";
import { OptionGrid } from "@/components/finder/OptionGrid";
import { TonneauRecommendationCard } from "@/components/tonneau/TonneauRecommendationCard";

/**
 * TonneauFit Finder MVP — the second, independently-built Finder Wizard
 * (after Roof Rack's `FinderWizard.tsx`), created specifically NOT to share
 * code with it yet. Phase 3 will compare the two once both exist and decide
 * what's genuinely worth extracting; building a shared/generic wizard
 * before that comparison exists would be guessing at an abstraction with
 * only one real data point.
 *
 * Deliberately no Cab step: Step 2 research found Cab type is never itself
 * a tonneau fitment condition (see `domains/tonneau/types.ts`) — Bed
 * Length is asked directly. A "not sure about your bed length?" Cab-based
 * helper is a plausible future addition, not built here.
 *
 * Flow: Year → Bed Length → Deck Rail System → Cover Type → Results.
 */

const YEAR_MIN = 2005;
const YEAR_MAX = 2026;
const TRUCK_ID = "toyota-tacoma";
const TRUCK_LABEL = "Toyota Tacoma";

const COVER_TYPE_OPTIONS: { id: CoverTypeFilter; label: string; description: string }[] = [
  { id: "any", label: "Any verified cover", description: "Don't filter by cover type." },
  { id: "hard-folding", label: "Hard folding only", description: "Segmented hard cover that folds flat." },
];

/**
 * Wizard-local answer for the Deck Rail step — kept as its own 3-state enum
 * (not `boolean | undefined`) specifically so a 4th state, "not yet
 * reached this step," is unambiguous (`null`). Mapped to
 * `RecommendationRequest.hasDeckRailSystem` only once an answer exists:
 * "yes" → `true`, "no" → `false`, "unsure" → `undefined` — the domain's own
 * three epistemic states, never collapsed into two here either.
 */
type DeckRailAnswer = "yes" | "no" | "unsure";

type Step = "year" | "bed-length" | "deck-rail" | "cover-type" | "results";

const FLOW: Step[] = ["year", "bed-length", "deck-rail", "cover-type", "results"];

export function TonneauFinderWizard() {
  const [step, setStep] = useState<Step>("year");
  const [year, setYear] = useState<number | null>(null);
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [bedLength, setBedLength] = useState<BedLength | null>(null);
  const [deckRailAnswer, setDeckRailAnswer] = useState<DeckRailAnswer | null>(null);
  const [coverTypeFilter, setCoverTypeFilter] = useState<CoverTypeFilter | null>(null);

  const yearOptions = useMemo(
    () => Array.from({ length: YEAR_MAX - YEAR_MIN + 1 }, (_, i) => YEAR_MAX - i),
    []
  );
  const bedLengthOptions = generation ? getBedLengthsForGeneration(generation.id) : [];

  const hasDeckRailSystem: boolean | undefined =
    deckRailAnswer === "yes" ? true : deckRailAnswer === "no" ? false : undefined;

  const result = useMemo(() => {
    if (year == null || deckRailAnswer == null || coverTypeFilter == null) return null;
    return recommendCovers({
      truckId: TRUCK_ID,
      year,
      bedLengthId: bedLength?.id,
      coverTypeFilter,
      hasDeckRailSystem,
    });
  }, [year, bedLength, deckRailAnswer, coverTypeFilter, hasDeckRailSystem]);

  function reset() {
    setStep("year");
    setYear(null);
    setGeneration(null);
    setBedLength(null);
    setDeckRailAnswer(null);
    setCoverTypeFilter(null);
  }

  const stepNumber = FLOW.indexOf(step) + 1;
  const totalSteps = FLOW.length;

  return (
    <div className="border border-line bg-paper p-6 sm:p-8">
      {step === "year" && (
        <StepShell
          step={stepNumber}
          totalSteps={totalSteps}
          title={`Select your ${TRUCK_LABEL} model year`}
          subtitle={`${YEAR_MIN}–${YEAR_MAX}`}
        >
          <div className="flex flex-wrap gap-2">
            {yearOptions.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => {
                  setYear(y);
                  setGeneration(getGenerationForYear(TRUCK_ID, y) ?? null);
                  setBedLength(null);
                  setStep("bed-length");
                }}
                className="rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-clay hover:bg-clay hover:text-paper"
              >
                {y}
              </button>
            ))}
          </div>
        </StepShell>
      )}

      {step === "bed-length" && generation && (
        <StepShell
          step={stepNumber}
          totalSteps={totalSteps}
          title="Bed length"
          subtitle={`${generation.name} (${generation.yearStart}–${generation.yearEnd}) — tonneau covers are cut to a specific bed length, not cab type.`}
          onBack={() => setStep("year")}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            {bedLengthOptions.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setBedLength(b);
                  setStep("deck-rail");
                }}
                className="flex-1 rounded-none border border-line bg-paper p-4 text-left transition-colors hover:border-clay hover:bg-cream"
              >
                <span className="font-display text-base font-semibold text-ink">{b.label}</span>
              </button>
            ))}
          </div>
        </StepShell>
      )}

      {step === "deck-rail" && (
        <StepShell
          step={stepNumber}
          totalSteps={totalSteps}
          title="Factory Deck Rail System"
          subtitle="Two of today's verified fits require the truck's factory Deck Rail / Utility Track System. We only show a fit that needs it once you've confirmed you have it."
          onBack={() => setStep("bed-length")}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setDeckRailAnswer("yes");
                setStep("cover-type");
              }}
              className="flex-1 rounded-none border border-line bg-paper p-4 text-left transition-colors hover:border-clay hover:bg-cream"
            >
              <span className="font-display text-base font-semibold text-ink">Yes, my truck has it</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setDeckRailAnswer("no");
                setStep("cover-type");
              }}
              className="flex-1 rounded-none border border-line bg-paper p-4 text-left transition-colors hover:border-clay hover:bg-cream"
            >
              <span className="font-display text-base font-semibold text-ink">No, it does not</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setDeckRailAnswer("unsure");
                setStep("cover-type");
              }}
              className="flex-1 rounded-none border border-line bg-paper p-4 text-left transition-colors hover:border-clay hover:bg-cream"
            >
              <span className="font-display text-base font-semibold text-ink">I&apos;m not sure</span>
            </button>
          </div>
        </StepShell>
      )}

      {step === "cover-type" && (
        <StepShell
          step={stepNumber}
          totalSteps={totalSteps}
          title="Cover type"
          subtitle="Results are always sorted by reference price, low to high."
          onBack={() => setStep("deck-rail")}
        >
          <OptionGrid
            items={COVER_TYPE_OPTIONS}
            onSelect={(id) => {
              setCoverTypeFilter(id as CoverTypeFilter);
              setStep("results");
            }}
          />
        </StepShell>
      )}

      {step === "results" && result && (
        <StepShell
          step={stepNumber}
          totalSteps={totalSteps}
          title="Your recommended tonneau covers"
          subtitle={
            result.generation
              ? `${TRUCK_LABEL}, ${year} — ${result.generation.name} (${result.generation.yearStart}–${result.generation.yearEnd})`
              : undefined
          }
          onBack={() => setStep("cover-type")}
        >
          <div className="flex flex-col gap-4">
            {result.note && (
              <p className="border border-line bg-paper p-4 text-sm text-ink-muted">{result.note}</p>
            )}

            {result.recommendations.map((rec) => (
              <TonneauRecommendationCard key={rec.product.id} recommendation={rec} />
            ))}

            <button
              type="button"
              onClick={reset}
              className="self-start text-sm font-semibold text-clay hover:text-clay-dark"
            >
              Start over
            </button>
          </div>
        </StepShell>
      )}
    </div>
  );
}
