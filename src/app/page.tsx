import Link from "next/link";
import type { Metadata } from "next";
import { getGenerationsForVehicle } from "@/lib/data/generations";
import { OverlandScene } from "@/components/visuals/OverlandScene";
import { GenerationLinkCard } from "@/components/visuals/GenerationCard";
import { TrustStrip } from "@/components/TrustStrip";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturedRacks } from "@/components/FeaturedRacks";
import { FinderWizard } from "@/components/finder/FinderWizard";
import { Accordion } from "@/components/Accordion";
import { SafetyNotice } from "@/components/SafetyNotice";
import { CompassIcon, NoAiIcon, ShieldCheckIcon } from "@/components/visuals/Icons";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  const generations = getGenerationsForVehicle("toyota-4runner");

  return (
    <div>
      {/* HERO */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col items-start gap-5">
            <span className="text-xs font-bold tracking-widest text-clay uppercase">
              Built for 4Runner owners
            </span>
            <h1 className="font-display text-4xl leading-tight font-semibold text-ink sm:text-5xl">
              Find the roof rack that actually fits your 4Runner.
            </h1>
            <p className="max-w-md text-lg text-ink-muted">
              Choose your year, what you carry, and how you use your rig. RackFit compares
              manufacturer-verified options — no guessed compatibility.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#finder"
                className="inline-flex items-center justify-center rounded-full bg-clay px-6 py-3 text-base font-semibold text-paper transition-colors hover:bg-clay-dark"
              >
                Find my rack
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-line-strong px-6 py-3 text-base font-semibold text-ink transition-colors hover:border-ink"
              >
                See how it works
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-line bg-cream shadow-sm">
            <OverlandScene topper="tent" className="h-full w-full" />
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-line bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <TrustStrip />
        </div>
      </section>

      {/* BUILT AROUND YOUR 4RUNNER */}
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-semibold text-ink">
              Built around your 4Runner
            </h2>
            <p className="mt-2 text-ink-muted">
              Fitment differs by generation. Start with yours.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
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

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-y border-line bg-cream scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-ink">How RackFit works</h2>
          <div className="mt-8">
            <HowItWorks />
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

      {/* FEATURED RACKS */}
      <section className="border-y border-line bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-semibold text-ink">Featured racks</h2>
            <p className="mt-2 text-ink-muted">
              Not ready to run the finder? Here are two real, verified options for the current
              6th Gen 4Runner.
            </p>
          </div>
          <div className="mt-8">
            <FeaturedRacks />
          </div>
        </div>
      </section>

      {/* WHY RACKFIT */}
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-ink">Why RackFit</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <ShieldCheckIcon className="h-7 w-7 text-clay" />
              <p className="mt-3 font-display text-lg font-semibold text-ink">Verified compatibility</p>
              <p className="mt-1 text-sm text-ink-muted">
                Every fitment traces back to the manufacturer&apos;s own product page.
              </p>
            </div>
            <div>
              <NoAiIcon className="h-7 w-7 text-clay" />
              <p className="mt-3 font-display text-lg font-semibold text-ink">
                Independent recommendations
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                Not affiliated with Toyota or any rack manufacturer — and no live affiliate deals
                shaping what&apos;s shown today.
              </p>
            </div>
            <div>
              <CompassIcon className="h-7 w-7 text-clay" />
              <p className="mt-3 font-display text-lg font-semibold text-ink">
                Built around use case, not rankings
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                Results change based on what you carry and what matters to you — not a fixed
                top-10 list.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SAFETY / METHODOLOGY */}
      <section className="border-t border-line bg-cream">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="flex flex-col gap-4">
            <SafetyNotice />
            <Accordion title="How RackFit verifies fitment">
              <p>
                Fitment comes only from data the rack manufacturer has published for a specific
                model-year range — never guessed or extrapolated by AI. Vehicle year/make/model
                data comes from public NHTSA/vPIC records, used only to identify your model year
                and generation, never as fitment evidence.
              </p>
              <p>
                Read the full{" "}
                <Link href="/toyota/4runner#methodology" className="underline hover:text-ink">
                  methodology
                </Link>{" "}
                on the 4Runner finder page.
              </p>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
