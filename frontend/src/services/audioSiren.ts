/**
 * Real Web Audio API Emergency Alert System (EAS) Two-Tone Siren Synthesizer
 * Generates official NDMA / EAS warning frequencies (853 Hz + 960 Hz) directly through the browser speakers.
 */

class AudioSirenService {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;

  private initAudio() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public playEASAlertSiren(durationSec: number = 3.5) {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.stop();

      // Create dual-tone oscillators: 853 Hz and 960 Hz (Standard Emergency Alert System)
      this.osc1 = this.audioCtx.createOscillator();
      this.osc2 = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.osc1.type = 'sine';
      this.osc1.frequency.setValueAtTime(853, this.audioCtx.currentTime);

      this.osc2.type = 'sine';
      this.osc2.frequency.setValueAtTime(960, this.audioCtx.currentTime);

      // Volume envelope: rise quickly, sustain, and fade out
      const now = this.audioCtx.currentTime;
      this.gainNode.gain.setValueAtTime(0.01, now);
      this.gainNode.gain.exponentialRampToValueAtTime(0.35, now + 0.1);
      this.gainNode.gain.setValueAtTime(0.35, now + durationSec - 0.2);
      this.gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      this.osc1.connect(this.gainNode);
      this.osc2.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.osc1.start(now);
      this.osc2.start(now);

      this.isPlaying = true;

      this.osc1.stop(now + durationSec);
      this.osc2.stop(now + durationSec);

      setTimeout(() => {
        this.isPlaying = false;
      }, durationSec * 1000);
    } catch (e) {
      console.warn('Audio Siren could not play:', e);
    }
  }

  public playRadioClick() {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  public playRadioSquelchStatic(type: 'open' | 'close' = 'open') {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const duration = type === 'open' ? 0.12 : 0.18;
      const bufferSize = Math.floor(this.audioCtx.sampleRate * duration);
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = buffer.getChannelData(0);

      // Generate realistic white noise
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      // Bandpass filter (300 Hz - 3400 Hz typical military walkie-talkie spectrum)
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 1.2;

      const gain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime;
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);
    } catch (e) {}
  }

  public stop() {
    if (this.osc1) {
      try { this.osc1.stop(); } catch (e) {}
      this.osc1 = null;
    }
    if (this.osc2) {
      try { this.osc2.stop(); } catch (e) {}
      this.osc2 = null;
    }
    this.isPlaying = false;
  }
}

export const audioSiren = new AudioSirenService();
