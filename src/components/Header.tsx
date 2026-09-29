import React from 'react';
import { Volume2, VolumeX, Upload, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeGenre: string;
  onSelectGenre: (genre: string) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeGenre,
  onSelectGenre,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  onOpenUpload,
}) => {
  const genres = ['Semua', 'Cyber Lofi', 'Lofi Bedroom', 'Retro Future Funk', 'Ambient Space Groove'];

  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-[#252836] bg-[#0c0d14]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark with vibrant accent */}
      <div className="flex items-center gap-3">
        <a href="/" className="text-xl sm:text-2xl font-extrabold tracking-tight font-display text-white flex items-center gap-2 group">
          <span className="w-3 h-3 rounded-full bg-[#d4ff00] shadow-[0_0_12px_#d4ff00] animate-pulse"></span>
          <span>SONIK<span className="text-[#d4ff00]">.</span>REBEL</span>
        </a>
      </div>

      {/* Zone 2: Clean 4-6 text navigation filters (single line, functional) */}
      <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-[#151722] rounded-xl border border-[#232736]">
        {genres.map((genre) => {
          const isActive = activeGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => onSelectGenre(genre)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#d4ff00] text-black shadow-[2px_2px_0px_#000] font-bold'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1f2233]'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1-2 primary actions (Volume & Upload custom audio) */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 bg-[#151722] border border-[#232736] px-2.5 py-1.5 rounded-xl">
          <button
            onClick={onToggleMute}
            className="text-[#94a3b8] hover:text-[#d4ff00] transition-colors p-1"
            title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
          >
            {isMuted || volume === 0 ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-16 sm:w-20 h-1.5 bg-[#252836] rounded-lg appearance-none cursor-pointer accent-[#d4ff00]"
          />
        </div>

        <button
          onClick={onOpenUpload}
          className="tactile-btn flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-black bg-[#00f5d4] hover:bg-[#00dfc2] rounded-xl border border-black/40 shadow-[2px_2px_0px_#000] whitespace-nowrap"
          title="Upload MP3 / Audio Sendiri"
        >
          <Upload size={14} />
          <span className="hidden sm:inline">Upload Audio</span>
        </button>
      </div>
    </header>
  );
};
