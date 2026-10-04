// Clean & Lightweight Sound Engine with Web Audio Synthesizer Master Chain
// Balanced audio with master compression and synthesized effects

export interface BgmState {
  isPlaying: boolean;
  volume: number;
}

class SoundEngine {
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmVolume: number = 0.15; // BGM background level (max 0.18)
  private stateListeners: Set<(state: BgmState) => void> = new Set();

  private audioCtx: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private compressorNode: DynamicsCompressorNode | null = null;

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
      this.bgmAudio.volume = this.isMuted ? 0 : Math.min(0.18, this.bgmVolume);
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

      this.bgmAudio.addEventListener('error', () => {});
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        
        // Master Chain: effectNodes -> masterGainNode (0.8) -> compressorNode -> ctx.destination
        this.masterGainNode = this.audioCtx.createGain();
        this.masterGainNode.gain.setValueAtTime(0.8, this.audioCtx.currentTime);

        this.compressorNode = this.audioCtx.createDynamicsCompressor();
        this.compressorNode.threshold.setValueAtTime(-18, this.audioCtx.currentTime);
        this.compressorNode.knee.setValueAtTime(12, this.audioCtx.currentTime);
        this.compressorNode.ratio.setValueAtTime(8, this.audioCtx.currentTime);
        this.compressorNode.attack.setValueAtTime(0.003, this.audioCtx.currentTime);
        this.compressorNode.release.setValueAtTime(0.15, this.audioCtx.currentTime);

        this.masterGainNode.connect(this.compressorNode);
        this.compressorNode.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  private getMasterDestination(): AudioNode | null {
    const ctx = this.getAudioContext();
    if (!ctx) return null;
    return this.masterGainNode || ctx.destination;
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
      this.bgmAudio.volume = muted ? 0 : Math.min(0.18, this.bgmVolume);
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

  // Realistic Western Gunshot Audio Synthesis (Balanced, Noise 0.16, Bass 0.20, Shot 4 x1.2)
  public playGunshot(shotIndex = 0) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const dest = this.getMasterDestination();
      if (!ctx || !dest) return;
      const now = ctx.currentTime;
      const shotMultiplier = shotIndex === 3 ? 1.2 : 1.0;

      // 1. Noise crack
      const bufferSize = Math.floor(ctx.sampleRate * 0.11);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(3200 + shotIndex * 200, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(250, now + 0.11);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.16 * shotMultiplier, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(dest);
      noise.start(now);

      // 2. Bass thump
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(170 + (shotIndex % 4) * 15, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.09);

      oscGain.gain.setValueAtTime(0.20 * shotMultiplier, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(oscGain);
      oscGain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  // 1. playReelStop: Bunyi "thud" pendek (sine 140 ke 60 Hz, 0.09 detik, gain 0.18)
  public playReelStop(_isScatter = false) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const dest = this.getMasterDestination();
      if (!ctx || !dest) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.09);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  // 2. playCowboySpin: whoosh noise bandpass 0.35 detik, gain 0.08
  public playCowboySpin() {
    this.playWhoosh(0.35, 0.08);
  }

  // 3. playTurboTumble: versi 0.18 detik
  public playTurboTumble() {
    this.playWhoosh(0.18, 0.08);
  }

  public playSpin() {
    this.playCowboySpin();
  }

  private playWhoosh(duration: number, volume: number) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const dest = this.getMasterDestination();
      if (!ctx || !dest) return;
      const now = ctx.currentTime;

      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((Math.PI * i) / bufferSize);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + duration * 0.5);
      filter.frequency.exponentialRampToValueAtTime(400, now + duration);
      filter.Q.setValueAtTime(2.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(dest);
      noise.start(now);
    } catch {}
  }

  // 4. playCashRegisterCring(step): SUARA SCATTER. Dua osilator triangle 1568 Hz dan 2093 Hz dikali 1.12^step, decay 0.5 detik, gain 0.22
  public playCashRegisterCring(step = 0) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const dest = this.getMasterDestination();
      if (!ctx || !dest) return;
      const now = ctx.currentTime;
      const pitchMultiplier = Math.pow(1.12, Math.max(0, step));

      const freq1 = 1568 * pitchMultiplier;
      const freq2 = 2093 * pitchMultiplier;

      [freq1, freq2].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.5);
      });
    } catch {}
  }

  // 5. playScatterFanfare: arpeggio naik 523, 659, 784, 1046 Hz, tiap nada 0.12 detik, gain 0.2
  public playScatterFanfare() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const dest = this.getMasterDestination();
      if (!ctx || !dest) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = now + idx * 0.12;

        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.20, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.24);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(start);
        osc.stop(start + 0.25);
      });
    } catch {}
  }

  // 8. playGuitarStrum: Suara Gitar Western "Jreeeeng" saat simbol pecah
  public playGuitarStrum() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const dest = this.getMasterDestination();
      if (!ctx || !dest) return;
      const now = ctx.currentTime;

      // Acoustic Western E-minor / G chord frequencies (6 strings, staggered 18ms strum)
      const freqs = [164.81, 220.0, 293.66, 392.0, 493.88, 659.25];
      freqs.forEach((freq, idx) => {
        const strumDelay = idx * 0.018; // Strum duration across 6 strings
        const start = now + strumDelay;

        // String oscillator (triangle for woody acoustic body)
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        // Body resonance filter
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, start);
        filter.frequency.exponentialRampToValueAtTime(400, start + 0.7);

        // Strum envelope: fast attack, natural acoustic decay
        oscGain.gain.setValueAtTime(0.001, start);
        oscGain.gain.linearRampToValueAtTime(0.18, start + 0.015);
        oscGain.gain.exponentialRampToValueAtTime(0.001, start + 0.75);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(dest);

        osc.start(start);
        osc.stop(start + 0.8);
      });
    } catch {}
  }

  // 6. playCoin: ting pendek 1318 Hz, 0.12 detik, gain 0.14
  public playCoin() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const dest = this.getMasterDestination();
      if (!ctx || !dest) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1318.5, now);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  // 7. playWin(false): dua nada naik, gain 0.16. playWin(true): empat nada naik plus shimmer, gain 0.22
  public playWin(isBig = false) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const dest = this.getMasterDestination();
      if (!ctx || !dest) return;
      const now = ctx.currentTime;

      const notes = isBig ? [587.33, 739.99, 880, 1174.66] : [587.33, 880];
      const gainVal = isBig ? 0.22 : 0.16;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = now + idx * 0.1;

        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(gainVal, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(start);
        osc.stop(start + 0.24);
      });
    } catch {}
  }

  // 8. Simple short UI synthesizers (gain max 0.15)
  public playPing() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const dest = this.getMasterDestination();
      if (!ctx || !dest) return;
      const now = ctx.currentTime;

      // Bright metallic Ping tone for Spin button press
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, now);
      osc.frequency.exponentialRampToValueAtTime(2640, now + 0.08);

      gain.gain.setValueAtTime(0.20, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  public playBetChange() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const dest = this.getMasterDestination();
      if (!ctx || !dest) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.06);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  public playLevelUp() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const dest = this.getMasterDestination();
      if (!ctx || !dest) return;
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = now + idx * 0.08;

        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(start);
        osc.stop(start + 0.2);
      });
    } catch {}
  }

  public playCascadeWhoosh() {
    this.playWhoosh(0.14, 0.10);
  }

  public playCountingTick(pitchMod = 1) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const dest = this.getMasterDestination();
      if (!ctx || !dest) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(980 * pitchMod, now);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  public playGoldFrameTransform() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const dest = this.getMasterDestination();
      if (!ctx || !dest) return;
      const now = ctx.currentTime;

      [1046.5, 1318.5, 1568].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = now + i * 0.06;

        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(start);
        osc.stop(start + 0.22);
      });
    } catch {}
  }

  public playFreeSpinsTransition() {
    this.playScatterFanfare();
  }

  public playWildGunshot() {
    this.playGunshot(3);
  }

  public playScatterJingle() {
    this.playCashRegisterCring(1);
  }

  public playCashRegister() {
    this.playCashRegisterCring(0);
  }

  public playBigWinFanfare() {
    this.playWin(true);
  }

  public playMegaWinFanfare() {
    this.playWin(true);
  }

  public playSuperMegaWinFanfare() {
    this.playWin(true);
  }

  // Gameplay BGM Controls
  public startCowboyBGM() {
    if (this.isMuted) return;
    this.initBgmAudio();

    if (this.bgmAudio && this.bgmAudio.src) {
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.isMuted ? 0 : Math.min(0.18, this.bgmVolume);
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
    this.bgmVolume = Math.max(0, Math.min(0.18, vol));
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
