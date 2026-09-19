import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Send, BookOpen, X, Share2, Flag } from 'lucide-react';
import { motion } from 'motion/react';
import { askDivya, DivyaAnswer } from '../services/content';
import { SUPPORT_EMAIL } from '../lib/supabase';

interface Message {
  id: string;
  sender: 'user' | 'divya';
  text: string;
  citation?: DivyaAnswer['citation'];
  takeaway?: string;
  isError?: boolean;
  question?: string;
}

const WELCOME: Message = {
  id: 'welcome',
  sender: 'divya',
  text: 'Namaste. I am Divya, a guide drawing on the Bhagavad Gita and the traditions of Lord Shiva and Lord Hanuman. What is on your mind today?',
};

const QUICK_QUESTIONS = [
  'How do I stop worrying about results?',
  'What does Shiva teach about letting go?',
  'How can I build courage like Hanuman?',
  'What is Karma Yoga?',
];

export const AskDivyaModal: React.FC = () => {
  const { showAskDivya, setShowAskDivya, setShareModalItem } = useApp();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const send = async (text: string = input) => {
    const question = text.trim();
    if (!question || isLoading) return;
    setMessages(prev => [...prev, { id: `u_${Date.now()}`, sender: 'user', text: question }]);
    setInput('');
    setIsLoading(true);
    try {
      const res = await askDivya(question);
      setMessages(prev => [
        ...prev,
        { id: `d_${Date.now()}`, sender: 'divya', text: res.answer, citation: res.citation, takeaway: res.takeaway, question },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `e_${Date.now()}`,
          sender: 'divya',
          isError: true,
          text: err instanceof Error && err.message ? err.message : 'I could not answer right now. Please check your connection and try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const reportLink = (msg: Message) =>
    `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Ishvara: report AI response')}&body=${encodeURIComponent(
      `Question: ${msg.question ?? ''}\n\nResponse: ${msg.text}\n\nWhat was wrong:`,
    )}`;

  if (!showAskDivya) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-end sm:items-center justify-center sm:p-6 select-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg h-full sm:h-[640px] sm:max-h-[92vh] sm:rounded-3xl bg-[#0f0e0c] sm:border border-[#D6A85F]/40 flex flex-col overflow-hidden text-neutral-100 safe-top safe-bottom"
      >
        <div className="p-4 border-b border-white/10 bg-[#14120e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500/30 to-orange-500/30 border border-[#D6A85F] flex items-center justify-center text-[#D6A85F]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#F2EDE4]">Ask Divya</h3>
              <p className="text-[10px] text-neutral-400">AI guide · may make mistakes</p>
            </div>
          </div>
          <button onClick={() => setShowAskDivya(false)} className="p-1.5 rounded-full bg-white/5 text-neutral-400" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar select-text">
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#D6A85F] text-black font-medium rounded-tr-none'
                    : msg.isError
                    ? 'bg-rose-500/10 text-rose-200 border border-rose-500/30 rounded-tl-none'
                    : 'bg-[#181612] text-neutral-200 border border-white/10 rounded-tl-none space-y-2'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.citation && (
                  <div className="p-3 rounded-xl bg-black/40 border border-[#D6A85F]/30 text-[11px] space-y-1 mt-2">
                    <div className="flex items-center justify-between text-[#D6A85F] font-serif font-bold gap-2">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                        {msg.citation.source}
                      </span>
                      <button
                        onClick={() =>
                          setShareModalItem({
                            shloka: {
                              id: msg.id,
                              source: msg.citation!.source,
                              deity: 'Universal',
                              sanskrit: msg.citation!.sanskrit ?? '',
                              transliteration: '',
                              translation: msg.citation!.translation,
                              context: '',
                              practicalApplication: msg.takeaway ?? '',
                              tags: [],
                            },
                          })
                        }
                        className="text-[10px] text-neutral-400 flex items-center gap-1"
                      >
                        <Share2 className="w-3 h-3 text-[#D6A85F]" /> Share
                      </button>
                    </div>
                    {msg.citation.sanskrit && <p className="font-serif text-[#F4D99B] font-semibold text-xs pt-1">{msg.citation.sanskrit}</p>}
                    <p className="text-neutral-300 italic pt-0.5">"{msg.citation.translation}"</p>
                  </div>
                )}

                {msg.takeaway && (
                  <div className="pt-1.5 border-t border-white/10 text-[11px] text-[#E8C280]">
                    <strong className="text-neutral-300 font-semibold">Practice: </strong>
                    {msg.takeaway}
                  </div>
                )}
              </div>
              {msg.question && SUPPORT_EMAIL && (
                <a href={reportLink(msg)} className="mt-1 ml-1 text-[10px] text-neutral-500 flex items-center gap-1">
                  <Flag className="w-3 h-3" /> Report response
                </a>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#D6A85F] p-3 rounded-2xl bg-[#181612] border border-white/10 w-44">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span className="animate-pulse">Reflecting…</span>
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {QUICK_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => send(q)}
                className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-300 text-left"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div className="p-3 bg-[#14120e] border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={input}
            maxLength={500}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask about the Gita, Shiva, Hanuman, or life…"
            className="flex-1 bg-[#1c1a14] border border-white/10 rounded-2xl py-2.5 px-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D6A85F]/60"
          />
          <button
            disabled={!input.trim() || isLoading}
            onClick={() => send()}
            className="p-2.5 rounded-xl bg-[#D6A85F] text-black disabled:bg-white/10 disabled:text-neutral-500"
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
