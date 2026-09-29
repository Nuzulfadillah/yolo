import React, { useState } from 'react';
import { Upload, X, Music, CheckCircle } from 'lucide-react';
import { Track } from '../types/music';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTrack: (track: Track) => void;
  currentTrackCover: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onAddTrack,
  currentTrackCover,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('Custom Audio');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Auto-populate title if empty
      if (!title) {
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '');
        setTitle(nameWithoutExt);
      }
      if (!artist) {
        setArtist('Artis Lokal');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    // Create audio probe to get duration
    const tempAudio = new Audio(objectUrl);
    tempAudio.addEventListener('loadedmetadata', () => {
      const duration = Math.floor(tempAudio.duration) || 180;
      const newTrack: Track = {
        id: `uploaded-${Date.now()}`,
        title: title || file.name,
        artist: artist || 'Lokal File',
        album: 'Koleksi Pribadi',
        duration,
        coverUrl: currentTrackCover,
        bpm: 120,
        genre: genre || 'User Audio',
        moodTag: 'Koleksi Saya',
        colorAccent: '#00f5d4',
        synthPreset: 'tokyo_drift',
        audioBlobUrl: objectUrl,
        key: 'Custom',
        isFavorite: false,
        lyrics: [
          { time: 0, text: `♪ [Memutar trek kustom pengguna: ${title}] ♪` },
          { time: 5, text: 'File audio lokal diproses melalui equalizer & analog engine.' }
        ]
      };

      onAddTrack(newTrack);
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#131520] border-2 border-[#2b2f44] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-[8px_8px_0px_#000] relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8890b5] hover:text-white transition-colors p-1"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-[#00f5d4] text-black rounded-xl shadow-[2px_2px_0px_#000]">
            <Upload size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">Upload Audio Sendiri</h3>
            <p className="text-[11px] text-[#8890b5]">Putar lagu lokalmu dengan efek analog!</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File dropzone box */}
          <label className="border-2 border-dashed border-[#343a56] hover:border-[#d4ff00] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#181a26]">
            {file ? (
              <div className="flex items-center gap-2 text-[#d4ff00] font-bold text-xs">
                <CheckCircle size={18} />
                <span className="truncate max-w-[220px]">{file.name}</span>
              </div>
            ) : (
              <>
                <Music size={28} className="text-[#64748b] mb-2" />
                <span className="text-xs text-[#cbd5e1] font-semibold">Pilih file MP3 / WAV / M4A</span>
                <span className="text-[10px] text-[#64748b] mt-1">Maksimal 100MB</span>
              </>
            )}
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <div>
            <label className="block text-[11px] font-mono-data text-[#8890b5] mb-1">Judul Lagu</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Senja di Pelabuhan"
              className="w-full bg-[#181a26] border border-[#2d3248] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f5d4]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono-data text-[#8890b5] mb-1">Nama Artis / Musisi</label>
            <input
              type="text"
              required
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Contoh: Indie Band"
              className="w-full bg-[#181a26] border border-[#2d3248] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f5d4]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#8890b5] hover:text-white rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!file}
              className="tactile-btn px-5 py-2 text-xs font-bold text-black bg-[#d4ff00] disabled:bg-[#33384c] disabled:text-[#64748b] rounded-xl border border-black shadow-[2px_2px_0px_#000]"
            >
              Tambahkan ke Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
