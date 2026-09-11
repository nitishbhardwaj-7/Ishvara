import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AudioTrack } from '../types';
import { SEED_AUDIO_TRACKS } from '../data/seedData';
import { devotionalAudioEngine, AudioPlayerState } from '../services/audioEngine';
import {
  getAudioArtwork,
  getMediaUrl,
  SPIRITUAL_MEDIA_REGISTRY
} from '../data/mediaConfig';
import { SpiritualImage } from './SpiritualImage';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Heart,
  Download,
  Share2,
  ChevronDown,
  Search,
  X,
  MoreVertical,
  ListMusic,
  Waves,
  Check,
  Lock,
  ArrowRight,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TuningFrequency = '432Hz' | '440Hz' | 'Original';

interface ContinueListeningItem {
  id: string;
  title: string;
  subtitle: string;
  currentTimeStr: string;
  durationStr: string;
  progressPercent: number;
  image: string;
  trackId: string;
}

export const AudioScreen: React.FC = () => {
  const { user, toggleSaveAudio, setShowPaywall, setShareModalItem } = useApp();

  const [playerState, setPlayerState] = useState<AudioPlayerState>(devotionalAudioEngine.getState());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showTuningModal, setShowTuningModal] = useState(false);
  const [activeFrequency, setActiveFrequency] = useState<TuningFrequency>('432Hz');
  const [selectedTrackForMore, setSelectedTrackForMore] = useState<AudioTrack | null>(null);
  const [showLyricsModal, setShowLyricsModal] = useState(false);
  const [downloadedTracks, setDownloadedTracks] = useState<string[]>(['audio-1']);

  useEffect(() => {
    const unsub = devotionalAudioEngine.subscribe(setPlayerState);
    return unsub;
  }, []);

  const categories = [
    'All',
    'Mantras',
    'Chants',
    'Meditation',
    'Bhajans',
    'Aarti',
    'Instrumental'
  ];

  // Authentic continue listening curated items with centralized media registry
  const continueListeningItems: ContinueListeningItem[] = [
    {
      id: 'cl-1',
      title: 'Morning Mantra',
      subtitle: 'A new day, a calmer you.',
      currentTimeStr: '3:12',
      durationStr: '8:00',
      progressPercent: 40,
      image: getMediaUrl('universal_gayatri_dawn'),
      trackId: 'audio-8' // Gayatri Mantra
    },
    {
      id: 'cl-2',
      title: 'Hanuman Chalisa',
      subtitle: 'Prana Resonance',
      currentTimeStr: '1:20',
      durationStr: '9:00',
      progressPercent: 15,
      image: getMediaUrl('hanuman_chalisa_sanctum'),
      trackId: 'audio-2' // Hanuman Chalisa
    },
    {
      id: 'cl-3',
      title: 'Sleep Meditation',
      subtitle: 'Inner Peace',
      currentTimeStr: '0:00',
      durationStr: '20:00',
      progressPercent: 0,
      image: getMediaUrl('universal_sleep_yoganidra'),
      trackId: 'audio-19' // Yoga Nidra
    }
  ];

  // Curated list of popular tracks with authentic photographic artworks from centralized media config
  const popularTrackList: AudioTrack[] = [
    {
      id: 'popular-1',
      title: 'Om Namah Shivaya',
      artist: 'Kailash Dhwani',
      deity: 'Shiva',
      category: 'Mantras',
      coverUrl: getAudioArtwork('popular-1', 'Shiva', 'Mantras').url,
      audioUrl: 'https://cdn.freesound.org/previews/560/560731_11861866-lq.mp3',
      duration: 444, // 7:24
      isPremium: false,
      lyrics: 'Om Namah Shivaya, Om Namah Shivaya...\nPanchakshara Stotram.',
      meaning: 'I bow to Shiva, the auspicious inner consciousness that transcends time and space.'
    },
    {
      id: 'popular-2',
      title: 'Hanuman Chalisa',
      artist: 'Prana Resonance',
      deity: 'Hanuman',
      category: 'Mantras',
      coverUrl: getAudioArtwork('popular-2', 'Hanuman', 'Mantras').url,
      audioUrl: 'https://cdn.freesound.org/previews/415/415490_5121236-lq.mp3',
      duration: 480, // 8:00
      isPremium: false,
      lyrics: 'Jai Hanuman gyan gun sagar, Jai Kapis tihun lok ujagar...',
      meaning: 'The eternal hymn of forty verses invoking courage, loyalty, and liberation from worldly sorrow.'
    },
    {
      id: 'popular-3',
      title: 'Gayatri Mantra',
      artist: 'Vedic Chants',
      deity: 'Universal',
      category: 'Chants',
      coverUrl: getAudioArtwork('popular-3', 'Universal', 'Chants').url,
      audioUrl: 'https://cdn.freesound.org/previews/415/415490_5121236-lq.mp3',
      duration: 336, // 5:36
      isPremium: false,
      lyrics: 'Om Bhur Bhuva Swaha, Tat Savitur Varenyam, Bhargo Devasya Dhimahi, Dhiyo Yo Nah Prachodayat.',
      meaning: 'May the radiant divine light of the cosmos illuminate and awaken our inner intellect.'
    },
    {
      id: 'popular-4',
      title: 'Krishna Flute Meditation',
      artist: 'Soul Strings',
      deity: 'Krishna',
      category: 'Meditation',
      coverUrl: getAudioArtwork('popular-4', 'Krishna', 'Meditation').url,
      audioUrl: 'https://cdn.freesound.org/previews/560/560731_11861866-lq.mp3',
      duration: 920, // 15:20
      isPremium: false,
      lyrics: 'Meditative bamboo flute improvisations in Raga Yaman and Bhupali.',
      meaning: 'Brings peaceful stillness to active overthinking and awakens devotion in the spiritual heart.'
    },
    {
      id: 'popular-5',
      title: 'Mahamrityunjaya Mantra (108 Loops)',
      artist: 'Kailash Dhwani',
      deity: 'Shiva',
      category: 'Mantras',
      coverUrl: getAudioArtwork('popular-5', 'Shiva', 'Mantras').url,
      audioUrl: 'https://cdn.freesound.org/previews/415/415490_5121236-lq.mp3',
      duration: 600, // 10:00
      isPremium: true,
      lyrics: 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam...',
      meaning: 'The great healing mantra invoking spiritual rejuvenation and conquering the fear of mortality.'
    },
    {
      id: 'popular-6',
      title: 'Sankat Mochan Hanumanashtak',
      artist: 'Ayodhya Mandir Chants',
      deity: 'Hanuman',
      category: 'Chants',
      coverUrl: getAudioArtwork('popular-6', 'Hanuman', 'Chants').url,
      audioUrl: 'https://cdn.freesound.org/previews/415/415490_5121236-lq.mp3',
      duration: 390, // 6:30
      isPremium: false,
      lyrics: 'Bal Samay Ravi Bhakshi Liyo Tab, Teenahu Loka Bhayo Andhiyaro...',
      meaning: 'Eight verses celebrating how Hanuman dispels all suffering and distress.'
    },
    {
      id: 'popular-7',
      title: 'Nirvana Shatkam: I Am Shiva',
      artist: 'Adi Shankara Tradition',
      deity: 'Shiva',
      category: 'Meditation',
      coverUrl: getAudioArtwork('popular-7', 'Shiva', 'Meditation').url,
      audioUrl: 'https://cdn.freesound.org/previews/415/415490_5121236-lq.mp3',
      duration: 420, // 7:00
      isPremium: false,
      lyrics: 'Mano Buddhi Ahankara Chittani Naaham... Chidananda Roopah Shivoham Shivoham.',
      meaning: 'I am pure consciousness, formless bliss; I am Shiva.'
    },
    {
      id: 'popular-8',
      title: 'Achyutam Keshavam Rama Narayanam',
      artist: 'Sitar & Bamboo Flute',
      deity: 'Krishna',
      category: 'Bhajans',
      coverUrl: getAudioArtwork('popular-8', 'Krishna', 'Bhajans').url,
      audioUrl: 'https://cdn.freesound.org/previews/560/560731_11861866-lq.mp3',
      duration: 350,
      isPremium: false,
      lyrics: 'Achyutam Keshavam Krishna Damodaram, Rama Narayanam Janakivallabham...',
      meaning: 'Contemplation on the nectar-like holy names that dissolve worldly sorrow.'
    }
  ];

  // Merge seed tracks and popular tracks for a rich collection
  const allLibraryTracks: AudioTrack[] = [
    ...popularTrackList,
    ...SEED_AUDIO_TRACKS.filter(s => !popularTrackList.some(p => p.id === s.id))
  ];

  // Filtering
  const q = searchQuery.toLowerCase().trim();
  const displayedTracks = allLibraryTracks.filter(track => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Aarti' && track.category === 'Aartis') ||
      (selectedCategory === 'Instrumental' && (track.category === 'Meditation' || track.artist.toLowerCase().includes('flute') || track.artist.toLowerCase().includes('strings'))) ||
      track.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !q ||
      track.title.toLowerCase().includes(q) ||
      track.artist.toLowerCase().includes(q) ||
      track.deity.toLowerCase().includes(q) ||
      track.category.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const featuredTrack: AudioTrack = {
    id: 'audio-featured-tandav',
    title: 'Shiv Tandav Stotram',
    artist: 'Rudra Vedic Ensemble',
    deity: 'Shiva',
    category: 'Chants',
    coverUrl: getAudioArtwork('audio-featured-tandav', 'Shiva', 'Chants').url,
    audioUrl: 'https://cdn.freesound.org/previews/560/560731_11861866-lq.mp3',
    duration: 720, // 12 min
    isPremium: false,
    lyrics: 'Jatatavigalajjala pravahapavitasthale, Galeavalambya lambitam bhujangatungamalikam...\nDamad damad damad daman ninadavadamarvayam...',
    meaning: 'Powerful vibrations celebrating the supreme dance and infinite stillness of Mahadev.'
  };

  const currentPlayingTrack = playerState.currentTrack || featuredTrack;
  const isCurrentTrackSaved = user.savedAudioIds.includes(currentPlayingTrack.id);

  const handlePlayTrack = (track: AudioTrack) => {
    if (track.isPremium && user.subscriptionStatus !== 'premium') {
      setShowPaywall(true);
      return;
    }
    devotionalAudioEngine.playTrack(track, displayedTracks);
  };

  const handleDownload = (track: AudioTrack) => {
    if (user.subscriptionStatus !== 'premium') {
      setShowPaywall(true);
      return;
    }
    if (!downloadedTracks.includes(track.id)) {
      setDownloadedTracks([...downloadedTracks, track.id]);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div
      id="audio-screen"
      className="flex-1 w-full h-full bg-[#090909] text-[#F5F1E8] flex flex-col overflow-y-auto no-scrollbar pb-36 select-none"
    >
      {/* ================================================== */}
      {/* 1. TOP HEADER                                      */}
      {/* ================================================== */}
      <header className="px-5 pt-6 pb-2 bg-[#090909] sticky top-0 z-20">
        <div className="flex items-start justify-between">
          <div>
            {/* Small uppercase letter-spaced branding */}
            <span className="font-sans text-[11px] font-medium tracking-[0.25em] uppercase text-[#D2A653] block">
              ISHVARA
            </span>
            {/* Large serif heading */}
            <h1 className="font-serif text-3xl font-normal tracking-tight text-[#F5F1E8] mt-1 leading-none">
              Devotional Audio
            </h1>
            {/* Small muted subtitle */}
            <p className="text-xs text-[#9B9B9B] mt-1.5 font-sans tracking-normal">
              Sacred sounds for a calmer mind.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            {/* Simple Search Icon Button */}
            <button
              id="btn-audio-search-toggle"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-9 h-9 rounded-full bg-[#171717] border border-white/[0.08] flex items-center justify-center text-[#9B9B9B] hover:text-[#F5F1E8] hover:border-white/[0.18] transition-colors cursor-pointer"
              aria-label="Search audio library"
            >
              {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 432Hz Audio Setting Control Row */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-[11px] font-sans text-[#6F6F6F]">
            Sacred Harmonic Acoustics
          </div>

          {/* 432Hz button with subtle gold outline */}
          <button
            id="btn-frequency-setting"
            onClick={() => setShowTuningModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans text-[#E3BD72] border border-[#D2A653]/40 bg-[#171717]/80 hover:bg-[#D2A653]/10 hover:border-[#D2A653]/70 transition-colors cursor-pointer"
          >
            <Waves className="w-3.5 h-3.5 text-[#D2A653]" />
            <span className="font-medium text-xs tracking-tight">{activeFrequency}</span>
            <ChevronDown className="w-3 h-3 text-[#9B9B9B]" />
          </button>
        </div>

        {/* Search Bar Input (when toggled open) */}
        {isSearchOpen && (
          <div className="mt-3 relative">
            <Search className="w-4 h-4 text-[#6F6F6F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search chants, mantras, deities, artists..."
              className="w-full h-11 bg-[#171717] border border-white/[0.1] rounded-xl pl-10 pr-9 text-xs font-sans text-[#F5F1E8] placeholder-[#6F6F6F] focus:outline-none focus:border-white/[0.25] transition-colors"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6F6F] hover:text-[#F5F1E8]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* 2. CATEGORY NAVIGATION (Editorial Tab Row)        */}
        {/* ================================================== */}
        <div className="flex items-center gap-1 mt-4 overflow-x-auto no-scrollbar font-sans text-xs pb-1">
          {categories.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`audio-category-tab-${cat}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#D2A653] text-[#090909] font-medium'
                    : 'text-[#9B9B9B] hover:text-[#F5F1E8] bg-transparent'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="space-y-8 pt-2">
        {/* If filtering or searching, skip hero and show direct list */}
        {selectedCategory === 'All' && !searchQuery && (
          <>
            {/* ================================================== */}
            {/* 3. FEATURED AUDIO (Hero Card 16:9, rounded-[20px]) */}
            {/* ================================================== */}
            <section className="px-5">
              <div
                id="featured-audio-hero-card"
                onClick={() => handlePlayTrack(featuredTrack)}
                className="relative aspect-[16/9] w-full rounded-[20px] overflow-hidden group cursor-pointer border border-white/[0.08] shadow-2xl"
              >
                {/* Authentic cinematic photographic visual: Temple architecture + mountains + sunrise */}
                <SpiritualImage
                  src={featuredTrack.coverUrl}
                  fallbackSrc={featuredTrack.fallbackImageUrl}
                  alt={featuredTrack.title}
                  deity={featuredTrack.deity}
                  aspectRatio="16/9"
                  overlay="hero"
                  className="w-full h-full"
                  imgClassName="group-hover:scale-102 transition-transform duration-700 ease-out"
                />

                {/* Hero Content */}
                <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between">
                  {/* Top Eyebrow */}
                  <div>
                    <span className="font-sans text-[10px] uppercase font-semibold tracking-[0.2em] text-[#D2A653]">
                      FEATURED
                    </span>
                  </div>

                  {/* Bottom details & Large Gold Play Button */}
                  <div className="flex items-end justify-between">
                    <div className="space-y-1 max-w-[75%]">
                      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#F5F1E8] leading-tight group-hover:text-[#E3BD72] transition-colors">
                        {featuredTrack.title}
                      </h2>
                      <div className="w-8 h-[1px] bg-[#D2A653]/60 my-1.5" />
                      <p className="font-sans text-xs text-[#F5F1E8]/90 font-light">
                        {featuredTrack.artist}
                      </p>
                      <p className="font-sans text-[11px] text-[#9B9B9B] hidden sm:block">
                        Powerful vibrations for inner strength.
                      </p>

                      {/* Metadata row */}
                      <div className="flex items-center gap-3 pt-1 text-[11px] font-sans text-[#9B9B9B]">
                        <span>⏱ 12 min</span>
                        <span className="text-white/20">|</span>
                        <span>🛕 Shiva</span>
                        <span className="text-white/20">|</span>
                        <span className="text-[#D2A653]">✧ 432Hz</span>
                      </div>
                    </div>

                    {/* Large circular gold play button positioned lower-right */}
                    <button
                      id="btn-hero-play"
                      onClick={e => {
                        e.stopPropagation();
                        handlePlayTrack(featuredTrack);
                      }}
                      className="w-12 h-12 rounded-full bg-[#D2A653] text-[#090909] flex items-center justify-center flex-shrink-0 group-hover:scale-110 active:scale-95 transition-transform duration-150 shadow-lg cursor-pointer"
                      aria-label="Play Featured Audio"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ================================================== */}
            {/* 4. CONTINUE LISTENING (Horizontally scrollable)   */}
            {/* ================================================== */}
            <section>
              <div className="px-5 mb-3 flex items-baseline justify-between">
                <h2 className="font-serif text-xl font-normal tracking-tight text-[#F5F1E8]">
                  Continue Listening
                </h2>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="text-xs font-sans text-[#9B9B9B] hover:text-[#F5F1E8] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>See all</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-1">
                {continueListeningItems.map(item => {
                  const targetTrack = allLibraryTracks.find(t => t.id === item.trackId) || featuredTrack;
                  const isPlayingThis = playerState.currentTrack?.id === targetTrack.id && playerState.isPlaying;

                  return (
                    <div
                      key={item.id}
                      id={`continue-card-${item.id}`}
                      onClick={() => handlePlayTrack(targetTrack)}
                      className="w-[170px] sm:w-[195px] flex-shrink-0 bg-[#171717] rounded-2xl border border-white/[0.08] overflow-hidden group cursor-pointer flex flex-col"
                    >
                      {/* Large Media Image with Play Overlay and fallback */}
                      <SpiritualImage
                        src={item.image}
                        fallbackSrc={targetTrack.fallbackImageUrl}
                        alt={item.title}
                        deity={targetTrack.deity}
                        aspectRatio="custom"
                        overlay="subtle"
                        className="w-full aspect-[16/10] bg-[#111111]"
                        imgClassName="group-hover:scale-105 transition-transform duration-500"
                      >
                        {/* Small Play Button */}
                        <div className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover:scale-110 transition-transform">
                          {isPlayingThis ? (
                            <Pause className="w-3 h-3 fill-current text-[#D2A653]" />
                          ) : (
                            <Play className="w-3 h-3 fill-current ml-0.5 text-[#F5F1E8]" />
                          )}
                        </div>
                      </SpiritualImage>

                      {/* Card Information */}
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-serif text-sm text-[#F5F1E8] font-normal leading-snug truncate group-hover:text-[#D2A653] transition-colors">
                            {item.title}
                          </h3>
                          <p className="font-sans text-[11px] text-[#9B9B9B] mt-0.5 truncate">
                            {item.subtitle}
                          </p>
                        </div>

                        {/* Progress Bar & Timestamps */}
                        <div className="mt-3">
                          <span className="font-sans text-[10px] text-[#6F6F6F] block mb-1">
                            {item.currentTimeStr} / {item.durationStr}
                          </span>
                          <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#D2A653]"
                              style={{ width: `${item.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* ================================================== */}
        {/* 5. POPULAR TRACKS (Clean Music-Library List)       */}
        {/* ================================================== */}
        <section className="px-5">
          <div className="mb-3 flex items-baseline justify-between">
            <div>
              <h2 className="font-serif text-xl font-normal tracking-tight text-[#F5F1E8]">
                {selectedCategory === 'All' ? 'Popular Tracks' : `${selectedCategory} Tracks`}
              </h2>
              {searchQuery && (
                <p className="text-xs font-sans text-[#9B9B9B] mt-0.5">
                  Showing matches for "{searchQuery}"
                </p>
              )}
            </div>

            {selectedCategory === 'All' && !searchQuery && (
              <button
                onClick={() => setSelectedCategory('Mantras')}
                className="text-xs font-sans text-[#9B9B9B] hover:text-[#F5F1E8] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>See all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Clean Track Rows: No giant card borders around each item */}
          <div className="divide-y divide-white/[0.04]">
            {displayedTracks.map((track) => {
              const isCurrent = playerState.currentTrack?.id === track.id;
              const isPlayingThis = isCurrent && playerState.isPlaying;
              const isTrackSaved = user.savedAudioIds.includes(track.id);

              return (
                <div
                  key={track.id}
                  id={`track-row-${track.id}`}
                  onClick={() => handlePlayTrack(track)}
                  className="flex items-center justify-between py-2.5 px-1.5 -mx-1.5 rounded-xl hover:bg-[#141414] transition-colors cursor-pointer group"
                >
                  {/* Thumbnail & Title/Artist */}
                  <div className="flex items-center gap-3.5 min-w-0 pr-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#171717] border border-white/[0.06]">
                      <SpiritualImage
                        src={track.coverUrl}
                        fallbackSrc={track.fallbackImageUrl}
                        alt={track.title}
                        deity={track.deity}
                        aspectRatio="1/1"
                        className="w-full h-full"
                        imgClassName="group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Playing state visualizer indicator */}
                      {isPlayingThis && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                          <div className="flex items-end gap-0.5 h-3.5">
                            <span className="w-0.5 bg-[#D2A653] h-full animate-bounce" />
                            <span className="w-0.5 bg-[#D2A653] h-2/3 animate-bounce" style={{ animationDelay: '0.15s' }} />
                            <span className="w-0.5 bg-[#D2A653] h-4/5 animate-bounce" style={{ animationDelay: '0.3s' }} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4
                          className={`font-serif text-sm font-normal truncate leading-snug transition-colors ${
                            isCurrent ? 'text-[#D2A653]' : 'text-[#F5F1E8] group-hover:text-[#D2A653]'
                          }`}
                        >
                          {track.title}
                        </h4>
                        {track.isPremium && (
                          <span className="flex-shrink-0 text-[10px] font-sans text-[#D2A653] flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-[#D2A653]/10 border border-[#D2A653]/30">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Premium</span>
                          </span>
                        )}
                      </div>

                      <p className="font-sans text-xs text-[#9B9B9B] mt-0.5 truncate">
                        {track.artist} · <span className="text-[#6F6F6F]">{track.deity}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions: Duration, Heart, More */}
                  <div className="flex items-center gap-3.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <span className="text-xs font-sans text-[#9B9B9B]">
                      {formatSeconds(track.duration)}
                    </span>

                    {/* Favorite Heart Button */}
                    <button
                      id={`btn-favorite-${track.id}`}
                      onClick={() => toggleSaveAudio(track.id)}
                      className={`p-1.5 transition-colors cursor-pointer ${
                        isTrackSaved ? 'text-[#D2A653]' : 'text-[#6F6F6F] hover:text-[#F5F1E8]'
                      }`}
                      aria-label="Save to favorites"
                    >
                      <Heart className={`w-4 h-4 ${isTrackSaved ? 'fill-current' : ''}`} />
                    </button>

                    {/* More Details Button */}
                    <button
                      id={`btn-more-${track.id}`}
                      onClick={() => setSelectedTrackForMore(track)}
                      className="p-1.5 text-[#6F6F6F] hover:text-[#F5F1E8] transition-colors cursor-pointer"
                      aria-label="More options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {displayedTracks.length === 0 && (
              <div className="py-12 text-center text-xs font-sans text-[#9B9B9B]">
                <p>No audio tracks found in this category.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="text-[#D2A653] hover:underline mt-2 inline-block"
                >
                  View all tracks
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ================================================== */}
      {/* 6. PERSISTENT MINI PLAYER (Spotify/Apple Music)    */}
      {/* ================================================== */}
      {playerState.currentTrack && !playerState.isExpanded && (
        <div
          id="audio-mini-player"
          onClick={() => devotionalAudioEngine.setExpanded(true)}
          className="fixed bottom-[64px] inset-x-3 sm:inset-x-6 max-w-[408px] mx-auto bg-[#141414]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl px-3 py-2 flex items-center justify-between shadow-2xl z-30 cursor-pointer select-none group"
        >
          {/* Thumbnail & Title/Artist */}
          <div className="flex items-center gap-3 overflow-hidden min-w-0 mr-2">
            <SpiritualImage
              src={playerState.currentTrack.coverUrl}
              fallbackSrc={playerState.currentTrack.fallbackImageUrl}
              alt={playerState.currentTrack.title}
              deity={playerState.currentTrack.deity}
              aspectRatio="1/1"
              className="w-10 h-10 rounded-lg flex-shrink-0 bg-[#171717] border border-white/[0.06]"
            />
            <div className="min-w-0 truncate">
              <h4 className="font-serif text-xs text-[#F5F1E8] truncate group-hover:text-[#D2A653] transition-colors">
                {playerState.currentTrack.title}
              </h4>
              <p className="font-sans text-[11px] text-[#9B9B9B] truncate">
                {playerState.currentTrack.artist}
              </p>
            </div>
          </div>

          {/* Controls: Play/Pause, Queue */}
          <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
            <button
              id="btn-mini-play-pause"
              onClick={() => devotionalAudioEngine.togglePlayPause()}
              className="p-2 text-[#F5F1E8] hover:text-[#D2A653] transition-colors cursor-pointer"
              aria-label={playerState.isPlaying ? 'Pause' : 'Play'}
            >
              {playerState.isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              id="btn-mini-queue"
              onClick={() => devotionalAudioEngine.setExpanded(true)}
              className="p-2 text-[#6F6F6F] hover:text-[#F5F1E8] transition-colors cursor-pointer"
              aria-label="View Queue"
            >
              <ListMusic className="w-4 h-4" />
            </button>
          </div>

          {/* Thin Progress Indicator at the very bottom edge */}
          <div className="absolute bottom-0 inset-x-2 h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D2A653]"
              style={{
                width: `${(playerState.currentTime / (playerState.duration || 1)) * 100}%`
              }}
            />
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 7. FULL AUDIO PLAYER MODAL                         */}
      {/* ================================================== */}
      <AnimatePresence>
        {playerState.isExpanded && playerState.currentTrack && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            id="audio-full-player-modal"
            className="fixed inset-0 bg-[#090909] z-50 flex flex-col text-[#F5F1E8] overflow-y-auto no-scrollbar select-none"
          >
            {/* Blurred ambient backdrop */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <img
                src={playerState.currentTrack.coverUrl}
                alt="Ambient artwork"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover blur-3xl scale-150"
              />
              <div className="absolute inset-0 bg-black/70" />
            </div>

            {/* Top Bar */}
            <div className="relative z-10 px-5 pt-6 pb-2 flex items-center justify-between">
              <button
                id="btn-close-full-player"
                onClick={() => devotionalAudioEngine.setExpanded(false)}
                className="p-2 rounded-full text-[#9B9B9B] hover:text-[#F5F1E8] transition-colors cursor-pointer"
                aria-label="Minimize Player"
              >
                <ChevronDown className="w-5 h-5" />
              </button>

              <div className="text-center">
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#D2A653] font-medium block">
                  NOW PLAYING
                </span>
                <span className="font-sans text-xs text-[#9B9B9B]">
                  {playerState.currentTrack.category} · {activeFrequency}
                </span>
              </div>

              <button
                id="btn-full-lyrics-toggle"
                onClick={() => setShowLyricsModal(!showLyricsModal)}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  showLyricsModal ? 'text-[#D2A653]' : 'text-[#9B9B9B] hover:text-[#F5F1E8]'
                }`}
                aria-label="View Lyrics and Meaning"
              >
                <ListMusic className="w-5 h-5" />
              </button>
            </div>

            {/* Center Album Artwork (Clean square, rounded-2xl) */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-4">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden shadow-2xl border border-white/[0.1] bg-[#171717]">
                <SpiritualImage
                  src={playerState.currentTrack.coverUrl}
                  fallbackSrc={playerState.currentTrack.fallbackImageUrl}
                  alt={playerState.currentTrack.title}
                  deity={playerState.currentTrack.deity}
                  aspectRatio="1/1"
                  className="w-full h-full"
                />
              </div>

              {/* Sanskrit Mantra & Meaning Drawer (when toggled) */}
              {showLyricsModal && playerState.currentTrack.lyrics && (
                <div className="mt-4 p-4 rounded-xl bg-[#141414]/90 border border-white/[0.08] max-w-sm text-center">
                  <span className="text-[10px] font-sans text-[#D2A653] uppercase tracking-widest block">
                    Sacred Lyrics
                  </span>
                  <p className="font-serif text-sm text-[#F5F1E8] mt-1 whitespace-pre-line leading-relaxed">
                    {playerState.currentTrack.lyrics}
                  </p>
                  {playerState.currentTrack.meaning && (
                    <p className="font-sans text-xs text-[#9B9B9B] italic mt-2 leading-relaxed">
                      "{playerState.currentTrack.meaning}"
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Controls Area */}
            <div className="relative z-10 px-6 pb-10 pt-2 space-y-5">
              {/* Track Title, Artist, and Actions */}
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-4">
                  <h2 className="font-serif text-2xl font-normal text-[#F5F1E8] leading-tight truncate">
                    {playerState.currentTrack.title}
                  </h2>
                  <p className="font-sans text-xs text-[#9B9B9B] mt-1 truncate">
                    {playerState.currentTrack.artist} · {playerState.currentTrack.deity}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Download button */}
                  <button
                    onClick={() => handleDownload(playerState.currentTrack!)}
                    className="p-2 text-[#9B9B9B] hover:text-[#F5F1E8] transition-colors cursor-pointer"
                    aria-label="Download for offline"
                  >
                    {downloadedTracks.includes(playerState.currentTrack.id) ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                  </button>

                  {/* Favorite button */}
                  <button
                    onClick={() => toggleSaveAudio(playerState.currentTrack!.id)}
                    className={`p-2 transition-colors cursor-pointer ${
                      isCurrentTrackSaved ? 'text-[#D2A653]' : 'text-[#9B9B9B] hover:text-[#F5F1E8]'
                    }`}
                    aria-label="Favorite Track"
                  >
                    <Heart className={`w-5 h-5 ${isCurrentTrackSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Scrubber Seek Bar */}
              <div className="space-y-1.5">
                <input
                  id="full-audio-seek-slider"
                  type="range"
                  min={0}
                  max={playerState.duration || 1}
                  value={playerState.currentTime}
                  onChange={e => devotionalAudioEngine.seek(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#D2A653]"
                />
                <div className="flex items-center justify-between text-[11px] font-sans text-[#6F6F6F]">
                  <span>{formatSeconds(playerState.currentTime)}</span>
                  <span>{formatSeconds(playerState.duration || playerState.currentTrack.duration)}</span>
                </div>
              </div>

              {/* Main Playback Controls: Shuffle, Prev, Play/Pause, Next, Repeat */}
              <div className="flex items-center justify-between px-2 pt-1">
                <button
                  onClick={() => devotionalAudioEngine.toggleShuffle()}
                  className={`p-2 transition-colors cursor-pointer ${
                    playerState.isShuffled ? 'text-[#D2A653]' : 'text-[#6F6F6F] hover:text-[#F5F1E8]'
                  }`}
                  aria-label="Shuffle"
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                <button
                  onClick={() => devotionalAudioEngine.prevTrack()}
                  className="p-3 text-[#F5F1E8] hover:text-[#D2A653] transition-colors cursor-pointer"
                  aria-label="Previous Track"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                {/* Large circular gold button */}
                <button
                  id="btn-full-play-pause"
                  onClick={() => devotionalAudioEngine.togglePlayPause()}
                  className="w-16 h-16 rounded-full bg-[#D2A653] text-[#090909] flex items-center justify-center font-bold shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer"
                  aria-label={playerState.isPlaying ? 'Pause' : 'Play'}
                >
                  {playerState.isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-1" />
                  )}
                </button>

                <button
                  onClick={() => devotionalAudioEngine.nextTrack()}
                  className="p-3 text-[#F5F1E8] hover:text-[#D2A653] transition-colors cursor-pointer"
                  aria-label="Next Track"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <button
                  onClick={() => devotionalAudioEngine.toggleRepeat()}
                  className={`p-2 transition-colors cursor-pointer ${
                    playerState.repeatMode !== 'off' ? 'text-[#D2A653]' : 'text-[#6F6F6F] hover:text-[#F5F1E8]'
                  }`}
                  aria-label="Repeat"
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================== */}
      {/* 8. 432HZ FREQUENCY TUNING BOTTOM SHEET             */}
      {/* ================================================== */}
      <AnimatePresence>
        {showTuningModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTuningModal(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative w-full max-w-[430px] bg-[#141414] border-t border-white/[0.1] rounded-t-2xl p-5 text-[#F5F1E8] z-10 space-y-4"
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-2" />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-normal text-[#F5F1E8]">
                    Sacred Harmonic Tuning
                  </h3>
                  <p className="font-sans text-xs text-[#9B9B9B] mt-0.5">
                    Acoustic frequency settings for deep contemplation
                  </p>
                </div>
                <button
                  onClick={() => setShowTuningModal(false)}
                  className="p-1 text-[#6F6F6F] hover:text-[#F5F1E8]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tuning Options */}
              <div className="space-y-2 pt-1">
                {[
                  {
                    key: '432Hz' as TuningFrequency,
                    label: '432Hz Sacred Resonance',
                    desc: 'Deep meditative frequency aligned with natural cosmic vibrations (Recommended)'
                  },
                  {
                    key: '440Hz' as TuningFrequency,
                    label: '440Hz Standard Concert',
                    desc: 'Standard modern western pitch tuning'
                  },
                  {
                    key: 'Original' as TuningFrequency,
                    label: 'Original Master Recording',
                    desc: 'Unmodified acoustic studio master'
                  }
                ].map(opt => {
                  const isSelected = activeFrequency === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setActiveFrequency(opt.key);
                        setShowTuningModal(false);
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition-colors flex items-start justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#D2A653]/10 border-[#D2A653]/50 text-[#F5F1E8]'
                          : 'bg-[#171717] border-white/[0.06] text-[#9B9B9B] hover:text-[#F5F1E8]'
                      }`}
                    >
                      <div>
                        <span className={`font-sans text-xs font-medium block ${isSelected ? 'text-[#D2A653]' : 'text-[#F5F1E8]'}`}>
                          {opt.label}
                        </span>
                        <span className="font-sans text-[11px] text-[#6F6F6F] mt-0.5 block">
                          {opt.desc}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#D2A653] mt-0.5" />}
                    </button>
                  );
                })}
              </div>

              {/* Continuous Tanpura Drone Toggle */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <h4 className="font-sans text-xs font-medium text-[#F5F1E8]">
                    Continuous 432Hz Tanpura Drone
                  </h4>
                  <p className="font-sans text-[11px] text-[#6F6F6F]">
                    Synthesize background acoustic tanpura harmonics
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (playerState.isSyntheticDroneActive) {
                      devotionalAudioEngine.stopSyntheticDrone();
                    } else {
                      devotionalAudioEngine.startSyntheticMeditativeDrone();
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-colors cursor-pointer ${
                    playerState.isSyntheticDroneActive
                      ? 'bg-[#D2A653] text-[#090909]'
                      : 'bg-[#1E1E1E] text-[#9B9B9B] border border-white/[0.1] hover:text-white'
                  }`}
                >
                  {playerState.isSyntheticDroneActive ? 'Active' : 'Turn On'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================================================== */}
      {/* 9. TRACK "MORE" BOTTOM SHEET                       */}
      {/* ================================================== */}
      <AnimatePresence>
        {selectedTrackForMore && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrackForMore(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative w-full max-w-[430px] bg-[#141414] border-t border-white/[0.1] rounded-t-2xl p-5 text-[#F5F1E8] z-10 space-y-4"
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-2" />

              {/* Track Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
                <img
                  src={selectedTrackForMore.coverUrl}
                  alt={selectedTrackForMore.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover bg-[#171717]"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-sm font-normal text-[#F5F1E8] truncate">
                    {selectedTrackForMore.title}
                  </h3>
                  <p className="font-sans text-xs text-[#9B9B9B] mt-0.5 truncate">
                    {selectedTrackForMore.artist} · {selectedTrackForMore.deity}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTrackForMore(null)}
                  className="p-1 text-[#6F6F6F] hover:text-[#F5F1E8]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Actions List */}
              <div className="space-y-1 font-sans text-xs">
                <button
                  onClick={() => {
                    handlePlayTrack(selectedTrackForMore);
                    setSelectedTrackForMore(null);
                  }}
                  className="w-full py-2.5 px-3 rounded-lg hover:bg-white/[0.05] text-left text-[#F5F1E8] flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 text-[#D2A653]" />
                  <span>Play Track</span>
                </button>

                <button
                  onClick={() => {
                    toggleSaveAudio(selectedTrackForMore.id);
                    setSelectedTrackForMore(null);
                  }}
                  className="w-full py-2.5 px-3 rounded-lg hover:bg-white/[0.05] text-left text-[#F5F1E8] flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${user.savedAudioIds.includes(selectedTrackForMore.id) ? 'text-[#D2A653] fill-current' : 'text-[#9B9B9B]'}`} />
                  <span>{user.savedAudioIds.includes(selectedTrackForMore.id) ? 'Remove from Favorites' : 'Save to Favorites'}</span>
                </button>

                <button
                  onClick={() => {
                    handleDownload(selectedTrackForMore);
                    setSelectedTrackForMore(null);
                  }}
                  className="w-full py-2.5 px-3 rounded-lg hover:bg-white/[0.05] text-left text-[#F5F1E8] flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#9B9B9B]" />
                  <span>Download for Offline Listening</span>
                </button>

                <button
                  onClick={() => {
                    setShareModalItem({
                      shloka: {
                        id: `share-${selectedTrackForMore.id}`,
                        source: selectedTrackForMore.category,
                        chapterVerse: selectedTrackForMore.deity,
                        deity: selectedTrackForMore.deity,
                        sanskrit: selectedTrackForMore.lyrics?.split('\n')[0] || selectedTrackForMore.title,
                        transliteration: selectedTrackForMore.artist,
                        translation: selectedTrackForMore.meaning || `Sacred devotional chant dedicated to ${selectedTrackForMore.deity}`,
                        tags: ['Devotional Audio', selectedTrackForMore.deity]
                      }
                    });
                    setSelectedTrackForMore(null);
                  }}
                  className="w-full py-2.5 px-3 rounded-lg hover:bg-white/[0.05] text-left text-[#F5F1E8] flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[#9B9B9B]" />
                  <span>Share Sacred Audio</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
