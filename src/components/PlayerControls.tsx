import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Shuffle,
  Repeat,
  Repeat1,
  Radio,
  Disc3,
  BarChart3,
  Mic2,
} from 'lucide-react';
import { DeckViewMode } from '../types/music';

interface PlayerControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  onRewind10: () => void;
  onForward10: () => void;
  currentTime: number;
  duration: number;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  repeatMode: 'off' | 'all' | 'one';
  onCycleRepeat: () => void;
  playbackRate: number;
  onChangePlaybackRate: (rate: number) => void;
  deckMode: DeckViewMode;
  onSelectDeckMode: (mode: DeckViewMode) => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onRewind10,
  onForward10,
  currentTime,
  duration,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onCycleRepeat,
  playbackRate,
  onChangePlaybackRate,
  deckMode,
  onSelectDeckMode,
}) => {
  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  const handleScrubberMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, moveX / rect.width));
    setHoverSeekTime(ratio * duration);
  };

  return (
    <div className="bg-[#12141f] border-2 border-[#26283b] rounded-3xl p-4 sm:p-6 shadow-[5px_5px_0px_#000] relative">
      {/* Top Deck Mode Switcher: "Terstruktur tapi santai & ekspresif" */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#232638]">
        <div className="flex items-center gap-1.5 p-1 bg-[#191b26] rounded-2xl border border-[#2d3148]">
          <button
            onClick={() => onSelectDeckMode('cassette')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              deckMode === 'cassette'
                ? 'bg-[#d4ff00] text-black shadow-[2px_2px_0px_#000]'
                : 'text-[#8e95ba] hover:text-white'
            }`}
          >
            <Radio size={14} />
            <span>Kaset Tape</span>
          </button>

          <button
            onClick={() => onSelectDeckMode('vinyl')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              deckMode === 'vinyl'
                ? 'bg-[#00f5d4] text-black shadow-[2px_2px_0px_#000]'
                : 'text-[#8e95ba] hover:text-white'
            }`}
          >
            <Disc3 size={14} />
            <span>Piringan Hitam</span>
          </button>

          <button
            onClick={() => onSelectDeckMode('visualizer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              deckMode === 'visualizer'
                ? 'bg-[#ff2a85] text-white shadow-[2px_2px_0px_#000]'
                : 'text-[#8e95ba] hover:text-white'
            }`}
          >
            <BarChart3 size={14} />
            <span>Spektrum</span>
          </button>

          <button
            onClick={() => onSelectDeckMode('lyrics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              deckMode === 'lyrics'
                ? 'bg-[#ff6b35] text-black shadow-[2px_2px_0px_#000]'
                : 'text-[#8e95ba] hover:text-white'
            }`}
          >
            <Mic2 size={14} />
            <span>Lirik Karaoke</span>
          </button>
        </div>

        {/* Speed / Pitch multiplier buttons */}
        <div className="flex items-center gap-1 bg-[#191b26] p-1 rounded-xl border border-[#2d3148]">
          <span className="text-[10px] font-mono-data text-[#64748b] px-1.5 uppercase font-bold">Kec:</span>
          {[0.75, 1.0, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              onClick={() => onChangePlaybackRate(rate)}
              className={`px-2 py-0.5 text-[11px] font-mono-data font-bold rounded-lg transition-colors ${
                playbackRate === rate
                  ? 'bg-white text-black font-extrabold shadow-sm'
                  : 'text-[#8288a8] hover:text-white'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Scrubber Progress Bar with Waveform Peaks */}
      <div className="mb-5">
        <div
          onClick={handleScrubberClick}
          onMouseMove={handleScrubberMouseMove}
          onMouseLeave={() => setHoverSeekTime(null)}
          className="relative h-4 bg-[#191b26] rounded-full cursor-pointer group flex items-center p-0.5 border border-[#2c3046] overflow-hidden"
        >
          {/* Faux Waveform background pattern */}
          <div className="absolute inset-0 flex items-center justify-around px-1 pointer-events-none opacity-20">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-white rounded-full"
                style={{ height: `${20 + ((i * 17) % 70)}%` }}
              ></div>
            ))}
          </div>

          {/* Filled progress bar with vibrant gradient */}
          <div
            className="h-full bg-gradient-to-r from-[#00f5d4] via-[#d4ff00] to-[#ff2a85] rounded-full relative transition-all duration-75"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Glowing drag scrubber head */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-black shadow-[0_0_8px_#d4ff00] scale-100 group-hover:scale-125 transition-transform"></div>
          </div>

          {/* Hover seek tooltip */}
          {hoverSeekTime !== null && (
            <div
              className="absolute -top-7 px-1.5 py-0.5 bg-[#0b0c12] border border-[#d4ff00] text-[#d4ff00] text-[10px] font-mono-data font-bold rounded shadow-md pointer-events-none -translate-x-1/2"
              style={{
                left: `${(hoverSeekTime / (duration || 1)) * 100}%`,
              }}
            >
              {formatTime(hoverSeekTime)}
            </div>
          )}
        </div>

        {/* Time elapsed and remaining */}
        <div className="flex justify-between items-center text-xs font-mono-data text-[#8890b5] mt-2 px-1">
          <span className="text-[#d4ff00] font-bold">{formatTime(currentTime)}</span>
          <span className="text-[#94a3b8]">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Transport Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Shuffle & Repeat toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleShuffle}
            className={`tactile-btn p-2.5 rounded-2xl border transition-all ${
              isShuffle
                ? 'bg-[#ff2a85] text-white border-black shadow-[2px_2px_0px_#000]'
                : 'bg-[#191b26] text-[#8e95ba] border-[#2c3046] hover:text-white'
            }`}
            title={isShuffle ? 'Acak Aktif' : 'Acak Nonaktif'}
          >
            <Shuffle size={16} />
          </button>

          <button
            onClick={onCycleRepeat}
            className={`tactile-btn p-2.5 rounded-2xl border transition-all ${
              repeatMode !== 'off'
                ? 'bg-[#00f5d4] text-black border-black shadow-[2px_2px_0px_#000] font-bold'
                : 'bg-[#191b26] text-[#8e95ba] border-[#2c3046] hover:text-white'
            }`}
            title={`Mode Putar: ${repeatMode.toUpperCase()}`}
          >
            {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
          </button>
        </div>

        {/* Center Playback cluster (chunky, expressive, non-sterile buttons) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onPrev}
            className="tactile-btn p-3 bg-[#1e202f] hover:bg-[#25283a] text-white rounded-2xl border-2 border-[#363a54] shadow-[3px_3px_0px_#000]"
            title="Lagu Sebelumnya"
          >
            <SkipBack size={18} />
          </button>

          <button
            onClick={onRewind10}
            className="tactile-btn p-2.5 bg-[#191b26] hover:bg-[#202333] text-[#8e95ba] hover:text-white rounded-2xl border border-[#2c3046] text-xs font-mono-data font-bold flex items-center gap-0.5 shadow-[2px_2px_0px_#000]"
            title="Mundur 10 Detik"
          >
            <RotateCcw size={14} />
            <span className="text-[10px]">10s</span>
          </button>

          {/* Master Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className="tactile-btn w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-[#d4ff00] hover:bg-[#c2ea00] text-black flex items-center justify-center border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 transition-all mx-1"
            title={isPlaying ? 'Jeda Lagu' : 'Putar Lagu'}
          >
            {isPlaying ? (
              <Pause size={28} className="fill-black" />
            ) : (
              <Play size={28} className="fill-black translate-x-0.5" />
            )}
          </button>

          <button
            onClick={onForward10}
            className="tactile-btn p-2.5 bg-[#191b26] hover:bg-[#202333] text-[#8e95ba] hover:text-white rounded-2xl border border-[#2c3046] text-xs font-mono-data font-bold flex items-center gap-0.5 shadow-[2px_2px_0px_#000]"
            title="Maju 10 Detik"
          >
            <RotateCw size={14} />
            <span className="text-[10px]">10s</span>
          </button>

          <button
            onClick={onNext}
            className="tactile-btn p-3 bg-[#1e202f] hover:bg-[#25283a] text-white rounded-2xl border-2 border-[#363a54] shadow-[3px_3px_0px_#000]"
            title="Lagu Berikutnya"
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* Tape status & analog charm stamp */}
        <div className="hidden md:flex items-center gap-2">
          <div className="px-3 py-1.5 bg-[#161824] rounded-xl border border-[#272b3e] text-right">
            <p className="text-[9px] font-mono-data text-[#64748b] uppercase">Output Audio</p>
            <p className="text-xs font-mono-data font-bold text-[#00f5d4]">STEREO 48kHz</p>
          </div>
        </div>
      </div>
    </div>
  );
};
