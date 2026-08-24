type ToastProps = {
  message: string;
  visible: boolean;
  type?: "saved" | "removed" | "info";
};

export function Toast({ message, visible, type = "saved" }: ToastProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-toast-in">
      <div className="flex items-center gap-2.5 rounded-full border border-surface-line bg-ink px-4 py-2.5 text-body-sm font-medium text-white shadow-lg backdrop-blur-md">
        {type === "saved" ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white animate-save-pop">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </span>
        ) : type === "removed" ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink-muted text-white">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        ) : (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
            ✓
          </span>
        )}
        <span>{message}</span>
      </div>
    </div>
  );
}
