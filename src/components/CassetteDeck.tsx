import React, { useState, useEffect } from 'react';
import { MoodType, Track } from '../types';
import { RotateCw, Sparkles, Disc } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

interface CassetteDeckProps {
  currentMood: MoodType;
  isPlaying: boolean;
  onTogglePlay: () => void;
  activeTrack: Track;
  onMoodFlip: () => void;
  tapeCounter: number;
  customCoverArtUrl?: string;
  onOpenArtModal: () => void;
}

export const CassetteDeck: React.FC<CassetteDeckProps> = ({
  currentMood,
  isPlaying,
  onTogglePlay,
  activeTrack,
  onMoodFlip,
  tapeCounter,
  customCoverArtUrl,
  onOpenArtModal,
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [vuLevels, setVuLevels] = useState<number[]>([40, 55, 65, 45, 75, 60, 50, 70]);

  const isHappy = currentMood === 'happy';

  // Animate VU meters when playing
  useEffect(() => {
    if (!isPlaying) {
      setVuLevels([10, 15, 12, 10, 15, 12, 10, 8]);
      return;
    }

    const interval = setInterval(() => {
      setVuLevels([
        Math.floor(30 + Math.random() * 60),
        Math.floor(40 + Math.random() * 55),
        Math.floor(25 + Math.random() * 70),
        Math.floor(50 + Math.random() * 45),
        Math.floor(35 + Math.random() * 60),
        Math.floor(45 + Math.random() * 50),
        Math.floor(30 + Math.random() * 65),
        Math.floor(20 + Math.random() * 75),
      ]);
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleFlipTape = () => {
    audioSynth.playCassetteClick('eject');
    setIsFlipping(true);
    setTimeout(() => {
      onMoodFlip();
      setTimeout(() => {
        setIsFlipping(false);
      }, 300);
    }, 300);
  };

  const formatCounter = (num: number) => {
    return String(Math.floor(num) % 10000).padStart(4, '0');
  };

  const accentColor = isHappy ? '#ff4e00' : '#00A3FF';

  return (
    <div className="relative w-full max-w-[540px] mx-auto my-2 select-none">
      {/* Subtle outer mood aura */}
      <div
        className={`absolute -inset-2 rounded-2xl opacity-20 blur-xl transition-all duration-700 pointer-events-none ${
          isHappy ? 'bg-[#ff4e00]' : 'bg-[#00A3FF]'
        }`}
      />

      {/* Cassette Housing Chassis - High Density Theme */}
      <div
        className={`relative w-full min-h-[330px] sm:h-[350px] bg-[#1a1a1c] border-4 border-[#2a2a2e] rounded-2xl shadow-2xl flex flex-col p-3 sm:p-4 transition-all duration-500 ${
          isFlipping ? 'scale-95 rotate-180 opacity-60' : 'scale-100 rotate-0 opacity-100'
        }`}
        style={{ transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s' }}
      >
        {/* Top Mechanical Notch Trapezoid */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 sm:w-48 h-5 bg-[#2a2a2e] rounded-b-xl flex items-center justify-center">
          <div className="w-16 h-1 bg-black/50 rounded-full" />
        </div>

        {/* Cassette Internal Frame Body */}
        <div className="flex-grow border-2 border-[#3a3a3e] rounded-xl bg-[#252528] flex flex-col overflow-hidden shadow-inner mt-2">
          {/* Header Colored Ribbon */}
          <div
            className={`h-11 sm:h-12 flex items-center px-4 sm:px-6 justify-between transition-colors duration-500 ${
              isHappy ? 'bg-[#ff4e00]' : 'bg-[#00A3FF]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-black tracking-tight text-xs sm:text-sm font-retro-mono">
                MOOD WISE • JITTU
              </span>
              <span className="text-[10px] font-retro-mono bg-black/20 text-black px-1.5 py-0.5 rounded font-semibold hidden sm:inline">
                {isHappy ? 'EUPHORIA DRIFT' : 'INDIGO RAIN'}
              </span>
            </div>
            <span className="font-retro-mono text-black text-xs sm:text-sm font-black tracking-wider">
              {isHappy ? 'SIDE A' : 'SIDE B'}
            </span>
          </div>

          {/* Central Track & Reel Showcase Area */}
          <div
            className="flex-grow relative flex flex-col justify-between p-3 sm:p-4"
            style={
              customCoverArtUrl
                ? {
                    backgroundImage: `linear-gradient(rgba(17,17,19,0.9), rgba(17,17,19,0.95)), url(${customCoverArtUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : {}
            }
          >
            {/* Active Track Title Display */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="min-w-0 pr-2">
                <div className="text-[10px] font-retro-mono uppercase tracking-widest text-[#d1d1d1]/50">
                  CASSETTE HEAD ACTIVE:
                </div>
                <div className="text-sm sm:text-base font-bold text-white truncate flex items-center gap-2">
                  <span className="truncate">{activeTrack.title}</span>
                  {activeTrack.memoryTag && (
                    <span className="text-[10px] font-retro-mono px-1.5 py-0.2 rounded bg-white/10 text-[#d1d1d1]/80 font-normal">
                      {activeTrack.memoryTag}
                    </span>
                  )}
                </div>
              </div>

              {/* Tape Counter & Flip Action */}
              <div className="flex items-center gap-2 shrink-0 font-retro-mono">
                <div className="bg-[#111] border border-[#333] px-2 py-0.5 rounded text-[11px] text-[#00ff41] font-bold tracking-widest">
                  {formatCounter(tapeCounter)}
                </div>
                <button
                  type="button"
                  onClick={handleFlipTape}
                  className="p-1 sm:px-2 sm:py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-white/80 hover:text-white flex items-center gap-1 transition-all"
                  title="Flip Side A / Side B"
                >
                  <RotateCw className="w-3 h-3" />
                  <span className="hidden sm:inline">FLIP</span>
                </button>
              </div>
            </div>

            {/* Rotating Cassette Spools & Center Tape Window */}
            <div className="flex items-center justify-center gap-4 sm:gap-10 my-2 relative">
              {/* Left Spool */}
              <div className="relative">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[8px] border-black bg-[#111] flex items-center justify-center shadow-lg transition-transform ${
                    isPlaying ? 'spin-tape-play' : 'spin-paused'
                  }`}
                >
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white/10 rounded-sm rotate-45 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                  </div>
                </div>
                <div className="text-[9px] font-retro-mono text-center text-white/30 mt-1">FEED</div>
              </div>

              {/* Center Tape Window with Wave/VU line */}
              <div className="w-28 sm:w-36 h-14 sm:h-16 bg-[#111] border-2 border-[#333] rounded-md flex flex-col items-center justify-center px-2 sm:px-3 overflow-hidden">
                <div className="w-full flex items-center justify-between text-[8px] font-retro-mono text-white/40 mb-1">
                  <span>0</span>
                  <span className="text-[#ff4e00] font-bold">CrO2</span>
                  <span>100</span>
                </div>
                {/* Tape ribbon representation */}
                <div className="w-full h-[3px] bg-[#333] relative rounded-full overflow-hidden mb-1.5">
                  <div
                    className="absolute left-0 top-0 h-full transition-all duration-300"
                    style={{
                      width: '64%',
                      backgroundColor: accentColor,
                      opacity: 0.6,
                    }}
                  />
                </div>
                {/* Mini VU bar equalizer */}
                <div className="w-full flex items-end justify-between gap-0.5 h-3">
                  {vuLevels.slice(0, 7).map((lvl, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-xs transition-all duration-100"
                      style={{
                        height: `${Math.max(15, lvl)}%`,
                        backgroundColor: lvl > 65 ? '#ff4e00' : lvl > 40 ? '#00ff41' : '#555',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Right Spool */}
              <div className="relative">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[8px] border-black bg-[#111] flex items-center justify-center shadow-lg transition-transform ${
                    isPlaying ? 'spin-tape-counter' : 'spin-paused'
                  }`}
                >
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white/10 rounded-sm rotate-45 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                  </div>
                </div>
                <div className="text-[9px] font-retro-mono text-center text-white/30 mt-1">TAKE-UP</div>
              </div>
            </div>

            {/* Bottom Tape Specs Strip */}
            <div className="flex items-center justify-between text-[9px] font-retro-mono text-white/40 pt-1 border-t border-white/5">
              <span>DOLBY B-C NR</span>
              <span className="text-white/60">{isPlaying ? '4.76 CM/S • PLAYING' : 'STANDBY'}</span>
              <span>70µs EQ</span>
            </div>
          </div>

          {/* Bottom Chassis Bar */}
          <div className="h-9 bg-[#3a3a3e] mt-auto flex items-center px-4 gap-3">
            <div className="text-[9px] font-retro-mono opacity-50 uppercase">TYPE II • CHROME</div>
            <div className="flex-grow h-[1px] bg-white/10" />
            <div className="text-[9px] font-retro-mono opacity-50 uppercase">HIGH BIAS 120µs</div>
            <button
              type="button"
              onClick={onOpenArtModal}
              className="text-[9px] font-retro-mono text-[#ff4e00] hover:underline flex items-center gap-1 font-bold pl-2 border-l border-white/10"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>AI ART</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
