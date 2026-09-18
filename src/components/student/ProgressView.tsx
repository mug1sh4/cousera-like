import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CertificateModal } from './CertificateModal';
import { Certificate } from '../../types';
import { formatLevel } from '../../utils/formatters';
import {
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Eye
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const {
    currentUser,
    courses,
    lessons,
    progress,
    certificates,
    navigateTo,
    isLessonCompleted,
    getCourseProgressPercent
  } = useApp();

  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  const studentProgress = progress.filter(p => p.userId === currentUser?.id);
  const studentCertificates = certificates.filter(c => c.userId === currentUser?.id);

  const completedCount = studentProgress.filter(p => p.completed).length;
  const totalPublishedLessons = lessons.filter(l => l.published).length;
  const overallPercentage = totalPublishedLessons > 0 ? Math.round((completedCount / totalPublishedLessons) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* View Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs font-semibold text-[#3E205D] uppercase tracking-wider">
          Accreditation & Analytics
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
          Academic Progress & Capability Credentials
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your module scores, completed laboratory milestones, and verified completion credentials.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Curriculum Completion</span>
            <TrendingUp className="w-4 h-4 text-[#3E205D]" />
          </div>
          <div className="font-heading text-3xl font-bold text-slate-900">{overallPercentage}%</div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-[#3E205D] rounded-full" style={{ width: `${overallPercentage}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            {completedCount} of {totalPublishedLessons} published modules finished
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Capability Credentials</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-heading text-3xl font-bold text-slate-900">{studentCertificates.length}</div>
          <p className="text-[11px] text-slate-500 mt-2">
            Eligible upon completing 100% of course exercises with ≥70% score
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">First-Pass Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-heading text-3xl font-bold text-slate-900">
            {studentProgress.length > 0
              ? Math.round(studentProgress.reduce((acc, curr) => acc + curr.score, 0) / studentProgress.length)
              : 0}%
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Combined quiz score across completed lessons
          </p>
        </div>
      </div>

      {/* Earned Certificates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-lg text-slate-900">
            Earned Capability Credentials
          </h2>
          <span className="text-xs text-slate-500">{studentCertificates.length} Issued</span>
        </div>

        {studentCertificates.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
            <Award className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-xs text-slate-700">No Capability Credentials Earned Yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Complete all lessons and quizzes in a course with a score of 70% or higher to automatically generate your verified credential.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentCertificates.map(cert => (
              <div
                key={cert.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between gap-4 hover:border-purple-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E9DDF3] text-[#3E205D] flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-sm text-slate-900 line-clamp-1">
                      {cert.courseTitle}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      ID: <span className="font-mono">{cert.certificateNumber}</span> • {cert.issueDate}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveCert(cert)}
                  className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Capability Credential</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Breakdown Table */}
      <div className="space-y-4">
        <h2 className="font-heading font-bold text-lg text-slate-900">
          Module-by-Module Curriculum Status
        </h2>

        <div className="space-y-6">
          {courses.filter(c => c.published).length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-xs text-slate-700">No Published Courses</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No published curricula are currently available for tracking.
              </p>
            </div>
          ) : (
            courses.filter(c => c.published).map(course => {
              const courseLessons = lessons.filter(l => l.courseId === course.id && l.published);
              const progressPct = getCourseProgressPercent(course.id);

            return (
              <div key={course.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                {/* Course Header Bar */}
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E9DDF3] text-[#3E205D]">
                        {course.subject}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {formatLevel(course.level)}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-slate-900 mt-1">
                      {course.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-800">{progressPct}% Complete</span>
                      <div className="w-28 h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-[#3E205D] rounded-full" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>

                    <button
                      onClick={() => navigateTo('course_detail', course.id)}
                      className="text-xs text-[#3E205D] hover:underline font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Lesson rows */}
                <div className="divide-y divide-slate-100 text-xs">
                  {courseLessons.map((l, idx) => {
                    const isDone = isLessonCompleted(l.id);
                    const prog = studentProgress.find(p => p.lessonId === l.id);

                    return (
                      <div key={l.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold text-[11px] ${
                            isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <div>
                            <span className="font-medium text-slate-900">{l.title}</span>
                            <span className="text-slate-400 text-[11px] ml-2">({l.duration})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {isDone ? (
                            <div className="text-right">
                              <span className="text-emerald-700 font-semibold text-[11px]">Completed</span>
                              {prog && <span className="text-slate-400 text-[10px] block">Score: {prog.score}%</span>}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Not Started</span>
                          )}

                          <button
                            onClick={() => navigateTo('lesson_view', course.id, l.id)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            {isDone ? 'Review' : 'Start'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal certificate={activeCert} onClose={() => setActiveCert(null)} />
    </div>
  );
};
