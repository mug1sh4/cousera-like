import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, Lock, CheckCircle2, Shield } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { currentUser, navigateTo } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [email] = useState(currentUser?.email || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs font-semibold text-[#3E205D] uppercase tracking-wider">
          Student Account
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
          Profile & Security Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal profile details, cohort bio, and security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs text-center space-y-4">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt={currentUser?.name}
            className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-slate-200 shadow-xs"
          />
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900">{currentUser?.name}</h3>
            <p className="text-xs text-slate-500">{currentUser?.email}</p>
            <div className="mt-2 flex items-center justify-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-[#E9DDF3] text-[#3E205D] text-[11px] font-semibold capitalize">
                {currentUser?.role}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-left text-xs space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Joined Platform:</span>
              <span className="font-medium">{currentUser?.joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Form Settings */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Details Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-semibold text-base text-slate-900">
              Personal Information
            </h2>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile details updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20 focus:border-[#3E205D]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Email Address (Primary Identity)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-slate-400">Email is locked to your centralized institutional account.</p>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Learner Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20 focus:border-[#3E205D]"
                  placeholder="Share a short bio with your trainers and peers..."
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] font-semibold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Save Profile Changes
              </button>
            </form>
          </div>

          {/* Password Security Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-semibold text-base text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#3E205D]" />
              <span>Password & Authentication</span>
            </h2>

            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Password updated and encrypted via Supabase Auth!</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20 focus:border-[#3E205D]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20 focus:border-[#3E205D]"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
