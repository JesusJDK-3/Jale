import { useState, type FormEvent } from "react";
import { Button } from "../Button";

type RevisionModalProps = {
  studentName: string;
  revisionNumber: number;
  maxRevisions: number;
  onSubmit: (feedbackText: string) => void;
  onClose: () => void;
};

export function RevisionModal({
  studentName,
  revisionNumber,
  maxRevisions,
  onSubmit,
  onClose,
}: RevisionModalProps) {
  const [feedback, setFeedback] = useState(
    "Hola Camila, me gustó mucho la propuesta general. ¿Podrías ajustar el color del isotipo para que el ají tenga un tono más anaranjado y la tipografía sea un poco más gruesa?"
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    onSubmit(feedback.trim());
    onClose();
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
        <div className="bg-amber-500 p-4 text-white">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs">
              ⚠️ Solicitud de Ajustes ({revisionNumber} de {maxRevisions})
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white"
            >
              ✕
            </button>
          </div>
          <h3 className="mt-1 font-display text-title font-bold text-white">
            Indica los cambios que necesitas
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <p className="text-ink-muted leading-relaxed">
            Explica con claridad a <strong>{studentName.split(" ")[0]}</strong> qué ajustes deseas en los archivos entregados. Tienes derecho a {maxRevisions} rondas de corrección incluidas sin costo extra.
          </p>

          <div>
            <label className="text-caption font-bold text-ink-muted uppercase tracking-wider">
              Detalle de correcciones
            </label>
            <textarea
              rows={4}
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Ej. Cambiar el color secundario, ajustar texto en la lámina 2..."
              className="mt-1 w-full rounded-xl border border-surface-line bg-surface-muted/30 p-3 text-xs text-ink focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="rounded-lg bg-amber-50 p-2.5 text-[11px] text-amber-800">
            🔒 <strong>Recordatorio Escrow:</strong> Tus fondos continúan 100% retenidos mientras el estudiante realiza los ajustes solicitados.
          </div>

          <div className="pt-2">
            <Button
              fullWidth
              size="lg"
              type="submit"
              className="!bg-amber-600 hover:!bg-amber-700 text-white"
            >
              Enviar solicitud de ajustes al chat
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
