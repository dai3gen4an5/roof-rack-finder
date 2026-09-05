import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGenerationForYear, getYearsForVehicle } from "@/lib/data/generations";
import { getVerifiedProductsForGeneration, compareFullLengthOptions } from "@/lib/generationProducts";
import { FinderWizard } from "@/components/finder/FinderWizard";
import { RecommendationCard } from "@/components/finder/RecommendationCard";
import { SafetyNotice } from "@/components/SafetyNotice";
import { VehicleGenerationMedia } from "@/components/media/VehicleGenerationMedia";
import { Accordion } from "@/components/Accordion";

const VEHICLE_ID = "toyota-4runner";
const VEHICLE_PATH = "/toyota/4runner";

export function generateStaticParams() {
  return getYearsForVehicle(VEHICLE_ID).map((year) => ({ year: String(year) }));
}

// Only years with a known generation get a page; anything else 404s
// instead of silently rendering an empty/misleading page.
export const dynamicParams = false;

interface GenerationCopy {
  intro: string;
  faqs: { question: string; answer: string }[];
}

const GENERATION_COPY: Record<string, GenerationCopy> = {
  "4runner-5th-gen": {
    intro:
      "Three manufacturer-verified Prinsu rack fitments exist for this generation: two full-length racks (Original and Pro) and one 3/4-length rack, all installing through factory mounting points with no drilling.",
    faqs: [
      {
        question: "What's different between the Original and Pro racks for the 5th Gen 4Runner?",
        answer:
          "Both are full-length and non-drill. The Pro carries a higher manufacturer-stated capacity (700 lb dynamic / 1,200 lb static vs. 600 lb / 1,000 lb) at a higher reference price. Use the finder's \"Maximum capacity\" or \"Lower cost\" preference to see which one fits your budget and load.",
      },
      {
        question: "Is the 3/4-length rack a good fit for a rooftop tent?",
        answer:
          "It carries the same manufacturer-stated capacity as the full-length Original (600 lb dynamic / 1,000 lb static), so it can work for lighter rooftop tents — but a full-length rack gives the tent's mounting hardware more surface to spread across. Check the tent manufacturer's own mounting requirements too.",
      },
    ],
  },
  "4runner-6th-gen": {
    intro:
      "Two manufacturer-verified Prinsu full-length rack fitments exist so far (Original and Pro), both bolt-on/non-drill. No 3/4-length rack has been published for this generation yet.",
    faqs: [
      {
        question: "Why isn't there a 3/4-length rack for this generation yet?",
        answer:
          "As of our last check, Prinsu hasn't published one for the 6th Gen 4Runner. Rather than guess at a fitment that hasn't been confirmed, the finder shows an honest empty result if you select \"Smaller / 3/4 rack\" for this generation.",
      },
      {
        question: "Which rack should I get for a new 6th Gen 4Runner?",
        answer:
          "Both the Original and Pro are full-length and non-drill. The Pro's higher manufacturer-stated capacity (700 lb dynamic / 1,200 lb static) costs more than the Original (600 lb / 1,000 lb). Use the finder to compare them against your specific use case and budget.",
      },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year: yearParam } = await params;
  const year = Number(yearParam);
  const generation = getGenerationForYear(VEHICLE_ID, year);
  if (!generation) return {};

  return {
    title: `Best Roof Racks for the ${year} Toyota 4Runner`,
    description: `Manufacturer-verified roof rack options for the ${year} Toyota 4Runner (${generation.name}, ${generation.yearStart}–${generation.yearEnd}). Compare capacity, price, and installation type.`,
    alternates: { canonical: `${VEHICLE_PATH}/${year}` },
  };
}

export default async function YearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearParam } = await params;
  const year = Number(yearParam);
  const generation = getGenerationForYear(VEHICLE_ID, year);
  if (!generation) notFound();

  const copy = GENERATION_COPY[generation.id];
  const products = getVerifiedProductsForGeneration(generation);
  const comparison = compareFullLengthOptions(generation);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[64vh] min-h-[440px] w-full overflow-hidden">
        <VehicleGenerationMedia
          generationId={generation.id as "4runner-5th-gen" | "4runner-6th-gen"}
          alt={`${generation.name} Toyota 4Runner with roof rack`}
          className="h-full w-full"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/15 to-transparent" />
        <div className="relative flex h-full flex-col justify-end px-4 pb-14 sm:px-6 lg:px-16">
          <span className="text-xs font-bold tracking-[0.2em] text-clay uppercase">
            {generation.name} · {generation.yearStart}–{generation.yearEnd}
          </span>
          <h1 className="mt-2 font-display text-4xl font-semibold text-paper sm:text-5xl">
            Best Roof Racks for the {year} Toyota 4Runner
          </h1>
          <p className="mt-3 max-w-md text-lg text-paper/90">{copy.intro}</p>
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
              Find your {year} 4Runner&apos;s rack
            </h2>
            <p className="mt-2 text-ink-muted">Two quick questions — you&apos;ve already told us the year.</p>
          </div>
          <FinderWizard
            vehicleId={VEHICLE_ID}
            vehicleLabel="Toyota 4Runner"
            vehiclePath={VEHICLE_PATH}
            initialYear={year}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-ink">FAQ</h2>
          <dl className="mt-6 space-y-6">
            {copy.faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-semibold text-ink">{faq.question}</dt>
                <dd className="mt-1 text-ink-muted">{faq.answer}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-ink-soft">
            More questions answered in the full{" "}
            <Link href={`${VEHICLE_PATH}#faq`} className="underline hover:text-ink">
              FAQ
            </Link>
            .
          </p>
        </div>
      </section>

      {/* SAFETY / METHODOLOGY — compact, bottom of page */}
      <section className="border-t border-line bg-cream">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-16 sm:px-6">
          <SafetyNotice />
          <Accordion title="Methodology for this page">
            <p>
              Fitment shown here comes only from what Prinsu has published for this generation —
              never guessed or extrapolated. See the full{" "}
              <Link href={`${VEHICLE_PATH}#methodology`} className="underline hover:text-ink">
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
