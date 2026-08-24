type Step = { n: number; label: string };

export function Stepper({ steps, current }: { steps: Step[]; current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2 sm:gap-3">
      {steps.map((step, i) => {
        const done = step.n < current;
        const active = step.n === current;
        return (
          <li key={step.n} className="flex items-center gap-2">
            <span
              className={[
                "flex h-7 w-7 items-center justify-center rounded-full text-caption font-bold",
                done || active ? "bg-primary text-white" : "bg-surface-muted text-ink-faint",
              ].join(" ")}
            >
              {done ? "✓" : step.n}
            </span>
            <span
              className={[
                "text-caption sm:text-body-sm",
                active ? "font-semibold text-ink" : "text-ink-faint",
              ].join(" ")}
            >
              {step.label}
            </span>
            {i < steps.length - 1 && (
              <span className="mx-1 hidden h-px w-6 bg-surface-line sm:block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
