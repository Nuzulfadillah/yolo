import { EqualizerSettings, SoundFxSettings, Track } from '../types/music';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning = false;
  private isPlaying = false;
  private currentTrack: Track | null = null;
  private currentTime = 0;
  private playbackRate = 1.0;

  // Nodes
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private bassBoostFilter: BiquadFilterNode | null = null;

  // FX Nodes
  private vinylGain: GainNode | null = null;
  private vinylNoiseSource: AudioBufferSourceNode | null = null;
  private tapeLfo: OscillatorNode | null = null;
  private tapeLfoGain: GainNode | null = null;

  // Custom Audio element for uploaded files
  private audioElement: HTMLAudioElement | null = null;
  private audioSourceNode: MediaElementAudioSourceNode | null = null;

  // Synth sequencer timers
  private synthIntervalId: number | null = null;
  private tickCounter = 0;
  private startTime = 0;
  private pauseOffset = 0;

  // State callbacks
  private onTimeUpdateCallback?: (time: number) => void;
  private onEndCallback?: () => void;

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Create Analyser
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;

    // Create Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    // Create 5-band Equalizer
    // 60Hz, 250Hz, 1000Hz, 4000Hz, 12000Hz
    const freqs = [60, 250, 1000, 4000, 12000];
    const types: BiquadFilterType[] = ['lowshelf', 'peaking', 'peaking', 'peaking', 'highshelf'];

    this.eqFilters = freqs.map((freq, i) => {
      const f = this.ctx!.createBiquadFilter();
      f.type = types[i];
      f.frequency.setValueAtTime(freq, this.ctx!.currentTime);
      f.gain.setValueAtTime(0, this.ctx!.currentTime);
      return f;
    });

    // Bass Boost Filter
    this.bassBoostFilter = this.ctx.createBiquadFilter();
    this.bassBoostFilter.type = 'lowshelf';
    this.bassBoostFilter.frequency.setValueAtTime(90, this.ctx.currentTime);
    this.bassBoostFilter.gain.setValueAtTime(0, this.ctx.currentTime);

    // Chain EQ: eqFilters[0] -> ... -> eqFilters[4] -> bassBoost -> masterGain -> analyser -> destination
    for (let i = 0; i < this.eqFilters.length - 1; i++) {
      this.eqFilters[i].connect(this.eqFilters[i + 1]);
    }
    this.eqFilters[this.eqFilters.length - 1].connect(this.bassBoostFilter);
    this.bassBoostFilter.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Init Vinyl Crackle Loop Generator
    this.initVinylCrackle();

    // Init Tape Wobble LFO
    this.tapeLfoGain = this.ctx.createGain();
    this.tapeLfoGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.tapeLfo = this.ctx.createOscillator();
    this.tapeLfo.frequency.setValueAtTime(0.5, this.ctx.currentTime); // 0.5Hz subtle flutter
    this.tapeLfo.connect(this.tapeLfoGain);
    try {
      this.tapeLfo.start();
    } catch {
      // Ignored
    }
  }

  private initVinylCrackle() {
    if (!this.ctx) return;
    // Generate 5-second buffer of authentic vinyl crackle and dust pop
    const bufferSize = this.ctx.sampleRate * 5;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Pinkish noise background
      const white = Math.random() * 2 - 1;
      // Occasional crackle pop
      const pop = Math.random() < 0.0008 ? (Math.random() * 2 - 1) * 0.8 : 0;
      output[i] = white * 0.015 + pop;
    }

    this.vinylGain = this.ctx.createGain();
    this.vinylGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    const crackleFilter = this.ctx.createBiquadFilter();
    crackleFilter.type = 'bandpass';
    crackleFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    crackleFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    this.vinylNoiseSource = this.ctx.createBufferSource();
    this.vinylNoiseSource.buffer = noiseBuffer;
    this.vinylNoiseSource.loop = true;
    this.vinylNoiseSource.connect(crackleFilter);
    crackleFilter.connect(this.vinylGain);
    this.vinylGain.connect(this.masterGain!);

    try {
      this.vinylNoiseSource.start();
    } catch {
      // Ignored
    }
  }

  public setCallbacks(onTimeUpdate: (time: number) => void, onEnd: () => void) {
    this.onTimeUpdateCallback = onTimeUpdate;
    this.onEndCallback = onEnd;
  }

  public async loadTrack(track: Track, autoPlay = true) {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.stop();
    this.currentTrack = track;
    this.currentTime = 0;
    this.pauseOffset = 0;

    if (track.audioBlobUrl) {
      // User uploaded track
      if (!this.audioElement) {
        this.audioElement = new Audio();
        this.audioElement.crossOrigin = 'anonymous';
        this.audioSourceNode = this.ctx!.createMediaElementSource(this.audioElement);
        this.audioSourceNode.connect(this.eqFilters[0]);

        this.audioElement.addEventListener('timeupdate', () => {
          if (this.audioElement && this.onTimeUpdateCallback) {
            this.currentTime = this.audioElement.currentTime;
            this.onTimeUpdateCallback(this.currentTime);
          }
        });
        this.audioElement.addEventListener('ended', () => {
          this.isPlaying = false;
          if (this.onEndCallback) this.onEndCallback();
        });
      }
      this.audioElement.src = track.audioBlobUrl;
      this.audioElement.playbackRate = this.playbackRate;
      if (autoPlay) {
        await this.play();
      }
    } else {
      // Procedural synthesizer track
      if (autoPlay) {
        await this.play();
      }
    }
  }

  public async play() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.isPlaying = true;
    this.isRunning = true;

    if (this.currentTrack?.audioBlobUrl && this.audioElement) {
      this.audioElement.playbackRate = this.playbackRate;
      await this.audioElement.play();
      return;
    }

    // Procedural synthesizer playback
    this.startTime = this.ctx!.currentTime - (this.pauseOffset / this.playbackRate);
    this.startSynthEngine();
  }

  public pause() {
    this.isPlaying = false;
    if (this.audioElement && this.currentTrack?.audioBlobUrl) {
      this.audioElement.pause();
    }
    if (this.synthIntervalId) {
      window.clearInterval(this.synthIntervalId);
      this.synthIntervalId = null;
    }
    if (this.ctx) {
      this.pauseOffset = (this.ctx.currentTime - this.startTime) * this.playbackRate;
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.audioElement && this.currentTrack?.audioBlobUrl) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    if (this.synthIntervalId) {
      window.clearInterval(this.synthIntervalId);
      this.synthIntervalId = null;
    }
    this.currentTime = 0;
    this.pauseOffset = 0;
    this.tickCounter = 0;
  }

  public seek(seconds: number) {
    this.currentTime = seconds;
    if (this.audioElement && this.currentTrack?.audioBlobUrl) {
      this.audioElement.currentTime = seconds;
      return;
    }

    this.pauseOffset = seconds;
    if (this.ctx) {
      this.startTime = this.ctx.currentTime - (seconds / this.playbackRate);
    }
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.currentTime);
    }
  }

  public setVolume(volume: number) {
    if (!this.masterGain || !this.ctx) return;
    const clamped = Math.max(0, Math.min(1, volume));
    this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
  }

  public setEqualizer(settings: EqualizerSettings) {
    if (!this.ctx || this.eqFilters.length < 5) return;
    const now = this.ctx.currentTime;
    this.eqFilters[0].gain.setTargetAtTime(settings.subBass, now, 0.05);
    this.eqFilters[1].gain.setTargetAtTime(settings.low, now, 0.05);
    this.eqFilters[2].gain.setTargetAtTime(settings.mid, now, 0.05);
    this.eqFilters[3].gain.setTargetAtTime(settings.highMid, now, 0.05);
    this.eqFilters[4].gain.setTargetAtTime(settings.high, now, 0.05);
  }

  public setSoundFx(settings: SoundFxSettings) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Vinyl crackle
    if (this.vinylGain) {
      const vGain = settings.vinylCrackle ? settings.vinylCrackleVolume * 0.18 : 0;
      this.vinylGain.gain.setTargetAtTime(vGain, now, 0.05);
    }

    // Tape Wobble
    if (this.tapeLfoGain) {
      const wobble = settings.tapeWobble ? settings.tapeWobbleAmount * 12 : 0;
      this.tapeLfoGain.gain.setTargetAtTime(wobble, now, 0.05);
    }

    // Bass Boost
    if (this.bassBoostFilter) {
      const bbGain = settings.bassBoost ? 7 : 0;
      this.bassBoostFilter.gain.setTargetAtTime(bbGain, now, 0.05);
    }

    this.setPlaybackRate(settings.playbackRate);
  }

  public getVisualizerData(freqArray: Uint8Array, timeArray: Uint8Array) {
    if (!this.analyser) return;
    this.analyser.getByteFrequencyData(freqArray as any);
    this.analyser.getByteTimeDomainData(timeArray as any);
  }

  public getAverageVolume(): { left: number; right: number } {
    if (!this.analyser || !this.isPlaying) return { left: 0, right: 0 };
    const buffer = new Uint8Array(64);
    this.analyser.getByteFrequencyData(buffer as any);
    let sum = 0;
    for (let i = 0; i < 32; i++) {
      sum += buffer[i];
    }
    const avg = (sum / 32) / 255;
    // Add realistic subtle analog needle asymmetry
    const left = Math.min(1, avg * 1.15 + (Math.sin(Date.now() * 0.005) * 0.04));
    const right = Math.min(1, avg * 1.08 + (Math.cos(Date.now() * 0.006) * 0.04));
    return { left: Math.max(0, left), right: Math.max(0, right) };
  }

  // --- Real Synthesizer Engine for Built-in Songs ---
  private startSynthEngine() {
    if (this.synthIntervalId) {
      window.clearInterval(this.synthIntervalId);
    }

    // Compute tick interval based on BPM of current track
    const bpm = this.currentTrack?.bpm || 84;
    const beatSec = 60 / bpm;
    const sixteenthSec = beatSec / 4;

    this.synthIntervalId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.currentTrack) return;

      const elapsed = (this.ctx.currentTime - this.startTime) * this.playbackRate;
      this.currentTime = elapsed;

      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.currentTime);
      }

      // Check track finish
      if (this.currentTime >= this.currentTrack.duration) {
        this.stop();
        if (this.onEndCallback) this.onEndCallback();
        return;
      }

      // Play procedural musical notes for this step
      this.playSynthStep(this.tickCounter, this.currentTrack);
      this.tickCounter = (this.tickCounter + 1) % 64; // 4-bar loop of 16th notes
    }, (sixteenthSec * 1000) / this.playbackRate);
  }

  private playSynthStep(step: number, track: Track) {
    if (!this.ctx || !this.eqFilters[0]) return;
    const now = this.ctx.currentTime;
    const destination = this.eqFilters[0];

    // Chords and Scales by preset
    // F# Minor, D Major 7, A Minor Funk, E Minor 9
    const preset = track.synthPreset;

    // 1. Kick on beat 1 and 3 (step 0, 16, 32, 48)
    if (step % 16 === 0 || step === 28 || step === 44) {
      this.triggerKick(now, destination);
    }

    // 2. Snare / Clack on beat 2 and 4 (step 8, 24, 40, 56)
    if (step % 16 === 8) {
      this.triggerSnare(now, destination);
    }

    // 3. Shaker / Hi-hat on every 2nd sixteenth note
    if (step % 2 === 0) {
      const accented = step % 4 === 2;
      this.triggerHiHat(now, destination, accented);
    }

    // 4. Bassline notes on syncopated steps
    const bassSteps = [0, 6, 12, 16, 22, 28, 32, 38, 44, 48, 54, 60];
    if (bassSteps.includes(step)) {
      const noteFreq = this.getBassFreq(preset, step);
      this.triggerBass(now, destination, noteFreq);
    }

    // 5. Lush Rhodes Electric Piano Chords on bar boundaries
    if (step % 16 === 0) {
      const chordFreqs = this.getChordFreqs(preset, Math.floor(step / 16));
      this.triggerChord(now, destination, chordFreqs);
    }

    // 6. Melodic sparkle / Arp notes
    if (step % 4 === 2 || step % 8 === 6) {
      const leadFreq = this.getLeadFreq(preset, step);
      this.triggerLead(now, destination, leadFreq);
    }
  }

  private triggerKick(time: number, dest: AudioNode) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);

    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + 0.25);
  }

  private triggerSnare(time: number, dest: AudioNode) {
    if (!this.ctx) return;
    // Tone component
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.1);
    oscGain.gain.setValueAtTime(0.2, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    osc.connect(oscGain);
    oscGain.connect(dest);
    osc.start(time);
    osc.stop(time + 0.12);

    // Noise component
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(900, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(dest);

    noise.start(time);
    noise.stop(time + 0.18);
  }

  private triggerHiHat(time: number, dest: AudioNode, accented: boolean) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(accented ? 0.09 : 0.04, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    source.start(time);
    source.stop(time + 0.04);
  }

  private triggerBass(time: number, dest: AudioNode, freq: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    // Filter envelope for warm analog punch
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, time);
    filter.frequency.exponentialRampToValueAtTime(140, time + 0.28);
    filter.Q.setValueAtTime(4, time);

    gain.gain.setValueAtTime(0.32, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.32);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + 0.35);
  }

  private triggerChord(time: number, dest: AudioNode, freqs: number[]) {
    if (!this.ctx) return;
    freqs.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      // Tape wobble LFO if active
      if (this.tapeLfoGain) {
        this.tapeLfoGain.connect(osc.detune);
      }

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.09, time + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(time);
      osc.stop(time + 1.8);
    });
  }

  private triggerLead(time: number, dest: AudioNode, freq: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    if (this.tapeLfoGain) {
      this.tapeLfoGain.connect(osc.detune);
    }

    gain.gain.setValueAtTime(0.06, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + 0.22);
  }

  // Preset harmonic scales
  private getChordFreqs(preset: string, barIndex: number): number[] {
    // Return frequencies for 4-bar progressions
    const idx = barIndex % 4;
    switch (preset) {
      case 'midnight_echo': // Dmaj7 -> Bm7 -> Gmaj7 -> A7
        const dm7 = [
          [293.66, 369.99, 440.0, 554.37], // Dmaj7
          [246.94, 293.66, 369.99, 440.0], // Bm7
          [196.0, 246.94, 293.66, 369.99], // Gmaj7
          [220.0, 277.18, 329.63, 392.0]   // A7
        ];
        return dm7[idx];
      case 'solar_funk': // Am7 -> D9 -> Fmaj7 -> E7#9
        const funk = [
          [220.0, 261.63, 329.63, 392.0],  // Am7
          [293.66, 369.99, 440.0, 523.25], // D9
          [174.61, 220.0, 261.63, 329.63], // Fmaj7
          [164.81, 207.65, 246.94, 311.13] // E7#9
        ];
        return funk[idx];
      case 'cosmic_pulse': // Em9 -> Cmaj7 -> Am9 -> Bm7
        const cosmic = [
          [164.81, 246.94, 329.63, 392.0, 493.88], // Em9
          [130.81, 196.0, 261.63, 329.63, 392.0],  // Cmaj7
          [110.0, 164.81, 220.0, 261.63, 329.63],  // Am9
          [123.47, 185.0, 246.94, 293.66, 369.99]  // Bm7
        ];
        return cosmic[idx];
      default: // tokyo_drift: F#m7 -> Dmaj7 -> C#m7 -> Bm7
        const tokyo = [
          [185.0, 220.0, 277.18, 329.63],   // F#m7
          [146.83, 185.0, 220.0, 277.18],  // Dmaj7
          [138.59, 164.81, 207.65, 246.94], // C#m7
          [123.47, 146.83, 185.0, 220.0]    // Bm7
        ];
        return tokyo[idx];
    }
  }

  private getBassFreq(preset: string, step: number): number {
    const bar = Math.floor(step / 16);
    switch (preset) {
      case 'midnight_echo':
        return [73.42, 61.74, 49.0, 55.0][bar];
      case 'solar_funk':
        return [55.0, 73.42, 43.65, 41.2][bar];
      case 'cosmic_pulse':
        return [41.2, 32.7, 55.0, 61.74][bar];
      default: // tokyo_drift
        return [46.25, 36.71, 34.65, 30.87][bar];
    }
  }

  private getLeadFreq(preset: string, step: number): number {
    const scale = [440, 493.88, 554.37, 659.25, 739.99, 880];
    const note = scale[(step * 3) % scale.length];
    return note;
  }
}

export const audioEngine = new AudioEngine();
