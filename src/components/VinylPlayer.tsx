import React, { useState } from 'react';
import { Track } from '../types/music';
import { Play, Pause, Disc, Zap, Volume2, MoveHorizontal } from 'lucide-react';

interface VinylPlayerProps {
  track: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime?: number;
  duration?: number;
  playbackRate?: number;
  onChangePlaybackRate?: (rate: number) => void;
}

export const VinylPlayer: React.FC<VinylPlayerProps> = ({
  track,
  isPlaying,
  onTogglePlay,
  currentTime = 0,
  duration = 180,
  playbackRate = 1.0,
  onChangePlaybackRate,
}) => {
  const [rpm, setRpm] = useState<33 | 45>(33);
  const [pitchOffset, setPitchOffset] = useState<number>(0); // -8% to +8%
  const [isScratching, setIsScratching] = useState(false);

  // Compute realistic tonearm angle:
  // Rest position on cradle = 0 deg
  // Outer lead-in groove = 18 deg
  // Inner runout groove = 33 deg
  const progressRatio = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
  const needleAngle = isPlaying ? 17 + progressRatio * 15 : 0;

  const handlePitchChange = (newPitch: number) => {
    setPitchOffset(newPitch);
    if (onChangePlaybackRate) {
      // Map -8%..+8% to multiplier 0.92..1.08
      const multiplier = parseFloat((1 + newPitch / 100).toFixed(2));
      onChangePlaybackRate(multiplier);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-[#11121b] border-4 border-[#252839] rounded-3xl p-4 sm:p-6 shadow-[7px_7px_0px_#000] select-none overflow-hidden">
      {/* 4 Corner Heavy Isolation Rubber Feet */}
      <div className="absolute top-2 left-2 w-3.5 h-3.5 rounded-full bg-[#1e202c] border border-[#3b3f56]"></div>
      <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-[#1e202c] border border-[#3b3f56]"></div>
      <div className="absolute bottom-2 left-2 w-3.5 h-3.5 rounded-full bg-[#1e202c] border border-[#3b3f56]"></div>
      <div className="absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full bg-[#1e202c] border border-[#3b3f56]"></div>

      {/* Top Plinth Header Bar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#222538]">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <span className={`w-2.5 h-2.5 rounded-full transition-colors ${isPlaying ? 'bg-[#d4ff00] shadow-[0_0_8px_#d4ff00]' : 'bg-[#474c69]'}`}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a85]"></span>
          </div>
          <span className="text-xs font-mono-data font-black tracking-wider text-white uppercase font-display">
            TECHNIKA DIRECT-DRIVE <span className="text-[#d4ff00]">SL-2026</span>
          </span>
          <span className="hidden sm:inline text-[9px] font-mono-data px-2 py-0.5 bg-[#1b1d2a] text-[#8e95b8] rounded border border-[#2b2f44]">
            QUARTZ LOCK
          </span>
        </div>

        {/* Strobe power & Status */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono-data text-[#8890b5]">JARUM:</span>
          <span className={`text-[10px] font-mono-data font-bold px-2 py-0.5 rounded ${
            isPlaying ? 'bg-[#d4ff00]/15 text-[#d4ff00] border border-[#d4ff00]/30' : 'bg-[#1e2130] text-[#64748b]'
          }`}>
            {isPlaying ? 'MENEMPEL DI PIRINGAN' : 'DI TEMPAT DUDUK'}
          </span>
        </div>
      </div>

      {/* Main Turntable Deck (Grid: Platter on left/center + Tonearm & Pitch on right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#090a10] border-2 border-[#1e2132] rounded-2xl p-3 sm:p-5 relative overflow-hidden">
        {/* Playful Tilted Vinyl Quality Sticker */}
        <div className="absolute top-2 left-2 bg-[#d4ff00] text-black text-[9px] font-black uppercase px-2 py-0.5 -rotate-3 shadow-[2px_2px_0px_#000] z-20">
          HEAVYWEIGHT 180G VIRGIN VINYL
        </div>

        {/* LEFT / CENTER: Platter & Vinyl Disc (md:col-span-8) */}
        <div className="md:col-span-8 flex flex-col items-center justify-center relative py-2">
          {/* Stylus Target Light Tower (illuminates platter rim) */}
          <div className="absolute top-2 left-1 z-20 flex items-center gap-1.5">
            <div className={`w-3.5 h-8 rounded-t-sm border border-[#3b405c] flex flex-col items-center justify-start pt-1 ${
              isPlaying ? 'bg-[#ffe600] shadow-[0_0_12px_#ffe600]' : 'bg-[#25283a]'
            }`}>
              <div className="w-1.5 h-2 bg-white rounded-full"></div>
            </div>
            {isPlaying && (
              <span className="text-[8px] font-mono-data text-[#ffe600] font-bold">LAMP ON</span>
            )}
          </div>

          {/* Turntable Platter Well (recessed metallic rim with stroboscope dots) */}
          <div className="relative p-2.5 rounded-full bg-[#181a24] border-4 border-[#2b2f42] shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] flex items-center justify-center">
            {/* Platter outer rim with dots pattern */}
            <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none"></div>

            {/* Rotating Vinyl Disc */}
            <div
              onClick={onTogglePlay}
              onMouseDown={() => setIsScratching(true)}
              onMouseUp={() => setIsScratching(false)}
              onMouseLeave={() => setIsScratching(false)}
              className={`cursor-pointer relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-[#08090d] border-4 border-[#202330] shadow-[0_0_28px_rgba(0,0,0,0.95)] flex items-center justify-center transition-transform ${
                isPlaying && !isScratching
                  ? rpm === 45
                    ? 'animate-spin'
                    : 'animate-spin-slow'
                  : 'animate-spin-paused'
              }`}
              style={{
                backgroundImage: `radial-gradient(circle, #1a1c28 0%, #0d0e14 25%, #181926 40%, #090a0f 65%, #161724 82%, #06070a 100%)`,
              }}
              title={isPlaying ? 'Klik piringan untuk Jeda' : 'Klik piringan untuk Putar'}
            >
              {/* Micro-groove soundwave rings */}
              <div className="absolute inset-2.5 rounded-full border border-white/5 pointer-events-none"></div>
              <div className="absolute inset-5 rounded-full border border-white/10 pointer-events-none"></div>
              <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none"></div>
              <div className="absolute inset-12 rounded-full border border-white/5 pointer-events-none"></div>
              <div className="absolute inset-16 rounded-full border border-white/10 pointer-events-none"></div>

              {/* Light reflection sheen */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none opacity-45"
                style={{
                  background: `conic-gradient(from 60deg, transparent 0deg, rgba(255,255,255,0.18) 45deg, transparent 90deg, transparent 180deg, rgba(255,255,255,0.18) 225deg, transparent 270deg)`,
                }}
              ></div>

              {/* Center Vinyl Label with Album Art */}
              <div className="relative z-10 w-24 h-24 sm:w-26 sm:h-26 rounded-full border-2 border-[#d4ff00] overflow-hidden shadow-[0_0_14px_rgba(212,255,0,0.35)] flex items-center justify-center">
                <img
                  src={track.coverUrl}
                  alt={track.album}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {/* Spindle metal center hole */}
                <div className="absolute w-4 h-4 rounded-full bg-[#0a0a0f] border-2 border-white/90 z-20 shadow-inner"></div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Tonearm Assembly & Pitch Fader (md:col-span-4) */}
        <div className="md:col-span-4 flex flex-col justify-between h-full space-y-4 pt-1">
          {/* Tonearm Realistic Housing */}
          <div className="bg-[#131520] border border-[#272b3e] rounded-xl p-3 relative h-48 sm:h-52 flex flex-col justify-between overflow-hidden shadow-inner">
            <div className="flex justify-between items-center pb-1 border-b border-[#232738]">
              <span className="text-[9px] font-mono-data font-bold text-[#8890b8] uppercase">TONEARM S-SHAPE</span>
              <span className="text-[9px] font-mono-data text-[#00f5d4]">ANTI-SKATE 1.8g</span>
            </div>

            {/* Tonearm graphical assembly */}
            <div className="relative flex-1 flex items-center justify-center">
              {/* Arm rest cradle stand */}
              <div className="absolute right-6 top-16 w-3 h-8 border-r-2 border-t-2 border-[#454c6d] rounded-tr-md flex flex-col items-center">
                <div className="w-4 h-1.5 bg-[#ff2a85] rounded-full -mt-1 shadow-sm"></div>
              </div>

              {/* Tonearm base pivot */}
              <div
                className="relative transition-transform duration-700 ease-out origin-center"
                style={{
                  transform: `rotate(${needleAngle}deg)`,
                }}
              >
                {/* Metallic Gimbal Base & Counterweight */}
                <div className="w-12 h-12 rounded-full bg-[#25283a] border-2 border-[#474d6d] shadow-md flex items-center justify-center relative">
                  {/* Counterweight cylinder */}
                  <div className="absolute -top-3 w-7 h-4 bg-[#393e56] border border-[#596185] rounded-sm shadow-sm flex items-center justify-center">
                    <span className="text-[6px] font-mono-data text-white font-bold">1.5g</span>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#12131b] border border-[#3b415a]"></div>
                </div>

                {/* S-Shaped Tone Arm Rod */}
                <div className="w-1.5 h-28 sm:h-32 bg-gradient-to-r from-[#cbd5e1] via-[#94a3b8] to-[#64748b] ml-5 shadow-lg rounded-full origin-top relative">
                  {/* Cartridge headshell & stylus needle tip */}
                  <div className="absolute bottom-0 -left-2.5 w-6 h-8 bg-[#ff5500] border border-black rounded-sm shadow-md flex flex-col items-center justify-between p-0.5 -rotate-12">
                    <span className="text-[5px] font-black text-black leading-none uppercase">ORTOFON</span>
                    <div className="w-1 h-2.5 bg-white rounded-full"></div>
                    <div className="w-0.5 h-1 bg-[#ffe600] -mb-1 shadow-[0_0_4px_#ffe600]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cueing status */}
            <div className="flex justify-between items-center text-[9px] font-mono-data text-[#8890b8]">
              <span>CUE LEVER:</span>
              <span className={`font-bold ${isPlaying ? 'text-[#d4ff00]' : 'text-[#8890b8]'}`}>
                {isPlaying ? 'DOWN [PLAY]' : 'UP [LIFTED]'}
              </span>
            </div>
          </div>

          {/* Pitch / Tempo Adjustment Fader Slider (Technics style ±8%) */}
          <div className="bg-[#131520] border border-[#272b3e] rounded-xl p-2.5 shadow-inner">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-mono-data font-bold text-[#8890b8] uppercase">PITCH ADJ</span>
              <span className={`text-[10px] font-mono-data font-bold ${pitchOffset === 0 ? 'text-[#00f5d4]' : 'text-[#d4ff00]'}`}>
                {pitchOffset > 0 ? `+${pitchOffset}%` : `${pitchOffset}%`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono-data text-[#64748b]">-8%</span>
              <input
                type="range"
                min="-8"
                max="8"
                step="1"
                value={pitchOffset}
                onChange={(e) => handlePitchChange(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#25283a] rounded-lg appearance-none cursor-pointer accent-[#d4ff00]"
              />
              <span className="text-[8px] font-mono-data text-[#64748b]">+8%</span>
            </div>

            <div className="flex justify-between items-center mt-1 text-[8px] font-mono-data">
              <span className="text-[#64748b]">0% QUARTZ LOCK</span>
              <button
                onClick={() => handlePitchChange(0)}
                className="text-[8px] px-1.5 py-0.5 bg-[#1f2233] hover:bg-[#2b2f46] text-[#8e95b8] hover:text-white rounded border border-[#2d3248]"
              >
                RESET
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Turntable Plinth Bottom Control Panel */}
      <div className="mt-4 pt-3 border-t border-[#222538] flex flex-wrap items-center justify-between gap-3">
        {/* Left: Big Tactile START / STOP Button & 33/45 RPM Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Primary Heavy START / STOP Button */}
          <button
            onClick={onTogglePlay}
            className={`tactile-btn flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 font-mono-data text-xs font-black uppercase transition-all ${
              isPlaying
                ? 'bg-[#ff2a85] text-white border-black shadow-[3px_3px_0px_#000]'
                : 'bg-[#d4ff00] text-black border-black shadow-[3px_3px_0px_#000]'
            }`}
          >
            {isPlaying ? <Pause size={15} className="fill-white" /> : <Play size={15} className="fill-black" />}
            <span>{isPlaying ? 'STOP' : 'START'}</span>
          </button>

          {/* Tactile Round 33 / 45 RPM Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-[#161824] rounded-xl border border-[#272b3e]">
            <button
              onClick={() => setRpm(33)}
              className={`px-2.5 py-1 text-[11px] font-mono-data font-bold rounded-lg transition-colors ${
                rpm === 33
                  ? 'bg-white text-black font-black shadow-sm'
                  : 'text-[#8890b5] hover:text-white'
              }`}
            >
              33⅓
            </button>
            <button
              onClick={() => setRpm(45)}
              className={`px-2.5 py-1 text-[11px] font-mono-data font-bold rounded-lg transition-colors ${
                rpm === 45
                  ? 'bg-white text-black font-black shadow-sm'
                  : 'text-[#8890b5] hover:text-white'
              }`}
            >
              45
            </button>
          </div>
        </div>

        {/* Right: Now Playing Vinyl Sticker Tag */}
        <div className="flex items-center gap-2 bg-[#161824] px-3 py-1.5 rounded-xl border border-[#272b3e] -rotate-1 shadow-[2px_2px_0px_#000]">
          <Disc size={15} className="text-[#d4ff00] animate-spin-slow" />
          <div className="truncate max-w-[200px] sm:max-w-xs">
            <span className="text-[11px] font-bold text-white truncate block">
              {track.title}
            </span>
            <span className="text-[9px] font-mono-data text-[#8e95b8] truncate block">
              {track.artist} · {track.genre}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
