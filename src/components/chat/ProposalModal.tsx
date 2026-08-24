import { useState, type FormEvent } from "react";
import { Button } from "../Button";
import type { ProposalPayload } from "../../chatData";

type ProposalModalProps = {
  studentName: string;
  onSend: (proposal: ProposalPayload) => void;
  onClose: () => void;
};

export function ProposalModal({
  studentName,
  onSend,
  onClose,
}: ProposalModalProps) {
  const [title, setTitle] = useState("Diseño de Logo Vectorial + 3 Plantillas");
  const [price, setPrice] = useState(45);
  const [days, setDays] = useState(2);
  const [deliverablesText, setDeliverablesText] = useState(
    "Logo en SVG y PNG alta resolución\nManual de marca básico\n3 plantillas editables en Canva\nMini-sustentación grabada"
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const deliverables = deliverablesText
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    onSend({
      title,
      price: Number(price),
      turnaroundDays: Number(days),
      deliverables,
      status: "pending",
    });
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
        <div className="bg-gradient-to-r from-primary to-primary-hover p-4 text-white">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs">⚡ Generador de Propuesta Formal</span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white"
            >
              ✕
            </button>
          </div>
          <h3 className="mt-1 font-display text-title font-bold text-white">
            Nueva propuesta para el cliente
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="text-caption font-bold text-ink-muted uppercase tracking-wider">
              Título del encargo
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-surface-line bg-surface-muted/30 p-2.5 text-xs text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-caption font-bold text-ink-muted uppercase tracking-wider">
                Precio acordado (S/)
              </label>
              <input
                type="number"
                min={20}
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-surface-line bg-surface-muted/30 p-2.5 text-xs font-bold text-primary focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-caption font-bold text-ink-muted uppercase tracking-wider">
                Plazo (días hábiles)
              </label>
              <input
                type="number"
                min={1}
                max={15}
                required
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-surface-line bg-surface-muted/30 p-2.5 text-xs font-bold text-ink focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-caption font-bold text-ink-muted uppercase tracking-wider">
              Entregables (uno por línea)
            </label>
            <textarea
              rows={4}
              required
              value={deliverablesText}
              onChange={(e) => setDeliverablesText(e.target.value)}
              className="mt-1 w-full rounded-xl border border-surface-line bg-surface-muted/30 p-2.5 text-xs text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <Button fullWidth size="lg" type="submit" variant="primary">
              Enviar propuesta formal a {studentName.split(" ")[0]}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
