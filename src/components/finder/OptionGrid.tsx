export interface OptionGridItem {
  id: string;
  label: string;
  description?: string;
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
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className="flex flex-col items-start gap-1 rounded-lg border border-stone-200 bg-white p-4 text-left transition-colors hover:border-orange-500 hover:bg-orange-50 dark:border-stone-800 dark:bg-stone-950 dark:hover:border-orange-500 dark:hover:bg-orange-950/20"
        >
          <span className="font-semibold text-stone-900 dark:text-stone-50">{item.label}</span>
          {item.description && (
            <span className="text-sm text-stone-500 dark:text-stone-400">{item.description}</span>
          )}
        </button>
      ))}
    </div>
  );
}
