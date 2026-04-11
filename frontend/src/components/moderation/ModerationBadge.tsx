interface ModerationBadgeProps {
  status?: string | null;
  isPinned?: boolean;
  isLocked?: boolean;
  toxicityScore?: number | null;
}

export default function ModerationBadge({
  status,
  isPinned,
  isLocked,
  toxicityScore
}: ModerationBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {isPinned && (
        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
          Épinglé
        </span>
      )}

      {isLocked && (
        <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-800">
          Verrouillé
        </span>
      )}

      {status === 'flagged' && (
        <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
          Signalé
        </span>
      )}

      {status === 'blocked' && (
        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
          Bloqué
        </span>
      )}

      {status === 'approved' && (
        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
          Validé
        </span>
      )}

      {toxicityScore !== undefined && toxicityScore !== null && (
        <span className="rounded-full bg-purple-100 px-2 py-1 text-xs">
          Toxicité: {(toxicityScore * 100).toFixed(0)}%
        </span>
      )}
    </div>
  );
}