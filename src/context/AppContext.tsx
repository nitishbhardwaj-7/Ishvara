import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserPreferences, VideoItem, AudioTrack, ShlokaItem, DailyPractice, CommentItem, TabType, Deity } from '../types';
import { SEED_VIDEOS, SEED_AUDIO_TRACKS, SEED_DAILY_PRACTICES, SEED_SHLOKAS } from '../data/seedData';
import { reelsAlgorithm } from '../services/reelsAlgorithm';
import { analytics } from '../services/analytics';
import { devotionalAudioEngine } from '../services/audioEngine';

interface AppContextType {
  user: UserProfile;
  preferences: UserPreferences;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  videos: VideoItem[];
  rankedVideos: VideoItem[];
  currentVideoIndex: number;
  setCurrentVideoIndex: (idx: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean | ((prev: boolean) => boolean)) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  showPaywall: boolean;
  setShowPaywall: (show: boolean) => void;
  showAskDivya: boolean;
  setShowAskDivya: (show: boolean) => void;
  showAdmin: boolean;
  setShowAdmin: (show: boolean) => void;
  showInstallModal: boolean;
  setShowInstallModal: (show: boolean) => void;
  showZipModal: boolean;
  setShowZipModal: (show: boolean) => void;
  shareModalItem: { video?: VideoItem; shloka?: ShlokaItem } | null;
  setShareModalItem: (item: { video?: VideoItem; shloka?: ShlokaItem } | null) => void;
  commentModalVideo: VideoItem | null;
  setCommentModalVideo: (video: VideoItem | null) => void;
  reportModalVideo: VideoItem | null;
  setReportModalVideo: (video: VideoItem | null) => void;
  deviceFrameMode: 'mobile' | 'responsive';
  setDeviceFrameMode: (mode: 'mobile' | 'responsive') => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedDeityFilter: Deity | 'All';
  setSelectedDeityFilter: (deity: Deity | 'All') => void;
  activePractice: DailyPractice;
  dailyStreakCelebration: boolean;
  dismissStreakCelebration: () => void;
  // Actions
  toggleLikeVideo: (videoId: string) => void;
  toggleSaveVideo: (videoId: string) => void;
  toggleSaveAudio: (audioId: string) => void;
  recordVideoWatch: (videoId: string, durationSec: number, completed: boolean) => void;
  completeDailyPractice: (practiceId: string, reflectionNote?: string) => void;
  upgradeSubscription: (plan: 'monthly' | 'yearly') => void;
  updatePreferences: (partial: Partial<UserPreferences>) => void;
  completeOnboarding: (selectedDeity: Deity, goals: string[], language: 'English' | 'Hindi' | 'Hinglish', duration: number) => void;
  resetOnboarding: () => void;
  postComment: (videoId: string, text: string) => void;
  commentsMap: Record<string, CommentItem[]>;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'English',
  topics: ['Karma Yoga', 'Inner Stillness', 'Courage & Strength'],
  preferredDeity: 'Universal',
  dailyGoalMinutes: 10,
  notificationsEnabled: true,
  notificationReminders: {
    morning: true,
    evening: true,
    streak: true,
    newContent: true,
  },
  autoplay: true,
  hapticsEnabled: true,
};

const DEFAULT_USER: UserProfile = {
  id: 'usr_spiritual_seeker',
  name: 'Arjun Sharma',
  email: 'arjun@ishvara.app',
  avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%231a1510"/><circle cx="60" cy="60" r="50" fill="%23261f18" stroke="%23c99a4a" stroke-width="2"/><text x="60" y="68" font-family="serif" font-size="32" fill="%23f5f1e8" text-anchor="middle">अ</text></svg>',
  streak: 6,
  longestStreak: 14,
  weeklyCheckins: {
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: true,
    Sun: false,
  },
  level: 3,
  xp: 420,
  subscriptionStatus: 'free',
  savedVideoIds: ['vid-1', 'vid-3', 'vid-12'],
  savedAudioIds: ['audio-1', 'audio-2'],
  likedVideoIds: ['vid-1', 'vid-2', 'vid-5'],
  completedPracticeDates: ['dp-day-1', 'dp-day-2', 'dp-day-3', 'dp-day-4', 'dp-day-5'],
  topicAffinities: { 'Karma Yoga': 4, 'Inner Stillness': 3, 'Courage & Strength': 5 },
  deityAffinities: { Shiva: 4, Hanuman: 5, Krishna: 4 },
  onboardingCompleted: true,
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('ishvara_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('ishvara_user_prefs');
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [videos, setVideos] = useState<VideoItem[]>(SEED_VIDEOS);
  const [rankedVideos, setRankedVideos] = useState<VideoItem[]>(SEED_VIDEOS);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!user.onboardingCompleted);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAskDivya, setShowAskDivya] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showZipModal, setShowZipModal] = useState(false);
  const [shareModalItem, setShareModalItem] = useState<{ video?: VideoItem; shloka?: ShlokaItem } | null>(null);
  const [commentModalVideo, setCommentModalVideo] = useState<VideoItem | null>(null);
  const [reportModalVideo, setReportModalVideo] = useState<VideoItem | null>(null);
  const [deviceFrameMode, setDeviceFrameMode] = useState<'mobile' | 'responsive'>('mobile');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDeityFilter, setSelectedDeityFilter] = useState<Deity | 'All'>('All');
  const [dailyStreakCelebration, setDailyStreakCelebration] = useState(false);

  const [commentsMap, setCommentsMap] = useState<Record<string, CommentItem[]>>({
    'vid-1': [
      {
        id: 'c1',
        videoId: 'vid-1',
        userName: 'Pooja Varma',
        userAvatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%232b1a10" stroke="%23c99a4a" stroke-width="2"/><text x="50" y="58" font-family="serif" font-size="28" fill="%23f5f1e8" text-anchor="middle">पूँ</text></svg>',
        text: 'This verse changed how I deal with workplace anxiety. Doing my duty with total love and dropping the worry of promotions.',
        likes: 42,
        timestamp: '2h ago'
      },
      {
        id: 'c2',
        videoId: 'vid-1',
        userName: 'Karan Mehra',
        userAvatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%231a2228" stroke="%23c99a4a" stroke-width="2"/><text x="50" y="58" font-family="serif" font-size="28" fill="%23f5f1e8" text-anchor="middle">क</text></svg>',
        text: 'Har Har Mahadev. The audio clarity and explanation is pure golden wisdom.',
        likes: 19,
        timestamp: '5h ago'
      }
    ]
  });

  // Calculate recommendation ranking when user affinities change
  useEffect(() => {
    const { ranked } = reelsAlgorithm.rankVideos(videos, user);
    setRankedVideos(ranked);
  }, [user.topicAffinities, user.deityAffinities, user.savedVideoIds.length, user.likedVideoIds.length]);

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem('ishvara_user_profile', JSON.stringify(user));
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('ishvara_user_prefs', JSON.stringify(preferences));
    } catch {}
  }, [preferences]);

  // Track initial app open
  useEffect(() => {
    analytics.track('app_open', {
      streak: user.streak,
      level: user.level,
      subscription: user.subscriptionStatus
    });
  }, []);

  const toggleLikeVideo = (videoId: string) => {
    const isLiked = user.likedVideoIds.includes(videoId);
    const newLiked = isLiked
      ? user.likedVideoIds.filter(id => id !== videoId)
      : [...user.likedVideoIds, videoId];

    const target = videos.find(v => v.id === videoId);
    if (!isLiked && target) {
      // Boost topic & deity affinity
      setUser(prev => ({
        ...prev,
        likedVideoIds: newLiked,
        topicAffinities: {
          ...prev.topicAffinities,
          [target.topic]: (prev.topicAffinities[target.topic] || 0) + 1
        },
        deityAffinities: {
          ...prev.deityAffinities,
          [target.deity]: (prev.deityAffinities[target.deity] || 0) + 1
        }
      }));
      analytics.track('video_liked', { videoId, topic: target.topic, deity: target.deity });
    } else {
      setUser(prev => ({ ...prev, likedVideoIds: newLiked }));
    }

    // Update video count optimistically
    setVideos(prev => prev.map(v => v.id === videoId ? {
      ...v,
      stats: { ...v.stats, likes: isLiked ? v.stats.likes - 1 : v.stats.likes + 1 }
    } : v));
  };

  const toggleSaveVideo = (videoId: string) => {
    const isSaved = user.savedVideoIds.includes(videoId);
    const newSaved = isSaved
      ? user.savedVideoIds.filter(id => id !== videoId)
      : [...user.savedVideoIds, videoId];

    const target = videos.find(v => v.id === videoId);
    setUser(prev => ({
      ...prev,
      savedVideoIds: newSaved,
      topicAffinities: target && !isSaved ? {
        ...prev.topicAffinities,
        [target.topic]: (prev.topicAffinities[target.topic] || 0) + 2
      } : prev.topicAffinities
    }));

    if (!isSaved && target) {
      analytics.track('video_saved', { videoId, topic: target.topic, deity: target.deity });
    }
  };

  const toggleSaveAudio = (audioId: string) => {
    const isSaved = user.savedAudioIds.includes(audioId);
    setUser(prev => ({
      ...prev,
      savedAudioIds: isSaved
        ? prev.savedAudioIds.filter(id => id !== audioId)
        : [...prev.savedAudioIds, audioId]
    }));
  };

  const recordVideoWatch = (videoId: string, durationSec: number, completed: boolean) => {
    const target = videos.find(v => v.id === videoId);
    if (!target) return;

    reelsAlgorithm.recordInteraction(
      videoId,
      durationSec,
      target.duration,
      user.likedVideoIds.includes(videoId),
      user.savedVideoIds.includes(videoId),
      false
    );

    analytics.track(completed ? 'video_completed' : 'video_25_percent', {
      videoId,
      durationSec,
      topic: target.topic,
      deity: target.deity
    });
  };

  const completeDailyPractice = (practiceId: string, reflectionNote?: string) => {
    if (user.completedPracticeDates.includes(practiceId)) return;

    setUser(prev => {
      const newStreak = prev.streak + 1;
      const longest = Math.max(prev.longestStreak, newStreak);
      const newXp = prev.xp + 50;
      const newLevel = Math.floor(newXp / 150) + 1;

      return {
        ...prev,
        streak: newStreak,
        longestStreak: longest,
        xp: newXp,
        level: newLevel,
        completedPracticeDates: [...prev.completedPracticeDates, practiceId],
        weeklyCheckins: {
          ...prev.weeklyCheckins,
          Sun: true // Completed today's checkin
        }
      };
    });

    setDailyStreakCelebration(true);
    analytics.track('daily_practice_completed', { practiceId, noteLength: reflectionNote?.length || 0 });
    analytics.track('streak_extended', { newStreak: user.streak + 1 });
  };

  const dismissStreakCelebration = () => {
    setDailyStreakCelebration(false);
  };

  const upgradeSubscription = (plan: 'monthly' | 'yearly') => {
    setUser(prev => ({
      ...prev,
      subscriptionStatus: 'premium',
      subscriptionPlan: plan
    }));
    setShowPaywall(false);
    analytics.track('subscription_started', { plan });
  };

  const updatePreferences = (partial: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...partial }));
  };

  const completeOnboarding = (selectedDeity: Deity, goals: string[], language: 'English' | 'Hindi' | 'Hinglish', duration: number) => {
    setPreferences(prev => ({
      ...prev,
      preferredDeity: selectedDeity,
      topics: goals,
      language,
      dailyGoalMinutes: duration
    }));

    setUser(prev => ({
      ...prev,
      onboardingCompleted: true,
      deityAffinities: {
        ...prev.deityAffinities,
        [selectedDeity]: 6
      }
    }));

    setShowOnboarding(false);
    analytics.track('onboarding_completed', { selectedDeity, goalsCount: goals.length, language });
  };

  const resetOnboarding = () => {
    setUser(prev => ({ ...prev, onboardingCompleted: false }));
    setShowOnboarding(true);
  };

  const postComment = (videoId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: CommentItem = {
      id: `c_${Date.now()}`,
      videoId,
      userName: user.name,
      userAvatar: user.avatar,
      text: text.trim(),
      likes: 0,
      timestamp: 'Just now'
    };

    setCommentsMap(prev => ({
      ...prev,
      [videoId]: [newComment, ...(prev[videoId] || [])]
    }));

    setVideos(prev => prev.map(v => v.id === videoId ? {
      ...v,
      stats: { ...v.stats, comments: v.stats.comments + 1 }
    } : v));
  };

  // Determine today's active practice from seed data
  const activePractice = SEED_DAILY_PRACTICES[0];

  return (
    <AppContext.Provider
      value={{
        user,
        preferences,
        activeTab,
        setActiveTab,
        videos,
        rankedVideos,
        currentVideoIndex,
        setCurrentVideoIndex,
        isMuted,
        setIsMuted,
        showOnboarding,
        setShowOnboarding,
        showPaywall,
        setShowPaywall,
        showAskDivya,
        setShowAskDivya,
        showAdmin,
        setShowAdmin,
        showInstallModal,
        setShowInstallModal,
        showZipModal,
        setShowZipModal,
        shareModalItem,
        setShareModalItem,
        commentModalVideo,
        setCommentModalVideo,
        reportModalVideo,
        setReportModalVideo,
        deviceFrameMode,
        setDeviceFrameMode,
        selectedCategory,
        setSelectedCategory,
        selectedDeityFilter,
        setSelectedDeityFilter,
        activePractice,
        dailyStreakCelebration,
        dismissStreakCelebration,
        toggleLikeVideo,
        toggleSaveVideo,
        toggleSaveAudio,
        recordVideoWatch,
        completeDailyPractice,
        upgradeSubscription,
        updatePreferences,
        completeOnboarding,
        resetOnboarding,
        postComment,
        commentsMap
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
