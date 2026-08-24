import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { PortfolioModal } from "../components/PortfolioModal";
import { ContactModal } from "../components/ContactModal";
import { StoriesBar } from "../components/StoriesBar";
import { TalentCard } from "../components/TalentCard";
import { Toast } from "../components/Toast";
import { CATEGORIES, REVIEWS, TALENT, POPULAR_SEARCH_SUGGESTIONS, type Talent, type PortfolioShot } from "../data";
import { useAppState } from "../state";

const steps = [
  {
    n: "01",
    title: "Publica o busca en el feed",
    text: "Explora como en Instagram pero con datos de servicio: carrera, universidad, portafolio cuadrado y tarifa clara.",
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
  const [searchQuery, setSearchQuery] = useState("");
  const { savedIds, toggleSaved } = useAppState();

  const [contactTalent, setContactTalent] = useState<Talent | null>(null);
  const [selectedShot, setSelectedShot] = useState<{
    talent: Talent;
    shot: PortfolioShot;
  } | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    visible: boolean;
    type: "saved" | "removed";
  }>({ message: "", visible: false, type: "saved" });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explorar?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/explorar");
    }
  };

  const handleToggleSave = (id: string) => {
    const isNowSaved = toggleSaved(id);
    setToast({
      message: isNowSaved
        ? "❤️ Guardado en tus favoritos"
        : "Eliminado de tus favoritos",
      visible: true,
      type: isNowSaved ? "saved" : "removed",
    });
    window.setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2500);
  };

  // Preview featured talents for home feed
  const featuredTalents = TALENT.slice(0, 4);

  return (
    <div>
      {/* HERO SECTION WITH SEARCH & INSTAGRAM STORIES */}
      <section className="border-b border-surface-line bg-gradient-to-b from-primary-soft/60 via-white to-surface-muted/30 py-10 lg:py-16">
        <div className="container-feed">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2">
              <Badge tone="primary" dot>
                Estudiantes universitarios verificados
              </Badge>
              <Badge tone="success">
                🛡️ Pago en Escrow
              </Badge>
            </div>

            <h1 className="mt-4 font-display text-display-lg sm:text-display-xl text-ink">
              Contrata talento universitario con la confianza de un Marketplace
            </h1>

            <p className="mt-3 text-body text-ink-muted sm:text-body-lg">
              Diseño gráfico, desarrollo web, marketing, administración e idiomas.
              Sin registro previo: explora portafolios en formato grid y contacta en segundos.
            </p>

            {/* PROMINENT SEARCH INPUT WITH POPULAR TAGS */}
            <form
              onSubmit={handleSearchSubmit}
              className="mx-auto mt-7 flex max-w-2xl flex-col gap-2 rounded-2xl border border-surface-line bg-white p-2.5 shadow-lg sm:flex-row sm:items-center sm:gap-0"
            >
              <div className="relative flex-1">
                <svg
                  className="absolute left-3.5 top-3.5 h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="¿Qué servicio buscas? Ej. Diseñador de logo, clases de inglés..."
                  className="w-full rounded-xl bg-transparent py-2.5 pl-11 pr-4 text-body-sm text-ink placeholder:text-ink-faint focus:outline-none"
                />
              </div>
              <Button type="submit" size="md" className="sm:px-6">
                Buscar talento
              </Button>
            </form>

            {/* Quick Search Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold text-ink-faint">Populares:</span>
              {POPULAR_SEARCH_SUGGESTIONS.slice(0, 4).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => navigate(`/explorar?q=${encodeURIComponent(tag)}`)}
                  className="inline-flex items-center gap-1 rounded-pill border border-surface-line bg-white px-3 py-1 text-xs font-medium text-ink-muted shadow-xs transition hover:border-primary hover:text-primary"
                >
                  <span>🔍</span>
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* STORIES BAR COMPONENT DIRECTLY ON HOME */}
          <div className="mt-10">
            <StoriesBar
              selectedCategory="Todas"
              onSelectCategory={(cat) => navigate(`/explorar?cat=${encodeURIComponent(cat)}`)}
            />
          </div>
        </div>
      </section>

      {/* LIVE INSTAGRAM EXPLORE FEED SHOWCASE */}
      <section className="py-12 lg:py-16">
        <div className="container-feed">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-caption font-semibold uppercase tracking-wider text-primary">
                Feed en tiempo real
              </p>
              <h2 className="font-display text-display-md sm:text-display-lg text-ink">
                Estudiantes destacados listos para trabajar
              </h2>
              <p className="mt-1 text-body-sm text-ink-muted">
                Portafolio en miniaturas 1:1, calificaciones verificadas y tarifas por encargo.
              </p>
            </div>
            <Button
              variant="tertiary"
              onClick={() => navigate("/explorar")}
              className="self-start sm:self-auto"
            >
              Ver todos los perfiles →
            </Button>
          </div>

          {/* Responsive 2-col (mobile) to 4-col (desktop) grid */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {featuredTalents.map((talent) => (
              <TalentCard
                key={talent.id}
                talent={talent}
                isSaved={savedIds.includes(talent.id)}
                onToggleSave={handleToggleSave}
                onContact={(t) => setContactTalent(t)}
                onOpenShot={(t, shot) => setSelectedShot({ talent: t, shot })}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              size="lg"
              onClick={() => navigate("/explorar")}
              className="px-8"
            >
              Explorar todo el catálogo universitario ({TALENT.length}+ talentos)
            </Button>
          </div>
        </div>
      </section>

      {/* CATEGORIES DETAILED GRID */}
      <section id="categorias" className="bg-surface-muted/40 py-14 lg:py-20">
        <div className="container-jale">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-display-md text-ink">Cinco oficios, un mismo estándar</h2>
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
                className="group rounded-xl border border-surface-line bg-white p-5 text-left shadow-xs transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-soft font-display text-base font-bold text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {cat.id === "diseno" && "🎨"}
                  {cat.id === "web" && "💻"}
                  {cat.id === "marketing" && "🚀"}
                  {cat.id === "admin" && "📊"}
                  {cat.id === "idiomas" && "🌐"}
                </span>
                <p className="mt-4 font-display text-body font-bold text-ink">{cat.title}</p>
                <p className="mt-1 text-body-sm text-ink-muted">{cat.blurb}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="py-14 lg:py-20">
        <div className="container-jale">
          <h2 className="font-display text-display-md text-ink">Cómo funciona</h2>
          <p className="mt-2 max-w-2xl text-body text-ink-muted">
            El estudiante practica presentar su trabajo. El cliente compra con red de seguridad. Los
            dos saben cuándo se suelta el dinero.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <article key={step.n} className="rounded-xl border border-surface-line/80 bg-white p-5 shadow-xs">
                <p className="font-display text-title text-primary">{step.n}</p>
                <h3 className="mt-2 font-display text-body font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-body-sm text-ink-muted">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-surface-muted/40 py-14 lg:py-20">
        <div className="container-jale">
          <h2 className="font-display text-display-md text-ink">Lo dicen quienes ya jalaron un encargo</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {REVIEWS.map((review) => (
              <blockquote key={review.name} className="rounded-xl border border-surface-line bg-white p-6 shadow-xs">
                <div className="mb-3 text-secondary" aria-hidden>
                  ★★★★★
                </div>
                <p className="text-body text-ink-muted">“{review.quote}”</p>
                <footer className="mt-4 border-t border-surface-line pt-3">
                  <p className="font-display text-body-sm font-bold text-ink">{review.name}</p>
                  <p className="text-caption text-ink-faint">{review.meta}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOOTER BANNER */}
      <section className="pb-16 pt-8">
        <div className="container-jale">
          <div className="rounded-2xl bg-ink px-6 py-10 text-white sm:px-10 lg:flex lg:items-center lg:justify-between shadow-xl">
            <div className="max-w-xl">
              <Badge tone="secondary" dot>
                Emprende y contrata seguro
              </Badge>
              <h2 className="mt-3 font-display text-display-md text-white">
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

      {/* Modals & Micro-interactions */}
      {contactTalent && (
        <ContactModal
          talent={contactTalent}
          onClose={() => setContactTalent(null)}
        />
      )}

      {selectedShot && (
        <PortfolioModal
          talent={selectedShot.talent}
          shot={selectedShot.shot}
          onClose={() => setSelectedShot(null)}
          onContact={(t) => setContactTalent(t)}
        />
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        type={toast.type}
      />
    </div>
  );
}

