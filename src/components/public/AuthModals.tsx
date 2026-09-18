import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, User, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const AuthModals: React.FC = () => {
  const { authModal, setAuthModal, login, signup, loginWithGoogle } = useApp();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  if (!authModal) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Please provide an email address');
      return;
    }
    const success = login(email);
    if (!success) {
      setError('No account found with this email. Try one of the demo accounts below or create an account.');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !name) {
      setError('Please provide your full name and email address');
      return;
    }
    const res = signup(name, email);
    if (!res.success) {
      setError('An account with this email already exists. Please log in instead.');
    }
  };

  const handleGoogleAuth = () => {
    setError(null);
    loginWithGoogle('student', name || 'Barbra Bitengo', email || undefined);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email to receive reset instructions');
      return;
    }
    setResetSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 relative space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={() => {
            setAuthModal(null);
            setError(null);
            setResetSent(false);
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E9DDF3] text-[#3E205D] text-[11px] font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Fusion EduTech</span>
          </div>
          <h2 className="font-heading font-bold text-2xl text-slate-900">
            {authModal === 'login' && 'Welcome Back'}
            {authModal === 'signup' && 'Create Your Account'}
            {authModal === 'forgot_password' && 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-500">
            {authModal === 'login' && 'Sign in to access your courses, interactive playgrounds, and AI tutor.'}
            {authModal === 'signup' && 'Get instant access to real-world technical curricula and credentials.'}
            {authModal === 'forgot_password' && 'Enter your registered email address to receive password recovery instructions.'}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        {authModal !== 'forgot_password' && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{authModal === 'login' ? 'Sign in with Google' : 'Sign up with Google'}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-2 text-[11px] text-slate-400 uppercase tracking-wider absolute">or</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        {authModal === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@fusionedutech.com"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20 focus:border-[#3E205D]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setAuthModal('forgot_password')}
                  className="text-[11px] text-[#3E205D] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20 focus:border-[#3E205D]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] font-semibold text-xs transition-colors shadow-xs cursor-pointer"
            >
              Sign In to Platform
            </button>

            {/* Quick Demo Credentials for Fast Review */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Instant Demo Logins:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setEmail('alex.kimani@fusionedutech.com')}
                  className="p-2 text-left rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] cursor-pointer"
                >
                  <strong className="block text-slate-900">Student</strong>
                  <span className="text-slate-500 truncate block">Alex Kimani</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEmail('dr.sarah@fusionedutech.com')}
                  className="p-2 text-left rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] cursor-pointer"
                >
                  <strong className="block text-slate-900">Trainer</strong>
                  <span className="text-slate-500 truncate block">Dr. Sarah</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEmail('jane.omondi@fusionedutech.com')}
                  className="p-2 text-left rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] cursor-pointer"
                >
                  <strong className="block text-slate-900">Admin</strong>
                  <span className="text-slate-500 truncate block">Jane Omondi</span>
                </button>
              </div>
            </div>

            <div className="text-center pt-1 text-xs text-slate-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthModal('signup')}
                className="font-semibold text-[#3E205D] hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </div>
          </form>
        )}

        {/* Signup Form */}
        {authModal === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Barbra Bitengo"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20 focus:border-[#3E205D]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20 focus:border-[#3E205D]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20 focus:border-[#3E205D]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] font-semibold text-xs transition-colors shadow-xs cursor-pointer"
            >
              Create Student Account
            </button>

            <div className="text-center pt-1 text-xs text-slate-600">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setAuthModal('login')}
                className="font-semibold text-[#3E205D] hover:underline cursor-pointer"
              >
                Log in
              </button>
            </div>
          </form>
        )}

        {/* Forgot Password Form */}
        {authModal === 'forgot_password' && (
          <div className="space-y-4">
            {resetSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-800">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Password Reset Dispatched</span>
                </div>
                <p className="leading-relaxed">
                  A password reset link has been dispatched to <strong>{email}</strong>. Please check your inbox.
                </p>
                <button
                  onClick={() => {
                    setResetSent(false);
                    setAuthModal('login');
                  }}
                  className="mt-3 px-3 py-1.5 bg-emerald-600 text-white rounded-md text-xs font-semibold cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Registered Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20 focus:border-[#3E205D]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#3E205D] hover:bg-[#4F2B76] text-[#E9DDF3] font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  Send Recovery Link
                </button>

                <div className="text-center pt-2 text-xs text-slate-600">
                  Remember your credentials?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModal('login')}
                    className="font-semibold text-[#3E205D] hover:underline cursor-pointer"
                  >
                    Back to Log In
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
