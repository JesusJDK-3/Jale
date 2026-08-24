import { Button } from "../Button";
import type { InvoiceRecord } from "../../dashboardData";

type InvoiceModalProps = {
  invoice: InvoiceRecord;
  onClose: () => void;
};

export function InvoiceModal({ invoice, onClose }: InvoiceModalProps) {
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
        {/* Receipt Header */}
        <div className="bg-slate-900 p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="font-display font-black text-sm tracking-wider text-primary">
              JALE<span className="text-secondary">.PE</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-white/70 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="mt-3">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Comprobante de Custodia Escrow
            </span>
            <h3 className="font-mono text-sm font-bold text-white">
              {invoice.invoiceNumber}
            </h3>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          <div className="flex justify-between border-b border-surface-line pb-3">
            <div>
              <span className="text-caption text-ink-faint">Fecha de emisión</span>
              <p className="font-bold text-ink">{invoice.date}</p>
            </div>
            <div className="text-right">
              <span className="text-caption text-ink-faint">Método de pago</span>
              <p className="font-bold text-ink">{invoice.paymentMethod}</p>
            </div>
          </div>

          <div>
            <span className="text-caption text-ink-faint">Servicio contratado</span>
            <p className="font-display text-xs font-bold text-ink">{invoice.orderTitle}</p>
            <p className="text-[11px] text-ink-muted">
              Estudiante: {invoice.studentName} ({invoice.studentUniversity})
            </p>
          </div>

          <div className="rounded-xl bg-surface-muted p-3 space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between text-ink-muted">
              <span>Subtotal del servicio:</span>
              <span>S/ {invoice.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>Comisión de plataforma:</span>
              <span className="text-success font-bold">S/ 0.00 (Gratis)</span>
            </div>
            <div className="flex justify-between border-t border-surface-line pt-1 font-sans text-xs font-black text-ink">
              <span>Total abonado en Escrow:</span>
              <span className="text-primary">S/ {invoice.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-[11px] text-emerald-800">
            ✓ <strong>Código de Protección:</strong> <span className="font-mono">{invoice.escrowProtectionCode}</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              fullWidth
              size="md"
              variant="primary"
              onClick={() => {
                alert(`Descargando comprobante ${invoice.invoiceNumber} en PDF...`);
                onClose();
              }}
            >
              Descargar PDF
            </Button>
            <Button fullWidth size="md" variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
