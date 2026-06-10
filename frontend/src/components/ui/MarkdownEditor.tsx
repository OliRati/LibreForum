import { useEffect, useState } from 'react';
import ShowMarkdown from './ShowMarkdown';

type Props = {
  value: string;
  onChange: (text: string) => void;
  label?: string;
  placeholder?: string;
  initialPreviewOpen?: boolean;
  minHeight?: string;
  debounceMs?: number;
};

export default function MarkdownEditor({
  value,
  onChange,
  label,
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
      {label && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-sm font-semibold text-zinc-200">{label}</label>

          <button
            type="button"
            onClick={() => setPreviewOpen((prev) => !prev)}
            className="rounded-xl bg-zinc-700 px-3 py-2 text-sm text-zinc-100 transition hover:bg-zinc-600"
          >
            {previewOpen ? 'Masquer l’aperçu' : 'Voir l’aperçu'}
          </button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-h-[220px] w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 outline-none shadow-lg shadow-black"
          style={{ minHeight }}
        />

        {previewOpen && (
          <div className="rounded-xl border border-zinc-700 bg-zinc-950 p-4 shadow-lg shadow-black">
            <div className="mb-3 text-sm font-semibold text-zinc-200">Aperçu Markdown</div>
            <div className="max-h-[520px] overflow-auto">
              <ShowMarkdown content={value || '*Rien à prévisualiser pour le moment*'} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
