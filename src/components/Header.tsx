import React, { useState, useEffect } from 'react';
import { MoodType } from '../types';
import { Sparkles, Tv, Volume2, Radio, Sun, CloudRain } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

interface HeaderProps {
  currentMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
  showScanlines: boolean;
  onToggleScanlines: () => void;
  onOpenArtStudio: () => void;
  onOpenAmbientMixer: () => void;
  isAmbientActive: boolean;
  activeTrackTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentMood,
  onMoodChange,
  showScanlines,
  onToggleScanlines,
  onOpenArtStudio,
  onOpenAmbientMixer,
  isAmbientActive,
  activeTrackTitle,
}) => {
  const [timeString, setTimeString] = useState<string>('23:41:04');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeString(`${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMoodSelect = (mood: MoodType) => {
    if (mood !== currentMood) {
      audioSynth.playCassetteClick('switch');
      onMoodChange(mood);
    }
  };

  const isHappy = currentMood === 'happy';

  return (
    <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-4 select-none">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-6">
        {/* Left: High Density Title & System Archive */}
        <div className="flex flex-col">
          <span className="text-[10px] tracking-[0.3em] text-[#ff4e00] font-retro-mono mb-1 uppercase font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4e00] animate-pulse" />
            • System Archive 09.24
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif-display italic text-white leading-none tracking-tight">
            Mood Wise <span className="text-xl sm:text-2xl not-italic font-sans text-white/40 ml-2 font-light">by jittu</span>
          </h1>
          <p className="text-[11px] text-[#d1d1d1]/50 mt-3 tracking-widest uppercase font-retro-mono max-w-md">
            An immersive frequency response for selective nostalgia and emotional resonance.
          </p>
        </div>

        {/* Center/Right: High Density Telemetry & Interactive Actions */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-10 w-full lg:w-auto justify-between lg:justify-end">
          {/* Telemetry Stats Group */}
          <div className="flex gap-6 sm:gap-8 text-right font-retro-mono">
            <div className="flex flex-col">
              <span className="text-[9px] text-white/40 uppercase tracking-tighter">Current Frequency</span>
              <span className="text-base sm:text-xl font-bold text-[#00ff41] tracking-wider">
                {isHappy ? '104.2 MHZ' : '88.7 MHZ'}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] text-white/40 uppercase tracking-tighter">Playback State</span>
              <span className="text-base sm:text-xl font-bold text-[#ff4e00] tracking-wider">
                REC • ON
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] text-white/40 uppercase tracking-tighter">Local Time</span>
              <span className="text-base sm:text-xl font-bold text-white/90 tracking-wider">
                {timeString}
              </span>
            </div>
          </div>

          {/* Action Tools Pill Group */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1 rounded-lg">
            {/* Side A / Side B Selector */}
            <div className="flex items-center bg-black/40 rounded-md p-0.5 border border-white/5">
              <button
                id="mood-btn-happy"
                type="button"
                onClick={() => handleMoodSelect('happy')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-retro-mono font-bold tracking-wider transition-all ${
                  isHappy
                    ? 'bg-[#ff4e00] text-black shadow-sm'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
                title="Switch to Side A (Sunshine)"
              >
                <Sun className="w-3 h-3" />
                <span>SIDE A</span>
              </button>

              <button
                id="mood-btn-sad"
                type="button"
                onClick={() => handleMoodSelect('sad')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-retro-mono font-bold tracking-wider transition-all ${
                  !isHappy
                    ? 'bg-[#00A3FF] text-black shadow-sm'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
                title="Switch to Side B (Melancholy)"
              >
                <CloudRain className="w-3 h-3" />
                <span>SIDE B</span>
              </button>
            </div>

            {/* CRT Toggle */}
            <button
              id="toggle-crt-btn"
              type="button"
              onClick={onToggleScanlines}
              title={showScanlines ? 'Disable CRT Scanlines' : 'Enable CRT Scanlines'}
              className={`p-1.5 rounded border text-xs transition-all ${
                showScanlines
                  ? 'bg-[#ff4e00]/20 text-[#ff4e00] border-[#ff4e00]/40'
                  : 'bg-white/5 text-white/50 border-white/5 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
            </button>

            {/* Ambient Mixer */}
            <button
              id="open-ambient-mixer-btn"
              type="button"
              onClick={onOpenAmbientMixer}
              title="Lo-Fi Ambient Noise Mixer (Tape Hiss, Vinyl, Rain)"
              className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-retro-mono font-medium transition-all ${
                isAmbientActive
                  ? 'bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]/40 shadow-sm'
                  : 'bg-white/5 text-white/70 border-white/5 hover:bg-white/10'
              }`}
            >
              <Volume2 className="w-3 h-3 text-[#00ff41]" />
              <span className="hidden sm:inline">NOISE</span>
            </button>

            {/* Gemini AI Tape Art Studio */}
            <button
              id="open-gemini-art-btn"
              type="button"
              onClick={onOpenArtStudio}
              className="flex items-center gap-1 px-2.5 py-1 rounded border border-[#ff4e00]/30 bg-[#ff4e00]/10 text-[#ff4e00] hover:bg-[#ff4e00]/20 text-[11px] font-retro-mono font-bold transition-all"
            >
              <Sparkles className="w-3 h-3" />
              <span>AI COVER</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

