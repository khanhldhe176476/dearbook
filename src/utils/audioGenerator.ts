// Web Audio API generator for ambient background music
// Used as fallback when external music URLs fail to load

export interface GeneratedAudioConfig {
  theme: 'love' | 'family' | 'birthday' | 'friendship';
  duration?: number;
}

export class AudioGenerator {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private isPlaying = false;

  constructor() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private getThemeConfig(theme: string) {
    const configs = {
      love: {
        // Romantic soft tones
        frequencies: [261.63, 329.63, 392.00, 523.25], // C4, E4, G4, C5
        waveType: 'sine' as OscillatorType,
        tempo: 2000, // Slow
        volume: 0.15
      },
      family: {
        // Warm peaceful tones
        frequencies: [293.66, 349.23, 440.00, 587.33], // D4, F4, A4, D5
        waveType: 'sine' as OscillatorType,
        tempo: 2500,
        volume: 0.15
      },
      birthday: {
        // Happy upbeat tones
        frequencies: [349.23, 392.00, 493.88, 587.33], // F4, G4, B4, D5
        waveType: 'triangle' as OscillatorType,
        tempo: 1500,
        volume: 0.2
      },
      friendship: {
        // Cheerful bright tones
        frequencies: [329.63, 415.30, 493.88, 659.25], // E4, G#4, B4, E5
        waveType: 'triangle' as OscillatorType,
        tempo: 1800,
        volume: 0.18
      }
    };

    return configs[theme as keyof typeof configs] || configs.love;
  }

  async start(config: GeneratedAudioConfig) {
    if (!this.audioContext || !this.gainNode) {
      console.warn('AudioContext not available');
      return;
    }

    if (this.isPlaying) {
      this.stop();
    }

    // Resume context if suspended (autoplay policy)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const themeConfig = this.getThemeConfig(config.theme);
    this.gainNode.gain.value = themeConfig.volume;

    this.isPlaying = true;
    this.playAmbientLoop(themeConfig.frequencies, themeConfig.waveType, themeConfig.tempo);
  }

  private playAmbientLoop(frequencies: number[], waveType: OscillatorType, tempo: number) {
    if (!this.audioContext || !this.gainNode || !this.isPlaying) return;

    const playNote = (freq: number, duration: number, delay: number) => {
      if (!this.audioContext || !this.gainNode || !this.isPlaying) return;

      setTimeout(() => {
        if (!this.isPlaying || !this.audioContext || !this.gainNode) return;

        const oscillator = this.audioContext.createOscillator();
        const noteGain = this.audioContext.createGain();

        oscillator.type = waveType;
        oscillator.frequency.value = freq;
        
        oscillator.connect(noteGain);
        noteGain.connect(this.gainNode);

        // Envelope: fade in and out
        const now = this.audioContext.currentTime;
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.3, now + duration * 0.1);
        noteGain.gain.linearRampToValueAtTime(0.3, now + duration * 0.7);
        noteGain.gain.linearRampToValueAtTime(0, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);

        this.oscillators.push(oscillator);

        // Clean up
        oscillator.onended = () => {
          const index = this.oscillators.indexOf(oscillator);
          if (index > -1) {
            this.oscillators.splice(index, 1);
          }
        };
      }, delay);
    };

    // Play pattern
    const pattern = () => {
      if (!this.isPlaying) return;

      frequencies.forEach((freq, i) => {
        playNote(freq, tempo * 0.8, i * tempo);
      });

      // Loop
      setTimeout(() => {
        if (this.isPlaying) {
          pattern();
        }
      }, frequencies.length * tempo);
    };

    pattern();
  }

  stop() {
    this.isPlaying = false;
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.oscillators = [];
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = volume * 0.2; // Scale down
    }
  }

  pause() {
    if (this.audioContext && this.audioContext.state === 'running') {
      this.audioContext.suspend();
    }
  }

  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  destroy() {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.gainNode = null;
  }
}
