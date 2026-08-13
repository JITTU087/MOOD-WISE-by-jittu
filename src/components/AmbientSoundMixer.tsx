import React, { useEffect } from 'react';
import { MoodType, AmbientNoiseState } from '../types';
import { Volume2, Radio, Disc, CloudRain, X } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

interface AmbientSoundMixerProps {
  isOpen: boolean;
  onClose: () => void;
  currentMood: MoodType;
  ambientState: AmbientNoiseState;
  onUpdateAmbientState: (newState: AmbientNoiseState) => void;
}

export const AmbientSoundMixer: React.FC<AmbientSoundMixerProps> = ({
  isOpen,
  onClose,
  ambientState,
  onUpdateAmbientState,
}) => {
  // Synchronize audio synthesis whenever ambient state updates
  useEffect(() => {
    audioSynth.setTapeHiss(ambientState.tapeHiss, ambientState.volume);
    audioSynth.setVinylCrackle(ambientState.vinylCrackle, ambientState.volume);
    audioSynth.setMonsoonRain(ambientState.monsoonRain, ambientState.volume);
  }, [ambientState]);

  if (!isOpen) return null;

  const toggleTapeHiss = () => {
    onUpdateAmbientState({
      ...ambientState,
      tapeHiss: !ambientState.tapeHiss,
    });
  };

  const toggleVinyl = () => {
    onUpdateAmbientState({
      ...ambientState,
      vinylCrackle: !ambientState.vinylCrackle,
    });
  };

  const toggleRain = () => {
    onUpdateAmbientState({
      ...ambientState,
      monsoonRain: !ambientState.monsoonRain,
    });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateAmbientState({
      ...ambientState,
      volume: parseFloat(e.target.value),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl p-5 border border-white/10 shadow-2xl backdrop-blur-2xl bg-[#141416] text-white font-retro-mono">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/30">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wider uppercase text-white">
                ANALOG AMBIENT MIXER
              </h3>
              <p className="text-[10px] text-[#d1d1d1]/50">
                Layer authentic lo-fi textures beneath music
              </p>
            </div>
          </div>

          <button
            id="close-ambient-mixer-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Master Volume */}
        <div className="mb-4 bg-[#1a1a1e] p-3 rounded-xl border border-white/10">
          <div className="flex items-center justify-between text-[11px] text-[#d1d1d1]/70 mb-2">
            <span>AMBIENT MASTER GAIN</span>
            <span className="text-[#00ff41] font-bold">{Math.round(ambientState.volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={ambientState.volume}
            onChange={handleVolumeChange}
            className="w-full h-1.5 bg-[#25252b] rounded-lg appearance-none cursor-pointer accent-[#ff4e00]"
          />
        </div>

        {/* Ambient Channel Cards */}
        <div className="space-y-2">
          {/* Tape Hiss & Motor Hum */}
          <div
            onClick={toggleTapeHiss}
            className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
              ambientState.tapeHiss
                ? 'bg-[#ff4e00]/15 border-[#ff4e00]/40 text-white'
                : 'bg-[#1a1a1e] border-white/10 text-slate-400 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Radio className={`w-4 h-4 ${ambientState.tapeHiss ? 'text-[#ff4e00]' : 'text-slate-500'}`} />
              <div>
                <div className="text-xs font-bold text-slate-100">Magnetic Tape Hiss</div>
                <div className="text-[9px] text-[#d1d1d1]/40">Cassette head & motor noise</div>
              </div>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                ambientState.tapeHiss ? 'bg-[#ff4e00] text-black font-black' : 'bg-neutral-800 text-slate-500'
              }`}
            >
              {ambientState.tapeHiss ? 'ON' : 'OFF'}
            </span>
          </div>

          {/* Vinyl Crackle */}
          <div
            onClick={toggleVinyl}
            className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
              ambientState.vinylCrackle
                ? 'bg-[#ff4e00]/15 border-[#ff4e00]/40 text-white'
                : 'bg-[#1a1a1e] border-white/10 text-slate-400 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Disc className={`w-4 h-4 ${ambientState.vinylCrackle ? 'text-[#ff4e00]' : 'text-slate-500'}`} />
              <div>
                <div className="text-xs font-bold text-slate-100">Vinyl Dust & Crackle</div>
                <div className="text-[9px] text-[#d1d1d1]/40">Warm gramophone pops</div>
              </div>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                ambientState.vinylCrackle ? 'bg-[#ff4e00] text-black font-black' : 'bg-neutral-800 text-slate-500'
              }`}
            >
              {ambientState.vinylCrackle ? 'ON' : 'OFF'}
            </span>
          </div>

          {/* Monsoon Rain */}
          <div
            onClick={toggleRain}
            className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
              ambientState.monsoonRain
                ? 'bg-[#00A3FF]/15 border-[#00A3FF]/40 text-white'
                : 'bg-[#1a1a1e] border-white/10 text-slate-400 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CloudRain className={`w-4 h-4 ${ambientState.monsoonRain ? 'text-[#00A3FF]' : 'text-slate-500'}`} />
              <div>
                <div className="text-xs font-bold text-slate-100">Monsoon Rain on Tin Roof</div>
                <div className="text-[9px] text-[#d1d1d1]/40">Gentle nostalgic rainfall</div>
              </div>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                ambientState.monsoonRain ? 'bg-[#00A3FF] text-black font-black' : 'bg-neutral-800 text-slate-500'
              }`}
            >
              {ambientState.monsoonRain ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-2.5 border-t border-white/10 text-center">
          <p className="text-[9px] text-[#d1d1d1]/40">
            Synthesized locally with Web Audio API for true vintage warmth.
          </p>
        </div>
      </div>
    </div>
  );
};

