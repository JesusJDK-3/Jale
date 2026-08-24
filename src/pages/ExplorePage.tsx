import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { ContactModal } from "../components/ContactModal";
import { EmptyState } from "../components/EmptyState";
import { PortfolioModal } from "../components/PortfolioModal";
import {
  SearchFilterSidebar,
  type FilterState,
} from "../components/SearchFilterSidebar";
import { StoriesBar } from "../components/StoriesBar";
import { TalentCard } from "../components/TalentCard";
import { Toast } from "../components/Toast";
import { TALENT, type Talent, type PortfolioShot } from "../data";
import { useAppState } from "../state";

const INITIAL_PAGE_SIZE = 8;
const PAGE_SIZE_INCREMENT = 4;

export function ExplorePage() {
  const [params, setSearchParams] = useSearchParams();
  const initialCategory = params.get("cat") ?? "Todas";
  const initialQuery = params.get("q") ?? "";

  const { savedIds, toggleSaved } = useAppState();

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    query: initialQuery,
    category: initialCategory,
    maxPrice: 0,
    university: "Todas",
    minRating: 0,
    availableOnly: false,
    sortBy: "featured",
  });

  // UI state
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [contactTalent, setContactTalent] = useState<Talent | null>(null);
  const [selectedShot, setSelectedShot] = useState<{
    talent: Talent;
    shot: PortfolioShot;
  } | null>(null);

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    visible: boolean;
    type: "saved" | "removed";
  }>({ message: "", visible: false, type: "saved" });

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Keep search params in sync when category changes
  const updateFilters = useCallback((patch: Partial<FilterState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      // reset pagination on filter change
      setVisibleCount(INITIAL_PAGE_SIZE);
      return next;
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      query: "",
      category: "Todas",
      maxPrice: 0,
      university: "Todas",
      minRating: 0,
      availableOnly: false,
      sortBy: "featured",
    });
    setShowSavedOnly(false);
    setVisibleCount(INITIAL_PAGE_SIZE);
    setSearchParams({});
  }, [setSearchParams]);

  // Count talents per category
  const talentsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    TALENT.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter and Sort Talent List
  const filteredList = useMemo(() => {
    return TALENT.filter((t) => {
      // Saved only filter
      if (showSavedOnly && !savedIds.includes(t.id)) {
        return false;
      }

      // Category filter
      if (filters.category !== "Todas" && t.category !== filters.category) {
        return false;
      }

      // Search Query filter (matches name, headline, tags, career, university)
      const q = filters.query.trim().toLowerCase();
      if (q) {
        const matchName = t.name.toLowerCase().includes(q);
        const matchHeadline = t.headline.toLowerCase().includes(q);
        const matchUni = t.university.toLowerCase().includes(q);
        const matchCareer = t.career.toLowerCase().includes(q);
        const matchTags = t.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matchName && !matchHeadline && !matchUni && !matchCareer && !matchTags) {
          return false;
        }
      }

      // Price limit filter
      if (filters.maxPrice > 0 && t.priceFrom > filters.maxPrice) {
        return false;
      }

      // University filter
      if (filters.university !== "Todas" && t.university !== filters.university) {
        return false;
      }

      // Rating filter
      if (filters.minRating > 0 && t.rating < filters.minRating) {
        return false;
      }

      // Available now filter
      if (filters.availableOnly && !t.availableNow) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "rating") return b.rating - a.rating;
      if (filters.sortBy === "price_asc") return a.priceFrom - b.priceFrom;
      if (filters.sortBy === "reviews") return b.reviews - a.reviews;
      // Default: featured (available now first, then rating)
      if (a.availableNow !== b.availableNow) return a.availableNow ? -1 : 1;
      return b.rating - a.rating;
    });
  }, [filters, showSavedOnly, savedIds]);

  // Paginated items for Infinite Scroll
  const paginatedTalent = useMemo(() => {
    return filteredList.slice(0, visibleCount);
  }, [filteredList, visibleCount]);

  const hasMore = visibleCount < filteredList.length;

  // Infinite Scroll Trigger via IntersectionObserver
  useEffect(() => {
    const observerTarget = loadMoreRef.current;
    if (!observerTarget || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          // Simulate smooth Instagram-style network fetch
          window.setTimeout(() => {
            setVisibleCount((prev) => prev + PAGE_SIZE_INCREMENT);
            setIsLoadingMore(false);
          }, 500);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(observerTarget);
    return () => {
      if (observerTarget) observer.unobserve(observerTarget);
    };
  }, [hasMore, isLoadingMore]);

  // Save / Bookmark handler with Micro-interaction Toast
  const handleToggleSave = useCallback(
    (id: string) => {
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
    },
    [toggleSaved]
  );

  return (
    <div className="min-h-screen bg-surface-muted/30 pb-20 pt-6 sm:pt-8">
      <div className="container-feed">
        {/* Header Title & Value Prop */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <Badge tone="primary" dot>
                Sin registro previo
              </Badge>
              <Badge tone="success">Garantía Escrow</Badge>
            </div>
            <h1 className="mt-2 font-display text-display-md sm:text-display-lg text-ink">
              Explora Talento Universitario
            </h1>
            <p className="mt-1 max-w-2xl text-body-sm sm:text-body text-ink-muted">
              Encuentra al estudiante ideal para tu proyecto con portafolio verificado,
              calificaciones reales y pago retenido hasta tu aprobación.
            </p>
          </div>

          {/* Quick Active Search Pill & Mobile Filter Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-surface-line bg-white px-4 py-2.5 text-body-sm font-semibold text-ink shadow-xs transition hover:border-primary lg:hidden"
            >
              <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Filtros</span>
              {filteredList.length !== TALENT.length && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  !
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 1. INSTAGRAM STORIES CATEGORY BAR */}
        <section className="mb-8" aria-label="Categorías como Stories">
          <StoriesBar
            selectedCategory={filters.category}
            onSelectCategory={(cat) => updateFilters({ category: cat })}
            showSavedOnly={showSavedOnly}
            onToggleSavedOnly={() => setShowSavedOnly((prev) => !prev)}
            savedCount={savedIds.length}
            talentsByCategory={talentsByCategory}
          />
        </section>

        {/* 2. MAIN LAYOUT: FIXED DESKTOP SIDEBAR + INSTAGRAM EXPLORE FEED */}
        <div className="flex items-start gap-8">
          {/* Fixed Desktop Sidebar */}
          <SearchFilterSidebar
            filters={filters}
            onChange={updateFilters}
            onReset={handleResetFilters}
            totalResults={filteredList.length}
            isMobileOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />

          {/* Feed Content Area */}
          <main className="min-w-0 flex-1">
            {/* Active Filters Bar (Breadcrumbs) */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-surface-line/70 bg-white px-4 py-3 shadow-xs">
              <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                <span className="font-semibold text-ink">
                  {filteredList.length} {filteredList.length === 1 ? "perfil encontrado" : "perfiles encontrados"}
                </span>

                {filters.category !== "Todas" && (
                  <span className="inline-flex items-center gap-1 rounded-pill bg-primary-soft px-2.5 py-0.5 font-medium text-primary">
                    {filters.category}
                    <button
                      type="button"
                      onClick={() => updateFilters({ category: "Todas" })}
                      className="hover:text-primary-hover"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {filters.query && (
                  <span className="inline-flex items-center gap-1 rounded-pill bg-primary-soft px-2.5 py-0.5 font-medium text-primary">
                    "{filters.query}"
                    <button
                      type="button"
                      onClick={() => updateFilters({ query: "" })}
                      className="hover:text-primary-hover"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {filters.availableOnly && (
                  <span className="inline-flex items-center gap-1 rounded-pill bg-success-soft px-2.5 py-0.5 font-medium text-success-hover">
                    🟢 Disponible hoy
                    <button
                      type="button"
                      onClick={() => updateFilters({ availableOnly: false })}
                      className="hover:text-success"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {filters.maxPrice > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-pill bg-surface-muted px-2.5 py-0.5 font-medium text-ink">
                    Hasta S/ {filters.maxPrice}
                    <button
                      type="button"
                      onClick={() => updateFilters({ maxPrice: 0 })}
                      className="hover:text-primary"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {showSavedOnly && (
                  <span className="inline-flex items-center gap-1 rounded-pill bg-rose-50 px-2.5 py-0.5 font-medium text-rose-600">
                    ❤️ Solo guardados
                    <button
                      type="button"
                      onClick={() => setShowSavedOnly(false)}
                      className="hover:text-rose-800"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>

              {/* Quick Sort Dropdown (visible in feed header) */}
              <div className="flex items-center gap-2">
                <span className="text-caption text-ink-faint">Ordenar:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    updateFilters({
                      sortBy: e.target.value as FilterState["sortBy"],
                    })
                  }
                  className="rounded-lg border border-surface-line bg-surface-muted/60 px-2.5 py-1 text-xs font-semibold text-ink focus:border-primary focus:outline-none"
                >
                  <option value="featured">✨ Recomendados</option>
                  <option value="rating">★ Mayor rating</option>
                  <option value="price_asc">💰 Menor precio</option>
                  <option value="reviews">💬 Más reviews</option>
                </select>
              </div>
            </div>

            {/* 3. EXPLORE GRID: 2 cols on mobile, 3 to 4 cols on desktop */}
            {filteredList.length === 0 ? (
              <EmptyState
                query={filters.query}
                onResetFilters={handleResetFilters}
                onSelectCategory={(cat) => updateFilters({ category: cat })}
                onSelectQuery={(q) => updateFilters({ query: q })}
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                {paginatedTalent.map((talent) => (
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
            )}

            {/* 4. INFINITE SCROLL LOADER & STATUS (Instagram continuous feed) */}
            {filteredList.length > 0 && (
              <div ref={loadMoreRef} className="mt-10 flex flex-col items-center justify-center py-6">
                {isLoadingMore ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                    <p className="text-caption font-semibold text-ink-muted">
                      Cargando más talento universitario...
                    </p>
                  </div>
                ) : hasMore ? (
                  <Button
                    variant="tertiary"
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE_INCREMENT)}
                  >
                    Cargar más perfiles ({filteredList.length - visibleCount} restantes)
                  </Button>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success-soft text-lg text-success">
                      ✓
                    </span>
                    <p className="font-display text-body-sm font-bold text-ink">
                      Has explorado todos los estudiantes disponibles
                    </p>
                    <p className="text-caption text-ink-muted">
                      ¿No encuentras lo que buscas? Puedes solicitar un perfil personalizado.
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

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

      {/* Toast Notification for Saves */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        type={toast.type}
      />
    </div>
  );
}
