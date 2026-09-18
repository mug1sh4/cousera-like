import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-200"
    >
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-xs ${
          isSuccess
            ? 'bg-emerald-900/95 text-emerald-50 border-emerald-700 shadow-emerald-950/20'
            : isError
            ? 'bg-rose-900/95 text-rose-50 border-rose-700 shadow-rose-950/20'
            : 'bg-slate-900/95 text-slate-50 border-slate-700 shadow-slate-950/20'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
          {isError && <AlertCircle className="w-4 h-4 text-rose-300" />}
          {!isSuccess && !isError && <Info className="w-4 h-4 text-sky-300" />}
        </div>

        <div className="flex-1 text-xs font-medium leading-relaxed">
          {toast.message}
        </div>

        <button
          onClick={hideToast}
          aria-label="Dismiss notification"
          className="shrink-0 text-white/70 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
