import { useMemo, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Field, Input } from "../components/Field";
import { CATEGORIES, TALENT, type Talent } from "../data";
import { useAppState } from "../state";

export function ExplorePage() {
  const [params] = useSearchParams();
  const initialCat = params.get("cat") ?? "Todas";
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState(initialCat);
  const [contact, setContact] = useState<Talent | null>(null);

  const list = useMemo(() => {
    return TALENT.filter((t) => {
      const matchCat = cat === "Todas" || t.category === cat;
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.headline.toLowerCase().includes(q) ||
        t.university.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [cat, query]);

  return (
    <div className="container-jale py-10 lg:py-14">
      <p className="text-caption font-semibold uppercase tracking-wider text-primary">
        Explorar sin cuenta
      </p>
      <h1 className="mt-2 font-display text-display-md">Talento universitario verificado</h1>
      <p className="mt-2 max-w-2xl text-body text-ink-muted">
        Mira perfiles, tarifas y universidades. El registro del cliente aparece solo cuando
        presionas Contactar.
      </p>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca por nombre, universidad o servicio"
          aria-label="Buscar talento"
        />
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {["Todas", ...CATEGORIES.map((c) => c.title)].map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setCat(name)}
            className={[
              "whitespace-nowrap rounded-pill px-3 py-1.5 text-body-sm font-medium",
              cat === name ? "bg-primary text-white" : "bg-surface-muted text-ink-muted",
            ].join(" ")}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((talent) => (
          <article
            key={talent.id}
            className="flex flex-col rounded-lg border border-surface-line bg-white p-5 shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-display text-title">{talent.name}</h2>
                <p className="text-body-sm text-ink-muted">
                  {talent.career} · {talent.university}
                </p>
              </div>
              <Badge tone="success" dot>
                Estudiante activo — {talent.university}
              </Badge>
            </div>
            <p className="mt-3 flex-1 text-body-sm text-ink-muted">{talent.headline}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>No colegiado</Badge>
              <Badge tone="primary">{talent.rate}</Badge>
              <Badge tone="neutral">
                ★ {talent.rating} · {talent.reviews} reviews
              </Badge>
            </div>
            <Button className="mt-5" fullWidth onClick={() => setContact(talent)}>
              Contactar
            </Button>
          </article>
        ))}
      </div>

      {contact && (
        <ContactGate talent={contact} onClose={() => setContact(null)} />
      )}
    </div>
  );
}

function ContactGate({ talent, onClose }: { talent: Talent; onClose: () => void }) {
  const { clientName, setClientName } = useAppState();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-labelledby="contact-title"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {sent ? (
          <>
            <Badge tone="success" dot>
              Mensaje en camino
            </Badge>
            <h2 id="contact-title" className="mt-3 font-display text-title">
              {talent.name} recibirá tu pedido
            </h2>
            <p className="mt-2 text-body-sm text-ink-muted">
              Cuando acepten, el pago se retiene en escrow hasta que apruebes la mini-sustentación.
            </p>
            <div className="mt-6 flex gap-3">
              <Button onClick={onClose}>Seguir explorando</Button>
              <Button variant="tertiary" onClick={() => navigate("/")}>
                Inicio
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-caption font-semibold uppercase tracking-wide text-secondary">
              Registro solo para contactar
            </p>
            <h2 id="contact-title" className="mt-1 font-display text-title">
              Escribe a {talent.name}
            </h2>
            <p className="mt-2 text-body-sm text-ink-muted">
              Hasta ahora no pedimos cuenta. Para enviar el mensaje, deja nombre y correo.
            </p>
            <form className="mt-5 space-y-3" onSubmit={onSubmit}>
              <Field label="Tu nombre">
                <Input
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Rosa Mendoza"
                />
              </Field>
              <Field label="Correo">
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rosa@mype.pe"
                />
              </Field>
              <Field label="Qué necesitas">
                <Input required defaultValue={`Hola ${talent.name.split(" ")[0]}, vi tu perfil de ${talent.category.toLowerCase()} y quiero cotizar.`} />
              </Field>
              <div className="flex gap-3 pt-2">
                <Button type="submit" loading={loading} fullWidth>
                  Crear cuenta y enviar
                </Button>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-body-sm text-ink-faint hover:text-ink"
              >
                Seguir mirando sin registrarme
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
