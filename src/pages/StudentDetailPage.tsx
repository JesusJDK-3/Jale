import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { ContactModal } from "../components/ContactModal";
import { PortfolioModal } from "../components/PortfolioModal";
import { Toast } from "../components/Toast";
import { TALENT, type Talent, type PortfolioShot, type ServiceOffering } from "../data";
import { useAppState } from "../state";

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { savedIds, toggleSaved, student: draftStudent } = useAppState();

  // Find talent by id or fallback to first student (e.g. camila)
  const talent = useMemo<Talent>(() => {
    if (!id) return TALENT[0];
    const found = TALENT.find((t) => t.id.toLowerCase() === id.toLowerCase());
    if (found) return found;

    // If viewing own draft created in onboarding
    if (draftStudent.nombre) {
      return {
        ...TALENT[0],
        id: "mi-perfil",
        name: draftStudent.nombre,
        university: draftStudent.universidad || "UTP",
        career: draftStudent.carrera || "Diseño Gráfico",
        semester: draftStudent.semestre || "7.º semestre",
        headline: "Estudiante universitario verificado en Jale.pe",
      };
    }
    return TALENT[0];
  }, [id, draftStudent]);

  // Modals and Micro-interactions state
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceOffering | null>(null);
  const [selectedShot, setSelectedShot] = useState<{
    talent: Talent;
    shot: PortfolioShot;
  } | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    visible: boolean;
    type: "saved" | "removed";
  }>({ message: "", visible: false, type: "saved" });

  const isSaved = savedIds.includes(talent.id);

  const handleToggleSave = () => {
    const isNowSaved = toggleSaved(talent.id);
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

  const handleOpenContactWithService = (service?: ServiceOffering) => {
    setSelectedService(service || null);
    setIsContactOpen(true);
  };

  return (
    <div className="min-h-screen bg-surface-muted/30 pb-28 lg:pb-16">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-surface-line/80 bg-white py-3">
        <div className="container-feed flex items-center justify-between gap-2 text-xs text-ink-muted">
          <div className="flex items-center gap-2 truncate">
            <Link to="/" className="hover:text-primary">
              Inicio
            </Link>
            <span>/</span>
            <Link to="/explorar" className="hover:text-primary">
              Explorar
            </Link>
            <span>/</span>
            <Link
              to={`/explorar?cat=${encodeURIComponent(talent.category)}`}
              className="hover:text-primary"
            >
              {talent.category}
            </Link>
            <span>/</span>
            <span className="truncate font-semibold text-ink">{talent.name}</span>
          </div>

          <button
            type="button"
            onClick={handleToggleSave}
            className="inline-flex items-center gap-1.5 rounded-pill border border-surface-line px-3 py-1 text-xs font-semibold text-ink-muted transition hover:border-primary hover:text-ink"
          >
            <svg
              className="h-3.5 w-3.5"
              fill={isSaved ? "#E11D48" : "none"}
              viewBox="0 0 24 24"
              stroke={isSaved ? "#E11D48" : "currentColor"}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{isSaved ? "Guardado" : "Guardar perfil"}</span>
          </button>
        </div>
      </div>

      <div className="container-feed pt-6 sm:pt-8">
        {/* RESPONSIVE LAYOUT: 2 Columns on Desktop, 1 Column Stacked on Mobile */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: FIXED / STICKY PROFILE CARD & TRUST SNAPSHOT (Computrabajo style) */}
          {/* ========================================================================= */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="flex flex-col overflow-hidden rounded-2xl border border-surface-line bg-white shadow-xs">
              {/* Profile Card Banner */}
              <div className="h-28 w-full bg-gradient-to-r from-primary via-primary-hover to-secondary p-4 text-white">
                <div className="flex justify-between items-start">
                  <span className="rounded-pill bg-white/20 px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-md">
                    Jale.pe Verificado
                  </span>
                  <span className="text-xs font-semibold text-white/90">
                    ID: {talent.id.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Profile Card Body */}
              <div className="relative px-6 pb-6 pt-0">
                {/* Avatar with Verified Story Ring */}
                <div className="-mt-12 flex items-end justify-between">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md ring-2 ring-primary">
                      <img
                        src={talent.avatarUrl}
                        alt={talent.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    {talent.availableNow && (
                      <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-success ring-4 ring-white" />
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-caption uppercase tracking-wider text-ink-faint">Tarifa base</p>
                    <p className="font-display text-display-md font-extrabold text-primary">
                      Desde S/ {talent.priceFrom}
                    </p>
                  </div>
                </div>

                {/* 1. HEADER: Nombre, Badge universitario, Carrera + Semestre */}
                <div className="mt-4">
                  <h1 className="font-display text-display-md text-ink">{talent.name}</h1>
                  <p className="mt-0.5 text-body-sm font-medium text-ink-muted">
                    {talent.career} · <span className="font-bold text-primary">{talent.semester}</span>
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge tone="success" dot>
                      Estudiante activo — {talent.university}
                    </Badge>
                    <Badge tone="neutral">No colegiado</Badge>
                  </div>
                </div>

                {/* Rating & Reviews Snapshot */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-muted/60 p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-500">
                      {"★★★★★".slice(0, Math.round(talent.rating))}
                    </div>
                    <span className="font-display text-sm font-extrabold text-ink">
                      {talent.rating}
                    </span>
                  </div>
                  <span className="text-xs text-ink-muted font-medium">
                    {talent.reviews} reseñas de clientes
                  </span>
                </div>

                {/* 7. ESTADO DE DISPONIBILIDAD */}
                <div className="mt-4 rounded-xl border border-surface-line bg-surface-muted/30 p-3.5 text-xs">
                  <div className="flex items-center gap-2 font-display font-bold text-ink">
                    {talent.availabilityStatus === "available" ? (
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
                      </span>
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    )}
                    <span>Disponibilidad actual</span>
                  </div>
                  <p className="mt-1.5 font-medium text-ink-muted">
                    {talent.availabilityNote}
                  </p>
                  <p className="mt-1 text-[11px] text-ink-faint">
                    ⏱️ Tiempo de respuesta promedio: <strong className="text-ink">{talent.responseTime}</strong>
                  </p>
                </div>

                {/* BOTÓN PRINCIPAL CONTACTAR (CTA Azul Primario) */}
                <div className="mt-5 space-y-2">
                  <Button
                    size="lg"
                    fullWidth
                    onClick={() => handleOpenContactWithService()}
                    className="shadow-md"
                  >
                    Contactar a {talent.name.split(" ")[0]}
                  </Button>
                  <p className="text-center text-[11px] text-ink-faint">
                    🛡️ Sin compromiso de pago inicial · Registro solo al contactar
                  </p>
                </div>

                {/* 6. SECCIÓN "VERIFICACIÓN" EN SIDEBAR (Credenciales Claras) */}
                <div className="mt-6 border-t border-surface-line pt-5">
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Credenciales Verificadas por Jale.pe
                  </h4>
                  <ul className="mt-3 space-y-2 text-xs text-ink-muted">
                    <li className="flex items-start gap-2">
                      <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-success text-[10px] font-bold text-white">
                        ✓
                      </span>
                      <span>
                        <strong>Carné Universitario / Matrícula</strong> ({talent.verifications.universidadConstancia})
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-success text-[10px] font-bold text-white">
                        ✓
                      </span>
                      <span>
                        <strong>Identidad y DNI</strong> verificado oficialmente
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-success text-[10px] font-bold text-white">
                        ✓
                      </span>
                      <span>
                        <strong>Teléfono & WhatsApp</strong> validado
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-success text-[10px] font-bold text-white">
                        ✓
                      </span>
                      <span>
                        <strong>Cuenta Escrow</strong> vinculada para retención de fondos
                      </span>
                    </li>
                  </ul>

                  <div className="mt-4 rounded-lg bg-primary-soft/60 p-3 text-[11px] text-primary">
                    <strong>Importante:</strong> El estudiante es universitario en formación (no colegiado). Tu pago se libera solo tras aprobar la entrega.
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: SCROLLABLE SECTIONS (Sobre mí, Servicios, Portafolio, Reviews) */}
          {/* ========================================================================= */}
          <main className="space-y-6">

            {/* 2. SECCIÓN: SOBRE MÍ */}
            <section className="rounded-2xl border border-surface-line bg-white p-6 shadow-xs sm:p-8">
              <div className="flex items-center gap-2.5 border-b border-surface-line pb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary font-bold">
                  👤
                </span>
                <div>
                  <h2 className="font-display text-title text-ink">Sobre mí</h2>
                  <p className="text-caption text-ink-muted">Enfoque de trabajo y metodología</p>
                </div>
              </div>

              <div className="mt-4 text-body text-ink-muted leading-relaxed">
                <p>{talent.bio}</p>
              </div>

              {/* Skills & Tools Pills */}
              <div className="mt-5 border-t border-surface-line/70 pt-4">
                <p className="text-caption font-semibold uppercase tracking-wider text-ink-faint">
                  Herramientas y conocimientos
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {talent.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-pill border border-surface-line bg-surface-muted px-3 py-1 text-xs font-semibold text-ink"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* 3. SECCIÓN: SERVICIOS Y PRECIOS (Tarjetas de precio, no tabla plana) */}
            <section className="rounded-2xl border border-surface-line bg-white p-6 shadow-xs sm:p-8">
              <div className="flex items-center justify-between border-b border-surface-line pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary font-bold">
                    💼
                  </span>
                  <div>
                    <h2 className="font-display text-title text-ink">Servicios y precios</h2>
                    <p className="text-caption text-ink-muted">Encargos específicos con tarifas base claras</p>
                  </div>
                </div>
                <Badge tone="success">Pago en Escrow</Badge>
              </div>

              {/* List of Pricing Cards */}
              <div className="mt-6 space-y-4">
                {talent.services.map((service) => (
                  <div
                    key={service.id}
                    className={[
                      "group relative rounded-xl border p-5 transition-all",
                      service.popular
                        ? "border-primary bg-primary-soft/20 shadow-xs"
                        : "border-surface-line bg-surface-muted/30 hover:border-primary/40 hover:bg-white",
                    ].join(" ")}
                  >
                    {service.popular && (
                      <span className="absolute -top-2.5 right-4 rounded-pill bg-primary px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                        Más solicitado
                      </span>
                    )}

                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div className="flex-1">
                        <h3 className="font-display text-body font-bold text-ink">
                          {service.title}
                        </h3>
                        <p className="mt-1 text-body-sm text-ink-muted">
                          {service.description}
                        </p>
                      </div>

                      <div className="text-left sm:text-right flex-shrink-0">
                        <span className="text-caption uppercase tracking-wider text-ink-faint">Precio base</span>
                        <p className="font-display text-title font-extrabold text-primary">
                          S/ {service.priceFrom}
                        </p>
                        <p className="text-xs font-semibold text-ink-muted">
                          ⏱️ Entrega: {service.deliveryDays}
                        </p>
                      </div>
                    </div>

                    {/* Deliverables Checklist */}
                    <div className="mt-4 border-t border-surface-line/70 pt-3">
                      <p className="text-caption font-bold text-ink">Incluye en la entrega:</p>
                      <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2 text-body-sm text-ink-muted">
                        {service.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-success text-[10px] font-bold text-white">
                              ✓
                            </span>
                            <span className="text-xs">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button to quote this exact service */}
                    <div className="mt-4 flex justify-end">
                      <Button
                        size="sm"
                        variant={service.popular ? "primary" : "secondary"}
                        onClick={() => handleOpenContactWithService(service)}
                      >
                        Cotizar este servicio →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. SECCIÓN: PORTAFOLIO (Grid de hasta 5 proyectos estilo galería) */}
            <section className="rounded-2xl border border-surface-line bg-white p-6 shadow-xs sm:p-8">
              <div className="flex items-center justify-between border-b border-surface-line pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary font-bold">
                    🖼️
                  </span>
                  <div>
                    <h2 className="font-display text-title text-ink">Portafolio verificado</h2>
                    <p className="text-caption text-ink-muted">Muestras de trabajos reales entregados</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-ink-faint">
                  {talent.portfolio.length} proyectos
                </span>
              </div>

              {/* Gallery Grid (Up to 5 square / card items) */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {talent.portfolio.map((shot) => (
                  <div
                    key={shot.id}
                    onClick={() => setSelectedShot({ talent, shot })}
                    className="group cursor-pointer overflow-hidden rounded-xl border border-surface-line bg-white shadow-xs transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                  >
                    {/* Square Graphic Mockup */}
                    <div
                      className={[
                        "relative aspect-square w-full p-4 text-white bg-gradient-to-br flex flex-col justify-between transition-transform group-hover:scale-[1.02]",
                        shot.gradient,
                      ].join(" ")}
                    >
                      <div className="flex justify-between items-start">
                        <span className="rounded-pill bg-black/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                          {shot.tag}
                        </span>
                        <span className="rounded-md bg-white/20 p-1 backdrop-blur-sm">
                          🔍
                        </span>
                      </div>

                      <div className="my-auto text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/30">
                          <span
                            className="font-display text-base font-extrabold"
                            style={{ color: shot.accentColor }}
                          >
                            {shot.tag.slice(0, 3).toUpperCase()}
                          </span>
                        </div>
                        <h4 className="mt-2 line-clamp-2 font-display text-xs font-bold leading-snug">
                          {shot.title}
                        </h4>
                      </div>

                      <div className="flex justify-between text-[10px] text-white/80">
                        <span>{shot.category}</span>
                        <span className="font-semibold text-white underline">Ver detalle</span>
                      </div>
                    </div>

                    {/* Card Footer info */}
                    <div className="p-3">
                      <p className="truncate font-display text-xs font-bold text-ink">
                        {shot.title}
                      </p>
                      <p className="text-[11px] text-ink-muted">
                        ⏱️ Entrega: {shot.timeSpent || "3 días"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. SECCIÓN: REVIEWS (Opiniones de clientes con estrellas) */}
            <section className="rounded-2xl border border-surface-line bg-white p-6 shadow-xs sm:p-8">
              <div className="flex items-center justify-between border-b border-surface-line pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary font-bold">
                    ⭐
                  </span>
                  <div>
                    <h2 className="font-display text-title text-ink">Opiniones y calificaciones</h2>
                    <p className="text-caption text-ink-muted">Experiencias de clientes que contrataron con Escrow</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-1.5 text-amber-700">
                  <span className="font-display text-title font-extrabold">★ {talent.rating}</span>
                  <span className="text-xs font-medium">({talent.reviews} reviews)</span>
                </div>
              </div>

              {/* Reviews List ordered by most recent */}
              <div className="mt-6 divide-y divide-surface-line space-y-5">
                {talent.reviewsList.map((rev) => (
                  <div key={rev.id} className="pt-5 first:pt-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-body-sm font-bold text-ink">
                            {rev.author}
                          </span>
                          <Badge tone="success" size="sm" dot>
                            Cliente verificado
                          </Badge>
                        </div>
                        <p className="text-caption text-ink-faint">{rev.business}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-amber-500 text-sm">
                          {"★★★★★".slice(0, rev.rating)}
                        </div>
                        <span className="text-[11px] text-ink-faint">{rev.date}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 rounded-lg bg-surface-muted/50 p-3 text-body-sm text-ink-muted">
                      <p>“{rev.comment}”</p>
                    </div>

                    <p className="mt-2 text-[11px] text-ink-faint">
                      Servicio contratado: <span className="font-semibold text-ink">{rev.serviceTitle}</span>
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* STICKY BOTTOM BAR ON MOBILE (Easy CTA Access) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-surface-line bg-white/95 p-4 backdrop-blur-md lg:hidden shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-ink-faint">Desde</span>
            <p className="font-display text-title font-extrabold text-primary">
              S/ {talent.priceFrom}
            </p>
          </div>

          <Button
            fullWidth
            size="lg"
            onClick={() => handleOpenContactWithService()}
          >
            Contactar a {talent.name.split(" ")[0]}
          </Button>
        </div>
      </div>

      {/* Modals & Micro-interactions */}
      {isContactOpen && (
        <ContactModal
          talent={talent}
          initialService={selectedService}
          onClose={() => {
            setIsContactOpen(false);
            setSelectedService(null);
          }}
        />
      )}

      {selectedShot && (
        <PortfolioModal
          talent={selectedShot.talent}
          shot={selectedShot.shot}
          onClose={() => setSelectedShot(null)}
          onContact={() => {
            setSelectedShot(null);
            setIsContactOpen(true);
          }}
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
