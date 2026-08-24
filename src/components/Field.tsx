import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function Field({ label, hint, error, children }: FieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-body-sm font-medium text-ink">{label}</span>
      {children}
      {error ? (
        <span className="block text-caption text-secondary">{error}</span>
      ) : hint ? (
        <span className="block text-caption text-ink-faint">{hint}</span>
      ) : null}
    </label>
  );
}

const control =
  "w-full h-11 rounded-md border border-surface-line bg-white px-3 text-body text-ink placeholder:text-ink-faint transition-shadow focus:border-primary focus:outline-none focus:shadow-focus disabled:bg-surface-muted disabled:text-ink-faint";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={[control, props.className ?? ""].join(" ")} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={[control, "pr-8", props.className ?? ""].join(" ")} />;
}
