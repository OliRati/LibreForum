import { useAuthStore } from "../features/auth/authStore";
import { useNavigate } from "react-router-dom";

export default function SessionExpiredModal() {
  const { sessionExpired, setSessionExpired } = useAuthStore();
  const navigate = useNavigate();

  if (!sessionExpired) return null;

  const handleReconnect = () => {
    setSessionExpired(false);
    navigate("/login");
  };

  const handleClose = () => {
    setSessionExpired(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-zinc-800 p-6 shadow-xl">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-zinc-100">
            Session expirée
          </h2>
        </div>
        <div className="mb-6">
          <p className="text-zinc-300">
            Par mesure de sécurité, vous avez été déconnecté après une période d'inactivité.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReconnect}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
          >
            Se reconnecter
          </button>
          <button
            onClick={handleClose}
            className="rounded-lg border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}