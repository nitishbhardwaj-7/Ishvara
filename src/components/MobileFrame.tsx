import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Crown, Smartphone, Monitor, ShieldCheck, Flame, Download, Archive } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const {
    deviceFrameMode,
    setDeviceFrameMode,
    user,
    setShowAskDivya,
    setShowPaywall,
    setShowAdmin,
    setShowInstallModal,
    setShowZipModal,
    setActiveTab
  } = useApp();

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="min-h-screen w-full bg-[#050505] text-neutral-100 flex flex-col items-center justify-center relative overflow-x-hidden selection:bg-[#D6A85F]/30 selection:text-[#E8C280]">
      {/* Top Global Control Bar for Previewers */}
      <header
        id="global-preview-header"
        className="w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between border-b border-white/5 bg-[#090909]/80 backdrop-blur-md z-30"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D6A85F] to-[#8C6D34] flex items-center justify-center shadow-lg shadow-[#D6A85F]/20">
            <span className="font-serif font-bold text-black text-base">ॐ</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-base font-bold tracking-wider text-[#F2EDE4]">ISHVARA</h1>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#D6A85F]/15 text-[#D6A85F] rounded border border-[#D6A85F]/30">
                PROD v2.4
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-sans hidden sm:block">
              Modern Spiritual Content Platform • Lord Shiva • Lord Hanuman • Bhagavad Gita
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ask Divya AI button */}
          <button
            id="btn-open-ask-divya-header"
            onClick={() => setShowAskDivya(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-[#D6A85F]/40 text-[#E8C280] text-xs font-semibold shadow-md transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D6A85F] animate-pulse" />
            <span>Ask Divya</span>
          </button>

          {/* Daily Streak Indicator button */}
          <button
            id="btn-header-streak"
            onClick={() => setActiveTab('journey')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold transition cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>{user.streak}d Streak</span>
          </button>

          {/* Premium Membership */}
          <button
            id="btn-header-premium"
            onClick={() => setShowPaywall(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              user.subscriptionStatus === 'premium'
                ? 'bg-[#D6A85F]/20 text-[#E8C280] border border-[#D6A85F]/40'
                : 'bg-white/10 hover:bg-white/20 text-neutral-200 border border-white/20'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-[#D6A85F]" />
            <span className="hidden sm:inline">{user.subscriptionStatus === 'premium' ? 'Sadhana Pro' : 'Go Deeper'}</span>
          </button>

          {/* Install App / Mobile App button */}
          <button
            id="btn-header-install-app"
            onClick={() => setShowInstallModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D6A85F]/20 hover:bg-[#D6A85F]/30 border border-[#D6A85F]/40 text-[#E8C280] text-xs font-semibold shadow-md transition cursor-pointer"
            title="Install Ishvara Mobile App"
          >
            <Download className="w-3.5 h-3.5 text-[#D6A85F]" />
            <span className="hidden sm:inline">Install App</span>
          </button>

          {/* Direct ZIP Download Button */}
          <button
            id="btn-header-download-zip"
            onClick={() => setShowZipModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-[#D6A85F]/50 text-[#E8C280] text-xs font-semibold shadow-md transition cursor-pointer"
            title="Download complete project source ZIP"
          >
            <Archive className="w-3.5 h-3.5 text-[#D6A85F]" />
            <span className="inline">Download ZIP</span>
          </button>

          {/* Admin Studio & Telemetry */}
          <button
            id="btn-header-admin"
            onClick={() => setShowAdmin(true)}
            title="Open Admin Studio & Telemetry"
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-neutral-200 transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Device Frame View Toggle */}
          <div className="hidden lg:flex items-center bg-black/60 p-0.5 rounded-lg border border-white/10">
            <button
              id="btn-frame-toggle-mobile"
              onClick={() => setDeviceFrameMode('mobile')}
              className={`p-1.5 rounded-md transition ${deviceFrameMode === 'mobile' ? 'bg-[#D6A85F] text-black shadow' : 'text-neutral-400 hover:text-white'}`}
              title="Mobile Device Simulator View (9:16)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-frame-toggle-responsive"
              onClick={() => setDeviceFrameMode('responsive')}
              className={`p-1.5 rounded-md transition ${deviceFrameMode === 'responsive' ? 'bg-[#D6A85F] text-black shadow' : 'text-neutral-400 hover:text-white'}`}
              title="Responsive Wide Canvas View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Presentation Stage */}
      <main className="flex-1 w-full flex items-center justify-center p-0 sm:p-4 md:p-6 relative">
        {deviceFrameMode === 'mobile' ? (
          /* iPhone 16 Pro Titanium Frame */
          <div
            id="mobile-phone-container"
            className="w-full max-w-[420px] h-[870px] max-h-[96vh] bg-[#090909] rounded-[48px] shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(214,168,95,0.12)] border-[8px] border-[#222222] relative flex flex-col overflow-hidden ring-1 ring-white/10"
          >
            {/* Top iOS Status Bar & Dynamic Island */}
            <div
              id="ios-status-bar"
              className="w-full pt-3 pb-1 px-7 flex items-center justify-between select-none z-50 bg-transparent text-white/90 text-[12px] font-semibold tracking-tight"
            >
              <span>{currentTime}</span>

              {/* Dynamic Island with Om ambient icon */}
              <div className="h-6 w-28 bg-black rounded-full flex items-center justify-center px-2 gap-1.5 shadow-inner border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#D6A85F] animate-pulse" />
                <span className="text-[10px] tracking-wider font-serif text-[#D6A85F]">ISHVARA</span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-[10px] font-mono">5G</span>
                {/* iOS Battery icon */}
                <div className="w-5 h-2.5 border border-white/60 rounded-sm p-0.5 flex items-center">
                  <div className="h-full w-3/4 bg-emerald-400 rounded-2xs" />
                </div>
              </div>
            </div>

            {/* Viewport for Mobile App */}
            <div className="flex-1 w-full relative flex flex-col overflow-hidden bg-[#090909]">
              {children}
            </div>

            {/* iOS Home Swipe Bar */}
            <div className="w-full h-4 bg-[#090909] flex items-center justify-center select-none z-50">
              <div className="w-32 h-1 bg-white/30 rounded-full" />
            </div>
          </div>
        ) : (
          /* Wide Screen Responsive Layout Container */
          <div
            id="responsive-canvas-container"
            className="w-full max-w-5xl h-[880px] max-h-[94vh] bg-[#090909] rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden relative"
          >
            <div className="flex-1 w-full relative flex flex-col overflow-hidden bg-[#090909]">
              {children}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
