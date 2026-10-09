/**
 * Web Audio API synthesizer for Happy Birthday celebration
 * Zero external audio assets required - runs 100% reliably in any modern browser!
 */

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private melodyTimeout: any = null;
  private isMelodyPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isMelodyPlaying) {
      this.stopMelody();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public isPlayingMelody(): boolean {
    return this.isMelodyPlaying;
  }

  // Play a single synthesized chime note
  private playTone(freq: number, startTime: number, duration: number, volume = 0.25) {
    if (this.isMuted || !this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(freq, startTime);
    osc2.frequency.setValueAtTime(freq * 2, startTime); // harmonic shimmer

    // Envelope: quick attack, smooth decay
    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(volume, startTime + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  // Plays celebratory "Happy Birthday" tune
  public startMelody(onFinished?: () => void) {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;

    this.stopMelody();
    this.isMelodyPlaying = true;

    // Frequencies (Hz)
    const C4 = 261.63;
    const D4 = 293.66;
    const E4 = 329.63;
    const F4 = 349.23;
    const G4 = 392.0;
    const A4 = 440.0;
    const B4 = 493.88;
    const C5 = 523.25;
    const D5 = 587.33;
    const E5 = 659.25;
    const F5 = 698.46;
    const G5 = 783.99;

    // Happy birthday score: [freq, beatLength]
    const notes: [number, number][] = [
      // Hap-py birth-day to you
      [G4, 0.75], [G4, 0.25], [A4, 1.0], [G4, 1.0], [C5, 1.0], [B4, 2.0],
      // Hap-py birth-day to you
      [G4, 0.75], [G4, 0.25], [A4, 1.0], [G4, 1.0], [D5, 1.0], [C5, 2.0],
      // Hap-py birth-day dear friend
      [G4, 0.75], [G4, 0.25], [G5, 1.0], [E5, 1.0], [C5, 1.0], [B4, 1.0], [A4, 1.8],
      // Hap-py birth-day to you
      [F5, 0.75], [F5, 0.25], [E5, 1.0], [C5, 1.0], [D5, 1.0], [C5, 2.2],
    ];

    const tempo = 0.38; // seconds per beat unit
    let currentTime = this.ctx.currentTime + 0.1;

    for (let i = 0; i < notes.length; i++) {
      const [freq, beats] = notes[i];
      const duration = beats * tempo;
      this.playTone(freq, currentTime, duration * 0.95, 0.18);
      currentTime += duration;
    }

    const totalDuration = (currentTime - this.ctx.currentTime) * 1000;
    this.melodyTimeout = setTimeout(() => {
      this.isMelodyPlaying = false;
      if (onFinished) onFinished();
    }, totalDuration);
  }

  public stopMelody() {
    if (this.melodyTimeout) {
      clearTimeout(this.melodyTimeout);
      this.melodyTimeout = null;
    }
    this.isMelodyPlaying = false;
  }

  // Realistic balloon pop sound
  public playBalloonPop() {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.08);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  // Gentle blowing sound for candle
  public playBlowSound() {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1; // White noise
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.5);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
      whiteNoise.stop(this.ctx.currentTime + 0.5);
    } catch {
      // fallback
    }
  }

  // Cake cutting celebratory chime
  public playCakeCutSound() {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;

    const freqs = [523.25, 659.25, 783.99, 1046.5];
    const t = this.ctx.currentTime;
    freqs.forEach((f, idx) => {
      this.playTone(f, t + idx * 0.06, 0.4, 0.2);
    });
  }

  // Triumphant Fanfare when gift box opens
  public playFanfare() {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;

    const t = this.ctx.currentTime;
    const fanfareNotes = [
      { f: 392.0, delay: 0, dur: 0.15 },    // G4
      { f: 523.25, delay: 0.16, dur: 0.15 }, // C5
      { f: 659.25, delay: 0.32, dur: 0.15 }, // E5
      { f: 783.99, delay: 0.48, dur: 0.45 }, // G5
      { f: 659.25, delay: 0.72, dur: 0.15 }, // E5
      { f: 783.99, delay: 0.88, dur: 0.7 },  // G5 (held)
    ];

    fanfareNotes.forEach((n) => {
      this.playTone(n.f, t + n.delay, n.dur, 0.25);
    });
  }

  // Celestial sparkle sound when shooting star / wish launches
  public playStarWishSound() {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;

    const t = this.ctx.currentTime;
    const pitches = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51];
    pitches.forEach((p, idx) => {
      this.playTone(p, t + idx * 0.05, 0.35, 0.15);
    });
  }

  // Small snappy click
  public playTap() {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.03);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.03);
  }
}

export const sound = new SoundEffectsEngine();
