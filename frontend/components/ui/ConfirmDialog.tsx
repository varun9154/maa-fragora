"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111111] p-7 shadow-2xl">

        <div className="mb-6 flex items-start justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">

              <AlertTriangle size={22} />

            </div>

            <div>

              <h2 className="text-xl font-bold text-white">
                {title}
              </h2>

            </div>

          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-full p-2 text-gray-500 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
            aria-label="Close"
          >
            <X size={20} />
          </button>

        </div>

        <p className="leading-7 text-gray-400">
          {message}
        </p>

        <div className="mt-8 flex justify-end gap-3">

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-white/30 hover:text-white disabled:opacity-40"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Processing..." : confirmText}
          </button>

        </div>

      </div>

    </div>
  );
}