import type { OrderStatus } from "../../dashboardData";

type StatusBadgeProps = {
  status: OrderStatus;
  className?: string;
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  switch (status) {
    case "waiting_payment":
      return (
        <span
          className={[
            "inline-flex items-center gap-1.5 rounded-pill border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800",
            className,
          ].join(" ")}
        >
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Esperando pago
        </span>
      );

    case "in_progress":
      return (
        <span
          className={[
            "inline-flex items-center gap-1.5 rounded-pill border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800",
            className,
          ].join(" ")}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          En progreso
        </span>
      );

    case "in_review":
      return (
        <span
          className={[
            "inline-flex items-center gap-1.5 rounded-pill border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-800",
            className,
          ].join(" ")}
        >
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          En revisión del cliente
        </span>
      );

    case "changes_requested":
      return (
        <span
          className={[
            "inline-flex items-center gap-1.5 rounded-pill border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-800",
            className,
          ].join(" ")}
        >
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          Ajustes solicitados
        </span>
      );

    case "completed_paid":
      return (
        <span
          className={[
            "inline-flex items-center gap-1.5 rounded-pill border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800",
            className,
          ].join(" ")}
        >
          <span className="h-2 w-2 rounded-full bg-success" />
          Completado - pagado
        </span>
      );

    default:
      return null;
  }
}
