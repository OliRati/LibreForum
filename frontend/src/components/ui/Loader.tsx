export default function Loader() {
  return (
    <div role="status" aria-label="Chargement" className="flex items-center justify-center py-10">
      <div className="relative h-11 w-11 animate-spin rounded-full border border-zinc-500/50 motion-reduce:animate-none">
        <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-emerald-500" />
      </div>
    </div>
  );
}