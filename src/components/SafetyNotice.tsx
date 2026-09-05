export function SafetyNotice() {
  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
      <p className="font-semibold">Two different limits apply — check both.</p>
      <p className="mt-1">
        A rack&apos;s manufacturer-stated load capacity is not the same as your
        4Runner&apos;s roof-load limit set by Toyota. Before loading a rack,
        confirm your vehicle&apos;s roof-load limit in your owner&apos;s manual or
        with Toyota, and never exceed whichever limit — rack or vehicle — is
        lower.
      </p>
    </div>
  );
}
