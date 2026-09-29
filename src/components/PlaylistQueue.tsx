import React, { useState } from 'react';
import { Track } from '../types/music';
import { Search, Heart, Play, Pause, Music, Upload, Plus } from 'lucide-react';

interface PlaylistQueueProps {
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  onTogglePlay: () => void;
  onToggleFavorite: (trackId: string) => void;
  onUploadTrack: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PlaylistQueue: React.FC<PlaylistQueueProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onTogglePlay,
  onToggleFavorite,
  onUploadTrack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<string>('Semua');

  const moods = ['Semua', 'Favorit', 'Malam Santai', 'Energi Ceria', 'Deep Focus'];

  const filteredTracks = tracks.filter((track) => {
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.genre.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMood === 'Favorit') {
      return track.isFavorite;
    }
    if (filterMood !== 'Semua') {
      return track.moodTag === filterMood;
    }
    return true;
  });

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#12141f] border-2 border-[#26283b] rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_#000] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#24273a]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d4ff00] shadow-[0_0_8px_#d4ff00]"></span>
          <h2 className="text-base font-extrabold text-white font-display tracking-tight">
            Daftar Putar & Antrean
          </h2>
          <span className="text-xs font-mono-data text-[#8890b5] bg-[#1a1c29] px-2 py-0.5 rounded-md border border-[#2b2f44]">
            {filteredTracks.length} Lagu
          </span>
        </div>

        {/* Upload Audio Button */}
        <label className="tactile-btn cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-black bg-[#d4ff00] hover:bg-[#c3ec00] rounded-xl border border-black shadow-[2px_2px_0px_#000]">
          <Plus size={14} />
          <span>Tambah File</span>
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={onUploadTrack}
          />
        </label>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
        <input
          type="text"
          placeholder="Cari lagu, artis, atau genre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#181a26] border border-[#2d3248] rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#d4ff00] focus:ring-1 focus:ring-[#d4ff00]"
        />
      </div>

      {/* Mood filter tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {moods.map((mood) => {
          const isActive = filterMood === mood;
          return (
            <button
              key={mood}
              onClick={() => setFilterMood(mood)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'bg-[#181a26] text-[#8e95ba] hover:text-white border border-[#272b3e]'
              }`}
            >
              {mood}
            </button>
          );
        })}
      </div>

      {/* Track List */}
      <div className="space-y-2 overflow-y-auto max-h-[420px] pr-1 flex-1">
        {filteredTracks.length > 0 ? (
          filteredTracks.map((track) => {
            const isCurrent = track.id === currentTrack.id;

            return (
              <div
                key={track.id}
                onClick={() => {
                  if (isCurrent) {
                    onTogglePlay();
                  } else {
                    onSelectTrack(track);
                  }
                }}
                className={`group flex items-center justify-between p-2.5 rounded-2xl cursor-pointer border transition-all ${
                  isCurrent
                    ? 'bg-[#1d202e] border-[#d4ff00] shadow-[3px_3px_0px_#000]'
                    : 'bg-[#161824] hover:bg-[#1c1e2b] border-[#252838]'
                }`}
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-[#31364d] shadow-sm group-hover:-rotate-2 transition-transform">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {isCurrent && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        {isPlaying ? (
                          <div className="flex items-end gap-0.5 h-4">
                            <span className="w-1 bg-[#d4ff00] animate-bounce h-3 rounded-full"></span>
                            <span className="w-1 bg-[#d4ff00] animate-bounce h-4 rounded-full delay-75"></span>
                            <span className="w-1 bg-[#d4ff00] animate-bounce h-2 rounded-full delay-150"></span>
                          </div>
                        ) : (
                          <Play size={14} className="text-[#d4ff00] fill-[#d4ff00]" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-bold truncate ${
                        isCurrent ? 'text-[#d4ff00]' : 'text-white group-hover:text-[#d4ff00]'
                      }`}
                    >
                      {track.title}
                    </p>
                    <p className="text-[11px] text-[#8e95ba] truncate">
                      {track.artist}
                    </p>
                  </div>
                </div>

                {/* Right: Mood Tag, Duration, Heart */}
                <div className="flex items-center gap-2.5 shrink-0 pl-2">
                  <span
                    className="hidden sm:inline-block text-[10px] font-mono-data font-semibold px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${track.colorAccent}15`,
                      color: track.colorAccent,
                      border: `1px solid ${track.colorAccent}30`,
                    }}
                  >
                    {track.moodTag}
                  </span>

                  <span className="text-[11px] font-mono-data text-[#8890b5]">
                    {formatDuration(track.duration)}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(track.id);
                    }}
                    className="p-1 text-[#64748b] hover:text-[#ff2a85] transition-colors"
                    title={track.isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                  >
                    <Heart
                      size={15}
                      className={track.isFavorite ? 'text-[#ff2a85] fill-[#ff2a85]' : ''}
                    />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-[#64748b]">
            <Music size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-xs">Tidak ada lagu yang cocok dengan pencarian.</p>
          </div>
        )}
      </div>
    </div>
  );
};
