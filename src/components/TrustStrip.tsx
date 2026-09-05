import { NoAiIcon, RefreshIcon, ShieldCheckIcon } from "@/components/visuals/Icons";

const ITEMS = [
  {
    icon: ShieldCheckIcon,
    title: "Manufacturer Verified",
    body: "Every fitment comes from the rack maker's own product page — not a guess.",
  },
  {
    icon: NoAiIcon,
    title: "No AI-Guessed Fitment",
    body: "We never infer compatibility from vehicle shape, similar parts, or nearby years.",
  },
  {
    icon: RefreshIcon,
    title: "Updated Product Data",
    body: "Specs and pricing carry the exact date they were last checked.",
  },
];

export function TrustStrip() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {ITEMS.map((item) => (
        <div key={item.title} className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream text-olive">
            <item.icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold tracking-wide text-ink uppercase">{item.title}</p>
            <p className="mt-0.5 text-sm text-ink-muted">{item.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
