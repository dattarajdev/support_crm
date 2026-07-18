import { AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, ticketId, isDeleting, error }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs font-sans animate-fade-in">
      <div className="bg-white border border-slate-300 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up">
        <div className="p-6 space-y-6">
          
          {/* Header & Icon */}
          <div className="flex items-start space-x-4">
            <div className="p-2.5 bg-red-50 text-red-655 rounded-xl border border-red-100 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Delete Ticket?</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Are you sure you want to delete ticket <span className="font-mono font-bold text-red-600">{ticketId}</span>? This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-750 text-xs font-bold rounded-lg p-3.5 flex items-center space-x-2">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 border border-slate-300 bg-white text-slate-655 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 active:scale-[0.98] cursor-pointer shadow-md"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin h-3.5 w-3.5 text-white" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Ticket</span>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
