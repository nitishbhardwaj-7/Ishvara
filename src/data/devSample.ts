import { AudioTrack, VideoItem } from '../types';

// Local-development placeholders, used only by `bun run dev` when Supabase isn't configured.
// Production builds never show these (see services/content.ts).

const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * 86_400_000).toISOString();

export const DEV_SAMPLE_VIDEOS: VideoItem[] = [
  {
    id: 'dev-video-1',
    title: 'You Control the Effort, Not the Outcome',
    description: 'Krishna’s counsel to Arjuna on acting without anxiety.',
    deity: 'Krishna',
    sourceContext: 'Bhagavad Gita 2.47',
    quoteSanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
    quoteTranslation: 'You have a right to your actions, never to their fruits.',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnailUrl: '/assets/spiritual/krishna-hero.jpg',
    duration: 60,
    publishedAt: daysAgo(0),
  },
  {
    id: 'dev-video-2',
    title: 'The Stillness of Mahadev',
    description: 'Why Shiva sits unmoved while the world spins.',
    deity: 'Shiva',
    sourceContext: 'Shiva Purana',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnailUrl: '/assets/spiritual/shiva-hero.jpg',
    duration: 45,
    publishedAt: daysAgo(1),
  },
  {
    id: 'dev-video-3',
    title: 'Courage Through Devotion',
    description: 'Hanuman’s leap across the ocean.',
    deity: 'Hanuman',
    sourceContext: 'Sundara Kanda',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnailUrl: '/assets/spiritual/hanuman-hero.jpg',
    duration: 50,
    publishedAt: daysAgo(2),
  },
];

export const DEV_SAMPLE_SONGS: AudioTrack[] = [
  {
    id: 'dev-song-1',
    title: 'Om Namah Shivaya',
    artist: 'Sample Artist',
    deity: 'Shiva',
    category: 'Mantras',
    coverUrl: '/assets/spiritual/shiva.jpg',
    audioUrl: 'https://cdn.freesound.org/previews/560/560731_11861866-lq.mp3',
    duration: 60,
    lyrics: 'Om Namah Shivaya',
    meaning: 'I bow to Shiva, the auspicious one.',
    publishedAt: daysAgo(0),
  },
  {
    id: 'dev-song-2',
    title: 'Hanuman Chalisa',
    artist: 'Sample Artist',
    deity: 'Hanuman',
    category: 'Chants',
    coverUrl: '/assets/spiritual/hanuman-chalisa.jpg',
    audioUrl: 'https://cdn.freesound.org/previews/415/415490_5121236-lq.mp3',
    duration: 60,
    publishedAt: daysAgo(1),
  },
];
