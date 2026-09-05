"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getYearsForVehicle } from "@/lib/data/generations";
import { useCases } from "@/lib/data/useCases";
import { preferences } from "@/lib/data/preferences";
import { recommendRacks } from "@/lib/recommend";
import type { PreferenceId, UseCaseId } from "@/lib/types";
import { StepShell } from "@/components/finder/StepShell";
import { OptionGrid } from "@/components/finder/OptionGrid";
import { RecommendationCard } from "@/components/finder/RecommendationCard";
import { SafetyNotice } from "@/components/SafetyNotice";

type Step = "year" | "use-case" | "preference" | "results";

export function FinderWizard({
  vehicleId,
  vehicleLabel,
  vehiclePath,
  initialYear,
}: {
  vehicleId: string;
  vehicleLabel: string;
  /** URL path to the generic finder, e.g. "/toyota/4runner". Used for the
   * "not this year?" link when `initialYear` is set. */
  vehiclePath?: string;
  /** When set, the year step is skipped and locked to this year — used by
   * the per-year pages, which already know the year from the URL. */
  initialYear?: number;
}) {
  const years = useMemo(() => getYearsForVehicle(vehicleId), [vehicleId]);
  const flow: Step[] = initialYear != null ? ["use-case", "preference", "results"] : ["year", "use-case", "preference", "results"];

  const [step, setStep] = useState<Step>(initialYear != null ? "use-case" : "year");
  const [year, setYear] = useState<number | null>(initialYear ?? null);
  const [useCase, setUseCase] = useState<UseCaseId | null>(null);
  const [preference, setPreference] = useState<PreferenceId | null>(null);

  const result = useMemo(() => {
    if (year == null || useCase == null || preference == null) return null;
    return recommendRacks({ vehicleId, year, useCase, preference });
  }, [vehicleId, year, useCase, preference]);

  function reset() {
    setStep(initialYear != null ? "use-case" : "year");
    if (initialYear == null) setYear(null);
    setUseCase(null);
    setPreference(null);
  }

  const stepNumber = flow.indexOf(step) + 1;
  const totalSteps = flow.length;

  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6 dark:border-stone-800 dark:bg-stone-900/40 sm:p-8">
      {step === "year" && (
        <StepShell
          step={stepNumber}
          totalSteps={totalSteps}
          title={`Select your ${vehicleLabel} model year`}
          subtitle="This determines which generation-specific fitments we can show you."
        >
          <select
            defaultValue=""
            onChange={(e) => {
              setYear(Number(e.target.value));
              setStep("use-case");
            }}
            className="w-full rounded-lg border border-stone-300 bg-white p-3 text-base text-stone-900 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-50"
          >
            <option value="" disabled>
              Choose a model year…
            </option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </StepShell>
      )}

      {step === "use-case" && (
        <StepShell
          step={stepNumber}
          totalSteps={totalSteps}
          title="What do you carry?"
          subtitle="Pick the main thing you plan to load on the rack."
          onBack={initialYear == null ? () => setStep("year") : undefined}
        >
          {initialYear != null && vehiclePath && (
            <p className="-mt-2 text-xs text-stone-500 dark:text-stone-400">
              Shopping for a different year?{" "}
              <Link href={vehiclePath} className="underline hover:text-stone-700 dark:hover:text-stone-200">
                Change model year
              </Link>
            </p>
          )}
          <OptionGrid
            items={useCases.map((u) => ({ id: u.id, label: u.label, description: u.description }))}
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
            items={preferences.map((p) => ({ id: p.id, label: p.label, description: p.description }))}
            onSelect={(id) => {
              setPreference(id as PreferenceId);
              setStep("results");
            }}
          />
        </StepShell>
      )}

      {step === "results" && result && (
        <StepShell
          step={stepNumber}
          totalSteps={totalSteps}
          title="Recommended roof racks"
          subtitle={
            result.generation
              ? `${vehicleLabel}, ${year} — ${result.generation.name} (${result.generation.yearStart}–${result.generation.yearEnd})`
              : undefined
          }
          onBack={() => setStep("preference")}
        >
          <div className="flex flex-col gap-4">
            <SafetyNotice />

            {result.note && (
              <p className="rounded-lg border border-stone-200 bg-white p-4 text-sm text-stone-600 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-300">
                {result.note}
              </p>
            )}

            {result.recommendations.map((rec) => (
              <RecommendationCard key={rec.product.id} recommendation={rec} />
            ))}

            <button
              type="button"
              onClick={reset}
              className="self-start text-sm font-medium text-orange-700 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300"
            >
              Start over
            </button>
          </div>
        </StepShell>
      )}
    </div>
  );
}
