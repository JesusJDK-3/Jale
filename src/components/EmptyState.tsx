import { CATEGORIES, POPULAR_SEARCH_SUGGESTIONS } from "../data";
import { Button } from "./Button";

type EmptyStateProps = {
  query: string;
  onResetFilters: () => void;
  onSelectCategory: (cat: string) => void;
  onSelectQuery: (query: string) => void;
};

export function EmptyState({
  query,
  onResetFilters,
  onSelectCategory,
  onSelectQuery,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-line bg-surface-muted/40 p-8 text-center sm:p-12">
      {/* Visual icon */}
      <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-surface-line">
        <svg className="h-10 w-10 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white shadow-xs">
          0
        </span>
      </div>

      <h3 className="font-display text-display-md text-ink">
        No encontramos estudiantes con esos filtros
      </h3>

      <p className="mt-2 max-w-md text-body text-ink-muted">
        {query ? (
          <>
            No hay resultados exactos para <strong className="text-ink">"{query}"</strong> con los filtros actuales.
          </>
        ) : (
          "Prueba ajustando el rango de precio, cambiando la universidad o quitando algunos filtros."
        )}
      </p>

      {/* Action to reset */}
      <div className="mt-6">
        <Button variant="primary" onClick={onResetFilters}>
          Restablecer todos los filtros
        </Button>
      </div>

      {/* Suggested Search queries */}
      <div className="mt-8 w-full max-w-lg border-t border-surface-line pt-6">
        <p className="text-caption font-semibold uppercase tracking-wider text-ink-faint">
          Búsquedas populares sugeridas
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {POPULAR_SEARCH_SUGGESTIONS.slice(0, 5).map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => onSelectQuery(term)}
              className="inline-flex items-center gap-1.5 rounded-pill border border-surface-line bg-white px-3 py-1.5 text-xs font-medium text-ink-muted shadow-xs transition hover:border-primary hover:text-primary"
            >
              <span>🔍</span>
              <span>{term}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Alternative categories */}
      <div className="mt-6 w-full max-w-lg">
        <p className="text-caption font-semibold uppercase tracking-wider text-ink-faint">
          O explora por categorías activas
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                onResetFilters();
                onSelectCategory(cat.title);
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-surface-line bg-white p-2.5 text-xs font-semibold text-ink transition hover:border-primary hover:bg-primary-soft/50 hover:text-primary"
            >
              <span>{cat.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
