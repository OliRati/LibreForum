type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total?: number;
  itemsPerPage?: number;
  showPageNumbers?: boolean;
  showInfo?: boolean;
  variant?: 'light' | 'dark';
};

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  total,
  itemsPerPage = 10,
  showPageNumbers = false,
  showInfo = false,
  variant = 'light',
}: Props) {
  if (totalPages <= 1) return null;

  const isLight = variant === 'light';
  const btnClass = isLight
    ? 'rounded-xl bg-zinc-800 px-4 py-2 disabled:opacity-40'
    : 'rounded-lg bg-gray-700 px-4 py-2 text-white disabled:opacity-50 hover:bg-gray-600';
  
  const pageClass = (isCurrentPage: boolean) =>
    isLight
      ? `rounded-lg px-3 py-2 ${isCurrentPage ? 'bg-blue-600 text-white' : 'bg-zinc-800'}`
      : `rounded-lg px-3 py-2 ${
          isCurrentPage
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`;

  const start = (page - 1) * itemsPerPage + 1;
  const end = Math.min(page * itemsPerPage, total || page * itemsPerPage);

  return (
    <div
      className={`mt-6 flex flex-col items-center justify-center gap-4 ${
        showPageNumbers ? 'sm:flex-row sm:justify-between' : ''
      }`}
    >
      {showInfo && total && (
        <div className={isLight ? 'text-sm text-zinc-400' : 'text-sm text-gray-300'}>
          Affichage {start}-{end} sur {total}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={btnClass}
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
          <span className={isLight ? 'text-sm text-zinc-400' : 'text-sm text-gray-300'}>
            Page {page} / {totalPages}
          </span>
        )}

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={btnClass}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}