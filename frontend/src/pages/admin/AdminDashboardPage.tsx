import { Link } from 'react-router-dom';

const adminSections = [
  {
    title: 'Gestion des utilisateurs',
    description: 'Consultez les comptes, créez des utilisateurs et gérez leurs profils.',
    to: '/admin/users',
  },
  {
    title: 'Gestion des catégories',
    description: 'Organisez les espaces de discussion de LibreForum.',
    to: '/admin/categories',
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="text-left rounded-xl border border-red-200 bg-red-100 p-3 dark:border-red-800 dark:bg-red-950">
        <Link to="/admin/dashboard" className="hover:text-zinc-500 dark:hover:text-zinc-300">
          Administration du système
        </Link>
      </section>

      <header>
        <h1 className="text-3xl font-bold">Administration du système</h1>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-400">
          Sélectionnez une section à administrer.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {adminSections.map((section) => (
          <Link
            key={section.to}
            to={section.to}
            className="group rounded-2xl border border-zinc-500 bg-zinc-300 p-6 shadow-sm transition hover:border-red-400 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-red-800 dark:hover:bg-zinc-800"
          >
            <h2 className="text-xl font-semibold group-hover:text-red-800 dark:group-hover:text-red-300">
              {section.title}
            </h2>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-400">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
