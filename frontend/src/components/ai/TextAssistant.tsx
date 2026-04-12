import { useState } from 'react';
import { assistText } from '../../services/llm';

interface Props {
  value: string;
  onChange: (text: string) => void;
}

export default function TextAssistant({ value, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');

  const run = async (action: string) => {
    if (!value.trim()) return;

    setLoading(true);
    setPreview('');

    try {
      const result = await assistText(value, action);
      setPreview(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border p-4 mt-4">
      <div className="mb-2 font-semibold">Assistant IA</div>

      <div className="flex flex-wrap gap-2 mb-3">
        <button onClick={() => run('improve')} className="btn">Améliorer</button>
        <button onClick={() => run('correct')} className="btn">Corriger</button>
        <button onClick={() => run('summarize')} className="btn">Résumer</button>
        <button onClick={() => run('simplify')} className="btn">Simplifier</button>
      </div>

      {loading && <div className="text-sm text-gray-500">Analyse en cours...</div>}

      {preview && (
        <div className="mt-3">
          <div className="text-sm text-gray-600 mb-1">Suggestion :</div>

          <div className="rounded bg-gray-600 p-3 text-sm whitespace-pre-wrap">
            {preview}
          </div>

          <button
            onClick={() => {
              onChange(preview);
              setPreview('');
            }}
            className="mt-2 rounded bg-black px-3 py-1 text-sm text-white"
          >
            Remplacer mon texte
          </button>
        </div>
      )}
    </div>
  );
}