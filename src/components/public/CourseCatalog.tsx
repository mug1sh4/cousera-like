import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SubjectCategory, CourseLevel } from '../../types';
import { formatLevel } from '../../utils/formatters';
import {
  Search,
  BookOpen,
  Clock,
  User,
  CheckCircle2,
  ArrowRight,
  Filter,
  Sparkles
} from 'lucide-react';

export const CourseCatalog: React.FC = () => {
  const { courses, lessons, navigateTo } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const subjects: { id: string; label: string }[] = [
    { id: 'all', label: 'All Subjects' },
    { id: 'Python', label: 'Python Programming' },
    { id: 'Data Analytics', label: 'Data Analytics' },
    { id: 'Ethical Hacking', label: 'Ethical Hacking' },
    { id: 'Social Media Management', label: 'Social Media Management' }
  ];

  const levels: { id: string; label: string }[] = [
    { id: 'all', label: 'All Levels' },
    { id: 'Foundation', label: 'Level I' },
    { id: 'Intermediate', label: 'Level II' },
    { id: 'Advanced', label: 'Level III' }
  ];

  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      if (!course.published) return false;
      if (selectedSubject !== 'all' && course.subject !== selectedSubject) return false;
      if (selectedLevel !== 'all' && course.level !== selectedLevel) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = course.title.toLowerCase().includes(query);
        const matchDesc = course.description.toLowerCase().includes(query);
        const matchTopics = course.topics.some(t => t.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchTopics) return false;
      }
      return true;
    });
  }, [courses, selectedSubject, selectedLevel, searchQuery]);

  // Group courses by Subject to respect Section 10.1 directive
  const coursesBySubject = useMemo(() => {
    const map = new Map<string, typeof filteredCourses>();
    filteredCourses.forEach(c => {
      const existing = map.get(c.subject) || [];
      existing.push(c);
      map.set(c.subject, existing);
    });

    // Sort levels within each subject: Foundation -> Intermediate -> Advanced
    const levelOrder: Record<CourseLevel, number> = {
      Foundation: 1,
      Intermediate: 2,
      Advanced: 3
    };

    map.forEach((list, key) => {
      list.sort((a, b) => (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99));
    });

    return map;
  }, [filteredCourses]);

  const getLessonCountForCourse = (courseId: string) => {
    return lessons.filter(l => l.courseId === courseId && l.published).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Description */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E9DDF3] text-[#3E205D] text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Curriculum</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Course Catalog & Progression
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              Browse available programs structured sequentially by <strong>Subject → Level</strong>. Select any course to view its comprehensive syllabus, learning objectives, and enrollment details.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics, courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20 focus:border-[#3E205D]"
            />
          </div>
        </div>

        {/* Filter Pill Controls */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          {/* Subject Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Subject:
            </span>
            {subjects.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSubject(s.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  selectedSubject === s.id
                    ? 'bg-[#3E205D] text-[#E9DDF3] font-semibold'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1">Level:</span>
            {levels.map(lvl => (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  selectedLevel === lvl.id
                    ? 'bg-[#E9DDF3] text-[#3E205D] font-semibold border border-purple-300'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog Display - Grouped by Subject & Level */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-heading font-semibold text-slate-800 text-base">No courses match your filter</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Try adjusting your search query or reset the subject and level filters to see available courses.
          </p>
          <button
            onClick={() => {
              setSelectedSubject('all');
              setSelectedLevel('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {Array.from(coursesBySubject.entries()).map(([subject, subjectCourses]) => (
            <div key={subject} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#3E205D]" />
                <h2 className="font-heading font-bold text-xl text-slate-900">
                  {subject}
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  ({subjectCourses.length} {subjectCourses.length === 1 ? 'level' : 'levels'})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjectCourses.map(course => {
                  const lessonCount = getLessonCountForCourse(course.id);
                  return (
                    <div
                      key={course.id}
                      onClick={() => navigateTo('course_detail', course.id)}
                      className="bg-white rounded-xl border border-slate-200 p-5 hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#E9DDF3] text-[#3E205D] text-xs font-semibold">
                            {formatLevel(course.level)}
                          </span>
                        </div>

                        <h3 className="font-heading font-semibold text-base text-slate-900 group-hover:text-[#3E205D] transition-colors leading-snug">
                          {course.title}
                        </h3>

                        <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                          {course.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {course.topics.slice(0, 3).map((topic, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{course.duration}</span>
                          <span className="text-slate-300">•</span>
                          <span>{lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}</span>
                        </div>

                        <span className="text-[#3E205D] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          <span>Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
