import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatLevel } from '../../utils/formatters';
import {
  Code,
  Terminal,
  BrainCircuit,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigateTo, setAuthModal, courses } = useApp();

  const publishedCourses = courses.filter(c => c.published);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#3E205D] via-[#2A1342] to-slate-950 rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl border border-purple-900/30">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E9DDF3]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="max-w-3xl relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9DDF3]/15 border border-[#E9DDF3]/20 text-[#E9DDF3] text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fusion EduTech Learning Platform</span>
            </div>

            <h1 className="font-heading font-bold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              We turn knowledge into capability.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              A modern, high-rigor learning management platform designed for practical mastery.
              Explore structured technical curriculums with live browser-based code execution, progressive quizzes, verified certificates, and contextual AI tutoring.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigateTo('catalog')}
                className="px-6 py-3 rounded-lg bg-[#E9DDF3] text-[#3E205D] hover:bg-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Browse Course Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setAuthModal('signup')}
                className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Create Student Account</span>
              </button>
            </div>

            {/* Quick Trust Highlights */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E9DDF3]" />
                <span>Interactive Python Playground</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E9DDF3]" />
                <span>Subject & Level Progression</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E9DDF3]" />
                <span>Completion Certificates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E9DDF3]" />
                <span>Server-Side AI Tutor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Catalog Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-[#3E205D] uppercase tracking-wider">Curriculum Catalog</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Curated Technical Programs
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Browse by subject and sequential levels from Level I to Level III capability.
            </p>
          </div>
          <button
            onClick={() => navigateTo('catalog')}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#3E205D] hover:underline cursor-pointer"
          >
            <span>View all courses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {publishedCourses.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-xs text-slate-700">No Published Curriculums Yet</p>
            <p className="text-xs text-slate-500">Check back soon as new technical programs are published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedCourses.slice(0, 6).map(course => (
              <div
                key={course.id}
                onClick={() => navigateTo('course_detail', course.id)}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-purple-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#E9DDF3] text-[#3E205D]">
                    {course.subject}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {formatLevel(course.level)}
                  </span>
                </div>

                <h3 className="font-heading font-semibold text-lg text-slate-900 group-hover:text-[#3E205D] transition-colors leading-snug">
                  {course.title}
                </h3>

                <p className="text-slate-600 text-xs mt-2 leading-relaxed line-clamp-2">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {course.topics.slice(0, 3).map((topic, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600">
                      {topic}
                    </span>
                  ))}
                  {course.topics.length > 3 && (
                    <span className="text-[11px] px-1.5 py-0.5 text-slate-400">
                      +{course.topics.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-slate-700">{course.trainerName}</span>
                </div>
                <span className="font-medium text-slate-700">{course.duration}</span>
              </div>
            </div>
          ))}
        </div>
      )}

        <div className="text-center mt-8 sm:hidden">
          <button
            onClick={() => navigateTo('catalog')}
            className="w-full py-3 rounded-lg border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50"
          >
            View all courses
          </button>
        </div>
      </section>

      {/* 3 Pillars of Fusion Learning Architecture */}
      <section className="bg-slate-100 py-12 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold text-[#3E205D] uppercase tracking-wider">How We Deliver Capability</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Built for Real Technical Progression
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Replacing passive video playback with applied coding, active recall assessments, and continuous mentorship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#E9DDF3] text-[#3E205D] flex items-center justify-center mb-4">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-semibold text-base text-slate-900 mb-2">
                In-Lesson Code Playground
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Students write, run, and debug real Python code directly inside each lesson with instantaneous terminal output execution.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#E9DDF3] text-[#3E205D] flex items-center justify-center mb-4">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-semibold text-base text-slate-900 mb-2">
                Pedagogical AI Tutor
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Integrated server-side assistant that explains tricky syntax in simpler terms, provides guided debugging hints, and creates custom practice quizzes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#E9DDF3] text-[#3E205D] flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-semibold text-base text-slate-900 mb-2">
                Verified Accreditation
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Students earn cryptographic verification hashes and signed certificates upon successfully passing all lesson exercises and module quizzes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
