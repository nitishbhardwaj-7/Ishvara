import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { AudioTrack, DailyPractice, Deity, ShlokaItem, TabType, VideoItem } from '../types';
import { SEED_DAILY_PRACTICES } from '../data/wisdom';
import { fetchContent, readCachedContent } from '../services/content';

type ContentStatus = 'loading' | 'ready' | 'error';

interface JourneyState {
  completedDates: string[]; // local YYYY-MM-DD
  longestStreak: number;
}

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  videos: VideoItem[];
  songs: AudioTrack[];
  contentStatus: ContentStatus;
  refreshContent: () => Promise<void>;

  currentVideoIndex: number;
  setCurrentVideoIndex: (idx: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean | ((prev: boolean) => boolean)) => void;
  selectedDeityFilter: Deity | 'All';
  setSelectedDeityFilter: (deity: Deity | 'All') => void;

  showAskDivya: boolean;
  setShowAskDivya: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  shareModalItem: { video?: VideoItem; shloka?: ShlokaItem } | null;
  setShareModalItem: (item: { video?: VideoItem; shloka?: ShlokaItem } | null) => void;

  todaysPractice: DailyPractice;
  isPracticeDoneToday: boolean;
  streak: number;
  longestStreak: number;
  completedDates: string[];
  completeTodaysPractice: () => void;
  resetJourney: () => void;
  streakCelebration: boolean;
  dismissStreakCelebration: () => void;
}

const JOURNEY_KEY = 'ishvara_journey_v1';

export const toLocalDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function computeStreak(completed: Set<string>): number {
  const cursor = new Date();
  // A streak is still alive if today isn't done yet but yesterday was
  if (!completed.has(toLocalDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (completed.has(toLocalDateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function loadJourney(): JourneyState {
  try {
    const raw = localStorage.getItem(JOURNEY_KEY);
    if (raw) return JSON.parse(raw) as JourneyState;
  } catch {
    // corrupted or unavailable storage — start fresh
  }
  return { completedDates: [], longestStreak: 0 };
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cached = useMemo(() => readCachedContent(), []);

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [videos, setVideos] = useState<VideoItem[]>(cached?.videos ?? []);
  const [songs, setSongs] = useState<AudioTrack[]>(cached?.songs ?? []);
  const [contentStatus, setContentStatus] = useState<ContentStatus>(cached ? 'ready' : 'loading');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedDeityFilter, setSelectedDeityFilter] = useState<Deity | 'All'>('All');
  const [showAskDivya, setShowAskDivya] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [shareModalItem, setShareModalItem] = useState<{ video?: VideoItem; shloka?: ShlokaItem } | null>(null);
  const [journey, setJourney] = useState<JourneyState>(loadJourney);
  const [streakCelebration, setStreakCelebration] = useState(false);

  const refreshContent = useCallback(async () => {
    try {
      const snapshot = await fetchContent();
      setVideos(prev => {
        // Keep the viewer on the same reel if new content arrives above it
        return snapshot.videos.length === prev.length && snapshot.videos.every((v, i) => v.id === prev[i]?.id)
          ? prev
          : snapshot.videos;
      });
      setSongs(snapshot.songs);
      setContentStatus('ready');
    } catch (err) {
      console.error('Failed to load content', err);
      // With a cached copy we stay usable offline; otherwise show the error state
      setContentStatus(prev => (prev === 'ready' ? 'ready' : 'error'));
    }
  }, []);

  // Load on start and whenever the app returns to the foreground (new daily uploads)
  useEffect(() => {
    refreshContent();
    const handle = CapacitorApp.addListener('resume', () => refreshContent());
    return () => {
      handle.then(h => h.remove()).catch(() => {});
    };
  }, [refreshContent]);

  useEffect(() => {
    try {
      localStorage.setItem(JOURNEY_KEY, JSON.stringify(journey));
    } catch {
      // best-effort persistence
    }
  }, [journey]);

  const completedSet = useMemo(() => new Set(journey.completedDates), [journey.completedDates]);
  const todayKey = toLocalDateKey(new Date());
  const streak = computeStreak(completedSet);
  const isPracticeDoneToday = completedSet.has(todayKey);

  // Rotate through the practice library one per calendar day
  const todaysPractice = useMemo(() => {
    const dayNumber = Math.floor(new Date(todayKey).getTime() / 86_400_000);
    return SEED_DAILY_PRACTICES[dayNumber % SEED_DAILY_PRACTICES.length];
  }, [todayKey]);

  const completeTodaysPractice = () => {
    if (isPracticeDoneToday) return;
    setJourney(prev => {
      const completedDates = [...prev.completedDates, todayKey].slice(-400);
      const newStreak = computeStreak(new Set(completedDates));
      return { completedDates, longestStreak: Math.max(prev.longestStreak, newStreak) };
    });
    setStreakCelebration(true);
  };

  const resetJourney = () => setJourney({ completedDates: [], longestStreak: 0 });

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        videos,
        songs,
        contentStatus,
        refreshContent,
        currentVideoIndex,
        setCurrentVideoIndex,
        isMuted,
        setIsMuted,
        selectedDeityFilter,
        setSelectedDeityFilter,
        showAskDivya,
        setShowAskDivya,
        showSettings,
        setShowSettings,
        shareModalItem,
        setShareModalItem,
        todaysPractice,
        isPracticeDoneToday,
        streak,
        longestStreak: Math.max(journey.longestStreak, streak),
        completedDates: journey.completedDates,
        completeTodaysPractice,
        resetJourney,
        streakCelebration,
        dismissStreakCelebration: () => setStreakCelebration(false),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
