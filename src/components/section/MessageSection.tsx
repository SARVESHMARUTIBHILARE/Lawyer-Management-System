import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  Lock,
  Paperclip,
  CheckCheck,
  Calendar,
  Phone,
  Mail,
  Building2,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { MessageThread, ChatMessage } from '../../../types/dashboard';
import { ProfileAvatar } from '../ProfileAvatar';

interface MessagesSectionProps {
  threads: MessageThread[];
  onSendMessage: (threadId: string, text: string) => void;
  onScheduleFromChat: (clientName: string, caseType: string) => void;
}

export const MessagesSection: React.FC<MessagesSectionProps> = ({
  threads,
  onSendMessage,
  onScheduleFromChat
}) => {
  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const filteredThreads = threads.filter((t) => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      t.clientName.toLowerCase().includes(q) ||
      t.company.toLowerCase().includes(q) ||
      t.caseId.toLowerCase().includes(q)
    );
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;
    onSendMessage(activeThread.id, inputText.trim());
    setInputText('');
  };

  const quickReplies = [
    'Received. I am reviewing the draft in chambers now.',
    'Please send over the notarized signature page.',
    'Let us schedule a 30-minute consultation call.',
    'Court filings have been completed and verified on the docket.'
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Encrypted Communications</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Attorney-Client Messages
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Direct, confidential channel for consultation follow-ups, case status inquiries, and preliminary legal guidance.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shrink-0">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Privilege & Work-Product Protected</span>
        </div>
      </div>

      {/* Two-Column Messenger Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        {/* Left Column: Thread List (4 cols) */}
        <div className="lg:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-3.5 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredThreads.map((thread) => {
              const isSelected = thread.id === activeThread?.id;
              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full p-3.5 text-left flex items-start gap-3 transition ${
                    isSelected
                      ? 'bg-blue-50/80 border-l-4 border-l-blue-900'
                      : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="relative shrink-0">
                    <ProfileAvatar
                      src={thread.clientAvatar}
                      name={thread.clientName}
                      size="md"
                      rounded="full"
                      ring="ring-1 ring-slate-200"
                      badgeType="client"
                    />
                    {thread.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-900 text-white text-[10px] font-bold flex items-center justify-center">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {thread.clientName}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {thread.lastTimestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {thread.company} • <span className="font-mono text-slate-600">{thread.caseId}</span>
                    </p>

                    <p className="text-xs text-slate-600 truncate mt-1">
                      {thread.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat History & Composer (8 cols) */}
        {activeThread ? (
          <div className="lg:col-span-8 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3">
                <ProfileAvatar
                  src={activeThread.clientAvatar}
                  name={activeThread.clientName}
                  size="md"
                  rounded="full"
                  ring="ring-1 ring-slate-200"
                  badgeType="client"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{activeThread.clientName}</h3>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.2 rounded-full font-mono">
                      {activeThread.caseId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {activeThread.company} • {activeThread.caseType}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onScheduleFromChat(activeThread.clientName, activeThread.caseType)}
                className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Consultation</span>
              </button>
            </div>

            {/* Legal Notice */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Lock className="w-3 h-3 text-emerald-600" />
                Confidential Attorney-Client Communication Channel
              </span>
              <span className="text-slate-400 hidden sm:inline">Secure Chambers Relay</span>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 space-y-3.5 overflow-y-auto max-h-[380px] bg-slate-50/30">
              {activeThread.messages.map((msg) => {
                const isLawyer = msg.sender === 'lawyer';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isLawyer ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md rounded-2xl px-4 py-2.5 text-xs shadow-2xs leading-relaxed ${
                        isLawyer
                          ? 'bg-blue-900 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-mono">
                      <span>{msg.timestamp}</span>
                      {isLawyer && <CheckCheck className="w-3 h-3 text-blue-800" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Reply Suggestions */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">
                Quick Reply:
              </span>
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInputText(reply)}
                  className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-900 border border-slate-200 rounded-lg text-[11px] whitespace-nowrap transition shrink-0"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input Composer */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type confidential legal counsel response..."
                className="flex-1 px-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-slate-400 flex flex-col items-center justify-center">
            <MessageSquare className="w-12 h-12 mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">Select a client conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};
