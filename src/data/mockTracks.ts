import { Track } from '../types/music';

// Generated album art images
import neonTokyoCover from '../assets/images/album_neon_tokyo_1790684370386.jpg';
import lofiMidnightCover from '../assets/images/album_lofi_midnight_1790684391001.jpg';
import solarFunkCover from '../assets/images/album_solar_funk_1790684409066.jpg';
import cosmicDriftCover from '../assets/images/album_cosmic_drift_1790684428345.jpg';

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Hujan Neon Shinjuku',
    artist: 'Kuroba & The Cyber Tape',
    album: 'Electric Reflections Vol. 1',
    duration: 168, // 2:48
    coverUrl: neonTokyoCover,
    bpm: 86,
    genre: 'Cyber Lofi',
    moodTag: 'Malam Santai',
    colorAccent: '#d4ff00', // electric lime
    synthPreset: 'tokyo_drift',
    key: 'F# Minor',
    isFavorite: true,
    lyrics: [
      { time: 0, text: '♪ [Lofi vinyl intro - tetesan gerimis dan gemerlap neon] ♪' },
      { time: 10, text: 'Lampu jalanan mulai menyala satu demi satu' },
      { time: 18, text: 'Jalan basah memantulkan warna merah dan biru' },
      { time: 26, text: 'Melangkah pelan di antara bayang kota tak pernah tidur' },
      { time: 35, text: 'Suara tape berputar lembut, mengiringi sunyi malam' },
      { time: 44, text: '♪ [Chorus synthwave lembut & petikan melodi analog] ♪' },
      { time: 58, text: 'Biarkan detak ini meredam riuh dalam kepala' },
      { time: 67, text: 'Tak perlu terburu-buru, malam masih milik kita' },
      { time: 78, text: 'Kopi hangat di sudut warung 24 jam' },
      { time: 88, text: 'Menatap jendela berembun dengan senyum tipis' },
      { time: 99, text: '♪ [Solo keyboard Rhodes lofi & tape flutter] ♪' },
      { time: 120, text: 'Kita hanyalah debu kosmik yang gemar berdansa' },
      { time: 134, text: 'Menunggu fajar menyapa tanpa perlu cemas' },
      { time: 148, text: 'Selamat malam, kota neon yang tenang...' },
      { time: 160, text: '♪ [Fade out - putaran pita kaset berakhir] ♪' }
    ]
  },
  {
    id: 'track-2',
    title: 'Kaset Rusak Kamar Tidur',
    artist: 'Pita Analog Kolektif',
    album: 'Kaset Pita & Kenangan 1998',
    duration: 154, // 2:34
    coverUrl: lofiMidnightCover,
    bpm: 78,
    genre: 'Lofi Bedroom',
    moodTag: 'Nostalgia Hangat',
    colorAccent: '#ff6b35', // vibrant sunset orange
    synthPreset: 'midnight_echo',
    key: 'D Major 7',
    isFavorite: true,
    lyrics: [
      { time: 0, text: '♪ [Desis pita kaset dan denting piano tua] ♪' },
      { time: 8, text: 'Lampu meja kuning temaram, jam dinding berdetik pelan' },
      { time: 19, text: 'Kaset tua berputar agak miring tapi tetap setia' },
      { time: 30, text: 'Mengingatkan masa ketika semua terasa sederhana' },
      { time: 42, text: 'Tanpa notifikasi, hanya obrolan sampai larut pagi' },
      { time: 54, text: '♪ [Groove drum lofi berdebu & bassline hangat] ♪' },
      { time: 66, text: 'Ada rasa rindu yang tak bernama' },
      { time: 76, text: 'Hanya hadir saat udara malam mulai mendingin' },
      { time: 88, text: 'Tutup mata sejenak, nikmati hangatnya selimut' },
      { time: 100, text: '♪ [Harmoni vokal bergema jauh di balik pita] ♪' },
      { time: 118, text: 'Besok adalah hari yang baru' },
      { time: 130, text: 'Rebahkan lelahmu di sini...' },
      { time: 144, text: '♪ [Klik mekanik stop tombol kaset] ♪' }
    ]
  },
  {
    id: 'track-3',
    title: 'Disko Surya 3000',
    artist: 'Raden Funky & The Sun Groove',
    album: 'Galactic Horizon Express',
    duration: 182, // 3:02
    coverUrl: solarFunkCover,
    bpm: 112,
    genre: 'Retro Future Funk',
    moodTag: 'Energi Ceria',
    colorAccent: '#00f5d4', // cyber cyan
    synthPreset: 'solar_funk',
    key: 'A Minor Funk',
    isFavorite: false,
    lyrics: [
      { time: 0, text: '♪ [Slap bass punchy & brass synthesizer funk!] ♪' },
      { time: 12, text: 'Nyalakan mesin piringan hitam, kita putar kecepatan penuh!' },
      { time: 21, text: 'Lampu disko berkedip warna-warni di dinding' },
      { time: 30, text: 'Lepaskan beban pundakmu, biarkan pinggul bergoyang' },
      { time: 40, text: '♪ [Funk Drop - bassline tebal & snare renyah] ♪' },
      { time: 52, text: 'Ini musik untuk jiwa yang menolak layu!' },
      { time: 63, text: 'Dari atap gedung sampai lantai dansa' },
      { time: 74, text: 'Semua tersenyum di bawah sorot cahaya surya' },
      { time: 88, text: '♪ [Funky clavinet solo & synth leads liar] ♪' },
      { time: 110, text: 'Jangan berhenti sebelum lagu ini habis' },
      { time: 124, text: 'Keringat mengalir tanda kita masih hidup merdeka' },
      { time: 140, text: 'Terus bergoyang, terus menyala!' },
      { time: 160, text: '♪ [Outro brass section meriah] ♪' }
    ]
  },
  {
    id: 'track-4',
    title: 'Melayang di Orbit Senja',
    artist: 'Nebula Starlight Project',
    album: 'Deep Voyage Soundtracks',
    duration: 195, // 3:15
    coverUrl: cosmicDriftCover,
    bpm: 72,
    genre: 'Ambient Space Groove',
    moodTag: 'Deep Focus',
    colorAccent: '#ff2a85', // acid fuchsia
    synthPreset: 'cosmic_pulse',
    key: 'E Minor 9',
    isFavorite: true,
    lyrics: [
      { time: 0, text: '♪ [Drone synth kosmik & arpeggio bintang berbisik] ♪' },
      { time: 15, text: 'Melihat bumi mengecil perlahan di kaca helm' },
      { time: 28, text: 'Hening tanpa gravitasi, sunyi yang menenangkan' },
      { time: 42, text: 'Setiap detak jantung berpadu dengan ritme semesta' },
      { time: 56, text: '♪ [Sub-bass bergetar halus & pad synth mengembang] ♪' },
      { time: 72, text: 'Kekhawatiran duniawi menguap jadi partikel cahaya' },
      { time: 90, text: 'Kita melayang melintasi cincin Saturnus' },
      { time: 108, text: '♪ [Arpeggiator kristal berputar 360 derajat] ♪' },
      { time: 130, text: 'Fokus pada saat ini, nafas yang tenang' },
      { time: 150, text: 'Ruang tanpa batas, pikiran tanpa batas' },
      { time: 172, text: 'Mengalir bersama arus galaksi...' },
      { time: 188, text: '♪ [Echo panjang menyatu dengan keheningan antariksa] ♪' }
    ]
  }
];
