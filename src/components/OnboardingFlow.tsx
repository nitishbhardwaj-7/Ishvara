import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Deity } from '../types';
import { Sparkles, ChevronRight, Check, Flame, Heart, Bell, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OnboardingFlow: React.FC = () => {
  const { showOnboarding, completeOnboarding } = useApp();
  const [step, setStep] = useState(1);

  // User selections
  const [selectedDeity, setSelectedDeity] = useState<Deity>('Shiva');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Inner Stillness', 'Karma Yoga']);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Hinglish'>('English');
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  if (!showOnboarding) return null;

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleFinish = () => {
    completeOnboarding(selectedDeity, selectedGoals, selectedLanguage, selectedDuration);
  };

  return (
    <div
      id="onboarding-modal-container"
      className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6 select-none"
    >
      <div className="w-full max-w-md bg-[#0e0d0b] border border-[#D6A85F]/40 rounded-3xl p-6 text-neutral-100 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[520px]">
        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map(s => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-6 bg-[#D6A85F]' : s < step ? 'w-3 bg-[#D6A85F]/50' : 'w-2 bg-white/10'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-mono text-neutral-400">Step {step} of 5</span>
        </div>

        {/* STEP 1: Welcome & Ethos */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-6 space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#D6A85F] to-[#8C6D34] flex items-center justify-center mx-auto shadow-xl shadow-[#D6A85F]/20 text-black">
              <span className="font-serif text-3xl font-bold">ॐ</span>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-white tracking-wide">Welcome to Ishvara</h2>
              <p className="text-xs text-[#E8C280] font-serif uppercase tracking-widest mt-1">
                Timeless Wisdom • Modern Devotion
              </p>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-xs mx-auto">
              A sacred sanctuary of scripture-grounded Reels, lossless devotional chants, and daily Sadhana. No superstition, no dark patterns. Pure spiritual clarity.
            </p>
          </motion.div>
        )}

        {/* STEP 2: Primary Focus / Deity */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-4 space-y-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Which devotion resonates with you?</h3>
              <p className="text-xs text-neutral-400">We calibrate your personalized reels and wisdom feed.</p>
            </div>

            <div className="space-y-2 pt-2">
              {[
                { deity: 'Shiva' as Deity, label: 'Lord Shiva (Mahadev)', desc: 'Inner stillness, cosmic detachment, transcendence' },
                { deity: 'Hanuman' as Deity, label: 'Lord Hanuman', desc: 'Unshakable courage, discipline, selfless strength' },
                { deity: 'Krishna' as Deity, label: 'Bhagavad Gita / Krishna', desc: 'Duty without anxiety, Karma Yoga, clarity in crisis' },
                { deity: 'Universal' as Deity, label: 'Universal Sanatana Wisdom', desc: 'Balanced synthesis of all paths and holy scriptures' }
              ].map(item => (
                <div
                  key={item.deity}
                  onClick={() => setSelectedDeity(item.deity)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    selectedDeity === item.deity
                      ? 'bg-[#D6A85F]/20 border-[#D6A85F] text-white ring-1 ring-[#D6A85F]'
                      : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold">{item.label}</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</p>
                  </div>
                  {selectedDeity === item.deity && <Check className="w-4 h-4 text-[#D6A85F]" />}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 3: Goals / Intentions */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-4 space-y-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">What brings you here today?</h3>
              <p className="text-xs text-neutral-400">Select challenges you wish to navigate through scriptures.</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                'Inner Stillness',
                'Karma Yoga',
                'Courage & Strength',
                'Overcoming Fear',
                'Detachment & Peace',
                'Focus & Discipline',
                'Bhakti & Devotion',
                'Morning Sadhana'
              ].map(goal => {
                const isChecked = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                      isChecked
                        ? 'bg-[#D6A85F] text-black font-semibold border-[#D6A85F] shadow'
                        : 'bg-white/5 text-neutral-300 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 4: Language & Daily Goal */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-4 space-y-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Language & Commitment</h3>
              <p className="text-xs text-neutral-400">Set a sustainable pace for your spiritual evolution.</p>
            </div>

            <div>
              <label className="text-xs text-neutral-300 font-semibold block mb-2">Language Preference</label>
              <div className="grid grid-cols-3 gap-2">
                {(['English', 'Hindi', 'Hinglish'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      selectedLanguage === lang
                        ? 'bg-[#D6A85F] text-black'
                        : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-300 font-semibold block mb-2">Daily Sadhana Goal</label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map(min => (
                  <button
                    key={min}
                    onClick={() => setSelectedDuration(min)}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer flex flex-col items-center ${
                      selectedDuration === min
                        ? 'bg-[#D6A85F] text-black'
                        : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{min} Min / day</span>
                    <span className="text-[9px] opacity-80">{min === 5 ? 'Light' : min === 10 ? 'Balanced' : 'Deep'}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 5: Respectful Reminders & Start */}
        {step === 5 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mx-auto text-orange-400">
              <Bell className="w-7 h-7 animate-bounce" />
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-white">Daily Sadhana Prompt</h3>
              <p className="text-xs text-neutral-300 mt-1 max-w-xs mx-auto leading-relaxed">
                Consistency is the essence of yoga. We send one calm reminder at 6:00 AM to help you anchor your morning in peace.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs text-left">
              <span>Enable morning reminder</span>
              <input
                type="checkbox"
                checked={remindersEnabled}
                onChange={e => setRemindersEnabled(e.target.checked)}
                className="accent-[#D6A85F] w-4 h-4 cursor-pointer"
              />
            </div>
          </motion.div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white transition cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              id={`btn-onboarding-next-step-${step}`}
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-[#D6A85F] text-black font-semibold text-xs flex items-center gap-1.5 shadow hover:bg-amber-300 transition cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-onboarding-finish"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A85F] to-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-xl hover:opacity-95 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enter Ishvara Feed</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
