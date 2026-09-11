import { AudioTrack } from '../types';

export interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: 'off' | 'track' | 'all';
  isShuffled: boolean;
  queue: AudioTrack[];
  history: AudioTrack[];
  isExpanded: boolean;
  isSyntheticDroneActive: boolean;
}

type AudioListener = (state: AudioPlayerState) => void;

class DevotionalAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private droneOscillators: OscillatorNode[] = [];
  private droneGain: GainNode | null = null;
  private listeners: Set<AudioListener> = new Set();

  private state: AudioPlayerState = {
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.85,
    isMuted: false,
    repeatMode: 'all',
    isShuffled: false,
    queue: [],
    history: [],
    isExpanded: false,
    isSyntheticDroneActive: false
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.preload = 'auto';

      this.audio.addEventListener('timeupdate', () => {
        if (this.audio) {
          this.state.currentTime = this.audio.currentTime;
          this.state.duration = this.audio.duration || this.state.currentTrack?.duration || 0;
          this.notify();
        }
      });

      this.audio.addEventListener('ended', () => {
        this.handleTrackEnded();
      });

      this.audio.addEventListener('error', () => {
        // Fallback to synthetic meditative drone if remote asset has CORS/network issue
        this.startSyntheticMeditativeDrone();
      });

      this.audio.addEventListener('play', () => {
        this.state.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.state.isPlaying = false;
        this.notify();
      });
    }
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l({ ...this.state }));
  }

  public getState(): AudioPlayerState {
    return { ...this.state };
  }

  public playTrack(track: AudioTrack, queueList: AudioTrack[] = []) {
    this.stopSyntheticDrone();
    this.state.currentTrack = track;
    this.state.currentTime = 0;
    this.state.duration = track.duration;

    if (queueList.length > 0) {
      this.state.queue = queueList;
    } else if (!this.state.queue.find(t => t.id === track.id)) {
      this.state.queue = [track, ...this.state.queue];
    }

    // Add to history
    this.state.history = [track, ...this.state.history.filter(h => h.id !== track.id)].slice(0, 30);

    if (this.audio) {
      this.audio.src = track.audioUrl;
      this.audio.currentTime = 0;
      this.audio.volume = this.state.isMuted ? 0 : this.state.volume;
      this.audio.play().catch(() => {
        // Autoplay policy or CORS error fallback
        this.startSyntheticMeditativeDrone();
      });
    }

    this.state.isPlaying = true;
    this.notify();
  }

  public togglePlayPause() {
    if (!this.state.currentTrack) return;

    if (this.state.isPlaying) {
      if (this.audio) this.audio.pause();
      this.stopSyntheticDrone();
      this.state.isPlaying = false;
    } else {
      if (this.audio && this.audio.src) {
        this.audio.play().catch(() => {
          this.startSyntheticMeditativeDrone();
        });
      } else {
        this.startSyntheticMeditativeDrone();
      }
      this.state.isPlaying = true;
    }
    this.notify();
  }

  public seek(seconds: number) {
    if (this.audio && this.audio.duration) {
      this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration));
      this.state.currentTime = this.audio.currentTime;
    } else {
      this.state.currentTime = seconds;
    }
    this.notify();
  }

  public nextTrack() {
    if (this.state.queue.length === 0) return;
    const currentIndex = this.state.queue.findIndex(t => t.id === this.state.currentTrack?.id);
    let nextIndex = currentIndex + 1;
    if (nextIndex >= this.state.queue.length) {
      nextIndex = 0;
    }
    this.playTrack(this.state.queue[nextIndex], this.state.queue);
  }

  public prevTrack() {
    if (this.state.queue.length === 0) return;
    const currentIndex = this.state.queue.findIndex(t => t.id === this.state.currentTrack?.id);
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = this.state.queue.length - 1;
    }
    this.playTrack(this.state.queue[prevIndex], this.state.queue);
  }

  public toggleShuffle() {
    this.state.isShuffled = !this.state.isShuffled;
    this.notify();
  }

  public toggleRepeat() {
    const modes: ('off' | 'track' | 'all')[] = ['off', 'track', 'all'];
    const nextIdx = (modes.indexOf(this.state.repeatMode) + 1) % modes.length;
    this.state.repeatMode = modes[nextIdx];
    this.notify();
  }

  public setExpanded(expanded: boolean) {
    this.state.isExpanded = expanded;
    this.notify();
  }

  private handleTrackEnded() {
    if (this.state.repeatMode === 'track' && this.state.currentTrack) {
      this.seek(0);
      this.audio?.play();
    } else if (this.state.repeatMode === 'all') {
      this.nextTrack();
    } else {
      this.state.isPlaying = false;
      this.notify();
    }
  }

  // Web Audio Synthetic 432Hz Om Tanpura Drone Fallback
  public startSyntheticMeditativeDrone() {
    if (typeof window === 'undefined') return;
    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      this.stopSyntheticDrone();

      const baseFreq = 136.1; // Om frequency (C# / Earth Year vibration)
      const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 2, baseFreq * 3];

      this.droneGain = this.audioContext.createGain();
      this.droneGain.gain.setValueAtTime(0.01, this.audioContext.currentTime);
      this.droneGain.gain.exponentialRampToValueAtTime(0.12, this.audioContext.currentTime + 3);
      this.droneGain.connect(this.audioContext.destination);

      this.droneOscillators = freqs.map((f, i) => {
        const osc = this.audioContext!.createOscillator();
        osc.type = i === 0 ? 'sine' : i === 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(f + (i * 0.4), this.audioContext!.currentTime);
        osc.connect(this.droneGain!);
        osc.start();
        return osc;
      });

      this.state.isSyntheticDroneActive = true;
      this.state.isPlaying = true;
      this.notify();
    } catch {
      // ignore
    }
  }

  public stopSyntheticDrone() {
    if (this.droneOscillators.length > 0) {
      this.droneOscillators.forEach(o => {
        try { o.stop(); o.disconnect(); } catch {}
      });
      this.droneOscillators = [];
    }
    if (this.droneGain) {
      try { this.droneGain.disconnect(); } catch {}
      this.droneGain = null;
    }
    this.state.isSyntheticDroneActive = false;
  }
}

export const devotionalAudioEngine = new DevotionalAudioEngine();
