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
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        <span className="text-xs font-medium tracking-wide text-stone-400 uppercase dark:text-stone-500">
          Step {step} of {totalSteps}
        </span>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-50">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
