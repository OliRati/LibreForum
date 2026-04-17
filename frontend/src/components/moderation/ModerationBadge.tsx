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
        <span className="rounded bg-amber-500/20 px-2 py-1 text-xs text-amber-300">
          Épinglé
        </span>
      )}

      {isLocked && (
        <span className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-300">
          Verrouillé
        </span>
      )}

      {status === 'flagged' && (
        <span className="rounded bg-orange-100 px-2 py-1 text-xs text-orange-800">
          Signalé
        </span>
      )}

      {status === 'blocked' && (
        <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-800">
          Bloqué
        </span>
      )}

      {status === 'approved' && (
        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
          Validé
        </span>
      )}

      {toxicityScore !== undefined && toxicityScore !== null && (
        <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-600">
          Toxicité: {(toxicityScore * 100).toFixed(0)}%
        </span>
      )}
    </div>
  );
}