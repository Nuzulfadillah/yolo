import React, { useEffect, useRef, useState } from 'react';
import { audioEngine } from '../utils/audioEngine';
import { BarChart2, Activity, Disc } from 'lucide-react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  colorAccent: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, colorAccent }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visMode, setVisMode] = useState<'bars' | 'wave' | 'circle'>('bars');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const freqData = new Uint8Array(64);
    const timeData = new Uint8Array(128);

    const render = () => {
      animId = requestAnimationFrame(render);

      // Handle HiDPI
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.fillStyle = '#0f1118';
      ctx.fillRect(0, 0, width, height);

      // Draw faint grid lines
      ctx.strokeStyle = '#1b1d2a';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      audioEngine.getVisualizerData(freqData, timeData);

      if (visMode === 'bars') {
        const barCount = 36;
        const totalGap = (barCount - 1) * 3;
        const barWidth = Math.max(3, (width - 24 - totalGap) / barCount);
        const startX = 12;

        for (let i = 0; i < barCount; i++) {
          const val = isPlaying ? freqData[i % freqData.length] / 255 : Math.sin(Date.now() * 0.003 + i * 0.3) * 0.06 + 0.08;
          const barHeight = Math.max(4, val * (height - 30));
          const x = startX + i * (barWidth + 3);
          const y = height - barHeight - 12;

          // Electric neon gradient
          const gradient = ctx.createLinearGradient(0, height - 12, 0, y);
          gradient.addColorStop(0, '#00f5d4');
          gradient.addColorStop(0.5, colorAccent);
          gradient.addColorStop(1, '#ff2a85');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, 3);
          ctx.fill();

          // Peak cap
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, Math.max(8, y - 3), barWidth, 2);
        }
      } else if (visMode === 'wave') {
        // Oscilloscope
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = colorAccent;
        ctx.shadowColor = colorAccent;
        ctx.shadowBlur = 10;
        ctx.beginPath();

        const sliceWidth = width / (timeData.length - 1);
        let x = 0;

        for (let i = 0; i < timeData.length; i++) {
          const v = isPlaying ? timeData[i] / 128.0 : 1.0 + Math.sin(Date.now() * 0.004 + i * 0.1) * 0.04;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      } else {
        // Circular radar
        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = Math.min(centerX, centerY) * 0.45;

        ctx.beginPath();
        for (let i = 0; i < 48; i++) {
          const angle = (i / 48) * Math.PI * 2;
          const val = isPlaying ? freqData[i % freqData.length] / 255 : 0.15;
          const r = baseRadius + val * 45;
          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = colorAccent;
        ctx.shadowColor = colorAccent;
        ctx.shadowBlur = 12;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Center dot
        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#d4ff00';
        ctx.fill();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, colorAccent, visMode]);

  return (
    <div className="bg-[#12141d] border-2 border-[#26283b] rounded-2xl p-3 shadow-[3px_3px_0px_#000] relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono-data font-bold tracking-wider text-[#94a3b8] uppercase">
            Spektrum Realtime
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-[#1f2233] text-[#d4ff00] rounded-md font-mono-data border border-[#30344b]">
            60 FPS
          </span>
        </div>

        {/* Visualizer Mode selector buttons */}
        <div className="flex items-center gap-1 bg-[#191b26] p-1 rounded-xl border border-[#2b2f44]">
          <button
            onClick={() => setVisMode('bars')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              visMode === 'bars' ? 'bg-[#d4ff00] text-black font-bold' : 'text-[#8288a8] hover:text-white'
            }`}
            title="Frekuensi Bar"
          >
            <BarChart2 size={13} />
          </button>
          <button
            onClick={() => setVisMode('wave')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              visMode === 'wave' ? 'bg-[#d4ff00] text-black font-bold' : 'text-[#8288a8] hover:text-white'
            }`}
            title="Gelombang Osiloskop"
          >
            <Activity size={13} />
          </button>
          <button
            onClick={() => setVisMode('circle')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              visMode === 'circle' ? 'bg-[#d4ff00] text-black font-bold' : 'text-[#8288a8] hover:text-white'
            }`}
            title="Radar Melingkar"
          >
            <Disc size={13} />
          </button>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-[#252838]">
        <canvas
          ref={canvasRef}
          width={560}
          height={180}
          className="w-full h-36 sm:h-44 block"
        />
      </div>
    </div>
  );
};
