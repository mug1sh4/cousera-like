import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FileEdit, X, Check, Save } from 'lucide-react';

export const NotesPanel: React.FC = () => {
  const {
    isNotesOpen,
    setIsNotesOpen,
    selectedLessonId,
    lessons,
    getLessonNote,
    saveNote
  } = useApp();

  const lesson = lessons.find(l => l.id === selectedLessonId) || lessons[0];
  const [noteContent, setNoteContent] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (selectedLessonId) {
      const existing = getLessonNote(selectedLessonId);
      setNoteContent(existing);
      setIsSaved(false);
    }
  }, [selectedLessonId, getLessonNote]);

  if (!isNotesOpen) return null;

  const handleSave = () => {
    if (selectedLessonId) {
      saveNote(selectedLessonId, noteContent);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <FileEdit className="w-4 h-4 text-purple-300" />
          <div>
            <h3 className="font-heading font-bold text-sm">Lesson Study Notes</h3>
            <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
              {lesson?.title}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNotesOpen(false)}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Area */}
      <div className="flex-1 p-4 flex flex-col space-y-3">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Record personal reminders, syntax tricks, and insights for this lesson. Notes are automatically linked to this module.
        </p>

        <textarea
          value={noteContent}
          onChange={(e) => {
            setNoteContent(e.target.value);
            setIsSaved(false);
          }}
          placeholder="Jot down notes, code snippets, or ideas..."
          className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20 focus:border-[#3E205D] resize-none font-sans"
        />
      </div>

      {/* Footer / Save Action */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          {noteContent.length} characters
        </span>

        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
            isSaved
              ? 'bg-emerald-600 text-white'
              : 'bg-[#3E205D] text-[#E9DDF3] hover:bg-[#4F2B76]'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Note</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
