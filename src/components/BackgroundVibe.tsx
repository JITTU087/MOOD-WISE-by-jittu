import React from 'react';
import { MoodType } from '../types';

interface BackgroundVibeProps {
  mood: MoodType;
  showScanlines: boolean;
}

export const BackgroundVibe: React.FC<BackgroundVibeProps> = ({ mood, showScanlines }) => {
  const isHappy = mood === 'happy';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* High Density Radial Gradient Base */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          backgroundColor: '#0c0c0e',
          backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1f 0%, #0c0c0e 100%)',
        }}
      />

      {/* SVG Micro-Noise Filter from High Density Design */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle High Density Aura Spotlights */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[130px] opacity-15 transition-all duration-1000 ${
          isHappy ? 'bg-[#ff4e00]' : 'bg-[#00A3FF]'
        }`}
      />

      <div
        className={`absolute -bottom-20 right-10 w-[500px] h-[400px] rounded-full blur-[120px] opacity-10 transition-all duration-1000 ${
          isHappy ? 'bg-[#ffd700]' : 'bg-[#6366f1]'
        }`}
      />

      {/* Optional CRT Scanlines */}
      {showScanlines && <div className="absolute inset-0 crt-overlay z-10 opacity-70 pointer-events-none" />}
    </div>
  );
};

