import React from 'react';
import { EqualizerSettings, SoundFxSettings } from '../types/music';
import { Sliders, Zap, Disc, Radio, Sparkles } from 'lucide-react';

interface SoundConsoleProps {
  eq: EqualizerSettings;
  onChangeEq: (newEq: EqualizerSettings) => void;
  fx: SoundFxSettings;
  onChangeFx: (newFx: SoundFxSettings) => void;
}

export const SoundConsole: React.FC<SoundConsoleProps> = ({
  eq,
  onChangeEq,
  fx,
  onChangeFx,
}) => {
  const bands = [
    { key: 'subBass' as const, label: '60Hz', sub: 'Sub' },
    { key: 'low' as const, label: '250Hz', sub: 'Low' },
    { key: 'mid' as const, label: '1kHz', sub: 'Mid' },
    { key: 'highMid' as const, label: '4kHz', sub: 'High-Mid' },
    { key: 'high' as const, label: '12kHz', sub: 'Air' },
  ];

  const presets = [
    { name: 'Flat', values: { subBass: 0, low: 0, mid: 0, highMid: 0, high: 0 } },
    { name: 'Lofi Hangat', values: { subBass: 4, low: 3, mid: -2, highMid: -4, high: -6 } },
    { name: 'Bass Boom', values: { subBass: 9, low: 6, mid: 1, highMid: 3, high: 4 } },
    { name: 'Cyber Pop', values: { subBass: 3, low: 2, mid: 4, highMid: 6, high: 7 } },
    { name: 'Vocal Air', values: { subBass: -2, low: 0, mid: 5, highMid: 7, high: 8 } },
  ];

  const handleSliderChange = (key: keyof EqualizerSettings, value: number) => {
    onChangeEq({
      ...eq,
      [key]: value,
    });
  };

  return (
    <div className="bg-[#12141f] border-2 border-[#26283b] rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_#000] relative">
      {/* Header with Title and Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-[#24273a]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#d4ff00] text-black rounded-lg shadow-[1px_1px_0px_#000]">
            <Sliders size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-display">Konsol Efek & Equalizer</h3>
            <p className="text-[10px] font-mono-data text-[#8890b5]">5-BAND ANALOG FILTER & TAPE ENGINE</p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onChangeEq(preset.values)}
              className="tactile-btn px-2.5 py-1 bg-[#191b26] hover:bg-[#222536] text-[#8e95ba] hover:text-white rounded-lg border border-[#2b2f44] text-[11px] font-mono-data font-semibold shadow-[1px_1px_0px_#000]"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left is 5-Band EQ, Right is FX Switches */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 5-Band EQ Sliders (col-span-7) */}
        <div className="md:col-span-7 bg-[#0f1018] border border-[#24283c] rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-mono-data font-bold tracking-wider text-[#94a3b8] uppercase">
              Frekuensi Band (dB)
            </span>
            <span className="text-[9px] font-mono-data text-[#d4ff00]">±12 dB RANGE</span>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3 text-center">
            {bands.map((band) => {
              const val = eq[band.key];
              return (
                <div key={band.key} className="flex flex-col items-center">
                  {/* Current dB reading */}
                  <span
                    className={`text-[10px] font-mono-data font-bold mb-1 ${
                      val > 0 ? 'text-[#d4ff00]' : val < 0 ? 'text-[#ff2a85]' : 'text-[#64748b]'
                    }`}
                  >
                    {val > 0 ? `+${val}` : val}dB
                  </span>

                  {/* Vertical Track Container */}
                  <div className="relative h-32 flex items-center justify-center my-1">
                    {/* Center zero line indicator */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#333852] pointer-events-none"></div>

                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={val}
                      onChange={(e) => handleSliderChange(band.key, parseInt(e.target.value))}
                      className="w-28 h-2 bg-[#1f2233] rounded-lg appearance-none cursor-pointer accent-[#d4ff00] -rotate-90 origin-center"
                    />
                  </div>

                  <span className="text-[11px] font-bold text-white mt-1">{band.sub}</span>
                  <span className="text-[9px] font-mono-data text-[#8890b5]">{band.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* FX Switches & Toggles (col-span-5) */}
        <div className="md:col-span-5 flex flex-col gap-3">
          {/* Vinyl Crackle Card */}
          <div className="bg-[#171926] border border-[#2b2f45] rounded-2xl p-3.5 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Disc size={16} className={fx.vinylCrackle ? 'text-[#ff6b35]' : 'text-[#64748b]'} />
                <div>
                  <p className="text-xs font-bold text-white">Kresek Vinyl</p>
                  <p className="text-[10px] text-[#8890b5]">Suara debu & derak piringan</p>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                onClick={() => onChangeFx({ ...fx, vinylCrackle: !fx.vinylCrackle })}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 border ${
                  fx.vinylCrackle ? 'bg-[#ff6b35] border-black' : 'bg-[#25283b] border-[#383c57]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    fx.vinylCrackle ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>

            {fx.vinylCrackle && (
              <div className="mt-2 pt-2 border-t border-[#2a2e46] flex items-center gap-2">
                <span className="text-[10px] font-mono-data text-[#8890b5]">Intensitas</span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={fx.vinylCrackleVolume}
                  onChange={(e) =>
                    onChangeFx({ ...fx, vinylCrackleVolume: parseFloat(e.target.value) })
                  }
                  className="w-full h-1.5 bg-[#25283b] rounded-lg appearance-none cursor-pointer accent-[#ff6b35]"
                />
              </div>
            )}
          </div>

          {/* Bass Boost Switch */}
          <div className="bg-[#171926] border border-[#2b2f45] rounded-2xl p-3.5 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2">
              <Zap size={16} className={fx.bassBoost ? 'text-[#d4ff00]' : 'text-[#64748b]'} />
              <div>
                <p className="text-xs font-bold text-white">Sub Bass Boost</p>
                <p className="text-[10px] text-[#8890b5]">Dorongan frekuensi 90Hz (+7dB)</p>
              </div>
            </div>

            <button
              onClick={() => onChangeFx({ ...fx, bassBoost: !fx.bassBoost })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 border ${
                fx.bassBoost ? 'bg-[#d4ff00] border-black' : 'bg-[#25283b] border-[#383c57]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  fx.bassBoost ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          {/* Tape Wobble Switch */}
          <div className="bg-[#171926] border border-[#2b2f45] rounded-2xl p-3.5 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2">
              <Radio size={16} className={fx.tapeWobble ? 'text-[#00f5d4]' : 'text-[#64748b]'} />
              <div>
                <p className="text-xs font-bold text-white">Pita Tape Wobble</p>
                <p className="text-[10px] text-[#8890b5]">Pitch flutter analog 0.5Hz LFO</p>
              </div>
            </div>

            <button
              onClick={() => onChangeFx({ ...fx, tapeWobble: !fx.tapeWobble })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 border ${
                fx.tapeWobble ? 'bg-[#00f5d4] border-black' : 'bg-[#25283b] border-[#383c57]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  fx.tapeWobble ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
