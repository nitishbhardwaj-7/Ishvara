import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Crown, Check, X, Shield, Sparkles, Download, BookOpen, Heart, Music } from 'lucide-react';
import { motion } from 'motion/react';
import { SUBSCRIPTION_PACKAGES, revenueCat } from '../services/revenueCat';
import { analytics } from '../services/analytics';

export const PaywallModal: React.FC = () => {
  const { showPaywall, setShowPaywall, upgradeSubscription } = useApp();
  const [selectedPackage, setSelectedPackage] = useState<'ishvara_monthly' | 'ishvara_yearly'>('ishvara_yearly');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!showPaywall) return null;

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      const res = await revenueCat.purchasePackage(selectedPackage);
      if (res.success) {
        upgradeSubscription(selectedPackage === 'ishvara_yearly' ? 'yearly' : 'monthly');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      id="paywall-modal-container"
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-[#0f0e0c] border border-[#D6A85F]/50 rounded-3xl p-6 text-neutral-100 shadow-2xl relative overflow-hidden my-auto"
      >
        {/* Subtle background warm ambient glow */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-[#D6A85F]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="btn-close-paywall"
          onClick={() => setShowPaywall(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header */}
        <div className="text-center pt-2 pb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#D6A85F] to-[#8C6D34] flex items-center justify-center mx-auto shadow-lg shadow-[#D6A85F]/20 text-black mb-3">
            <Crown className="w-7 h-7" />
          </div>

          <span className="text-[10px] font-serif uppercase tracking-widest text-[#D6A85F] font-bold">
            Sadhana Pro Membership
          </span>
          <h2 className="font-serif text-xl font-bold text-white mt-1">
            Deepen Your Spiritual Practice
          </h2>
          <p className="text-xs text-neutral-300 mt-1 max-w-xs mx-auto leading-relaxed">
            Support authentic scripture preservation. Unlock complete Bhagavad Gita wisdom paths, lossless audio downloads, and enlightened AI mentoring.
          </p>
        </div>

        {/* Feature List */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2.5 my-3 text-xs">
          {[
            'Full 18-Chapter Bhagavad Gita course with Sanskrit recitation',
            'Offline high-fidelity devotional chants & mantras',
            'Ask Divya: Unlimited scripture-grounded AI counsel',
            'Exclusive Mahadev & Hanuman deep-dive meditation series',
            '100% Ad-Free, non-manipulative sanctuary'
          ].map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#D6A85F]/20 text-[#D6A85F] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-neutral-200">{feat}</span>
            </div>
          ))}
        </div>

        {/* Pricing Options */}
        <div className="space-y-2.5 my-4">
          {SUBSCRIPTION_PACKAGES.map(pkg => {
            const isSelected = selectedPackage === pkg.identifier;
            return (
              <div
                key={pkg.id}
                id={`plan-card-${pkg.identifier}`}
                onClick={() => setSelectedPackage(pkg.identifier)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between relative ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/15 via-[#D6A85F]/10 to-transparent border-[#D6A85F] shadow-lg ring-1 ring-[#D6A85F]/40'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{pkg.title}</h4>
                    {pkg.savingsBadge && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#D6A85F] text-black">
                        {pkg.savingsBadge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{pkg.description}</p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-white block">{pkg.priceString}</span>
                  <span className="text-[10px] text-[#D6A85F]">Cancel anytime</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          id="btn-confirm-subscription"
          disabled={isProcessing}
          onClick={handlePurchase}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D6A85F] to-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-xl hover:opacity-95 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isProcessing ? 'Confirming Sacred Pass...' : 'Begin Sadhana Pass'}</span>
        </button>

        {/* Ethical Guarantee */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-neutral-400">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ethical Guarantee: No dark patterns. Cancel in 1 tap anytime.</span>
        </div>
      </motion.div>
    </div>
  );
};
