import { useEffect, useState } from 'react';
import ShowMarkdown from './ShowMarkdown';

type Props = {
  value: string;
  onChange: (text: string) => void;
  label?: string;
  title?: string;
  placeholder?: string;
  initialPreviewOpen?: boolean;
  minHeight?: string;
  debounceMs?: number;
};

export default function MarkdownEditor({
  value,
  onChange,
  label,
  title,
  placeholder = '',
  initialPreviewOpen = true,
  minHeight = '220px',
  debounceMs = 200,
}: Props) {
  const [previewOpen, setPreviewOpen] = useState(initialPreviewOpen);
  const [previewContent, setPreviewContent] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPreviewContent(value);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [value, debounceMs]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {label && (
          <label className="text-sm text-zinc-400">{label}</label>
        )}
        {title && (
          <h3 className="mb-4 text-xl font-semibold text-zinc-200">{title}</h3>
        )}

        <button
          type="button"
          onClick={() => setPreviewOpen((prev) => !prev)}
          className="rounded-xl bg-zinc-700 px-3 py-2 text-sm text-zinc-100 transition hover:bg-zinc-600"
        >
          {previewOpen ? 'Masquer l’aperçu' : 'Voir l’aperçu'}
        </button>
      </div>

      <div className={`w-full grid gap-4 ${previewOpen ? "lg:grid-cols-[1fr_1fr]" : ""}`}>
        <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-4 shadow-lg shadow-black w-full overflow-hidden">
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="w-full h-full text-zinc-100 outline-none resize-none max-h-[220px]"
            style={{ minHeight }}
          />
        </div>

        {previewOpen && (
          <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-4 shadow-lg shadow-black w-full overflow-hidden">
            <div className="w-full h-full break-words overflow-y-auto max-h-[220px]">
              <ShowMarkdown content={value || '*Rien à prévisualiser pour le moment*'} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
