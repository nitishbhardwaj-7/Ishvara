import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { VideoItem, Deity } from '../types';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronDown,
  Sparkles,
  BookOpen,
  MoreVertical,
  SlidersHorizontal,
  Flame,
  Music2,
  CheckCircle2,
  Info,
  Archive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { devotionalAudioEngine } from '../services/audioEngine';
import { SEED_AUDIO_TRACKS } from '../data/seedData';

export const ReelsFeed: React.FC = () => {
  const {
    rankedVideos,
    currentVideoIndex,
    setCurrentVideoIndex,
    isMuted,
    setIsMuted,
    toggleLikeVideo,
    toggleSaveVideo,
    user,
    setShareModalItem,
    setCommentModalVideo,
    setReportModalVideo,
    recordVideoWatch,
    setShowPaywall,
    setShowAskDivya,
    setShowZipModal,
    selectedDeityFilter,
    setSelectedDeityFilter
  } = useApp();

  const [feedMode, setFeedMode] = useState<'forYou' | 'following'>('forYou');
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showContextCard, setShowContextCard] = useState(false);
  const [showAlgoInfo, setShowAlgoInfo] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartY = useRef<number>(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const watchTimer = useRef<{ startTime: number; accumulatedSec: number }>({ startTime: Date.now(), accumulatedSec: 0 });

  // Filter videos by deity if selected
  const filteredVideos = rankedVideos.filter(v => {
    if (selectedDeityFilter === 'All') return true;
    return v.deity === selectedDeityFilter;
  });

  const currentVideo: VideoItem | undefined = filteredVideos[currentVideoIndex] || filteredVideos[0];

  // Reset progress and watch tracking on index change
  useEffect(() => {
    setProgress(0);
    setIsPlaying(true);
    setShowContextCard(false);
    setShowAlgoInfo(false);
    watchTimer.current = { startTime: Date.now(), accumulatedSec: 0 };

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted by browser until user interaction
      });
    }

    return () => {
      // Record watch time for previous video
      if (currentVideo) {
        const totalWatched = watchTimer.current.accumulatedSec + (Date.now() - watchTimer.current.startTime) / 1000;
        const isCompleted = totalWatched >= (currentVideo.duration * 0.85);
        recordVideoWatch(currentVideo.id, totalWatched, isCompleted);
      }
    };
  }, [currentVideoIndex, currentVideo?.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        goToNextVideo();
      } else if (e.key === 'ArrowUp') {
        goToPrevVideo();
      } else if (e.key === ' ' && !e.repeat) {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMuted(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVideoIndex, filteredVideos.length]);

  const goToNextVideo = () => {
    if (currentVideoIndex < filteredVideos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      // Loop back to top with exploration
      setCurrentVideoIndex(0);
    }
  };

  const goToPrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentVideo) {
      toggleLikeVideo(currentVideo.id);
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
    }
  };

  // Touch swipe handling for mobile feel
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true);
      if (videoRef.current) videoRef.current.pause();
    }, 450);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (isLongPressing) {
      setIsLongPressing(false);
      if (videoRef.current && isPlaying) videoRef.current.play().catch(() => {});
      return;
    }

    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY < -50) {
      goToNextVideo();
    } else if (deltaY > 50) {
      goToPrevVideo();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || currentVideo?.duration || 30);
    }
  };

  const handleVideoEnded = () => {
    // Auto loop or auto next depending on preference
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  if (!currentVideo) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-6 text-neutral-400">
        <p>No sacred videos found for this filter. Resetting view...</p>
      </div>
    );
  }

  const isLiked = user.likedVideoIds.includes(currentVideo.id);
  const isSaved = user.savedVideoIds.includes(currentVideo.id);

  return (
    <div
      id="reels-feed-container"
      className="flex-1 w-full h-full relative bg-black overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={() => {
        longPressTimer.current = setTimeout(() => {
          setIsLongPressing(true);
          if (videoRef.current) videoRef.current.pause();
        }, 450);
      }}
      onMouseUp={() => {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        if (isLongPressing) {
          setIsLongPressing(false);
          if (videoRef.current && isPlaying) videoRef.current.play().catch(() => {});
        }
      }}
    >
      {/* 9:16 Video Player Element */}
      <video
        ref={videoRef}
        id={`reel-video-${currentVideo.id}`}
        src={currentVideo.videoUrl}
        poster={currentVideo.thumbnailUrl}
        loop
        playsInline
        muted={isMuted}
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        onClick={togglePlayPause}
        onDoubleClick={handleDoubleTap}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Subtle Vignette Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/70 via-transparent to-black/90" />

      {/* Double-tap animated heart burst */}
      <AnimatePresence>
        {showHeartBurst && (
          <motion.div
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 1.4, opacity: 1, rotate: [0, -10, 10, 0] }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <div className="p-5 rounded-full bg-black/40 backdrop-blur-md border border-rose-500/40 shadow-2xl">
              <Heart className="w-20 h-20 fill-rose-500 text-rose-500 drop-shadow-[0_0_25px_rgba(244,63,94,0.9)]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause Center Indicator on pause */}
      {!isPlaying && !isLongPressing && (
        <div
          onClick={togglePlayPause}
          className="absolute inset-0 flex items-center justify-center pointer-events-auto cursor-pointer z-20"
        >
          <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#D6A85F] shadow-2xl transform hover:scale-105 transition">
            <Play className="w-8 h-8 ml-1 fill-current" />
          </div>
        </div>
      )}

      {/* Long-press Contemplation Mode notification */}
      {isLongPressing && (
        <div className="absolute top-16 inset-x-0 flex justify-center z-30 pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[11px] text-[#D6A85F] border border-[#D6A85F]/30 tracking-wider uppercase font-serif">
            Stillness Mode
          </span>
        </div>
      )}

      {/* Top Header Bar inside Reel (Hidden during long-press stillness) */}
      {!isLongPressing && (
        <div
          id="reels-top-bar"
          className="absolute top-2 inset-x-0 px-4 flex flex-col gap-2 z-20 pointer-events-auto"
        >
          <div className="flex items-center justify-between">
            {/* Deity Filter Quick Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-[70%]">
              {(['All', 'Shiva', 'Hanuman', 'Gita'] as const).map(deity => (
                <button
                  key={deity}
                  id={`filter-deity-${deity}`}
                  onClick={() => {
                    setSelectedDeityFilter(deity === 'Gita' ? 'Krishna' : deity);
                    setCurrentVideoIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer whitespace-nowrap ${
                    (selectedDeityFilter === deity || (deity === 'Gita' && selectedDeityFilter === 'Krishna'))
                      ? 'bg-[#D6A85F] text-black font-semibold shadow-sm'
                      : 'bg-black/50 backdrop-blur-md text-neutral-300 hover:text-white border border-white/10'
                  }`}
                >
                  {deity === 'Gita' ? 'Gita' : deity}
                </button>
              ))}
            </div>

            {/* Mute, ZIP Download & Recommendation explanation buttons */}
            <div className="flex items-center gap-1.5">
              <button
                id="btn-reel-zip-download"
                onClick={() => setShowZipModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/30 to-[#D6A85F]/30 backdrop-blur-md text-[#E8C280] hover:text-white border border-[#D6A85F]/40 text-[11px] font-semibold transition cursor-pointer shadow"
                title="Download complete project source ZIP"
              >
                <Archive className="w-3.5 h-3.5 text-[#D6A85F]" />
                <span className="hidden xs:inline">ZIP</span>
              </button>

              <button
                id="btn-reel-mute-toggle"
                onClick={() => setIsMuted(prev => !prev)}
                className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white/90 hover:text-white border border-white/10 transition cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#D6A85F]" />}
              </button>

              <button
                id="btn-reel-algo-info"
                onClick={() => setShowAlgoInfo(!showAlgoInfo)}
                className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white/90 hover:text-white border border-white/10 transition cursor-pointer"
                title="Recommendation Context"
              >
                <Info className="w-4 h-4 text-neutral-300" />
              </button>
            </div>
          </div>

          {/* Feed Tabs: Following / For You */}
          <div className="flex justify-center items-center gap-4 text-xs font-semibold">
            <button
              id="feed-tab-foryou"
              onClick={() => setFeedMode('forYou')}
              className={`pb-1 transition border-b-2 cursor-pointer ${
                feedMode === 'forYou' ? 'border-[#D6A85F] text-white' : 'border-transparent text-neutral-400'
              }`}
            >
              For You
            </button>
            <button
              id="feed-tab-following"
              onClick={() => setFeedMode('following')}
              className={`pb-1 transition border-b-2 cursor-pointer ${
                feedMode === 'following' ? 'border-[#D6A85F] text-white' : 'border-transparent text-neutral-400'
              }`}
            >
              Following
            </button>
          </div>
        </div>
      )}

      {/* Algorithmic Reason Popover */}
      <AnimatePresence>
        {showAlgoInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 right-4 w-72 p-3.5 rounded-2xl bg-[#141414]/95 backdrop-blur-xl border border-[#D6A85F]/30 text-xs shadow-2xl z-40 text-neutral-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
              <span className="font-serif font-semibold text-[#D6A85F] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Why You See This
              </span>
              <button onClick={() => setShowAlgoInfo(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              Curated based on your devotion to <strong className="text-[#E8C280]">{currentVideo.deity}</strong> and interest in <strong className="text-[#E8C280]">{currentVideo.topic}</strong>.
            </p>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Weighted Completion: 88%</span>
              <span className="text-[#D6A85F]">Score: 94.2</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right-side Action Floating Bar */}
      {!isLongPressing && (
        <div
          id="reels-action-bar"
          className="absolute right-3 bottom-24 flex flex-col items-center gap-4 z-20 pointer-events-auto"
        >
          {/* Creator Avatar with follow + badge */}
          <div className="relative group cursor-pointer">
            <img
              src={currentVideo.creator.avatar}
              alt={currentVideo.creator.name}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full object-cover border-2 border-[#D6A85F] shadow-lg"
            />
            <button
              id="btn-follow-creator"
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#D6A85F] text-black flex items-center justify-center font-bold text-xs shadow transition hover:scale-110"
              title="Follow Guru"
            >
              +
            </button>
          </div>

          {/* Like Button */}
          <button
            id="btn-reel-like"
            onClick={() => {
              toggleLikeVideo(currentVideo.id);
              if (!isLiked) {
                setShowHeartBurst(true);
                setTimeout(() => setShowHeartBurst(false), 900);
              }
            }}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className={`p-2.5 rounded-full bg-black/40 backdrop-blur-md border transition duration-200 ${isLiked ? 'border-rose-500/50 text-rose-500 scale-110' : 'border-white/10 text-white group-hover:text-rose-400'}`}>
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            </div>
            <span className="text-[11px] font-semibold text-white drop-shadow mt-1">
              {(currentVideo.stats.likes + (isLiked ? 1 : 0)).toLocaleString()}
            </span>
          </button>

          {/* Comments Button */}
          <button
            id="btn-reel-comments"
            onClick={() => setCommentModalVideo(currentVideo)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white group-hover:text-[#D6A85F] transition">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-white drop-shadow mt-1">
              {currentVideo.stats.comments.toLocaleString()}
            </span>
          </button>

          {/* Bookmark / Save Button */}
          <button
            id="btn-reel-save"
            onClick={() => toggleSaveVideo(currentVideo.id)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className={`p-2.5 rounded-full bg-black/40 backdrop-blur-md border transition duration-200 ${isSaved ? 'border-[#D6A85F] text-[#D6A85F] scale-110' : 'border-white/10 text-white group-hover:text-[#D6A85F]'}`}>
              <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-[#D6A85F]' : ''}`} />
            </div>
            <span className="text-[11px] font-semibold text-white drop-shadow mt-1">
              {(currentVideo.stats.saves + (isSaved ? 1 : 0)).toLocaleString()}
            </span>
          </button>

          {/* Share Quote Card Generator Button */}
          <button
            id="btn-reel-share-quote"
            onClick={() => setShareModalItem({ video: currentVideo })}
            className="flex flex-col items-center group cursor-pointer"
            title="Generate Shareable Quote Card"
          >
            <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white group-hover:text-amber-300 transition">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-white drop-shadow mt-1">
              Share
            </span>
          </button>

          {/* Ask Divya Context Shortcut */}
          <button
            id="btn-reel-ask-divya"
            onClick={() => setShowAskDivya(true)}
            className="flex flex-col items-center group cursor-pointer"
            title="Ask Divya about this wisdom"
          >
            <div className="p-2 rounded-full bg-gradient-to-tr from-amber-500/30 to-orange-500/30 border border-[#D6A85F]/50 text-[#D6A85F] animate-pulse">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-[#D6A85F] mt-1">
              Ask AI
            </span>
          </button>

          {/* Report & Options Menu */}
          <button
            id="btn-reel-options"
            onClick={() => setReportModalVideo(currentVideo)}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            title="Report or options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Info Overlay: Scripture Context, Title & Shloka Drawer Toggle */}
      {!isLongPressing && (
        <div
          id="reels-bottom-info"
          className="absolute bottom-5 inset-x-0 px-4 pr-16 z-20 pointer-events-auto flex flex-col gap-2"
        >
          {/* Sacred Source Badge (e.g. Bhagavad Gita 2.47) */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowContextCard(!showContextCard)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1A1813]/90 backdrop-blur-md border border-[#D6A85F]/40 text-[#E8C280] text-[11px] font-semibold shadow-md transition hover:bg-[#D6A85F]/20 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#D6A85F]" />
              <span>{currentVideo.sourceContext}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showContextCard ? 'rotate-180' : ''}`} />
            </button>

            {currentVideo.isPremium && (
              <span
                onClick={() => setShowPaywall(true)}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-pointer"
              >
                Sadhana Deep Dive
              </span>
            )}
          </div>

          {/* Video Title & Short Context */}
          <div>
            <h2 className="text-white text-base font-bold drop-shadow tracking-tight line-clamp-2">
              {currentVideo.title}
            </h2>
            <p className="text-neutral-300 text-xs mt-1 line-clamp-2 drop-shadow leading-relaxed">
              {currentVideo.shortDescription}
            </p>
          </div>

          {/* Sound / Music track tag */}
          <div
            onClick={() => {
              // Play complementary track in devotional audio engine
              const track = SEED_AUDIO_TRACKS.find(t => t.deity === currentVideo.deity) || SEED_AUDIO_TRACKS[0];
              devotionalAudioEngine.playTrack(track);
            }}
            className="flex items-center gap-2 text-[11px] text-neutral-300 cursor-pointer group hover:text-[#D6A85F] transition"
          >
            <Music2 className="w-3.5 h-3.5 text-[#D6A85F] animate-spin group-hover:text-amber-300" style={{ animationDuration: '6s' }} />
            <span className="truncate max-w-[200px]">Original Sacred Chant • {currentVideo.deity} Stotram</span>
          </div>
        </div>
      )}

      {/* Expandable Scripture & Practical Takeaway Modal Drawer */}
      <AnimatePresence>
        {showContextCard && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute inset-x-0 bottom-0 max-h-[75%] bg-[#0e0e0e]/95 backdrop-blur-2xl border-t border-[#D6A85F]/30 rounded-t-3xl p-5 z-40 overflow-y-auto text-neutral-100 shadow-2xl"
          >
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[11px] font-serif text-[#D6A85F] uppercase tracking-wider">Sacred Scripture Root</span>
                <h3 className="text-lg font-serif font-bold text-[#F2EDE4]">{currentVideo.sourceContext}</h3>
              </div>
              <button
                onClick={() => setShowContextCard(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Sanskrit Shloka */}
            {currentVideo.quoteSanskrit && (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                <p className="font-serif text-base text-[#F4D99B] leading-relaxed font-semibold">
                  {currentVideo.quoteSanskrit}
                </p>
                {currentVideo.quoteTranslation && (
                  <p className="text-xs text-neutral-300 mt-2 italic">
                    "{currentVideo.quoteTranslation}"
                  </p>
                )}
              </div>
            )}

            {/* Practical Application for Modern Life */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D6A85F]" /> Modern Living Application
              </h4>
              <p className="text-xs text-neutral-200 mt-1.5 leading-relaxed">
                Take this verse into your workday. Whether handling critical deadlines, family turbulence, or personal goals, channel your energy into wholehearted execution without anxious fixation on external validation.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  setShowContextCard(false);
                  setShareModalItem({ video: currentVideo });
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#D6A85F] text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Share2 className="w-4 h-4" /> Share Verse Card
              </button>
              <button
                onClick={() => {
                  setShowContextCard(false);
                  setShowAskDivya(true);
                }}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/20"
              >
                <Sparkles className="w-4 h-4 text-[#D6A85F]" /> Ask Divya
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Video Progress Scrubbing Line */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-30 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#D6A85F] to-amber-300 transition-all duration-100"
          style={{ width: `${(progress / (duration || 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};
