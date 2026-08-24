import { useRef, useState } from "react";

type FileDropProps = {
  label: string;
  hint: string;
  fileName?: string;
  onFile: (file: File) => void;
};

export function FileDrop({ label, hint, fileName, onFile }: FileDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  return (
    <div>
      <p className="mb-1.5 text-body-sm font-medium text-ink">{label}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const file = e.dataTransfer.files[0];
          if (file) onFile(file);
        }}
        className={[
          "flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors",
          over ? "border-primary bg-primary-soft" : "border-surface-line bg-surface-muted",
        ].join(" ")}
      >
        <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-white text-primary shadow-xs">
          ↑
        </span>
        <span className="text-body-sm font-medium text-ink">
          {fileName ? fileName : "Arrastra tu archivo o toca para elegir"}
        </span>
        <span className="mt-1 max-w-sm text-caption text-ink-faint">{hint}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />
    </div>
  );
}
