import { useNavigate } from "react-router-dom";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { CATEGORIES, REVIEWS } from "../data";

const steps = [
  {
    n: "01",
    title: "Publica o busca",
    text: "El cliente describe el encargo. El estudiante muestra su carrera, universidad y trabajos.",
  },
  {
    n: "02",
    title: "Acuerdan alcance",
    text: "Precio, plazos y entregables quedan por escrito. Nada de “me avisas por WhatsApp y ya”.",
  },
  {
    n: "03",
    title: "Pago en escrow",
    text: "El dinero se retiene en Jale.pe. Nadie lo toca hasta que el cliente aprueba el trabajo.",
  },
  {
    n: "04",
    title: "Mini-sustentación",
    text: "El estudiante presenta el resultado como en la universidad: qué hizo, por qué y cómo ajustarlo.",
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      <section className="border-b border-surface-line bg-gradient-to-b from-primary-soft/70 to-white">
        <div className="container-jale grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div>
            <Badge tone="primary" dot>
              Estudiantes verificados · pago retenido
            </Badge>
            <h1 className="mt-4 font-display text-display-lg lg:text-display-xl">
              Tu mini-sustentación, pero con clientes reales.
            </h1>
            <p className="mt-4 max-w-xl text-body-lg text-ink-muted">
              Jale.pe conecta a universitarios y recién egresados (18–26) con MYPES que necesitan
              diseño, web, marketing, administración e idiomas. El cliente no paga a ciegas: el
              dinero queda en escrow hasta aprobar el trabajo.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => navigate("/onboarding")}>
                Soy estudiante
              </Button>
              <Button size="lg" variant="tertiary" onClick={() => navigate("/explorar")}>
                Busco un servicio
              </Button>
            </div>
            <p className="mt-4 text-caption text-ink-faint">
              Puedes explorar talento sin cuenta. El registro del cliente aparece solo al contactar.
            </p>
          </div>

          <div className="relative">
            <div className="rounded-xl bg-white p-5 shadow-lg sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-title">Camila Rojas</p>
                  <p className="text-body-sm text-ink-muted">Diseño gráfico · 7.º semestre</p>
                </div>
                <Badge tone="success" dot>
                  Estudiante activa — UTP
                </Badge>
              </div>
              <p className="mt-4 text-body text-ink-muted">
                “Te muestro 3 caminos de marca, te explico el criterio y dejamos una versión lista
                para imprimir y redes.”
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge>No colegiada</Badge>
                <Badge tone="primary">S/ 45 /h</Badge>
                <Badge tone="secondary">Escrow activo</Badge>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 rounded-lg bg-surface-muted p-4 text-center">
                <div>
                  <p className="font-display text-title">4.9</p>
                  <p className="text-caption text-ink-faint">Rating</p>
                </div>
                <div>
                  <p className="font-display text-title">18</p>
                  <p className="text-caption text-ink-faint">Reviews</p>
                </div>
                <div>
                  <p className="font-display text-title">24–48h</p>
                  <p className="text-caption text-ink-faint">Verificación</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 right-4 hidden rounded-md bg-success px-3 py-2 text-caption font-semibold text-white shadow-md sm:block">
              Pago liberado · cliente aprobó
            </div>
          </div>
        </div>
      </section>

      <section id="categorias" className="py-14 lg:py-20">
        <div className="container-jale">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-display-md">Cinco oficios, un mismo estándar</h2>
              <p className="mt-2 max-w-xl text-body text-ink-muted">
                No es un tablón de anuncios. Cada categoría tiene estudiantes con carné validado y
                entregables claros.
              </p>
            </div>
            <Button variant="ghost" onClick={() => navigate("/explorar")}>
              Ver todos →
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => navigate(`/explorar?cat=${encodeURIComponent(cat.title)}`)}
                className="rounded-lg border border-surface-line bg-white p-5 text-left shadow-xs transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-soft font-display text-sm font-bold text-primary">
                  {cat.icon}
                </span>
                <p className="mt-4 font-display text-body font-bold">{cat.title}</p>
                <p className="mt-1 text-body-sm text-ink-muted">{cat.blurb}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-surface-muted py-14 lg:py-20">
        <div className="container-jale">
          <h2 className="font-display text-display-md">Cómo funciona</h2>
          <p className="mt-2 max-w-2xl text-body text-ink-muted">
            El estudiante practica presentar su trabajo. El cliente compra con red de seguridad. Los
            dos saben cuándo se suelta el dinero.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <article key={step.n} className="rounded-lg bg-white p-5 shadow-xs">
                <p className="font-display text-title text-primary">{step.n}</p>
                <h3 className="mt-2 font-display text-body font-bold">{step.title}</h3>
                <p className="mt-2 text-body-sm text-ink-muted">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container-jale">
          <h2 className="font-display text-display-md">Lo dicen quienes ya jalaron un encargo</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {REVIEWS.map((review) => (
              <blockquote key={review.name} className="rounded-lg border border-surface-line p-6">
                <div className="mb-3 text-secondary" aria-hidden>
                  ★★★★★
                </div>
                <p className="text-body text-ink-muted">“{review.quote}”</p>
                <footer className="mt-4">
                  <p className="font-medium text-ink">{review.name}</p>
                  <p className="text-caption text-ink-faint">{review.meta}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-jale">
          <div className="rounded-xl bg-ink px-6 py-10 text-white sm:px-10 lg:flex lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-display-md text-white">
                Empieza por el lado que te toca
              </h2>
              <p className="mt-2 text-body text-white/75">
                Estudiantes verificados en 24–48 h. Clientes exploran gratis y se registran solo al
                escribirle a alguien.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
              <Button size="lg" onClick={() => navigate("/onboarding")}>
                Soy estudiante
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/explorar")}
              >
                Busco un servicio
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
