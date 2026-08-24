import { Link } from "react-router-dom";

type LogoProps = {
  compact?: boolean;
  to?: string;
};

export function Logo({ compact = false, to = "/" }: LogoProps) {
  const mark = (
    <span className="inline-flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white shadow-xs">
        <span className="font-display text-sm font-extrabold tracking-tight">Ja</span>
      </span>
      {!compact && (
        <span className="font-display text-title tracking-tight">
          Jale<span className="text-primary">.pe</span>
        </span>
      )}
    </span>
  );

  return (
    <Link to={to} aria-label="Jale.pe inicio" className="shrink-0">
      {mark}
    </Link>
  );
}
