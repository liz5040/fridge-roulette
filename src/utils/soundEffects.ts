// Web Audio API Retro Diner Sound FX Engine
// Generates authentic diner bells, reel clicks, mechanical pulls, griddle sizzles, and jukebox tunes

class RetroSoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private sizzleNode: AudioBufferSourceNode | null = null;
  private sizzleGain: GainNode | null = null;
  private isJukeboxPlaying: boolean = false;
  private jukeboxTimeout: number | null = null;

  constructor() {
    try {
      const savedMute = localStorage.getItem('fridge_roulette_muted');
      if (savedMute !== null) {
        this.isMuted = JSON.parse(savedMute);
      }
    } catch {
      this.isMuted = false;
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('fridge_roulette_muted', JSON.stringify(this.isMuted));
    } catch {
      // ignore
    }
    if (this.isMuted) {
      this.stopSizzle();
      this.stopJukebox();
    } else {
      this.playBoop(600);
    }
    return this.isMuted;
  }

  // Mechanical Slot Reel Tick
  public playTick(pitchMultiplier: number = 1) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420 * pitchMultiplier, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120 * pitchMultiplier, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
    } catch {
      // Audio fallback silent
    }
  }

  // Slot Machine Lever Pull with Ratchet Clatter
  public playLeverPull() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          this.playTick(0.8 + i * 0.15);
        }, i * 45);
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.35);

      gain.gain.setValueAtTime(0.15, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + 0.15);
      osc.stop(now + 0.4);
    } catch {
      // silent
    }
  }

  // Classic High-Pitched Brass Diner Service Bell ("Ding! Order Up!")
  public playDinerBell() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const fundamental = 1975.53; // B6 bell tone

      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(fundamental, now);

      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(fundamental * 2.76, now);

      gain2.gain.setValueAtTime(0.15, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.25);
      osc2.stop(now + 0.65);
    } catch {
      // silent
    }
  }

  // Cheerful Jukebox 4-Note Diner Win Fanfare
  public playWinJingle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.18, 'triangle', 0.22);
      }, idx * 110);
    });
  }

  // Rubbery tactile button boop
  public playBoop(freq: number = 520) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    this.playTone(freq, 0.08, 'sine', 0.15);
  }

  // Lock Reel Click
  public playLockSound(locked: boolean) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const freq = locked ? 640 : 380;
    this.playTone(freq, 0.09, 'square', 0.12);
  }

  // Kitchen Timer Tick
  public playTimerTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    this.playTone(880, 0.03, 'sine', 0.08);
  }

  // Hot Cast Iron Griddle Sizzle (synthesized pink noise with resonant filter)
  public startSizzle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || this.sizzleNode) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink noise algorithm
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }

      this.sizzleNode = this.ctx.createBufferSource();
      this.sizzleNode.buffer = buffer;
      this.sizzleNode.loop = true;

      // Filter for sizzling bacon/butter high frequencies
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      this.sizzleGain = this.ctx.createGain();
      this.sizzleGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      this.sizzleNode.connect(filter);
      filter.connect(this.sizzleGain);
      this.sizzleGain.connect(this.ctx.destination);

      this.sizzleNode.start();
    } catch {
      // silent
    }
  }

  public stopSizzle() {
    if (this.sizzleNode) {
      try {
        this.sizzleNode.stop();
        this.sizzleNode.disconnect();
      } catch {
        // ignore
      }
      this.sizzleNode = null;
      this.sizzleGain = null;
    }
  }

  // Jukebox Diner Doo-Wop Chords
  public toggleJukebox(): boolean {
    if (this.isJukeboxPlaying) {
      this.stopJukebox();
      return false;
    } else {
      this.startJukebox();
      return true;
    }
  }

  public getJukeboxStatus(): boolean {
    return this.isJukeboxPlaying;
  }

  public startJukebox() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    this.isJukeboxPlaying = true;
    // Classic 1950s I-vi-IV-V progression (C - Am - F - G)
    const chords = [
      [261.63, 329.63, 392.00], // C
      [220.00, 261.63, 329.63], // Am
      [174.61, 220.00, 261.63], // F
      [196.00, 246.94, 293.66], // G
    ];

    let chordIdx = 0;
    const playLoop = () => {
      if (!this.isJukeboxPlaying || this.isMuted) return;
      const currentChord = chords[chordIdx % chords.length];
      currentChord.forEach(freq => {
        this.playTone(freq, 0.45, 'sine', 0.05);
      });
      chordIdx++;
      this.jukeboxTimeout = window.setTimeout(playLoop, 650);
    };

    playLoop();
  }

  public stopJukebox() {
    this.isJukeboxPlaying = false;
    if (this.jukeboxTimeout) {
      clearTimeout(this.jukeboxTimeout);
      this.jukeboxTimeout = null;
    }
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.2) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      // silent
    }
  }
}

export const sounds = new RetroSoundEngine();
