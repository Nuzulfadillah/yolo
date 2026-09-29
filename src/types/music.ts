export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export type SynthPreset = 'tokyo_drift' | 'midnight_echo' | 'solar_funk' | 'cosmic_pulse' | 'neon_pasar';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  bpm: number;
  genre: string;
  moodTag: string;
  colorAccent: string; // hex like #d4ff00 or #00f5d4
  synthPreset: SynthPreset;
  lyrics: LyricLine[];
  key: string;
  isFavorite?: boolean;
  audioBlobUrl?: string; // set if user uploads local file
}

export interface EqualizerSettings {
  subBass: number; // 60Hz: -12 to +12 dB
  low: number;     // 250Hz: -12 to +12 dB
  mid: number;     // 1000Hz: -12 to +12 dB
  highMid: number; // 4000Hz: -12 to +12 dB
  high: number;    // 12000Hz: -12 to +12 dB
}

export interface SoundFxSettings {
  vinylCrackle: boolean;
  vinylCrackleVolume: number; // 0 to 1
  tapeWobble: boolean;
  tapeWobbleAmount: number;   // 0 to 1
  bassBoost: boolean;
  spatialStereo: boolean;
  playbackRate: number;       // 0.75, 1.0, 1.25, 1.5
}

export type DeckViewMode = 'cassette' | 'vinyl' | 'visualizer' | 'lyrics';
