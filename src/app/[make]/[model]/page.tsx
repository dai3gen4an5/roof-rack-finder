import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinderWizard } from "@/components/finder/FinderWizard";
import { getGenerationsForVehicle, getYearsForVehicle } from "@/domains/roof-rack/data/generations";
import { getVerifiedProductsForGeneration, compareFullLengthOptions } from "@/domains/roof-rack/generationProducts";
import { getVehicleBySlug, vehicles } from "@/domains/roof-rack/data/vehicles";
import { getVehicleContent } from "@/domains/roof-rack/data/vehicleContent";
import { getVehicleHeroPhotoAssetKey } from "@/lib/media";
import { GenerationFeature } from "@/components/GenerationFeature";
import { RecommendationCard } from "@/components/finder/RecommendationCard";
import { FinderStageMedia } from "@/components/media/FinderStageMedia";
import { RevealOnScroll } from "@/components/media/RevealOnScroll";
import { Accordion } from "@/components/Accordion";
import { SafetyNotice } from "@/components/SafetyNotice";

export function generateStaticParams() {
  return vehicles.map((v) => ({ make: v.slug[0], model: v.slug[1] }));
}

// Only vehicles with real data get a page; anything else 404s instead of
// silently rendering an empty/misleading page.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ make: string; model: string }>;
}): Promise<Metadata> {
  const { make, model } = await params;
  const vehicle = getVehicleBySlug(make, model);
  const content = vehicle ? getVehicleContent(vehicle.id) : undefined;
  if (!vehicle || !content) return {};

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: `/${vehicle.slug[0]}/${vehicle.slug[1]}` },
  };
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ make: string; model: string }>;
}) {
  const { make, model } = await params;
  const vehicle = getVehicleBySlug(make, model);
  const content = vehicle ? getVehicleContent(vehicle.id) : undefined;
  if (!vehicle || !content) notFound();

  const vehicleLabel = `${vehicle.make} ${vehicle.model}`;
  const vehiclePath = `/${vehicle.slug[0]}/${vehicle.slug[1]}`;
  const generations = getGenerationsForVehicle(vehicle.id);

  return (
    <div>
      {/* VISUAL HERO */}
      <section className="relative h-[64vh] min-h-[440px] w-full overflow-hidden">
        <FinderStageMedia
          alt={`${vehicleLabel} with roof rack overlooking a mountain valley`}
          assetKey={getVehicleHeroPhotoAssetKey(vehicle.id)}
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
        <div className="relative flex h-full flex-col justify-end px-4 pb-14 sm:px-6 lg:px-16">
          <span className="text-xs font-bold tracking-[0.2em] text-clay uppercase">{vehicleLabel}</span>
          <h1 className="mt-2 font-display text-4xl font-semibold text-paper sm:text-5xl">
            Roof Rack Fit Finder
          </h1>
          <p className="mt-3 max-w-md text-lg text-paper/90">{content.heroSubtitle}</p>
          <a
            href="#finder"
            className="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-clay px-6 py-3 text-base font-semibold text-paper transition-colors hover:bg-clay-dark"
          >
            Start the finder
          </a>
        </div>
      </section>

      {/* GENERATION NAVIGATION */}
      <section>
        {generations.map((g) => (
          <GenerationFeature
            key={g.id}
            generation={g}
            href={`${vehiclePath}/${g.yearEnd}`}
            vehicleLabel={vehicleLabel}
          />
        ))}
      </section>

      {/* FINDER */}
      <section id="finder" className="scroll-mt-20 bg-paper">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-semibold text-ink">Let&apos;s find your rack</h2>
            <p className="mt-2 text-ink-muted">Three quick questions, real manufacturer-verified results.</p>
          </div>
          <FinderWizard vehicleId={vehicle.id} vehicleLabel={vehicleLabel} vehiclePath={vehiclePath} />
        </div>
      </section>

      {/* VERIFIED RACK OPTIONS + COMPARISON */}
      <section className="border-t border-line bg-cream">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <RevealOnScroll>
            <h2 className="font-display text-3xl font-semibold text-ink">Verified rack options</h2>
            <p className="mt-2 text-ink-muted">
              Every product below has a manufacturer-published fitment statement — grouped by
              generation.
            </p>
          </RevealOnScroll>
          {generations.map((g) => {
            const comparison = compareFullLengthOptions(g);
            return (
              <div key={g.id} className="mt-12">
                <h3 className="font-display text-xl font-semibold text-ink">
                  {g.name} ({g.yearStart}–{g.yearEnd})
                </h3>
                <div className="mt-4 flex flex-col gap-4">
                  {getVerifiedProductsForGeneration(g).map((rec) => (
                    <RecommendationCard key={rec.product.id} recommendation={rec} />
                  ))}
                </div>
                {comparison && (
                  <div className="mt-6 border border-line-strong bg-paper p-6">
                    <h4 className="font-display text-lg font-semibold text-ink">
                      {comparison.cheaper.product.name} vs. {comparison.higherCapacity.product.name}
                    </h4>
                    <p className="mt-2 text-sm text-ink-muted">
                      The {comparison.higherCapacity.product.name} carries {comparison.capacityDelta} lb
                      more manufacturer-stated static capacity than the {comparison.cheaper.product.name},
                      for{" "}
                      {comparison.priceDelta.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      })}{" "}
                      more at reference price.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* BROWSE BY YEAR */}
      <section className="bg-paper">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h2 className="text-sm font-bold tracking-wide text-ink-soft uppercase">
            Browse by model year
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {getYearsForVehicle(vehicle.id)
              .slice()
              .reverse()
              .map((year) => (
                <Link
                  key={year}
                  href={`${vehiclePath}/${year}`}
                  className="rounded-full border border-line px-3 py-1 text-sm text-ink-muted transition-colors hover:border-clay hover:text-clay"
                >
                  {year}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 border-t border-line bg-cream">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-ink">FAQ</h2>
          <dl className="mt-6 space-y-6">
            {content.faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-semibold text-ink">{faq.question}</dt>
                <dd className="mt-1 text-ink-muted">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* SAFETY / METHODOLOGY / DISCLOSURE — de-emphasized, at the bottom */}
      <section className="bg-paper">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-16 sm:px-6">
          <SafetyNotice vehicleLabel={vehicleLabel} />

          <div id="methodology" className="scroll-mt-20">
            <Accordion title="About & Methodology">
              <p>
                RackFit is an independent site to help {vehicle.model} owners compare roof racks. We
                are not affiliated with Toyota or any rack manufacturer. A few things we hold
                ourselves to on every page:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Fitment comes only from data the rack manufacturer has published for a specific
                  model-year range — never guessed or extrapolated by AI.
                </li>
                <li>
                  Vehicle year/make/model data comes from public NHTSA/vPIC records, used only to
                  identify your model year and generation — never as evidence that a rack fits.
                </li>
                <li>
                  A rack&apos;s manufacturer-stated load capacity is not the same as your{" "}
                  {vehicle.model}&apos;s roof-load limit set by Toyota. See the safety note above —
                  always confirm your vehicle&apos;s limit in the owner&apos;s manual.
                </li>
                <li>Reference prices can and do change; they are not a live quote or a guarantee.</li>
                <li>
                  Every product shows the date its fitment and specs were last checked against the
                  manufacturer&apos;s page (&quot;Last checked&quot;).
                </li>
              </ul>
              <p>
                <strong>Ranking:</strong> every recommendation must first be a manufacturer-verified
                fitment for your model year and support your selected use case — unverified or
                mismatched products are never shown. From there:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Best overall</strong> scores each verified, full-length option on
                  value-for-money relative to price (50%), manufacturer-stated capacity relative to
                  the group (40%), and installation simplicity (10%) — a fixed formula, not a black
                  box.
                </li>
                <li>
                  <strong>Maximum capacity</strong> ranks by manufacturer-stated static capacity,
                  highest first.
                </li>
                <li>
                  <strong>Lower cost</strong> ranks by reference price, lowest first.
                </li>
                <li>
                  <strong>Smaller / 3/4 rack</strong> shows only 3/4-length racks, and says so
                  plainly when none exist yet for your generation rather than substituting a
                  full-length one.
                </li>
              </ul>
              <p>
                Every result card shows 1–3 concrete &quot;Why it matches your setup&quot; reasons
                drawn directly from these same rules, so the ranking is never a mystery.
              </p>
              <p>
                <strong>
                  {vehicleLabel} generations covered:
                </strong>{" "}
                {content.generationsCoveredDetail}
              </p>
            </Accordion>
          </div>

          <div id="affiliate-disclosure" className="scroll-mt-20">
            <Accordion title="Affiliate Disclosure">
              <p>
                RackFit does not currently have any affiliate relationships with Prinsu or any
                other manufacturer or retailer. The &quot;View at manufacturer&quot; links on this
                site go directly to the manufacturer&apos;s own product pages, and we do not earn a
                commission on purchases made through them today.
              </p>
              <p>
                RackFit may use affiliate links in the future. When affiliate links are active, we
                may earn a commission at no additional cost to you. This section will be updated to
                reflect that before any affiliate link goes live — we won&apos;t leave this page
                saying &quot;not currently&quot; once it no longer is.
              </p>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
