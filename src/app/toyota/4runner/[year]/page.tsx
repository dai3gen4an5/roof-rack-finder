import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGenerationForYear } from "@/lib/data/generations";
import { getYearsForVehicle } from "@/lib/data/generations";
import { getVerifiedProductsForGeneration, compareFullLengthOptions } from "@/lib/generationProducts";
import { FinderWizard } from "@/components/finder/FinderWizard";
import { RecommendationCard } from "@/components/finder/RecommendationCard";
import { SafetyNotice } from "@/components/SafetyNotice";

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
      "This 4Runner is part of the 5th Generation (2010–2024). Three manufacturer-verified Prinsu rack fitments exist for this generation: two full-length racks (Original and Pro) and one 3/4-length rack, all installing through factory mounting points with no drilling.",
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
      "This 4Runner is part of the newer 6th Generation (2025–2026). Two manufacturer-verified Prinsu full-length rack fitments exist so far (Original and Pro), both bolt-on/non-drill. No 3/4-length rack has been published for this generation yet.",
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
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
          {generation.name} ({generation.yearStart}–{generation.yearEnd})
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
          Best Roof Racks for the {year} Toyota 4Runner
        </h1>
        <p className="mt-3 text-stone-600 dark:text-stone-300">{copy.intro}</p>
      </header>

      <FinderWizard
        vehicleId={VEHICLE_ID}
        vehicleLabel="Toyota 4Runner"
        vehiclePath={VEHICLE_PATH}
        initialYear={year}
      />

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
          Verified compatible products
        </h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
          Every option below has a manufacturer-published fitment statement for the{" "}
          {generation.name} ({generation.yearStart}–{generation.yearEnd}).
        </p>
        <div className="mt-4 flex flex-col gap-4">
          {products.map((rec) => (
            <RecommendationCard key={rec.product.id} recommendation={rec} />
          ))}
        </div>
      </section>

      {comparison && (
        <section className="mt-16 rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50">
            {comparison.cheaper.product.name} vs. {comparison.higherCapacity.product.name}
          </h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
            The {comparison.higherCapacity.product.name} carries {comparison.capacityDelta} lb more
            manufacturer-stated static capacity than the {comparison.cheaper.product.name}, for{" "}
            {(comparison.priceDelta).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}{" "}
            more at reference price. Choose based on whether you need the extra capacity or
            would rather save the difference.
          </p>
        </section>
      )}

      <section className="mt-16">
        <SafetyNotice />
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50">Methodology</h2>
        <p className="mt-2 text-stone-600 dark:text-stone-300">
          Fitment shown here comes only from what Prinsu has published for this generation —
          never guessed or extrapolated. See the full{" "}
          <Link href={`${VEHICLE_PATH}#methodology`} className="underline hover:text-stone-800 dark:hover:text-stone-100">
            methodology
          </Link>{" "}
          for how rankings and verification work.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50">FAQ</h2>
        <dl className="mt-4 space-y-6">
          {copy.faqs.map((faq) => (
            <div key={faq.question}>
              <dt className="font-semibold text-stone-900 dark:text-stone-50">{faq.question}</dt>
              <dd className="mt-1 text-stone-600 dark:text-stone-300">{faq.answer}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">
          More questions answered in the full{" "}
          <Link href={`${VEHICLE_PATH}#faq`} className="underline hover:text-stone-700 dark:hover:text-stone-200">
            FAQ
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
