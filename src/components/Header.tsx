import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  Shield,
  FileSpreadsheet,
  Settings,
  History,
  LogOut,
  UserCheck,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Eye,
  Sliders
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    activeView,
    navigateTo,
    setAuthModal,
    logout,
    isStudentPreviewMode,
    setStudentPreviewMode,
    setIsTutorOpen,
    isTutorOpen
  } = useApp();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner for Trainer Preview Mode - One-way sanctioned preview exception */}
      {isStudentPreviewMode && (
        <div className="bg-[#3E205D] text-[#E9DDF3] px-4 py-2 text-xs font-medium border-b border-purple-900">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-900/80 text-[10px] uppercase font-bold tracking-wider text-purple-200">
                Preview Mode
              </span>
              <span>
                <strong>Preview as Student:</strong> You are viewing this course from a student's perspective.
              </span>
            </div>
            <button
              onClick={() => {
                setStudentPreviewMode(false);
                navigateTo('trainer_dashboard');
              }}
              className="px-3 py-1 bg-white text-[#3E205D] rounded-md font-semibold hover:bg-slate-100 transition-colors cursor-pointer text-xs shrink-0 shadow-xs"
            >
              Exit Preview & Return to Trainer Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand Identity */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              if (!currentUser) navigateTo('landing');
              else if (currentUser.role === 'admin') navigateTo('admin_dashboard');
              else if (currentUser.role === 'trainer') navigateTo('trainer_dashboard');
              else navigateTo('student_dashboard');
            }}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-[#3E205D] flex items-center justify-center text-[#E9DDF3] shadow-xs group-hover:bg-[#4F2B76] transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-lg text-slate-900 tracking-tight">Fusion</span>
                <span className="font-heading font-semibold text-lg text-[#3E205D]">EduTech</span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal hidden sm:block">
                We turn knowledge into capability
              </p>
            </div>
          </button>

          {/* Primary Nav Links - Role Scoped */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => navigateTo('catalog')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeView === 'catalog'
                  ? 'bg-slate-100 text-[#3E205D] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Course Catalog
            </button>

            {currentUser && currentUser.role === 'student' && (
              <>
                <button
                  onClick={() => navigateTo('student_dashboard')}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                    activeView === 'student_dashboard'
                      ? 'bg-slate-100 text-[#3E205D] font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Learning
                </button>
                <button
                  onClick={() => navigateTo('progress_view')}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                    activeView === 'progress_view'
                      ? 'bg-slate-100 text-[#3E205D] font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Progress & Credentials
                </button>
              </>
            )}

            {currentUser && currentUser.role === 'trainer' && (
              <>
                <button
                  onClick={() => navigateTo('trainer_dashboard')}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                    activeView === 'trainer_dashboard' || activeView === 'trainer_editor'
                      ? 'bg-slate-100 text-[#3E205D] font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Trainer Dashboard
                </button>
              </>
            )}

            {currentUser && currentUser.role === 'admin' && (
              <>
                <button
                  onClick={() => navigateTo('admin_dashboard')}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                    activeView === 'admin_dashboard'
                      ? 'bg-slate-100 text-[#3E205D] font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Admin Dashboard
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Right Section: AI Tutor & User Profile (No Role Switcher Dropdown) */}
        <div className="flex items-center gap-3">
          {/* AI Tutor Quick Access Button for logged-in students or trainers */}
          {currentUser && (
            <button
              onClick={() => setIsTutorOpen(!isTutorOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#E9DDF3] text-[#3E205D] hover:bg-[#decced] font-medium text-xs transition-colors cursor-pointer border border-purple-200"
              title="Open Fusion AI Learning Tutor"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3E205D]" />
              <span className="hidden sm:inline">AI Tutor</span>
            </button>
          )}

          {/* User Account / Auth Actions */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-slate-200 transition-all cursor-pointer"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              </button>

              {profileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 text-xs"
                  onMouseLeave={() => setProfileMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-slate-500 truncate text-[11px]">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded-sm bg-[#E9DDF3] text-[#3E205D] font-medium capitalize text-[10px]">
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    {currentUser.role === 'student' && (
                      <button
                        onClick={() => {
                          navigateTo('student_profile');
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                        <span>Profile & Settings</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAuthModal('login')}
                className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => setAuthModal('signup')}
                className="px-4 py-1.5 text-sm font-semibold text-[#E9DDF3] bg-[#3E205D] hover:bg-[#4F2B76] rounded-md transition-colors shadow-xs cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
