type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-xl bg-zinc-800 px-4 py-2 disabled:opacity-40"
      >
        Précédent
      </button>

      <span className="text-sm text-zinc-400">
        Page {page} / {totalPages}
      </span>

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-xl bg-zinc-800 px-4 py-2 disabled:opacity-40"
      >
        Suivant
      </button>
    </div>
  );
}