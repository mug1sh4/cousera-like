import React from 'react';
import { Certificate } from '../../types';
import { Award, CheckCircle2, Download, Printer, X, ShieldCheck, Sparkles } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 sm:p-8 relative space-y-6 animate-in fade-in zoom-in-95">
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Award className="w-4 h-4 text-[#3E205D]" />
            <span>Capability Credential Verification</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Capability Credential Canvas (Lavender border #E9DDF3, Poppins headings, Aptos/sans body) */}
        <div className="border-4 sm:border-8 border-[#E9DDF3] bg-white rounded-2xl p-6 sm:p-10 text-center relative shadow-xs">
          {/* Inner subtle frame */}
          <div className="border border-purple-100 rounded-xl p-6 sm:p-8 bg-gradient-to-b from-purple-50/20 via-white to-purple-50/10">
            {/* Top Brand & Icon */}
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#3E205D] text-[#E9DDF3] flex items-center justify-center shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-lg text-slate-900 tracking-tight">
                Fusion <span className="text-[#3E205D]">EduTech</span>
              </span>
            </div>

            <p className="font-heading font-semibold text-xs tracking-widest uppercase text-[#3E205D]">
              Verified Digital Credential
            </p>

            <h2 className="font-heading text-2xl sm:text-3xl text-slate-900 mt-2 font-bold tracking-tight">
              Capability Credential
            </h2>

            <p className="text-xs text-slate-500 mt-4">
              This officially certifies that
            </p>

            <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 border-b-2 border-[#E9DDF3] inline-block px-8 py-1.5 mt-2">
              {certificate.userName}
            </h3>

            <p className="text-xs text-slate-600 max-w-lg mx-auto mt-4 leading-relaxed">
              has demonstrated practical mastery, completed all required course modules, and scored above the capability threshold in
            </p>

            <p className="font-heading font-bold text-lg sm:text-xl text-[#3E205D] mt-2">
              {certificate.courseTitle}
            </p>

            {certificate.courseLevel && (
              <p className="text-xs font-semibold text-slate-600 mt-1">
                Level: {certificate.courseLevel}
              </p>
            )}

            {/* Signatures & Verification Details */}
            <div className="pt-8 mt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 text-left text-xs">
              <div>
                <p className="font-heading text-xs font-bold text-slate-800">
                  {certificate.trainerSignatureName || 'Dr. Sarah Wanjiku'}
                </p>
                <div className="h-0.5 bg-[#E9DDF3] w-32 my-1" />
                <p className="text-[11px] text-slate-500">
                  {certificate.trainerSignatureTitle || 'Lead Technical Trainer'}
                </p>
              </div>

              <div>
                <p className="font-heading text-xs font-bold text-slate-800">Jane Omondi</p>
                <div className="h-0.5 bg-[#E9DDF3] w-32 my-1" />
                <p className="text-[11px] text-slate-500">Academic Operations Lead</p>
              </div>

              <div className="col-span-2 sm:col-span-1 text-left sm:text-right space-y-0.5">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Credential ID</p>
                <p className="font-mono text-xs font-bold text-slate-800">{certificate.certificateNumber}</p>
                <p className="text-[10px] text-slate-500">Hash: {certificate.verificationHash}</p>
                <p className="text-[10px] text-slate-500">Issued: {certificate.issueDate}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          Fusion EduTech • "We turn knowledge into capability"
        </div>
      </div>
    </div>
  );
};
