import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { VideoItem } from '../types';
import { Share2, Volume2, VolumeX, Play, ChevronDown, Sparkles, BookOpen, RefreshCw, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { devotionalAudioEngine } from '../services/audioEngine';
import { HlsVideo } from './HlsVideo';

const FILTERS = [
  { label: 'All', value: 'All' },
  { label: 'Shiva', value: 'Shiva' },
  { label: 'Hanuman', value: 'Hanuman' },
  { label: 'Gita', value: 'Krishna' },
] as const;

const isNew = (iso: string) => Date.now() - new Date(iso).getTime() < 36 * 60 * 60 * 1000;

export const ReelsFeed: React.FC = () => {
  const {
    videos,
    contentStatus,
    refreshContent,
    currentVideoIndex,
    setCurrentVideoIndex,
    isMuted,
    setIsMuted,
    setShareModalItem,
    setShowAskDivya,
    selectedDeityFilter,
    setSelectedDeityFilter,
  } = useApp();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const [showContextCard, setShowContextCard] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartY = useRef(0);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredVideos = videos.filter(v => selectedDeityFilter === 'All' || v.deity === selectedDeityFilter);
  const currentVideo: VideoItem | undefined = filteredVideos[currentVideoIndex] ?? filteredVideos[0];
  const nextVideo: VideoItem | undefined = filteredVideos[(currentVideoIndex + 1) % Math.max(filteredVideos.length, 1)];

  // Songs and reels shouldn't play over each other
  useEffect(() => {
    devotionalAudioEngine.pause();
  }, []);

  useEffect(() => {
    setProgress(0);
    setIsPlaying(true);
    setIsBuffering(true);
    setShowContextCard(false);
    videoRef.current?.play().catch(() => setIsPlaying(false));
  }, [currentVideo?.id]);

  // Pause when the app is backgrounded
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) videoRef.current?.pause();
      else if (isPlaying) videoRef.current?.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [isPlaying]);

  const goToNext = () => setCurrentVideoIndex(currentVideoIndex < filteredVideos.length - 1 ? currentVideoIndex + 1 : 0);
  const goToPrev = () => currentVideoIndex > 0 && setCurrentVideoIndex(currentVideoIndex - 1);

  const togglePlayPause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true);
      videoRef.current?.pause();
    }, 450);
  };

  const endLongPress = (): boolean => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (!isLongPressing) return false;
    setIsLongPressing(false);
    if (isPlaying) videoRef.current?.play().catch(() => {});
    return true;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    startLongPress();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (endLongPress()) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY < -50) goToNext();
    else if (deltaY > 50) goToPrev();
  };

  if (contentStatus === 'loading' && videos.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <Loader2 className="w-7 h-7 text-[#D6A85F] animate-spin" />
      </div>
    );
  }

  if (!currentVideo) {
    const offline = contentStatus === 'error';
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4 bg-black safe-top">
        <span className="font-serif text-4xl text-[#D6A85F]">ॐ</span>
        <p className="text-sm text-neutral-300 max-w-xs">
          {offline
            ? 'Could not load videos. Please check your internet connection.'
            : selectedDeityFilter !== 'All'
            ? `No ${selectedDeityFilter} videos yet.`
            : 'New videos are on their way. Please check back soon.'}
        </p>
        {selectedDeityFilter !== 'All' ? (
          <button onClick={() => setSelectedDeityFilter('All')} className="text-xs text-[#D6A85F] underline">
            Show all videos
          </button>
        ) : (
          <button
            onClick={() => refreshContent()}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D6A85F]/40 text-xs text-[#E8C280]"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try again
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="flex-1 w-full h-full relative bg-black overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={startLongPress}
      onMouseUp={endLongPress}
    >
      <HlsVideo
        key={currentVideo.id}
        ref={videoRef}
        src={currentVideo.videoUrl}
        poster={currentVideo.thumbnailUrl || undefined}
        loop
        playsInline
        muted={isMuted}
        autoPlay
        preload="auto"
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onTimeUpdate={e => {
          const v = e.currentTarget;
          setProgress(v.currentTime);
          setDuration(v.duration || currentVideo.duration || 0);
        }}
        onClick={togglePlayPause}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Warm the next reel's poster so swipes feel instant */}
      {nextVideo?.thumbnailUrl && <link rel="prefetch" href={nextVideo.thumbnailUrl} />}

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/90" />

      {isBuffering && isPlaying && !isLongPressing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <Loader2 className="w-8 h-8 text-white/70 animate-spin" />
        </div>
      )}

      {!isPlaying && !isLongPressing && (
        <button
          onClick={togglePlayPause}
          aria-label="Play"
          className="absolute inset-0 flex items-center justify-center z-20"
        >
          <span className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#D6A85F]">
            <Play className="w-8 h-8 ml-1 fill-current" />
          </span>
        </button>
      )}

      {isLongPressing && (
        <div className="absolute top-16 inset-x-0 flex justify-center z-30 pointer-events-none safe-top">
          <span className="px-3 py-1 rounded-full bg-black/80 text-[11px] text-[#D6A85F] border border-[#D6A85F]/30 tracking-wider uppercase font-serif">
            Stillness Mode
          </span>
        </div>
      )}

      {!isLongPressing && (
        <>
          {/* Top bar */}
          <div className="absolute top-0 inset-x-0 px-4 pt-3 safe-top flex items-center justify-between z-20">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => {
                    setSelectedDeityFilter(f.value);
                    setCurrentVideoIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${
                    selectedDeityFilter === f.value
                      ? 'bg-[#D6A85F] text-black font-semibold'
                      : 'bg-black/50 backdrop-blur-md text-neutral-300 border border-white/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsMuted(m => !m)}
              className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#D6A85F]" />}
            </button>
          </div>

          {/* Right action bar */}
          <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5 z-20">
            <button onClick={() => setShareModalItem({ video: currentVideo })} className="flex flex-col items-center">
              <span className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white">
                <Share2 className="w-6 h-6" />
              </span>
              <span className="text-[11px] font-semibold text-white drop-shadow mt-1">Share</span>
            </button>
            <button onClick={() => setShowAskDivya(true)} className="flex flex-col items-center">
              <span className="p-2 rounded-full bg-gradient-to-tr from-amber-500/30 to-orange-500/30 border border-[#D6A85F]/50 text-[#D6A85F]">
                <Sparkles className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-semibold text-[#D6A85F] mt-1">Ask AI</span>
            </button>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-5 inset-x-0 px-4 pr-20 z-20 flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {currentVideo.sourceContext && (
                <button
                  onClick={() => setShowContextCard(s => !s)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1A1813]/90 border border-[#D6A85F]/40 text-[#E8C280] text-[11px] font-semibold"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#D6A85F]" />
                  <span>{currentVideo.sourceContext}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showContextCard ? 'rotate-180' : ''}`} />
                </button>
              )}
              {isNew(currentVideo.publishedAt) && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D6A85F] text-black">TODAY</span>
              )}
            </div>
            <div>
              <h2 className="text-white text-base font-bold drop-shadow line-clamp-2">{currentVideo.title}</h2>
              {currentVideo.description && (
                <p className="text-neutral-300 text-xs mt-1 line-clamp-2 drop-shadow leading-relaxed">
                  {currentVideo.description}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Scripture drawer */}
      <AnimatePresence>
        {showContextCard && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute inset-x-0 bottom-0 max-h-[75%] bg-[#0e0e0e]/95 backdrop-blur-2xl border-t border-[#D6A85F]/30 rounded-t-3xl p-5 z-40 overflow-y-auto"
          >
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[11px] font-serif text-[#D6A85F] uppercase tracking-wider">Scripture</span>
                <h3 className="text-lg font-serif font-bold text-[#F2EDE4]">{currentVideo.sourceContext}</h3>
              </div>
              <button onClick={() => setShowContextCard(false)} className="p-1 text-neutral-400" aria-label="Close">
                ✕
              </button>
            </div>

            {currentVideo.quoteSanskrit && (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                <p className="font-serif text-base text-[#F4D99B] leading-relaxed font-semibold whitespace-pre-line">
                  {currentVideo.quoteSanskrit}
                </p>
                {currentVideo.quoteTranslation && (
                  <p className="text-xs text-neutral-300 mt-2 italic">"{currentVideo.quoteTranslation}"</p>
                )}
              </div>
            )}
            {currentVideo.description && (
              <p className="text-xs text-neutral-200 mt-4 leading-relaxed">{currentVideo.description}</p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  setShowContextCard(false);
                  setShareModalItem({ video: currentVideo });
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#D6A85F] text-black font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button
                onClick={() => {
                  setShowContextCard(false);
                  setShowAskDivya(true);
                }}
                className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/20"
              >
                <Sparkles className="w-4 h-4 text-[#D6A85F]" /> Ask Divya
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-30 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#D6A85F] to-amber-300"
          style={{ width: `${(progress / (duration || 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};
