import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Crown,
  Flame,
  Award,
  Bookmark,
  Music,
  Bell,
  Globe,
  Settings,
  Shield,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Lock,
  Heart,
  BookOpen,
  Smartphone,
  Download,
  Archive
} from 'lucide-react';
import { SEED_VIDEOS, SEED_AUDIO_TRACKS } from '../data/seedData';
import { devotionalAudioEngine } from '../services/audioEngine';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    preferences,
    updatePreferences,
    setShowPaywall,
    setShowAskDivya,
    resetOnboarding,
    setShowAdmin,
    setShowInstallModal,
    setShowZipModal,
    setCurrentVideoIndex,
    setActiveTab
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'saved' | 'audio' | 'settings'>('saved');

  // Saved items
  const savedVideos = SEED_VIDEOS.filter(v => user.savedVideoIds.includes(v.id));
  const savedAudio = SEED_AUDIO_TRACKS.filter(a => user.savedAudioIds.includes(a.id));

  return (
    <div id="profile-screen" className="flex-1 w-full h-full bg-[#090909] text-neutral-100 flex flex-col overflow-y-auto no-scrollbar pb-28">
      {/* Top Header */}
      <div className="p-4 pb-2 sticky top-0 bg-[#090909]/95 backdrop-blur-md z-20 border-b border-white/5 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-serif tracking-widest text-[#D6A85F]">Seeker Profile</span>
          <h1 className="font-serif text-lg font-bold text-[#F2EDE4] tracking-wide">Personal Sadhana</h1>
        </div>

        <button
          onClick={() => setShowAdmin(true)}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
          title="Admin Settings & Analytics"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* User Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1c1810] via-[#12110e] to-[#0d0d0d] border border-[#D6A85F]/30 shadow-2xl relative">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#D6A85F] shadow-lg"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base font-bold text-white">{user.name}</h2>
                {user.subscriptionStatus === 'premium' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D6A85F] text-black">
                    PRO
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-neutral-300">
                    Free Seeker
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">{user.email}</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 text-orange-400 font-semibold">
                  <Flame className="w-3.5 h-3.5 fill-current" /> {user.streak} Days
                </span>
                <span className="flex items-center gap-1 text-[#D6A85F] font-semibold">
                  <Award className="w-3.5 h-3.5" /> Level {user.level} ({user.xp} XP)
                </span>
              </div>
            </div>
          </div>

          {/* Premium Membership Banner */}
          {user.subscriptionStatus !== 'premium' ? (
            <div
              onClick={() => setShowPaywall(true)}
              className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border border-[#D6A85F]/50 flex items-center justify-between cursor-pointer hover:border-[#D6A85F] transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#D6A85F] text-black flex items-center justify-center font-bold">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Unlock Sadhana Pro</h4>
                  <p className="text-[11px] text-[#E8C280]">Offline audio, full Gita path & unlimited AI</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#D6A85F]" />
            </div>
          ) : (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
              <span className="flex items-center gap-1.5 font-semibold">
                <Crown className="w-4 h-4 text-[#D6A85F]" /> Active Annual Sadhana Pass
              </span>
              <span className="text-[10px] text-emerald-400/80">Renewed Sept 2027</span>
            </div>
          )}
        </div>

        {/* Sub-tab Selectors */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('saved')}
            className={`pb-1.5 transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
              activeSubTab === 'saved' ? 'border-[#D6A85F] text-white' : 'border-transparent text-neutral-400'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-[#D6A85F]" />
            <span>Saved Reels ({savedVideos.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('audio')}
            className={`pb-1.5 transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
              activeSubTab === 'audio' ? 'border-[#D6A85F] text-white' : 'border-transparent text-neutral-400'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-[#D6A85F]" />
            <span>Saved Audio ({savedAudio.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`pb-1.5 transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
              activeSubTab === 'settings' ? 'border-[#D6A85F] text-white' : 'border-transparent text-neutral-400'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-[#D6A85F]" />
            <span>Preferences</span>
          </button>
        </div>

        {/* TAB 1: Saved Reels */}
        {activeSubTab === 'saved' && (
          <div>
            {savedVideos.length === 0 ? (
              <div className="text-center py-10 text-neutral-500 text-xs">
                <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No saved videos yet. Tap the bookmark icon on any reel to keep it in your holy treasury.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {savedVideos.map((video, idx) => (
                  <div
                    key={video.id}
                    onClick={() => {
                      setCurrentVideoIndex(idx);
                      setActiveTab('home');
                    }}
                    className="aspect-[9/16] rounded-2xl overflow-hidden relative cursor-pointer group border border-white/10 bg-neutral-900"
                  >
                    <img src={video.thumbnailUrl} alt={video.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <div className="absolute bottom-2 inset-x-2">
                      <span className="text-[10px] text-[#E8C280] font-serif block truncate">{video.sourceContext}</span>
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">{video.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Saved Audio */}
        {activeSubTab === 'audio' && (
          <div>
            {savedAudio.length === 0 ? (
              <div className="text-center py-10 text-neutral-500 text-xs">
                <Music className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No devotional audio favorited yet. Add chants and mantras from the Audio tab.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedAudio.map(track => (
                  <div
                    key={track.id}
                    onClick={() => devotionalAudioEngine.playTrack(track, savedAudio)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img src={track.coverUrl} alt={track.title} referrerPolicy="no-referrer" className="w-11 h-11 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-xs font-semibold text-white">{track.title}</h4>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{track.artist} • {track.category}</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#D6A85F] font-semibold">Play</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Settings & Preferences */}
        {activeSubTab === 'settings' && (
          <div className="space-y-4 text-xs">
            {/* Install Mobile App Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#D6A85F]/20 to-amber-500/10 border border-[#D6A85F]/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D6A85F] text-black flex items-center justify-center font-bold shadow-md shadow-[#D6A85F]/20">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Install Ishvara on Mobile</h4>
                  <p className="text-[11px] text-[#E8C280] mt-0.5">Standalone home screen app with offline chants</p>
                </div>
              </div>
              <button
                id="btn-profile-install-app"
                onClick={() => setShowInstallModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#D6A85F] text-black font-bold flex items-center gap-1.5 shadow-sm hover:brightness-110 active:scale-95 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            </div>

            {/* Download Source Code ZIP Banner */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 text-[#D6A85F] flex items-center justify-center font-bold">
                  <Archive className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Download Project ZIP</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Full source code (5.6 MB) with Git readiness</p>
                </div>
              </div>
              <button
                id="btn-profile-download-zip"
                onClick={() => setShowZipModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-neutral-200 font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#D6A85F]" />
                <span>Get ZIP</span>
              </button>
            </div>

            {/* Language Setting */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-200 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#D6A85F]" /> Content Language
                </span>
                <span className="text-neutral-400">{preferences.language}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {(['English', 'Hindi', 'Hinglish'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => updatePreferences({ language: lang })}
                    className={`py-2 rounded-xl text-center font-medium transition cursor-pointer ${
                      preferences.language === lang
                        ? 'bg-[#D6A85F] text-black font-semibold'
                        : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Reminders */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-200 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#D6A85F]" /> Sadhana Reminders
                </span>
                <span className="text-[11px] text-neutral-400">Tactful & Respectful</span>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-neutral-300">Morning Meditation Prompt (6:00 AM)</span>
                  <input
                    type="checkbox"
                    checked={preferences.notificationReminders.morning}
                    onChange={e => updatePreferences({
                      notificationReminders: { ...preferences.notificationReminders, morning: e.target.checked }
                    })}
                    className="accent-[#D6A85F] w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-neutral-300">Streak Preservation Alert (8:00 PM)</span>
                  <input
                    type="checkbox"
                    checked={preferences.notificationReminders.streak}
                    onChange={e => updatePreferences({
                      notificationReminders: { ...preferences.notificationReminders, streak: e.target.checked }
                    })}
                    className="accent-[#D6A85F] w-4 h-4"
                  />
                </label>
              </div>
            </div>

            {/* Recalibrate / Reset Onboarding */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-neutral-200">Re-calibrate Spiritual Goals</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Change preferred deity, topics & daily goal</p>
              </div>
              <button
                id="btn-recalibrate-path"
                onClick={resetOnboarding}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Ethical AI & Scripture Citations Policy */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-[11px] text-neutral-400 space-y-1.5">
              <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Grounded Wisdom Policy
              </span>
              <p className="leading-relaxed">
                Ishvara is committed to verified Sanskrit scripture roots. We strictly ban fear-mongering, fatalistic astrology, or predatory monetization. Every teaching points back to original shlokas from the Bhagavad Gita, Upanishads, Shiva Purana, and Ramacharitmanas.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
