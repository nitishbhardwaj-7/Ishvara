import React, { useEffect, useState } from 'react';
import { useApp, toLocalDateKey } from '../context/AppContext';
import { Flame, Sparkles, CheckCircle2, ChevronRight, Share2, RotateCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Step = 'verse' | 'japa' | 'teaching' | 'reflection' | 'completed';

const REFLECTIONS_KEY = 'ishvara_reflections_v1';

function saveReflection(dateKey: string, text: string) {
  if (!text.trim()) return;
  try {
    const all = JSON.parse(localStorage.getItem(REFLECTIONS_KEY) || '{}');
    all[dateKey] = text.trim();
    localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(all));
  } catch {
    // best-effort, stays on device only
  }
}

export const JourneyScreen: React.FC = () => {
  const {
    todaysPractice: practice,
    isPracticeDoneToday,
    completeTodaysPractice,
    streak,
    longestStreak,
    completedDates,
    streakCelebration,
    dismissStreakCelebration,
    setShareModalItem,
  } = useApp();

  const [step, setStep] = useState<Step>(isPracticeDoneToday ? 'completed' : 'verse');
  const [japaCount, setJapaCount] = useState(0);
  const [reflection, setReflection] = useState('');
  const target = practice.mantra.targetCount || 11;

  useEffect(() => {
    if (isPracticeDoneToday) setStep('completed');
  }, [isPracticeDoneToday]);

  // Last 7 days, oldest first, ending today
  const completedSet = new Set(completedDates);
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      key: toLocalDateKey(d),
      label: d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2),
      isToday: i === 6,
    };
  });

  const handleJapaTap = () => {
    if (japaCount >= target) return;
    setJapaCount(c => c + 1);
    if (navigator.vibrate) navigator.vibrate(25);
  };

  const finish = () => {
    saveReflection(toLocalDateKey(new Date()), reflection);
    completeTodaysPractice();
    setStep('completed');
  };

  const shareShloka = () =>
    setShareModalItem({
      shloka: {
        id: practice.id,
        source: practice.shloka.source,
        deity: 'Universal',
        sanskrit: practice.shloka.sanskrit,
        transliteration: practice.shloka.transliteration,
        translation: practice.shloka.translation,
        context: practice.theme,
        practicalApplication: practice.teaching.summary,
        tags: ['Sadhana'],
      },
    });

  return (
    <div className="flex-1 w-full h-full bg-[#090909] text-neutral-100 flex flex-col overflow-y-auto no-scrollbar pb-6">
      <div className="px-4 pt-4 pb-3 sticky top-0 bg-[#090909]/95 backdrop-blur-md z-20 border-b border-white/5 flex items-center justify-between safe-top">
        <div>
          <span className="text-[10px] uppercase font-serif tracking-widest text-[#D6A85F]">Daily Sadhana</span>
          <h1 className="font-serif text-lg font-bold text-[#F2EDE4]">Your Journey</h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span>{streak} {streak === 1 ? 'day' : 'days'}</span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Streak card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1c1810] via-[#12110e] to-[#0c0c0c] border border-[#D6A85F]/30">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-black text-white">{streak}</span>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#D6A85F]">Day Streak</span>
              </div>
              <p className="text-xs text-neutral-300 mt-1">
                {isPracticeDoneToday
                  ? 'Today’s practice is complete. See you tomorrow.'
                  : 'Complete today’s 5-minute practice to keep your flame alive.'}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">Longest streak: {longestStreak} days</p>
            </div>
            <Flame className="w-9 h-9 text-orange-400 fill-orange-400/80" />
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1.5">
            {week.map(day => {
              const done = completedSet.has(day.key);
              return (
                <div
                  key={day.key}
                  className={`flex flex-col items-center p-2 rounded-xl border ${
                    done
                      ? 'bg-gradient-to-b from-[#D6A85F]/20 to-orange-500/10 border-[#D6A85F]/50 text-white'
                      : day.isToday
                      ? 'bg-white/5 border-[#D6A85F]/30 text-neutral-300'
                      : 'bg-white/5 border-white/5 text-neutral-500'
                  }`}
                >
                  <span className="text-[10px] font-semibold uppercase">{day.label}</span>
                  <div className="mt-1.5 w-6 h-6 flex items-center justify-center">
                    {done ? <Flame className="w-4 h-4 text-orange-400 fill-orange-400" /> : <span className="w-2 h-2 rounded-full bg-neutral-700" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's practice */}
        <div className="rounded-3xl bg-[#111111] border border-white/10 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-4 h-4 text-[#D6A85F] flex-shrink-0" />
              <h2 className="font-serif text-sm font-bold text-[#F2EDE4] truncate">{practice.title}</h2>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#D6A85F]/20 text-[#D6A85F] flex-shrink-0">5 min</span>
          </div>

          {step === 'verse' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-serif font-bold text-[#D6A85F]">{practice.shloka.source}</span>
                <span className="text-[10px] text-neutral-400">Step 1 of 4</span>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 text-center space-y-2">
                <p className="font-serif text-base font-bold text-[#F4D99B] leading-relaxed">{practice.shloka.sanskrit}</p>
                <p className="text-[11px] text-[#E8C280] italic">{practice.shloka.transliteration}</p>
                <p className="text-xs text-neutral-300 pt-1">"{practice.shloka.translation}"</p>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">{practice.shloka.meaning}</p>
              <button
                onClick={() => setStep('japa')}
                className="w-full py-3 rounded-2xl bg-[#D6A85F] text-black font-semibold text-xs flex items-center justify-center gap-2"
              >
                Continue to Japa <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 'japa' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-4 text-center">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-serif font-bold text-[#D6A85F]">{practice.mantra.name}</span>
                <span className="text-[10px] text-neutral-400">Step 2 of 4</span>
              </div>
              <p className="font-serif text-lg font-bold text-[#F4D99B]">{practice.mantra.sanskrit}</p>
              <p className="text-[11px] text-neutral-400">{practice.mantra.meaning}</p>
              <div className="py-2 flex flex-col items-center">
                <button
                  onClick={handleJapaTap}
                  className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#251f12] via-[#17140e] to-[#2e2616] border-4 border-[#D6A85F] flex flex-col items-center justify-center active:scale-95 transition"
                >
                  <span className="text-3xl font-serif font-black text-white">{japaCount}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D6A85F] mt-1">of {target}</span>
                </button>
                <p className="text-[11px] text-neutral-400 mt-2">Tap once for each chant</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setJapaCount(0)} className="p-3 rounded-xl bg-white/5 text-neutral-400" aria-label="Reset counter">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  disabled={japaCount < target}
                  onClick={() => setStep('teaching')}
                  className={`flex-1 py-3 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 ${
                    japaCount >= target ? 'bg-[#D6A85F] text-black' : 'bg-white/10 text-neutral-500'
                  }`}
                >
                  {japaCount >= target ? 'Continue' : `${target - japaCount} more`}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'teaching' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-serif font-bold text-[#D6A85F]">Today’s Teaching</span>
                <span className="text-[10px] text-neutral-400">Step 3 of 4</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <p className="text-sm font-serif text-[#F2EDE4]">{practice.teaching.headline}</p>
                <p className="text-xs text-neutral-300 leading-relaxed">{practice.teaching.summary}</p>
              </div>
              <button
                onClick={() => setStep('reflection')}
                className="w-full py-3 rounded-2xl bg-[#D6A85F] text-black font-semibold text-xs flex items-center justify-center gap-2"
              >
                Reflect <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 'reflection' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-serif font-bold text-[#D6A85F]">Reflection</span>
                <span className="text-[10px] text-neutral-400">Step 4 of 4</span>
              </div>
              <p className="text-xs text-neutral-200 font-medium">{practice.reflection.question}</p>
              <textarea
                rows={3}
                value={reflection}
                onChange={e => setReflection(e.target.value)}
                placeholder={practice.reflection.placeholder || 'Optional — saved only on this phone'}
                className="w-full p-3 rounded-xl bg-[#181818] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D6A85F]/60"
              />
              <p className="text-[10px] text-neutral-500">Your reflection stays private on this device.</p>
              <button
                onClick={finish}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D6A85F] to-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Complete Today’s Practice
              </button>
            </motion.div>
          )}

          {step === 'completed' && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-bold text-emerald-300">Practice complete</h3>
              <p className="text-xs text-neutral-300">A new practice will be waiting for you tomorrow.</p>
              <button onClick={shareShloka} className="mt-2 px-3 py-1.5 rounded-xl bg-white/10 text-xs text-neutral-200 inline-flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-[#D6A85F]" /> Share today’s shloka
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {streakCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-full max-w-xs rounded-3xl bg-gradient-to-b from-[#1e1910] to-[#0a0a0a] border border-[#D6A85F]/40 p-6 text-center space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-orange-500/20 border-2 border-orange-500/50 flex items-center justify-center mx-auto">
                <Flame className="w-12 h-12 text-orange-400 fill-orange-400" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-black text-white">
                  {streak} {streak === 1 ? 'Day' : 'Days'}
                </h3>
                <p className="text-xs text-[#E8C280] mt-1">Consistency is the highest sadhana.</p>
              </div>
              <button onClick={dismissStreakCelebration} className="w-full py-3 rounded-xl bg-[#D6A85F] text-black font-bold text-xs">
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
