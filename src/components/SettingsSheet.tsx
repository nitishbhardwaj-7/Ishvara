import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Shield, Star, RotateCcw, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRIVACY_POLICY_URL, SUPPORT_EMAIL } from '../lib/supabase';
import { PLAY_STORE_URL } from './ShareQuoteModal';

const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export const SettingsSheet: React.FC = () => {
  const { showSettings, setShowSettings, resetJourney } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);

  const close = () => {
    setShowSettings(false);
    setConfirmReset(false);
  };

  const rows = [
    PRIVACY_POLICY_URL && { icon: Shield, label: 'Privacy Policy', href: PRIVACY_POLICY_URL },
    SUPPORT_EMAIL && { icon: Mail, label: 'Contact & Feedback', href: `mailto:${SUPPORT_EMAIL}?subject=Ishvara%20feedback` },
    { icon: Star, label: 'Rate Ishvara', href: PLAY_STORE_URL },
  ].filter(Boolean) as { icon: typeof Shield; label: string; href: string }[];

  return (
    <AnimatePresence>
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="absolute inset-0 bg-black/70" />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="relative w-full max-w-[480px] bg-[#141414] border-t border-white/[0.1] rounded-t-2xl p-5 text-[#F5F1E8] safe-bottom"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg">Settings</h3>
              <button onClick={close} className="p-1 text-[#6F6F6F]" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 text-sm">
              {rows.map(row => (
                <a
                  key={row.label}
                  href={row.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-3 rounded-lg hover:bg-white/[0.05] flex items-center gap-3"
                >
                  <row.icon className="w-4 h-4 text-[#D2A653]" />
                  <span className="flex-1">{row.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#6F6F6F]" />
                </a>
              ))}

              <button
                onClick={() => {
                  if (confirmReset) {
                    resetJourney();
                    close();
                  } else setConfirmReset(true);
                }}
                className="w-full py-3 px-3 rounded-lg hover:bg-white/[0.05] flex items-center gap-3 text-left"
              >
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span className={`flex-1 ${confirmReset ? 'text-rose-400' : ''}`}>
                  {confirmReset ? 'Tap again to erase your streak' : 'Reset Journey progress'}
                </span>
              </button>
            </div>

            <p className="text-[11px] text-[#6F6F6F] text-center mt-5">
              Ishvara v{APP_VERSION} · No account needed. Your journey stays on this phone.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
