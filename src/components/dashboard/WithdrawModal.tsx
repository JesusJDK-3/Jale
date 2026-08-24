import { useState, type FormEvent } from "react";
import { Button } from "../Button";

type WithdrawModalProps = {
  availableBalance: number;
  onConfirm: (amount: number, method: "BCP" | "Interbank" | "BBVA" | "Yape", accountNumber: string) => void;
  onClose: () => void;
};

export function WithdrawModal({
  availableBalance,
  onConfirm,
  onClose,
}: WithdrawModalProps) {
  const [amount, setAmount] = useState(availableBalance);
  const [method, setMethod] = useState<"BCP" | "Interbank" | "BBVA" | "Yape">("BCP");
  const [accountNumber, setAccountNumber] = useState("191-98765432-0-88");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > availableBalance) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onConfirm(amount, method, accountNumber);
    }, 600);
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
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="rounded-pill bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
              💰 Retiro de Ganancias
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white"
            >
              ✕
            </button>
          </div>
          <h3 className="mt-2 font-display text-title font-bold text-white">
            Solicitar transferencia a tu cuenta
          </h3>
          <p className="text-xs text-white/90">
            Saldo disponible para retiro inmediato: <strong>S/ {availableBalance.toFixed(2)}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          <div>
            <label className="text-caption font-bold uppercase tracking-wider text-ink-muted">
              Monto a retirar (S/)
            </label>
            <div className="relative mt-1">
              <input
                type="number"
                min={10}
                max={availableBalance}
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-surface-line bg-surface-muted/30 p-3 text-base font-black text-ink focus:border-success focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setAmount(availableBalance)}
                className="absolute right-3 top-3 text-xs font-bold text-primary hover:underline"
              >
                Todo
              </button>
            </div>
          </div>

          {/* Method selector */}
          <div>
            <label className="text-caption font-bold uppercase tracking-wider text-ink-muted">
              Destino de transferencia
            </label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {(["BCP", "Interbank", "BBVA", "Yape"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMethod(m);
                    if (m === "Yape") setAccountNumber("987 654 321");
                    else if (m === "Interbank") setAccountNumber("003-88765432-0-12");
                    else if (m === "BBVA") setAccountNumber("0011-0123-4567890123");
                    else setAccountNumber("191-98765432-0-88");
                  }}
                  className={[
                    "flex flex-col items-center justify-center rounded-xl border p-2.5 transition text-center",
                    method === m
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-xs ring-2 ring-emerald-500/20"
                      : "border-surface-line hover:border-emerald-600/40 text-ink",
                  ].join(" ")}
                >
                  <span className="text-xs font-bold">{m}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-caption font-bold uppercase tracking-wider text-ink-muted">
              {method === "Yape" ? "Número de celular Yape" : `Número de cuenta ${method}`}
            </label>
            <input
              type="text"
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="mt-1 w-full rounded-xl border border-surface-line bg-surface-muted/30 p-2.5 font-mono text-xs font-bold text-ink focus:border-success focus:outline-none"
            />
          </div>

          <div className="rounded-xl bg-surface-muted p-3 text-[11px] text-ink-muted leading-relaxed">
            ⏱️ <strong>Plazo de abono:</strong> Las transferencias a BCP y Yape se abonan en menos de 2 horas. A otros bancos en 24h hábiles.
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              className="!bg-success hover:!bg-success-hover text-white"
            >
              Transferir S/ {amount.toFixed(2)} ahora
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
