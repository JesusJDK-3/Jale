import { useState } from "react";
import { Badge } from "../Badge";
import { Button } from "../Button";
import type { ChatMessage, DeliveryPayload, ProposalPayload, ReviewPayload } from "../../chatData";

type ChatMessageItemProps = {
  message: ChatMessage;
  studentName: string;
  onAcceptProposal?: (proposal: ProposalPayload) => void;
  onOpenPayment?: (amount: number) => void;
  onApproveDelivery?: (delivery: DeliveryPayload) => void;
  onRequestRevision?: (delivery: DeliveryPayload) => void;
  onSubmitReview?: (review: ReviewPayload) => void;
};

export function ChatMessageItem({
  message,
  studentName,
  onAcceptProposal,
  onOpenPayment,
  onApproveDelivery,
  onRequestRevision,
  onSubmitReview,
}: ChatMessageItemProps) {
  const isMe = message.sender === "me";
  const isSystem = message.sender === "system";

  // State for review form inside card
  const [rating, setRating] = useState(message.review?.rating || 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState(
    message.review?.comment ||
      `Excelente trabajo de ${studentName.split(" ")[0]}. Muy puntual, explicó cada detalle y los archivos quedaron listos para usar.`
  );

  // 1. SYSTEM BANNER MESSAGES (e.g. Escrow locked notification)
  if (isSystem && message.type === "escrow_active") {
    return (
      <div className="my-3 flex justify-center px-4">
        <div className="flex max-w-md items-center gap-2 rounded-xl border border-primary/20 bg-primary-soft/80 px-4 py-2.5 text-center text-xs text-primary shadow-xs">
          <span>🔒</span>
          <span className="font-medium leading-tight">{message.text}</span>
        </div>
      </div>
    );
  }

  // 2. PAYMENT RELEASED SYSTEM CARD (Celebration)
  if (message.type === "payout_released") {
    return (
      <div className="my-4 flex justify-center px-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-success/30 bg-emerald-50 p-5 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success text-2xl text-white shadow-sm">
            ✓
          </div>
          <Badge tone="success" className="mt-3">
            Transacción completada
          </Badge>
          <h4 className="mt-2 font-display text-body font-bold text-ink">
            ¡Pago liberado exitosamente!
          </h4>
          <p className="mt-1 text-xs text-ink-muted leading-relaxed">
            Los fondos retenidos en Escrow fueron transferidos a la cuenta universitaria de{" "}
            <strong>{studentName}</strong>. ¡Gracias por confiar en el talento joven de Jale.pe!
          </p>
          <div className="mt-3 text-[11px] text-ink-faint">
            Recibo electrónico generado · Transacción asegurada
          </div>
        </div>
      </div>
    );
  }

  // 3. REVIEW PROMPT CARD
  if (message.type === "review_prompt") {
    const isSubmitted = message.review?.submitted;
    return (
      <div className="my-4 flex justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-surface-line bg-white p-5 shadow-md">
          <div className="flex items-center gap-2 border-b border-surface-line pb-3">
            <span className="text-xl">⭐</span>
            <div>
              <h4 className="font-display text-body-sm font-bold text-ink">
                Califica tu experiencia con {studentName.split(" ")[0]}
              </h4>
              <p className="text-[11px] text-ink-muted">
                Tu opinión ayuda a otros negocios y respalda el portafolio del estudiante
              </p>
            </div>
          </div>

          {isSubmitted ? (
            <div className="mt-4 rounded-xl bg-amber-50/60 p-4 text-center">
              <div className="flex justify-center text-amber-500 text-lg">
                {"★★★★★".slice(0, message.review?.rating || 5)}
              </div>
              <p className="mt-2 text-xs font-semibold text-ink">
                “{message.review?.comment}”
              </p>
              <Badge tone="success" size="sm" dot className="mt-3">
                Reseña publicada en el perfil
              </Badge>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {/* Star selector */}
              <div className="flex items-center justify-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-2xl transition transform hover:scale-110"
                  >
                    <span
                      className={
                        (hoverRating || rating) >= star
                          ? "text-amber-500"
                          : "text-surface-line"
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Escribe un breve comentario sobre la calidad y puntualidad..."
                className="w-full rounded-xl border border-surface-line bg-surface-muted/40 p-3 text-xs text-ink placeholder:text-ink-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />

              <Button
                fullWidth
                size="sm"
                variant="primary"
                onClick={() =>
                  onSubmitReview &&
                  onSubmitReview({
                    rating,
                    comment: reviewComment,
                    submitted: true,
                  })
                }
              >
                Publicar reseña oficial (★ {rating}.0)
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. SPECIAL PROPOSAL SYSTEM CARD
  if (message.type === "proposal" && message.proposal) {
    const p = message.proposal;
    return (
      <div className="my-3 flex justify-start px-2 sm:px-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border-2 border-primary/40 bg-white shadow-md">
          {/* Proposal Header */}
          <div className="bg-gradient-to-r from-primary to-primary-hover p-4 text-white">
            <div className="flex items-center justify-between">
              <span className="rounded-pill bg-white/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                ⚡ Propuesta Formal de Servicio
              </span>
              <span className="text-xs font-semibold text-white/90">
                Jale.pe Escrow
              </span>
            </div>
            <h4 className="mt-2 font-display text-body font-bold text-white">
              {p.title}
            </h4>
          </div>

          {/* Proposal Body */}
          <div className="p-4 sm:p-5">
            {/* Price & Turnaround highlight */}
            <div className="flex items-center justify-between rounded-xl bg-surface-muted p-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-ink-faint">
                  Monto acordado
                </span>
                <p className="font-display text-title font-black text-primary">
                  S/ {p.price.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-ink-faint">
                  Plazo de entrega
                </span>
                <p className="font-display text-sm font-extrabold text-ink">
                  ⏱️ {p.turnaroundDays} días hábiles
                </p>
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div className="mt-4">
              <p className="text-caption font-bold text-ink uppercase tracking-wider">
                Entregables incluidos:
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-ink-muted">
                {p.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-success text-[10px] font-bold text-white">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Escrow Guarantee Disclaimer */}
            <div className="mt-4 rounded-lg bg-emerald-50 p-2.5 text-[11px] text-emerald-800">
              🛡️ <strong>Garantía Jale.pe:</strong> El dinero no va directo al estudiante. Queda retenido hasta que recibas y apruebes los entregables.
            </div>

            {/* Action Buttons */}
            <div className="mt-4 border-t border-surface-line pt-3">
              {p.status === "pending" ? (
                <div className="space-y-2">
                  <Button
                    fullWidth
                    size="md"
                    variant="primary"
                    onClick={() => onAcceptProposal && onAcceptProposal(p)}
                  >
                    Aceptar propuesta (S/ {p.price.toFixed(2)})
                  </Button>
                  <p className="text-center text-[10px] text-ink-faint">
                    Al aceptar, pasarás a la pasarela de custodia segura.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-lg bg-success-soft py-2 text-xs font-bold text-success-hover">
                  <span>✓ Propuesta aceptada por el cliente</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. PAYMENT GATE SYSTEM CARD
  if (message.type === "payment_gate" && message.payment) {
    const pay = message.payment;
    return (
      <div className="my-3 flex justify-start px-2 sm:px-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border-2 border-secondary/40 bg-white shadow-md">
          {/* Header */}
          <div className="bg-gradient-to-r from-secondary to-amber-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <span className="rounded-pill bg-white/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                🔒 Paso de Pago en Custodia
              </span>
              <span className="text-xs font-bold">Sin comisiones</span>
            </div>
            <h4 className="mt-1 font-display text-body font-bold text-white">
              Fondos en Custodia Escrow
            </h4>
          </div>

          <div className="p-4 sm:p-5">
            {/* Breakdown */}
            <div className="space-y-1.5 border-b border-surface-line pb-3 text-xs">
              <div className="flex justify-between text-ink-muted">
                <span>Servicio acordado</span>
                <span>S/ {pay.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>Protección Escrow Jale.pe</span>
                <span className="font-semibold text-success">Gratis (S/ 0.00)</span>
              </div>
              <div className="flex justify-between font-display text-sm font-bold text-ink pt-1.5">
                <span>Total a depositar</span>
                <span className="text-primary font-black">S/ {pay.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action */}
            <div className="mt-4">
              {pay.status === "pending" ? (
                <Button
                  fullWidth
                  size="md"
                  variant="primary"
                  onClick={() => onOpenPayment && onOpenPayment(pay.total)}
                >
                  Pagar S/ {pay.total.toFixed(2)} a través de Jale.pe
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-lg bg-success-soft py-2 text-xs font-bold text-success-hover">
                  <span>✓ Pago de S/ {pay.total.toFixed(2)} fondeado en Escrow</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. DELIVERY ATTACHMENT CARD (WhatsApp Style Document with Action Gates)
  if (message.type === "delivery" && message.delivery) {
    const d = message.delivery;
    return (
      <div className="my-3 flex justify-start px-2 sm:px-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border-2 border-primary/30 bg-white shadow-md">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-surface-line bg-surface-muted/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📦</span>
              <span className="font-display text-xs font-bold text-ink">
                Entrega Final de Trabajo
              </span>
            </div>
            <Badge tone="primary" size="sm">
              Mini-sustentación
            </Badge>
          </div>

          <div className="p-4 sm:p-5">
            {/* File Container (WhatsApp document style) */}
            <div className="flex items-center gap-3 rounded-xl border border-surface-line bg-surface-muted/40 p-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white font-display text-xs font-black shadow-xs">
                {d.fileType.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-xs font-bold text-ink">
                  {d.fileName}
                </p>
                <p className="text-[11px] text-ink-muted">{d.fileSize}</p>
              </div>
              <button
                type="button"
                onClick={() => alert(`Descargando muestra de ${d.fileName}...`)}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary hover:bg-primary hover:text-white transition shadow-xs"
                title="Descargar archivo"
              >
                ⬇️
              </button>
            </div>

            {/* Student's Mini-Sustentación Note */}
            <div className="mt-3.5 rounded-xl bg-surface-muted/60 p-3 text-xs text-ink">
              <p className="font-display text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                Explicación de entrega por {studentName.split(" ")[0]}:
              </p>
              <p className="mt-1 text-ink-muted leading-relaxed">“{d.note}”</p>
            </div>

            {/* Revisions Tracker */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-ink-faint">
              <span>Revisiones solicitadas: <strong>{d.revisionCount} de {d.maxRevisions}</strong></span>
              <span className="text-primary font-semibold">Garantía de satisfacción</span>
            </div>

            {/* Action Gate for Client: Approve or Request Changes */}
            <div className="mt-4 border-t border-surface-line pt-3">
              {d.status === "pending_review" ? (
                <div className="space-y-2">
                  <Button
                    fullWidth
                    size="md"
                    variant="primary"
                    className="!bg-success hover:!bg-success-hover"
                    onClick={() => onApproveDelivery && onApproveDelivery(d)}
                  >
                    ✓ Aprobar entrega y liberar pago
                  </Button>
                  <Button
                    fullWidth
                    size="sm"
                    variant="secondary"
                    onClick={() => onRequestRevision && onRequestRevision(d)}
                  >
                    Solicitar ajustes ({d.maxRevisions - d.revisionCount} restantes)
                  </Button>
                </div>
              ) : d.status === "approved" ? (
                <div className="flex items-center justify-center gap-2 rounded-lg bg-success-soft py-2 text-xs font-bold text-success-hover">
                  <span>✓ Entrega aprobada · Pago liberado</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-lg bg-amber-50 py-2 text-xs font-bold text-amber-700">
                  <span>⚠️ Ajustes solicitados en revisión</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 7. STANDARD TEXT MESSAGE BUBBLE (WhatsApp style)
  return (
    <div
      className={[
        "my-1.5 flex px-2 sm:px-4",
        isMe ? "justify-end" : "justify-start",
      ].join(" ")}
    >
      <div
        className={[
          "relative max-w-[85%] sm:max-w-[75%] md:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-xs text-xs sm:text-body-sm leading-relaxed",
          isMe
            ? "bg-primary text-white rounded-br-xs"
            : "bg-surface-muted text-ink rounded-bl-xs border border-surface-line/70",
        ].join(" ")}
      >
        {/* Text body */}
        <p className="whitespace-pre-wrap break-words">{message.text}</p>

        {/* Timestamp and Double Checkmark */}
        <div
          className={[
            "mt-1 flex items-center justify-end gap-1 text-[10px]",
            isMe ? "text-blue-100" : "text-ink-faint",
          ].join(" ")}
        >
          <span>{message.timestamp}</span>
          {isMe && (
            <span className="font-bold text-blue-200" title="Leído">
              ✓✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
