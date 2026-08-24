import { useState } from "react";
import { Button } from "../Button";
import type { DashboardOrder } from "../../dashboardData";

type ApproveOrderModalProps = {
  order: DashboardOrder;
  onConfirm: (rating: number, comment: string) => void;
  onClose: () => void;
};

export function ApproveOrderModal({
  order,
  onConfirm,
  onClose,
}: ApproveOrderModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState(
    `Excelente trabajo de ${order.studentName.split(" ")[0]}. Cumplió con los entregables a tiempo y con muy buena calidad.`
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onConfirm(rating, comment);
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
              ✓ Aprobación y Liberación
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
            Aprobar entrega y liberar pago
          </h3>
          <p className="text-xs text-white/90">
            Liberarás <strong>S/ {order.amount.toFixed(2)}</strong> a {order.studentName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          <div className="rounded-xl border border-surface-line bg-surface-muted/50 p-3.5">
            <p className="font-display text-xs font-bold text-ink">{order.title}</p>
            <p className="mt-1 text-[11px] text-ink-muted">
              Archivo entregado: <strong>{order.deliveryFileName}</strong> ({order.deliveryFileSize})
            </p>
          </div>

          <div>
            <label className="text-caption font-bold uppercase tracking-wider text-ink-muted">
              Califica el trabajo de {order.studentName.split(" ")[0]} (1 a 5 estrellas)
            </label>
            <div className="mt-2 flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-2xl transition transform hover:scale-110"
                >
                  <span className={rating >= star ? "text-amber-500" : "text-surface-line"}>
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-caption font-bold uppercase tracking-wider text-ink-muted">
              Comentario público para su perfil
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 w-full rounded-xl border border-surface-line bg-surface-muted/30 p-2.5 text-xs text-ink focus:border-success focus:outline-none"
            />
          </div>

          <div className="rounded-lg bg-emerald-50 p-2.5 text-[11px] text-emerald-800">
            🔒 Al confirmar, los fondos en custodia se transfieren de forma definitiva al estudiante.
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              className="!bg-success hover:!bg-success-hover text-white"
            >
              Liberar S/ {order.amount.toFixed(2)} y publicar reseña
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
