import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Field, Input } from "./Field";
import type { Talent, ServiceOffering } from "../data";
import { useAppState } from "../state";

type ContactModalProps = {
  talent: Talent;
  initialService?: ServiceOffering | null;
  onClose: () => void;
};

export function ContactModal({ talent, initialService, onClose }: ContactModalProps) {
  const { clientName, setClientName } = useAppState();
  const [email, setEmail] = useState("");
  const [taskDetail, setTaskDetail] = useState(
    initialService
      ? `Hola ${talent.name.split(" ")[0]}, me interesa cotizar el servicio "${initialService.title}".`
      : `Hola ${talent.name.split(" ")[0]}, vi tu perfil en Jale.pe y me gustaría cotizar un trabajo de ${talent.category.toLowerCase()}.`
  );
  const [budget, setBudget] = useState(
    initialService ? `S/ ${initialService.priceFrom}` : `S/ ${talent.priceFrom}`
  );
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {sent ? (
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-soft text-success">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <Badge tone="success" dot className="mt-4">
              Solicitud de contacto enviada
            </Badge>

            <h3 className="mt-2 font-display text-display-md text-ink">
              {talent.name} responderá pronto
            </h3>

            <p className="mt-2 text-body-sm text-ink-muted">
              Le avisamos a su correo y WhatsApp universitario. El pago queda 100% protegido en
              escrow hasta que apruebes la entrega.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Button
                fullWidth
                variant="primary"
                onClick={() => {
                  onClose();
                  navigate(`/chat/${talent.id}`);
                }}
              >
                Abrir chat con {talent.name.split(" ")[0]} 💬
              </Button>
              <Button variant="tertiary" fullWidth onClick={onClose}>
                Seguir explorando
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-caption font-semibold uppercase tracking-wider text-secondary">
                  Sin registro previo · Cotización directa
                </p>
                <h3 className="mt-1 font-display text-title text-ink">
                  Escribe a {talent.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1 text-ink-faint hover:bg-surface-muted hover:text-ink"
              >
                ✕
              </button>
            </div>

            {/* Quick Profile Summary */}
            <div className="mt-3.5 flex items-center gap-3 rounded-xl bg-surface-muted p-3">
              <img
                src={talent.avatarUrl}
                alt={talent.name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-primary"
              />
              <div className="min-w-0 flex-1">
                <p className="font-display text-xs font-bold text-ink">
                  {talent.name} · {talent.university}
                </p>
                <p className="text-[11px] text-ink-muted">
                  {talent.career} · Tarifa base: Desde S/ {talent.priceFrom}
                </p>
              </div>
              <Badge tone="success" size="sm" dot>
                En línea
              </Badge>
            </div>

            {/* Form */}
            <form className="mt-4 space-y-3" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Tu nombre / Negocio">
                  <Input
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. Rosa Mendoza (Cevichería)"
                  />
                </Field>
                <Field label="Correo de contacto">
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rosa@gmail.com"
                  />
                </Field>
              </div>

              <Field label="Presupuesto aproximado">
                <Input
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Ej. S/ 50 - S/ 100"
                />
              </Field>

              <Field label="Detalle de lo que necesitas">
                <textarea
                  required
                  rows={3}
                  value={taskDetail}
                  onChange={(e) => setTaskDetail(e.target.value)}
                  className="w-full rounded-xl border border-surface-line bg-white p-3 text-body-sm text-ink placeholder:text-ink-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </Field>

              {/* Escrow Guarantee Notice */}
              <div className="flex items-center gap-2 rounded-lg bg-success-soft/70 px-3 py-2 text-[11px] text-success-hover">
                <span>🛡️</span>
                <span>
                  <strong>Escrow Jale.pe:</strong> No se realiza ningún cobro hasta que acuerden el alcance formal.
                </span>
              </div>

              <div className="pt-2">
                <Button type="submit" loading={loading} fullWidth size="lg">
                  Enviar mensaje y solicitar cotización
                </Button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-xs text-ink-faint hover:text-ink"
              >
                Cancelar y seguir navegando sin cuenta
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
