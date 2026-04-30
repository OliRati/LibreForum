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
      className="group block overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 hover:shadow-lg shadow-black dark:shadow-zinc-800 transition hover:border-zinc-700 hover:bg-zinc-800"
    >
      <div className="flex flex-col justify-between h-full items-center">

        <div className="w-full px-5 py-3 bg-zinc-800 group-hover:bg-zinc-700 transition">
          <h3 className="text-lg font-semibold text-zinc-100">{category.name}</h3>
        </div>

        <hr className="w-full border border-zinc-700" />

        <div className="w-full px-5 py-3">
          <p className="mt-2 text-sm text-zinc-400">
            {category.description || "Aucune description"}
          </p>
        </div>

        <div>
          <div className="mt-4 grid grid-cols-3 gap-6 text-center">
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
          </div>
        </div>

        <div className="mt-6 mb-2">
          <p className="text-xs text-zinc-500">Dernière activité : {category.lastContributionAt ? formatDate(category.lastContributionAt) : "Aucune"}</p>
        </div>

      </div>
    </Link>
  );
}