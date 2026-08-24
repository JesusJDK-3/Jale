import { Badge } from "./Badge";
import { Button } from "./Button";
import type { Talent, PortfolioShot } from "../data";

type PortfolioModalProps = {
  talent: Talent;
  shot: PortfolioShot;
  onClose: () => void;
  onContact: (talent: Talent) => void;
};

export function PortfolioModal({
  talent,
  shot,
  onClose,
  onContact,
}: PortfolioModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-ink/40 text-white backdrop-blur-md transition hover:bg-ink lg:right-6 lg:top-6"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Side: Protagonist Visual Artwork (1:1 / Instagram Post style) */}
        <div
          className={[
            "relative flex min-h-[260px] flex-1 flex-col items-center justify-center overflow-hidden p-8 text-white bg-gradient-to-br sm:min-h-[360px] lg:min-h-[500px]",
            shot.gradient,
          ].join(" ")}
        >
          {/* Subtle decorative mesh background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Visual Icon / Tag */}
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 shadow-lg backdrop-blur-md ring-1 ring-white/30">
              <span className="font-display text-2xl font-bold tracking-wider" style={{ color: shot.accentColor }}>
                {shot.tag.slice(0, 4).toUpperCase()}
              </span>
            </div>

            <span className="rounded-pill bg-black/30 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              {shot.category}
            </span>

            <h3 className="mt-3 max-w-sm font-display text-xl font-bold leading-snug sm:text-2xl">
              {shot.title}
            </h3>

            {shot.timeSpent && (
              <p className="mt-2 text-xs font-medium text-white/80">
                ⏱️ Tiempo de entrega registrado: <span className="font-bold text-white">{shot.timeSpent}</span>
              </p>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/70">
            <span>Jale.pe · Portafolio Verificado</span>
            <span>Estudiante {talent.university}</span>
          </div>
        </div>

        {/* Right Side: Trust Info & Service Details */}
        <div className="flex flex-1 flex-col justify-between overflow-y-auto p-6 sm:p-8">
          <div>
            {/* Header: Student Info */}
            <div className="flex items-center gap-3.5 border-b border-surface-line pb-4">
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-primary">
                <img
                  src={talent.avatarUrl}
                  alt={talent.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-display text-body font-bold text-ink">{talent.name}</h4>
                  <Badge tone="success" dot size="sm">
                    Verificado
                  </Badge>
                </div>
                <p className="text-body-sm text-ink-muted">
                  {talent.career} · {talent.university} ({talent.semester})
                </p>
              </div>
            </div>

            {/* Price & Rating Trust Bar */}
            <div className="my-4 grid grid-cols-3 gap-2 rounded-xl bg-surface-muted p-3 text-center">
              <div>
                <p className="text-caption text-ink-faint">Tarifa base</p>
                <p className="font-display text-body font-bold text-primary">Desde S/ {talent.priceFrom}</p>
              </div>
              <div>
                <p className="text-caption text-ink-faint">Calificación</p>
                <p className="font-display text-body font-bold text-ink">
                  ★ {talent.rating} <span className="text-xs font-normal text-ink-faint">({talent.reviews})</span>
                </p>
              </div>
              <div>
                <p className="text-caption text-ink-faint">Disponibilidad</p>
                <p className="font-display text-body font-bold text-success">
                  {talent.availableNow ? "🟢 Hoy" : "⚡ En 24h"}
                </p>
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div className="mt-4">
              <h5 className="font-display text-body-sm font-bold text-ink">
                Entregables incluidos en este trabajo:
              </h5>
              <ul className="mt-2 space-y-1.5">
                {shot.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-body-sm text-ink-muted">
                    <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-success-soft text-[10px] font-bold text-success">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Client Testimonial if present */}
            {shot.clientQuote && (
              <div className="mt-4 rounded-lg border border-surface-line/80 bg-white p-3.5 shadow-xs">
                <p className="text-xs italic text-ink-muted">"{shot.clientQuote}"</p>
                {shot.clientName && (
                  <p className="mt-1.5 text-right text-[11px] font-semibold text-ink-faint">
                    — {shot.clientName}
                  </p>
                )}
              </div>
            )}

            {/* Escrow Guarantee Pill */}
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary-soft/60 px-3 py-2 text-xs text-primary">
              <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>
                <strong>Garantía Escrow:</strong> Tu pago se retiene en Jale.pe y solo se libera cuando apruebes la mini-sustentación.
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 flex flex-col gap-2 pt-2 sm:flex-row">
            <Button
              fullWidth
              size="lg"
              onClick={() => {
                onClose();
                onContact(talent);
              }}
            >
              Contactar a {talent.name.split(" ")[0]}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
