import React from 'react';
import { MoodType } from '../types';
import { NOSTALGIC_OBJECT_BADGES, VINTAGE_STICKERS } from '../data/musicData';

interface NostalgicDetailsProps {
  currentMood: MoodType;
  onSelectTrackPreset?: (id: string) => void;
}

export const NostalgicDetails: React.FC<NostalgicDetailsProps> = ({ currentMood }) => {
  const isHappy = currentMood === 'happy';

  const slangsAndPhrases = isHappy
    ? [
        '“Ek cutting chai aur gaane sunte hain” ☕',
        '“Natraj pencil se cassette rewind karna” ✏️',
        '“Walkman ki battery khatam hone se pehle Side A sun lo” 🔋',
        '“98.3 FM Radio Mirchi pe song dedicate karna” 📻',
        '“Winamp visualizer dekhte huye shaam guzarna” ⚡',
      ]
    : [
        '“Raat ke 2 baje earphones ka ek side hilana” 🎧',
        '“Kolkata tram window seat pe barish aur purane gaane” 🚋',
        '“Unsent letters written on the last page of diary” 📖',
        '“Train ke sleeper coach mein raat ka thanda hava” 🚆',
        '“Yahoo Messenger status: Listening to Tamasha...” 💬',
      ];

  return (
    <div className="w-full max-w-4xl mx-auto my-2 px-2 select-none">
      {/* Memory Feed Ticker */}
      <div className="rounded-xl bg-[#141416]/80 border border-white/10 p-2.5 mb-3 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-1.5 px-1">
          <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
          <span className="text-[10px] font-retro-mono font-bold tracking-widest text-[#d1d1d1]/50 uppercase">
            90S & 2000S CULTURE LOGS • MEMORY FEED
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {slangsAndPhrases.map((phrase, idx) => (
            <span
              key={idx}
              className={`text-xs font-mono px-2.5 py-1 rounded-md border transition-all ${
                isHappy
                  ? 'bg-[#ff4e00]/10 text-[#ffd700] border-[#ff4e00]/30'
                  : 'bg-[#00A3FF]/10 text-[#70d6ff] border-[#00A3FF]/30'
              }`}
            >
              {phrase}
            </span>
          ))}
        </div>
      </div>

      {/* Grid of Spec Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {NOSTALGIC_OBJECT_BADGES.map((badge, idx) => (
          <div
            key={idx}
            className="p-2 rounded-lg bg-[#141416] border border-white/10 flex flex-col justify-center"
          >
            <span className="text-[9px] font-retro-mono text-[#d1d1d1]/40 uppercase tracking-widest">
              {badge.label}
            </span>
            <span className="text-[11px] font-retro-mono font-bold text-white truncate mt-0.5">
              {badge.value}
            </span>
          </div>
        ))}
      </div>

      {/* Vintage Sticker Badges */}
      <div className="flex items-center justify-center flex-wrap gap-2 mt-2.5">
        {VINTAGE_STICKERS.map((stk, idx) => (
          <div
            key={idx}
            className="text-[10px] font-retro-mono font-bold px-2.5 py-0.5 rounded border border-white/10 bg-[#1e1e24] text-[#d1d1d1] shadow-xs"
          >
            {stk.text}
          </div>
        ))}
      </div>
    </div>
  );
};

