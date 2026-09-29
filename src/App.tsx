/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_TRACKS } from './data/mockTracks';
import { Track, EqualizerSettings, SoundFxSettings, DeckViewMode } from './types/music';
import { audioEngine } from './utils/audioEngine';
import { Header } from './components/Header';
import { CassetteDeck } from './components/CassetteDeck';
import { VinylPlayer } from './components/VinylPlayer';
import { AudioVisualizer } from './components/AudioVisualizer';
import { VUAnalogMeter } from './components/VUAnalogMeter';
import { PlayerControls } from './components/PlayerControls';
import { SoundConsole } from './components/SoundConsole';
import { PlaylistQueue } from './components/PlaylistQueue';
import { LyricsViewer } from './components/LyricsViewer';
import { UploadModal } from './components/UploadModal';
import { Sparkles, SlidersHorizontal, Music2, Headphones, Radio } from 'lucide-react';

export default function App() {
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('all');
  const [deckMode, setDeckMode] = useState<DeckViewMode>('cassette');
  const [activeGenre, setActiveGenre] = useState('Semua');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Equalizer & FX State
  const [eq, setEq] = useState<EqualizerSettings>({
    subBass: 3,
    low: 2,
    mid: 0,
    highMid: 2,
    high: 4,
  });

  const [fx, setFx] = useState<SoundFxSettings>({
    vinylCrackle: true,
    vinylCrackleVolume: 0.35,
    tapeWobble: false,
    tapeWobbleAmount: 0.4,
    bassBoost: false,
    spatialStereo: true,
    playbackRate: 1.0,
  });

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Callback when track reaches the end
  const handleTrackEnd = useCallback(() => {
    if (repeatMode === 'one') {
      audioEngine.seek(0);
      audioEngine.play();
      return;
    }

    if (isShuffle) {
      let nextIdx = Math.floor(Math.random() * tracks.length);
      if (tracks.length > 1 && nextIdx === currentTrackIndex) {
        nextIdx = (nextIdx + 1) % tracks.length;
      }
      setCurrentTrackIndex(nextIdx);
    } else {
      if (currentTrackIndex < tracks.length - 1) {
        setCurrentTrackIndex((prev) => prev + 1);
      } else if (repeatMode === 'all') {
        setCurrentTrackIndex(0);
      } else {
        setIsPlaying(false);
      }
    }
  }, [repeatMode, isShuffle, tracks.length, currentTrackIndex]);

  // Sync callbacks with audioEngine
  useEffect(() => {
    audioEngine.setCallbacks(
      (time) => {
        setCurrentTime(time);
      },
      () => {
        handleTrackEnd();
      }
    );
  }, [handleTrackEnd]);

  // Load track when currentTrackIndex changes
  useEffect(() => {
    if (currentTrack) {
      audioEngine.loadTrack(currentTrack, isPlaying);
    }
  }, [currentTrackIndex]);

  // Handle Play/Pause toggle
  const handleTogglePlay = async () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      await audioEngine.play();
      setIsPlaying(true);
    }
  };

  // Skip Next / Prev
  const handleNextTrack = () => {
    if (isShuffle) {
      const rand = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(rand);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    if (currentTime > 3) {
      audioEngine.seek(0);
      setCurrentTime(0);
      return;
    }
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const handleSeek = (seconds: number) => {
    audioEngine.seek(seconds);
    setCurrentTime(seconds);
  };

  const handleRewind10 = () => {
    const target = Math.max(0, currentTime - 10);
    handleSeek(target);
  };

  const handleForward10 = () => {
    const target = Math.min(currentTrack.duration, currentTime + 10);
    handleSeek(target);
  };

  // Volume
  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    setIsMuted(false);
    audioEngine.setVolume(vol);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setVolume(volume);
    } else {
      setIsMuted(true);
      audioEngine.setVolume(0);
    }
  };

  // Playback Rate
  const handleChangePlaybackRate = (rate: number) => {
    const newFx = { ...fx, playbackRate: rate };
    setFx(newFx);
    audioEngine.setSoundFx(newFx);
  };

  // Equalizer Change
  const handleChangeEq = (newEq: EqualizerSettings) => {
    setEq(newEq);
    audioEngine.setEqualizer(newEq);
  };

  // Sound FX Change
  const handleChangeFx = (newFx: SoundFxSettings) => {
    setFx(newFx);
    audioEngine.setSoundFx(newFx);
  };

  // Favorite toggle
  const handleToggleFavorite = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, isFavorite: !t.isFavorite } : t))
    );
  };

  // Repeat Mode cycle: off -> all -> one -> off
  const handleCycleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  // Add Uploaded Track
  const handleAddTrack = (newTrack: Track) => {
    setTracks((prev) => [newTrack, ...prev]);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
  };

  // Keyboard Shortcuts (Space to play/pause, Left/Right arrows to seek)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleRewind10();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleForward10();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTime, currentTrack.duration]);

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#e2e8f0] flex flex-col selection:bg-[#d4ff00] selection:text-black">
      {/* 3-Zone Top Bar Navigation */}
      <Header
        activeGenre={activeGenre}
        onSelectGenre={(genre) => {
          setActiveGenre(genre);
          if (genre !== 'Semua') {
            const foundIdx = tracks.findIndex((t) => t.genre === genre);
            if (foundIdx !== -1) {
              setCurrentTrackIndex(foundIdx);
            }
          }
        }}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenUpload={() => setIsUploadModalOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Subtle Mood Kicker: "Gelap tapi cerah, terstruktur tapi ekspresif" */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-data uppercase tracking-wider text-[#94a3b8]">
              Sekarang Memutar
            </span>
            <span className="text-[#475569]">·</span>
            <span
              className="text-xs font-mono-data font-bold px-2 py-0.5 rounded uppercase"
              style={{
                backgroundColor: `${currentTrack.colorAccent}20`,
                color: currentTrack.colorAccent,
              }}
            >
              {currentTrack.genre}
            </span>
            <span className="text-[#475569]">·</span>
            <span className="text-xs font-mono-data text-[#8890b5]">
              {currentTrack.bpm} BPM · {currentTrack.key}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-data text-[#8890b5]">
            <span className="w-2 h-2 rounded-full bg-[#00f5d4] animate-ping"></span>
            <span className="hidden sm:inline">Tekan Spasi untuk Putar/Jeda</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Player Stage & Master Controls (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Center Deck Mode Rendering */}
            <div className="relative">
              {deckMode === 'cassette' && (
                <CassetteDeck
                  track={currentTrack}
                  isPlaying={isPlaying}
                  currentTime={currentTime}
                  duration={currentTrack.duration}
                />
              )}

              {deckMode === 'vinyl' && (
                <VinylPlayer
                  track={currentTrack}
                  isPlaying={isPlaying}
                  onTogglePlay={handleTogglePlay}
                  currentTime={currentTime}
                  duration={currentTrack.duration}
                  playbackRate={fx.playbackRate}
                  onChangePlaybackRate={handleChangePlaybackRate}
                />
              )}

              {deckMode === 'visualizer' && (
                <AudioVisualizer
                  isPlaying={isPlaying}
                  colorAccent={currentTrack.colorAccent}
                />
              )}

              {deckMode === 'lyrics' && (
                <LyricsViewer
                  track={currentTrack}
                  currentTime={currentTime}
                  onSeek={handleSeek}
                />
              )}
            </div>

            {/* Dual Analog VU Meter */}
            <VUAnalogMeter isPlaying={isPlaying} />

            {/* Master Transport Controls */}
            <PlayerControls
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onPrev={handlePrevTrack}
              onNext={handleNextTrack}
              onSeek={handleSeek}
              onRewind10={handleRewind10}
              onForward10={handleForward10}
              currentTime={currentTime}
              duration={currentTrack.duration}
              isShuffle={isShuffle}
              onToggleShuffle={() => setIsShuffle(!isShuffle)}
              repeatMode={repeatMode}
              onCycleRepeat={handleCycleRepeat}
              playbackRate={fx.playbackRate}
              onChangePlaybackRate={handleChangePlaybackRate}
              deckMode={deckMode}
              onSelectDeckMode={setDeckMode}
            />

            {/* Sound Console (Equalizer & Tactile FX) */}
            <SoundConsole
              eq={eq}
              onChangeEq={handleChangeEq}
              fx={fx}
              onChangeFx={handleChangeFx}
            />
          </div>

          {/* Right Column: Playlist & Up Next Queue (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <PlaylistQueue
              tracks={tracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onSelectTrack={(track) => {
                const idx = tracks.findIndex((t) => t.id === track.id);
                if (idx !== -1) {
                  setCurrentTrackIndex(idx);
                  setIsPlaying(true);
                }
              }}
              onTogglePlay={handleTogglePlay}
              onToggleFavorite={handleToggleFavorite}
              onUploadTrack={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const url = URL.createObjectURL(file);
                  const newTrack: Track = {
                    id: `uploaded-${Date.now()}`,
                    title: file.name.replace(/\.[^/.]+$/, ''),
                    artist: 'File Lokal Pengguna',
                    album: 'Koleksi MP3',
                    duration: 180,
                    coverUrl: currentTrack.coverUrl,
                    bpm: 110,
                    genre: 'File Audio',
                    moodTag: 'Koleksi Saya',
                    colorAccent: '#d4ff00',
                    synthPreset: 'tokyo_drift',
                    audioBlobUrl: url,
                    key: 'Stereo',
                    isFavorite: true,
                    lyrics: [
                      { time: 0, text: `♪ [Trek audio lokal: ${file.name}] ♪` },
                      { time: 4, text: 'Diproses melalui equalizer & filter pita analog' }
                    ]
                  };
                  handleAddTrack(newTrack);
                }
              }}
            />

            {/* Now Playing Detailed Card with Tactile Badges */}
            <div className="bg-[#12141f] border-2 border-[#26283b] rounded-3xl p-5 shadow-[5px_5px_0px_#000] relative overflow-hidden">
              <div className="flex items-center gap-4">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#2d3248] shadow-md -rotate-2"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono-data uppercase text-[#8890b5]">
                    Sedang Dinikmati
                  </span>
                  <h4 className="text-base font-extrabold text-white truncate font-display">
                    {currentTrack.title}
                  </h4>
                  <p className="text-xs text-[#94a3b8] truncate">{currentTrack.artist}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#232738] flex items-center justify-between text-xs font-mono-data text-[#8890b5]">
                <div className="flex items-center gap-1.5">
                  <Headphones size={14} className="text-[#00f5d4]" />
                  <span>Hi-Res Audio 48kHz</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Radio size={14} className="text-[#ff6b35]" />
                  <span>{fx.vinylCrackle ? 'Vinyl On' : 'Clean'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddTrack={handleAddTrack}
        currentTrackCover={currentTrack.coverUrl}
      />
    </div>
  );
}
