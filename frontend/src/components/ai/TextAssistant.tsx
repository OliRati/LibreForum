import { useState } from 'react';
import { assistTextStream } from '../../services/llm';
import ShowMarkdown from '../ui/ShowMarkdown';

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
      let current = '';

      await assistTextStream(value, action, (chunk) => {
        current += chunk;
        setPreview(current);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-cyan-950 border-cyan-800 p-4 mt-4">
      <div className="mb-2 font-semibold">Assistant IA</div>

      <div className="flex flex-wrap gap-2 mb-3">
        <button onClick={() => run('improve')} className="cursor-pointer rounded-xl px-3 py-2 bg-cyan-700 hover:bg-cyan-800 mr-2">Améliorer</button>
        <button onClick={() => run('correct')} className="cursor-pointer rounded-xl px-3 py-2 bg-cyan-700 hover:bg-cyan-800 mr-2">Corriger</button>
        <button onClick={() => run('summarize')} className="cursor-pointer rounded-xl px-3 py-2 bg-cyan-700 hover:bg-cyan-800 mr-2">Résumer</button>
        <button onClick={() => run('simplify')} className="cursor-pointer rounded-xl px-3 py-2 bg-cyan-700 hover:bg-cyan-800 mr-2">Simplifier</button>
      </div>

      {loading && <div className="text-sm text-gray-500">Analyse en cours...</div>}

      {preview && (
        <div className="mt-3">
          <div className="text-sm text-gray-600 mb-1">Suggestion :</div>

          <div className="rounded bg-gray-600 p-3 text-sm whitespace-pre-wrap">
            <ShowMarkdown content={preview} />
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