import { CompassIcon, ScaleIcon, TentIcon } from "@/components/visuals/Icons";

const STEPS = [
  {
    number: "01",
    icon: TentIcon,
    title: "Choose your 4Runner",
    body: "Pick your generation and model year — 2010 to 2026.",
  },
  {
    number: "02",
    icon: CompassIcon,
    title: "Tell us what you carry",
    body: "Rooftop tent, cargo, kayaks, bikes, or general overlanding gear.",
  },
  {
    number: "03",
    icon: ScaleIcon,
    title: "Compare verified fits",
    body: "See capacity, price, and installation side by side — ranked by what matters to you.",
  },
];

export function HowItWorks() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {STEPS.map((step) => (
        <div
          key={step.number}
          className="flex flex-col gap-3 rounded-2xl border border-line bg-paper p-6"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-4xl font-semibold text-sand">{step.number}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-clay">
              <step.icon className="h-5 w-5" />
            </span>
          </div>
          <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
          <p className="text-sm text-ink-muted">{step.body}</p>
        </div>
      ))}
    </div>
  );
}
