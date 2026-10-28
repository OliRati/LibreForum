import { useEffect, useState } from 'react';
import { getUsers } from '../../services/users';
import type { User } from '../../types/user';
import EmptyState from '../../components/ui/EmptyState';
import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      setUsers(await getUsers());
    } catch (err) {
      console.error(err);
      setError("Impossible de charger la liste des utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return <div className="p-6">Chargement des utilisateurs...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <>
      <section className="text-left p-3 bg-red-100 border-red-200 dark:bg-red-950 border dark:border-red-800 rounded-xl">
        <Link to={'/admin/dashboard'} className="hover:text-zinc-500 hover:dark:text-zinc-300">
          Administration du système
        </Link>
      </section>

      <h1 className="mt-6 mb-6 text-2xl font-bold">Liste des utilisateurs</h1>

      {users.length === 0 ? (
        <EmptyState
          title="Aucun utilisateur"
          description="Aucun utilisateur à afficher."
        />
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="rounded-2xl border border-gray-400 bg-gray-600 p-5 text-gray-200 shadow-sm">
              <h2 className="font-semibold">{user.displayName || user.username}</h2>
              <p className="text-sm text-gray-300">{user.email}</p>
              <p className="mt-2 text-sm">Rôle(s) : {user.roles.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}