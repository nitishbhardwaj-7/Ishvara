import { createClient } from '@supabase/supabase-js';
import * as tus from 'tus-js-client';

// Trim: values pasted into GitHub variables often carry a stray newline
const url = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

export const isConfigured = Boolean(url && anonKey);
export const supabase = createClient(url || 'https://not-configured.supabase.co', anonKey || 'missing');

export type Deity = 'Shiva' | 'Hanuman' | 'Krishna' | 'Universal';
export const DEITIES: Deity[] = ['Shiva', 'Hanuman', 'Krishna', 'Universal'];
export const SONG_CATEGORIES = ['Bhajans', 'Mantras', 'Aartis', 'Chants', 'Meditation'] as const;

export interface VideoRow {
  id: string;
  title: string;
  description: string;
  deity: Deity;
  source_context: string;
  quote_sanskrit: string | null;
  quote_translation: string | null;
  bunny_video_id: string | null;
  video_url: string;
  thumbnail_url: string;
  duration_sec: number;
  publish_at: string;
  is_published: boolean;
  created_at: string;
}

export interface SongRow {
  id: string;
  title: string;
  artist: string;
  deity: Deity;
  category: (typeof SONG_CATEGORIES)[number];
  audio_url: string;
  cover_url: string;
  duration_sec: number;
  lyrics: string | null;
  meaning: string | null;
  publish_at: string;
  is_published: boolean;
  created_at: string;
}

const functionUrl = () => `${url}/functions/v1/bunny`;

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Your session expired. Please sign in again.');
  return { Authorization: `Bearer ${token}`, apikey: anonKey! };
}

async function callBunny<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch(functionUrl(), {
    method: 'POST',
    headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

/** Reads duration (seconds) from a local audio/video file before upload. */
export function readMediaDuration(file: File): Promise<number> {
  return new Promise(resolve => {
    const el = document.createElement(file.type.startsWith('video') ? 'video' : 'audio');
    el.preload = 'metadata';
    const objectUrl = URL.createObjectURL(file);
    const done = (value: number) => {
      URL.revokeObjectURL(objectUrl);
      resolve(Number.isFinite(value) ? Math.round(value) : 0);
    };
    el.onloadedmetadata = () => done(el.duration);
    el.onerror = () => done(0);
    el.src = objectUrl;
  });
}

/** Creates a Bunny Stream video and uploads the file with resumable TUS. */
export async function uploadVideo(
  file: File,
  title: string,
  onProgress: (fraction: number) => void,
): Promise<{ guid: string; videoUrl: string; thumbnailUrl: string }> {
  const creds = await callBunny<{
    guid: string;
    libraryId: string;
    expiration: number;
    signature: string;
    videoUrl: string;
    thumbnailUrl: string;
  }>({ action: 'create-video', title });

  await new Promise<void>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: 'https://video.bunnycdn.com/tusupload',
      retryDelays: [0, 3000, 5000, 10000, 20000, 60000],
      chunkSize: 50 * 1024 * 1024,
      headers: {
        AuthorizationSignature: creds.signature,
        AuthorizationExpire: String(creds.expiration),
        VideoId: creds.guid,
        LibraryId: creds.libraryId,
      },
      metadata: { filetype: file.type, title },
      onError: err => reject(err),
      onProgress: (sent, total) => onProgress(total ? sent / total : 0),
      onSuccess: () => resolve(),
    });
    upload.start();
  });

  return { guid: creds.guid, videoUrl: creds.videoUrl, thumbnailUrl: creds.thumbnailUrl };
}

/** Uploads an audio or image file to Bunny Storage via the edge function, with progress. */
export async function uploadFile(file: File, kind: 'audio' | 'image', onProgress: (fraction: number) => void): Promise<string> {
  const headers = await authHeaders();
  const form = new FormData();
  form.append('action', 'upload-file');
  form.append('kind', kind);
  form.append('file', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', functionUrl());
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.upload.onprogress = e => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.onload = () => {
      let data: { url?: string; error?: string } = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // non-JSON error body
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.url) resolve(data.url);
      else reject(new Error(data.error || `Upload failed (${xhr.status})`));
    };
    xhr.send(form);
  });
}

export type BunnyStatus = { status: number; encodeProgress: number; length: number };

export const getVideoStatuses = (guids: string[]) =>
  callBunny<{ statuses: Record<string, BunnyStatus> }>({ action: 'video-status', guids }).then(r => r.statuses);

export const deleteBunnyVideo = (guid: string) => callBunny({ action: 'delete-video', guid });
export const deleteBunnyFile = (fileUrl: string) => callBunny({ action: 'delete-file', url: fileUrl });

// ---- date helpers for <input type="datetime-local"> ----
export const toLocalInput = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** Next daily slot: the day after the latest scheduled item at 6:00 AM, or ~now if nothing is queued. */
export function nextSlot(existing: { publish_at: string }[]): Date {
  const latest = existing.reduce((max, r) => Math.max(max, new Date(r.publish_at).getTime()), 0);
  const now = Date.now();
  if (latest > now) {
    const d = new Date(latest);
    d.setDate(d.getDate() + 1);
    d.setHours(6, 0, 0, 0);
    return d;
  }
  return new Date(now + 15 * 60 * 1000);
}

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export const fmtDuration = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
