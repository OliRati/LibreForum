import { useState } from 'react';
import { assistText } from '../../services/llm';

interface Props {
  content: string;
  onApply: (text: string) => void;
}

export default function AssistantPanel({ content, onApply }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const run = async (action: string) => {
    if (!content.trim()) return;

    setLoading(true);
    setResult('');

    try {
      const res = await assistText(content, action);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="mb-3 font-semibold">Assistant IA</div>

      <div className="flex flex-wrap gap-2 mb-3">
        <button onClick={() => run('improve')} className="btn">Améliorer</button>
        <button onClick={() => run('correct')} className="btn">Corriger</button>
        <button onClick={() => run('summarize')} className="btn">Résumer</button>
        <button onClick={() => run('simplify')} className="btn">Simplifier</button>
      </div>

      {loading && <div className="text-sm text-gray-500">Traitement...</div>}

      {result && (
        <div className="mt-3">
          <div className="mb-2 text-sm font-medium">Suggestion :</div>

          <div className="rounded bg-gray-50 p-3 text-sm whitespace-pre-wrap">
            {result}
          </div>

          <div className="mt-2 flex gap-2">
            <button
              onClick={() => onApply(result)}
              className="rounded bg-black px-3 py-1 text-sm text-white"
            >
              Remplacer
            </button>

            <button
              onClick={() => setResult('')}
              className="rounded border px-3 py-1 text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}