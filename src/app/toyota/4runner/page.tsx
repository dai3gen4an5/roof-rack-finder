import type { Metadata } from "next";
import Link from "next/link";
import { FinderWizard } from "@/components/finder/FinderWizard";
import { getGenerationsForVehicle, getYearsForVehicle } from "@/lib/data/generations";
import { getVerifiedProductsForGeneration } from "@/lib/generationProducts";
import { GenerationLinkCard } from "@/components/visuals/GenerationCard";
import { OverlandScene } from "@/components/visuals/OverlandScene";
import { RecommendationCard } from "@/components/finder/RecommendationCard";
import { Accordion } from "@/components/Accordion";
import { SafetyNotice } from "@/components/SafetyNotice";

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
    answer: "Not currently. See the Affiliate Disclosure section below.",
  },
];

export default function ToyotaFourRunnerPage() {
  const generations = getGenerationsForVehicle("toyota-4runner");

  return (
    <div>
      {/* HERO */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="text-xs font-bold tracking-widest text-clay uppercase">
              Toyota 4Runner
            </span>
            <h1 className="mt-2 font-display text-4xl leading-tight font-semibold text-ink sm:text-5xl">
              Roof Rack Fit Finder
            </h1>
            <p className="mt-4 max-w-md text-lg text-ink-muted">
              Covers 2010–2026 (5th &amp; 6th Gen). Answer three quick questions to see
              manufacturer-verified rack options for your 4Runner.
            </p>
            <a
              href="#finder"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-clay px-6 py-3 text-base font-semibold text-paper transition-colors hover:bg-clay-dark"
            >
              Start the finder
            </a>
          </div>
          <div className="overflow-hidden rounded-3xl border border-line bg-cream shadow-sm">
            <OverlandScene topper="cargo" className="h-full w-full" />
          </div>
        </div>
      </section>

      {/* GENERATION CARDS */}
      <section className="border-y border-line bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {generations.map((g) => (
              <GenerationLinkCard
                key={g.id}
                generation={g}
                href={`/toyota/4runner/${g.yearEnd}`}
                topper={g.id === "4runner-6th-gen" ? "cargo" : "tent"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FINDER */}
      <section id="finder" className="bg-paper scroll-mt-20">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-semibold text-ink">Let&apos;s find your rack</h2>
            <p className="mt-2 text-ink-muted">Three quick questions, real manufacturer-verified results.</p>
          </div>
          <FinderWizard vehicleId="toyota-4runner" vehicleLabel="Toyota 4Runner" vehiclePath="/toyota/4runner" />
        </div>
      </section>

      {/* VERIFIED PRODUCTS PREVIEW */}
      <section className="border-y border-line bg-cream">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-ink">Verified compatible products</h2>
          <p className="mt-2 text-ink-muted">
            Every product below has a manufacturer-published fitment statement — grouped by
            generation.
          </p>
          {generations.map((g) => (
            <div key={g.id} className="mt-10">
              <h3 className="font-display text-xl font-semibold text-ink">
                {g.name} ({g.yearStart}–{g.yearEnd})
              </h3>
              <div className="mt-4 flex flex-col gap-4">
                {getVerifiedProductsForGeneration(g).map((rec) => (
                  <RecommendationCard key={rec.product.id} recommendation={rec} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BROWSE BY YEAR */}
      <section className="bg-paper">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h2 className="text-sm font-bold tracking-wide text-ink-soft uppercase">
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
                  className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-muted transition-colors hover:border-clay hover:text-clay"
                >
                  {year}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-line bg-cream scroll-mt-20">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-ink">FAQ</h2>
          <dl className="mt-6 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-semibold text-ink">{faq.question}</dt>
                <dd className="mt-1 text-ink-muted">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* SAFETY / METHODOLOGY / DISCLOSURE — compact, at the bottom */}
      <section className="bg-paper">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-16 sm:px-6">
          <SafetyNotice />

          <div id="methodology" className="scroll-mt-20">
            <Accordion title="About & Methodology">
              <p>
                RackFit is an independent site to help 4Runner owners compare roof racks. We are
                not affiliated with Toyota or any rack manufacturer. A few things we hold
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
                  A rack&apos;s manufacturer-stated load capacity is not the same as your
                  4Runner&apos;s roof-load limit set by Toyota. See the safety note above — always
                  confirm your vehicle&apos;s limit in the owner&apos;s manual.
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
                <strong>Toyota 4Runner generations covered:</strong> 5th Generation (2010–2024) and
                6th Generation (2025–2026).
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
