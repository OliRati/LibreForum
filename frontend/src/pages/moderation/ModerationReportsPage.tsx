import { useEffect, useState } from 'react';
import { getReports } from '../../services/reports';
import type { Report } from '../../types/report';
import Pagination from '../../components/ui/Pagination';
import ModerationReportCard from '../../components/moderation/ModerationReportCard';

const ITEMS_PER_PAGE = 10;

export default function ModerationReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const loadReports = async (page: number = 1) => {
    try {
      setLoading(true);
      setError('');
      const data = await getReports(page, ITEMS_PER_PAGE);
      setReports(data.items);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les signalements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports(1);
  }, []);

  const handlePageChange = (page: number) => {
    loadReports(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="p-6">Chargement des signalements...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Modération — Signalements</h1>

      {reports.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-gray-600">
          Aucun signalement pour le moment.
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reports.map((report) => (
              <ModerationReportCard report={report} />
            ))}
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            total={total}
            itemsPerPage={ITEMS_PER_PAGE}
            showInfo
            variant="dark"
          />
        </>
      )}
    </div>
  );
}