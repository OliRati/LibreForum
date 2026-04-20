interface ModerationBadgeProps {
  status?: string | null;
  state?: string | null;
  isPinned?: boolean;
  isLocked?: boolean;
  toxicityScore?: number | null;
}

export default function ModerationBadge({
  status,
  state,
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
        <span className="rounded bg-orange-500/20 px-2 py-1 text-xs text-orange-300">
          Signalé
        </span>
      )}

      {status === 'blocked' && (
        <span className="rounded  bg-pink-500/20 px-2 py-1 text-xs text-pink-300">
          Bloqué
        </span>
      )}

      {status === 'approved' && (
        <span className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-300">
          Validé
        </span>
      )}

      {state === 'pending' && (
        <span className="rounded bg-olive-400/20 px-2 py-1 text-xs text-olive-100">
          En attente
        </span>
      )}

      {state === 'resolved' && (
        <span className="rounded bg-cyan-500/20 px-2 py-1 text-xs text-cyan-300">
          Résolue
        </span>
      )}

      {toxicityScore !== undefined && toxicityScore !== null && (
        <span className="rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-300">
          Toxicité: {(toxicityScore * 100).toFixed(0)}%
        </span>
      )}
    </div>
  );
}