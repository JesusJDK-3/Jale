import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import type { Talent, PortfolioShot } from "../data";

type TalentCardProps = {
  talent: Talent;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onContact: (talent: Talent) => void;
  onOpenShot: (talent: Talent, shot: PortfolioShot) => void;
};

export function TalentCard({
  talent,
  isSaved,
  onToggleSave,
  onContact,
  onOpenShot,
}: TalentCardProps) {
  const [animatingHeart, setAnimatingHeart] = useState(false);
  const [activeShotIndex, setActiveShotIndex] = useState(0);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimatingHeart(true);
    onToggleSave(talent.id);
    window.setTimeout(() => setAnimatingHeart(false), 400);
  };

  const shots = talent.portfolio;
  const currentShot = shots[activeShotIndex] || shots[0];

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-surface-line/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      {/* Top Bar: Profile Header (Instagram style) */}
      <div className="flex items-center justify-between gap-2 p-3 sm:p-4">
        <Link
          to={`/estudiante/${talent.id}`}
          className="flex min-w-0 items-center gap-2.5 group-hover/link:opacity-90"
        >
          {/* Avatar with Verified Story Ring */}
          <div className="relative flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px] sm:h-11 sm:w-11">
              <img
                src={talent.avatarUrl}
                alt={talent.name}
                className="h-full w-full rounded-full object-cover bg-white"
                loading="lazy"
              />
            </div>
            {talent.availableNow && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success ring-2 ring-white" />
            )}
          </div>

          {/* Name & Academic Credentials */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 truncate">
              <h3 className="truncate font-display text-body-sm font-bold text-ink hover:text-primary transition-colors sm:text-body">
                {talent.name}
              </h3>
            </div>
            <p className="truncate text-xs text-ink-muted">
              {talent.career} · <span className="font-semibold text-primary">{talent.semester}</span>
            </p>
          </div>
        </Link>

        {/* Save / Favorite Bookmark Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label={isSaved ? "Quitar de favoritos" : "Guardar en favoritos"}
          className={[
            "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors",
            isSaved
              ? "bg-rose-50 text-rose-600"
              : "bg-surface-muted/60 text-ink-faint hover:bg-surface-muted hover:text-rose-500",
            animatingHeart ? "animate-save-pop" : "",
          ].join(" ")}
        >
          <svg
            className="h-5 w-5"
            fill={isSaved ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* University Verification Badge Banner */}
      <div className="px-3 pb-2.5 sm:px-4">
        <div className="inline-flex max-w-full items-center gap-1.5 truncate rounded-pill bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success-hover sm:text-xs">
          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-success" />
          <span className="truncate">Estudiante activo — {talent.university}</span>
        </div>
      </div>

      {/* PROTAGONIST VISUAL: Square Portfolio Grid (1:1 Instagram Explore ratio) */}
      <div className="relative px-3 sm:px-4">
        {/* Main Square Hero Preview */}
        <div
          onClick={() => onOpenShot(talent, currentShot)}
          className={[
            "group/thumb relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br p-4 text-white shadow-inner transition-transform duration-300 group-hover:scale-[1.01]",
            currentShot.gradient,
          ].join(" ")}
        >
          {/* Subtle background grid pattern */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />

          {/* Top Tag & Type Pill */}
          <div className="relative z-10 flex items-start justify-between gap-1">
            <span className="rounded-pill bg-black/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm sm:text-xs">
              {currentShot.tag}
            </span>
            <span className="rounded-md bg-white/20 p-1 backdrop-blur-sm">
              <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </span>
          </div>

          {/* Center Visual Mock */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 shadow-md backdrop-blur-md ring-1 ring-white/30 sm:h-14 sm:w-14">
              <span className="font-display text-base font-extrabold tracking-wider sm:text-lg" style={{ color: currentShot.accentColor }}>
                {currentShot.tag.slice(0, 3).toUpperCase()}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 max-w-[190px] font-display text-xs font-bold leading-tight sm:text-body-sm">
              {currentShot.title}
            </p>
          </div>

          {/* Bottom Overlay Pill on Hover */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-medium text-white/80">
            <span>{currentShot.category}</span>
            <span className="flex items-center gap-1 font-bold text-white underline decoration-white/50">
              Ver muestra →
            </span>
          </div>
        </div>

        {/* Multi-Shot Mini Thumbnails (1 to 3 items) */}
        {shots.length > 1 && (
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {shots.map((shot, idx) => (
              <button
                key={shot.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveShotIndex(idx);
                }}
                className={[
                  "relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br p-1 text-white transition-all",
                  shot.gradient,
                  activeShotIndex === idx
                    ? "ring-2 ring-primary ring-offset-1 scale-95"
                    : "opacity-75 hover:opacity-100",
                ].join(" ")}
              >
                <div className="flex h-full w-full items-center justify-center text-[9px] font-bold">
                  {idx + 1}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Body: Value Proposition Headline */}
      <div className="p-3 sm:p-4">
        <p className="line-clamp-2 text-xs text-ink-muted sm:text-body-sm">
          {talent.headline}
        </p>

        {/* TRUST DATA BAR (Marketplace Hierarchy) */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-1.5 border-t border-surface-line/70 pt-3">
          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-medium uppercase tracking-wider text-ink-faint">Desde</span>
            <span className="font-display text-sm font-extrabold text-primary sm:text-title">
              S/ {talent.priceFrom}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
            <span>★ {talent.rating}</span>
            <span className="text-[10px] font-normal text-amber-600">({talent.reviews})</span>
          </div>
        </div>

        {/* Response & Escrow info */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-ink-faint">
          <span className="flex items-center gap-1">
            <span className="text-success">⚡</span> {talent.responseTime}
          </span>
          <span className="flex items-center gap-1 font-medium text-primary">
            🛡️ Escrow protegido
          </span>
        </div>

        {/* Quick Action Button */}
        <div className="mt-3.5 flex gap-2">
          <Button
            size="sm"
            variant="primary"
            fullWidth
            onClick={() => onContact(talent)}
          >
            Contactar
          </Button>
          <Link
            to={`/estudiante/${talent.id}`}
            className="inline-flex items-center justify-center rounded-md border border-surface-line bg-white px-3 py-1.5 text-body-sm font-semibold text-ink shadow-xs transition hover:border-primary hover:text-primary"
            aria-label="Ver perfil completo"
          >
            Perfil
          </Link>
        </div>
      </div>
    </article>
  );
}
