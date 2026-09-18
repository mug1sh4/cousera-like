import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { runPythonCode, RunResult } from '../../utils/pythonRunner';
import { formatLevel } from '../../utils/formatters';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  FileEdit,
  Sparkles,
  BookOpen,
  Terminal,
  Code2,
  Clock,
  Menu,
  X,
  Video,
  Film,
  Subtitles
} from 'lucide-react';

export const LessonView: React.FC = () => {
  const {
    courses,
    lessons,
    selectedCourseId,
    selectedLessonId,
    navigateTo,
    completeLesson,
    isLessonCompleted,
    isStudentPreviewMode,
    setIsTutorOpen,
    setIsNotesOpen
  } = useApp();

  const course = courses.find(c => c.id === selectedCourseId) || courses[0];
  const courseLessons = course
    ? lessons
        .filter(l => l.courseId === course.id && l.published)
        .sort((a, b) => a.order - b.order)
    : [];

  const currentLesson = courseLessons.find(l => l.id === selectedLessonId) || courseLessons[0] || null;

  // Playground state map for each block
  const [codeDrafts, setCodeDrafts] = useState<Record<string, string>>({});
  const [runResults, setRunResults] = useState<Record<string, RunResult>>({});
  const [isRunning, setIsRunning] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!course || !currentLesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="font-heading text-xl font-bold text-slate-800">Lesson Not Available</h2>
        <p className="text-xs text-slate-500">This module or course is no longer available in the active curriculum.</p>
        <button
          onClick={() => navigateTo('catalog')}
          className="px-4 py-2 bg-[#3E205D] text-[#E9DDF3] text-xs font-semibold rounded-lg hover:bg-[#4F2B76] transition-colors cursor-pointer"
        >
          Return to Course Catalog
        </button>
      </div>
    );
  }

  const currentIndex = courseLessons.findIndex(l => l.id === currentLesson.id);

  const getCodeForBlock = (blockId: string, initialCode: string) => {
    return codeDrafts[blockId] !== undefined ? codeDrafts[blockId] : initialCode;
  };

  const handleRunCode = (blockId: string, initialCode: string) => {
    const codeToRun = getCodeForBlock(blockId, initialCode);
    setIsRunning(prev => ({ ...prev, [blockId]: true }));

    setTimeout(() => {
      const result = runPythonCode(codeToRun);
      setRunResults(prev => ({ ...prev, [blockId]: result }));
      setIsRunning(prev => ({ ...prev, [blockId]: false }));
    }, 200);
  };

  const handleResetCode = (blockId: string, defaultCode: string) => {
    setCodeDrafts(prev => ({ ...prev, [blockId]: defaultCode }));
    setRunResults(prev => {
      const next = { ...prev };
      delete next[blockId];
      return next;
    });
  };

  const completed = isLessonCompleted(currentLesson.id);

  const handleMarkComplete = () => {
    completeLesson(currentLesson.id, 100);
  };

  const goToNextLesson = () => {
    if (currentIndex < courseLessons.length - 1) {
      const next = courseLessons[currentIndex + 1];
      navigateTo('lesson_view', course.id, next.id);
    }
  };

  const goToPrevLesson = () => {
    if (currentIndex > 0) {
      const prev = courseLessons[currentIndex - 1];
      navigateTo('lesson_view', course.id, prev.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded-md cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span>Curriculum Outline ({courseLessons.length} Modules)</span>
        </button>
        <span className="text-xs text-slate-500 font-medium">
          Lesson {currentIndex + 1} of {courseLessons.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Curriculum List (Section 10.4 Item 8) */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white p-6 shadow-xl lg:static lg:w-auto lg:p-0 lg:shadow-none lg:z-auto transition-transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="bg-white rounded-xl lg:border border-slate-200 p-4 lg:sticky lg:top-20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#3E205D] tracking-wider">
                  Course Syllabus
                </span>
                <h3 className="font-heading font-bold text-sm text-slate-900 line-clamp-1">
                  {course.title}
                </h3>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-slate-400 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {courseLessons.map((lesson, idx) => {
                const isSelected = lesson.id === currentLesson.id;
                const isDone = isLessonCompleted(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      navigateTo('lesson_view', course.id, lesson.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#3E205D] text-[#E9DDF3] font-medium shadow-xs'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-[#E9DDF3]' : 'text-emerald-600'}`} />
                      ) : (
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                            isSelected ? 'border-[#E9DDF3] text-[#E9DDF3]' : 'border-slate-400 text-slate-500'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    <div className="line-clamp-1">
                      <span className="block truncate">{lesson.title}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                        {lesson.duration}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => navigateTo('course_detail', course.id)}
                className="text-[11px] text-[#3E205D] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View Course Information</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Content Area: Lesson Blocks & Code Playground (Section 10.4 Item 9) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Lesson Header */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#E9DDF3] text-[#3E205D]">
                  Lesson {currentIndex + 1} of {courseLessons.length}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {currentLesson.duration}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  • {formatLevel(course.level)}
                </span>
              </div>

              {/* Action Buttons: Notes & AI Tutor */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsNotesOpen(true)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <FileEdit className="w-3.5 h-3.5 text-slate-600" />
                  <span>Lesson Notes</span>
                </button>

                <button
                  onClick={() => setIsTutorOpen(true)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[#E9DDF3] hover:bg-purple-200 text-[#3E205D] transition-colors flex items-center gap-1.5 cursor-pointer border border-purple-200"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#3E205D]" />
                  <span>Ask AI Tutor</span>
                </button>
              </div>
            </div>

            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              {currentLesson.title}
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {currentLesson.description}
            </p>
          </div>

          {/* Ordered Content Blocks */}
          <div className="space-y-6">
            {currentLesson.contentBlocks.map((block, bIdx) => (
              <div key={block.id} className="space-y-3">
                {/* Block Title if present */}
                {block.title && (
                  <h3 className="font-heading font-semibold text-base text-slate-900 pt-2">
                    {block.title}
                  </h3>
                )}

                {/* Text Explanation Block */}
                {block.type === 'text' && (
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs leading-relaxed text-slate-800 text-xs sm:text-sm prose prose-slate max-w-none">
                    <div
                      className="space-y-3 whitespace-pre-line"
                      dangerouslySetInnerHTML={{
                        __html: block.content
                          .replace(/### (.*)/g, '<h3 class="font-heading font-bold text-base text-slate-900 mt-2 mb-1">$1</h3>')
                          .replace(/```python([\s\S]*?)```/g, '<pre class="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto my-2 font-mono"><code>$1</code></pre>')
                          .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-[#3E205D] font-mono text-xs font-semibold">$1</code>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }}
                    />
                  </div>
                )}

                {/* Video Masterclass Block */}
                {block.type === 'video' && (
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
                    {/* Video Player */}
                    <div className="relative rounded-xl overflow-hidden bg-black aspect-video shadow-md">
                      <video
                        id={`video-${block.id}`}
                        controls
                        src={block.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                        className="w-full h-full object-contain"
                      >
                        {block.captionUrl && (
                          <track
                            kind="subtitles"
                            src={block.captionUrl}
                            srcLang="en"
                            label="English Captions"
                            default
                          />
                        )}
                      </video>
                    </div>

                    {/* Video Meta & Chapters Timeline */}
                    <div className="space-y-3 pt-1">
                      {block.content && (
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                          {block.content}
                        </p>
                      )}

                      {block.chapters && block.chapters.length > 0 && (
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                              <Film className="w-3.5 h-3.5 text-[#3E205D]" />
                              <span>Lecture Chapters ({block.chapters.length})</span>
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Click any timestamp to jump to topic
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                            {block.chapters.map(ch => (
                              <button
                                key={ch.id}
                                onClick={() => {
                                  const videoEl = document.getElementById(`video-${block.id}`) as HTMLVideoElement;
                                  if (videoEl) {
                                    videoEl.currentTime = ch.timeSeconds;
                                    videoEl.play();
                                  }
                                }}
                                className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 hover:border-[#3E205D] text-left text-xs transition-colors group cursor-pointer"
                              >
                                <span className="font-mono text-[11px] font-bold text-[#3E205D] bg-[#E9DDF3] px-1.5 py-0.5 rounded group-hover:bg-[#3E205D] group-hover:text-[#E9DDF3] transition-colors">
                                  {ch.timeFormatted}
                                </span>
                                <span className="text-slate-700 text-[11px] font-medium truncate">
                                  {ch.title}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Interactive Code Playground Block (Live Python runner!) */}
                {block.type === 'code_playground' && (
                  <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden text-xs">
                    {/* Playground Header */}
                    <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span className="font-mono font-medium text-[11px] text-slate-200">
                          interactive_sandbox.py
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResetCode(block.id, block.content)}
                          className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Reset code to original"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>

                        <button
                          onClick={() => handleRunCode(block.id, block.content)}
                          disabled={isRunning[block.id]}
                          className="px-3.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{isRunning[block.id] ? 'Running...' : 'Run Code'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Interactive Code Input */}
                    <div className="relative">
                      <textarea
                        value={getCodeForBlock(block.id, block.content)}
                        onChange={(e) => setCodeDrafts(prev => ({ ...prev, [block.id]: e.target.value }))}
                        rows={8}
                        spellCheck={false}
                        className="w-full p-4 bg-slate-900 text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none resize-y border-none font-normal"
                        placeholder="Write your Python code here..."
                      />
                    </div>

                    {/* Terminal Output Console */}
                    <div className="bg-black/90 p-4 border-t border-slate-800 font-mono text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-slate-500 text-[10px] pb-1 border-b border-slate-800/80">
                        <span>Terminal Execution Output:</span>
                        {runResults[block.id] && (
                          <span>Executed in {runResults[block.id].executionTimeMs}ms</span>
                        )}
                      </div>

                      {runResults[block.id] ? (
                        runResults[block.id].error ? (
                          <div className="text-rose-400 whitespace-pre-wrap">
                            {runResults[block.id].error}
                          </div>
                        ) : (
                          <div className="text-slate-100 whitespace-pre-wrap">
                            {runResults[block.id].stdout}
                          </div>
                        )
                      ) : (
                        <div className="text-slate-500 italic">
                          Click "Run Code" above to execute this script in the Python sandbox.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Lesson Navigation & Completion Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
            <button
              onClick={goToPrevLesson}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Lesson</span>
            </button>

            <div className="flex items-center gap-2 justify-center">
              {currentLesson.exercises.length > 0 && (
                <button
                  onClick={() => navigateTo('quiz_view', course.id, currentLesson.id)}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Take Module Quiz ({currentLesson.exercises.length} Questions)</span>
                </button>
              )}

              <button
                onClick={handleMarkComplete}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  completed
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-[#3E205D] text-[#E9DDF3] hover:bg-[#4F2B76]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{completed ? 'Completed' : 'Mark as Complete'}</span>
              </button>
            </div>

            <button
              onClick={goToNextLesson}
              disabled={currentIndex === courseLessons.length - 1}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Next Lesson</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
