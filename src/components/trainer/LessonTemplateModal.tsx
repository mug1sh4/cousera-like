import React from 'react';
import { X, FileCode2, Video, Sparkles, Check, ArrowRight } from 'lucide-react';

export type LessonTemplateType = 'no_video' | 'video_only' | 'hybrid';

interface LessonTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: LessonTemplateType) => void;
}

export const LessonTemplateModal: React.FC<LessonTemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  if (!isOpen) return null;

  const templates: {
    id: LessonTemplateType;
    title: string;
    badge: string;
    badgeColor: string;
    icon: React.ReactNode;
    description: string;
    blocksSummary: string[];
    recommendedFor: string;
  }[] = [
    {
      id: 'no_video',
      title: 'Interactive Text & Sandbox',
      badge: 'No Video',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: <FileCode2 className="w-6 h-6 text-blue-600" />,
      description: 'Focuses on structured pedagogical reading material paired directly with an in-browser Python execution sandbox.',
      blocksSummary: ['Text Explanation & Concepts', 'Interactive Python Sandbox'],
      recommendedFor: 'Algorithmic logic, syntax deep-dives, fast-reading reference modules.'
    },
    {
      id: 'video_only',
      title: 'Video Masterclass',
      badge: 'Video Only',
      badgeColor: 'bg-purple-50 text-[#3E205D] border-purple-200',
      icon: <Video className="w-6 h-6 text-[#3E205D]" />,
      description: 'Centered on high-production recorded video lectures with chapter markers, transcripts, and closed captions.',
      blocksSummary: ['Video Player with Chapters & Captions', 'Lecture Notes & Resources'],
      recommendedFor: 'Architecture overviews, visual walkthroughs, executive summaries.'
    },
    {
      id: 'hybrid',
      title: 'Hybrid Walkthrough & Sandbox',
      badge: 'Hybrid (Video + Code)',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <Sparkles className="w-6 h-6 text-emerald-600" />,
      description: 'The complete learning journey: watch a video demonstration, study written notes, and write code in the live sandbox.',
      blocksSummary: ['Video Walkthrough', 'Key Syntax Notes', 'Interactive Code Sandbox'],
      recommendedFor: 'Comprehensive modules requiring both video demonstration and active student coding.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 sm:p-8 relative space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-semibold text-[#3E205D] uppercase tracking-wider">
              Course Authoring Workflow
            </span>
            <h2 className="font-heading font-bold text-xl text-slate-900 mt-0.5">
              Select Lesson Template
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Choose a structure to initialize this lesson. You can freely add, reorder, or customize blocks later.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Template Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map(tmpl => (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl.id)}
              className="rounded-xl border border-slate-200 hover:border-[#3E205D] hover:shadow-md p-5 flex flex-col justify-between transition-all bg-white hover:bg-slate-50/50 cursor-pointer group space-y-4 text-left"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-[#E9DDF3] transition-colors">
                    {tmpl.icon}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tmpl.badgeColor}`}>
                    {tmpl.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-sm text-slate-900 group-hover:text-[#3E205D] transition-colors">
                    {tmpl.title}
                  </h3>
                  <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Included Blocks:
                  </span>
                  {tmpl.blocksSummary.map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-[#3E205D] shrink-0" />
                      <span className="text-[11px] leading-tight">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  className="w-full py-2 px-3 rounded-lg bg-slate-100 group-hover:bg-[#3E205D] text-slate-800 group-hover:text-[#E9DDF3] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Use This Template</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Need custom structure? Start with any template and add/remove blocks freely.</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
