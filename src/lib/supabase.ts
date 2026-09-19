import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Trim: values pasted into GitHub variables often carry a stray newline
const env = (value: string | undefined) => (value ?? '').trim();

const url = env(import.meta.env.VITE_SUPABASE_URL);
const anonKey = env(import.meta.env.VITE_SUPABASE_ANON_KEY);

export const isSupabaseConfigured = Boolean(url && anonKey);

// The listener app never signs in, so sessions are not persisted.
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

export const SUPPORT_EMAIL = env(import.meta.env.VITE_SUPPORT_EMAIL);
export const PRIVACY_POLICY_URL = env(import.meta.env.VITE_PRIVACY_POLICY_URL);
