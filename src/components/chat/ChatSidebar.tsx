import { useState } from "react";
import type { ChatConversation } from "../../chatData";

type ChatSidebarProps = {
  conversations: ChatConversation[];
  activeId: string;
  onSelectConversation: (id: string) => void;
};

export function ChatSidebar({
  conversations,
  activeId,
  onSelectConversation,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(
    (c) =>
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.studentCareer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col border-r border-surface-line bg-white">
      {/* Sidebar Top Header */}
      <div className="border-b border-surface-line p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-title font-extrabold text-ink">
              Chats y Tratos
            </h2>
            <span className="rounded-pill bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary">
              {conversations.length}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-success flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Escrow Activo
          </span>
        </div>

        {/* Search bar (WhatsApp style) */}
        <div className="mt-3 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en conversaciones o estudiante..."
            className="w-full rounded-xl border border-surface-line bg-surface-muted/60 py-2 pl-9 pr-3 text-xs text-ink placeholder:text-ink-faint focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-ink-faint"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-surface-line/60">
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-xs text-ink-muted">
            No se encontraron conversaciones para "{searchQuery}".
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeId;
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelectConversation(conv.id)}
                className={[
                  "w-full text-left p-3.5 transition-all flex items-start gap-3 relative",
                  isActive
                    ? "bg-primary-soft/40 border-l-4 border-primary"
                    : "hover:bg-surface-muted/50",
                ].join(" ")}
              >
                {/* Avatar with status */}
                <div className="relative flex-shrink-0">
                  <div className="h-12 w-12 overflow-hidden rounded-full ring-1 ring-surface-line">
                    <img
                      src={conv.studentAvatar}
                      alt={conv.studentName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {conv.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success ring-2 ring-white" />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className="truncate font-display text-body-sm font-bold text-ink">
                      {conv.studentName}
                    </h3>
                    <span className="text-[10px] font-medium text-ink-faint flex-shrink-0">
                      {conv.lastMessageTime}
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold text-primary/80">
                    {conv.studentUniversity} · {conv.studentCareer}
                  </p>

                  <p className="mt-1 line-clamp-1 text-xs text-ink-muted">
                    {conv.lastMessage}
                  </p>

                  {/* Badges footer */}
                  <div className="mt-1.5 flex items-center gap-1.5">
                    {conv.escrowActive && (
                      <span className="inline-flex items-center gap-1 rounded-pill bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        🔒 Escrow S/ {conv.escrowAmount}
                      </span>
                    )}

                    {conv.status === "proposal_sent" && (
                      <span className="inline-flex items-center gap-1 rounded-pill bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                        ⚡ Propuesta
                      </span>
                    )}

                    {conv.status === "completed" && (
                      <span className="inline-flex items-center gap-1 rounded-pill bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                        ✓ Finalizado
                      </span>
                    )}

                    {conv.unreadCount > 0 && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-white">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
