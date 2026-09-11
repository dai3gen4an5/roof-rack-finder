import type { Variant } from "@/domains/roof-rack/types";

/**
 * Flat, hairline-bordered choice for the finder's vehicle-configuration
 * step — same visual language as GenerationOption, but no photo (a
 * configuration axis like cab type doesn't need one, and today `variants`
 * has no photography assets to show anyway). Renders whatever `label` the
 * data provides; no vehicle- or configuration-specific copy lives here.
 */
export function VariantOption({
  variant,
  onSelect,
  className,
}: {
  variant: Variant;
  onSelect: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex flex-1 flex-col gap-1 border border-line bg-paper p-4 text-left transition-colors hover:border-clay ${className ?? ""}`}
    >
      <p className="font-display text-lg font-semibold text-ink">{variant.label}</p>
      <span className="text-sm font-semibold text-ink-muted group-hover:text-clay">
        Choose this configuration →
      </span>
    </button>
  );
}
