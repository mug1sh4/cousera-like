import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  ChevronLeft
} from 'lucide-react';

export const QuizView: React.FC = () => {
  const {
    courses,
    lessons,
    selectedCourseId,
    selectedLessonId,
    navigateTo,
    completeLesson,
    progress,
    currentUser
  } = useApp();

  const course = courses.find(c => c.id === selectedCourseId) || courses[0];
  const lesson = lessons.find(l => l.id === selectedLessonId) || lessons.find(l => l.courseId === course?.id) || lessons[0];

  if (!course || !lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="font-heading text-xl font-bold text-slate-800">Quiz Not Available</h2>
        <p className="text-xs text-slate-500">The quiz or lesson for this course is no longer available.</p>
        <button
          onClick={() => navigateTo('student_dashboard')}
          className="px-4 py-2 bg-[#3E205D] text-[#E9DDF3] text-xs font-semibold rounded-lg hover:bg-[#4F2B76] transition-colors cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const exercises = lesson.exercises || [];

  // Track answers and submission state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectOption = (exerciseId: string, option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [exerciseId]: option }));
  };

  const handleTextAnswer = (exerciseId: string, text: string) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [exerciseId]: text }));
  };

  // Calculate score
  let correctCount = 0;
  let totalPoints = 0;
  let earnedPoints = 0;

  exercises.forEach(ex => {
    totalPoints += ex.points;
    const userAns = (selectedAnswers[ex.id] || '').trim().toLowerCase();
    const correctAns = (ex.correctAnswer || '').trim().toLowerCase();
    if (userAns === correctAns) {
      correctCount++;
      earnedPoints += ex.points;
    }
  });

  const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 100;
  const passed = percentage >= 70;

  const handleSubmit = () => {
    setIsSubmitted(true);
    completeLesson(lesson.id, percentage);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigateTo('lesson_view', course.id, lesson.id)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#3E205D] transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Return to Lesson: {lesson.title}</span>
      </button>

      {/* Quiz Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-md bg-[#E9DDF3] text-[#3E205D] text-xs font-semibold">
            Module Assessment
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {exercises.length} Questions • {totalPoints} Total Points
          </span>
        </div>

        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
          Quiz: {lesson.title}
        </h1>

        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Test your conceptual understanding and code reasoning. Achieve 70% or above to validate mastery for this module.
        </p>
      </div>

      {/* Results Banner when Submitted */}
      {isSubmitted && (
        <div className={`p-6 rounded-2xl border shadow-xs space-y-3 ${
          passed
            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
            : 'bg-amber-50/80 border-amber-300 text-amber-950'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-heading font-bold text-lg">
              {passed ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span>Module Assessment Passed! ({percentage}%)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-amber-600" />
                  <span>Passing Score is 70% (You Scored {percentage}%)</span>
                </>
              )}
            </div>

            <button
              onClick={handleRetake}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>

          <p className="text-xs leading-relaxed opacity-90">
            {passed
              ? 'Excellent work! Your score has been recorded to your official student profile and counted toward your completion certificate.'
              : 'Review the explanations below, revisit the lesson content blocks, and try again to cement your understanding.'}
          </p>
        </div>
      )}

      {/* Exercises List */}
      <div className="space-y-6">
        {exercises.map((ex, idx) => {
          const userAns = selectedAnswers[ex.id];
          const isCorrect = userAns && userAns.trim().toLowerCase() === ex.correctAnswer.trim().toLowerCase();

          return (
            <div
              key={ex.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#E9DDF3] text-[#3E205D] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-heading font-semibold text-sm sm:text-base text-slate-900 leading-snug">
                      {ex.question}
                    </h3>
                    <span className="text-[11px] text-slate-400 capitalize">
                      {ex.type.replace('_', ' ')} • {ex.points} Points
                    </span>
                  </div>
                </div>

                {isSubmitted && (
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold shrink-0 ${
                    isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {isCorrect ? 'Correct (+10 pts)' : 'Incorrect (0 pts)'}
                  </span>
                )}
              </div>

              {/* Multiple Choice / True-False Options */}
              {ex.options && (
                <div className="space-y-2 pt-1">
                  {ex.options.map((opt, oIdx) => {
                    const isSelected = userAns === opt;
                    const isTheCorrectOption = opt === ex.correctAnswer;

                    let optionStyle = 'border-slate-200 hover:bg-slate-50 text-slate-800';
                    if (isSubmitted) {
                      if (isTheCorrectOption) {
                        optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                      } else if (isSelected && !isTheCorrectOption) {
                        optionStyle = 'border-rose-500 bg-rose-50 text-rose-950';
                      } else {
                        optionStyle = 'border-slate-200 text-slate-400 opacity-60';
                      }
                    } else if (isSelected) {
                      optionStyle = 'border-[#3E205D] bg-[#E9DDF3]/30 text-[#3E205D] font-semibold';
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(ex.id, opt)}
                        className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {isSubmitted && isTheCorrectOption && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {isSubmitted && isSelected && !isTheCorrectOption && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Text or Code answer type if no options */}
              {!ex.options && (
                <div className="space-y-2">
                  <input
                    type="text"
                    disabled={isSubmitted}
                    value={userAns || ''}
                    onChange={(e) => handleTextAnswer(ex.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-3 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20"
                  />
                </div>
              )}

              {/* Explanation after submit */}
              {isSubmitted && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1">
                  <span className="font-semibold text-slate-900 block">Explanation:</span>
                  <p>{ex.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quiz Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <button
          onClick={() => navigateTo('lesson_view', course.id, lesson.id)}
          className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
        >
          Back to Lesson
        </button>

        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            Submit Answers for Scoring
          </button>
        ) : (
          <button
            onClick={() => navigateTo('lesson_view', course.id, lesson.id)}
            className="px-6 py-2.5 rounded-lg bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Proceed to Next Section</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
