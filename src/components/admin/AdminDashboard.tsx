import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, SubjectCategory, Course } from '../../types';
import { CourseWizardModal } from '../trainer/CourseWizardModal';
import { DeleteCourseModal } from '../common/DeleteCourseModal';
import { formatLevel } from '../../utils/formatters';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  Award,
  TrendingUp,
  Activity,
  Plus,
  Filter,
  Search,
  Sliders,
  Check,
  Eye,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
  UserCheck,
  FileText,
  Settings,
  Save,
  CheckCircle,
  Trash2
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    allUsers,
    courses,
    lessons,
    certificates,
    auditLogs,
    progress,
    settings,
    updateSettings,
    updateUserRole,
    suspendUser,
    updateCourse,
    deleteCourse,
    toggleCoursePublish,
    navigateTo,
    addAuditLog
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'analytics' | 'audit' | 'settings'>('overview');
  const [userFilter, setUserFilter] = useState<'all' | 'approved' | 'suspended'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'trainer' | 'admin'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Operational items state for "Needs Your Attention"
  const [resolvedEscalationIds, setResolvedEscalationIds] = useState<string[]>([]);

  // Draft courses awaiting publishing
  const draftCourses = courses.filter(c => !c.published);

  // Mock operational AI Tutor escalations requiring instructor or admin review
  const operationalEscalations = [
    {
      id: 'esc_1',
      studentName: 'Alex Kimani',
      courseTitle: 'Python Programming Essentials',
      query: 'Student flagged confusion on dictionary hash collisions in exercise #3.',
      timestamp: 'Today at 10:45 AM',
      type: 'Tutor Clarification'
    },
    {
      id: 'esc_2',
      studentName: 'Brian Mwangi',
      courseTitle: 'Cyber Defense & Network Security',
      query: 'Lab environment port binding error reported during live nmap scan exercise.',
      timestamp: 'Yesterday at 4:15 PM',
      type: 'Lab Escalation'
    }
  ].filter(esc => !resolvedEscalationIds.includes(esc.id));

  // Summary Metrics
  const approvedUsers = allUsers.filter(u => u.status === 'approved');
  const suspendedUsers = allUsers.filter(u => u.status === 'suspended');
  const totalStudents = allUsers.filter(u => u.role === 'student');
  const totalTrainers = allUsers.filter(u => u.role === 'trainer');
  const completedLessonsCount = progress.filter(p => p.completed).length;

  // Filtered users for User Management tab
  const filteredUsers = allUsers.filter(u => {
    if (userFilter !== 'all' && u.status !== userFilter) return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 text-[#3E205D]">
              Platform Administration
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <strong>{currentUser?.name}</strong> • Institutional overview, user roles, curriculum governance, and audit ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-[#3E205D] text-[#E9DDF3]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'bg-[#3E205D] text-[#E9DDF3]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manage Users</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'courses'
              ? 'bg-[#3E205D] text-[#E9DDF3]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Courses & Curricula</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'bg-[#3E205D] text-[#E9DDF3]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Platform Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'bg-[#3E205D] text-[#E9DDF3]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Audit Log</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-[#3E205D] text-[#E9DDF3]'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Platform Settings</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              onClick={() => setActiveTab('users')}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer group"
            >
              <span className="text-xs text-slate-500 font-medium flex items-center justify-between">
                <span className="group-hover:text-[#3E205D] transition-colors">Total Users</span>
                <Users className="w-4 h-4 text-[#3E205D]" />
              </span>
              <div className="font-heading text-2xl font-bold text-slate-900">{allUsers.length}</div>
              <p className="text-[11px] text-slate-500">
                {totalStudents.length} students, {totalTrainers.length} trainers
              </p>
            </div>

            <div
              onClick={() => setActiveTab('courses')}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer group"
            >
              <span className="text-xs text-slate-500 font-medium flex items-center justify-between">
                <span className="group-hover:text-[#3E205D] transition-colors">Active Courses</span>
                <BookOpen className="w-4 h-4 text-purple-600" />
              </span>
              <div className="font-heading text-2xl font-bold text-slate-900">{courses.length}</div>
              <p className="text-[11px] text-slate-500">
                {courses.filter(c => c.published).length} published • {draftCourses.length} in draft
              </p>
            </div>

            <div
              onClick={() => setActiveTab('analytics')}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer group"
            >
              <span className="text-xs text-slate-500 font-medium flex items-center justify-between">
                <span className="group-hover:text-[#3E205D] transition-colors">Lessons Completed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </span>
              <div className="font-heading text-2xl font-bold text-slate-900">{completedLessonsCount}</div>
              <p className="text-[11px] text-slate-500">Across interactive code sandboxes</p>
            </div>

            <div
              onClick={() => setActiveTab('audit')}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer group"
            >
              <span className="text-xs text-slate-500 font-medium flex items-center justify-between">
                <span className="group-hover:text-[#3E205D] transition-colors">Credentials Issued</span>
                <Award className="w-4 h-4 text-amber-500" />
              </span>
              <div className="font-heading text-2xl font-bold text-slate-900">{certificates.length}</div>
              <p className="text-[11px] text-slate-500">Verifiable capability credentials</p>
            </div>
          </div>

          {/* Operational Needs Your Attention Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Needs Your Attention</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                    {draftCourses.length + operationalEscalations.length} items
                  </span>
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Operational reviews, draft curriculum approvals, and student learning escalations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Draft Courses awaiting publish */}
              {draftCourses.map(course => (
                <div key={course.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                        Course Draft
                      </span>
                      <span className="text-[11px] text-slate-400">Created recently</span>
                    </div>
                    <h4 className="font-semibold text-xs text-slate-900">{course.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{course.description}</p>
                    <div className="text-[11px] text-slate-500">
                      Assigned to: <strong>{course.trainerName}</strong> • {formatLevel(course.level)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => toggleCoursePublish(course.id)}
                      className="px-3 py-1.5 rounded-md bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Publish to Catalog</span>
                    </button>
                    <button
                      onClick={() => navigateTo('trainer_editor', course.id)}
                      className="px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer transition-colors"
                    >
                      Edit Lessons
                    </button>
                  </div>
                </div>
              ))}

              {/* AI Tutor Escalations */}
              {operationalEscalations.map(esc => (
                <div key={esc.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-[#3E205D] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#3E205D]" />
                        <span>{esc.type}</span>
                      </span>
                      <span className="text-[11px] text-slate-400">{esc.timestamp}</span>
                    </div>
                    <h4 className="font-semibold text-xs text-slate-900">{esc.courseTitle}</h4>
                    <p className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-md border border-slate-100 italic">
                      "{esc.query}"
                    </p>
                    <div className="text-[11px] text-slate-500">
                      Student: <strong>{esc.studentName}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setResolvedEscalationIds(prev => [...prev, esc.id]);
                        addAuditLog('Resolved AI Tutor Escalation', 'course', esc.courseTitle, `Addressed inquiry from ${esc.studentName}`);
                      }}
                      className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  </div>
                </div>
              ))}

              {draftCourses.length === 0 && operationalEscalations.length === 0 && (
                <div className="col-span-full py-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                  <p className="font-semibold text-slate-800">All systems operating smoothly</p>
                  <p className="text-[11px] text-slate-400 mt-1">No pending course drafts or flagged student escalations.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Operations Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-[#3E205D] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                User Management & Roles
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review registered users, promote learners to instructors, or manage account permissions.
              </p>
              <button
                onClick={() => setActiveTab('users')}
                className="text-xs font-semibold text-[#3E205D] hover:underline flex items-center gap-1 cursor-pointer pt-2"
              >
                <span>Manage Users & Roles</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#E9DDF3] text-[#3E205D] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Curriculum Allocation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Oversee course publications, reassign lead instructors, or initiate new technical disciplines.
              </p>
              <button
                onClick={() => setActiveTab('courses')}
                className="text-xs font-semibold text-[#3E205D] hover:underline flex items-center gap-1 cursor-pointer pt-2"
              >
                <span>Browse All Courses</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Security & Audit Log
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect institutional records, permission transitions, course publications, and administrative changes.
              </p>
              <button
                onClick={() => setActiveTab('audit')}
                className="text-xs font-semibold text-[#3E205D] hover:underline flex items-center gap-1 cursor-pointer pt-2"
              >
                <span>View Real-Time Audit Feed</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Controls & Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by name or email..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1 border border-slate-300 rounded-lg p-1 bg-slate-50">
                {(['all', 'approved', 'suspended'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setUserFilter(s)}
                    className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                      userFilter === s ? 'bg-[#3E205D] text-[#E9DDF3]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 border border-slate-300 rounded-lg p-1 bg-slate-50">
                {(['all', 'student', 'trainer', 'admin'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                      roleFilter === r ? 'bg-[#3E205D] text-[#E9DDF3]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Registered Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Users className="w-8 h-8 text-slate-300" />
                          <p className="font-semibold text-xs text-slate-700">No users match your filter criteria</p>
                          <p className="text-[11px] text-slate-400">Try adjusting your search query or role/status filters.</p>
                          {(searchQuery || userFilter !== 'all' || roleFilter !== 'all') && (
                            <button
                              onClick={() => {
                                setSearchQuery('');
                                setUserFilter('all');
                                setRoleFilter('all');
                              }}
                              className="mt-2 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              Clear Filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-semibold text-slate-900">{user.name}</div>
                              <div className="text-[11px] text-slate-500">{user.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                            className="p-1 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-700 bg-white"
                          >
                            <option value="student">Student</option>
                            <option value="trainer">Trainer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>

                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            user.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>

                        <td className="p-4 text-slate-500 text-[11px]">{user.joinedDate}</td>

                        <td className="p-4 text-right space-x-2">
                          {user.id !== currentUser?.id && user.status === 'approved' && (
                            <button
                              onClick={() => suspendUser(user.id)}
                              className="px-2.5 py-1 rounded border border-rose-300 hover:bg-rose-50 text-rose-600 font-medium text-[11px] transition-colors cursor-pointer"
                            >
                              Suspend
                            </button>
                          )}
                          {user.status === 'suspended' && (
                            <button
                              onClick={() => {
                                // Unsuspend
                                updateUserRole(user.id, user.role);
                              }}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] transition-colors cursor-pointer"
                            >
                              Unsuspend
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COURSE & CURRICULUM MANAGEMENT */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-900">
                Course Catalog ({courses.length})
              </h2>
              <p className="text-xs text-slate-500">
                Manage course visibility, assigned instructors, and curriculum structures.
              </p>
            </div>

            <button
              onClick={() => setIsWizardOpen(true)}
              className="px-4 py-2 rounded-lg bg-[#3E205D] text-[#E9DDF3] font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Course</span>
            </button>
          </div>

          {/* Search bar for courses */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={courseSearchQuery}
                onChange={(e) => setCourseSearchQuery(e.target.value)}
                placeholder="Search courses by title, subject, or trainer..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20"
              />
            </div>
            {courseSearchQuery && (
              <button
                onClick={() => setCourseSearchQuery('')}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="p-4">Course</th>
                  <th className="p-4">Subject & Level</th>
                  <th className="p-4">Assigned Trainer</th>
                  <th className="p-4">Modules</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses
                  .filter(c => {
                    if (!courseSearchQuery) return true;
                    const q = courseSearchQuery.toLowerCase();
                    return (
                      c.title.toLowerCase().includes(q) ||
                      c.subject.toLowerCase().includes(q) ||
                      (c.trainerName && c.trainerName.toLowerCase().includes(q)) ||
                      (c.instructorName && c.instructorName.toLowerCase().includes(q))
                    );
                  })
                  .map(c => {
                    const cLessons = lessons.filter(l => l.courseId === c.id);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-slate-900">{c.title}</div>
                          <div className="text-[11px] text-slate-500">{c.duration}</div>
                        </td>

                        <td className="p-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded bg-[#E9DDF3] text-[#3E205D] font-semibold text-[11px]">
                              {c.subject}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                              {formatLevel(c.level)}
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          <select
                            value={c.trainerName || c.instructorName}
                            onChange={(e) => updateCourse(c.id, { trainerName: e.target.value, instructorName: e.target.value })}
                            className="p-1 border border-slate-200 rounded-md text-[11px] text-slate-700 bg-white"
                          >
                            <option value="Dr. Sarah Wanjiku">Dr. Sarah Wanjiku</option>
                            <option value="Jane Omondi">Jane Omondi</option>
                            <option value="Alex Kimani">Alex Kimani</option>
                          </select>
                        </td>

                        <td className="p-4 text-slate-600 font-medium">
                          {cLessons.length} Modules
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => toggleCoursePublish(c.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                              c.published
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                          >
                            {c.published ? 'Published (Click to Unpublish)' : 'Draft (Click to Publish)'}
                          </button>
                        </td>

                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => navigateTo('trainer_editor', c.id)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] cursor-pointer"
                          >
                            Edit Content
                          </button>
                          <button
                            onClick={() => navigateTo('course_detail', c.id)}
                            className="text-xs text-[#3E205D] hover:underline font-semibold cursor-pointer"
                          >
                            View Page
                          </button>
                          <button
                            onClick={() => setCourseToDelete(c)}
                            className="px-2.5 py-1 rounded border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                {courses.filter(c => {
                  if (!courseSearchQuery) return true;
                  const q = courseSearchQuery.toLowerCase();
                  return (
                    c.title.toLowerCase().includes(q) ||
                    c.subject.toLowerCase().includes(q) ||
                    (c.trainerName && c.trainerName.toLowerCase().includes(q)) ||
                    (c.instructorName && c.instructorName.toLowerCase().includes(q))
                  );
                }).length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <BookOpen className="w-8 h-8 text-slate-300" />
                        <p className="font-semibold text-xs text-slate-700">No courses match your filter criteria</p>
                        <p className="text-[11px] text-slate-400">Try changing your search terms.</p>
                        {courseSearchQuery && (
                          <button
                            onClick={() => setCourseSearchQuery('')}
                            className="mt-2 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            Clear Search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PLATFORM ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="font-heading font-bold text-lg text-slate-900">
              Platform Analytics
            </h2>
            <p className="text-xs text-slate-500">
              Completion rates, course engagement benchmarks, and credential issuances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-heading font-semibold text-sm text-slate-900">
                Course Enrollment Breakdown
              </h3>
              <div className="space-y-3">
                {courses.map(c => {
                  const share = Math.min(100, Math.round((c.enrolledCount / 50) * 100));
                  return (
                    <div key={c.id} className="space-y-1 text-xs">
                      <div className="flex justify-between text-slate-700">
                        <span className="font-medium truncate max-w-xs">{c.title}</span>
                        <span className="font-semibold">{c.enrolledCount} learners</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#3E205D] rounded-full" style={{ width: `${share}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-heading font-semibold text-sm text-slate-900">
                Progression Milestones
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950 flex justify-between items-center">
                  <span>Completed Course Laboratories</span>
                  <span className="font-bold text-sm">{completedLessonsCount}</span>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-[#3E205D] flex justify-between items-center">
                  <span>Official Credentials Conferred</span>
                  <span className="font-bold text-sm">{certificates.length}</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-950 flex justify-between items-center">
                  <span>Passing Score Rate</span>
                  <span className="font-bold text-sm">88.4%</span>
                </div>
                <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 text-sky-950 flex justify-between items-center">
                  <span>Interactive Code Sandbox Runs</span>
                  <span className="font-bold text-sm">2,419 runs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="font-heading font-bold text-lg text-slate-900">
              Platform Audit Log ({auditLogs.length} Events)
            </h2>
            <p className="text-xs text-slate-500">
              Chronological log of role changes, course publications/unpublishing, and account suspensions.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100 text-xs">
              {auditLogs.map(log => (
                <div key={log.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#3E205D] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-900 text-sm">
                        {log.action}
                      </div>
                      <div className="text-slate-600 text-xs leading-relaxed">
                        {log.details}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Initiated by: <strong>{log.actorName || log.performedBy}</strong> • Target: {log.targetName || log.target}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 shrink-0">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PLATFORM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-900">
                Platform Settings
              </h2>
              <p className="text-xs text-slate-500">
                Institutional branding, registration policies, AI learning engine parameters, and credential signatures.
              </p>
            </div>
            {settingsSaved && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Settings saved successfully</span>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateSettings(settingsForm);
              setSettingsSaved(true);
              setTimeout(() => setSettingsSaved(false), 3000);
            }}
            className="space-y-6"
          >
            {/* Section 1: Institutional Branding */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-heading font-semibold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3E205D]" />
                <span>Institutional Branding & Identity</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Platform / Institution Name</label>
                  <input
                    type="text"
                    value={settingsForm.siteName}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, siteName: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Support Email Address</label>
                  <input
                    type="email"
                    value={settingsForm.supportEmail}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, supportEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20"
                    required
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Platform Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Registration & Enrollment Policy */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-heading font-semibold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3E205D]" />
                <span>Registration & Access Controls</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-start gap-3 p-3.5 border border-slate-200 rounded-lg hover:bg-slate-50/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={settingsForm.allowSignups}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, allowSignups: e.target.checked }))}
                    className="mt-0.5 rounded text-[#3E205D] focus:ring-[#3E205D]/20"
                  />
                  <div className="space-y-0.5 text-xs">
                    <span className="font-semibold text-slate-900 block">Allow Public Student Signups</span>
                    <span className="text-slate-500 text-[11px] block">When enabled, prospective students can self-register via the portal.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 border border-slate-200 rounded-lg hover:bg-slate-50/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={settingsForm.autoApproveStudents}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, autoApproveStudents: e.target.checked }))}
                    className="mt-0.5 rounded text-[#3E205D] focus:ring-[#3E205D]/20"
                  />
                  <div className="space-y-0.5 text-xs">
                    <span className="font-semibold text-slate-900 block">Instant Student Activation</span>
                    <span className="text-slate-500 text-[11px] block">Immediately activate new learner profiles without administrative review.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Section 3: AI Learning Engine & Capabilities */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-heading font-semibold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3E205D]" />
                <span>AI Tutor & Intelligent Learning Assistants</span>
              </h3>
              <div className="space-y-1 max-w-md">
                <label className="text-xs font-semibold text-slate-700">Active Foundation Model</label>
                <select
                  value={settingsForm.tutorModel}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, tutorModel: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20 bg-white"
                >
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended - Real-time Coding & Explanations)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Multimodal Analysis & Extended Context)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Lightweight High-Throughput)</option>
                  <option value="gemini-3.8-flash">Gemini 3.8 Flash (Experimental Ultra-Low Latency)</option>
                </select>
                <p className="text-[11px] text-slate-400">Controls the model invoked by the student AI Tutor and interactive code assistant.</p>
              </div>
            </div>

            {/* Section 4: Capability Credential Governance */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-heading font-semibold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#3E205D]" />
                <span>Capability Credential Authorization Signatures</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Authorized Signatory Name(s)</label>
                  <input
                    type="text"
                    value={settingsForm.certificateSignatureName}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, certificateSignatureName: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Authorized Signatory Title(s)</label>
                  <input
                    type="text"
                    value={settingsForm.certificateSignatureTitle}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, certificateSignatureTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSettingsForm(settings);
                  setSettingsSaved(false);
                }}
                className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel & Reset
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Platform Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Course Wizard Modal */}
      <CourseWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />

      {/* Course Deletion Confirmation Modal */}
      <DeleteCourseModal
        isOpen={Boolean(courseToDelete)}
        course={courseToDelete}
        onConfirm={() => {
          if (courseToDelete) {
            deleteCourse(courseToDelete.id);
            setCourseToDelete(null);
          }
        }}
        onCancel={() => setCourseToDelete(null)}
      />
    </div>
  );
};
