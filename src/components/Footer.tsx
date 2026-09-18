import React from 'react';
import { GraduationCap, ShieldCheck, HeartHandshake, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#3E205D] flex items-center justify-center text-[#E9DDF3]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-base text-white">Fusion EduTech</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              We turn knowledge into capability. Practical programming, data analytics, cyber defense, and digital capability training.
            </p>
            <div className="text-[11px] text-slate-500">
              Approved Fusion Organization LMS Stack
            </div>
          </div>

          {/* Catalog & Learning */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-3 text-xs uppercase tracking-wider">Curriculum</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigateTo('catalog')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  Python Programming Essentials
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('catalog')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  Data Analytics (Foundation to Advanced)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('catalog')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  Ethical Hacking & Cyber Defense
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('catalog')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  Social Media Management
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional Pillars */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-3 text-xs uppercase tracking-wider">Pillars & Architecture</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enterprise Row Level Security</span>
              </li>
              <li className="flex items-center gap-2">
                <HeartHandshake className="w-3.5 h-3.5 text-[#E9DDF3]" />
                <span>Direct Trainer Scoped Mentorship</span>
              </li>
              <li className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>Centralized Account Integration</span>
              </li>
            </ul>
          </div>

          {/* Legal / Status */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-3 text-xs uppercase tracking-wider">Platform Status</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Production Learning Node Active</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                App Version 2.4.0 — Coursera-style Rebuild Specification 2026. Self-hosted database & server-side AI Tutor.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Fusion EduTech. All rights reserved. Strategic Rebuild Plan 2026–2027.</p>
          <div className="flex items-center gap-4">
            <span>Corporate Pillar: Lavender (#E9DDF3)</span>
            <span>•</span>
            <span>Security Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
