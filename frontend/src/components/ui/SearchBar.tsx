import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-zinc-200 outline-none"
        type="text"
        placeholder="Rechercher un sujet…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="rounded-xl bg-emerald-600 px-4 py-3 font-medium hover:bg-emerald-500"
      >
        Rechercher
      </button>
    </form>
  );
}