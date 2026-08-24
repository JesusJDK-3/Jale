import { Badge } from "../components/Badge";
import { Button } from "../components/Button";

const typeScale = [
  { name: "Display XL", className: "font-display text-display-xl", sample: "Jale.pe" },
  { name: "Display LG", className: "font-display text-display-lg", sample: "Mini-sustentación" },
  { name: "Display MD", className: "font-display text-display-md", sample: "Cómo funciona" },
  { name: "Title", className: "font-display text-title", sample: "Camila Rojas" },
  { name: "Body LG", className: "text-body-lg", sample: "Pago retenido hasta que apruebes." },
  { name: "Body", className: "text-body", sample: "Explora talento sin crear cuenta." },
  { name: "Body SM", className: "text-body-sm", sample: "Carné o constancia de matrícula." },
  { name: "Caption", className: "text-caption", sample: "24–48 h de verificación" },
];

const swatches = [
  { name: "Azul eléctrico", hex: "#2563EB", className: "bg-primary" },
  { name: "Naranja vibrante", hex: "#F97316", className: "bg-secondary" },
  { name: "Verde éxito", hex: "#22C55E", className: "bg-success" },
  { name: "Gris oscuro", hex: "#1F2937", className: "bg-ink" },
  { name: "Gris claro", hex: "#F3F4F6", className: "bg-surface-muted border border-surface-line" },
  { name: "Blanco", hex: "#FFFFFF", className: "bg-white border border-surface-line" },
];

export function DesignSystemPage() {
  return (
    <div className="container-jale space-y-14 py-12">
      <header className="max-w-2xl">
        <p className="text-caption font-semibold uppercase tracking-wider text-primary">
          Sistema de diseño
        </p>
        <h1 className="mt-2 font-display text-display-lg">Jale UI</h1>
        <p className="mt-3 text-body text-ink-muted">
          Joven, ordenado y confiable. Manrope en títulos, Inter en UI. Radios suaves, sombras
          cortas y color usado con intención: azul para acción, naranja para urgencia, verde para
          dinero y aprobación.
        </p>
      </header>

      <section>
        <h2 className="font-display text-title">Color</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {swatches.map((s) => (
            <div key={s.hex} className="overflow-hidden rounded-md border border-surface-line">
              <div className={`h-16 ${s.className}`} />
              <div className="bg-white p-3">
                <p className="text-body-sm font-medium">{s.name}</p>
                <p className="text-caption text-ink-faint">{s.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-title">Tipografía</h2>
        <p className="mt-1 text-body-sm text-ink-muted">
          Manrope 500–800 para display. Inter 400–700 para cuerpo, formularios y botones.
        </p>
        <div className="mt-4 divide-y divide-surface-line rounded-lg border border-surface-line bg-white">
          {typeScale.map((row) => (
            <div key={row.name} className="grid gap-2 px-4 py-4 sm:grid-cols-[140px_1fr]">
              <p className="text-caption font-semibold uppercase tracking-wide text-ink-faint">
                {row.name}
              </p>
              <p className={row.className}>{row.sample}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-title">Espaciado y forma</h2>
          <ul className="mt-3 space-y-2 text-body-sm text-ink-muted">
            <li>Base 4 px · ritmo 8 / 12 / 16 / 24 / 32 / 48</li>
            <li>Radios: 8 botones chicos · 12 controles · 16 cards · 24 hero · pill badges</li>
            <li>Sombras xs/sm para UI, md/lg solo en hero y modales</li>
            <li>Focus: anillo azul 4 px (`shadow-focus`)</li>
          </ul>
        </div>
        <div className="flex flex-wrap items-end gap-3 rounded-lg bg-surface-muted p-6">
          <div className="h-8 w-8 rounded-sm bg-primary" />
          <div className="h-12 w-12 rounded-md bg-primary" />
          <div className="h-16 w-16 rounded-lg bg-primary" />
          <div className="h-16 w-24 rounded-xl bg-primary" />
          <div className="h-8 w-20 rounded-pill bg-primary" />
        </div>
      </section>

      <section>
        <h2 className="font-display text-title">Botones</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button>Primario</Button>
          <Button variant="secondary">Secundario</Button>
          <Button variant="tertiary">Terciario</Button>
          <Button variant="ghost">Ghost</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
        <p className="mt-3 text-caption text-ink-faint">
          Hover: un paso más oscuro. Disabled: gris #E5E7EB, sin sombra. Loading: spinner + “Cargando…”.
        </p>
      </section>

      <section>
        <h2 className="font-display text-title">Badges</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="success" dot>
            Estudiante activo — UTP
          </Badge>
          <Badge>No colegiado</Badge>
          <Badge tone="warning" dot>
            En verificación (24–48 h)
          </Badge>
          <Badge tone="primary">Escrow activo</Badge>
          <Badge tone="secondary">Urgente</Badge>
          <Badge tone="success">Pago liberado</Badge>
        </div>
      </section>
    </div>
  );
}
