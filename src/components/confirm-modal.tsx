import { Dialog } from "@headlessui/react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
        <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
        {description && (
          <Dialog.Description className="mt-2 text-sm text-gray-600">
            {description}
          </Dialog.Description>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </Dialog>
  );
}
