import React from "react";
import { Dialog } from "@headlessui/react";
import { RotateCcw } from "lucide-react";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, message }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-md w-full bg-white rounded-lg shadow-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 text-red-600 p-2 rounded-full">
              <RotateCcw className="w-5 h-5" />
            </div>
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Confirm Action
            </Dialog.Title>
          </div>

          <Dialog.Description className="text-gray-600 text-sm">
            {message || "Are you sure you want to proceed with this action?"}
          </Dialog.Description>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Confirm
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
