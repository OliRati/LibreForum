type Props = {
  title: string;
  description?: string;
};

export default function EmptyState({ title, description }: Props) {
  return (
    <div className="rounded-2xl border-2 border-dashed dark:border-zinc-700 border-zinc-300 bg-zinc-500/50 dark:bg-zinc-900/50 p-8 text-center">
      <h3 className="text-xl font-semibold dark:text-zinc-200 text-zinc-950">{title}</h3>
      {description && (
        <p className="mt-2 text-sm dark:text-zinc-400 text-zinc-900">{description}</p>
      )}
    </div>
  );
}