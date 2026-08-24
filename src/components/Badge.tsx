import type { ReactNode } from "react";

type Tone = "primary" | "secondary" | "success" | "neutral" | "warning";

type BadgeProps = {
  children: ReactNode;
  tone?: Tone;
  dot?: boolean;
  size?: "sm" | "md";
  className?: string;
};

const tones: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary",
  secondary: "bg-secondary-soft text-secondary-pressed",
  success: "bg-success-soft text-success-hover",
  neutral: "bg-surface-muted text-ink-muted",
  warning: "bg-secondary-soft text-secondary-hover",
};

export function Badge({
  children,
  tone = "neutral",
  dot = false,
  size = "md",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex max-w-full items-center gap-1.5 truncate rounded-pill font-semibold",
        size === "sm" ? "px-1.5 py-0.5 text-[10px] leading-tight" : "px-2.5 py-1 text-caption",
        tones[tone],
        className,
      ].join(" ")}
    >
      {dot && (
        <span
          className={[
            "h-1.5 w-1.5 rounded-full",
            tone === "success" ? "bg-success" : tone === "primary" ? "bg-primary" : "bg-secondary",
          ].join(" ")}
        />
      )}
      {children}
    </span>
  );
}
