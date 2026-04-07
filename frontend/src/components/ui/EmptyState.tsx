type Props = {
  title: string;
  description?: string;
};

export default function EmptyState({ title, description }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/50 p-8 text-center">
      <h3 className="text-xl font-semibold text-zinc-200">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-zinc-400">{description}</p>
      )}
    </div>
  );
}