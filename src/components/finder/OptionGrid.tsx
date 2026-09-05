import type { ComponentType, SVGProps } from "react";

export interface OptionGridItem {
  id: string;
  label: string;
  description?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

export function OptionGrid({
  items,
  onSelect,
}: {
  items: OptionGridItem[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className="group flex items-start gap-3.5 rounded-2xl border border-line bg-paper p-4 text-left transition-all hover:-translate-y-0.5 hover:border-clay hover:shadow-md"
          >
            {Icon && (
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream text-ink transition-colors group-hover:bg-clay group-hover:text-paper">
                <Icon className="h-5.5 w-5.5" />
              </span>
            )}
            <span className="flex flex-col gap-0.5">
              <span className="font-display text-base font-semibold text-ink">{item.label}</span>
              {item.description && (
                <span className="text-sm text-ink-muted">{item.description}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
