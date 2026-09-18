export type UserRole = 'student' | 'trainer' | 'admin';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type UserStatus = ApprovalStatus;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: ApprovalStatus;
  avatar?: string;
  title?: string;
  bio?: string;
  joinedDate: string;
}

export type SubjectCategory = 'Python' | 'Data Analytics' | 'Ethical Hacking' | 'Social Media Management';
export type CourseLevel = 'Foundation' | 'Intermediate' | 'Advanced';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: string;
  slug: string;
  title: string;
  subject: SubjectCategory;
  level: CourseLevel;
  difficulty: Difficulty;
  description: string;
  duration: string;
  trainerId: string;
  trainerName: string;
  trainerTitle: string;
  instructorName?: string;
  topics: string[];
  published: boolean;
  certificateEnabled: boolean;
  quizzesEnabled: boolean;
  completionThreshold?: number;
  certificateNoteText?: string;
  certificateSignatureTrainer?: string;
  enrolledCount: number;
  completionRate: number;
}

export type ContentBlockType = 'text' | 'code_playground' | 'video';

export interface VideoChapter {
  id: string;
  timeSeconds: number;
  timeFormatted: string; // e.g. "02:15"
  title: string;
}

export interface ResourceLink {
  id: string;
  title: string;
  url: string;
  type: 'pdf' | 'doc' | 'archive' | 'link';
  size?: string;
}

export interface ContentBlock {
  id: string;
  order: number;
  type: ContentBlockType;
  title?: string;
  content: string; // Markdown or code or overview text
  playgroundLanguage?: 'python';
  expectedOutput?: string;
  solutionCode?: string;
  // Video block specific fields:
  videoUrl?: string;
  videoFileName?: string;
  captionUrl?: string;
  captionFileName?: string;
  chapters?: VideoChapter[];
  resources?: ResourceLink[];
}

export type ExerciseType = 'multiple_choice' | 'text' | 'code' | 'true_false';

export interface Exercise {
  id: string;
  lessonId: string;
  order: number;
  question: string;
  type: ExerciseType;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  order: number;
  title: string;
  description: string;
  duration: string;
  difficulty: Difficulty;
  topics: string[];
  published: boolean;
  created_by: string;
  contentBlocks: ContentBlock[];
  exercises: Exercise[];
}

export interface UserProgress {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  lastVisitedAt: string;
  completedAt?: string;
}

export interface UserNote {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogItem {
  id: string;
  actorId: string;
  actorName: string;
  performedBy?: string;
  actorRole: UserRole;
  action: string;
  targetType: 'user' | 'course' | 'lesson' | 'permission' | 'settings';
  targetName: string;
  target?: string;
  timestamp: string;
  details?: string;
}

export interface TrainerPermission {
  trainerId: string;
  courseIds: string[];
  lessonIds: string[];
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  credentialId?: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  courseLevel?: string;
  issueDate: string;
  verificationHash: string;
  noteText?: string;
  trainerSignatureName?: string;
  trainerSignatureTitle?: string;
}

export interface PlatformSettings {
  siteName: string;
  tagline: string;
  supportEmail: string;
  autoApproveStudents: boolean;
  allowSignups: boolean;
  tutorModel: string;
  certificateSignatureName: string;
  certificateSignatureTitle: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
