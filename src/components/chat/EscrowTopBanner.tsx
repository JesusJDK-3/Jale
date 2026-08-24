import { useState } from "react";

type EscrowTopBannerProps = {
  amount: number;
  deadline: string;
  studentName: string;
  isDelivered?: boolean;
};

export function EscrowTopBanner({
  amount,
  deadline,
  studentName,
  isDelivered,
}: EscrowTopBannerProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative border-b border-primary/20 bg-gradient-to-r from-primary-soft via-blue-50 to-emerald-50/60 px-4 py-2.5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Lock Icon & Escrow Status */}
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-xs text-xs font-bold">
            🔒
          </span>
          <div>
            <div className="flex items-center gap-1.5 font-display font-extrabold text-ink">
              <span>Pago en Escrow Jale.pe:</span>
              <span className="text-primary font-black">S/ {amount.toFixed(2)} retenidos</span>
              <button
                type="button"
                onClick={() => setShowTooltip((v) => !v)}
                className="text-ink-faint hover:text-primary transition"
                title="¿Cómo funciona el Escrow de Jale.pe?"
              >
                ℹ️
              </button>
            </div>
            <p className="text-[11px] text-ink-muted">
              {isDelivered ? (
                <span className="font-semibold text-success">
                  📦 Entrega recibida · Revisa los archivos y aprueba para liberar los fondos
                </span>
              ) : (
                <span>
                  Plazo estimado de entrega: <strong className="text-ink">{deadline}</strong> por {studentName.split(" ")[0]}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right: Security Guarantee Pill */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-pill bg-white/80 px-2.5 py-1 border border-primary/20 text-[11px] font-semibold text-primary backdrop-blur-xs">
          <span>🛡️ Fondos 100% protegidos</span>
        </div>
      </div>

      {/* Expandable Escrow Info Modal / Popover */}
      {showTooltip && (
        <div className="mt-2.5 rounded-xl border border-primary/30 bg-white p-3.5 text-xs text-ink shadow-md">
          <div className="flex items-start justify-between">
            <h4 className="font-display font-bold text-primary">
              Garantía de Custodia Escrow Jale.pe
            </h4>
            <button
              type="button"
              onClick={() => setShowTooltip(false)}
              className="text-ink-faint hover:text-ink text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <p className="mt-1.5 text-ink-muted leading-relaxed text-[11px]">
            Tus <strong>S/ {amount.toFixed(2)}</strong> están guardados en una cuenta de custodia segura.
            El dinero NO se entrega al estudiante hasta que recibas los entregables acordados y presiones <strong>"Aprobar entrega"</strong>. Si algo no coincide, tienes hasta 2 revisiones gratuitas de ajuste.
          </p>
        </div>
      )}
    </div>
  );
}
