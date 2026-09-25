import React, { useState } from 'react';
import {
  MessageSquareLock,
  Lock,
  KeyRound,
  Send,
  Paperclip,
  CheckCheck,
  ShieldCheck,
  User,
  Sparkles,
  Search,
  FileText,
  UserPlus,
  Scale,
  Calendar,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { MessageThread, EncryptedMessage, CaseFile, UserRole, CaseDeadline } from '../types';
import { ThreadAISummaryModal } from './ThreadAISummaryModal';

interface EncryptedChatViewProps {
  threads: MessageThread[];
  messages: EncryptedMessage[];
  cases: CaseFile[];
  userRole: UserRole;
  onSendMessage: (msg: EncryptedMessage) => void;
  onOpenSendRequest?: () => void;
  onAddDeadline?: (deadline: CaseDeadline) => void;
}

export const EncryptedChatView: React.FC<EncryptedChatViewProps> = ({
  threads,
  messages,
  cases,
  userRole,
  onSendMessage,
  onOpenSendRequest,
  onAddDeadline
}) => {
  const [selectedThread, setSelectedThread] = useState<MessageThread>(threads[0] || null);
  const [inputText, setInputText] = useState('');
  const [showRawEncrypted, setShowRawEncrypted] = useState(false);
  const [isAiSummaryOpen, setIsAiSummaryOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [dismissedBannerThreads, setDismissedBannerThreads] = useState<Record<string, boolean>>({});

  const filteredThreads = threads.filter(
    (th) =>
      th.participantName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (th.caseTitle && th.caseTitle.toLowerCase().includes(searchFilter.toLowerCase())) ||
      th.lastMessage.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const currentThreadMessages = messages.filter((m) => m.threadId === selectedThread?.id);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedThread) return;

    // Simulate AES-256 base64 cipher payload
    const simBase64 = btoa(inputText);

    const newMsg: EncryptedMessage = {
      id: `m-${Date.now()}`,
      threadId: selectedThread.id,
      caseId: selectedThread.caseId,
      senderId: 'u-current',
      senderName: userRole === 'client' ? 'Client Representative' : 'Sophia Chen, Esq.',
      senderRole: userRole === 'client' ? 'client' : 'associate',
      recipientId: 'client-1',
      recipientName: selectedThread.participantName,
      encryptedContent: simBase64,
      decryptedContent: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: true,
      keyFingerprint: selectedThread.keyFingerprint
    };

    onSendMessage(newMsg);
    setInputText('');
  };

  const handleOpenSummaryForThread = (th: MessageThread, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedThread(th);
    setIsAiSummaryOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">Encrypted Communication Portal</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              AES-256 E2EE
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              AI Thread Reviewer Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Zero-knowledge client messaging with cryptographic key fingerprint verification, AI thread synthesis, and privilege auditing.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* AI Thread Brief Trigger */}
          {selectedThread && (
            <button
              onClick={() => setIsAiSummaryOpen(true)}
              className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Generate AI Legal Summary of this thread"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span>AI Thread Brief ({currentThreadMessages.length} msgs)</span>
            </button>
          )}

          {onOpenSendRequest && (
            <button
              onClick={onOpenSendRequest}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Send Request to Lawyer</span>
            </button>
          )}

          <button
            onClick={() => setShowRawEncrypted(!showRawEncrypted)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold border transition flex items-center gap-1.5 ${
              showRawEncrypted
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm'
            }`}
          >
            <KeyRound className="w-4 h-4 text-amber-600" />
            <span>{showRawEncrypted ? 'Viewing Ciphertext' : 'Inspect Cipher Payload'}</span>
          </button>
        </div>
      </div>

      {/* Main Messaging Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[520px]">
        {/* Left Column: Threads list */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Encrypted Messaging Threads ({filteredThreads.length})
              </p>
              <span className="text-[10px] text-slate-400 font-mono">E2EE Verified</span>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search matter or client..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-0.5">
              {filteredThreads.map((th) => {
                const threadMsgCount = messages.filter((m) => m.threadId === th.id).length;
                const isSelected = selectedThread?.id === th.id;
                return (
                  <div
                    key={th.id}
                    onClick={() => setSelectedThread(th)}
                    className={`p-3 rounded-md border cursor-pointer transition relative group ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-bold text-xs text-slate-900 truncate">{th.participantName}</span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{th.lastMessageTime}</span>
                    </div>

                    <p className="text-[11px] text-blue-700 font-semibold truncate">{th.caseTitle}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{th.lastMessage}</p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2 pt-1.5 border-t border-slate-200">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> {th.keyFingerprint.slice(0, 11)}...
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleOpenSummaryForThread(th, e)}
                          className="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[9px] font-sans font-bold flex items-center gap-1 transition"
                          title="Generate AI Summary for this thread"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
                          <span>AI Brief</span>
                        </button>

                        {th.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                            {th.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" /> Zero-Knowledge Guarantee
            </span>
            <p>End-to-end RSA-4096 / AES-256 encryption. AI analysis operates strictly on client-decrypted stream.</p>
          </div>
        </div>

        {/* Right Column: Chat Conversation Thread */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col justify-between overflow-hidden">
          {selectedThread ? (
            <>
              {/* Thread Header */}
              <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{selectedThread.participantName}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-semibold">
                      Verified Client
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                      {currentThreadMessages.length} Messages
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Matter: {selectedThread.caseTitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAiSummaryOpen(true)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    title="Generate Comprehensive AI Legal Summary"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Counsel Brief</span>
                  </button>

                  <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-xs">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-slate-900 font-bold">{selectedThread.keyFingerprint}</span>
                  </div>
                </div>
              </div>

              {/* AI Suggestion / Quick Brief Banner (Dismissible) */}
              {!dismissedBannerThreads[selectedThread.id] && currentThreadMessages.length >= 2 && (
                <div className="px-4 py-2.5 bg-gradient-to-r from-indigo-50/90 via-blue-50/70 to-indigo-50/90 border-b border-indigo-100 flex items-center justify-between gap-3 text-xs shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-indigo-600/10 border border-indigo-300 flex items-center justify-center text-indigo-600 shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        AI Thread Synthesis Ready ({currentThreadMessages.length} messages)
                      </p>
                      <p className="text-[11px] text-slate-600">
                        Synthesize key legal claims, action items, and court deadlines for rapid review.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setIsAiSummaryOpen(true)}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Review Brief</span>
                    </button>
                    <button
                      onClick={() =>
                        setDismissedBannerThreads((prev) => ({ ...prev, [selectedThread.id]: true }))
                      }
                      className="text-slate-400 hover:text-slate-600 text-[11px] px-1.5 py-1"
                      title="Dismiss notification"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Message List */}
              <div className="p-4 flex-1 overflow-y-auto space-y-4 max-h-[380px]">
                {currentThreadMessages.map((msg) => {
                  const isMe = msg.senderRole !== 'client';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                        <span className="font-semibold text-slate-700">{msg.senderName}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-3 rounded-xl max-w-md text-xs leading-relaxed shadow-sm ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                            : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none'
                        }`}
                      >
                        {showRawEncrypted ? (
                          <div className="font-mono text-[11px] text-amber-800 break-all bg-amber-50 p-2 rounded-md border border-amber-200">
                            🔒 Encrypted Cipher Payload: {msg.encryptedContent}
                          </div>
                        ) : (
                          <p>{msg.decryptedContent}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                        <Lock className="w-2.5 h-2.5 text-emerald-600" />
                        <span>E2EE Authenticated</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-blue-600" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  title="Attach Confidential Document"
                  className="p-2 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Write encrypted message to client..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md flex items-center gap-1.5 shadow-sm transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Encrypted</span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <MessageSquareLock className="w-12 h-12 mx-auto mb-2 text-slate-300 opacity-50" />
              <p className="text-sm">Select an encrypted thread to begin communication.</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Summary Review Modal */}
      {selectedThread && (
        <ThreadAISummaryModal
          isOpen={isAiSummaryOpen}
          onClose={() => setIsAiSummaryOpen(false)}
          thread={selectedThread}
          messages={messages}
          onAddDeadline={onAddDeadline}
        />
      )}
    </div>
  );
};

