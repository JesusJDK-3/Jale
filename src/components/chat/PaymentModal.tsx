import { useState, type FormEvent } from "react";
import { Badge } from "../Badge";
import { Button } from "../Button";

type PaymentModalProps = {
  amount: number;
  studentName: string;
  onConfirm: () => void;
  onClose: () => void;
};

export function PaymentModal({
  amount,
  studentName,
  onConfirm,
  onClose,
}: PaymentModalProps) {
  const [method, setMethod] = useState<"yape" | "plin" | "card">("yape");
  const [phone, setPhone] = useState("987 654 321");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onConfirm();
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary via-primary-hover to-secondary p-5 text-white">
          <div className="flex items-center justify-between">
            <Badge tone="success" className="bg-white/20 text-white border-0">
              🛡️ Custodia Escrow Jale.pe
            </Badge>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white"
            >
              ✕
            </button>
          </div>
          <h3 className="mt-2 font-display text-title font-bold text-white">
            Fondear pago en Escrow
          </h3>
          <p className="text-xs text-white/90">
            Para el encargo acordado con {studentName.split(" ")[0]}
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Amount summary */}
          <div className="flex items-center justify-between rounded-xl bg-surface-muted p-4">
            <div>
              <span className="text-caption uppercase font-bold text-ink-faint">
                Monto en custodia
              </span>
              <p className="font-display text-display-md font-black text-primary">
                S/ {amount.toFixed(2)}
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="font-bold text-success">0% Comisión</span>
              <p className="text-[11px] text-ink-muted">Sin cobros extra</p>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-caption font-bold uppercase tracking-wider text-ink-muted">
              Selecciona método de pago rápido
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod("yape")}
                className={[
                  "flex flex-col items-center justify-center rounded-xl border p-3 transition",
                  method === "yape"
                    ? "border-primary bg-primary-soft/40 shadow-xs ring-2 ring-primary/20"
                    : "border-surface-line hover:border-primary/40",
                ].join(" ")}
              >
                <span className="text-xl">💜</span>
                <span className="mt-1 font-display text-xs font-bold text-ink">Yape</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod("plin")}
                className={[
                  "flex flex-col items-center justify-center rounded-xl border p-3 transition",
                  method === "plin"
                    ? "border-primary bg-primary-soft/40 shadow-xs ring-2 ring-primary/20"
                    : "border-surface-line hover:border-primary/40",
                ].join(" ")}
              >
                <span className="text-xl">💙</span>
                <span className="mt-1 font-display text-xs font-bold text-ink">Plin</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod("card")}
                className={[
                  "flex flex-col items-center justify-center rounded-xl border p-3 transition",
                  method === "card"
                    ? "border-primary bg-primary-soft/40 shadow-xs ring-2 ring-primary/20"
                    : "border-surface-line hover:border-primary/40",
                ].join(" ")}
              >
                <span className="text-xl">💳</span>
                <span className="mt-1 font-display text-xs font-bold text-ink">Tarjeta</span>
              </button>
            </div>
          </div>

          {/* Form fields based on method */}
          {method === "card" ? (
            <div className="space-y-2 text-xs">
              <input
                type="text"
                placeholder="Número de tarjeta (Débito / Crédito)"
                defaultValue="4557 •••• •••• 8912"
                className="w-full rounded-xl border border-surface-line bg-surface-muted/30 p-2.5 text-xs text-ink"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="MM/AA"
                  defaultValue="08/28"
                  className="rounded-xl border border-surface-line bg-surface-muted/30 p-2.5 text-xs text-ink"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  defaultValue="123"
                  className="rounded-xl border border-surface-line bg-surface-muted/30 p-2.5 text-xs text-ink"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <label className="text-caption text-ink-muted">
                Número celular para confirmación ({method.toUpperCase()})
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-surface-line bg-surface-muted/30 p-2.5 text-xs font-bold text-ink"
              />
            </div>
          )}

          {/* Escrow guarantee note */}
          <div className="rounded-xl bg-emerald-50 p-3 text-[11px] text-emerald-800 leading-relaxed">
            🛡️ <strong>Regla de oro Jale.pe:</strong> Tu dinero queda congelado en la cuenta de custodia. El estudiante comenzará a trabajar con la tranquilidad de que los fondos existen, pero <strong>tú tienes el control total para liberar el pago</strong> solo tras recibir los archivos conformes.
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              variant="primary"
            >
              Confirmar depósito de S/ {amount.toFixed(2)}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
