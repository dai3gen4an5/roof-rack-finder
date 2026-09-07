"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getGenerationForYear, getGenerationsForVehicle } from "@/lib/data/generations";
import { getVariantsForGeneration } from "@/lib/data/variants";
import { useCases } from "@/lib/data/useCases";
import { preferences } from "@/lib/data/preferences";
import { recommendRacks } from "@/lib/recommend";
import type { Generation, PreferenceId, UseCaseId, Variant } from "@/lib/types";
import { StepShell } from "@/components/finder/StepShell";
import { OptionGrid } from "@/components/finder/OptionGrid";
import { RecommendationCard } from "@/components/finder/RecommendationCard";
import { SafetyNotice } from "@/components/SafetyNotice";
import { GenerationOption } from "@/components/finder/GenerationOption";
import { VariantOption } from "@/components/finder/VariantOption";
import { USE_CASE_ICONS, PREFERENCE_ICONS } from "@/components/finder/iconMaps";

type Step = "generation" | "year" | "variant" | "use-case" | "preference" | "results";

export function FinderWizard({
  vehicleId,
  vehicleLabel,
  vehiclePath,
  initialYear,
  initialGenerationId,
}: {
  vehicleId: string;
  vehicleLabel: string;
  /** URL path to the generic finder, e.g. "/toyota/4runner". Used for the
   * "not this year?" link when `initialYear` is set. */
  vehiclePath?: string;
  /** When set, the generation and year steps are skipped and locked to this
   * year — used by the per-year pages, which already know the year. */
  initialYear?: number;
  /** When set (and `initialYear` is not), the generation step is skipped —
   * used by the generation marketing cards to jump straight to year choice. */
  initialGenerationId?: string;
}) {
  const generations = useMemo(() => getGenerationsForVehicle(vehicleId), [vehicleId]);
  const initialGenerationFromProp = initialGenerationId
    ? (generations.find((g) => g.id === initialGenerationId) ?? null)
    : null;

  // Resolved as early as it can be known, so whether this generation has a
  // configuration axis (see hasVariantStep below) is correct from the very
  // first render — not just after the user clicks through a "generation"
  // step that might not even be part of this flow (e.g. year pages).
  const [generation, setGeneration] = useState<Generation | null>(
    () =>
      initialGenerationFromProp ??
      (initialYear != null ? (getGenerationForYear(vehicleId, initialYear) ?? null) : null)
  );
  const hasVariantStep = generation ? getVariantsForGeneration(generation.id).length > 0 : false;

  const skipToStep: Step =
    initialYear != null
      ? hasVariantStep
        ? "variant"
        : "use-case"
      : initialGenerationFromProp
        ? "year"
        : "generation";

  // Not a static array: which steps exist depends on whether the resolved
  // generation turns out to have a configuration axis, which can only be
  // known once a generation is resolved (immediately for the year-page /
  // preset-generation entry points; only after the "generation" step
  // otherwise) — this recomputes as `generation` state changes.
  const flow: Step[] = useMemo(() => {
    const steps: Step[] = [];
    if (initialYear == null && !initialGenerationFromProp) steps.push("generation");
    if (initialYear == null) steps.push("year");
    if (hasVariantStep) steps.push("variant");
    steps.push("use-case", "preference", "results");
    return steps;
  }, [initialYear, initialGenerationFromProp, hasVariantStep]);

  const [step, setStep] = useState<Step>(skipToStep);
  const [year, setYear] = useState<number | null>(initialYear ?? null);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [useCase, setUseCase] = useState<UseCaseId | null>(null);
  const [preference, setPreference] = useState<PreferenceId | null>(null);

  const result = useMemo(() => {
    if (year == null || useCase == null || preference == null) return null;
    return recommendRacks({ vehicleId, year, variantId: variant?.id, useCase, preference });
  }, [vehicleId, year, variant, useCase, preference]);

  function reset() {
    setStep(skipToStep);
    if (initialYear == null) setYear(null);
    if (initialYear == null && !initialGenerationFromProp) setGeneration(null);
    setVariant(null);
    setUseCase(null);
    setPreference(null);
  }

  const stepNumber = flow.indexOf(step) + 1;
  const totalSteps = flow.length;
  const yearOptions = generation
    ? Array.from(
        { length: generation.yearEnd - generation.yearStart + 1 },
        (_, i) => generation.yearEnd - i
      )
    : [];
  const variantsForGeneration = generation ? getVariantsForGeneration(generation.id) : [];

  return (
    <div className="border border-line bg-paper p-6 sm:p-8">
      {step === "generation" && (
        <StepShell
          step={stepNumber}
          totalSteps={totalSteps}
          title={`Choose your ${vehicleLabel}`}
          subtitle="Which generation is yours?"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            {generations.map((g) => (
              <GenerationOption
                key={g.id}
                generation={g}
                vehicleLabel={vehicleLabel}
                onSelect={() => {
                  setGeneration(g);
                  setStep("year");
                }}
              />
            ))}
          </div>
        </StepShell>
      )}

      {step === "year" && generation && (
        <StepShell
          step={stepNumber}
          totalSteps={totalSteps}
          title={`Select your ${generation.name} model year`}
          subtitle={`${generation.yearStart}–${generation.yearEnd}`}
          onBack={initialGenerationFromProp ? undefined : () => setStep("generation")}
        >
          <div className="flex flex-wrap gap-2">
            {yearOptions.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => {
                  setYear(y);
                  setStep(hasVariantStep ? "variant" : "use-case");
                }}
                className="rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-clay hover:bg-clay hover:text-paper"
              >
                {y}
              </button>
            ))}
          </div>
        </StepShell>
      )}

      {step === "variant" && generation && (
        <StepShell
          step={stepNumber}
          totalSteps={totalSteps}
          title="Vehicle configuration"
          subtitle="Which configuration is yours?"
          onBack={initialYear == null ? () => setStep("year") : undefined}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            {variantsForGeneration.map((v) => (
              <VariantOption
                key={v.id}
                variant={v}
                onSelect={() => {
                  setVariant(v);
                  setStep("use-case");
                }}
              />
            ))}
          </div>
        </StepShell>
      )}

      {step === "use-case" && (
        <StepShell
          step={stepNumber}
          totalSteps={totalSteps}
          title="What do you carry?"
          subtitle="Pick the main thing you plan to load on the rack."
          onBack={
            hasVariantStep
              ? () => setStep("variant")
              : initialYear == null
                ? () => setStep("year")
                : undefined
          }
        >
          {initialYear != null && vehiclePath && (
            <p className="-mt-2 text-xs text-ink-soft">
              Shopping for a different year?{" "}
              <Link href={vehiclePath} className="underline hover:text-ink">
                Change model year
              </Link>
            </p>
          )}
          <OptionGrid
            items={useCases.map((u) => ({
              id: u.id,
              label: u.label,
              description: u.description,
              icon: USE_CASE_ICONS[u.id],
            }))}
            onSelect={(id) => {
              setUseCase(id as UseCaseId);
              setStep("preference");
            }}
          />
        </StepShell>
      )}

      {step === "preference" && (
        <StepShell
          step={stepNumber}
          totalSteps={totalSteps}
          title="Rack preference"
          subtitle="What matters most to you?"
          onBack={() => setStep("use-case")}
        >
          <OptionGrid
            items={preferences.map((p) => ({
              id: p.id,
              label: p.label,
              description: p.description,
              icon: PREFERENCE_ICONS[p.id],
            }))}
            onSelect={(id) => {
              setPreference(id as PreferenceId);
              setStep("results");
            }}
          />
        </StepShell>
      )}

      {step === "results" && result && preference && useCase && (
        <StepShell
          step={stepNumber}
          totalSteps={totalSteps}
          title="Your recommended roof racks"
          subtitle={
            result.generation
              ? `${vehicleLabel}, ${year} — ${result.generation.name} (${result.generation.yearStart}–${result.generation.yearEnd})`
              : undefined
          }
          onBack={() => setStep("preference")}
        >
          <div className="flex flex-col gap-4">
            <SafetyNotice vehicleLabel={vehicleLabel} />

            {result.note && (
              <p className="border border-line bg-paper p-4 text-sm text-ink-muted">
                {result.note}
              </p>
            )}

            {result.recommendations.map((rec, index) => (
              <RecommendationCard
                key={rec.product.id}
                recommendation={rec}
                variant={index === 0 ? "primary" : "secondary"}
                rank={index}
                preference={preference}
              />
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
