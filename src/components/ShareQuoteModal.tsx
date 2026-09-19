import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Share2, Copy, Check, X } from 'lucide-react';
import { motion } from 'motion/react';

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.ishvara.sadhana';

export const ShareQuoteModal: React.FC = () => {
  const { shareModalItem, setShareModalItem } = useApp();
  const [copied, setCopied] = useState(false);

  if (!shareModalItem) return null;
  const { video, shloka } = shareModalItem;

  const heading = video?.quoteSanskrit || shloka?.sanskrit || video?.title || '';
  const body = video?.quoteTranslation || shloka?.translation || video?.description || '';
  const source = video?.sourceContext || [shloka?.source, shloka?.chapterVerse].filter(Boolean).join(' ');

  const shareText = [heading, body && `"${body}"`, source && `— ${source}`, `\nFrom the Ishvara app: ${PLAY_STORE_URL}`]
    .filter(Boolean)
    .join('\n\n');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — nothing else to do
    }
  };

  const share = () => {
    if (navigator.share) navigator.share({ title: source || 'Ishvara', text: shareText }).catch(() => {});
    else copy();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm rounded-3xl bg-[#0e0d0b] border border-[#D6A85F]/40 p-5 text-neutral-100 relative flex flex-col items-center"
      >
        <button onClick={() => setShareModalItem(null)} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-neutral-400" aria-label="Close">
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-serif text-sm font-bold text-white mb-4">Share</h3>

        <div className="w-64 aspect-[9/16] rounded-2xl bg-gradient-to-b from-[#1c1710] via-[#0d0c0a] to-[#14120e] border-2 border-[#D6A85F]/40 p-5 flex flex-col justify-between relative overflow-hidden text-center">
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <span className="font-serif text-9xl font-bold">ॐ</span>
          </div>
          <div className="relative z-10 flex items-center justify-center gap-1.5 pt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6A85F]" />
            <span className="font-serif text-[11px] tracking-widest text-[#D6A85F] font-bold">ISHVARA</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6A85F]" />
          </div>
          <div className="relative z-10 space-y-3 my-auto">
            {heading && <p className="font-serif text-sm font-bold text-[#F4D99B] leading-relaxed whitespace-pre-line">{heading}</p>}
            <div className="w-8 h-0.5 bg-[#D6A85F]/40 mx-auto" />
            {body && <p className="text-[11px] text-neutral-200 italic leading-relaxed">"{body}"</p>}
            {source && <span className="text-[10px] font-serif text-[#D6A85F] uppercase tracking-wider block font-bold pt-1">— {source}</span>}
          </div>
          <div className="relative z-10 text-[9px] text-neutral-400 pb-1">Ishvara · Daily Devotion</div>
        </div>

        <div className="mt-5 w-full space-y-2">
          <button onClick={share} className="w-full py-2.5 rounded-xl bg-[#D6A85F] text-black font-semibold text-xs flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" /> Share to WhatsApp, Instagram…
          </button>
          <button onClick={copy} className="w-full py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/10">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy text'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
