import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubjectCategory, CourseLevel, Difficulty } from '../../types';
import { X, ArrowRight, ArrowLeft, CheckCircle2, BookOpen, Award, HelpCircle } from 'lucide-react';

interface CourseWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CourseWizardModal: React.FC<CourseWizardModalProps> = ({ isOpen, onClose }) => {
  const { createCourse, navigateTo } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Basic Info
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<SubjectCategory>('Python');
  const [level, setLevel] = useState<CourseLevel>('Foundation');
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
  const [duration, setDuration] = useState('4 Weeks (16 Hours)');
  const [description, setDescription] = useState('');
  const [topicsInput, setTopicsInput] = useState('Variables, Syntax, Functions');

  // Step 2: Optional Features Toggles (Section 10.5 Item 17)
  const [includeQuizzes, setIncludeQuizzes] = useState(true);
  const [awardCertificate, setAwardCertificate] = useState(true);
  const [publishImmediately, setPublishImmediately] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && !title.trim()) {
      alert('Please enter a course title');
      return;
    }
    if (step < 3) {
      setStep((prev) => (prev + 1) as any);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as any);
    }
  };

  const handleFinish = () => {
    const topics = topicsInput.split(',').map(t => t.trim()).filter(Boolean);
    const newCourse = createCourse({
      title,
      subject,
      level,
      difficulty,
      duration,
      description,
      topics,
      quizzesEnabled: includeQuizzes,
      certificateEnabled: awardCertificate,
      published: publishImmediately
    });

    onClose();
    // Navigate to course detail or editor
    navigateTo('trainer_editor', newCourse.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative space-y-6 animate-in fade-in zoom-in-95">
        {/* Header & Steps Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#E9DDF3] text-[#3E205D]">
                Step {step} of 3
              </span>
              <span className="text-xs font-medium text-slate-500">Guided Course Creation</span>
            </div>
            <h2 className="font-heading font-bold text-xl text-slate-900 mt-1">
              {step === 1 && 'Course Details & Scope'}
              {step === 2 && 'Assessment & Accreditation Toggles'}
              {step === 3 && 'Curriculum Review & Initialization'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Course Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Applied Python Data Engineering"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20 focus:border-[#3E205D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Subject Category</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as SubjectCategory)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20"
                >
                  <option value="Python">Python</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="Ethical Hacking">Ethical Hacking</option>
                  <option value="Social Media Management">Social Media Management</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Progression Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as CourseLevel)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20"
                >
                  <option value="Foundation">Foundation</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Estimated Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 4 Weeks (16 Hours)"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Overview Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="High-level summary of what students will achieve in this program..."
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Core Topics / Tags (comma separated)</label>
              <input
                type="text"
                value={topicsInput}
                onChange={(e) => setTopicsInput(e.target.value)}
                placeholder="Syntax, Flow Control, Practice"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20"
              />
            </div>
          </div>
        )}

        {/* Step 2: Toggles */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Select which assessment modules and completion deliverables are active for this curriculum.
            </p>

            <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#3E205D] flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Include Quizzes & Exercises</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Enables multiple-choice, code snippet, and text assessments with instant scoring.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeQuizzes}
                  onChange={(e) => setIncludeQuizzes(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3E205D]"></div>
              </label>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Award Certificate on Completion</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Issues a cryptographically signed completion certificate once passing score is attained.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={awardCertificate}
                  onChange={(e) => setAwardCertificate(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3E205D]"></div>
              </label>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Publish to Catalog Immediately</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Toggle to draft if you prefer authoring all lesson blocks before public release.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishImmediately}
                  onChange={(e) => setPublishImmediately(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3E205D]"></div>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-2">
              <h4 className="font-heading font-bold text-sm text-[#3E205D]">Review Curriculum Specification</h4>
              <div className="space-y-1 text-slate-700">
                <p><strong>Title:</strong> {title || 'Untitled Course'}</p>
                <p><strong>Subject & Level:</strong> {subject} • {level} Level ({difficulty})</p>
                <p><strong>Duration:</strong> {duration}</p>
                <p><strong>Quizzes Included:</strong> {includeQuizzes ? 'Yes' : 'No'}</p>
                <p><strong>Certificate Awarded:</strong> {awardCertificate ? 'Yes' : 'No'}</p>
                <p><strong>Status:</strong> {publishImmediately ? 'Published' : 'Draft (Unpublished)'}</p>
              </div>
            </div>

            <p className="text-slate-500 text-[11px] leading-relaxed">
              Clicking "Create & Open Lesson Editor" will record the course in Supabase data schemas and open the content block authoring screen.
            </p>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={step === 1 ? onClose : handlePrev}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Create & Open Lesson Editor</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
