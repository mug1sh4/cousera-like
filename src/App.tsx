import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/public/LandingPage';
import { CourseCatalog } from './components/public/CourseCatalog';
import { CourseDetail } from './components/public/CourseDetail';
import { AuthModals } from './components/public/AuthModals';
import { StudentDashboard } from './components/student/StudentDashboard';
import { LessonView } from './components/student/LessonView';
import { QuizView } from './components/student/QuizView';
import { ProgressView } from './components/student/ProgressView';
import { StudentProfile } from './components/student/StudentProfile';
import { AiTutorPanel } from './components/student/AiTutorPanel';
import { NotesPanel } from './components/student/NotesPanel';
import { Toast } from './components/common/Toast';
import { TrainerDashboard } from './components/trainer/TrainerDashboard';
import { LessonContentEditor } from './components/trainer/LessonContentEditor';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  switch (currentView) {
    case 'landing':
      return <LandingPage />;
    case 'catalog':
      return <CourseCatalog />;
    case 'course_detail':
      return <CourseDetail />;
    case 'student_dashboard':
      return <StudentDashboard />;
    case 'lesson_view':
      return <LessonView />;
    case 'quiz_view':
      return <QuizView />;
    case 'progress_view':
      return <ProgressView />;
    case 'student_profile':
      return <StudentProfile />;
    case 'trainer_dashboard':
      return <TrainerDashboard />;
    case 'trainer_editor':
      return <LessonContentEditor />;
    case 'admin_dashboard':
      return <AdminDashboard />;
    default:
      return <LandingPage />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased selection:bg-[#E9DDF3] selection:text-[#3E205D]">
        <Header />
        <main className="flex-1">
          <MainContent />
        </main>
        <Footer />

        {/* Global Floating Components */}
        <AuthModals />
        <AiTutorPanel />
        <NotesPanel />
        <Toast />
      </div>
    </AppProvider>
  );
}
