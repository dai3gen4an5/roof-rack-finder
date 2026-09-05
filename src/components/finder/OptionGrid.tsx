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
    <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className="flex items-start gap-3.5 border border-line bg-paper p-4 text-left transition-colors hover:border-clay hover:bg-cream focus-visible:border-clay focus-visible:bg-cream focus-visible:outline-none"
          >
            {Icon && <Icon className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted" />}
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
