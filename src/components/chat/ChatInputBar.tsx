import { useState, type FormEvent, type KeyboardEvent } from "react";

type ChatInputBarProps = {
  onSendMessage: (text: string) => void;
  onOpenAttachModal?: () => void;
  onOpenProposalModal?: () => void;
  disabled?: boolean;
};

export function ChatInputBar({
  onSendMessage,
  onOpenAttachModal,
  onOpenProposalModal,
  disabled,
}: ChatInputBarProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-surface-line bg-white p-2.5 sm:p-3.5">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Attachment Button (WhatsApp paperclip 📎) */}
        <button
          type="button"
          onClick={onOpenAttachModal}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-ink-muted transition hover:bg-surface-muted hover:text-primary"
          title="Adjuntar archivo o documento"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        {/* Quick Proposal Action (⚡) */}
        {onOpenProposalModal && (
          <button
            type="button"
            onClick={onOpenProposalModal}
            className="hidden sm:flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-amber-600 transition hover:bg-amber-50"
            title="Crear propuesta formal con Escrow"
          >
            ⚡
          </button>
        )}

        {/* Text Input Field */}
        <div className="relative flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Escribe un mensaje o consulta..."
            className="w-full rounded-full border border-surface-line bg-surface-muted/60 px-4 py-2.5 text-xs text-ink placeholder:text-ink-faint focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-body-sm"
          />
        </div>

        {/* Send Button (Paper Airplane in #2563EB) */}
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className={[
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition shadow-xs",
            text.trim() && !disabled
              ? "bg-primary text-white hover:bg-primary-hover active:scale-95"
              : "bg-surface-muted text-ink-faint cursor-not-allowed",
          ].join(" ")}
          aria-label="Enviar mensaje"
        >
          <svg className="h-5 w-5 rotate-90 transform" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
