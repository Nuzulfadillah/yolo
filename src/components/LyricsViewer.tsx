import React, { useEffect, useRef } from 'react';
import { Track } from '../types/music';
import { Mic2, Clock } from 'lucide-react';

interface LyricsViewerProps {
  track: Track;
  currentTime: number;
  onSeek: (seconds: number) => void;
}

export const LyricsViewer: React.FC<LyricsViewerProps> = ({
  track,
  currentTime,
  onSeek,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  // Find index of current lyric line
  const activeIndex = track.lyrics.reduce((acc, line, idx) => {
    return currentTime >= line.time ? idx : acc;
  }, -1);

  // Auto-scroll when active line changes
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  const formatLyricTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#12141f] border-2 border-[#26283b] rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_#000] relative">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#232738]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#ff6b35] text-black rounded-lg shadow-[1px_1px_0px_#000]">
            <Mic2 size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-display">Lirik Tersinkron</h3>
            <p className="text-[10px] font-mono-data text-[#8890b5]">
              {track.title} · Klik baris untuk lompat waktu
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono-data px-2 py-0.5 bg-[#191b26] border border-[#2b2f44] text-[#d4ff00] rounded-md">
          LIVE TIMECODE
        </span>
      </div>

      <div
        ref={containerRef}
        className="max-h-72 overflow-y-auto pr-2 space-y-3 scroll-smooth"
      >
        {track.lyrics.length > 0 ? (
          track.lyrics.map((line, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;

            return (
              <div
                key={idx}
                ref={isActive ? activeLineRef : null}
                onClick={() => onSeek(line.time)}
                className={`group flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#1e2233] border-l-4 border-[#d4ff00] text-white shadow-md scale-[1.01]'
                    : isPast
                    ? 'text-[#64748b] hover:text-[#94a3b8] hover:bg-[#161824]'
                    : 'text-[#94a3b8] hover:text-white hover:bg-[#161824]'
                }`}
              >
                <span
                  className={`text-[10px] font-mono-data pt-0.5 shrink-0 ${
                    isActive ? 'text-[#d4ff00] font-bold' : 'text-[#475569] group-hover:text-[#64748b]'
                  }`}
                >
                  {formatLyricTime(line.time)}
                </span>
                <p
                  className={`text-sm sm:text-base leading-relaxed ${
                    isActive
                      ? 'font-bold text-[#d4ff00] tracking-wide'
                      : 'font-normal'
                  }`}
                >
                  {line.text}
                </p>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-[#64748b] text-sm">
            Lirik instrumental belum tersedia untuk trek ini.
          </div>
        )}
      </div>
    </div>
  );
};
