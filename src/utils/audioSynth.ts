/**
 * Web Audio API synthesizer for realistic nostalgic ambient sounds:
 * - Mechanical cassette deck click / clunk
 * - Lo-fi tape hiss & motor hum
 * - Vinyl crackle & pops
 * - Gentle monsoon rain
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private tapeHissNode: AudioNode | null = null;
  private tapeHissGain: GainNode | null = null;
  private vinylNode: AudioNode | null = null;
  private vinylGain: GainNode | null = null;
  private rainNode: AudioNode | null = null;
  private rainGain: GainNode | null = null;
  private isInitialized = false;

  private init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.isInitialized = true;
      }
    } catch (e) {
      console.warn('Web Audio API not supported in this browser', e);
    }
  }

  private ensureRunning() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Realistic mechanical cassette button click sound (satisfying clunk)
  public playCassetteClick(type: 'play' | 'stop' | 'eject' | 'switch' = 'play') {
    this.ensureRunning();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(type === 'eject' ? 300 : 600, now);

      if (type === 'play') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);

        // Secondary metallic spring click
        setTimeout(() => {
          if (!this.ctx) return;
          const osc2 = this.ctx.createOscillator();
          const gain2 = this.ctx.createGain();
          osc2.type = 'square';
          osc2.frequency.setValueAtTime(880, this.ctx.currentTime);
          gain2.gain.setValueAtTime(0.08, this.ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);
          osc2.connect(gain2);
          gain2.connect(this.ctx.destination);
          osc2.start();
          osc2.stop(this.ctx.currentTime + 0.03);
        }, 30);
      } else if (type === 'switch') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else {
        // Eject or stop clunk
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.12);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {
      console.warn('Audio click error:', e);
    }
  }

  // Realistic continuous Tape Hiss Generator
  public setTapeHiss(enable: boolean, volume = 0.15) {
    this.ensureRunning();
    if (!this.ctx) return;

    if (!enable) {
      if (this.tapeHissGain) {
        this.tapeHissGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
      }
      return;
    }

    if (!this.tapeHissNode) {
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;

      // Pinkish noise for warm magnetic tape hiss
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2 + white * 0.1) * 0.15;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3200;
      filter.Q.value = 1.2;

      this.tapeHissGain = this.ctx.createGain();
      this.tapeHissGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.tapeHissGain.gain.setTargetAtTime(volume * 0.2, this.ctx.currentTime, 0.3);

      whiteNoise.connect(filter);
      filter.connect(this.tapeHissGain);
      this.tapeHissGain.connect(this.ctx.destination);

      whiteNoise.start();
      this.tapeHissNode = whiteNoise;
    } else if (this.tapeHissGain) {
      this.tapeHissGain.gain.setTargetAtTime(volume * 0.2, this.ctx.currentTime, 0.2);
    }
  }

  // Realistic Vinyl Crackle Generator
  public setVinylCrackle(enable: boolean, volume = 0.2) {
    this.ensureRunning();
    if (!this.ctx) return;

    if (!enable) {
      if (this.vinylGain) {
        this.vinylGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
      }
      return;
    }

    if (!this.vinylNode) {
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // Random clicks and dust pops
        if (Math.random() < 0.0006) {
          output[i] = (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random() * 0.4);
        } else {
          output[i] = (Math.random() * 2 - 1) * 0.02;
        }
      }

      const vinylSource = this.ctx.createBufferSource();
      vinylSource.buffer = noiseBuffer;
      vinylSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 800;

      this.vinylGain = this.ctx.createGain();
      this.vinylGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.vinylGain.gain.setTargetAtTime(volume * 0.3, this.ctx.currentTime, 0.3);

      vinylSource.connect(filter);
      filter.connect(this.vinylGain);
      this.vinylGain.connect(this.ctx.destination);

      vinylSource.start();
      this.vinylNode = vinylSource;
    } else if (this.vinylGain) {
      this.vinylGain.gain.setTargetAtTime(volume * 0.3, this.ctx.currentTime, 0.2);
    }
  }

  // Gentle Monsoon Rain Generator
  public setMonsoonRain(enable: boolean, volume = 0.2) {
    this.ensureRunning();
    if (!this.ctx) return;

    if (!enable) {
      if (this.rainGain) {
        this.rainGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
      }
      return;
    }

    if (!this.rainNode) {
      const bufferSize = 3 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise simulation for raindrops
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 2.5;
      }

      const rainSource = this.ctx.createBufferSource();
      rainSource.buffer = noiseBuffer;
      rainSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1200;

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.rainGain.gain.setTargetAtTime(volume * 0.35, this.ctx.currentTime, 0.5);

      rainSource.connect(filter);
      filter.connect(this.rainGain);
      this.rainGain.connect(this.ctx.destination);

      rainSource.start();
      this.rainNode = rainSource;
    } else if (this.rainGain) {
      this.rainGain.gain.setTargetAtTime(volume * 0.35, this.ctx.currentTime, 0.3);
    }
  }
}

export const audioSynth = new AudioSynthesizer();
