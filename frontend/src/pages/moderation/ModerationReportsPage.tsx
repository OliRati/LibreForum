import { useEffect, useState } from 'react';
import { getReports } from '../../services/reports';
import type { Report } from '../../types/report';
import type { Post } from '../../types/post';
import TopicModerationActions from '../../components/moderation/TopicModerationActions';
import PostModerationActions from '../../components/moderation/PostModerationActions';
import ModerationBadge from '../../components/moderation/ModerationBadge';
import ShowMarkdown from '../../components/ui/ShowMarkdown';
import Pagination from '../../components/ui/Pagination';

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

  const togglePostExpansion = (reportId: number) => {
    setExpandedPosts(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }));
  };

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
              <div key={report.id} className="rounded-2xl border border-gray-400 bg-gray-600 p-5 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <div className="font-semibold">
                    Signalement #{report.id}
                  </div>
                  <div>
                    <ModerationBadge state={report.status} />
                  </div>
                </div>

                <div className="mb-2 text-sm text-gray-300">
                  Par : {report.reporter?.username || 'Utilisateur inconnu'}
                </div>

                <div className="mb-3 text-sm">
                  <span className="font-medium">Raison :</span> {report.reason}
                </div>

                {report.topic && (
                  <>
                    <div className="mb-2 rounded-lg bg-gray-700 p-3 text-sm">
                      <div className="font-medium pb-2 mb-2 border-b-2 border-gray-600">Topic concerné #{report.topic.id}</div>
                      <div>{report.topic.title}</div>
                    </div>

                    <div className="mb-0 mt-3">
                      <TopicModerationActions topic={report.topic} onUpdated={() => loadReports(currentPage)} />
                    </div>
                  </>
                )}

                {report.post && (
                  <>
                    <div className="rounded-lg bg-gray-700 p-3 text-sm">
                      <div className="font-medium pb-2 mb-2 border-b-2 border-gray-600">Message concerné #{report.post!.id}</div>
                      <div>
                        {(() => {
                          const isExpanded = expandedPosts[report.id] || false;
                          const content = report.post!.content;
                          const shouldTruncate = content.length > 150;
                          const displayContent = shouldTruncate && !isExpanded
                            ? content.substring(0, 150) + '...'
                            : content;

                          return (
                            <>
                              <ShowMarkdown content={displayContent} />
                              {shouldTruncate && (
                                <button
                                  onClick={() => togglePostExpansion(report.id)}
                                  className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
                                >
                                  {isExpanded ? 'Voir moins' : 'Voir plus'}
                                </button>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="mb-0 mt-3">
                      <PostModerationActions post={report.post} onUpdated={() => loadReports(currentPage)} />
                    </div>
                  </>
                )}

                <div className="mt-3 text-xs text-gray-300">
                  Créé le {new Date(report.createdAt).toLocaleString()}
                </div>
              </div>
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