type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total?: number;
  itemsPerPage?: number;
  showPageNumbers?: boolean;
  showInfo?: boolean;
};

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  total,
  itemsPerPage = 10,
  showPageNumbers = false,
  showInfo = false,
}: Props) {
  if (totalPages <= 1) return null;

  const btnClass = 'rounded-xl bg-zinc-200 dark:bg-zinc-800 px-4 py-2 disabled:opacity-40';
  const btnClassActive = ' transition hover:bg-zinc-300 dark:hover:bg-zinc-700 cursor-pointer';
  
  const pageClass = (isCurrentPage: boolean) =>
      `rounded-lg px-3 py-2 ${isCurrentPage ? 'bg-blue-600 text-white' : 'bg-zinc-800'}`;

  const start = (page - 1) * itemsPerPage + 1;
  const end = Math.min(page * itemsPerPage, total || page * itemsPerPage);

  return (
    <div
      className={`mt-6 flex flex-col items-center justify-center gap-4 ${
        showPageNumbers ? 'sm:flex-row sm:justify-between' : ''
      }`}
    >
      {showInfo && total && (
        <div className="text-sm text-zinc-800 dark:text-zinc-400">
          Affichage {start}-{end} sur {total}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={btnClass + (page > 1 ? btnClassActive : "")}
        >
          Précédent
        </button>

        {showPageNumbers ? (
          <div className="flex gap-1 sm:gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={pageClass(p === page)}
              >
                {p}
              </button>
            ))}
          </div>
        ) : (
          <span className='text-sm text-zinc-900 dark:text-zinc-400'>
            Page {page} / {totalPages}
          </span>
        )}

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={btnClass + (page < totalPages ? btnClassActive : "")}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}