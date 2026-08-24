import { Link } from "react-router-dom";
import type { ChatConversation } from "../../chatData";

type ChatHeaderProps = {
  conversation: ChatConversation;
  onBack?: () => void;
  onSimulateProposal?: () => void;
  onSimulateDelivery?: () => void;
};

export function ChatHeader({
  conversation,
  onBack,
  onSimulateProposal,
  onSimulateDelivery,
}: ChatHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between border-b border-surface-line bg-white px-3 sm:px-5">
      {/* Left: Back (Mobile) + Avatar + Name + Academic Credentials + Online Status */}
      <div className="flex min-w-0 items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-surface-muted lg:hidden"
            aria-label="Volver a la lista de chats"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Avatar with Verified Story Ring & Online Dot */}
        <Link
          to={`/estudiante/${conversation.talentId}`}
          className="relative flex-shrink-0 group"
          title="Ver perfil de estudiante"
        >
          <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-primary sm:h-11 sm:w-11">
            <img
              src={conversation.studentAvatar}
              alt={conversation.studentName}
              className="h-full w-full object-cover"
            />
          </div>
          {conversation.isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success ring-2 ring-white" />
          )}
        </Link>

        {/* Contact Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 truncate">
            <Link
              to={`/estudiante/${conversation.talentId}`}
              className="truncate font-display text-body-sm font-bold text-ink hover:text-primary sm:text-body"
            >
              {conversation.studentName}
            </Link>
            <span className="hidden rounded-pill bg-success-soft px-2 py-0.5 text-[10px] font-bold text-success-hover sm:inline-block">
              {conversation.studentUniversity}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            {conversation.isOnline ? (
              <span className="flex items-center gap-1 font-semibold text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                En línea
              </span>
            ) : (
              <span>{conversation.lastSeenText}</span>
            )}
            <span className="hidden sm:inline">·</span>
            <span className="hidden truncate sm:inline">
              {conversation.studentCareer} ({conversation.studentSemester})
            </span>
          </div>
        </div>
      </div>

      {/* Right Action Tools: Simulation Shortcuts & Profile Link */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Quick Simulation Dropdown / Buttons for testing the flow */}
        <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-surface-line bg-surface-muted/50 p-1 text-xs">
          <span className="px-1.5 font-bold text-ink-faint text-[10px] uppercase">Simular:</span>
          {onSimulateProposal && (
            <button
              type="button"
              onClick={onSimulateProposal}
              className="rounded px-2 py-1 font-medium text-ink hover:bg-white hover:text-primary transition shadow-xs"
              title="El estudiante envía una propuesta de S/ 45"
            >
              ⚡ Propuesta
            </button>
          )}
          {onSimulateDelivery && (
            <button
              type="button"
              onClick={onSimulateDelivery}
              className="rounded px-2 py-1 font-medium text-ink hover:bg-white hover:text-success transition shadow-xs"
              title="El estudiante entrega el archivo ZIP"
            >
              📦 Entrega
            </button>
          )}
        </div>

        {/* View Profile Link */}
        <Link
          to={`/estudiante/${conversation.talentId}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-surface-line bg-white px-2.5 py-1.5 text-xs font-semibold text-ink shadow-xs transition hover:border-primary hover:text-primary"
        >
          <span className="hidden sm:inline">Ver</span> Perfil
        </Link>
      </div>
    </div>
  );
}
