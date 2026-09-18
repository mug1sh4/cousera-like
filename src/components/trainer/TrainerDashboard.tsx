import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourseWizardModal } from './CourseWizardModal';
import { CertificateBuilderModal } from './CertificateBuilderModal';
import { DeleteCourseModal } from '../common/DeleteCourseModal';
import { Course } from '../../types';
import { formatLevel } from '../../utils/formatters';
import {
  AlertTriangle,
  Plus,
  BookOpen,
  Users,
  Award,
  CheckCircle2,
  FileEdit,
  Eye,
  Sliders,
  Sparkles,
  TrendingUp,
  Clock,
  Trash2
} from 'lucide-react';

export const TrainerDashboard: React.FC = () => {
  const {
    currentUser,
    courses,
    lessons,
    allUsers,
    progress,
    navigateTo,
    setIsStudentPreviewMode,
    deleteCourse,
    canDeleteCourse
  } = useApp();

  const [wizardOpen, setWizardOpen] = useState(false);
  const [certModalCourse, setCertModalCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Filter courses assigned to this trainer (or all if admin/lead trainer)
  const trainerCourses = courses.filter(c =>
    currentUser?.role === 'admin' ||
    c.trainerName === currentUser?.name ||
    c.trainerName?.includes('Sarah') ||
    (c.instructorName && c.instructorName.includes('Sarah'))
  );

  const totalStudents = allUsers.filter(u => u.role === 'student' && u.status === 'approved').length;
  const draftCourses = trainerCourses.filter(c => !c.published);
  const totalLessons = lessons.filter(l => trainerCourses.some(c => c.id === l.courseId)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-semibold text-[#3E205D] uppercase tracking-wider">
            Faculty Overview
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Trainer Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <strong>{currentUser?.name}</strong> ({currentUser?.title || 'Lead Technical Instructor'}) • Manage courses, interactive code sandboxes, and student mastery.
          </p>
        </div>

        <button
          onClick={() => setWizardOpen(true)}
          className="px-4 py-2.5 rounded-lg bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* "Needs Your Attention" Section */}
      <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-amber-800">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h2 className="font-heading font-bold text-base">
            Needs Your Attention (3 Action Items)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-2">
            <span className="font-semibold text-amber-900 block">
              2 Unanswered Student Queries
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Student Alex Kimani posted a clarification request on Python dictionary comprehension syntax.
            </p>
            <span className="text-[10px] text-amber-700 font-semibold block">Pending reply: 2h ago</span>
          </div>

          <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-200/80 space-y-2">
            <span className="font-semibold text-[#3E205D] block">
              {draftCourses.length} Course Track in Draft
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {draftCourses.length > 0 ? draftCourses[0].title : 'All courses currently published'}. Review sandbox exercises prior to release.
            </p>
            <span className="text-[10px] text-purple-700 font-semibold block">Awaiting syllabus review</span>
          </div>

          <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-200/80 space-y-2">
            <span className="font-semibold text-sky-900 block">
              Cohort Milestone Reached
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              84% of enrolled learners have finished Lesson 1 exercises in Python for Beginners.
            </p>
            <span className="text-[10px] text-sky-700 font-semibold block">Ready for Module 2 release</span>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => {
            const el = document.getElementById('assigned-courses-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium group-hover:text-[#3E205D] transition-colors">My Courses</span>
            <BookOpen className="w-4 h-4 text-[#3E205D]" />
          </div>
          <div className="font-heading text-2xl font-bold text-slate-900">{trainerCourses.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">{draftCourses.length} draft, {trainerCourses.length - draftCourses.length} live</p>
        </div>

        <div
          onClick={() => {
            const el = document.getElementById('assigned-courses-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium group-hover:text-[#3E205D] transition-colors">Active Students</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-heading text-2xl font-bold text-slate-900">{totalStudents}</div>
          <p className="text-[11px] text-slate-400 mt-1">Across all cohorts</p>
        </div>

        <div
          onClick={() => {
            const el = document.getElementById('assigned-courses-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium group-hover:text-[#3E205D] transition-colors">Average Completion</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-heading text-2xl font-bold text-slate-900">76%</div>
          <p className="text-[11px] text-slate-400 mt-1">On-track for credentials</p>
        </div>

        <div
          onClick={() => {
            if (trainerCourses[0]) {
              navigateTo('trainer_editor', trainerCourses[0].id);
            } else {
              setWizardOpen(true);
            }
          }}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium group-hover:text-[#3E205D] transition-colors">Managed Lessons</span>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-heading text-2xl font-bold text-slate-900">{totalLessons}</div>
          <p className="text-[11px] text-slate-400 mt-1">With interactive sandboxes</p>
        </div>
      </div>

      {/* Assigned Courses Management List */}
      <div id="assigned-courses-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-lg text-slate-900">
              Assigned Courses & Laboratories
            </h2>
            <p className="text-xs text-slate-500">
              Edit lesson blocks, manage quizzes, define completion rules, or preview as a student.
            </p>
          </div>
        </div>

        {trainerCourses.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center max-w-md mx-auto space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-heading font-semibold text-slate-800 text-base">No Assigned Courses</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              You currently have no course tracks assigned to your faculty portfolio. Create your first course track using the curriculum wizard.
            </p>
            <button
              onClick={() => setWizardOpen(true)}
              className="mt-2 px-4 py-2 bg-[#3E205D] text-[#E9DDF3] text-xs font-semibold rounded-lg hover:bg-[#4F2B76] transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Course</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {trainerCourses.map(course => {
              const courseLessons = lessons.filter(l => l.courseId === course.id);
              const pubLessons = courseLessons.filter(l => l.published);

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-purple-300 transition-all"
                >
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#E9DDF3] text-[#3E205D] font-semibold">
                        {course.subject}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        course.published ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {course.published ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-slate-600 font-medium">• {formatLevel(course.level)}</span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-slate-900">
                      {course.title}
                    </h3>

                    <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span>{courseLessons.length} Modules ({pubLessons.length} Published)</span>
                      <span>• {course.enrolledCount} Students Enrolled</span>
                      <span>• Req. Score: ≥{course.completionThreshold || 70}%</span>
                    </div>
                  </div>

                  {/* Management Action Buttons */}
                  <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => navigateTo('trainer_editor', course.id)}
                      className="px-4 py-2 rounded-lg bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Edit Content & Sandboxes</span>
                    </button>

                    <button
                      onClick={() => setCertModalCourse(course)}
                      className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5 text-slate-500" />
                      <span>Configure Credential Rules</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsStudentPreviewMode(true);
                        const firstLesson = courseLessons[0];
                        navigateTo('lesson_view', course.id, firstLesson?.id || null);
                      }}
                      className="px-4 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview as Student</span>
                    </button>

                    {canDeleteCourse(course) && (
                      <button
                        onClick={() => setCourseToDelete(course)}
                        className="px-4 py-2 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Delete Course</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <CourseWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />

      <CertificateBuilderModal
        course={certModalCourse}
        isOpen={!!certModalCourse}
        onClose={() => setCertModalCourse(null)}
      />

      <DeleteCourseModal
        isOpen={Boolean(courseToDelete)}
        course={courseToDelete}
        onConfirm={() => {
          if (courseToDelete) {
            deleteCourse(courseToDelete.id);
            setCourseToDelete(null);
          }
        }}
        onCancel={() => setCourseToDelete(null)}
      />
    </div>
  );
};
