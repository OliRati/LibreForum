import { useState } from 'react';
import Modal from '../ui/Modal';
import { createReport } from '../../services/reports';

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
  const [open, setOpen] = useState(false);
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
        onClick={() => setOpen(true)}
        className="rounded border px-3 py-1 text-sm text-zinc-200 hover:bg-gray-500"
      >
        {label}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Signaler ce contenu">
        <div className="space-y-4">
          <p className="text-sm text-gray-300 pb-2">
            Explique brièvement pourquoi ce contenu doit être signalé.
          </p>

          <textarea
            className="min-h-[120px] w-full rounded border px-3 py-2"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex: spam, insultes, hors-sujet, contenu offensant..."
          />

          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-green-600">{success}</div>}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setOpen(false)}
              className="rounded border px-4 py-2 text-sm"
            >
              Annuler
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded bg-black px-4 py-2 text-sm text-white"
            >
              {loading ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}