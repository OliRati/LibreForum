import { apiFetch } from '../lib/api';

export async function suggestTags(text: string): Promise<string[]> {
  const res = await apiFetch('/api/llm/topics/suggest-tags', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });

  return res.tags || [];
}

export async function assistText(text: string, action: string): Promise<string> {
  const res = await apiFetch('/api/llm/assist', {
    method: 'POST',
    body: JSON.stringify({ text, action }),
  });

  return res.result;
}