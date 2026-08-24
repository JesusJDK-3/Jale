import { useRef } from "react";
import { CATEGORIES } from "../data";

type StoriesBarProps = {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  showSavedOnly?: boolean;
  onToggleSavedOnly?: () => void;
  savedCount?: number;
  talentsByCategory?: Record<string, number>;
};

export function StoriesBar({
  selectedCategory,
  onSelectCategory,
  showSavedOnly = false,
  onToggleSavedOnly,
  savedCount = 0,
  talentsByCategory = {},
}: StoriesBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -240 : 240;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "diseno":
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        );
      case "web":
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      case "marketing":
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case "admin":
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "idiomas":
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        );
    }
  };

  return (
    <div className="relative w-full rounded-2xl border border-surface-line/80 bg-white p-3 shadow-xs sm:p-4">
      {/* Scroll Navigation Buttons (Desktop) */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Desplazar categorías a la izquierda"
        className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-surface-line bg-white p-2 text-ink-muted shadow-md transition hover:bg-surface-muted hover:text-ink lg:flex"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Desplazar categorías a la derecha"
        className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-surface-line bg-white p-2 text-ink-muted shadow-md transition hover:bg-surface-muted hover:text-ink lg:flex"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Stories Scroll Container */}
      <div
        ref={scrollRef}
        className="stories-scroll flex items-center gap-4 overflow-x-auto py-1 sm:gap-6"
      >
        {/* Story 1: Todas las Categorías */}
        <button
          type="button"
          onClick={() => {
            if (showSavedOnly && onToggleSavedOnly) onToggleSavedOnly();
            onSelectCategory("Todas");
          }}
          className="group flex flex-col items-center gap-1.5 focus:outline-none"
        >
          <div
            className={[
              "relative flex h-16 w-16 items-center justify-center rounded-full p-[2.5px] transition-all duration-300 group-hover:scale-105 sm:h-18 sm:w-18",
              selectedCategory === "Todas" && !showSavedOnly
                ? "bg-gradient-to-tr from-primary via-primary-hover to-secondary ring-2 ring-primary ring-offset-2"
                : "bg-surface-line group-hover:bg-gradient-to-tr group-hover:from-primary/50 group-hover:to-secondary/50",
            ].join(" ")}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-ink transition-transform group-active:scale-95">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary sm:h-14 sm:w-14">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
            </div>
            {/* Live active dot */}
            <span className="absolute -bottom-0.5 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-success ring-2 ring-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </div>
          <span
            className={[
              "whitespace-nowrap text-xs font-semibold tracking-tight transition-colors sm:text-body-sm",
              selectedCategory === "Todas" && !showSavedOnly ? "text-primary font-bold" : "text-ink-muted group-hover:text-ink",
            ].join(" ")}
          >
            Todas
          </span>
        </button>

        {/* 5 Main Categories as Instagram Stories */}
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.title && !showSavedOnly;
          const count = talentsByCategory[cat.title] ?? 0;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                if (showSavedOnly && onToggleSavedOnly) onToggleSavedOnly();
                onSelectCategory(cat.title);
              }}
              className="group flex flex-col items-center gap-1.5 focus:outline-none"
            >
              {/* Instagram Ring */}
              <div
                className={[
                  "relative flex h-16 w-16 items-center justify-center rounded-full p-[2.5px] transition-all duration-300 group-hover:scale-105 sm:h-18 sm:w-18",
                  isSelected
                    ? "bg-gradient-to-tr from-primary via-blue-500 to-secondary ring-2 ring-primary ring-offset-2 shadow-sm"
                    : "bg-gradient-to-tr from-surface-line via-surface-line to-surface-line group-hover:from-primary/40 group-hover:to-secondary/40",
                ].join(" ")}
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white p-1 transition-transform group-active:scale-95">
                  <div
                    className={[
                      "flex h-full w-full items-center justify-center rounded-full transition-colors",
                      isSelected
                        ? "bg-primary text-white shadow-inner"
                        : "bg-surface-muted text-ink group-hover:bg-primary-soft group-hover:text-primary",
                    ].join(" ")}
                  >
                    {getCategoryIcon(cat.id)}
                  </div>
                </div>

                {/* Counter Badge */}
                {count > 0 && (
                  <span
                    className={[
                      "absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold shadow-xs ring-2 ring-white",
                      isSelected ? "bg-secondary text-white" : "bg-primary text-white",
                    ].join(" ")}
                  >
                    {count}
                  </span>
                )}
              </div>

              {/* Title label */}
              <span
                className={[
                  "max-w-[85px] truncate text-center text-xs font-semibold tracking-tight transition-colors sm:max-w-[100px] sm:text-body-sm",
                  isSelected ? "text-primary font-bold" : "text-ink-muted group-hover:text-ink",
                ].join(" ")}
              >
                {cat.title}
              </span>
            </button>
          );
        })}

        {/* Story: Favoritos Guardados */}
        {onToggleSavedOnly && (
          <button
            type="button"
            onClick={onToggleSavedOnly}
            className="group flex flex-col items-center gap-1.5 focus:outline-none"
          >
            <div
              className={[
                "relative flex h-16 w-16 items-center justify-center rounded-full p-[2.5px] transition-all duration-300 group-hover:scale-105 sm:h-18 sm:w-18",
                showSavedOnly
                  ? "bg-gradient-to-tr from-rose-500 to-secondary ring-2 ring-rose-500 ring-offset-2"
                  : "bg-surface-line group-hover:bg-gradient-to-tr group-hover:from-rose-400/40 group-hover:to-secondary/40",
              ].join(" ")}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white p-1 transition-transform group-active:scale-95">
                <div
                  className={[
                    "flex h-full w-full items-center justify-center rounded-full transition-colors",
                    showSavedOnly
                      ? "bg-rose-500 text-white"
                      : "bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white",
                  ].join(" ")}
                >
                  <svg className="h-6 w-6" fill={showSavedOnly ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow-xs ring-2 ring-white">
                  {savedCount}
                </span>
              )}
            </div>
            <span
              className={[
                "whitespace-nowrap text-xs font-semibold tracking-tight transition-colors sm:text-body-sm",
                showSavedOnly ? "text-rose-600 font-bold" : "text-ink-muted group-hover:text-ink",
              ].join(" ")}
            >
              Guardados
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
