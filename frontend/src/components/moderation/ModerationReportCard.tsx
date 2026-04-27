import { useEffect, useState } from 'react';
import { getReport } from '../../services/reports';
import type { Report } from '../../types/report';
import TopicModerationActions from '../../components/moderation/TopicModerationActions';
import PostModerationActions from '../../components/moderation/PostModerationActions';
import ModerationBadge from '../../components/moderation/ModerationBadge';
import ShowMarkdown from '../../components/ui/ShowMarkdown';

type Props = {
    report: Report;
}

export default function ModerationReportCard({ report }: Props) {
    const [loading, setLoading] = useState(true);
    const [curentReport, setCurentReport] = useState<Report>(report);
    const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>({});
    const [error, setError] = useState('');

    const loadReport = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getReport(report.id);
            setCurentReport(data);
        } catch (err) {
            console.error(err);
            setError("Impossible de charger les signalements.");
        } finally {
            setLoading(false);
        }
    };

    const togglePostExpansion = (reportId: number) => {
        setExpandedPosts(prev => ({
            ...prev,
            [reportId]: !prev[reportId]
        }));
    };

    return (
        <>
            <div key={curentReport.id} className="rounded-2xl border border-gray-400 bg-gray-600 text-gray-200 p-5 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                    <div className="font-semibold">
                        Signalement #{curentReport.id}
                    </div>
                    <div>
                        <ModerationBadge state={curentReport.status} />
                    </div>
                </div>

                <div className="mb-2 text-sm text-gray-300">
                    Par : {curentReport.reporter?.username || 'Utilisateur inconnu'}
                </div>

                <div className="mb-3 text-sm">
                    <span className="font-medium">Raison :</span> {curentReport.reason}
                </div>

                {curentReport.topic && (
                    <>
                        <div className="mb-2 rounded-lg bg-gray-700 p-3 text-sm">
                            <div className="font-medium pb-2 mb-2 border-b-2 border-gray-600">Topic concerné #{curentReport.topic.id}</div>
                            <div>{curentReport.topic.title}</div>
                        </div>

                        <div className="mb-0 mt-3">
                            <TopicModerationActions topic={curentReport.topic} onUpdated={() => loadReport()} />
                        </div>
                    </>
                )}

                {curentReport.post && (
                    <>
                        <div className="rounded-lg bg-gray-700 p-3 text-sm">
                            <div className="font-medium pb-2 mb-2 border-b-2 border-gray-600">Message concerné #{curentReport.post!.id}</div>
                            <div>
                                {(() => {
                                    const isExpanded = expandedPosts[curentReport.id] || false;
                                    const content = curentReport.post!.content;
                                    const shouldTruncate = content.length > 150;
                                    const displayContent = shouldTruncate && !isExpanded
                                        ? content.substring(0, 150) + '...'
                                        : content;

                                    return (
                                        <>
                                            <ShowMarkdown content={displayContent} />
                                            {shouldTruncate && (
                                                <button
                                                    onClick={() => togglePostExpansion(curentReport.id)}
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
                            <PostModerationActions post={curentReport.post} onUpdated={() => loadReport()} />
                        </div>
                    </>
                )}

                <div className="mt-3 text-xs text-gray-300">
                    Créé le {new Date(curentReport.createdAt).toLocaleString()}
                </div>
            </div>
        </>
    );
}