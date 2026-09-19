import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AudioTrack, SONG_CATEGORIES } from '../types';
import { devotionalAudioEngine } from '../services/audioEngine';
import { SpiritualImage } from './SpiritualImage';
import { formatSeconds, useAudioPlayer } from './AudioPlayer';
import { Play, Pause, Search, X, Loader2, RefreshCw } from 'lucide-react';

const CATEGORY_TABS = ['All', ...SONG_CATEGORIES] as const;

export const AudioScreen: React.FC = () => {
  const { songs, contentStatus, refreshContent } = useApp();
  const player = useAudioPlayer();
  const [category, setCategory] = useState<(typeof CATEGORY_TABS)[number]>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const q = searchQuery.toLowerCase().trim();
  const displayed = songs.filter(
    t =>
      (category === 'All' || t.category === category) &&
      (!q || [t.title, t.artist, t.deity, t.category].some(f => f.toLowerCase().includes(q))),
  );
  const featured = songs[0];
  const showFeatured = featured && category === 'All' && !q;

  const play = (track: AudioTrack, queue: AudioTrack[]) => {
    if (player.currentTrack?.id === track.id) devotionalAudioEngine.togglePlayPause();
    else devotionalAudioEngine.playTrack(track, queue);
  };

  return (
    <div className="flex-1 w-full h-full bg-[#090909] text-[#F5F1E8] flex flex-col overflow-y-auto no-scrollbar pb-6 select-none">
      <header className="px-5 pt-5 pb-2 bg-[#090909] sticky top-0 z-20 safe-top">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#D2A653] block">Ishvara</span>
            <h1 className="font-serif text-3xl tracking-tight mt-1 leading-none">Devotional Songs</h1>
            <p className="text-xs text-[#9B9B9B] mt-1.5">Sacred sounds for a calmer mind.</p>
          </div>
          <button
            onClick={() => {
              setIsSearchOpen(o => !o);
              setSearchQuery('');
            }}
            className="w-9 h-9 rounded-full bg-[#171717] border border-white/[0.08] flex items-center justify-center text-[#9B9B9B]"
            aria-label="Search songs"
          >
            {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>
        </div>

        {isSearchOpen && (
          <div className="mt-3 relative">
            <Search className="w-4 h-4 text-[#6F6F6F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search songs, mantras, deities…"
              className="w-full h-11 bg-[#171717] border border-white/[0.1] rounded-xl pl-10 pr-4 text-xs text-[#F5F1E8] placeholder-[#6F6F6F] focus:outline-none focus:border-white/[0.25]"
              autoFocus
            />
          </div>
        )}

        <div className="flex items-center gap-1 mt-4 overflow-x-auto no-scrollbar text-xs pb-1">
          {CATEGORY_TABS.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap ${
                category === cat ? 'bg-[#D2A653] text-[#090909] font-medium' : 'text-[#9B9B9B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {contentStatus === 'loading' && songs.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-[#D2A653] animate-spin" />
        </div>
      ) : songs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-20 gap-3">
          <p className="text-sm text-[#9B9B9B]">
            {contentStatus === 'error' ? 'Could not load songs. Check your connection.' : 'New songs are coming soon.'}
          </p>
          <button
            onClick={() => refreshContent()}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D2A653]/40 text-xs text-[#E3BD72]"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      ) : (
        <div className="space-y-7 pt-2">
          {showFeatured && (
            <section className="px-5">
              <div
                onClick={() => play(featured, songs)}
                className="relative aspect-[16/9] w-full rounded-[20px] overflow-hidden cursor-pointer border border-white/[0.08] shadow-2xl"
              >
                <SpiritualImage
                  src={featured.coverUrl}
                  alt={featured.title}
                  deity={featured.deity}
                  aspectRatio="16/9"
                  overlay="hero"
                  className="w-full h-full"
                />
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-semibold tracking-[0.2em] text-[#D2A653]">Latest</span>
                  <div className="flex items-end justify-between">
                    <div className="space-y-1 max-w-[75%]">
                      <h2 className="font-serif text-2xl leading-tight">{featured.title}</h2>
                      <p className="text-xs text-[#F5F1E8]/90">{featured.artist}</p>
                      <p className="text-[11px] text-[#9B9B9B]">
                        {formatSeconds(featured.duration)} · {featured.deity}
                      </p>
                    </div>
                    <span className="w-12 h-12 rounded-full bg-[#D2A653] text-[#090909] flex items-center justify-center shadow-lg">
                      {player.currentTrack?.id === featured.id && player.isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="px-5">
            <h2 className="font-serif text-xl tracking-tight mb-3">
              {q ? `Results for "${searchQuery}"` : category === 'All' ? 'All Songs' : category}
            </h2>
            <div className="divide-y divide-white/[0.04]">
              {displayed.map(track => {
                const isCurrent = player.currentTrack?.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => play(track, displayed)}
                    className="flex items-center justify-between py-2.5 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 pr-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#171717] border border-white/[0.06]">
                        <SpiritualImage src={track.coverUrl} alt={track.title} deity={track.deity} aspectRatio="1/1" className="w-full h-full" />
                        {isCurrent && player.isPlaying && (
                          <div className="absolute inset-0 bg-black/50 flex items-end justify-center gap-0.5 pb-4 z-10">
                            <span className="w-0.5 bg-[#D2A653] h-3.5 animate-bounce" />
                            <span className="w-0.5 bg-[#D2A653] h-2.5 animate-bounce" style={{ animationDelay: '0.15s' }} />
                            <span className="w-0.5 bg-[#D2A653] h-3 animate-bounce" style={{ animationDelay: '0.3s' }} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className={`font-serif text-sm truncate ${isCurrent ? 'text-[#D2A653]' : 'text-[#F5F1E8]'}`}>
                          {track.title}
                        </h4>
                        <p className="text-xs text-[#9B9B9B] mt-0.5 truncate">
                          {track.artist} · <span className="text-[#6F6F6F]">{track.deity}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[#9B9B9B] flex-shrink-0">{formatSeconds(track.duration)}</span>
                  </div>
                );
              })}
              {displayed.length === 0 && (
                <p className="py-12 text-center text-xs text-[#9B9B9B]">No songs match. Try another category.</p>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
