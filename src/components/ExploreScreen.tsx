import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Play,
  ArrowRight,
  ArrowUpRight,
  X,
  Music,
  BookOpen,
  Share2,
  Film
} from 'lucide-react';
import { SEED_VIDEOS, SEED_AUDIO_TRACKS, SEED_SHLOKAS } from '../data/seedData';
import { devotionalAudioEngine } from '../services/audioEngine';
import { Deity } from '../types';
import {
  getMediaUrl,
  getDeityMediaAsset,
  EXPLICIT_DEITY_IMAGE_MAPPING,
  EXPLORE_FEATURED_CONTENT_MAPPING
} from '../data/mediaConfig';
import { SpiritualImage } from './SpiritualImage';

type FilterTab = 'all' | 'videos' | 'audio' | 'shlokas' | 'deities' | 'topics';

export const ExploreScreen: React.FC = () => {
  const {
    setCurrentVideoIndex,
    setActiveTab,
    setSelectedDeityFilter,
    setShareModalItem,
    setShowAskDivya
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [activeDeity, setActiveDeity] = useState<Deity | 'All'>('All');

  // Curated editorial continue exploring items with authentic, cinematic photography
  const continueExploringItems = EXPLORE_FEATURED_CONTENT_MAPPING;

  // Deity tiles with restrained typography and authentic visual textures
  const deityTiles = [
    {
      name: 'Shiva' as Deity,
      traits: 'Peace · Detachment',
      image: EXPLICIT_DEITY_IMAGE_MAPPING.shiva.deity,
      fallbackImage: EXPLICIT_DEITY_IMAGE_MAPPING.shiva.fallback,
      focalPoint: EXPLICIT_DEITY_IMAGE_MAPPING.shiva.focalPoint,
      scripture: 'Shiva Purana'
    },
    {
      name: 'Krishna' as Deity,
      traits: 'Wisdom · Dharma',
      image: EXPLICIT_DEITY_IMAGE_MAPPING.krishna.deity,
      fallbackImage: EXPLICIT_DEITY_IMAGE_MAPPING.krishna.fallback,
      focalPoint: EXPLICIT_DEITY_IMAGE_MAPPING.krishna.focalPoint,
      scripture: 'Bhagavad Gita'
    },
    {
      name: 'Hanuman' as Deity,
      traits: 'Strength · Devotion',
      image: EXPLICIT_DEITY_IMAGE_MAPPING.hanuman.deity,
      fallbackImage: EXPLICIT_DEITY_IMAGE_MAPPING.hanuman.fallback,
      focalPoint: EXPLICIT_DEITY_IMAGE_MAPPING.hanuman.focalPoint,
      scripture: 'Ramayana'
    }
  ];

  // Editorial topics matching exact prompt list
  const editorialTopics = [
    { name: 'Anxiety', count: '14 verses' },
    { name: 'Discipline', count: '18 verses' },
    { name: 'Relationships', count: '9 verses' },
    { name: 'Purpose', count: '22 verses' },
    { name: 'Meditation', count: '16 chants' },
    { name: 'Anger', count: '11 verses' },
    { name: 'Success', count: '15 verses' },
    { name: 'Letting Go', count: '13 verses' }
  ];

  // Filter queries
  const q = searchQuery.toLowerCase().trim();
  const isFiltering = q.length > 0 || activeFilter !== 'all';

  const filteredVideos = SEED_VIDEOS.filter(v => {
    const matchesDeity = activeDeity === 'All' || v.deity === activeDeity;
    const matchesSearch =
      !q ||
      v.title.toLowerCase().includes(q) ||
      v.topic.toLowerCase().includes(q) ||
      v.shortDescription.toLowerCase().includes(q) ||
      v.sourceContext.toLowerCase().includes(q);
    return matchesDeity && matchesSearch;
  });

  const filteredAudio = SEED_AUDIO_TRACKS.filter(a => {
    const matchesDeity = activeDeity === 'All' || a.deity === activeDeity;
    const matchesSearch =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.artist.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q);
    return matchesDeity && matchesSearch;
  });

  const filteredShlokas = SEED_SHLOKAS.filter(s => {
    const matchesDeity = activeDeity === 'All' || s.deity === activeDeity;
    const matchesSearch =
      !q ||
      s.translation.toLowerCase().includes(q) ||
      s.sanskrit.toLowerCase().includes(q) ||
      s.chapterVerse.toLowerCase().includes(q) ||
      s.source.toLowerCase().includes(q);
    return matchesDeity && matchesSearch;
  });

  const handleOpenVideo = (videoIndex: number) => {
    setCurrentVideoIndex(videoIndex);
    setActiveTab('home');
  };

  const handleSelectDeity = (deity: Deity) => {
    setActiveDeity(deity);
    setSelectedDeityFilter(deity);
    setActiveFilter('all');
  };

  const handleSelectTopic = (topicName: string) => {
    setSearchQuery(topicName);
    setActiveFilter('all');
  };

  return (
    <div
      id="explore-screen"
      className="flex-1 w-full h-full bg-[#090909] text-[#F5F1E8] flex flex-col overflow-y-auto no-scrollbar pb-24 select-none"
    >
      {/* ================================================== */}
      {/* 1. EXPLORE HEADER                                  */}
      {/* ================================================== */}
      <header className="px-5 pt-7 pb-5 bg-[#090909]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl font-normal tracking-tight text-[#F5F1E8] leading-none">
              Explore
            </h1>
            <p className="text-xs text-[#9B9B9B] mt-2 font-sans tracking-normal">
              Timeless wisdom for modern life.
            </p>
          </div>

          {/* Understated Search with AI action */}
          <button
            id="btn-explore-ai-search"
            onClick={() => setShowAskDivya(true)}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-sans text-[#9B9B9B] hover:text-[#F5F1E8] border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-150 cursor-pointer"
          >
            <span className="text-[#C99A4A] text-xs leading-none">✦</span>
            <span>Search with AI</span>
          </button>
        </div>

        {/* ================================================== */}
        {/* 2. SEARCH FIELD (52px, subtle surface, thin border) */}
        {/* ================================================== */}
        <div className="mt-5 relative">
          <Search className="w-4 h-4 text-[#6F6F6F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="explore-search-input"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search verses, mantras, deities or life questions"
            className="w-full h-[52px] bg-[#171717] border border-white/[0.08] rounded-xl pl-11 pr-10 text-xs font-sans text-[#F5F1E8] placeholder-[#6F6F6F] focus:outline-none focus:border-white/[0.2] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#6F6F6F] hover:text-[#F5F1E8] transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* ================================================== */}
        {/* 3. CONTENT FILTERS (Restrained row, text-based)    */}
        {/* ================================================== */}
        <div className="flex items-center gap-1.5 mt-5 overflow-x-auto no-scrollbar font-sans text-xs">
          {(['all', 'videos', 'audio', 'shlokas', 'deities', 'topics'] as const).map(tab => {
            const isActive = activeFilter === tab;
            const labelMap: Record<FilterTab, string> = {
              all: 'All',
              videos: 'Videos',
              audio: 'Audio',
              shlokas: 'Shlokas',
              deities: 'Deities',
              topics: 'Topics'
            };

            return (
              <button
                key={tab}
                id={`explore-filter-${tab}`}
                onClick={() => setActiveFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1E1E1E] text-[#F5F1E8] font-medium border border-white/[0.12]'
                    : 'text-[#9B9B9B] hover:text-[#F5F1E8] bg-transparent'
                }`}
              >
                {labelMap[tab]}
              </button>
            );
          })}
        </div>
      </header>

      {/* ================================================== */}
      {/* FILTERED OR SEARCH RESULTS VIEW                    */}
      {/* ================================================== */}
      {isFiltering ? (
        <div className="px-5 pt-4 pb-8 space-y-8">
          {/* Status bar */}
          <div className="flex items-center justify-between text-xs text-[#9B9B9B] border-b border-white/[0.06] pb-3 font-sans">
            <span>
              {q ? `Results for "${q}"` : `Showing ${activeFilter}`}
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
                setActiveDeity('All');
              }}
              className="text-[#C99A4A] hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Filtered Videos */}
          {(activeFilter === 'all' || activeFilter === 'videos') && filteredVideos.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="font-serif text-lg font-normal text-[#F5F1E8]">Videos</h3>
                <span className="text-[11px] text-[#6F6F6F] font-sans">{filteredVideos.length} items</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {filteredVideos.map((video, idx) => (
                  <div
                    key={video.id}
                    onClick={() => handleOpenVideo(idx)}
                    className="group cursor-pointer space-y-2"
                  >
                    <SpiritualImage
                      src={video.thumbnailUrl}
                      fallbackSrc={video.fallbackImageUrl}
                      alt={video.title}
                      aspectRatio="4/5"
                      deity={video.deity}
                      overlay="subtle"
                      className="rounded-2xl border border-white/[0.06] bg-[#171717]"
                      imgClassName="group-hover:scale-105 transition-transform duration-500"
                    >
                      <div className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                        <Play className="w-3 h-3 fill-current ml-0.5 text-[#F5F1E8]" />
                      </div>
                    </SpiritualImage>
                    <div>
                      <h4 className="text-xs font-sans text-[#F5F1E8] font-normal leading-snug line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-[11px] font-sans text-[#9B9B9B] mt-0.5">
                        {video.deity} · {Math.round(video.duration / 60) || 1} min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filtered Audio */}
          {(activeFilter === 'all' || activeFilter === 'audio') && filteredAudio.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="font-serif text-lg font-normal text-[#F5F1E8]">Audio & Chants</h3>
                <span className="text-[11px] text-[#6F6F6F] font-sans">{filteredAudio.length} tracks</span>
              </div>

              <div className="space-y-2">
                {filteredAudio.map(track => (
                  <div
                    key={track.id}
                    onClick={() => devotionalAudioEngine.playTrack(track, filteredAudio)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#171717] border border-transparent hover:border-white/[0.06] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <SpiritualImage
                        src={track.coverUrl}
                        fallbackSrc={track.fallbackImageUrl}
                        alt={track.title}
                        aspectRatio="1/1"
                        deity={track.deity}
                        className="w-11 h-11 rounded-lg bg-[#171717] border border-white/5 flex-shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-sans text-[#F5F1E8] group-hover:text-[#C99A4A] transition-colors">
                          {track.title}
                        </h4>
                        <p className="text-[11px] font-sans text-[#9B9B9B] mt-0.5">
                          {track.artist} · {track.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-sans text-[#6F6F6F]">
                        {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-[#1F1F1F] text-[#F5F1E8] group-hover:bg-[#C99A4A] group-hover:text-black transition-colors flex items-center justify-center">
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filtered Shlokas */}
          {(activeFilter === 'all' || activeFilter === 'shlokas') && filteredShlokas.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="font-serif text-lg font-normal text-[#F5F1E8]">Sacred Verses</h3>
                <span className="text-[11px] text-[#6F6F6F] font-sans">{filteredShlokas.length} verses</span>
              </div>

              <div className="space-y-4">
                {filteredShlokas.map(shloka => (
                  <div
                    key={shloka.id}
                    className="p-4 rounded-2xl bg-[#111111] border border-white/[0.06] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-sans text-[#C99A4A] tracking-wider uppercase">
                        {shloka.source} {shloka.chapterVerse}
                      </span>
                      <button
                        onClick={() => setShareModalItem({ shloka })}
                        className="text-[11px] font-sans text-[#9B9B9B] hover:text-[#F5F1E8] flex items-center gap-1 transition-colors"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Share</span>
                      </button>
                    </div>
                    <p className="font-serif text-sm text-[#F5F1E8] leading-relaxed">
                      {shloka.sanskrit}
                    </p>
                    <p className="text-xs font-sans text-[#9B9B9B] italic leading-relaxed">
                      "{shloka.translation}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filtered Deities view */}
          {activeFilter === 'deities' && (
            <div className="space-y-3">
              {deityTiles.map(deity => (
                <div
                  key={deity.name}
                  onClick={() => handleSelectDeity(deity.name)}
                  className="relative h-32 rounded-2xl overflow-hidden cursor-pointer group border border-white/[0.06]"
                >
                  <SpiritualImage
                    src={deity.image}
                    fallbackSrc={deity.fallbackImage}
                    alt={deity.name}
                    deity={deity.name}
                    focalPoint={deity.focalPoint}
                    overlay="card"
                    className="absolute inset-0 w-full h-full"
                    imgClassName="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
                    <div>
                      <h3 className="font-serif text-xl text-[#F5F1E8] font-normal leading-tight">
                        {deity.name}
                      </h3>
                      <p className="text-xs font-sans text-[#9B9B9B] mt-0.5">
                        {deity.traits} · {deity.scripture}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#9B9B9B] group-hover:text-[#C99A4A] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Filtered Topics view */}
          {activeFilter === 'topics' && (
            <div className="grid grid-cols-2 gap-2.5">
              {editorialTopics.map(topic => (
                <button
                  key={topic.name}
                  onClick={() => handleSelectTopic(topic.name)}
                  className="p-4 rounded-xl bg-[#111111] hover:bg-[#171717] border border-white/[0.06] text-left transition-colors cursor-pointer group"
                >
                  <span className="font-sans text-xs text-[#F5F1E8] group-hover:text-[#C99A4A] transition-colors block">
                    {topic.name}
                  </span>
                  <span className="font-sans text-[11px] text-[#6F6F6F] mt-1 block">
                    {topic.count}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* No results fallback */}
          {filteredVideos.length === 0 &&
            filteredAudio.length === 0 &&
            filteredShlokas.length === 0 && (
              <div className="py-12 text-center text-xs font-sans text-[#9B9B9B] space-y-2">
                <p>No results found for "{searchQuery}".</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#C99A4A] hover:underline"
                >
                  Clear search and explore all
                </button>
              </div>
            )}
        </div>
      ) : (
        /* ================================================== */
        /* DEFAULT EDITORIAL DISCOVERY LAYOUT                 */
        /* 4. Continue Exploring                              */
        /* 5. Browse by Deity                                 */
        /* 6. Popular Topics                                  */
        /* 7. Shloka of the Day                               */
        /* ================================================== */
        <div className="space-y-9 pt-2">
          {/* ================================================ */}
          {/* 4. CONTINUE EXPLORING (Horizontal scrollable)     */}
          {/* ================================================ */}
          <section>
            <div className="px-5 mb-3.5 flex items-baseline justify-between">
              <h2 className="font-serif text-xl font-normal tracking-tight text-[#F5F1E8]">
                Continue Exploring
              </h2>
              <button
                onClick={() => setActiveFilter('videos')}
                className="text-xs font-sans text-[#9B9B9B] hover:text-[#F5F1E8] transition-colors cursor-pointer"
              >
                See all
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2">
              {continueExploringItems.map(item => (
                <div
                  key={item.id}
                  id={`continue-exploring-card-${item.id}`}
                  onClick={() => handleOpenVideo(item.videoIndex)}
                  className="flex-shrink-0 w-[180px] sm:w-[210px] group cursor-pointer space-y-2.5"
                >
                  {/* Visual thumbnail with natural photography and fallback */}
                  <SpiritualImage
                    src={item.image}
                    fallbackSrc={item.fallbackImage}
                    alt={item.title}
                    aspectRatio="4/5"
                    deity={item.deity}
                    focalPoint={item.focalPoint}
                    overlay="subtle"
                    className="w-full rounded-2xl bg-[#171717] border border-white/[0.06]"
                    imgClassName="group-hover:scale-105 transition-transform duration-500 ease-out"
                  >
                    {/* Small restrained play icon */}
                    <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover:scale-110 transition-transform">
                      <Play className="w-3 h-3 fill-current ml-0.5 text-[#F5F1E8]" />
                    </div>
                  </SpiritualImage>

                  {/* Title & Metadata naturally below thumbnail */}
                  <div className="px-0.5">
                    <h3 className="font-sans text-xs font-medium text-[#F5F1E8] line-clamp-2 leading-snug group-hover:text-[#C99A4A] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-sans text-[#9B9B9B] mt-1">
                      {item.subtitle} · {item.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ================================================ */}
          {/* 5. BROWSE BY DEITY (Horizontal row of 3 tiles)    */}
          {/* ================================================ */}
          <section className="px-5">
            <div className="mb-3.5 flex items-baseline justify-between">
              <h2 className="font-serif text-xl font-normal tracking-tight text-[#F5F1E8]">
                Browse by Deity
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {deityTiles.map(deity => (
                <div
                  key={deity.name}
                  id={`browse-deity-tile-${deity.name}`}
                  onClick={() => handleSelectDeity(deity.name)}
                  className="relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer group border border-white/[0.06] p-3 flex flex-col justify-end"
                >
                  {/* Authentic photographic backdrop with fallback */}
                  <SpiritualImage
                    src={deity.image}
                    fallbackSrc={deity.fallbackImage}
                    alt={deity.name}
                    deity={deity.name}
                    focalPoint={deity.focalPoint}
                    overlay="card"
                    className="absolute inset-0 w-full h-full"
                    imgClassName="group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Typography as primary UI element */}
                  <div className="relative z-10">
                    <h3 className="font-serif text-sm font-normal text-[#F5F1E8] tracking-normal leading-tight group-hover:text-[#E2B968] transition-colors">
                      {deity.name}
                    </h3>
                    <p className="text-[10px] font-sans text-[#9B9B9B] mt-0.5 leading-tight">
                      {deity.traits}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ================================================ */}
          {/* 6. POPULAR TOPICS (Editorial, clean 2-column)     */}
          {/* ================================================ */}
          <section className="px-5">
            <div className="mb-3.5 flex items-baseline justify-between">
              <h2 className="font-serif text-xl font-normal tracking-tight text-[#F5F1E8]">
                Popular Topics
              </h2>
              <button
                onClick={() => setActiveFilter('topics')}
                className="text-xs font-sans text-[#9B9B9B] hover:text-[#F5F1E8] transition-colors cursor-pointer"
              >
                See all
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {editorialTopics.map(topic => (
                <button
                  key={topic.name}
                  id={`topic-item-${topic.name}`}
                  onClick={() => handleSelectTopic(topic.name)}
                  className="flex items-center justify-between py-2.5 border-b border-white/[0.06] hover:border-white/[0.16] text-left transition-colors cursor-pointer group"
                >
                  <span className="font-sans text-xs text-[#F5F1E8] group-hover:text-[#C99A4A] transition-colors">
                    {topic.name}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#6F6F6F] group-hover:text-[#C99A4A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </section>

          {/* ================================================ */}
          {/* 7. SHLOKA OF THE DAY (Cinematic highlight banner) */}
          {/* ================================================ */}
          <section className="px-5">
            <div
              id="shloka-of-the-day-banner"
              onClick={() => {
                setShareModalItem({
                  shloka: {
                    id: 'shloka-today-gita-247',
                    source: 'Bhagavad Gita',
                    chapterVerse: '2.47',
                    deity: 'Krishna',
                    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।',
                    transliteration: 'Karmanyeva adhikaraste ma phaleshu kadachana.',
                    translation: 'You have control over your actions, not over the results.',
                    context: 'Counsel from Lord Krishna to Arjuna before the battle.',
                    practicalApplication: 'Pour your full heart into sincere effort, releasing anxiety about outcomes.',
                    tags: ['Karma Yoga', 'Peace', 'Discipline']
                  }
                });
              }}
              className="relative rounded-2xl overflow-hidden cursor-pointer group border border-white/[0.08] p-5 sm:p-6"
            >
              {/* Cinematic mountain sunrise photographic backdrop */}
              <img
                src={getMediaUrl('universal_gayatri_dawn')}
                alt="Atmospheric mountain dawn"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
              {/* Subtle dark overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/55" />

              <div className="relative z-10 space-y-3">
                <span className="text-[11px] font-sans font-medium uppercase tracking-widest text-[#C99A4A]">
                  Shloka of the Day
                </span>

                {/* Original Sanskrit */}
                <h3 className="font-serif text-base sm:text-lg text-[#F5F1E8] font-normal leading-relaxed">
                  कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।
                </h3>

                {/* Transliteration */}
                <p className="font-sans text-xs text-[#9B9B9B] italic">
                  Karmanyeva adhikaraste ma phaleshu kadachana.
                </p>

                {/* English translation */}
                <p className="font-sans text-xs sm:text-sm text-[#F5F1E8] font-light leading-relaxed max-w-xs">
                  “You have control over your actions, not over the results.”
                </p>

                {/* Simple arrow CTA */}
                <div className="pt-2 flex items-center gap-1.5 text-xs font-sans text-[#C99A4A] group-hover:text-[#E2B968] transition-colors">
                  <span>Reflect & share</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
