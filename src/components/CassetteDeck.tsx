import React from 'react';
import { Track } from '../types/music';

interface CassetteDeckProps {
  track: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export const CassetteDeck: React.FC<CassetteDeckProps> = ({
  track,
  isPlaying,
  currentTime,
  duration,
}) => {
  const progressRatio = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  // Left spool shrinks as tape plays, right spool expands
  const leftSpoolRadius = 38 - progressRatio * 18; // 38px down to 20px
  const rightSpoolRadius = 20 + progressRatio * 18; // 20px up to 38px

  // Format tape counter
  const counterValue = Math.floor(currentTime * 10).toString().padStart(4, '0');

  return (
    <div className="relative w-full max-w-lg mx-auto bg-[#13141f] border-4 border-[#252838] rounded-3xl p-5 sm:p-7 shadow-[6px_6px_0px_#000] select-none">
      {/* 4 Corner Mechanical Screws */}
      <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-[#2a2c3f] border border-[#444964] flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-[#171822]"></div>
      </div>
      <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[#2a2c3f] border border-[#444964] flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-[#171822]"></div>
      </div>
      <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-[#2a2c3f] border border-[#444964] flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-[#171822]"></div>
      </div>
      <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-[#2a2c3f] border border-[#444964] flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-[#171822]"></div>
      </div>

      {/* Cassette Upper Sticker Area */}
      <div className="bg-[#1e202f] border-2 border-[#333852] rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-inner">
        {/* Playful tilted badge: "Gak mau rapi-rapi kali" */}
        <div className="absolute -top-1 -right-1 bg-[#ff2a85] text-black text-[10px] font-black uppercase px-3 py-0.5 rotate-3 shadow-[2px_2px_0px_#000] z-20">
          TYPE II · CrO2
        </div>

        {/* Top Header Row with Side A & Track Info */}
        <div className="flex items-center justify-between border-b border-[#373c57] pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#d4ff00] text-black font-black px-2 py-0.5 rounded text-xs -rotate-1 shadow-[1px_1px_0px_#000]">
              SIDE A
            </span>
            <span className="text-[11px] font-mono-data text-[#8890b5] tracking-widest uppercase">
              Hi-Fi Stereo 90 min
            </span>
          </div>

          {/* Tape Counter */}
          <div className="flex items-center gap-1.5 bg-[#0e0f17] px-2.5 py-1 rounded border border-[#2d3148]">
            <span className="text-[9px] text-[#636b8f] font-mono-data font-bold">COUNT</span>
            <span className="text-xs font-mono-data font-bold text-[#00f5d4] tracking-widest">
              {counterValue}
            </span>
          </div>
        </div>

        {/* Handwritten Track Label Area */}
        <div className="bg-[#12131d] border border-[#2b2f48] rounded-xl px-3 py-2 mb-4 flex items-center justify-between">
          <div className="truncate mr-2">
            <p className="text-xs sm:text-sm font-extrabold text-white truncate font-display">
              {track.title}
            </p>
            <p className="text-[11px] text-[#9ca3af] truncate">
              {track.artist}
            </p>
          </div>
          <span
            className="text-[10px] font-mono-data font-bold px-2 py-0.5 rounded uppercase shrink-0"
            style={{ backgroundColor: `${track.colorAccent}20`, color: track.colorAccent }}
          >
            {track.genre}
          </span>
        </div>

        {/* Transparent Tape Window with Spools */}
        <div className="bg-[#0b0c13] border-2 border-[#2b2f48] rounded-xl p-3 relative h-28 sm:h-32 flex items-center justify-between overflow-hidden shadow-inner">
          {/* Subtle measurement ruler marks inside window */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 flex gap-2 text-[8px] font-mono-data text-[#494f72]">
            <span>100</span>
            <span>·</span>
            <span>50</span>
            <span>·</span>
            <span>0</span>
          </div>

          {/* Magnetic tape ribbon running across middle */}
          <div className="absolute top-1/2 -translate-y-1/2 left-10 right-10 h-14 bg-[#1b1814] -z-0 rounded-sm border-t border-b border-[#2d2822]"></div>

          {/* Left Reel (Source) */}
          <div className="relative z-10 flex items-center justify-center w-24 h-24">
            {/* Magnetic Tape Winding Layer */}
            <div
              className="absolute rounded-full bg-[#2f2720] border border-[#43372c] transition-all duration-300"
              style={{
                width: `${leftSpoolRadius * 2}px`,
                height: `${leftSpoolRadius * 2}px`,
              }}
            ></div>

            {/* White/Silver Cassette Gear Spool */}
            <div
              className={`w-14 h-14 rounded-full bg-[#e2e8f0] border-2 border-[#94a3b8] flex items-center justify-center shadow-md ${
                isPlaying ? 'animate-spin-slow' : 'animate-spin-paused'
              }`}
            >
              {/* Spool teeth / cogs */}
              <div className="w-9 h-9 rounded-full bg-[#181a24] border border-[#4b526d] flex items-center justify-center relative">
                <div className="absolute w-1 h-3 bg-[#e2e8f0] rounded-sm top-0"></div>
                <div className="absolute w-1 h-3 bg-[#e2e8f0] rounded-sm bottom-0"></div>
                <div className="absolute h-1 w-3 bg-[#e2e8f0] rounded-sm left-0"></div>
                <div className="absolute h-1 w-3 bg-[#e2e8f0] rounded-sm right-0"></div>
                <div className="w-4 h-4 rounded-full bg-[#0b0c13]"></div>
              </div>
            </div>
          </div>

          {/* Center Tape Guide Window */}
          <div className="z-10 flex flex-col items-center">
            <div className="w-12 h-6 border border-[#2e334d] rounded-md bg-[#161824]/60 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-pulse"></span>
            </div>
            <span className="text-[8px] font-mono-data text-[#596085] mt-1">NR ON</span>
          </div>

          {/* Right Reel (Take-up) */}
          <div className="relative z-10 flex items-center justify-center w-24 h-24">
            {/* Magnetic Tape Winding Layer */}
            <div
              className="absolute rounded-full bg-[#2f2720] border border-[#43372c] transition-all duration-300"
              style={{
                width: `${rightSpoolRadius * 2}px`,
                height: `${rightSpoolRadius * 2}px`,
              }}
            ></div>

            {/* White/Silver Cassette Gear Spool */}
            <div
              className={`w-14 h-14 rounded-full bg-[#e2e8f0] border-2 border-[#94a3b8] flex items-center justify-center shadow-md ${
                isPlaying ? 'animate-spin-slow' : 'animate-spin-paused'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-[#181a24] border border-[#4b526d] flex items-center justify-center relative">
                <div className="absolute w-1 h-3 bg-[#e2e8f0] rounded-sm top-0"></div>
                <div className="absolute w-1 h-3 bg-[#e2e8f0] rounded-sm bottom-0"></div>
                <div className="absolute h-1 w-3 bg-[#e2e8f0] rounded-sm left-0"></div>
                <div className="absolute h-1 w-3 bg-[#e2e8f0] rounded-sm right-0"></div>
                <div className="w-4 h-4 rounded-full bg-[#0b0c13]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trapezoid Cutout detail typical of cassettes */}
        <div className="mt-3 flex justify-between items-center px-4">
          <div className="w-4 h-4 rounded-sm bg-[#13141f] border border-[#2a2c3f]"></div>
          <div className="w-20 h-2 bg-[#13141f] rounded-full border border-[#2a2c3f]"></div>
          <div className="w-4 h-4 rounded-sm bg-[#13141f] border border-[#2a2c3f]"></div>
        </div>
      </div>
    </div>
  );
};
