export type Deity = 'Shiva' | 'Hanuman' | 'Krishna' | 'Universal';

export const DEITIES: Deity[] = ['Shiva', 'Hanuman', 'Krishna', 'Universal'];

export type SongCategory = 'Bhajans' | 'Mantras' | 'Aartis' | 'Chants' | 'Meditation';

export const SONG_CATEGORIES: SongCategory[] = ['Bhajans', 'Mantras', 'Aartis', 'Chants', 'Meditation'];

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  deity: Deity;
  sourceContext: string; // e.g. "Bhagavad Gita 2.47"
  quoteSanskrit?: string;
  quoteTranslation?: string;
  videoUrl: string; // HLS (.m3u8) or MP4
  thumbnailUrl: string;
  duration: number; // seconds
  publishedAt: string; // ISO
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  deity: Deity;
  category: SongCategory;
  coverUrl: string;
  audioUrl: string;
  duration: number; // seconds
  lyrics?: string;
  meaning?: string;
  publishedAt: string; // ISO
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

export type TabType = 'home' | 'explore' | 'audio' | 'journey';

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
