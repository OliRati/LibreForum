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
    <div className="shadow-lg shadow-black rounded-xl border bg-cyan-950 border-cyan-800 p-4 mt-4">
      <div className="mb-2 font-semibold">Assistant IA</div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => run('improve')} className="shadow-lg shadow-black cursor-pointer rounded-xl px-3 py-2 bg-cyan-700 hover:bg-cyan-800 text-cyan-50 mr-2">Améliorer</button>
        <button onClick={() => run('correct')} className="shadow-lg shadow-black cursor-pointer rounded-xl px-3 py-2 bg-cyan-700 hover:bg-cyan-800 text-cyan-50 mr-2">Corriger</button>
        <button onClick={() => run('summarize')} className="shadow-lg shadow-black cursor-pointer rounded-xl px-3 py-2 bg-cyan-700 hover:bg-cyan-800 text-cyan-50 mr-2">Résumer</button>
        <button onClick={() => run('simplify')} className="shadow-lg shadow-black cursor-pointer rounded-xl px-3 py-2 bg-cyan-700 hover:bg-cyan-800 text-cyan-50 mr-2">Simplifier</button>
      </div>

      {loading && <div className="text-sm text-gray-500">Analyse en cours...</div>}

      {preview && (
        <div className="mt-3">
          <div className="rounded-xl border border-gray-500 shadow-lg shadow-black bg-gray-600 text-sm whitespace-pre-wrap overflow-hidden">
            <div className="text-sm text-gray-300 py-2 border-b border-gray-400 bg-gray-700">
              Suggestion :
            </div>

            <div className="p-3">
              <ShowMarkdown content={preview} />
            </div>
          </div>

          <button
            onClick={() => {
              onChange(preview);
              setPreview('');
            }}
            className="shadow-lg shadow-black mt-5 rounded-xl px-4 py-2 text-sm cursor-pointer bg-cyan-700 hover:bg-cyan-800 text-cyan-50"
          >
            Remplacer mon texte
          </button>
        </div>
      )}
    </div>
  );
}