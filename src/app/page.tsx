import type { Metadata } from "next";
import Link from "next/link";
import { getGenerationsForVehicle } from "@/lib/data/generations";
import { HeroMedia } from "@/components/media/HeroMedia";
import { GenerationFeature } from "@/components/GenerationFeature";
import { FinderStage } from "@/components/finder/FinderStage";
import { FeaturedRacks } from "@/components/FeaturedRacks";
import { RevealOnScroll } from "@/components/media/RevealOnScroll";
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
      <section className="relative h-[100svh] min-h-[680px] w-full overflow-hidden sm:h-[82vh] sm:min-h-[600px]">
        <HeroMedia alt="Toyota 4Runner with a loaded roof rack overlooking a mountain valley at sunset" />
        {/* Dark scrim, strongest lower-left where the copy sits, fading away
            toward the vehicle/sky — a gradient, not a flat rectangle. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(43,38,32,0.68)_0%,rgba(43,38,32,0.42)_42%,rgba(43,38,32,0.16)_65%,transparent_85%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(43,38,32,0.5)_0%,rgba(43,38,32,0.08)_38%,transparent_60%)]" />
        {/* Mobile-only: stronger asymmetric bottom-left weighting so body copy
            and CTAs stay legible without flattening the whole photo (desktop
            keeps the lighter gradients above only). */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(43,38,32,0)_0%,rgba(43,38,32,0.28)_40%,rgba(43,38,32,0.6)_75%,rgba(43,38,32,0.7)_100%)] sm:hidden" />

        <div className="relative flex h-full flex-col justify-end px-4 pb-44 sm:px-6 sm:pb-16 lg:px-16 lg:pb-20">
          <div className="max-w-xl">
            <span className="text-xs font-bold tracking-[0.2em] text-clay uppercase">
              Built for 4Runner owners
            </span>
            <h1 className="font-hero mt-2 text-4xl leading-[1.1] font-bold text-paper sm:mt-3 sm:text-6xl sm:leading-[1.05] lg:text-7xl">
              <span className="block">Find the</span>
              <span className="block text-clay uppercase whitespace-nowrap">Roof Rack</span>
              <span className="block">that actually fits</span>
              <span className="block">your 4Runner.</span>
            </h1>
            <p className="mt-4 max-w-md text-base text-paper/85 sm:mt-5 sm:text-lg">
              Choose your year, what you carry, and how you use your rig. RackFit compares
              manufacturer-verified options — no guessed compatibility.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 sm:mt-7">
              <a
                href="#finder"
                className="inline-flex items-center justify-center rounded-full bg-clay px-6 py-3 text-base font-semibold text-paper transition-colors hover:bg-clay-dark"
              >
                Find my rack
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-paper px-6 py-3 text-base font-semibold text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                See how it works
              </a>
            </div>
          </div>
        </div>

        {/* Trust signals, overlaid directly on the photo — not a separate card */}
        <div className="absolute inset-x-0 bottom-0 border-t border-paper/20 bg-ink/45 backdrop-blur-[2px] sm:bg-ink/35">
          <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-paper/20 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
            {[
              { icon: ShieldCheckIcon, label: "Manufacturer-published fitment" },
              { icon: NoAiIcon, label: "No AI-inferred compatibility" },
              { icon: CompassIcon, label: "Verified sources" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 py-2.5 sm:justify-center sm:py-4">
                <item.icon className="h-4 w-4 shrink-0 text-paper" />
                <span className="text-xs font-semibold tracking-wide text-paper uppercase">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GENERATIONS — each its own large editorial feature */}
      <section>
        {generations.map((g) => (
          <GenerationFeature key={g.id} generation={g} href={`/toyota/4runner/${g.yearEnd}`} />
        ))}
      </section>

      {/* HOW IT WORKS — quiet editorial section between photo sections */}
      <section id="how-it-works" className="scroll-mt-20 bg-paper">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <RevealOnScroll>
            <h2 className="font-hero text-3xl font-semibold text-ink">How RackFit works</h2>
          </RevealOnScroll>
          <div className="mt-10 divide-y divide-line">
            {[
              { number: "01", title: "Choose your 4Runner", body: "Pick your generation and model year — 2010 to 2026." },
              { number: "02", title: "Tell us what you carry", body: "Rooftop tent, cargo, kayaks, bikes, or general overlanding gear." },
              { number: "03", title: "See verified rack matches", body: "Compare capacity, price, and installation — ranked by what matters to you." },
            ].map((step) => (
              <RevealOnScroll key={step.number}>
                <div className="flex items-baseline gap-6 py-6">
                  <span className="font-display text-4xl font-semibold text-sand">{step.number}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">{step.title}</h3>
                    <p className="mt-1 text-ink-muted">{step.body}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* FINDER — staged on its own photography */}
      <section id="finder" className="scroll-mt-20">
        <FinderStage
          vehicleId="toyota-4runner"
          vehicleLabel="Toyota 4Runner"
          vehiclePath="/toyota/4runner"
        />
      </section>

      {/* FEATURED RACKS */}
      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <RevealOnScroll>
            <h2 className="font-hero text-3xl font-semibold text-ink">Featured racks</h2>
            <p className="mt-2 text-ink-muted">
              Not ready to run the finder? Here are two real, verified options for the current
              6th Gen 4Runner.
            </p>
          </RevealOnScroll>
          <div className="mt-8">
            <FeaturedRacks />
          </div>
        </div>
      </section>

      {/* WHY RACKFIT */}
      <section className="border-t border-line bg-cream">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <RevealOnScroll>
            <h2 className="font-hero text-3xl font-semibold text-ink">Why RackFit</h2>
          </RevealOnScroll>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheckIcon,
                title: "Verified compatibility",
                body: "Every fitment traces back to the manufacturer's own product page.",
              },
              {
                icon: NoAiIcon,
                title: "Independent recommendations",
                body: "Not affiliated with Toyota or any rack manufacturer — no live affiliate deals shape what's shown today.",
              },
              {
                icon: CompassIcon,
                title: "Built around use case, not rankings",
                body: "Results change based on what you carry and what matters to you — not a fixed top-10 list.",
              },
            ].map((item) => (
              <RevealOnScroll key={item.title}>
                <item.icon className="h-6 w-6 text-clay" />
                <p className="mt-3 font-display text-lg font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-sm text-ink-muted">{item.body}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* SAFETY / METHODOLOGY — de-emphasized, bottom of page */}
      <section className="bg-paper">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-16 sm:px-6">
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
      </section>
    </div>
  );
}
