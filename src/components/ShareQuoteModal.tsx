import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Share2, Download, Copy, Check, X, Sparkles, Instagram } from 'lucide-react';
import { motion } from 'motion/react';
import { analytics } from '../services/analytics';

export const ShareQuoteModal: React.FC = () => {
  const { shareModalItem, setShareModalItem } = useApp();
  const [copied, setCopied] = useState(false);

  if (!shareModalItem) return null;

  const { video, shloka } = shareModalItem;

  const quoteSanskrit = video?.quoteSanskrit || shloka?.sanskrit || 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन';
  const quoteTranslation = video?.quoteTranslation || shloka?.translation || 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.';
  const source = video?.sourceContext || `${shloka?.source} ${shloka?.chapterVerse}` || 'Bhagavad Gita 2.47';

  const handleCopyText = () => {
    const text = `"${quoteSanskrit}"\n\n"${quoteTranslation}"\n\n— ${source}\nShared via Ishvara: Modern Spiritual Wisdom`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      analytics.track('quote_copied', { source });
    }
  };

  return (
    <div
      id="share-quote-modal-container"
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm rounded-3xl bg-[#0e0d0b] border border-[#D6A85F]/40 p-5 text-neutral-100 shadow-2xl relative flex flex-col items-center"
      >
        {/* Close Button */}
        <button
          onClick={() => setShareModalItem(null)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <span className="text-[10px] font-serif uppercase tracking-widest text-[#D6A85F] font-bold mb-1">
          Shareable Story Card (9:16)
        </span>
        <h3 className="font-serif text-sm font-bold text-white mb-4">Sacred Quote Generator</h3>

        {/* 9:16 Instagram Story Preview Card */}
        <div
          id="quote-story-card"
          className="w-64 aspect-[9/16] rounded-2xl bg-gradient-to-b from-[#1c1710] via-[#0d0c0a] to-[#14120e] border-2 border-[#D6A85F]/40 p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden text-center"
        >
          {/* Subtle Om watermark in background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <span className="font-serif text-9xl font-bold">ॐ</span>
          </div>

          {/* Top Branding */}
          <div className="relative z-10 flex items-center justify-center gap-1.5 pt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6A85F]" />
            <span className="font-serif text-[11px] tracking-widest text-[#D6A85F] font-bold">ISHVARA</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6A85F]" />
          </div>

          {/* Quote Center Body */}
          <div className="relative z-10 space-y-3 my-auto">
            <p className="font-serif text-sm font-bold text-[#F4D99B] leading-relaxed">
              {quoteSanskrit}
            </p>
            <div className="w-8 h-0.5 bg-[#D6A85F]/40 mx-auto" />
            <p className="text-[11px] text-neutral-200 italic leading-relaxed">
              "{quoteTranslation}"
            </p>
            <span className="text-[10px] font-serif text-[#D6A85F] uppercase tracking-wider block font-bold pt-1">
              — {source}
            </span>
          </div>

          {/* Bottom Watermark */}
          <div className="relative z-10 text-[9px] text-neutral-400 font-sans pb-1">
            ishvara.app • Modern Devotional Sanctuary
          </div>
        </div>

        {/* Sharing Actions */}
        <div className="mt-5 w-full space-y-2">
          <button
            id="btn-copy-quote"
            onClick={handleCopyText}
            className="w-full py-2.5 rounded-xl bg-[#D6A85F] text-black font-semibold text-xs flex items-center justify-center gap-2 shadow hover:bg-amber-300 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Quote Text & Citation'}</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: source,
                  text: `"${quoteSanskrit}" — ${quoteTranslation}`,
                  url: window.location.href
                }).catch(() => {});
              } else {
                handleCopyText();
              }
            }}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/10 transition cursor-pointer"
          >
            <Instagram className="w-4 h-4 text-pink-400" />
            <span>Share to Instagram / WhatsApp</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
