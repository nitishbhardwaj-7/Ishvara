import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Repeat1, ChevronDown, ListMusic, Loader2 } from 'lucide-react';
import { devotionalAudioEngine, AudioPlayerState } from '../services/audioEngine';
import { SpiritualImage } from './SpiritualImage';

export const formatSeconds = (sec: number) => {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const useAudioPlayer = () => {
  const [state, setState] = useState<AudioPlayerState>(devotionalAudioEngine.getState());
  useEffect(() => devotionalAudioEngine.subscribe(setState), []);
  return state;
};

export const MiniPlayer: React.FC = () => {
  const player = useAudioPlayer();
  const track = player.currentTrack;
  if (!track || player.isExpanded) return null;

  return (
    <div
      onClick={() => devotionalAudioEngine.setExpanded(true)}
      className="relative mx-3 mb-2 bg-[#141414]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl px-3 py-2 flex items-center justify-between shadow-2xl z-30 cursor-pointer select-none"
    >
      <div className="flex items-center gap-3 min-w-0 mr-2">
        <SpiritualImage
          src={track.coverUrl}
          alt={track.title}
          deity={track.deity}
          aspectRatio="1/1"
          className="w-10 h-10 rounded-lg flex-shrink-0 bg-[#171717]"
        />
        <div className="min-w-0">
          <h4 className="font-serif text-xs text-[#F5F1E8] truncate">{track.title}</h4>
          <p className="text-[11px] text-[#9B9B9B] truncate">{player.error ?? track.artist}</p>
        </div>
      </div>
      <button
        onClick={e => {
          e.stopPropagation();
          devotionalAudioEngine.togglePlayPause();
        }}
        className="p-2 text-[#F5F1E8]"
        aria-label={player.isPlaying ? 'Pause' : 'Play'}
      >
        {player.isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : player.isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>
      <div className="absolute bottom-0 inset-x-2 h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
        <div className="h-full bg-[#D2A653]" style={{ width: `${(player.currentTime / (player.duration || 1)) * 100}%` }} />
      </div>
    </div>
  );
};

export const FullPlayer: React.FC = () => {
  const player = useAudioPlayer();
  const [showLyrics, setShowLyrics] = useState(false);
  const track = player.currentTrack;

  return (
    <AnimatePresence>
      {player.isExpanded && track && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 240 }}
          className="fixed inset-0 bg-[#090909] z-50 flex flex-col text-[#F5F1E8] overflow-y-auto no-scrollbar select-none safe-top safe-bottom"
        >
          {track.coverUrl && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <img src={track.coverUrl} alt="" className="w-full h-full object-cover blur-3xl scale-150" />
              <div className="absolute inset-0 bg-black/70" />
            </div>
          )}

          <div className="relative z-10 px-5 pt-4 pb-2 flex items-center justify-between">
            <button onClick={() => devotionalAudioEngine.setExpanded(false)} className="p-2 text-[#9B9B9B]" aria-label="Minimize">
              <ChevronDown className="w-5 h-5" />
            </button>
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D2A653] font-medium block">Now Playing</span>
              <span className="text-xs text-[#9B9B9B]">{track.category}</span>
            </div>
            <button
              onClick={() => setShowLyrics(s => !s)}
              disabled={!track.lyrics && !track.meaning}
              className={`p-2 disabled:opacity-30 ${showLyrics ? 'text-[#D2A653]' : 'text-[#9B9B9B]'}`}
              aria-label="Lyrics and meaning"
            >
              <ListMusic className="w-5 h-5" />
            </button>
          </div>

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-4">
            {showLyrics && (track.lyrics || track.meaning) ? (
              <div className="p-5 rounded-2xl bg-[#141414]/90 border border-white/[0.08] w-full max-w-sm text-center max-h-[50vh] overflow-y-auto">
                {track.lyrics && (
                  <p className="font-serif text-sm text-[#F5F1E8] whitespace-pre-line leading-relaxed">{track.lyrics}</p>
                )}
                {track.meaning && <p className="text-xs text-[#9B9B9B] italic mt-3 leading-relaxed">"{track.meaning}"</p>}
              </div>
            ) : (
              <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden shadow-2xl border border-white/[0.1] bg-[#171717]">
                <SpiritualImage src={track.coverUrl} alt={track.title} deity={track.deity} aspectRatio="1/1" className="w-full h-full" />
              </div>
            )}
          </div>

          <div className="relative z-10 px-6 pb-8 pt-2 space-y-5">
            <div>
              <h2 className="font-serif text-2xl text-[#F5F1E8] leading-tight truncate">{track.title}</h2>
              <p className="text-xs text-[#9B9B9B] mt-1 truncate">
                {track.artist} · {track.deity}
              </p>
              {player.error && <p className="text-xs text-rose-400 mt-2">{player.error}</p>}
            </div>

            <div className="space-y-1.5">
              <input
                type="range"
                min={0}
                max={player.duration || 1}
                step={0.5}
                value={player.currentTime}
                onChange={e => devotionalAudioEngine.seek(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#D2A653]"
                aria-label="Seek"
              />
              <div className="flex items-center justify-between text-[11px] text-[#6F6F6F]">
                <span>{formatSeconds(player.currentTime)}</span>
                <span>{formatSeconds(player.duration || track.duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <button
                onClick={() => devotionalAudioEngine.toggleShuffle()}
                className={`p-2 ${player.isShuffled ? 'text-[#D2A653]' : 'text-[#6F6F6F]'}`}
                aria-label="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button onClick={() => devotionalAudioEngine.prevTrack()} className="p-3" aria-label="Previous">
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={() => devotionalAudioEngine.togglePlayPause()}
                className="w-16 h-16 rounded-full bg-[#D2A653] text-[#090909] flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
                aria-label={player.isPlaying ? 'Pause' : 'Play'}
              >
                {player.isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : player.isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current ml-1" />
                )}
              </button>
              <button onClick={() => devotionalAudioEngine.nextTrack()} className="p-3" aria-label="Next">
                <SkipForward className="w-5 h-5" />
              </button>
              <button
                onClick={() => devotionalAudioEngine.toggleRepeat()}
                className={`p-2 ${player.repeatMode !== 'off' ? 'text-[#D2A653]' : 'text-[#6F6F6F]'}`}
                aria-label={`Repeat: ${player.repeatMode}`}
              >
                {player.repeatMode === 'track' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
