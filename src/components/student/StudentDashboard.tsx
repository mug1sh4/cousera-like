import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatLevel } from '../../utils/formatters';
import {
  Play,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Sparkles,
  FileText
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    courses,
    lessons,
    progress,
    certificates,
    navigateTo,
    setIsTutorOpen,
    isLessonCompleted,
    getCourseProgressPercent
  } = useApp();

  // Find most recent progress among courses that still exist
  const existingCourseIds = new Set(courses.map(c => c.id));
  const studentProgress = progress.filter(p => p.userId === currentUser?.id && existingCourseIds.has(p.courseId));
  
  // Sort progress by lastVisitedAt
  const sortedProgress = [...studentProgress].sort((a, b) => 
    new Date(b.lastVisitedAt).getTime() - new Date(a.lastVisitedAt).getTime()
  );

  const lastActiveProgress = sortedProgress[0];
  const lastActiveCourse = courses.find(c => c.id === lastActiveProgress?.courseId) || courses[0] || null;
  const lastActiveLesson = lastActiveCourse
    ? lessons.find(l => l.id === lastActiveProgress?.lessonId && l.courseId === lastActiveCourse.id) || 
      lessons.find(l => l.courseId === lastActiveCourse.id && !isLessonCompleted(l.id)) ||
      lessons.find(l => l.courseId === lastActiveCourse.id) ||
      null
    : null;

  const currentCourseProgress = lastActiveCourse ? getCourseProgressPercent(lastActiveCourse.id) : 0;

  // Overall Statistics
  const completedLessonCount = studentProgress.filter(p => p.completed).length;
  const averageScore = studentProgress.length > 0
    ? Math.round(studentProgress.reduce((acc, curr) => acc + (curr.score || 0), 0) / studentProgress.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-semibold text-[#3E205D] uppercase tracking-wider">
            Student Learning Portal
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Welcome back, {currentUser?.name || 'Learner'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentUser?.title || 'Junior Software Fellow'} • Track your curriculum progress and interactive coding labs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTutorOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-[#E9DDF3] text-[#3E205D] hover:bg-purple-200 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-purple-200"
          >
            <Sparkles className="w-4 h-4 text-[#3E205D]" />
            <span>Open AI Tutor</span>
          </button>
          <button
            onClick={() => navigateTo('catalog')}
            className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer"
          >
            Browse More Courses
          </button>
        </div>
      </div>

      {/* Prominent "Continue Learning" Banner (Section 10 Mandate) */}
      {lastActiveCourse && lastActiveLesson ? (
        <div className="bg-gradient-to-r from-[#3E205D] to-[#2A1342] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#E9DDF3]/20 border border-[#E9DDF3]/30 text-[#E9DDF3] text-xs font-semibold">
                <Play className="w-3 h-3 fill-current" />
                <span>Continue Exactly Where You Left Off</span>
              </div>

              <h2 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight">
                {lastActiveLesson.title}
              </h2>

              <p className="text-xs text-slate-300">
                Part of <strong>{lastActiveCourse.title}</strong> • {lastActiveLesson.duration}
              </p>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2 max-w-md">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Course Completion</span>
                  <span className="font-semibold text-[#E9DDF3]">{currentCourseProgress}%</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E9DDF3] rounded-full transition-all duration-300"
                    style={{ width: `${currentCourseProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex md:justify-end">
              <button
                onClick={() => navigateTo('lesson_view', lastActiveCourse.id, lastActiveLesson.id)}
                className="px-6 py-3 rounded-xl bg-[#E9DDF3] hover:bg-white text-[#3E205D] font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Resume Lesson</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-heading text-lg font-bold text-slate-800">No active course in progress</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You are not currently enrolled in any active curriculums. Explore our technical tracks to start learning.
          </p>
          <button
            onClick={() => navigateTo('catalog')}
            className="px-4 py-2 bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Browse Course Catalog
          </button>
        </div>
      )}

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => navigateTo('progress_view')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium group-hover:text-[#3E205D] transition-colors">Completed Lessons</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-heading text-2xl font-bold text-slate-900">{completedLessonCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Across all active modules</p>
        </div>

        <div
          onClick={() => navigateTo('progress_view')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium group-hover:text-[#3E205D] transition-colors">Average Quiz Score</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-heading text-2xl font-bold text-slate-900">{averageScore}%</div>
          <p className="text-[11px] text-slate-400 mt-1">First-pass evaluation accuracy</p>
        </div>

        <div
          onClick={() => navigateTo('progress_view')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium group-hover:text-[#3E205D] transition-colors">Capability Credentials</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-heading text-2xl font-bold text-slate-900">{certificates.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Cryptographically verifiable</p>
        </div>

        <div
          onClick={() => {
            const el = document.getElementById('enrolled-courses');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              navigateTo('catalog');
            }
          }}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium group-hover:text-[#3E205D] transition-colors">Active Curriculums</span>
            <BookOpen className="w-4 h-4 text-sky-600" />
          </div>
          <div className="font-heading text-2xl font-bold text-slate-900">
            {courses.filter(c => getCourseProgressPercent(c.id) > 0).length || 1}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Technical tracks underway</p>
        </div>
      </div>

      {/* Enrolled Tracks / Active Courses Grid */}
      <div id="enrolled-courses" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-lg text-slate-900">Your Enrolled Courses</h2>
            <p className="text-xs text-slate-500">Pick up any subject track or review completed modules.</p>
          </div>
          <button
            onClick={() => navigateTo('progress_view')}
            className="text-xs font-semibold text-[#3E205D] hover:underline cursor-pointer"
          >
            View Full Progress Details
          </button>
        </div>

        {courses.filter(c => c.published).length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center max-w-md mx-auto space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-heading font-semibold text-slate-800 text-base">No Enrolled Courses Found</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              You haven't enrolled in any curriculum tracks yet. Browse our catalog to discover technical programs and start learning.
            </p>
            <button
              onClick={() => navigateTo('catalog')}
              className="mt-2 px-4 py-2 bg-[#3E205D] text-[#E9DDF3] text-xs font-semibold rounded-lg hover:bg-[#4F2B76] transition-colors cursor-pointer"
            >
              Browse Course Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.filter(c => c.published).map(course => {
              const progressPct = getCourseProgressPercent(course.id);
              const courseLessons = lessons.filter(l => l.courseId === course.id && l.published);
              const completedCount = courseLessons.filter(l => isLessonCompleted(l.id)).length;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#E9DDF3] text-[#3E205D] font-semibold">
                        {course.subject}
                      </span>
                      <span className="text-slate-500 font-medium">{formatLevel(course.level)}</span>
                    </div>

                    <h3 className="font-heading font-semibold text-base text-slate-900 group-hover:text-[#3E205D] transition-colors">
                      {course.title}
                    </h3>

                    <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>{completedCount} of {courseLessons.length} lessons finished</span>
                        <span className="font-semibold text-slate-800">{progressPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3E205D] rounded-full transition-all"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">{course.duration}</span>
                    <button
                      onClick={() => {
                        const firstIncomplete = courseLessons.find(l => !isLessonCompleted(l.id)) || courseLessons[0];
                        navigateTo('lesson_view', course.id, firstIncomplete?.id || null);
                      }}
                      className="text-xs font-semibold text-[#3E205D] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{progressPct > 0 ? 'Resume' : 'Start'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
