import type { Metadata } from "next";
import Link from "next/link";
import { FinderWizard } from "@/components/finder/FinderWizard";
import { getYearsForVehicle } from "@/lib/data/generations";

export const metadata: Metadata = {
  title: "Toyota 4Runner Roof Rack Fit Finder",
  description:
    "Find a manufacturer-verified roof rack for your 2010–2026 Toyota 4Runner. Compare fitment, load capacity, installation type, and reference price by use case.",
  alternates: { canonical: "/toyota/4runner" },
};

const faqs = [
  {
    question: "How do you decide a rack \"fits\" my 4Runner?",
    answer:
      "We only list a fitment when the rack manufacturer states it directly for a given model year range on their own product page. We don't infer fitment from vehicle dimensions, other model years, or similar-looking parts.",
  },
  {
    question: "What's the difference between dynamic and static capacity?",
    answer:
      "Dynamic capacity is the manufacturer-rated load limit while the vehicle is being driven. Static capacity is the rated limit while the vehicle is parked (e.g. camping in a rooftop tent). Both are set by the rack manufacturer for that specific rack.",
  },
  {
    question: "Is the rack's load capacity the same as my 4Runner's roof-load limit?",
    answer:
      "No. Those are two separate limits. The rack manufacturer only rates the rack itself. Toyota separately publishes a roof-load limit for the vehicle in the owner's manual. Always follow whichever limit is lower — check your owner's manual before loading anything.",
  },
  {
    question: "Why is there no 3/4-length rack shown for the 2025–2026 4Runner?",
    answer:
      "As of our last data check, Prinsu has not published a 3/4-length rack for the 6th generation 4Runner. We show an honest empty result rather than suggesting a rack that hasn't been confirmed to fit.",
  },
  {
    question: "Should I get the Original or the Pro rack?",
    answer:
      "Both are full-length, non-drill, manufacturer-verified fits. The Original is the lower-cost, still-capable option; the Pro costs more but carries a higher manufacturer-stated capacity. Pick \"Maximum capacity\" in the finder if you specifically need the extra headroom, or \"Lower cost\" if the Original's capacity already covers your load.",
  },
  {
    question: "Are the listed prices guaranteed?",
    answer:
      "No. Prices are labeled \"reference price\" because manufacturers change pricing over time, and change even faster during sales. Always confirm the current price on the manufacturer's page before buying.",
  },
  {
    question: "Do you earn money if I buy through your links?",
    answer:
      "Not currently. See the Affiliate Disclosure section below.",
  },
];

export default function ToyotaFourRunnerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
          Toyota 4Runner Roof Rack Fit Finder
        </h1>
        <p className="mt-3 text-stone-600 dark:text-stone-300">
          Covers 2010–2026 model years (5th and 6th generation). Answer three quick
          questions to see manufacturer-verified rack options for your 4Runner.
        </p>
      </header>

      <FinderWizard vehicleId="toyota-4runner" vehicleLabel="Toyota 4Runner" />

      <section className="mt-16">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
          Browse by model year
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {getYearsForVehicle("toyota-4runner")
            .slice()
            .reverse()
            .map((year) => (
              <Link
                key={year}
                href={`/toyota/4runner/${year}`}
                className="rounded-full border border-stone-300 px-3 py-1 text-sm text-stone-700 hover:border-orange-500 hover:text-orange-700 dark:border-stone-700 dark:text-stone-300 dark:hover:border-orange-500 dark:hover:text-orange-400"
              >
                {year}
              </Link>
            ))}
        </div>
      </section>

      <section id="methodology" className="mt-16 scroll-mt-20">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
          About &amp; Methodology
        </h2>
        <div className="mt-4 space-y-4 text-stone-700 dark:text-stone-300">
          <p>
            RackFit is an independent site to help 4Runner owners compare roof racks.
            We are not affiliated with Toyota or any rack manufacturer. A few things we
            hold ourselves to on every page:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Fitment comes only from data the rack manufacturer has published for a
              specific model-year range — never guessed or extrapolated by AI.
            </li>
            <li>
              Vehicle year/make/model data comes from public NHTSA/vPIC records, used
              only to identify your model year and generation — never as evidence that
              a rack fits.
            </li>
            <li>
              A rack&apos;s manufacturer-stated load capacity is not the same as your
              4Runner&apos;s roof-load limit set by Toyota. See the safety note above —
              always confirm your vehicle&apos;s limit in the owner&apos;s manual.
            </li>
            <li>Reference prices can and do change; they are not a live quote or a guarantee.</li>
            <li>
              Every product shows the date its fitment and specs were last checked
              against the manufacturer&apos;s page (&quot;Last checked&quot;).
            </li>
          </ul>
          <p>
            <strong>Ranking:</strong> every recommendation must first be a
            manufacturer-verified fitment for your model year and support your selected
            use case — unverified or mismatched products are never shown. From there:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Best overall</strong> scores each verified, full-length option on
              value-for-money relative to price (50%), manufacturer-stated capacity
              relative to the group (40%), and installation simplicity (10%) — a fixed
              formula, not a black box.
            </li>
            <li>
              <strong>Maximum capacity</strong> ranks by manufacturer-stated static
              capacity, highest first.
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
            Every result card shows 1–3 concrete &quot;Why this rack?&quot; reasons drawn
            directly from these same rules, so the ranking is never a mystery.
          </p>
          <p>
            <strong>Toyota 4Runner generations covered:</strong> 5th Generation
            (2010–2024) and 6th Generation (2025–2026).
          </p>
        </div>
      </section>

      <section id="faq" className="mt-16 scroll-mt-20">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">FAQ</h2>
        <dl className="mt-4 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <dt className="font-semibold text-stone-900 dark:text-stone-50">
                {faq.question}
              </dt>
              <dd className="mt-1 text-stone-600 dark:text-stone-300">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="affiliate-disclosure" className="mt-16 scroll-mt-20">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
          Affiliate Disclosure
        </h2>
        <p className="mt-4 text-stone-700 dark:text-stone-300">
          RackFit does not currently have any affiliate relationships with Prinsu or
          any other manufacturer or retailer. The &quot;View at manufacturer&quot; links
          on this site go directly to the manufacturer&apos;s own product pages, and we
          do not earn a commission on purchases made through them today.
        </p>
        <p className="mt-4 text-stone-700 dark:text-stone-300">
          RackFit may use affiliate links in the future. When affiliate links are
          active, we may earn a commission at no additional cost to you. This section
          will be updated to reflect that before any affiliate link goes live — we
          won&apos;t leave this page saying &quot;not currently&quot; once it no longer is.
        </p>
      </section>
    </div>
  );
}
