import { Link } from "react-router-dom";
import type { Category } from "../../api/categories";

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
    </Link>
  );
}