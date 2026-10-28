import { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl text-gray-300 bg-gray-900 border border-gray-700 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-500 px-5 py-2">
          <div className="text-lg font-semibold">{title || 'Modal'}</div>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 text-lg hover:bg-gray-800 hover:text-gray-200 transition-all"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}