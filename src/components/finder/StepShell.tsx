export function StepShell({
  step,
  totalSteps,
  title,
  subtitle,
  onBack,
  children,
}: {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold text-ink-muted hover:text-ink"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={`h-[2px] transition-all ${
                i + 1 === step ? "w-8 bg-clay" : i + 1 < step ? "w-4 bg-olive" : "w-4 bg-line"
              }`}
            />
          ))}
        </div>
      </div>
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
