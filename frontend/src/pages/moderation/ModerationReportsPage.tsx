import { useEffect, useState } from 'react';
import { getReports } from '../../services/reports';
import type { Report } from '../../types/report';

export default function ModerationReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReports = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getReports();
      setReports(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les signalements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

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
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <div className="font-semibold">
                  Signalement #{report.id}
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                  {report.status}
                </span>
              </div>

              <div className="mb-2 text-sm text-gray-600">
                Par : {report.reporter?.username || 'Utilisateur inconnu'}
              </div>

              <div className="mb-3 text-sm">
                <span className="font-medium">Raison :</span> {report.reason}
              </div>

              {report.topic && (
                <div className="mb-2 rounded-lg bg-gray-50 p-3 text-sm">
                  <div className="font-medium">Topic concerné</div>
                  <div>#{report.topic.id} — {report.topic.title}</div>
                </div>
              )}

              {report.post && (
                <div className="rounded-lg bg-gray-50 p-3 text-sm">
                  <div className="font-medium">Message concerné</div>
                  <div>{report.post.content}</div>
                </div>
              )}

              <div className="mt-3 text-xs text-gray-500">
                Créé le {new Date(report.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}