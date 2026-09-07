import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGenerationForYear, getYearsForVehicle } from "@/lib/data/generations";
import { getVerifiedProductsForGeneration, compareFullLengthOptions } from "@/lib/generationProducts";
import { getVehicleBySlug, vehicles } from "@/lib/data/vehicles";
import { getVehicleContent } from "@/lib/data/vehicleContent";
import { FinderWizard } from "@/components/finder/FinderWizard";
import { RecommendationCard } from "@/components/finder/RecommendationCard";
import { SafetyNotice } from "@/components/SafetyNotice";
import { VehicleGenerationMedia } from "@/components/media/VehicleGenerationMedia";
import { Accordion } from "@/components/Accordion";

// Returns the full (make, model, year) triple for every valid combination
// rather than relying on parent-segment param propagation — simpler and
// avoids the ambiguity of nested generateStaticParams across two ancestor
// dynamic segments ([make] and [model]).
export function generateStaticParams() {
  return vehicles.flatMap((vehicle) =>
    getYearsForVehicle(vehicle.id).map((year) => ({
      make: vehicle.slug[0],
      model: vehicle.slug[1],
      year: String(year),
    }))
  );
}

// Only years with a known generation get a page; anything else 404s
// instead of silently rendering an empty/misleading page.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ make: string; model: string; year: string }>;
}): Promise<Metadata> {
  const { make, model, year: yearParam } = await params;
  const vehicle = getVehicleBySlug(make, model);
  if (!vehicle) return {};
  const year = Number(yearParam);
  const generation = getGenerationForYear(vehicle.id, year);
  if (!generation) return {};

  const vehiclePath = `/${vehicle.slug[0]}/${vehicle.slug[1]}`;
  return {
    title: `Best Roof Racks for the ${year} ${vehicle.make} ${vehicle.model}`,
    description: `Manufacturer-verified roof rack options for the ${year} ${vehicle.make} ${vehicle.model} (${generation.name}, ${generation.yearStart}–${generation.yearEnd}). Compare capacity, price, and installation type.`,
    alternates: { canonical: `${vehiclePath}/${year}` },
  };
}

export default async function VehicleYearPage({
  params,
}: {
  params: Promise<{ make: string; model: string; year: string }>;
}) {
  const { make, model, year: yearParam } = await params;
  const vehicle = getVehicleBySlug(make, model);
  if (!vehicle) notFound();
  const content = getVehicleContent(vehicle.id);
  if (!content) notFound();

  const year = Number(yearParam);
  const generation = getGenerationForYear(vehicle.id, year);
  if (!generation) notFound();

  const generationCopy = content.generationCopy[generation.id];
  if (!generationCopy) notFound();

  const vehicleLabel = `${vehicle.make} ${vehicle.model}`;
  const vehiclePath = `/${vehicle.slug[0]}/${vehicle.slug[1]}`;
  const products = getVerifiedProductsForGeneration(generation);
  const comparison = compareFullLengthOptions(generation);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[64vh] min-h-[440px] w-full overflow-hidden">
        <VehicleGenerationMedia
          generationId={generation.id}
          alt={`${generation.name} ${vehicleLabel} with roof rack`}
          className="h-full w-full"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/15 to-transparent" />
        <div className="relative flex h-full flex-col justify-end px-4 pb-14 sm:px-6 lg:px-16">
          <span className="text-xs font-bold tracking-[0.2em] text-clay uppercase">
            {generation.name} · {generation.yearStart}–{generation.yearEnd}
          </span>
          <h1 className="mt-2 font-display text-4xl font-semibold text-paper sm:text-5xl">
            Best Roof Racks for the {year} {vehicleLabel}
          </h1>
          <p className="mt-3 max-w-md text-lg text-paper/90">{generationCopy.intro}</p>
          <a
            href="#finder"
            className="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-clay px-6 py-3 text-base font-semibold text-paper transition-colors hover:bg-clay-dark"
          >
            Run the finder for {year}
          </a>
        </div>
      </section>

      {/* VERIFIED RACK OPTIONS */}
      <section className="border-y border-line bg-cream">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-ink">Verified rack options</h2>
          <p className="mt-2 text-ink-muted">
            Every option below has a manufacturer-published fitment statement for the{" "}
            {generation.name} ({generation.yearStart}–{generation.yearEnd}).
          </p>
          <div className="mt-6 flex flex-col gap-4">
            {products.map((rec) => (
              <RecommendationCard key={rec.product.id} recommendation={rec} />
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      {comparison && (
        <section className="bg-paper">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
            <div className="border border-line-strong bg-cream/60 p-8">
              <h2 className="font-display text-2xl font-semibold text-ink">
                {comparison.cheaper.product.name} vs. {comparison.higherCapacity.product.name}
              </h2>
              <p className="mt-3 text-ink-muted">
                The {comparison.higherCapacity.product.name} carries {comparison.capacityDelta} lb
                more manufacturer-stated static capacity than the {comparison.cheaper.product.name},
                for{" "}
                {comparison.priceDelta.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                })}{" "}
                more at reference price. Choose based on whether you need the extra capacity or
                would rather save the difference.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* FINDER */}
      <section id="finder" className="border-y border-line bg-cream scroll-mt-20">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-semibold text-ink">
              Find your {year} {vehicle.model}&apos;s rack
            </h2>
            <p className="mt-2 text-ink-muted">
              A couple quick questions — you&apos;ve already told us the year.
            </p>
          </div>
          <FinderWizard
            vehicleId={vehicle.id}
            vehicleLabel={vehicleLabel}
            vehiclePath={vehiclePath}
            initialYear={year}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-ink">FAQ</h2>
          <dl className="mt-6 space-y-6">
            {generationCopy.faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-semibold text-ink">{faq.question}</dt>
                <dd className="mt-1 text-ink-muted">{faq.answer}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-ink-soft">
            More questions answered in the full{" "}
            <Link href={`${vehiclePath}#faq`} className="underline hover:text-ink">
              FAQ
            </Link>
            .
          </p>
        </div>
      </section>

      {/* SAFETY / METHODOLOGY — compact, bottom of page */}
      <section className="border-t border-line bg-cream">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-16 sm:px-6">
          <SafetyNotice vehicleLabel={vehicleLabel} />
          <Accordion title="Methodology for this page">
            <p>
              Fitment shown here comes only from what the manufacturer has published for this
              generation — never guessed or extrapolated. See the full{" "}
              <Link href={`${vehiclePath}#methodology`} className="underline hover:text-ink">
                methodology
              </Link>{" "}
              for how rankings and verification work.
            </p>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
