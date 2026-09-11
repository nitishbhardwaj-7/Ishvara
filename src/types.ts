export type Deity = 'Shiva' | 'Hanuman' | 'Krishna' | 'Universal';

export type Language = 'English' | 'Hindi' | 'Hinglish';

export interface UserPreferences {
  language: Language;
  topics: string[];
  preferredDeity: Deity;
  dailyGoalMinutes: number;
  notificationsEnabled: boolean;
  notificationReminders: {
    morning: boolean;
    evening: boolean;
    streak: boolean;
    newContent: boolean;
  };
  autoplay: boolean;
  hapticsEnabled: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  streak: number;
  longestStreak: number;
  weeklyCheckins: { [day: string]: boolean };
  level: number;
  xp: number;
  subscriptionStatus: 'free' | 'premium';
  subscriptionPlan?: 'monthly' | 'yearly';
  savedVideoIds: string[];
  savedAudioIds: string[];
  likedVideoIds: string[];
  completedPracticeDates: string[];
  topicAffinities: { [topic: string]: number };
  deityAffinities: { [deity in Deity]?: number };
  onboardingCompleted: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  shortDescription: string;
  deity: Deity;
  sourceContext: string; // e.g. "Bhagavad Gita • Chapter 2" or "Shiva Purana • Rudra Samhita"
  category: string;
  topic: string;
  tags: string[];
  videoUrl: string;
  thumbnailUrl: string;
  imageUrl?: string;
  heroImageUrl?: string;
  deityImageUrl?: string;
  fallbackImageUrl?: string;
  duration: number; // in seconds
  creator: {
    name: string;
    avatar: string;
    handle: string;
    verified: boolean;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    views: number;
  };
  isPremium: boolean;
  quoteSanskrit?: string;
  quoteTranslation?: string;
  quoteOverlay?: {
    sanskrit?: string;
    translation: string;
    author: string;
  };
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  deity: Deity;
  category: 'Bhajans' | 'Mantras' | 'Aartis' | 'Chants' | 'Meditation' | 'Sleep' | 'Morning';
  coverUrl: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  fallbackImageUrl?: string;
  audioUrl: string;
  duration: number; // in seconds
  isPremium: boolean;
  lyrics?: string;
  meaning?: string;
  bpm?: number;
  isOfflineCached?: boolean;
}

export interface DailyPractice {
  id: string;
  date: string;
  title: string;
  theme: string;
  shloka: {
    sanskrit: string;
    transliteration: string;
    translation: string;
    source: string;
    meaning: string;
  };
  mantra: {
    name: string;
    sanskrit: string;
    meaning: string;
    targetCount: number;
  };
  teaching: {
    headline: string;
    summary: string;
    durationSec: number;
    audioContext?: string;
  };
  reflection: {
    question: string;
    placeholder: string;
  };
}

export interface ShlokaItem {
  id: string;
  source: string;
  chapterVerse?: string;
  deity: Deity;
  sanskrit: string;
  transliteration: string;
  translation: string;
  context: string;
  practicalApplication: string;
  tags: string[];
}

export interface CommentItem {
  id: string;
  videoId: string;
  userName: string;
  userAvatar: string;
  text: string;
  likes: number;
  timestamp: string;
}

export interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, any>;
  timestamp: string;
}

export type TabType = 'home' | 'explore' | 'audio' | 'journey' | 'profile';

export interface SpiritualMediaAsset {
  id: string;
  url: string;
  type: 'deity_murti' | 'temple_architecture' | 'sacred_element' | 'himalayan_landscape' | 'meditation_nature' | 'ceremony_ritual' | 'audio_cover';
  deity: Deity | 'Universal' | 'None';
  category: string;
  prompt: string;
  style: string;
  aspect_ratio: '16:9' | '1:1' | '9:16' | '4:3' | '3:4' | '4:5';
  title?: string;
  description?: string;
}

