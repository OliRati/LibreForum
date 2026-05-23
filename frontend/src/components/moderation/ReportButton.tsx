import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../ui/Modal';
import Alert from '../ui/Alert';
import { createReport } from '../../services/reports';
import { useAuthStore } from '../../features/auth/authStore';

interface ReportButtonProps {
  topicId?: number;
  postId?: number;
  label?: string;
}

export default function ReportButton({
  topicId,
  postId,
  label = 'Signaler',
}: ReportButtonProps) {
  const token = useAuthStore((state) => state.token);
  const [open, setOpen] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!reason.trim()) {
      setError('Veuillez indiquer une raison.');
      return;
    }

    try {
      setLoading(true);

      await createReport({
        topicId,
        postId,
        reason,
      });

      setSuccess('Signalement envoyé.');
      setReason('');

      setTimeout(() => {
        setOpen(false);
        setSuccess('');
      }, 1000);
    } catch (err) {
      console.error(err);
      setError('Impossible d’envoyer le signalement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          if (!token) {
            setShowLoginAlert(true);
          } else {
            setOpen(true);
          }
        }}
        className="rounded border px-3 py-1 text-sm text-zinc-200 hover:bg-gray-500"
      >
        {label}
      </button>

      {showLoginAlert && (
        <Alert
          type="info"
          message={
            <div>
              Vous devez être connecté pour signaler un contenu.{' '}
              <Link to="/login" className="text-indigo-400 hover:underline">
                Connectez-vous
              </Link>{' '}
              ou{' '}
              <Link to="/register" className="text-indigo-400 hover:underline">
                inscrivez-vous
              </Link>
              .
            </div>
          }
          onClose={() => setShowLoginAlert(false)}
        />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Signaler ce contenu">
        <div className="space-y-4">
          <p className="text-sm text-left text-gray-200 pb-2">
            Explique brièvement pourquoi ce contenu doit être signalé.
          </p>

          <textarea
            className="min-h-[120px] w-full rounded border px-3 py-2"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex: spam, insultes, hors-sujet, contenu offensant..."
          />

          {error && <div className="text-sm text-orange-400">{error}</div>}
          {success && <div className="text-sm text-green-400">{success}</div>}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setOpen(false)}
              className="rounded border transition border-gray-300 px-4 py-2 text-sm hover:bg-gray-500"
            >
              Annuler
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded border transition border-emerald-300 bg-emerald-600 px-4 py-2 text-sm hover:bg-emerald-500 text-white font-semibold"
            >
              {loading ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}