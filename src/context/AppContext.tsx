import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  User,
  Course,
  Lesson,
  UserProgress,
  UserNote,
  AuditLogItem,
  PlatformSettings,
  TrainerPermission,
  Certificate,
  UserRole,
  ToastNotification
} from '../types';
import {
  initialUsers,
  initialCourses,
  initialLessons,
  initialProgress,
  initialAuditLogs,
  initialCertificates,
  initialSettings,
  initialTrainerPermissions
} from '../data/mockData';

export type AppView =
  | 'landing'
  | 'catalog'
  | 'course_detail'
  | 'student_dashboard'
  | 'lesson_view'
  | 'quiz_view'
  | 'progress_view'
  | 'student_profile'
  | 'trainer_dashboard'
  | 'trainer_editor'
  | 'admin_dashboard';

interface AppContextType {
  currentUser: User | null;
  allUsers: User[];
  courses: Course[];
  lessons: Lesson[];
  progress: UserProgress[];
  notes: UserNote[];
  auditLogs: AuditLogItem[];
  trainerPermissions: TrainerPermission[];
  certificates: Certificate[];
  settings: PlatformSettings;
  activeView: AppView;
  currentView: AppView;
  selectedCourseId: string | null;
  selectedLessonId: string | null;
  isStudentPreviewMode: boolean;
  authModal: 'login' | 'signup' | 'forgot_password' | null;
  isTutorOpen: boolean;
  isNotesOpen: boolean;
  selectedCertificate: Certificate | null;

  // Actions
  setActiveView: (view: AppView) => void;
  navigateTo: (view: AppView, courseId?: string | null, lessonId?: string | null) => void;
  setAuthModal: (modal: 'login' | 'signup' | 'forgot_password' | null) => void;
  setIsTutorOpen: (open: boolean) => void;
  setIsNotesOpen: (open: boolean) => void;
  setSelectedCertificate: (cert: Certificate | null) => void;
  setStudentPreviewMode: (mode: boolean) => void;
  setIsStudentPreviewMode: (mode: boolean) => void;

  // Auth & Roles
  login: (email: string) => boolean;
  loginWithGoogle: (role?: UserRole, name?: string, email?: string) => boolean;
  logout: () => void;
  signup: (name: string, email: string) => { success: boolean };
  switchDemoUser: (roleKey: 'student' | 'trainer' | 'admin' | 'visitor') => void;

  // Admin User Ops
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  suspendUser: (userId: string) => void;

  // Student Ops
  enrollCourse: (courseId: string) => void;
  completeLesson: (lessonId: string, score: number) => void;
  saveNote: (lessonId: string, content: string) => void;
  getLessonNote: (lessonId: string) => string;
  isLessonCompleted: (lessonId: string) => boolean;
  getCourseProgressPercent: (courseId: string) => number;

  // Trainer & Admin Content Ops
  createCourse: (newCourse: Partial<Course>) => Course;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (courseId: string) => { success: boolean; error?: string };
  canDeleteCourse: (course: Course) => boolean;
  toggleCoursePublish: (courseId: string) => void;
  createLesson: (courseId: string, newLesson: Partial<Lesson>) => Lesson;
  updateLesson: (lessonId: string, updates: Partial<Lesson>) => void;
  toggleLessonPublish: (lessonId: string) => void;
  updateTrainerPermissions: (trainerId: string, courseIds: string[], lessonIds: string[]) => void;
  importCsvContent: (csvText: string) => { success: boolean; importedCourses: number; importedLessons: number };
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
  addAuditLog: (action: string, targetType: AuditLogItem['targetType'], targetName: string, details?: string) => void;

  // Toast notifications
  toast: ToastNotification | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load or initialize state with localStorage fallbacks
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('fusion_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fusion_current_user');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default to approved student Alex Kimani for immediate rich interactive view
    return initialUsers[0];
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('fusion_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('fusion_lessons');
    return saved ? JSON.parse(saved) : initialLessons;
  });

  const [progress, setProgress] = useState<UserProgress[]>(() => {
    const saved = localStorage.getItem('fusion_progress');
    return saved ? JSON.parse(saved) : initialProgress;
  });

  const [notes, setNotes] = useState<UserNote[]>(() => {
    const saved = localStorage.getItem('fusion_notes');
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('fusion_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [trainerPermissions, setTrainerPermissions] = useState<TrainerPermission[]>(() => {
    const saved = localStorage.getItem('fusion_trainer_perms');
    return saved ? JSON.parse(saved) : initialTrainerPermissions;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('fusion_certificates');
    return saved ? JSON.parse(saved) : initialCertificates;
  });

  const [settings, setSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem('fusion_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // UI state
  const [activeView, setActiveView] = useState<AppView>('student_dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>('crs_python');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>('lsn_py_1');
  const [isStudentPreviewMode, setStudentPreviewMode] = useState<boolean>(false);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | 'forgot_password' | null>(null);
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    const newToast: ToastNotification = {
      id: `toast_${Date.now()}`,
      message,
      type
    };
    setToast(newToast);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const hideToast = () => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast(null);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('fusion_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('fusion_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('fusion_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('fusion_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('fusion_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('fusion_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('fusion_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('fusion_trainer_perms', JSON.stringify(trainerPermissions));
  }, [trainerPermissions]);

  useEffect(() => {
    localStorage.setItem('fusion_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('fusion_settings', JSON.stringify(settings));
  }, [settings]);

  // View navigation helper
  const navigateTo = (view: AppView, courseId?: string | null, lessonId?: string | null) => {
    setActiveView(view);
    if (courseId !== undefined) setSelectedCourseId(courseId);
    if (lessonId !== undefined) setSelectedLessonId(lessonId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addAuditLog = (action: string, targetType: AuditLogItem['targetType'], targetName: string, details?: string) => {
    const actor = currentUser || { id: 'usr_sys', name: 'System', role: 'admin' as UserRole };
    const newLog: AuditLogItem = {
      id: `log_${Date.now()}`,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action,
      targetType,
      targetName,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Auth operations
  const login = (email: string): boolean => {
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return false;

    setCurrentUser(user);
    if (user.role === 'admin') {
      navigateTo('admin_dashboard');
    } else if (user.role === 'trainer') {
      navigateTo('trainer_dashboard');
    } else {
      navigateTo('student_dashboard');
    }
    setAuthModal(null);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    navigateTo('landing');
    setStudentPreviewMode(false);
  };

  const signup = (name: string, email: string): { success: boolean } => {
    const existing = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: 'student',
      status: 'approved',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      joinedDate: new Date().toISOString().slice(0, 10)
    };

    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setAuthModal(null);

    navigateTo('student_dashboard');
    return { success: true };
  };

  const loginWithGoogle = (role: UserRole = 'student', name?: string, email?: string): boolean => {
    const userEmail = email || (role === 'trainer' ? 'dr.sarah@fusionedutech.com' : role === 'admin' ? 'jane.omondi@fusionedutech.com' : 'barbra.bitengo@example.com');
    const existing = allUsers.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      setAuthModal(null);
      if (existing.role === 'admin') navigateTo('admin_dashboard');
      else if (existing.role === 'trainer') navigateTo('trainer_dashboard');
      else navigateTo('student_dashboard');
      return true;
    }

    const newUser: User = {
      id: `usr_google_${Date.now()}`,
      name: name || (role === 'student' ? 'Barbra Bitengo' : 'Google User'),
      email: userEmail,
      role,
      status: 'approved',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      joinedDate: new Date().toISOString().slice(0, 10)
    };

    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setAuthModal(null);
    navigateTo('student_dashboard');
    return true;
  };

  // Quick Demo Role Switcher (For testing/modal autofill)
  const switchDemoUser = (roleKey: 'student' | 'trainer' | 'admin' | 'visitor') => {
    setStudentPreviewMode(false);
    if (roleKey === 'visitor') {
      setCurrentUser(null);
      navigateTo('landing');
      return;
    }
    if (roleKey === 'student') {
      const student = allUsers.find(u => u.id === 'usr_student_1') || allUsers.find(u => u.role === 'student') || allUsers[0];
      setCurrentUser(student);
      navigateTo('student_dashboard');
    } else if (roleKey === 'trainer') {
      const trainer = allUsers.find(u => u.id === 'usr_trainer_1') || allUsers.find(u => u.role === 'trainer') || allUsers[1];
      setCurrentUser(trainer);
      navigateTo('trainer_dashboard');
    } else if (roleKey === 'admin') {
      const admin = allUsers.find(u => u.id === 'usr_admin_1') || allUsers.find(u => u.role === 'admin') || allUsers[2];
      setCurrentUser(admin);
      navigateTo('admin_dashboard');
    }
  };

  // Admin user actions
  const approveUser = (userId: string) => {
    setAllUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const updated = {
            ...u,
            status: 'approved' as const
          };
          return updated;
        }
        return u;
      })
    );
  };

  const rejectUser = (userId: string) => {
    setAllUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          return { ...u, status: 'rejected' as const };
        }
        return u;
      })
    );
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setAllUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          addAuditLog('Changed User Role', 'user', `${u.name}`, `Changed role from ${u.role} to ${newRole}`);
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  const suspendUser = (userId: string) => {
    setAllUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          addAuditLog('Suspended User', 'user', `${u.name} (${u.email})`, 'Account access temporarily restricted');
          return { ...u, status: 'suspended' as const };
        }
        return u;
      })
    );
  };

  // Student progress
  const enrollCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!currentUser) {
      setAuthModal('signup');
      return;
    }
    const firstLesson = lessons.find(l => l.courseId === courseId && l.published) || lessons.find(l => l.courseId === courseId);
    navigateTo('lesson_view', courseId, firstLesson?.id || null);
  };

  const completeLesson = (lessonId: string, score: number) => {
    if (!currentUser) return;
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    setProgress(prev => {
      const existing = prev.find(p => p.userId === currentUser.id && p.lessonId === lessonId);
      if (existing) {
        return prev.map(p =>
          p.id === existing.id
            ? {
                ...p,
                completed: true,
                score: Math.max(p.score, score),
                lastVisitedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
                completedAt: p.completedAt || new Date().toISOString().replace('T', ' ').slice(0, 16)
              }
            : p
        );
      } else {
        const newProg: UserProgress = {
          id: `prog_${Date.now()}`,
          userId: currentUser.id,
          courseId: lesson.courseId,
          lessonId,
          completed: true,
          score,
          lastVisitedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          completedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
        return [...prev, newProg];
      }
    });

    // Check if entire course is completed to award certificate
    const courseLessons = lessons.filter(l => l.courseId === lesson.courseId && l.published);
    const existingCerts = certificates.filter(c => c.userId === currentUser.id && c.courseId === lesson.courseId);
    
    // Check after updating
    setTimeout(() => {
      const userCourseCompleted = courseLessons.every(l => {
        if (l.id === lessonId) return true;
        return progress.some(p => p.userId === currentUser.id && p.lessonId === l.id && p.completed);
      });

      if (userCourseCompleted && existingCerts.length === 0) {
        const course = courses.find(c => c.id === lesson.courseId);
        if (course && course.certificateEnabled) {
          const newCert: Certificate = {
            id: `cert_${Date.now()}`,
            certificateNumber: `FUSION-${course.subject.slice(0, 2).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
            credentialId: `FUS-CRED-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
            userId: currentUser.id,
            userName: currentUser.name,
            courseId: course.id,
            courseTitle: course.title,
            courseLevel: course.level || 'Foundation',
            issueDate: new Date().toISOString().slice(0, 10),
            verificationHash: Math.random().toString(36).substring(2, 12),
            noteText: course.certificateNoteText || 'Has met rigorous capability benchmarks and hands-on laboratory exercises.',
            trainerSignatureName: course.certificateSignatureTrainer || course.trainerName || 'Dr. Sarah Wanjiku',
            trainerSignatureTitle: course.trainerTitle || 'Lead Technical Instructor'
          };
          setCertificates(c => [...c, newCert]);
          addAuditLog('Credential Awarded', 'course', `${course.title} to ${currentUser.name}`, `Credential ID: ${newCert.credentialId}`);
        }
      }
    }, 100);
  };

  const saveNote = (lessonId: string, content: string) => {
    if (!currentUser) return;
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    setNotes(prev => {
      const existing = prev.find(n => n.userId === currentUser.id && n.lessonId === lessonId);
      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
      if (existing) {
        return prev.map(n => n.id === existing.id ? { ...n, content, updatedAt: now } : n);
      } else {
        const newNote: UserNote = {
          id: `note_${Date.now()}`,
          userId: currentUser.id,
          lessonId,
          courseId: lesson.courseId,
          content,
          createdAt: now,
          updatedAt: now
        };
        return [...prev, newNote];
      }
    });
  };

  const getLessonNote = (lessonId: string): string => {
    if (!currentUser) return '';
    const n = notes.find(item => item.userId === currentUser.id && item.lessonId === lessonId);
    return n ? n.content : '';
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    if (!currentUser) return false;
    return progress.some(p => p.userId === currentUser.id && p.lessonId === lessonId && p.completed);
  };

  const getCourseProgressPercent = (courseId: string): number => {
    if (!currentUser) return 0;
    const courseLessons = lessons.filter(l => l.courseId === courseId && l.published);
    if (courseLessons.length === 0) return 0;
    const completedCount = courseLessons.filter(l => isLessonCompleted(l.id)).length;
    return Math.round((completedCount / courseLessons.length) * 100);
  };

  // Course & Lesson actions
  const createCourse = (newCourseData: Partial<Course>): Course => {
    const newCourse: Course = {
      id: `crs_${Date.now()}`,
      slug: (newCourseData.title || 'new-course').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newCourseData.title || 'Untitled Course',
      subject: newCourseData.subject || 'Python',
      level: newCourseData.level || 'Foundation',
      difficulty: newCourseData.difficulty || 'Beginner',
      description: newCourseData.description || 'Comprehensive curriculum on this technical subject.',
      duration: newCourseData.duration || '4 Weeks',
      trainerId: currentUser?.id || 'usr_trainer_1',
      trainerName: currentUser?.name || 'Dr. Sarah Wanjiku',
      trainerTitle: currentUser?.title || 'Technical Trainer',
      topics: newCourseData.topics || ['Foundations', 'Practice'],
      published: newCourseData.published ?? false,
      certificateEnabled: newCourseData.certificateEnabled ?? true,
      quizzesEnabled: newCourseData.quizzesEnabled ?? true,
      enrolledCount: 0,
      completionRate: 0
    };

    setCourses(prev => [...prev, newCourse]);
    addAuditLog('Created Course', 'course', newCourse.title, `Subject: ${newCourse.subject}`);
    return newCourse;
  };

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, ...updates } : c));
    addAuditLog('Updated Course', 'course', updates.title || courseId);
  };

  const toggleCoursePublish = (courseId: string) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          const nextPub = !c.published;
          addAuditLog(nextPub ? 'Published Course' : 'Unpublished Course', 'course', c.title);
          return { ...c, published: nextPub };
        }
        return c;
      })
    );
  };

  const canDeleteCourse = (course: Course): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'trainer') {
      const isAssigned =
        course.trainerId === currentUser.id ||
        course.trainerName === currentUser.name ||
        course.instructorName === currentUser.name ||
        trainerPermissions.some(tp => tp.trainerId === currentUser.id && tp.courseIds.includes(course.id)) ||
        (currentUser.name.includes('Sarah') && (course.trainerName?.includes('Sarah') || course.instructorName?.includes('Sarah')));
      return Boolean(isAssigned);
    }
    return false;
  };

  const deleteCourse = (courseId: string): { success: boolean; error?: string } => {
    const courseToDelete = courses.find(c => c.id === courseId);
    if (!courseToDelete) {
      return { success: false, error: 'Course not found.' };
    }

    if (!canDeleteCourse(courseToDelete)) {
      showToast('You do not have permission to delete this course.', 'error');
      return { success: false, error: 'Unauthorized: Trainers can only delete courses assigned to them.' };
    }

    // 1. Remove course from state
    setCourses(prev => prev.filter(c => c.id !== courseId));

    // 2. Cascade delete related lessons
    setLessons(prev => prev.filter(l => l.courseId !== courseId));

    // 3. Remove progress records for this course to prevent dangling progress references
    setProgress(prev => prev.filter(p => p.courseId !== courseId));

    // 4. Remove notes for this course
    setNotes(prev => prev.filter(n => n.courseId !== courseId));

    // 5. Update trainer permissions
    setTrainerPermissions(prev =>
      prev.map(tp => ({
        ...tp,
        courseIds: tp.courseIds.filter(id => id !== courseId)
      }))
    );

    // 6. Record in audit log
    addAuditLog(
      'Deleted Course',
      'course',
      courseToDelete.title,
      `Course deleted by ${currentUser?.name} (${currentUser?.role})`
    );

    // 7. Handle active navigation & selectedCourseId if pointing to deleted course
    if (selectedCourseId === courseId) {
      const remaining = courses.filter(c => c.id !== courseId);
      const nextCourseId = remaining.length > 0 ? remaining[0].id : null;
      setSelectedCourseId(nextCourseId);
      setSelectedLessonId(null);

      if (activeView === 'course_detail' || activeView === 'lesson_view' || activeView === 'quiz_view') {
        setActiveView(currentUser?.role === 'student' ? 'student_dashboard' : 'catalog');
      } else if (activeView === 'trainer_editor') {
        setActiveView('trainer_dashboard');
      }
    }

    // 8. Show visible success toast
    showToast(`Course "${courseToDelete.title}" was successfully deleted.`, 'success');

    return { success: true };
  };

  const createLesson = (courseId: string, newLessonData: Partial<Lesson>): Lesson => {
    const courseLessons = lessons.filter(l => l.courseId === courseId);
    const newLesson: Lesson = {
      id: `lsn_${Date.now()}`,
      courseId,
      order: courseLessons.length + 1,
      title: newLessonData.title || `Lesson ${courseLessons.length + 1}`,
      description: newLessonData.description || 'Interactive technical lesson.',
      duration: newLessonData.duration || '45 mins',
      difficulty: newLessonData.difficulty || 'Beginner',
      topics: newLessonData.topics || ['Core Concept'],
      published: newLessonData.published ?? true,
      created_by: currentUser?.id || 'usr_trainer_1',
      contentBlocks: newLessonData.contentBlocks || [
        {
          id: `blk_${Date.now()}_1`,
          order: 1,
          type: 'text',
          title: 'Lesson Introduction',
          content: 'Welcome to this lesson. Review the concepts below and practice in the interactive code playground.'
        },
        {
          id: `blk_${Date.now()}_2`,
          order: 2,
          type: 'code_playground',
          title: 'Interactive Code Playground',
          content: '# Practice your Python code here\nprint("Hello from Fusion EduTech!")\n',
          playgroundLanguage: 'python'
        }
      ],
      exercises: newLessonData.exercises || []
    };

    setLessons(prev => [...prev, newLesson]);
    addAuditLog('Created Lesson', 'lesson', newLesson.title, `In Course ID: ${courseId}`);
    return newLesson;
  };

  const updateLesson = (lessonId: string, updates: Partial<Lesson>) => {
    setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, ...updates } : l));
    addAuditLog('Updated Lesson Content', 'lesson', updates.title || lessonId);
  };

  const toggleLessonPublish = (lessonId: string) => {
    setLessons(prev =>
      prev.map(l => {
        if (l.id === lessonId) {
          const nextPub = !l.published;
          addAuditLog(nextPub ? 'Published Lesson' : 'Unpublished Lesson', 'lesson', l.title);
          return { ...l, published: nextPub };
        }
        return l;
      })
    );
  };

  const updateTrainerPermissions = (trainerId: string, courseIds: string[], lessonIds: string[]) => {
    const trainer = allUsers.find(u => u.id === trainerId);
    setTrainerPermissions(prev => {
      const filtered = prev.filter(p => p.trainerId !== trainerId);
      return [...filtered, { trainerId, courseIds, lessonIds }];
    });
    addAuditLog('Assigned Trainer Permissions', 'permission', trainer?.name || trainerId, `Assigned to ${courseIds.length} courses`);
  };

  const importCsvContent = (csvText: string) => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length <= 1) return { success: false, importedCourses: 0, importedLessons: 0 };
      
      let importedCourses = 0;
      let importedLessons = 0;

      // Parse headers
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => {
          row[h] = cols[idx] || '';
        });

        if (row['type'] === 'course' || (!row['type'] && row['course_title'])) {
          const newCourse: Course = {
            id: `crs_csv_${Date.now()}_${i}`,
            slug: (row['title'] || row['course_title'] || 'imported').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title: row['title'] || row['course_title'] || 'Imported Course',
            subject: (row['subject'] as any) || 'Python',
            level: (row['level'] as any) || 'Foundation',
            difficulty: (row['difficulty'] as any) || 'Beginner',
            description: row['description'] || 'Imported via CSV bulk upload.',
            duration: row['duration'] || '4 Weeks',
            trainerId: currentUser?.id || 'usr_trainer_1',
            trainerName: currentUser?.name || 'Dr. Sarah Wanjiku',
            trainerTitle: 'Technical Trainer',
            topics: (row['topics'] || 'Core').split(';'),
            published: true,
            certificateEnabled: true,
            quizzesEnabled: true,
            enrolledCount: 0,
            completionRate: 0
          };
          setCourses(prev => [...prev, newCourse]);
          importedCourses++;
        } else if (row['type'] === 'lesson' || (!row['type'] && row['lesson_title'])) {
          const targetCourseId = courses[0]?.id || 'crs_python';
          const newLesson: Lesson = {
            id: `lsn_csv_${Date.now()}_${i}`,
            courseId: targetCourseId,
            order: lessons.length + 1,
            title: row['title'] || row['lesson_title'] || 'Imported Lesson',
            description: row['description'] || 'Lesson imported via spreadsheet.',
            duration: row['duration'] || '45 mins',
            difficulty: (row['difficulty'] as any) || 'Beginner',
            topics: (row['topics'] || 'Concept').split(';'),
            published: true,
            created_by: currentUser?.id || 'usr_trainer_1',
            contentBlocks: [
              {
                id: `blk_csv_${Date.now()}_1`,
                order: 1,
                type: 'text',
                title: 'Overview',
                content: row['content'] || 'Imported lesson textual overview.'
              }
            ],
            exercises: []
          };
          setLessons(prev => [...prev, newLesson]);
          importedLessons++;
        }
      }

      addAuditLog('CSV Bulk Content Imported', 'course', `${importedCourses} courses, ${importedLessons} lessons`);
      return { success: true, importedCourses, importedLessons };
    } catch (e) {
      console.error('CSV import error', e);
      return { success: false, importedCourses: 0, importedLessons: 0 };
    }
  };

  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addAuditLog('Updated Platform Settings', 'settings', 'Global Config');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        courses,
        lessons,
        progress,
        notes,
        auditLogs,
        trainerPermissions,
        certificates,
        settings,
        activeView,
        selectedCourseId,
        selectedLessonId,
        isStudentPreviewMode,
        authModal,
        isTutorOpen,
        isNotesOpen,
        selectedCertificate,
        currentView: activeView,
        setActiveView,
        navigateTo,
        setAuthModal,
        setIsTutorOpen,
        setIsNotesOpen,
        setSelectedCertificate,
        setStudentPreviewMode,
        setIsStudentPreviewMode: setStudentPreviewMode,
        login,
        loginWithGoogle,
        logout,
        signup,
        switchDemoUser,
        approveUser,
        rejectUser,
        updateUserRole,
        suspendUser,
        enrollCourse,
        completeLesson,
        saveNote,
        getLessonNote,
        isLessonCompleted,
        getCourseProgressPercent,
        createCourse,
        updateCourse,
        deleteCourse,
        canDeleteCourse,
        toggleCoursePublish,
        createLesson,
        updateLesson,
        toggleLessonPublish,
        updateTrainerPermissions,
        importCsvContent,
        updateSettings,
        addAuditLog,
        toast,
        showToast,
        hideToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
