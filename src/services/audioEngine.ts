import { AudioTrack } from '../types';

export interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  repeatMode: 'off' | 'track' | 'all';
  isShuffled: boolean;
  queue: AudioTrack[];
  isExpanded: boolean;
}

type AudioListener = (state: AudioPlayerState) => void;

class DevotionalAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private listeners: Set<AudioListener> = new Set();

  private state: AudioPlayerState = {
    currentTrack: null,
    isPlaying: false,
    isLoading: false,
    error: null,
    currentTime: 0,
    duration: 0,
    repeatMode: 'all',
    isShuffled: false,
    queue: [],
    isExpanded: false,
  };

  constructor() {
    if (typeof window === 'undefined') return;
    const audio = new Audio();
    audio.preload = 'auto';
    this.audio = audio;

    audio.addEventListener('timeupdate', () => {
      this.state.currentTime = audio.currentTime;
      this.state.duration = audio.duration || this.state.currentTrack?.duration || 0;
      this.notify();
    });
    audio.addEventListener('waiting', () => this.patch({ isLoading: true }));
    audio.addEventListener('playing', () => this.patch({ isLoading: false, isPlaying: true, error: null }));
    audio.addEventListener('pause', () => this.patch({ isPlaying: false }));
    audio.addEventListener('ended', () => this.handleTrackEnded());
    audio.addEventListener('error', () =>
      this.patch({ isLoading: false, isPlaying: false, error: 'Could not play this track. Check your connection.' }),
    );

    this.setupMediaSession();
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AudioPlayerState {
    return { ...this.state };
  }

  private patch(partial: Partial<AudioPlayerState>) {
    Object.assign(this.state, partial);
    this.notify();
  }

  private notify() {
    const snapshot = { ...this.state };
    this.listeners.forEach(l => l(snapshot));
  }

  public playTrack(track: AudioTrack, queue: AudioTrack[] = []) {
    this.state.currentTrack = track;
    this.state.currentTime = 0;
    this.state.duration = track.duration;
    this.state.error = null;
    this.state.isLoading = true;
    if (queue.length > 0) this.state.queue = queue;
    else if (!this.state.queue.some(t => t.id === track.id)) this.state.queue = [track, ...this.state.queue];

    if (this.audio) {
      this.audio.src = track.audioUrl;
      this.audio.play().catch(() => this.patch({ isLoading: false, isPlaying: false }));
    }
    this.updateMediaSessionMetadata(track);
    this.notify();
  }

  public togglePlayPause() {
    if (!this.audio || !this.state.currentTrack) return;
    if (this.audio.paused) this.audio.play().catch(() => {});
    else this.audio.pause();
  }

  public pause() {
    this.audio?.pause();
  }

  public seek(seconds: number) {
    if (!this.audio || !this.audio.duration) return;
    this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration));
    this.state.currentTime = this.audio.currentTime;
    this.notify();
  }

  public nextTrack() {
    const { queue, currentTrack, isShuffled } = this.state;
    if (queue.length === 0) return;
    const idx = queue.findIndex(t => t.id === currentTrack?.id);
    const nextIdx = isShuffled && queue.length > 1
      ? (idx + 1 + Math.floor(Math.random() * (queue.length - 1))) % queue.length
      : (idx + 1) % queue.length;
    this.playTrack(queue[nextIdx], queue);
  }

  public prevTrack() {
    const { queue, currentTrack } = this.state;
    if (queue.length === 0) return;
    // Standard player behaviour: restart the song if we're more than 3s in
    if (this.audio && this.audio.currentTime > 3) {
      this.seek(0);
      return;
    }
    const idx = queue.findIndex(t => t.id === currentTrack?.id);
    this.playTrack(queue[(idx - 1 + queue.length) % queue.length], queue);
  }

  public toggleShuffle() {
    this.patch({ isShuffled: !this.state.isShuffled });
  }

  public toggleRepeat() {
    const modes: AudioPlayerState['repeatMode'][] = ['all', 'track', 'off'];
    this.patch({ repeatMode: modes[(modes.indexOf(this.state.repeatMode) + 1) % modes.length] });
  }

  public setExpanded(expanded: boolean) {
    this.patch({ isExpanded: expanded });
  }

  private handleTrackEnded() {
    const { repeatMode, queue, currentTrack } = this.state;
    const isLast = queue.findIndex(t => t.id === currentTrack?.id) === queue.length - 1;
    if (repeatMode === 'track') {
      this.seek(0);
      this.audio?.play().catch(() => {});
    } else if (repeatMode === 'all' || !isLast) {
      this.nextTrack();
    } else {
      this.patch({ isPlaying: false });
    }
  }

  // Lock-screen / notification controls where the WebView supports the Media Session API
  private setupMediaSession() {
    if (!('mediaSession' in navigator)) return;
    const ms = navigator.mediaSession;
    ms.setActionHandler('play', () => this.audio?.play().catch(() => {}));
    ms.setActionHandler('pause', () => this.audio?.pause());
    ms.setActionHandler('nexttrack', () => this.nextTrack());
    ms.setActionHandler('previoustrack', () => this.prevTrack());
  }

  private updateMediaSessionMetadata(track: AudioTrack) {
    if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: 'Ishvara',
      artwork: track.coverUrl ? [{ src: track.coverUrl, sizes: '512x512' }] : [],
    });
  }
}

export const devotionalAudioEngine = new DevotionalAudioEngine();
