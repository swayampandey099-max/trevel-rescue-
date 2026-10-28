import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, X, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { RescueResearchResult, ChatMessage } from '../types';

interface InteractiveChatConciergeProps {
  isOpen: boolean;
  onClose: () => void;
  rescueContext: RescueResearchResult | null;
}

export const InteractiveChatConcierge: React.FC<InteractiveChatConciergeProps> = ({
  isOpen,
  onClose,
  rescueContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'c1',
      sender: 'bot',
      text: `Hello! I am your AI Travel Rescue Concierge. Ask me anything about your active rescue route (${
        rescueContext ? `${rescueContext.origin} ➔ ${rescueContext.destination}` : 'Travel Query'
      }), airline refund rights, connection buffers, or baggage policies.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userText = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      const res = await fetch('/api/rescue/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          rescueContext,
        }),
      });

      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Check platform boards 15 minutes prior to departure.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'Emergency tip: If your flight was cancelled by the airline, you are entitled to a full cash refund or immediate rebooking under federal travel regulation.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
        >
          {/* Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-americana font-bold text-sm text-slate-900">
                  AI Travel Rescue Concierge
                </h3>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Standby Assistance
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick FAQ Chips */}
          <div className="p-3 bg-blue-50/50 border-b border-blue-100 flex items-center gap-2 overflow-x-auto text-[11px] font-medium text-slate-600">
            <button
              onClick={() => { setInput('What if I miss my train connection?'); }}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-md hover:bg-blue-50 hover:text-blue-700 shrink-0 transition-colors"
            >
              Missed Connection?
            </button>
            <button
              onClick={() => { setInput('Am I entitled to an airline cash refund?'); }}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-md hover:bg-blue-50 hover:text-blue-700 shrink-0 transition-colors"
            >
              Airline Refund Rights
            </button>
            <button
              onClick={() => { setInput('How early should I arrive for Amtrak high speed rail?'); }}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-md hover:bg-blue-50 hover:text-blue-700 shrink-0 transition-colors"
            >
              Station Arrival Buffer
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/20">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-br-xs'
                      : 'bg-white border border-slate-200/80 text-slate-800 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[9px] block mt-1 ${msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl text-xs text-slate-500 flex items-center gap-1.5">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>AI reviewing route instructions...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a rescue or booking question..."
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-40 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
