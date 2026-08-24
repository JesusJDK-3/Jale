import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "tertiary" | "ghost";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover active:bg-primary-pressed shadow-xs hover:shadow-sm",
  secondary:
    "bg-secondary text-white hover:bg-secondary-hover active:bg-secondary-pressed shadow-xs",
  tertiary:
    "bg-white text-ink border border-surface-line hover:bg-surface-muted active:bg-surface-line",
  ghost: "bg-transparent text-primary hover:bg-primary-soft",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-body-sm rounded-sm",
  md: "h-11 px-4 text-body rounded-md",
  lg: "h-12 px-5 text-body font-medium rounded-md",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:shadow-focus",
        isDisabled && !loading
          ? "cursor-not-allowed bg-surface-line text-ink-faint shadow-none border-transparent hover:bg-surface-line"
          : variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden
        />
      )}
      <span>{loading ? "Cargando…" : children}</span>
    </button>
  );
}
