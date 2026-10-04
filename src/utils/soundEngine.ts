// Clean & Lightweight Sound Engine
// Ready for built-in gameplay audio asset (/audio/gameplay_bgm.mp3)

export interface BgmState {
  isPlaying: boolean;
  volume: number;
}

class SoundEngine {
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmVolume: number = 0.75;
  private stateListeners: Set<(state: BgmState) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initBgmAudio();
    }
  }

  private initBgmAudio() {
    if (typeof window === 'undefined') return;
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio();
      this.bgmAudio.src = '/audio/gameplay_bgm.mp3';
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.isMuted ? 0 : this.bgmVolume;
      this.bgmAudio.preload = 'auto';

      this.bgmAudio.addEventListener('ended', () => {
        if (this.isBgmPlaying && !this.isMuted && this.bgmAudio) {
          this.bgmAudio.currentTime = 0;
          this.bgmAudio.play().catch(() => {});
        }
      });

      this.bgmAudio.addEventListener('play', () => {
        this.isBgmPlaying = true;
        this.notifyState();
      });

      this.bgmAudio.addEventListener('pause', () => {
        this.isBgmPlaying = false;
        this.notifyState();
      });

      this.bgmAudio.addEventListener('error', () => {
        // Audio error handler
      });
    }
  }

  public unlockAudio() {
    if (!this.isMuted && this.bgmAudio && this.bgmAudio.src) {
      this.startCowboyBGM();
    }
  }

  public subscribeBgmState(listener: (state: BgmState) => void): () => void {
    this.stateListeners.add(listener);
    listener(this.getBgmState());
    return () => this.stateListeners.delete(listener);
  }

  public getBgmState(): BgmState {
    return {
      isPlaying: this.isBgmPlaying,
      volume: this.bgmVolume,
    };
  }

  private notifyState() {
    const state = this.getBgmState();
    this.stateListeners.forEach((l) => l(state));
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmAudio) {
      this.bgmAudio.volume = muted ? 0 : this.bgmVolume;
    }
    if (muted && this.isBgmPlaying) {
      this.stopBGM();
    } else if (!muted && !this.isBgmPlaying) {
      this.startCowboyBGM();
    }
    this.notifyState();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  // Realistic Western Gunshot Audio Synthesis
  public playGunshot(shotIndex = 0) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Explosive noise crack
      const bufferSize = Math.floor(ctx.sampleRate * 0.12);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.025));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(3400 + shotIndex * 250, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(300, now + 0.12);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);

      // 2. Heavy bass kick / punch
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(190 + (shotIndex % 4) * 18, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.1);

      oscGain.gain.setValueAtTime(0.5, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  // Clean sound effect stubs (no distortion, completely silent/ready for clean assets)
  public playBetChange(..._args: unknown[]) {}
  public playCowboySpin(..._args: unknown[]) {}
  public playSpin(..._args: unknown[]) {}
  public playWildGunshot(..._args: unknown[]) {
    this.playGunshot(3);
  }
  public playScatterJingle(..._args: unknown[]) {}
  public playScatterFanfare(..._args: unknown[]) {}
  public playCascadeWhoosh(..._args: unknown[]) {}
  public playGoldFrameTransform(..._args: unknown[]) {}
  public playBigWinFanfare(..._args: unknown[]) {}
  public playMegaWinFanfare(..._args: unknown[]) {}
  public playSuperMegaWinFanfare(..._args: unknown[]) {}
  public playFreeSpinsTransition(..._args: unknown[]) {}
  public playCashRegister(..._args: unknown[]) {}
  public playCashRegisterCring(..._args: unknown[]) {}
  public playTurboTumble(..._args: unknown[]) {}
  public playReelStop(..._args: unknown[]) {}
  public playWin(..._args: unknown[]) {}
  public playCoin(..._args: unknown[]) {}
  public playCountingTick(..._args: unknown[]) {}
  public playLevelUp(..._args: unknown[]) {}

  // Gameplay BGM Controls
  public startCowboyBGM() {
    if (this.isMuted) return;
    this.initBgmAudio();

    if (this.bgmAudio && this.bgmAudio.src) {
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.bgmVolume;
      const p = this.bgmAudio.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    }
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmAudio) {
      try {
        this.bgmAudio.pause();
      } catch {}
    }
    this.notifyState();
  }

  public toggleBGM(): boolean {
    if (this.isBgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startCowboyBGM();
      return true;
    }
  }

  public setBgmVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.isMuted ? 0 : this.bgmVolume;
    }
    this.notifyState();
  }

  public getBgmVolume(): number {
    return this.bgmVolume;
  }

  public isMusicPlaying(): boolean {
    return this.isBgmPlaying;
  }
}

export const sound = new SoundEngine();
