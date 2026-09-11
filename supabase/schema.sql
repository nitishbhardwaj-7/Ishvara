-- ====================================================================
-- ISHVARA PRODUCTION SUPABASE / POSTGRESQL DATABASE SCHEMA
-- ====================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Deities & Categories
CREATE TABLE IF NOT EXISTS deities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  sanskrit_name TEXT,
  description TEXT,
  icon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS video_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  deity_id UUID REFERENCES deities(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Users, Profiles, and Preferences
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  streak INTEGER DEFAULT 1,
  longest_streak INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 100,
  level INTEGER DEFAULT 1,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
  subscription_plan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_language TEXT DEFAULT 'English' CHECK (preferred_language IN ('English', 'Hindi', 'Hinglish')),
  preferred_deity TEXT DEFAULT 'Universal',
  daily_goal_minutes INTEGER DEFAULT 10,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  morning_reminder BOOLEAN DEFAULT TRUE,
  evening_reminder BOOLEAN DEFAULT TRUE,
  streak_alerts BOOLEAN DEFAULT TRUE,
  autoplay BOOLEAN DEFAULT TRUE,
  haptics BOOLEAN DEFAULT TRUE,
  topic_affinities JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Videos (9:16 Spiritual Reels)
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  deity TEXT NOT NULL,
  source_context TEXT NOT NULL,
  category_id UUID REFERENCES video_categories(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  video_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  duration_sec INTEGER NOT NULL,
  creator_name TEXT NOT NULL,
  creator_avatar TEXT,
  creator_handle TEXT,
  creator_verified BOOLEAN DEFAULT TRUE,
  is_premium BOOLEAN DEFAULT FALSE,
  quote_sanskrit TEXT,
  quote_translation TEXT,
  quote_author TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  content_rights TEXT DEFAULT 'licensed_original',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Video Interactions & Recommendation Metrics
CREATE TABLE IF NOT EXISTS video_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  watch_duration_sec NUMERIC DEFAULT 0,
  completion_rate NUMERIC DEFAULT 0,
  rewatch_count INTEGER DEFAULT 0,
  skipped_quickly BOOLEAN DEFAULT FALSE,
  liked BOOLEAN DEFAULT FALSE,
  saved BOOLEAN DEFAULT FALSE,
  shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, video_id)
);

CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, video_id)
);

CREATE TABLE IF NOT EXISTS saves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, video_id)
);

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Audio Library (Spotify-style)
CREATE TABLE IF NOT EXISTS audio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  deity TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Bhajans', 'Mantras', 'Aartis', 'Chants', 'Meditation', 'Sleep', 'Morning')),
  cover_url TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  duration_sec INTEGER NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  lyrics TEXT,
  meaning TEXT,
  bpm INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audio_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  audio_id UUID REFERENCES audio(id) ON DELETE CASCADE,
  listened_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  played_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_audio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  audio_id UUID REFERENCES audio(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, audio_id)
);

-- 7. Daily Practices & Shlokas
CREATE TABLE IF NOT EXISTS daily_practices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date_label TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  shloka_sanskrit TEXT NOT NULL,
  shloka_transliteration TEXT NOT NULL,
  shloka_translation TEXT NOT NULL,
  shloka_source TEXT NOT NULL,
  mantra_name TEXT NOT NULL,
  mantra_sanskrit TEXT NOT NULL,
  mantra_target_count INTEGER DEFAULT 11,
  teaching_headline TEXT NOT NULL,
  teaching_summary TEXT NOT NULL,
  reflection_question TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_daily_practice_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  practice_id UUID REFERENCES daily_practices(id) ON DELETE CASCADE,
  reflection_note TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, practice_id)
);

CREATE TABLE IF NOT EXISTS shlokas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL,
  chapter_verse TEXT,
  deity TEXT NOT NULL,
  sanskrit TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  translation TEXT NOT NULL,
  context TEXT NOT NULL,
  practical_application TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AI Spiritual Conversations (Ask Divya)
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Spiritual Inquiry',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  sender TEXT CHECK (sender IN ('user', 'divya')),
  content TEXT NOT NULL,
  sacred_citation JSONB,
  modern_takeaway TEXT,
  recommended_practice TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Content Reports & Subscriptions
CREATE TABLE IF NOT EXISTS content_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'comment', 'audio')),
  content_id UUID NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_videos_deity ON videos(deity);
CREATE INDEX IF NOT EXISTS idx_videos_topic ON videos(topic);
CREATE INDEX IF NOT EXISTS idx_videos_published_at ON videos(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_audio_deity ON audio(deity);
CREATE INDEX IF NOT EXISTS idx_audio_category ON audio(category);
CREATE INDEX IF NOT EXISTS idx_video_interactions_user ON video_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_video_interactions_video ON video_interactions(video_id);

-- 11. Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_audio ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_practice_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read public profiles and edit their own
CREATE POLICY "Profiles readable by authenticated users" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Preferences: user-private
CREATE POLICY "Users view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- Videos and Audio: publicly readable
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio ENABLE ROW LEVEL SECURITY;
ALTER TABLE shlokas ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_practices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Videos public read" ON videos FOR SELECT USING (true);
CREATE POLICY "Audio public read" ON audio FOR SELECT USING (true);
CREATE POLICY "Shlokas public read" ON shlokas FOR SELECT USING (true);
CREATE POLICY "Daily practices public read" ON daily_practices FOR SELECT USING (true);
