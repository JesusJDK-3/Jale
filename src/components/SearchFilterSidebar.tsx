import { CATEGORIES, UNIVERSITIES, POPULAR_SEARCH_SUGGESTIONS } from "../data";
import { Button } from "./Button";

export type FilterState = {
  query: string;
  category: string;
  maxPrice: number; // 0 = unlimited, or 30, 45, 60, 80, 100
  university: string;
  minRating: number;
  availableOnly: boolean;
  sortBy: "featured" | "rating" | "price_asc" | "reviews";
};

type SearchFilterSidebarProps = {
  filters: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
  totalResults: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
};

const PRICE_OPTIONS = [
  { label: "Todos", value: 0 },
  { label: "Hasta S/ 35", value: 35 },
  { label: "Hasta S/ 50", value: 50 },
  { label: "Hasta S/ 70", value: 70 },
];

const RATING_OPTIONS = [
  { label: "Cualquiera", value: 0 },
  { label: "★ 4.5+", value: 4.5 },
  { label: "★ 4.8+", value: 4.8 },
  { label: "★ 5.0", value: 5.0 },
];

export function SearchFilterSidebar({
  filters,
  onChange,
  onReset,
  totalResults,
  isMobileOpen = false,
  onCloseMobile,
}: SearchFilterSidebarProps) {
  const activeFiltersCount =
    (filters.query ? 1 : 0) +
    (filters.category !== "Todas" ? 1 : 0) +
    (filters.maxPrice > 0 ? 1 : 0) +
    (filters.university !== "Todas" ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.availableOnly ? 1 : 0);

  const content = (
    <div className="flex flex-col gap-6">
      {/* Header with Title and Reset */}
      <div className="flex items-center justify-between border-b border-surface-line pb-4">
        <div>
          <h3 className="font-display text-title text-ink">Filtros de Búsqueda</h3>
          <p className="text-caption text-ink-muted">
            {totalResults} {totalResults === 1 ? "estudiante verificado" : "estudiantes verificados"}
          </p>
        </div>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-primary hover:text-primary-hover hover:underline"
          >
            Limpiar ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* 1. Quick Search Box */}
      <div>
        <label htmlFor="search-input" className="block font-display text-body-sm font-bold text-ink">
          ¿Qué encargo necesitas?
        </label>
        <div className="relative mt-2">
          <input
            id="search-input"
            type="text"
            value={filters.query}
            onChange={(e) => onChange({ query: e.target.value })}
            placeholder="Ej: diseñador de logo, página web, inglés..."
            className="w-full rounded-xl border border-surface-line bg-surface-muted/60 px-3.5 py-2.5 pl-10 text-body-sm text-ink placeholder:text-ink-faint focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <svg
            className="absolute left-3.5 top-3 h-4 w-4 text-ink-faint"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {filters.query && (
            <button
              type="button"
              onClick={() => onChange({ query: "" })}
              className="absolute right-3 top-2.5 text-xs text-ink-faint hover:text-ink"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick popular tags */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {POPULAR_SEARCH_SUGGESTIONS.slice(0, 4).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onChange({ query: tag })}
              className={[
                "rounded-pill px-2.5 py-1 text-[11px] font-medium transition",
                filters.query.toLowerCase() === tag
                  ? "bg-primary text-white"
                  : "bg-surface-muted text-ink-muted hover:bg-surface-line hover:text-ink",
              ].join(" ")}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Switch: Disponible Ahora (⚡ Instant feedback) */}
      <div className="rounded-xl border border-surface-line bg-surface-muted/30 p-3.5">
        <label className="flex cursor-pointer items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
            </span>
            <div>
              <p className="font-display text-body-sm font-bold text-ink">Disponible ahora</p>
              <p className="text-[11px] text-ink-muted">Responde en menos de 1 hora</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={filters.availableOnly}
            onChange={(e) => onChange({ availableOnly: e.target.checked })}
            className="h-5 w-5 rounded border-surface-line text-primary focus:ring-primary"
          />
        </label>
      </div>

      {/* 3. Category Filter */}
      <div>
        <label className="block font-display text-body-sm font-bold text-ink">Categoría</label>
        <div className="mt-2 space-y-1">
          {["Todas", ...CATEGORIES.map((c) => c.title)].map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChange({ category: cat })}
                className={[
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-body-sm transition",
                  isSelected
                    ? "bg-primary-soft font-semibold text-primary"
                    : "text-ink-muted hover:bg-surface-muted hover:text-ink",
                ].join(" ")}
              >
                <span>{cat}</span>
                {isSelected && <span className="text-primary">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Price Limit */}
      <div>
        <label className="block font-display text-body-sm font-bold text-ink">
          Presupuesto base
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {PRICE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ maxPrice: opt.value })}
              className={[
                "rounded-lg border px-3 py-2 text-xs font-semibold transition",
                filters.maxPrice === opt.value
                  ? "border-primary bg-primary-soft text-primary shadow-xs"
                  : "border-surface-line bg-white text-ink-muted hover:border-ink-faint",
              ].join(" ")}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. University Selector */}
      <div>
        <label htmlFor="university-select" className="block font-display text-body-sm font-bold text-ink">
          Universidad
        </label>
        <select
          id="university-select"
          value={filters.university}
          onChange={(e) => onChange({ university: e.target.value })}
          className="mt-2 w-full rounded-xl border border-surface-line bg-white px-3 py-2.5 text-body-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {UNIVERSITIES.map((uni) => (
            <option key={uni} value={uni}>
              {uni === "Todas" ? "Todas las universidades" : `Universidad ${uni}`}
            </option>
          ))}
        </select>
      </div>

      {/* 6. Minimum Rating */}
      <div>
        <label className="block font-display text-body-sm font-bold text-ink">
          Calificación mínima
        </label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {RATING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ minRating: opt.value })}
              className={[
                "rounded-pill border px-3 py-1.5 text-xs font-semibold transition",
                filters.minRating === opt.value
                  ? "border-primary bg-primary text-white"
                  : "border-surface-line bg-white text-ink-muted hover:border-ink-faint",
              ].join(" ")}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 7. Sort By */}
      <div>
        <label htmlFor="sort-select" className="block font-display text-body-sm font-bold text-ink">
          Ordenar resultados por
        </label>
        <select
          id="sort-select"
          value={filters.sortBy}
          onChange={(e) =>
            onChange({
              sortBy: e.target.value as FilterState["sortBy"],
            })
          }
          className="mt-2 w-full rounded-xl border border-surface-line bg-white px-3 py-2.5 text-body-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="featured">✨ Destacados y recomendados</option>
          <option value="rating">★ Mayor calificación</option>
          <option value="price_asc">💰 Menor precio base</option>
          <option value="reviews">💬 Más valoraciones</option>
        </select>
      </div>

      {/* Escrow Trust Micro-Banner in sidebar */}
      <div className="rounded-xl bg-gradient-to-br from-primary-soft via-blue-50 to-surface-muted p-4 text-xs">
        <div className="flex items-center gap-2 font-display font-bold text-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Compra con Escrow</span>
        </div>
        <p className="mt-1.5 leading-relaxed text-ink-muted">
          No pagas a ciegas: el dinero se retiene en Jale.pe y solo se transfiere cuando apruebas el trabajo.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed / Sticky) */}
      <aside className="hidden lg:block lg:w-80 lg:flex-shrink-0">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-surface-line bg-white p-5 shadow-xs">
          {content}
        </div>
      </aside>

      {/* Mobile Drawer / Bottom Sheet */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 backdrop-blur-sm lg:hidden">
          <div className="flex max-h-[85vh] w-full flex-col rounded-t-3xl bg-white shadow-2xl">
            {/* Drawer Drag handle & Close Header */}
            <div className="flex items-center justify-between border-b border-surface-line px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-8 rounded-pill bg-surface-line" />
                <h3 className="font-display text-title text-ink">Filtros y Búsqueda</h3>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted text-ink-muted hover:text-ink"
              >
                ✕
              </button>
            </div>

            {/* Scrollable filters */}
            <div className="overflow-y-auto p-5">{content}</div>

            {/* Sticky bottom CTA */}
            <div className="border-t border-surface-line bg-white p-4">
              <Button fullWidth size="lg" onClick={onCloseMobile}>
                Ver {totalResults} resultados
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
