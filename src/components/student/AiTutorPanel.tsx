import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  HelpCircle,
  Lightbulb,
  Code,
  RotateCcw,
  Loader2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  source?: string;
}

export const AiTutorPanel: React.FC = () => {
  const {
    isTutorOpen,
    setIsTutorOpen,
    courses,
    lessons,
    selectedCourseId,
    selectedLessonId
  } = useApp();

  const course = courses.find(c => c.id === selectedCourseId) || courses[0];
  const lesson = lessons.find(l => l.id === selectedLessonId) || lessons[0];

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'tutor',
      text: `Hello! I am your **Fusion EduTech AI Learning Tutor**.\n\nI can assist you with your current study on **${lesson?.title || 'Programming'}**.\n\nTry clicking one of the quick actions below, or ask any question!`,
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTutorOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTutorOpen]);

  if (!isTutorOpen) return null;

  const sendMessage = async (customPrompt?: string, actionType?: string) => {
    const textToSend = customPrompt || inputQuery;
    if (!textToSend.trim() && !actionType) return;

    const userMessage: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: textToSend || (actionType === 'explain_simpler' ? 'Explain this simpler' : 'Quiz me on this'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customPrompt) setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          actionType,
          courseTitle: course?.title,
          lessonTitle: lesson?.title,
          lessonContext: lesson?.description
        })
      });

      const data = await response.json();
      const tutorReply: ChatMessage = {
        id: `msg_t_${Date.now()}`,
        sender: 'tutor',
        text: data.reply || "I'm ready to help. What else would you like to explore?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source
      };

      setMessages(prev => [...prev, tutorReply]);
    } catch (err) {
      console.error('Tutor API fetch failed', err);
      const fallbackReply: ChatMessage = {
        id: `msg_t_err_${Date.now()}`,
        sender: 'tutor',
        text: `In Python, understanding **${lesson?.title}** comes down to practicing with simple inputs and inspecting outputs.\n\nTake a look at the code playground in the current lesson block to experiment directly!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="bg-[#3E205D] text-white p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E9DDF3] text-[#3E205D] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-[#E9DDF3] flex items-center gap-1.5">
              <span>Fusion AI Tutor</span>
            </h3>
            <p className="text-[10px] text-purple-200 truncate max-w-[200px]">
              Context: {lesson?.title || 'General Curriculum'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsTutorOpen(false)}
          className="text-purple-200 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Action Prompt Chips (Adopted from Section 10) */}
      <div className="bg-purple-50/70 p-2.5 border-b border-purple-100 flex flex-wrap gap-1.5 text-xs">
        <button
          onClick={() => sendMessage(undefined, 'explain_simpler')}
          disabled={loading}
          className="px-2.5 py-1 rounded-md bg-white border border-purple-200 text-[#3E205D] hover:bg-purple-100/60 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <Lightbulb className="w-3 h-3 text-amber-500" />
          <span>Explain Simpler</span>
        </button>

        <button
          onClick={() => sendMessage(undefined, 'quiz_me')}
          disabled={loading}
          className="px-2.5 py-1 rounded-md bg-white border border-purple-200 text-[#3E205D] hover:bg-purple-100/60 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <HelpCircle className="w-3 h-3 text-purple-600" />
          <span>Quiz Me on This</span>
        </button>

        <button
          onClick={() => sendMessage(`Give me an everyday real-world Python code example demonstrating ${lesson?.title}.`)}
          disabled={loading}
          className="px-2.5 py-1 rounded-md bg-white border border-purple-200 text-[#3E205D] hover:bg-purple-100/60 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <Code className="w-3 h-3 text-emerald-600" />
          <span>Code Example</span>
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'tutor' && (
              <div className="w-6 h-6 rounded-full bg-[#E9DDF3] text-[#3E205D] flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#3E205D] text-[#E9DDF3] rounded-br-xs'
                  : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200'
              }`}
            >
              <div className="whitespace-pre-line prose-xs">
                {msg.text}
              </div>
              <div
                className={`text-[9px] mt-1.5 text-right ${
                  msg.sender === 'user' ? 'text-purple-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                U
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-6 h-6 rounded-full bg-[#E9DDF3] text-[#3E205D] flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 rounded-xl bg-slate-100 text-slate-500 rounded-bl-xs flex items-center gap-2 border border-slate-200">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3E205D]" />
              <span className="text-[11px]">Thinking pedagogically...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Query Input */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about ${lesson?.title || 'Python'}...`}
            disabled={loading}
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3E205D]/20 focus:border-[#3E205D]"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !inputQuery.trim()}
            className="absolute right-1.5 p-1.5 rounded-md bg-[#3E205D] text-[#E9DDF3] hover:bg-[#4F2B76] disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 text-center">
          Powered by Gemini • Specialized for Fusion EduTech learners
        </p>
      </div>
    </div>
  );
};
