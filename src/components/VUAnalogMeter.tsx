import React, { useEffect, useState, useRef } from 'react';
import { audioEngine } from '../utils/audioEngine';

interface VUAnalogMeterProps {
  isPlaying: boolean;
}

export const VUAnalogMeter: React.FC<VUAnalogMeterProps> = ({ isPlaying }) => {
  const [levels, setLevels] = useState<{ left: number; right: number }>({ left: 0, right: 0 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let currentL = 0;
    let currentR = 0;

    const updateMeter = () => {
      if (isPlaying) {
        const raw = audioEngine.getAverageVolume();
        // Smooth ballistics
        currentL += (raw.left - currentL) * 0.25;
        currentR += (raw.right - currentR) * 0.25;
      } else {
        currentL *= 0.85;
        currentR *= 0.85;
      }

      setLevels({ left: currentL, right: currentR });
      animFrameRef.current = requestAnimationFrame(updateMeter);
    };

    animFrameRef.current = requestAnimationFrame(updateMeter);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Convert 0..1 to angle (-42deg to +42deg)
  const leftAngle = -42 + levels.left * 84;
  const rightAngle = -42 + levels.right * 84;

  return (
    <div className="bg-[#12131b] border-2 border-[#26283b] p-3 rounded-2xl shadow-[3px_3px_0px_#000] relative overflow-hidden">
      {/* Decorative top screws */}
      <div className="flex justify-between items-center px-1 mb-2">
        <div className="w-2 h-2 rounded-full bg-[#35394e] border border-[#1b1c27]"></div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono-data font-bold tracking-widest text-[#94a3b8] uppercase">Analog VU Meter</span>
          <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#d4ff00] shadow-[0_0_6px_#d4ff00]' : 'bg-[#3b3e54]'}`}></span>
        </div>
        <div className="w-2 h-2 rounded-full bg-[#35394e] border border-[#1b1c27]"></div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {/* Left Channel */}
        <div className="bg-[#191b26] border border-[#2d3148] rounded-xl p-2 relative h-20 overflow-hidden flex flex-col justify-end items-center shadow-inner">
          <div className="absolute top-1 left-2 text-[9px] font-mono-data font-bold text-[#00f5d4]">CH-L</div>
          {/* Dial scale curve */}
          <div className="absolute top-3 w-32 h-14 border-t-2 border-dashed border-[#575d7e]/40 rounded-[50%] pointer-events-none"></div>
          {/* Scale labels */}
          <div className="absolute top-2 w-full px-4 flex justify-between text-[8px] font-mono-data text-[#8288a8]">
            <span>-20</span>
            <span>-7</span>
            <span>-3</span>
            <span className="text-[#ff5555] font-bold">0</span>
            <span className="text-[#ff2a85] font-bold">+3</span>
          </div>

          {/* Needle */}
          <div
            className="w-0.5 h-14 bg-gradient-to-t from-[#ff5500] to-[#ffdd00] origin-bottom transition-transform duration-75 shadow-[0_0_6px_#ffaa00]"
            style={{ transform: `rotate(${leftAngle}deg)` }}
          ></div>
          <div className="w-4 h-4 rounded-full bg-[#2a2c3d] border border-[#444863] -mb-2 z-10"></div>
        </div>

        {/* Right Channel */}
        <div className="bg-[#191b26] border border-[#2d3148] rounded-xl p-2 relative h-20 overflow-hidden flex flex-col justify-end items-center shadow-inner">
          <div className="absolute top-1 left-2 text-[9px] font-mono-data font-bold text-[#d4ff00]">CH-R</div>
          <div className="absolute top-3 w-32 h-14 border-t-2 border-dashed border-[#575d7e]/40 rounded-[50%] pointer-events-none"></div>
          <div className="absolute top-2 w-full px-4 flex justify-between text-[8px] font-mono-data text-[#8288a8]">
            <span>-20</span>
            <span>-7</span>
            <span>-3</span>
            <span className="text-[#ff5555] font-bold">0</span>
            <span className="text-[#ff2a85] font-bold">+3</span>
          </div>

          {/* Needle */}
          <div
            className="w-0.5 h-14 bg-gradient-to-t from-[#ff5500] to-[#d4ff00] origin-bottom transition-transform duration-75 shadow-[0_0_6px_#d4ff00]"
            style={{ transform: `rotate(${rightAngle}deg)` }}
          ></div>
          <div className="w-4 h-4 rounded-full bg-[#2a2c3d] border border-[#444863] -mb-2 z-10"></div>
        </div>
      </div>
    </div>
  );
};
