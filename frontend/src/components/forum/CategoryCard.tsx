import type { Category } from "../../api/categories";

type Props = {
  category: Category;
};

export default function CategoryCard({ category }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-zinc-100">{category.name}</h3>
      <p className="mt-2 text-sm text-zinc-400">
        {category.description || "Aucune description"}
      </p>
    </div>
  );
}