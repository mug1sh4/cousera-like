import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import { Award, X, Check, Eye, Sliders, ShieldCheck } from 'lucide-react';

interface CertificateBuilderModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateBuilderModal: React.FC<CertificateBuilderModalProps> = ({ course, isOpen, onClose }) => {
  const { updateCourse } = useApp();

  const [threshold, setThreshold] = useState(course?.completionThreshold || 70);
  const [enabled, setEnabled] = useState(course?.certificateEnabled ?? true);
  const [saved, setSaved] = useState(false);

  if (!isOpen || !course) return null;

  const handleSave = () => {
    updateCourse(course.id, {
      certificateEnabled: enabled,
      completionThreshold: threshold
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E9DDF3] text-[#3E205D] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-900">
                Capability Credential Rules
              </h2>
              <p className="text-xs text-slate-500">
                Course: {course.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Controls */}
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900 block text-sm">Issue Capability Credential on Completion</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Automatically generate verifiable credential when a student completes all required modules and passes assessments above threshold.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3E205D]"></div>
            </label>
          </div>

          {enabled && (
            <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#3E205D]" />
                  <span>Minimum Required Score Threshold</span>
                </label>
                <span className="font-bold text-sm text-[#3E205D]">{threshold}%</span>
              </div>

              <input
                type="range"
                min={50}
                max={95}
                step={5}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-[#3E205D] cursor-pointer"
              />

              <p className="text-[11px] text-slate-500">
                Learners must achieve an average of at least {threshold}% across all module quizzes and exercises to earn their digital credential.
              </p>
            </div>
          )}
        </div>

        {/* Live Credential Visual Preview */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-700 block">Credential Visual Preview</span>
          <div className="border-4 border-[#E9DDF3] bg-white rounded-xl p-5 text-center text-xs space-y-2.5 shadow-2xs">
            <p className="font-heading font-bold text-[10px] uppercase tracking-widest text-[#3E205D]">
              Fusion EduTech • Verified Digital Credential
            </p>
            <h3 className="font-heading text-lg font-bold text-slate-900">
              Capability Credential
            </h3>
            <p className="text-slate-400 text-[10px]">This certifies that</p>
            <p className="font-heading font-bold text-slate-900 text-sm border-b-2 border-[#E9DDF3] inline-block px-4 py-0.5">
              [Student Full Name]
            </p>
            <p className="text-slate-600 text-[11px] max-w-sm mx-auto">
              has demonstrated practical mastery in <strong className="text-slate-900">{course.title}</strong>
            </p>
            <div className="pt-3 flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-100">
              <span>Trainer: Dr. Sarah Wanjiku</span>
              <span>Req. Score: ≥{threshold}%</span>
              <span>ID: FED-2026-XXXX</span>
            </div>
          </div>
        </div>

        {/* Save footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Rules Saved!</span>
              </>
            ) : (
              <span>Save Credential Rules</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
