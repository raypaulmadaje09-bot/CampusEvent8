import React from 'react';
import { X, MessageSquare, Clock, Send, ShieldCheck } from 'lucide-react';
import { FeedbackMessage } from '../types';
import { format, parseISO } from 'date-fns';
import { cn } from '../utils/cn';

interface StudentSupportProps {
  messages: FeedbackMessage[];
  onClose: () => void;
  onSendReply: (messageId: string, text: string) => void;
  userEmail: string;
}

const StudentSupport: React.FC<StudentSupportProps> = ({ messages, onClose, onSendReply, userEmail }) => {
  const [selectedMessageId, setSelectedMessageId] = React.useState<string | null>(
    messages.length > 0 ? messages[0].id : null
  );

  const studentMessages = messages.filter(m => m.senderEmail === userEmail);
  const activeMessage = studentMessages.find(m => m.id === selectedMessageId) || studentMessages[0];

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-50">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" /> Support Matrix
          </h2>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Administrative Channel</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {studentMessages.length > 0 ? (
          <>
            {/* Thread List (if multiple) */}
            {studentMessages.length > 1 && (
              <div className="p-4 bg-gray-50 flex gap-3 overflow-x-auto border-b border-gray-200">
                {studentMessages.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMessageId(m.id)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all border",
                      selectedMessageId === m.id 
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100" 
                        : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300"
                    )}
                  >
                    {m.subject}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeMessage && (
                <>
                  <div className="flex flex-col gap-1 max-w-[85%]">
                    <div className="p-4 bg-gray-100 rounded-2xl rounded-tl-none shadow-sm">
                      <p className="text-xs font-bold text-indigo-600 mb-1">RE: {activeMessage.subject}</p>
                      <p className="text-xs text-gray-700 leading-relaxed">{activeMessage.message}</p>
                    </div>
                    <span className="text-[8px] text-gray-400 font-bold uppercase ml-1 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> Sent {format(parseISO(activeMessage.timestamp), 'MMM d, p')}
                    </span>
                  </div>

                  {activeMessage.replies.map((reply, i) => (
                    <div key={i} className={cn(
                      "flex flex-col gap-1 max-w-[85%]",
                      reply.sender === 'Admin' ? "self-end" : "self-start"
                    )}>
                      <div className={cn(
                        "p-4 rounded-2xl text-xs shadow-sm",
                        reply.sender === 'Admin' 
                          ? "bg-indigo-600 text-white rounded-tr-none" 
                          : "bg-gray-100 text-gray-700 rounded-tl-none"
                      )}>
                        <div className="flex items-center gap-1 mb-1 text-[8px] font-black uppercase tracking-tighter opacity-80">
                          {reply.sender === 'Admin' ? <ShieldCheck className="w-2.5 h-2.5" /> : <MessageSquare className="w-2.5 h-2.5" />}
                          {reply.senderName}
                        </div>
                        {reply.text}
                      </div>
                      <span className={cn(
                        "text-[8px] text-gray-400 font-bold uppercase",
                        reply.sender === 'Admin' ? "text-right mr-1" : "ml-1"
                      )}>
                        {format(parseISO(reply.timestamp), 'p')}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Input */}
            {activeMessage && (
              <div className="p-6 border-t border-gray-100">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = (e.target as any).reply;
                    if (input.value) {
                      onSendReply(activeMessage.id, input.value);
                      input.value = '';
                    }
                  }}
                  className="relative"
                >
                  <input 
                    name="reply"
                    type="text" 
                    placeholder="Type your message..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-xs pr-16 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button 
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-indigo-200" />
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-2">No active transmissions</h3>
            <p className="text-sm text-gray-500">
              Your support requests and administrative messages will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSupport;
