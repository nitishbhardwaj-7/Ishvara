import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Award,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Share2,
  Lock,
  Play,
  RotateCcw,
  HeartHandshake,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SEED_DAILY_PRACTICES } from '../data/seedData';

export const JourneyScreen: React.FC = () => {
  const {
    user,
    activePractice,
    completeDailyPractice,
    dailyStreakCelebration,
    dismissStreakCelebration,
    setShareModalItem,
    setShowPaywall
  } = useApp();

  // Daily Practice Loop Sub-states: 'verse' | 'japa' | 'teaching' | 'reflection' | 'completed'
  const isAlreadyCompleted = user.completedPracticeDates.includes(activePractice.id);
  const [practiceStep, setPracticeStep] = useState<'verse' | 'japa' | 'teaching' | 'reflection' | 'completed'>(
    isAlreadyCompleted ? 'completed' : 'verse'
  );

  // Japa Mala counter state
  const [japaCount, setJapaCount] = useState(0);
  const targetJapa = activePractice.mantraTargetCount || 11;
  const [reflectionText, setReflectionText] = useState('');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleJapaTap = () => {
    if (japaCount < targetJapa) {
      const next = japaCount + 1;
      setJapaCount(next);

      // Trigger light web vibration if supported
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(30);
      }
    }
  };

  const handleFinishPractice = () => {
    completeDailyPractice(activePractice.id, reflectionText);
    setPracticeStep('completed');
  };

  const gitaChapters = [
    { num: 1, title: 'Arjuna Vishada Yoga', desc: 'The Dilemma of Compassion & Conflict', completed: true },
    { num: 2, title: 'Sankhya Yoga', desc: 'The Eternal Soul & Karma Yoga', completed: true, current: true },
    { num: 3, title: 'Karma Yoga', desc: 'The Path of Selfless Action', completed: false, locked: false },
    { num: 4, title: 'Jnana Karma Sanyasa', desc: 'Wisdom in Action & Renunciation', completed: false, locked: true },
    { num: 5, title: 'Karma Sanyasa Yoga', desc: 'The Science of True Renunciation', completed: false, locked: true },
    { num: 6, title: 'Dhyana Yoga', desc: 'Meditation, Mind Mastery & Stillness', completed: false, locked: true }
  ];

  return (
    <div id="journey-screen" className="flex-1 w-full h-full bg-[#090909] text-neutral-100 flex flex-col overflow-y-auto no-scrollbar pb-28">
      {/* Top Header */}
      <div className="p-4 pb-2 sticky top-0 bg-[#090909]/95 backdrop-blur-md z-20 border-b border-white/5 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-serif tracking-widest text-[#D6A85F]">Spiritual Progression</span>
          <h1 className="font-serif text-lg font-bold text-[#F2EDE4] tracking-wide">Daily Sadhana & Journey</h1>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold shadow-sm">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span>{user.streak} Days Active</span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Streak & Consistency Card (Duolingo style) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1c1810] via-[#12110e] to-[#0c0c0c] border border-[#D6A85F]/30 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-serif font-black text-white">{user.streak}</span>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#D6A85F]">Day Streak</span>
              </div>
              <p className="text-xs text-neutral-300 mt-1">
                {isAlreadyCompleted ? "You've completed your spiritual practice today!" : "Complete today's 5-minute Sadhana to maintain your flame."}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30">
              <Flame className="w-8 h-8 text-orange-400 fill-orange-400/80 animate-pulse" />
            </div>
          </div>

          {/* 7-Day Weekly Calendar Checkins */}
          <div className="mt-5 grid grid-cols-7 gap-1.5">
            {daysOfWeek.map(day => {
              const isDone = user.weeklyCheckins[day];
              return (
                <div
                  key={day}
                  className={`flex flex-col items-center p-2 rounded-xl border text-center transition ${
                    isDone
                      ? 'bg-gradient-to-b from-[#D6A85F]/20 to-orange-500/10 border-[#D6A85F]/50 text-white'
                      : 'bg-white/5 border-white/5 text-neutral-500'
                  }`}
                >
                  <span className="text-[10px] font-semibold uppercase">{day}</span>
                  <div className="mt-1.5 w-6 h-6 rounded-full flex items-center justify-center">
                    {isDone ? (
                      <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-neutral-700" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* XP & Level Progress */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D6A85F]" />
              <span className="font-semibold text-neutral-200">Level {user.level} Sadhaka</span>
            </div>
            <span className="text-neutral-400 font-mono">{user.xp} / {(user.level) * 150} XP</span>
          </div>

          <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D6A85F] to-amber-300 transition-all duration-500"
              style={{ width: `${(user.xp % 150) / 1.5}%` }}
            />
          </div>
        </div>

        {/* Interactive Today's Sadhana Card (Step-by-step loop) */}
        <div className="rounded-3xl bg-[#111111] border border-white/10 p-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D6A85F]" />
              <h2 className="font-serif text-sm font-bold text-[#F2EDE4]">Today's Sacred Practice</h2>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#D6A85F]/20 text-[#D6A85F]">
              5-7 Min
            </span>
          </div>

          {/* STEP 1: Verse of the Day */}
          {practiceStep === 'verse' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-serif font-bold text-[#D6A85F]">{activePractice.shlokaSource}</span>
                <span className="text-[10px] text-neutral-400">Step 1 of 4</span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 text-center space-y-2">
                <p className="font-serif text-base font-bold text-[#F4D99B] leading-relaxed">
                  {activePractice.shlokaSanskrit}
                </p>
                <p className="text-[11px] text-[#E8C280] italic">
                  {activePractice.shlokaTransliteration}
                </p>
                <p className="text-xs text-neutral-300 pt-1">
                  "{activePractice.shlokaTranslation}"
                </p>
              </div>

              <button
                id="btn-journey-next-japa"
                onClick={() => setPracticeStep('japa')}
                className="w-full py-3 rounded-2xl bg-[#D6A85F] text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition hover:bg-amber-300 cursor-pointer"
              >
                <span>Proceed to Japa Meditation</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Japa Mala Counter */}
          {practiceStep === 'japa' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-4 text-center">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-serif font-bold text-[#D6A85F]">{activePractice.mantraName}</span>
                <span className="text-[10px] text-neutral-400">Step 2 of 4</span>
              </div>

              <p className="font-serif text-lg font-bold text-[#F4D99B]">
                {activePractice.mantraSanskrit}
              </p>

              {/* Interactive Mala Bead Tap Area */}
              <div className="py-2 flex flex-col items-center justify-center">
                <button
                  id="btn-japa-tap"
                  onClick={handleJapaTap}
                  className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#251f12] via-[#17140e] to-[#2e2616] border-4 border-[#D6A85F] shadow-[0_0_30px_rgba(214,168,95,0.25)] flex flex-col items-center justify-center active:scale-95 transition cursor-pointer group"
                >
                  <span className="text-3xl font-serif font-black text-white group-hover:text-[#F4D99B]">
                    {japaCount}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D6A85F] mt-1">
                    of {targetJapa} Reps
                  </span>
                </button>
                <p className="text-[11px] text-neutral-400 mt-2">Tap circle on each chant for tactile feedback</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setJapaCount(0)}
                  className="p-3 rounded-xl bg-white/5 text-neutral-400 hover:text-white"
                  title="Reset Counter"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  id="btn-journey-next-teaching"
                  disabled={japaCount < targetJapa}
                  onClick={() => setPracticeStep('teaching')}
                  className={`flex-1 py-3 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 transition ${
                    japaCount >= targetJapa
                      ? 'bg-[#D6A85F] text-black shadow-lg hover:bg-amber-300 cursor-pointer'
                      : 'bg-white/10 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <span>{japaCount >= targetJapa ? 'Chants Complete • Next' : `Complete ${targetJapa - japaCount} more chants`}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Micro-Teaching Explanation */}
          {practiceStep === 'teaching' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-serif font-bold text-[#D6A85F]">{activePractice.teachingHeadline}</span>
                <span className="text-[10px] text-neutral-400">Step 3 of 4</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-neutral-200 leading-relaxed space-y-2">
                <p>{activePractice.teachingSummary}</p>
                <p className="text-neutral-400 text-[11px] italic">
                  "When the mind is freed from the burden of constant self-obsession and outcome anxiety, true spiritual power awakens."
                </p>
              </div>

              <button
                id="btn-journey-next-reflection"
                onClick={() => setPracticeStep('reflection')}
                className="w-full py-3 rounded-2xl bg-[#D6A85F] text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition hover:bg-amber-300 cursor-pointer"
              >
                <span>Write Today's Reflection</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 4: Personal Reflection Journal */}
          {practiceStep === 'reflection' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-serif font-bold text-[#D6A85F]">Self-Inquiry Journal</span>
                <span className="text-[10px] text-neutral-400">Step 4 of 4</span>
              </div>

              <p className="text-xs text-neutral-200 font-medium">
                {activePractice.reflectionQuestion}
              </p>

              <textarea
                id="journal-reflection-input"
                rows={3}
                value={reflectionText}
                onChange={e => setReflectionText(e.target.value)}
                placeholder="Write your honest observation for today (stored privately on your device)..."
                className="w-full p-3 rounded-xl bg-[#181818] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D6A85F]/60 transition"
              />

              <button
                id="btn-journey-complete-sadhana"
                onClick={handleFinishPractice}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D6A85F] to-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-xl hover:opacity-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Practice & Extend Streak</span>
              </button>
            </motion.div>
          )}

          {/* COMPLETED STATUS */}
          {practiceStep === 'completed' && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-bold text-emerald-300">Sadhana Complete Today</h3>
              <p className="text-xs text-neutral-300">
                You gained <strong>+50 XP</strong> and protected your sacred <strong>{user.streak}-day streak</strong>!
              </p>
              <button
                onClick={() => setShareModalItem({
                  shloka: {
                    id: activePractice.id,
                    source: activePractice.shlokaSource,
                    chapterVerse: 'Daily Wisdom',
                    deity: 'Universal',
                    sanskrit: activePractice.shlokaSanskrit,
                    transliteration: activePractice.shlokaTransliteration,
                    translation: activePractice.shlokaTranslation,
                    context: activePractice.theme,
                    practicalApplication: activePractice.teachingSummary,
                    tags: ['Sadhana']
                  }
                })}
                className="mt-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-neutral-200 inline-flex items-center gap-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5 text-[#D6A85F]" />
                <span>Share Daily Shloka</span>
              </button>
            </div>
          )}
        </div>

        {/* Bhagavad Gita Chapter Progression Roadmap */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-serif text-sm font-bold text-neutral-200 tracking-wide">Bhagavad Gita Wisdom Path</h2>
              <p className="text-[11px] text-neutral-400">18 Chapters of Universal Self-Mastery</p>
            </div>
            <span className="text-xs text-[#D6A85F] font-semibold">Chapter 2 of 18</span>
          </div>

          <div className="space-y-2.5">
            {gitaChapters.map(chap => (
              <div
                key={chap.num}
                id={`gita-chapter-${chap.num}`}
                onClick={() => {
                  if (chap.locked) {
                    setShowPaywall(true);
                  }
                }}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                  chap.current
                    ? 'bg-gradient-to-r from-amber-500/15 to-transparent border-[#D6A85F]/50 ring-1 ring-[#D6A85F]/40'
                    : chap.completed
                    ? 'bg-white/5 border-white/10 text-neutral-300'
                    : 'bg-black/30 border-white/5 text-neutral-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-serif text-xs font-bold ${
                    chap.completed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : chap.current ? 'bg-[#D6A85F] text-black shadow-md' : 'bg-white/5 text-neutral-500'
                  }`}>
                    {chap.completed ? '✓' : chap.num}
                  </div>

                  <div>
                    <h4 className={`text-xs font-bold ${chap.current ? 'text-[#D6A85F]' : 'text-white'}`}>
                      Chapter {chap.num}: {chap.title}
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{chap.desc}</p>
                  </div>
                </div>

                <div>
                  {chap.locked ? (
                    <Lock className="w-4 h-4 text-neutral-500" />
                  ) : chap.current ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D6A85F] text-black">
                      Active
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Streak Celebration Popup Modal (Duolingo style) */}
      <AnimatePresence>
        {dailyStreakCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <div className="w-full max-w-xs rounded-3xl bg-gradient-to-b from-[#1e1910] to-[#0a0a0a] border border-[#D6A85F]/40 p-6 text-center text-white shadow-2xl space-y-4">
              <div className="w-20 h-20 rounded-full bg-orange-500/20 border-2 border-orange-500/50 flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                <Flame className="w-12 h-12 text-orange-400 fill-orange-400" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-black text-white">{user.streak} Day Flame!</h3>
                <p className="text-xs text-[#E8C280] mt-1">
                  Consistency is the highest sadhana. Your spiritual momentum continues to build.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs flex justify-around font-mono">
                <div>
                  <span className="text-[10px] text-neutral-400 block">XP Gained</span>
                  <strong className="text-emerald-400">+50 XP</strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Total Streak</span>
                  <strong className="text-orange-400">{user.streak} Days</strong>
                </div>
              </div>

              <button
                id="btn-dismiss-streak"
                onClick={dismissStreakCelebration}
                className="w-full py-3 rounded-xl bg-[#D6A85F] text-black font-bold text-xs shadow-lg transition hover:bg-amber-300 cursor-pointer"
              >
                Continue My Sadhana
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
