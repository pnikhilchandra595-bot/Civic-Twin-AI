/**
 * CivicTwin AI - Tactical Audio Soundscape Engine
 * Pure Web Audio API & Web Speech API synthesizer (zero external mp3 assets needed)
 */

class TacticalAudioEngine {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Tactical military radio mic squelch / burst chirp
   */
  public playRadioChirp() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      
      // Noise burst for radio static
      const bufferSize = this.audioCtx.sampleRate * 0.06;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.Q.setValueAtTime(4.0, now);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      // High frequency tone "beep"
      const osc = this.audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1750, now);
      osc.frequency.setValueAtTime(2200, now + 0.03);

      const oscGain = this.audioCtx.createGain();
      oscGain.gain.setValueAtTime(0.12, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.connect(oscGain);
      oscGain.connect(this.audioCtx.destination);

      noise.start(now);
      noise.stop(now + 0.06);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Radar sonar telemetry ping
   */
  public playRadarPing() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.18);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  /**
   * Emergency warble alert tone (soft tactical alert)
   */
  public playAlertWarble() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.linearRampToValueAtTime(950, now + 0.15);
      osc.frequency.linearRampToValueAtTime(650, now + 0.3);
      osc.frequency.linearRampToValueAtTime(950, now + 0.45);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  }

  /**
   * Loud emergency evacuation / civil defense siren
   */
  public playWarningSiren() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(800, now + 0.4);
      osc.frequency.linearRampToValueAtTime(400, now + 0.8);
      osc.frequency.linearRampToValueAtTime(800, now + 1.2);
      osc.frequency.linearRampToValueAtTime(400, now + 1.6);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.8);
    } catch (e) {}
  }

  /**
   * Text-to-Speech (TTS) Tactical SitRep voice
   */
  public speakSitrep(text: string, lang: 'en' | 'hi' = 'en') {
    if (this.isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel(); // Stop any currently playing speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

      const voices = window.speechSynthesis.getVoices();
      const targetVoice = voices.find(v => 
        lang === 'hi' 
          ? v.lang.includes('hi') 
          : (v.lang.includes('en-IN') || v.name.includes('India'))
      );
      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      this.playRadioChirp();
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    } catch (e) {
      console.warn('Speech synthesis not available:', e);
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

export const tacticalAudio = new TacticalAudioEngine();
