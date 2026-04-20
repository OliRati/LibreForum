import { Link } from "react-router-dom";
import type { Category } from "../../api/categories";
import { formatDate } from "../../lib/formatDate";

type Props = {
  category: Category;
};

export default function CategoryCard({ category }: Props) {
  return (
    <Link
      to={`/category/${category.id}`}
      className="block rounded-2xl border border-zinc-700 bg-zinc-900 p-5 shadow-sm transition hover:border-zinc-700 hover:bg-zinc-800"
    >
      <h3 className="text-lg font-semibold text-zinc-100">{category.name}</h3>
      <hr className="my-3 border-2 border-gray-700"/>
      <p className="mt-2 text-sm text-zinc-400">
        {category.description || "Aucune description"}
      </p>
      <div className="mt-4 grid grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-lg font-semibold text-zinc-100">{category.topicsCount ?? 0}</p>
          <p className="text-xs text-zinc-500">Sujets</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-zinc-100">{category.postsCount ?? 0}</p>
          <p className="text-xs text-zinc-500">Posts</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-zinc-100">{category.participantsCount ?? 0}</p>
          <p className="text-xs text-zinc-500">Participants</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-zinc-100">
            {category.lastContributionAt ? formatDate(category.lastContributionAt) : "Aucune"}
          </p>
          <p className="text-xs text-zinc-500">Dernière contrib.</p>
        </div>
      </div>
    </Link>
  );
}