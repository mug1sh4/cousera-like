import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentBlock, Lesson, VideoChapter } from '../../types';
import { QuizBuilderModal } from './QuizBuilderModal';
import { LessonTemplateModal, LessonTemplateType } from './LessonTemplateModal';
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Play,
  Eye,
  CheckCircle2,
  FileText,
  Code2,
  HelpCircle,
  Sparkles,
  Save,
  Video,
  Upload,
  Link,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Clock,
  Subtitles,
  Film,
  BookOpen
} from 'lucide-react';

export const LessonContentEditor: React.FC = () => {
  const {
    courses,
    lessons,
    selectedCourseId,
    selectedLessonId,
    updateLesson,
    createLesson,
    navigateTo,
    setIsStudentPreviewMode
  } = useApp();

  const course = courses.find(c => c.id === selectedCourseId) || courses[0];
  const courseLessons = course
    ? lessons.filter(l => l.courseId === course.id).sort((a, b) => a.order - b.order)
    : [];

  const [activeLessonId, setActiveLessonId] = useState<string>(
    selectedLessonId || courseLessons[0]?.id || ''
  );

  const activeLesson = courseLessons.find(l => l.id === activeLessonId) || courseLessons[0];

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [saveBanner, setSaveBanner] = useState(false);

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="font-heading text-xl font-bold text-slate-800">Course Not Found</h2>
        <p className="text-xs text-slate-500">The curriculum you are trying to edit has been deleted or cannot be found.</p>
        <button
          onClick={() => navigateTo('trainer_dashboard')}
          className="px-4 py-2 bg-[#3E205D] text-[#E9DDF3] text-xs font-semibold rounded-lg hover:bg-[#4F2B76] transition-colors cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Local draft state for active lesson details
  const [title, setTitle] = useState(activeLesson?.title || '');
  const [description, setDescription] = useState(activeLesson?.description || '');
  const [duration, setDuration] = useState(activeLesson?.duration || '30 mins');
  const [published, setPublished] = useState(activeLesson?.published ?? true);
  const [blocks, setBlocks] = useState<ContentBlock[]>(activeLesson?.contentBlocks || []);

  // Chapter input state for video blocks
  const [newChapterTime, setNewChapterTime] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');

  // When switching active lesson
  const switchActiveLesson = (lesson: Lesson) => {
    setActiveLessonId(lesson.id);
    setTitle(lesson.title);
    setDescription(lesson.description);
    setDuration(lesson.duration);
    setPublished(lesson.published);
    setBlocks(lesson.contentBlocks || []);
  };

  // Add new block
  const handleAddBlock = (type: 'text' | 'code_playground' | 'video') => {
    let newBlock: ContentBlock;

    if (type === 'text') {
      newBlock = {
        id: `blk_${Date.now()}`,
        order: blocks.length + 1,
        type: 'text',
        title: 'New Text Section',
        content: 'Write lesson instructions and conceptual fundamentals here. Markdown formatting supported.'
      };
    } else if (type === 'video') {
      newBlock = {
        id: `blk_${Date.now()}`,
        order: blocks.length + 1,
        type: 'video',
        title: 'Technical Video Lecture',
        content: 'Walkthrough demonstration covering architecture, implementation, and practical patterns.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        videoFileName: 'nairobi_technical_lecture.mp4',
        captionUrl: 'subtitles_en.vtt',
        chapters: [
          { id: `ch_${Date.now()}_1`, timeSeconds: 0, timeFormatted: '00:00', title: 'Introduction & Setup' },
          { id: `ch_${Date.now()}_2`, timeSeconds: 150, timeFormatted: '02:30', title: 'Implementation Demonstration' }
        ]
      };
    } else {
      newBlock = {
        id: `blk_${Date.now()}`,
        order: blocks.length + 1,
        type: 'code_playground',
        title: 'Interactive Python Playground',
        content: `# Interactive Python Sandbox\n# Test your implementation below\n\ndef execute_task():\n    return "Ready for execution"\n\nprint(execute_task())`
      };
    }

    setBlocks(prev => [...prev, newBlock]);
  };

  const handleUpdateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    setBlocks(prev => prev.map(b => (b.id === blockId ? { ...b, ...updates } : b)));
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId));
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const next = [...blocks];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      setBlocks(next);
    } else if (direction === 'down' && index < blocks.length - 1) {
      const next = [...blocks];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      setBlocks(next);
    }
  };

  // Rich Text helper function
  const handleInsertMarkdown = (blockId: string, prefix: string, suffix: string = '') => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;
    const newContent = `${block.content}\n${prefix}Highlighted Text${suffix}`;
    handleUpdateBlock(blockId, { content: newContent });
  };

  // Video Chapter helpers
  const handleAddChapterToBlock = (blockId: string) => {
    if (!newChapterTime.trim() || !newChapterTitle.trim()) return;

    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    // Parse seconds from formatted string (e.g. 02:30 -> 150)
    const parts = newChapterTime.split(':').map(p => parseInt(p, 10));
    let seconds = 0;
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      seconds = parts[0] * 60 + parts[1];
    }

    const chapter: VideoChapter = {
      id: `ch_${Date.now()}`,
      timeSeconds: seconds,
      timeFormatted: newChapterTime,
      title: newChapterTitle.trim()
    };

    const currentChapters = block.chapters || [];
    const updated = [...currentChapters, chapter].sort((a, b) => a.timeSeconds - b.timeSeconds);

    handleUpdateBlock(blockId, { chapters: updated });
    setNewChapterTime('');
    setNewChapterTitle('');
  };

  const handleRemoveChapterFromBlock = (blockId: string, chapterId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || !block.chapters) return;
    const updated = block.chapters.filter(ch => ch.id !== chapterId);
    handleUpdateBlock(blockId, { chapters: updated });
  };

  // Template creation handler
  const handleSelectTemplate = (template: LessonTemplateType) => {
    setIsTemplateModalOpen(false);

    let templateBlocks: ContentBlock[] = [];

    if (template === 'no_video') {
      templateBlocks = [
        {
          id: `blk_${Date.now()}_1`,
          order: 1,
          type: 'text',
          title: 'Lesson Conceptual Overview',
          content: `### Learning Objectives\n\n- Master fundamental operational principles\n- Examine syntactical structure and flow\n\n### Overview & Theory\nWrite your structured technical guide here. Markdown syntax is supported.`
        },
        {
          id: `blk_${Date.now()}_2`,
          order: 2,
          type: 'code_playground',
          title: 'Hands-on Python Laboratory',
          content: `# Practical Sandbox Challenge\ndef solve_task():\n    results = [x ** 2 for x in range(1, 6)]\n    return results\n\nprint("Computed:", solve_task())`
        }
      ];
    } else if (template === 'video_only') {
      templateBlocks = [
        {
          id: `blk_${Date.now()}_1`,
          order: 1,
          type: 'video',
          title: 'Recorded Technical Masterclass',
          content: 'In-depth demonstration of system architecture, code walkthrough, and live execution.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          videoFileName: 'recorded_lecture_module.mp4',
          captionUrl: 'captions_en.vtt',
          chapters: [
            { id: `ch_${Date.now()}_1`, timeSeconds: 0, timeFormatted: '00:00', title: 'Introduction & Orientation' },
            { id: `ch_${Date.now()}_2`, timeSeconds: 180, timeFormatted: '03:00', title: 'Core Algorithmic Walkthrough' },
            { id: `ch_${Date.now()}_3`, timeSeconds: 420, timeFormatted: '07:00', title: 'Summary & Next Steps' }
          ]
        }
      ];
    } else {
      // Hybrid
      templateBlocks = [
        {
          id: `blk_${Date.now()}_1`,
          order: 1,
          type: 'video',
          title: 'Lecture Demonstration',
          content: 'Watch this technical walkthrough before attempting the live exercises below.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          videoFileName: 'hybrid_walkthrough.mp4',
          captionUrl: 'captions_en.vtt',
          chapters: [
            { id: `ch_${Date.now()}_1`, timeSeconds: 0, timeFormatted: '00:00', title: 'Concept Walkthrough' },
            { id: `ch_${Date.now()}_2`, timeSeconds: 150, timeFormatted: '02:30', title: 'Hands-on Coding Demo' }
          ]
        },
        {
          id: `blk_${Date.now()}_2`,
          order: 2,
          type: 'text',
          title: 'Syntax & Edge-Case Reference',
          content: `### Key Patterns\n\n- Notice the function signatures and argument types\n- Review edge conditions prior to testing in the sandbox`
        },
        {
          id: `blk_${Date.now()}_3`,
          order: 3,
          type: 'code_playground',
          title: 'Interactive Python Sandbox',
          content: `# Practice the pattern shown in the video above\ndef process_records(items):\n    return [item.strip().upper() for item in items]\n\nprint(process_records(['python', 'nairobi', 'fusion']))`
        }
      ];
    }

    const newLesson = createLesson(course.id, {
      title: `Lesson ${courseLessons.length + 1}: ${
        template === 'video_only' ? 'Video Lecture' : template === 'hybrid' ? 'Guided Technical Workshop' : 'Technical Laboratory'
      }`,
      description: 'Hands-on practice exercises and applied algorithmic concepts.',
      duration: template === 'video_only' ? '25 mins' : '40 mins',
      difficulty: 'Intermediate',
      published: false,
      contentBlocks: templateBlocks,
      exercises: []
    });

    switchActiveLesson(newLesson);
  };

  const handleSaveLesson = () => {
    if (!activeLesson) return;
    updateLesson(activeLesson.id, {
      title,
      description,
      duration,
      published,
      contentBlocks: blocks
    });
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2000);
  };

  const handlePreviewAsStudent = () => {
    handleSaveLesson();
    setIsStudentPreviewMode(true);
    navigateTo('lesson_view', course.id, activeLesson.id);
  };

  if (!activeLesson) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center space-y-4">
        <p className="text-slate-600 text-sm">No lessons found in this course.</p>
        <button
          onClick={() => setIsTemplateModalOpen(true)}
          className="px-4 py-2.5 bg-[#3E205D] text-[#E9DDF3] rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 mx-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create First Lesson (Choose Template)</span>
        </button>
        <LessonTemplateModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          onSelectTemplate={handleSelectTemplate}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('trainer_dashboard')}
            className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            title="Return to Trainer Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[11px] font-semibold text-[#3E205D] uppercase tracking-wider">
              Course Content Authoring
            </span>
            <h1 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Global Controls: Save & Preview as Student */}
        <div className="flex items-center gap-2">
          {saveBanner && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Saved!
            </span>
          )}

          <button
            onClick={handlePreviewAsStudent}
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Preview as Student</span>
          </button>

          <button
            onClick={handleSaveLesson}
            className="px-4 py-2 rounded-lg bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Lesson</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Authoring Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Lesson Navigation / Outline */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4 shadow-xs h-fit">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Module Outline ({courseLessons.length})
            </h3>
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="px-2 py-1 rounded bg-[#E9DDF3] text-[#3E205D] hover:bg-purple-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>New Lesson</span>
            </button>
          </div>

          <div className="space-y-1.5">
            {courseLessons.map((l, idx) => {
              const isCurrent = l.id === activeLesson.id;
              return (
                <button
                  key={l.id}
                  onClick={() => switchActiveLesson(l)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer ${
                    isCurrent
                      ? 'bg-[#3E205D] text-[#E9DDF3] font-semibold shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="truncate pr-2">
                    {idx + 1}. {l.title}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    l.published
                      ? isCurrent ? 'bg-purple-900/50 text-purple-200' : 'bg-emerald-100 text-emerald-800'
                      : isCurrent ? 'bg-purple-900/50 text-purple-200' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {l.published ? 'Pub' : 'Draft'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Editor Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Lesson Metadata Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-heading font-semibold text-base text-slate-900">
                Lesson Properties
              </h2>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="accent-[#3E205D] rounded cursor-pointer"
                  />
                  <span>Published to Cohort</span>
                </label>

                <button
                  onClick={() => setIsQuizModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-[#3E205D] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-purple-200"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Configure Quizzes ({activeLesson.exercises.length})</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-slate-700">Lesson Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Estimated Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 25 mins"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-700">Short Summary</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20"
              />
            </div>
          </div>

          {/* Ordered Content Blocks Editor with enhanced toolbar */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Lesson Content Blocks ({blocks.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Compose readings, video masterclasses, and Python playgrounds in sequential order.
                </p>
              </div>

              {/* Block Addition Controls (+ Text Block, + Video Block, + Code Playground) */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleAddBlock('text')}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  <span>+ Add Text</span>
                </button>

                <button
                  onClick={() => handleAddBlock('video')}
                  className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#3E205D] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-[#3E205D]" />
                  <span>+ Add Video</span>
                </button>

                <button
                  onClick={() => handleAddBlock('code_playground')}
                  className="px-3 py-1.5 rounded-lg bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>+ Add Sandbox</span>
                </button>
              </div>
            </div>

            {/* Blocks List */}
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4"
              >
                {/* Block Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#E9DDF3] text-[#3E205D] flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      {block.type === 'text' && (
                        <>
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>Text Explanation Block</span>
                        </>
                      )}
                      {block.type === 'video' && (
                        <>
                          <Video className="w-3.5 h-3.5 text-[#3E205D]" />
                          <span>Video Lecture Block</span>
                        </>
                      )}
                      {block.type === 'code_playground' && (
                        <>
                          <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Interactive Code Playground Block</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveBlock(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Move up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveBlock(index, 'down')}
                      disabled={index === blocks.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Move down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBlock(block.id)}
                      className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer ml-1"
                      title="Delete block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtitle Input */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-700">Block Subtitle</label>
                  <input
                    type="text"
                    value={block.title || ''}
                    onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    placeholder="e.g. Understanding Python While Loops"
                  />
                </div>

                {/* 1. TEXT BLOCK: Rich Text Toolbar + Content */}
                {block.type === 'text' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-slate-700">Content Body</label>
                      {/* Rich text formatting toolbar */}
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md border border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown(block.id, '**', '**')}
                          className="p-1 rounded hover:bg-white text-slate-700 cursor-pointer"
                          title="Bold"
                        >
                          <Bold className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown(block.id, '*', '*')}
                          className="p-1 rounded hover:bg-white text-slate-700 cursor-pointer"
                          title="Italic"
                        >
                          <Italic className="w-3 h-3" />
                        </button>
                        <span className="w-px h-3 bg-slate-300 mx-0.5" />
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown(block.id, '## ')}
                          className="p-1 rounded hover:bg-white text-slate-700 cursor-pointer"
                          title="Heading 2"
                        >
                          <Heading2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown(block.id, '### ')}
                          className="p-1 rounded hover:bg-white text-slate-700 cursor-pointer"
                          title="Heading 3"
                        >
                          <Heading3 className="w-3 h-3" />
                        </button>
                        <span className="w-px h-3 bg-slate-300 mx-0.5" />
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown(block.id, '- ')}
                          className="p-1 rounded hover:bg-white text-slate-700 cursor-pointer"
                          title="Bullet List"
                        >
                          <List className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown(block.id, '1. ')}
                          className="p-1 rounded hover:bg-white text-slate-700 cursor-pointer"
                          title="Numbered List"
                        >
                          <ListOrdered className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown(block.id, '`', '`')}
                          className="p-1 rounded hover:bg-white text-slate-700 cursor-pointer"
                          title="Inline Code"
                        >
                          <Code className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown(block.id, '> ')}
                          className="p-1 rounded hover:bg-white text-slate-700 cursor-pointer"
                          title="Blockquote"
                        >
                          <Quote className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={6}
                      value={block.content}
                      onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                      className="w-full p-3 border border-slate-300 rounded-lg text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20 text-slate-900"
                      placeholder="Write your explanation in Markdown..."
                    />
                  </div>
                )}

                {/* 2. VIDEO BLOCK: Video URL, Upload, Captions, Chapters */}
                {block.type === 'video' && (
                  <div className="space-y-4 text-xs">
                    {/* Video Source Configuration */}
                    <div className="p-4 bg-purple-50/40 rounded-xl border border-purple-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Film className="w-4 h-4 text-[#3E205D]" />
                          <span>Video Source & Media File</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateBlock(block.id, {
                            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                            videoFileName: 'kenya_tech_lecture_sample.mp4'
                          })}
                          className="text-[11px] text-[#3E205D] hover:underline font-semibold cursor-pointer"
                        >
                          Load Sample MP4
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-600 font-medium">Video Stream URL (.mp4, webm, or stream)</label>
                          <input
                            type="text"
                            value={block.videoUrl || ''}
                            onChange={(e) => handleUpdateBlock(block.id, { videoUrl: e.target.value })}
                            placeholder="https://.../video.mp4"
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-600 font-medium">Uploaded File Reference</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={block.videoFileName || ''}
                              onChange={(e) => handleUpdateBlock(block.id, { videoFileName: e.target.value })}
                              placeholder="lecture_recording.mp4"
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                            <label className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold cursor-pointer flex items-center gap-1 shrink-0">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Select File</span>
                              <input
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleUpdateBlock(block.id, {
                                      videoFileName: file.name,
                                      videoUrl: block.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Captions / Subtitles Track */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-purple-100">
                        <div className="space-y-1">
                          <label className="text-slate-600 font-medium flex items-center gap-1">
                            <Subtitles className="w-3.5 h-3.5 text-purple-700" />
                            <span>Closed Captions Track (.vtt / .srt)</span>
                          </label>
                          <input
                            type="text"
                            value={block.captionUrl || ''}
                            onChange={(e) => handleUpdateBlock(block.id, { captionUrl: e.target.value })}
                            placeholder="subtitles_en.vtt or transcript link"
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-600 font-medium">Lecture Notes / Overview</label>
                          <input
                            type="text"
                            value={block.content || ''}
                            onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                            placeholder="Brief briefing for this video lesson..."
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Chapter Markers Editor */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-purple-700" />
                          <span>Video Chapters & Timeline Markers ({block.chapters?.length || 0})</span>
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Students can jump directly to specific topics
                        </span>
                      </div>

                      {/* Chapter Markers List */}
                      {block.chapters && block.chapters.length > 0 ? (
                        <div className="space-y-1.5">
                          {block.chapters.map(ch => (
                            <div
                              key={ch.id}
                              className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[#3E205D] px-1.5 py-0.5 rounded bg-[#E9DDF3] text-[11px]">
                                  {ch.timeFormatted}
                                </span>
                                <span className="font-medium text-slate-800">{ch.title}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveChapterFromBlock(block.id, ch.id)}
                                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                title="Remove chapter"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">
                          No chapter markers added yet. Add key topic timestamps below.
                        </p>
                      )}

                      {/* Add Chapter Form */}
                      <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-200">
                        <input
                          type="text"
                          value={newChapterTime}
                          onChange={(e) => setNewChapterTime(e.target.value)}
                          placeholder="Time (e.g. 02:45)"
                          className="w-full sm:w-28 p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                        />
                        <input
                          type="text"
                          value={newChapterTitle}
                          onChange={(e) => setNewChapterTitle(e.target.value)}
                          placeholder="Chapter title (e.g. Algorithmic Demonstration)"
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddChapterToBlock(block.id)}
                          className="w-full sm:w-auto px-3 py-2 bg-[#3E205D] text-[#E9DDF3] rounded-lg font-semibold text-xs shrink-0 cursor-pointer hover:bg-[#4F2B76] transition-colors"
                        >
                          + Add Chapter
                        </button>
                      </div>
                    </div>

                    {/* Live Video Player Preview */}
                    {block.videoUrl && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                          Trainer Media Preview
                        </span>
                        <div className="rounded-xl overflow-hidden bg-black border border-slate-800 aspect-video max-w-xl mx-auto">
                          <video
                            controls
                            src={block.videoUrl}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. CODE PLAYGROUND BLOCK: Starter Python Script */}
                {block.type === 'code_playground' && (
                  <div className="space-y-1 text-xs">
                    <label className="font-semibold text-slate-700">
                      Starter Python Script (Executed in Student Sandbox)
                    </label>
                    <textarea
                      rows={7}
                      value={block.content}
                      onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                      className="w-full p-3 border border-slate-300 rounded-lg text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20 font-mono bg-slate-900 text-emerald-300"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Builder Modal */}
      <QuizBuilderModal
        lesson={activeLesson}
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
      />

      {/* Lesson Template Picker Modal */}
      <LessonTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
};
