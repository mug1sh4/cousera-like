import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatLevel } from '../../utils/formatters';
import {
  ArrowLeft,
  Clock,
  Award,
  BookOpen,
  CheckCircle2,
  Code,
  User,
  ShieldCheck,
  PlayCircle
} from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const {
    courses,
    lessons,
    selectedCourseId,
    currentUser,
    navigateTo,
    enrollCourse,
    setAuthModal,
    isLessonCompleted,
    getCourseProgressPercent
  } = useApp();

  const course = courses.find(c => c.id === selectedCourseId) || courses[0];

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="font-heading text-xl font-bold text-slate-800">Course Not Found</h2>
        <p className="text-xs text-slate-500">The requested curriculum may have been deleted or is not currently published.</p>
        <button
          onClick={() => navigateTo('catalog')}
          className="px-4 py-2 bg-[#3E205D] text-[#E9DDF3] text-xs font-semibold rounded-lg hover:bg-[#4F2B76] transition-colors cursor-pointer"
        >
          Return to Course Catalog
        </button>
      </div>
    );
  }

  const courseLessons = lessons
    .filter(l => l.courseId === course.id && l.published)
    .sort((a, b) => a.order - b.order);

  // Derive "What you'll learn" from course and lesson topics
  const learningOutcomes = Array.from(
    new Set([...course.topics, ...courseLessons.flatMap(l => l.topics)])
  );

  const isEnrolled = currentUser?.status === 'approved';
  const progressPercent = course ? getCourseProgressPercent(course.id) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigateTo('catalog')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#3E205D] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Course Catalog</span>
      </button>

      {/* Main Course Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left 2 Cols: Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-[#E9DDF3] text-[#3E205D] text-xs font-semibold">
                {course.subject}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                {formatLevel(course.level)}
              </span>
            </div>

            <h1 className="font-heading text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {course.description}
            </p>

            {/* Trainer Bio Card */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-11 h-11 rounded-full bg-[#3E205D] text-[#E9DDF3] flex items-center justify-center font-bold text-sm">
                {course.trainerName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">{course.trainerName}</p>
                <p className="text-[11px] text-slate-500">{course.trainerTitle}</p>
              </div>
            </div>
          </div>

          {/* Right Col: Primary Action & Specs Box */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
            <div className="space-y-2">
              <div className="text-xs text-slate-500 font-medium">Curriculum Details</div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center justify-between py-1 border-b border-slate-200">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Duration
                  </span>
                  <span className="font-semibold">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-200">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Lessons
                  </span>
                  <span className="font-semibold">{courseLessons.length} Modules</span>
                </div>
                {course.certificateEnabled && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-200">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Award className="w-3.5 h-3.5 text-purple-600" /> Capability Credential
                    </span>
                    <span className="font-semibold text-emerald-700">Included on Completion</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress if already in progress */}
            {currentUser && progressPercent > 0 && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Your Progress</span>
                  <span className="font-semibold text-[#3E205D]">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#3E205D] rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            <div>
              {currentUser ? (
                <button
                  onClick={() => enrollCourse(course.id)}
                  className="w-full py-3 px-4 rounded-lg bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{progressPercent > 0 ? 'Continue Learning' : 'Start Learning This Course'}</span>
                </button>
              ) : (
                <button
                  onClick={() => setAuthModal('signup')}
                  className="w-full py-3 px-4 rounded-lg bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign Up to Enroll</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-500 text-center leading-normal">
              Direct access to interactive exercises, code playground, and the Fusion AI Tutor.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: What you will learn & Syllabus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Syllabus */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="font-heading font-bold text-lg text-slate-900 mb-1">
              Syllabus & Curriculum Breakdown
            </h2>
            <p className="text-slate-500 text-xs mb-6">
              Complete these {courseLessons.length} modules sequentially to build mastery and earn your capability credential.
            </p>

            {courseLessons.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-xs text-slate-700">No modules added to this syllabus yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Curriculum modules and hands-on laboratory exercises are currently being authored for this track.
                </p>
                {currentUser?.role === 'trainer' || currentUser?.role === 'admin' ? (
                  <button
                    onClick={() => navigateTo('trainer_editor', course.id)}
                    className="mt-3 px-3.5 py-1.5 rounded-lg bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] text-xs font-semibold cursor-pointer transition-colors inline-block"
                  >
                    Open Curriculum Editor
                  </button>
                ) : (
                  <button
                    onClick={() => navigateTo('catalog')}
                    className="mt-3 px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors inline-block"
                  >
                    Browse Other Courses
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {courseLessons.map((lesson, idx) => {
                  const completed = isLessonCompleted(lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => {
                        if (currentUser?.status === 'approved') {
                          navigateTo('lesson_view', course.id, lesson.id);
                        } else if (!currentUser) {
                          setAuthModal('signup');
                        }
                      }}
                      className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 transition-all cursor-pointer bg-slate-50/50 hover:bg-white"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 ${
                            completed ? 'bg-emerald-100 text-emerald-800' : 'bg-[#E9DDF3] text-[#3E205D]'
                          }`}>
                            {completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <div>
                            <h3 className="font-heading font-semibold text-sm text-slate-900 hover:text-[#3E205D] transition-colors">
                              {lesson.title}
                            </h3>
                            <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                              {lesson.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {lesson.duration}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Code className="w-3 h-3 text-slate-400" />
                                {lesson.contentBlocks.filter(b => b.type === 'code_playground').length > 0 ? 'Interactive Code' : 'Text Lesson'}
                              </span>
                              <span>•</span>
                              <span>{lesson.exercises.length} Practice Exercises</span>
                            </div>
                          </div>
                        </div>

                        {completed && (
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 shrink-0">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: What You'll Learn & Accreditation details */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-heading font-semibold text-base text-slate-900">
              What You'll Learn
            </h3>
            <ul className="space-y-2.5">
              {learningOutcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#3E205D]/5 rounded-2xl border border-purple-200 p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#3E205D] text-[#E9DDF3] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-sm text-slate-900">
              Capability Credential
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Pass all module quizzes and exercises with a score of 70% or above to receive an accredited Fusion EduTech capability credential with verifiable cryptographic ID.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
