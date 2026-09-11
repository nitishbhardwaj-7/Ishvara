import React, { useState } from 'react';
import { Download, Smartphone, Share, CheckCircle2, X, Archive } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-[#141311] border border-[#D6A85F]/30 p-6 shadow-2xl relative overflow-hidden text-center">
        {/* Ambient sacred glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D6A85F]/15 blur-3xl rounded-full pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#241c12] to-[#120f0a] border border-[#D6A85F]/40 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-3xl font-bold text-[#E5BE6C]">ॐ</span>
        </div>

        <h3 className="font-serif text-xl font-bold text-white tracking-wide">
          Install Ishvara Mobile App
        </h3>
        <p className="text-xs text-[#E8C280] font-serif uppercase tracking-widest mt-1 mb-5">
          Sacred Sadhana on your Home Screen
        </p>

        {isInstalled ? (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <span>App is installed & running in standalone mode!</span>
          </div>
        ) : isInstallable ? (
          <button
            onClick={async () => {
              const res = await install();
              if (res) onClose();
            }}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#D6A85F] to-[#E5BE6C] text-[#120F0A] font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#D6A85F]/20 hover:brightness-110 active:scale-95 transition"
          >
            <Download className="w-4 h-4" />
            <span>Install Now to Device</span>
          </button>
        ) : isIOS ? (
          <div className="text-left bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-neutral-300 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#D6A85F]/20 text-[#D6A85F] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
              <span>Tap the <strong className="text-white">Share</strong> button <Share className="w-3.5 h-3.5 inline mx-0.5 text-[#D6A85F]" /> in your Safari toolbar.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#D6A85F]/20 text-[#D6A85F] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
              <span>Scroll down and select <strong className="text-white">"Add to Home Screen"</strong>.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#D6A85F]/20 text-[#D6A85F] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
              <span>Tap <strong className="text-white">Add</strong> in top-right. Ishvara will launch as a standalone app!</span>
            </div>
          </div>
        ) : (
          <div className="text-left bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-neutral-300 space-y-2">
            <p className="flex items-center gap-2 text-[#D6A85F] font-semibold">
              <Smartphone className="w-4 h-4" />
              <span>Direct Mobile Experience:</span>
            </p>
            <p className="text-[11px] text-neutral-400">
              Open this URL on your mobile browser (Chrome or Safari) and select <strong>"Add to Home screen"</strong> or <strong>"Install App"</strong> from the browser menu.
            </p>
            <button
              onClick={handleCopyLink}
              className="mt-2 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition flex items-center justify-center gap-1.5"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share className="w-3.5 h-3.5 text-[#D6A85F]" />}
              <span>{copied ? 'Link Copied!' : 'Copy App Link'}</span>
            </button>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-white/10 space-y-3">
          <div className="flex justify-between text-[11px] text-neutral-400">
            <span>Native Standalone Mode</span>
            <span className="text-[#D6A85F]">Offline Capable</span>
          </div>

          <a
            href="/ishvara-app.zip"
            download="ishvara-app.zip"
            className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition"
          >
            <Archive className="w-4 h-4 text-[#D6A85F]" />
            <span>Download Project Source ZIP (5.6 MB)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
