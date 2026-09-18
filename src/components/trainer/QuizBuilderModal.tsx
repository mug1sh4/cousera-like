import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lesson, Exercise, ExerciseType } from '../../types';
import { X, Plus, Trash2, CheckCircle2, HelpCircle } from 'lucide-react';

interface QuizBuilderModalProps {
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuizBuilderModal: React.FC<QuizBuilderModalProps> = ({ lesson, isOpen, onClose }) => {
  const { updateLesson } = useApp();

  const [question, setQuestion] = useState('');
  const [type, setType] = useState<ExerciseType>('multiple_choice');
  const [options, setOptions] = useState<string[]>(['Option A', 'Option B', 'Option C', 'Option D']);
  const [correctAnswer, setCorrectAnswer] = useState('Option A');
  const [explanation, setExplanation] = useState('');
  const [points, setPoints] = useState(10);

  if (!isOpen || !lesson) return null;

  const handleAddOption = () => {
    setOptions(prev => [...prev, `Option ${String.fromCharCode(65 + prev.length)}`]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleOptionTextChange = (index: number, val: string) => {
    setOptions(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleSaveExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      alert('Please enter question text');
      return;
    }

    const newEx: Exercise = {
      id: `ex_${Date.now()}`,
      lessonId: lesson.id,
      order: lesson.exercises.length + 1,
      question,
      type,
      options: type === 'multiple_choice' || type === 'true_false' ? options : undefined,
      correctAnswer,
      explanation: explanation || 'Refer to the lecture notes in this lesson.',
      points: Number(points) || 10
    };

    updateLesson(lesson.id, {
      exercises: [...lesson.exercises, newEx]
    });

    // Reset fields
    setQuestion('');
    setExplanation('');
    onClose();
  };

  const handleDeleteExercise = (exId: string) => {
    updateLesson(lesson.id, {
      exercises: lesson.exercises.filter(ex => ex.id !== exId)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[11px] font-semibold text-[#3E205D] uppercase tracking-wider">
              Quiz & Assessment Builder
            </span>
            <h2 className="font-heading font-bold text-lg text-slate-900">
              Exercises for: {lesson.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Exercises list */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-700">
            Current Lesson Exercises ({lesson.exercises.length})
          </h3>

          {lesson.exercises.length === 0 ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center text-xs text-slate-500">
              No exercises created yet. Fill out the form below to add questions.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {lesson.exercises.map((ex, idx) => (
                <div key={ex.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-800">
                      {idx + 1}. {ex.question}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Type: <span className="capitalize">{ex.type.replace('_', ' ')}</span> • Correct: <strong className="text-emerald-700">{ex.correctAnswer}</strong> • {ex.points} pts
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteExercise(ex.id)}
                    className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 cursor-pointer"
                    title="Delete question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Question Form */}
        <form onSubmit={handleSaveExercise} className="pt-3 border-t border-slate-100 space-y-4 text-xs">
          <h3 className="font-semibold text-slate-900 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#3E205D]" />
            <span>Add New Exercise Question</span>
          </h3>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Question Text *</label>
            <textarea
              rows={2}
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Which Python keyword defines a function?"
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Question Type</label>
              <select
                value={type}
                onChange={(e) => {
                  const newType = e.target.value as ExerciseType;
                  setType(newType);
                  if (newType === 'true_false') {
                    setOptions(['True', 'False']);
                    setCorrectAnswer('True');
                  } else if (newType === 'multiple_choice' && options.length === 0) {
                    setOptions(['Option A', 'Option B', 'Option C', 'Option D']);
                    setCorrectAnswer('Option A');
                  }
                }}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
              >
                <option value="multiple_choice">Multiple Choice</option>
                <option value="true_false">True / False</option>
                <option value="text">Direct Text Input</option>
                <option value="code">Code Snippet Question</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Points Value</label>
              <input
                type="number"
                min={1}
                max={50}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Options if MCQ or True/False */}
          {(type === 'multiple_choice' || type === 'true_false') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700">Answer Options</label>
                {type === 'multiple_choice' && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-[11px] text-[#3E205D] hover:underline font-semibold cursor-pointer"
                  >
                    + Add Option
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => handleOptionTextChange(i, e.target.value)}
                      className="flex-1 p-2 border border-slate-300 rounded-lg text-xs"
                    />
                    {type === 'multiple_choice' && options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(i)}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Correct Answer *</label>
            {type === 'multiple_choice' || type === 'true_false' ? (
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
              >
                {options.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Exact answer expected..."
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
              />
            )}
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Answer Explanation</label>
            <input
              type="text"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Why this answer is correct (shown to student after submitting)..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              Done
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
