import { apiFetch } from '../lib/api';

export async function suggestTags(text: string): Promise<string[]> {
  const res = await apiFetch('/api/llm/topics/suggest-tags', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });

  return res.tags.tags || [];
}

export async function assistText(text: string, action: string): Promise<string> {
  const res = await apiFetch('/api/llm/assist', {
    method: 'POST',
    body: JSON.stringify({ text, action }),
  });

  return res.result;
}

export async function assistTextStream(
  text: string,
  action: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/llm/assist/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ text, action }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}`);
  }

  if (!response.body) {
    throw new Error('Streaming not supported by this browser');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) {
      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  }
}