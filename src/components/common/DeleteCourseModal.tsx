import React from 'react';
import { Course } from '../../types';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteCourseModalProps {
  isOpen: boolean;
  course: Course | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const DeleteCourseModal: React.FC<DeleteCourseModalProps> = ({
  isOpen,
  course,
  onConfirm,
  onCancel,
  isDeleting = false
}) => {
  if (!isOpen || !course) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-course-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 id="delete-course-modal-title" className="font-heading font-bold text-lg text-slate-900">
            Delete Course
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Delete <strong className="text-slate-900">{course.title}</strong>? This cannot be undone.
          </p>
          <div className="p-3 bg-rose-50/70 rounded-lg border border-rose-100 text-xs text-rose-700">
            All associated modules, sandbox configurations, and student progress records for this curriculum will be permanently removed.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
