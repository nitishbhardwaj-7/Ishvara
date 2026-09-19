import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AudioTrack, VideoItem } from '../types';
import { DEV_SAMPLE_SONGS, DEV_SAMPLE_VIDEOS } from '../data/devSample';

export interface ContentSnapshot {
  videos: VideoItem[];
  songs: AudioTrack[];
  fetchedAt: string;
}

const CACHE_KEY = 'ishvara_content_cache_v1';
const PAGE_LIMIT = 500;

interface VideoRow {
  id: string;
  title: string;
  description: string;
  deity: VideoItem['deity'];
  source_context: string;
  quote_sanskrit: string | null;
  quote_translation: string | null;
  video_url: string;
  thumbnail_url: string;
  duration_sec: number;
  publish_at: string;
}

interface SongRow {
  id: string;
  title: string;
  artist: string;
  deity: AudioTrack['deity'];
  category: AudioTrack['category'];
  audio_url: string;
  cover_url: string;
  duration_sec: number;
  lyrics: string | null;
  meaning: string | null;
  publish_at: string;
}

const toVideo = (r: VideoRow): VideoItem => ({
  id: r.id,
  title: r.title,
  description: r.description,
  deity: r.deity,
  sourceContext: r.source_context,
  quoteSanskrit: r.quote_sanskrit ?? undefined,
  quoteTranslation: r.quote_translation ?? undefined,
  videoUrl: r.video_url,
  thumbnailUrl: r.thumbnail_url,
  duration: r.duration_sec,
  publishedAt: r.publish_at,
});

const toSong = (r: SongRow): AudioTrack => ({
  id: r.id,
  title: r.title,
  artist: r.artist,
  deity: r.deity,
  category: r.category,
  audioUrl: r.audio_url,
  coverUrl: r.cover_url,
  duration: r.duration_sec,
  lyrics: r.lyrics ?? undefined,
  meaning: r.meaning ?? undefined,
  publishedAt: r.publish_at,
});

export function readCachedContent(): ContentSnapshot | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as ContentSnapshot) : null;
  } catch {
    return null;
  }
}

/** Newest-first list of everything currently live. RLS hides scheduled/unpublished rows. */
export async function fetchContent(): Promise<ContentSnapshot> {
  if (!isSupabaseConfigured || !supabase) {
    if (import.meta.env.DEV) {
      return { videos: DEV_SAMPLE_VIDEOS, songs: DEV_SAMPLE_SONGS, fetchedAt: new Date().toISOString() };
    }
    throw new Error('Content service is not configured.');
  }

  const [videosRes, songsRes] = await Promise.all([
    supabase.from('videos').select('*').order('publish_at', { ascending: false }).limit(PAGE_LIMIT),
    supabase.from('songs').select('*').order('publish_at', { ascending: false }).limit(PAGE_LIMIT),
  ]);
  if (videosRes.error) throw videosRes.error;
  if (songsRes.error) throw songsRes.error;

  const snapshot: ContentSnapshot = {
    videos: (videosRes.data as VideoRow[]).map(toVideo),
    songs: (songsRes.data as SongRow[]).map(toSong),
    fetchedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(snapshot));
  } catch {
    // storage full or unavailable — cache is best-effort
  }
  return snapshot;
}

export interface DivyaAnswer {
  answer: string;
  citation?: { source: string; sanskrit?: string; translation: string };
  takeaway?: string;
}

export async function askDivya(question: string): Promise<DivyaAnswer> {
  if (!supabase) throw new Error('Ask Divya is not available right now.');
  const { data, error } = await supabase.functions.invoke('ask-divya', { body: { question } });
  if (error) {
    // Surface the function's own message (e.g. rate limit) when there is one
    const context = (error as { context?: Response }).context;
    if (context && typeof context.json === 'function') {
      const body = await context.json().catch(() => null);
      if (body?.error) throw new Error(body.error);
    }
    throw error;
  }
  return data as DivyaAnswer;
}
