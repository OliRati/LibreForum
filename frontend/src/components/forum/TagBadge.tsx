import { Link } from "react-router-dom";

type Props = {
  tagName: string;
};

export default function TagBadge({ tagName }: Props) {
  return (
    <Link to={`/search?q=${encodeURIComponent('#' + tagName.trim())}`}>
      <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-medium text-sky-300 transition hover:border-sky-700 hover:bg-sky-800">
        #{tagName}
      </span>
    </Link>
  );
}