type Props = {
  name: string;
};

export default function TagBadge({ tag }: Props) {
  return (
    <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-medium text-sky-300">
      #{tag}
    </span>
  );
}