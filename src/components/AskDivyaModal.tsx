import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Send, BookOpen, Bot, User, X, ChevronRight, Share2, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analytics } from '../services/analytics';
import { SEED_VIDEOS, SEED_AUDIO_TRACKS } from '../data/seedData';
import { devotionalAudioEngine } from '../services/audioEngine';

interface Message {
  id: string;
  sender: 'user' | 'divya';
  text: string;
  citation?: {
    source: string;
    chapterVerse: string;
    sanskrit?: string;
    translation: string;
  };
  modernTakeaway?: string;
  recommendedPractice?: string;
}

export const AskDivyaModal: React.FC = () => {
  const {
    showAskDivya,
    setShowAskDivya,
    user,
    setShareModalItem,
    setCurrentVideoIndex,
    setActiveTab
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'divya',
      text: `Namaste, ${user.name}. I am Divya, your scriptural companion grounded in the timeless wisdom of the Bhagavad Gita, Lord Shiva, and Lord Hanuman. What inquiry rests in your heart today?`,
      citation: {
        source: 'Bhagavad Gita',
        chapterVerse: '4.38',
        sanskrit: 'न हि ज्ञानेन सदृशं पवित्रमिह विद्यते',
        translation: 'In this world, there is nothing as purifying as transcendental knowledge.'
      },
      modernTakeaway: 'Approach your doubts with an open heart. Wisdom dispels anxiety like morning sunlight.'
    }
  ]);

  const quickQuestions = [
    'How do I overcome anxiety about career deadlines?',
    'What does Lord Shiva teach about letting go?',
    'How do I build Hanuman-like discipline & courage?',
    'What is the true essence of Karma Yoga in Gita?'
  ];

  const handleSend = async (queryText: string = inputQuery) => {
    const q = queryText.trim();
    if (!q || isLoading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: q
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    analytics.track('ai_question', { query: q, userLevel: user.level });

    try {
      const res = await fetch('/api/ai/ask-spiritual-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          userDeityAffinity: user.deityAffinities,
          userLevel: user.level,
          userName: user.name
        })
      });

      if (!res.ok) {
        throw new Error('Server error');
      }

      const data = await res.json();

      const aiMsg: Message = {
        id: `d_${Date.now()}`,
        sender: 'divya',
        text: data.answer || "Reflect deeply upon your duty, leaving all outcomes to the supreme divine.",
        citation: data.sacredCitation,
        modernTakeaway: data.modernTakeaway,
        recommendedPractice: data.recommendedPractice
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      // Fallback offline compassionate answer
      const fallbackMsg: Message = {
        id: `d_${Date.now()}`,
        sender: 'divya',
        text: "In the battlefield of everyday life, remember Lord Krishna's eternal counsel: Focus all your sacred energy on sincere effort, without binding your self-worth to temporary outcomes.",
        citation: {
          source: 'Bhagavad Gita',
          chapterVerse: '2.47',
          sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
          translation: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.'
        },
        modernTakeaway: 'Release the burden of outcome anxiety. Step into righteous action with devotion.'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showAskDivya) return null;

  return (
    <div
      id="ask-divya-modal-container"
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg h-[620px] max-h-[92vh] rounded-3xl bg-[#0f0e0c] border border-[#D6A85F]/40 shadow-2xl flex flex-col overflow-hidden text-neutral-100 relative"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-[#14120e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500/30 to-orange-500/30 border border-[#D6A85F] flex items-center justify-center text-[#D6A85F]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-sm font-bold text-[#F2EDE4] tracking-wide">Ask Divya</h3>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#D6A85F]/20 text-[#D6A85F] border border-[#D6A85F]/30">
                  Scripture Grounded AI
                </span>
              </div>
              <p className="text-[10px] text-neutral-400">Bhagavad Gita • Shiva Purana • Ramacharitmanas</p>
            </div>
          </div>

          <button
            id="btn-close-ask-divya"
            onClick={() => setShowAskDivya(false)}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#D6A85F] text-black font-medium rounded-tr-none shadow-md'
                    : 'bg-[#181612] text-neutral-200 border border-white/10 rounded-tl-none shadow-lg space-y-2'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Sacred Scripture Citation Card */}
                {msg.citation && (
                  <div className="p-3 rounded-xl bg-black/40 border border-[#D6A85F]/30 text-[11px] space-y-1 mt-2">
                    <div className="flex items-center justify-between text-[#D6A85F] font-serif font-bold">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {msg.citation.source} {msg.citation.chapterVerse}
                      </span>
                      <button
                        onClick={() => setShareModalItem({
                          shloka: {
                            id: `ai_${Date.now()}`,
                            source: msg.citation?.source || 'Sacred Text',
                            chapterVerse: msg.citation?.chapterVerse || '',
                            deity: 'Universal',
                            sanskrit: msg.citation?.sanskrit || '',
                            transliteration: '',
                            translation: msg.citation?.translation || '',
                            context: 'Spiritual Guide Guidance',
                            practicalApplication: msg.modernTakeaway || '',
                            tags: ['Gita Wisdom']
                          }
                        })}
                        className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1"
                      >
                        <Share2 className="w-3 h-3 text-[#D6A85F]" /> Share
                      </button>
                    </div>

                    {msg.citation.sanskrit && (
                      <p className="font-serif text-[#F4D99B] font-semibold text-xs pt-1">
                        {msg.citation.sanskrit}
                      </p>
                    )}
                    <p className="text-neutral-300 italic pt-0.5">
                      "{msg.citation.translation}"
                    </p>
                  </div>
                )}

                {/* Modern Practical Takeaway */}
                {msg.modernTakeaway && (
                  <div className="pt-1.5 border-t border-white/10 text-[11px] text-[#E8C280]">
                    <strong className="text-neutral-300 font-semibold">Practical Sadhana: </strong>
                    {msg.modernTakeaway}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#D6A85F] p-3 rounded-2xl bg-[#181612] border border-white/10 w-48">
              <Sparkles className="w-4 h-4 animate-spin text-[#D6A85F]" />
              <span className="animate-pulse">Consulting Scriptures...</span>
            </div>
          )}
        </div>

        {/* Recommended Prompts */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <span className="text-[10px] uppercase font-serif tracking-wider text-neutral-400 block mb-1.5">
              Suggested Inquiries
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-neutral-300 hover:text-white transition text-left cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-[#14120e] border-t border-white/10 flex items-center gap-2">
          <input
            id="ask-divya-input"
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask anything about Gita, Shiva, Hanuman, or life challenges..."
            className="flex-1 bg-[#1c1a14] border border-white/10 rounded-2xl py-2.5 px-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D6A85F]/60 transition"
          />

          <button
            id="btn-ask-divya-send"
            disabled={!inputQuery.trim() || isLoading}
            onClick={() => handleSend()}
            className={`p-2.5 rounded-xl font-bold transition cursor-pointer ${
              inputQuery.trim() && !isLoading
                ? 'bg-[#D6A85F] text-black shadow-lg hover:scale-105'
                : 'bg-white/10 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
