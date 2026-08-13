import React, { useState } from 'react';
import { MoodType, GeneratedArtwork } from '../types';
import { Sparkles, Download, Check, X, Wand2, RefreshCw } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

interface AiArtStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMood: MoodType;
  onSetCustomCover: (url: string) => void;
  activeCustomCover?: string;
}

export const AiArtStudioModal: React.FC<AiArtStudioModalProps> = ({
  isOpen,
  onClose,
  currentMood,
  onSetCustomCover,
  activeCustomCover,
}) => {
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3' | '9:16'>('1:1');
  const [moodOption, setMoodOption] = useState<MoodType>(currentMood);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedArt, setGeneratedArt] = useState<GeneratedArtwork | null>(null);
  const [savedArts, setSavedArts] = useState<GeneratedArtwork[]>([]);

  if (!isOpen) return null;

  const isHappy = moodOption === 'happy';

  const promptSuggestions = [
    'A vintage Sony Walkman with colorful cassette tape on a wooden study table beside steaming cutting chai, nostalgic 90s afternoon',
    'Raindrops sliding on an old sleeper train window passing through misty green mountain hills, 35mm retro film grain',
    'A 90s Indian terrace at golden sunset with kites in the sky, vintage radio playing, warm nostalgic film colors',
    'Early 2000s cyber cafe with bulky CRT monitors, neon ambient glow, retro desktop wallpaper and headphones',
    'Old Kolkata tram running through rain-washed twilight streets with yellow streetlights reflecting on wet asphalt',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMessage('Please enter a description for your nostalgic artwork.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    audioSynth.playCassetteClick('play');

    try {
      const response = await fetch('/api/gemini/generate-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          mood: moodOption,
          imageSize,
          aspectRatio,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to generate artwork.');
      }

      const newArt: GeneratedArtwork = {
        id: `art-${Date.now()}`,
        imageUrl: data.imageUrl,
        caption: data.caption || 'Nostalgic Mixtape Artwork',
        prompt: prompt.trim(),
        mood: moodOption,
        size: data.size || imageSize,
        timestamp: Date.now(),
      };

      setGeneratedArt(newArt);
      setSavedArts((prev) => [newArt, ...prev]);
    } catch (err: any) {
      console.error('Art generation error:', err);
      setErrorMessage(err.message || 'Something went wrong while generating image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToCassette = (artUrl: string) => {
    audioSynth.playCassetteClick('eject');
    onSetCustomCover(artUrl);
  };

  const handleDownloadImage = (art: GeneratedArtwork) => {
    const link = document.createElement('a');
    link.href = art.imageUrl;
    link.download = `mood-wise-by-jittu-${art.mood}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-5 sm:p-6 border border-white/10 shadow-2xl backdrop-blur-2xl bg-[#141416] text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#ff4e00]/20 text-[#ff4e00] border border-[#ff4e00]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-retro-mono tracking-wider uppercase text-white">
                NOSTALGIA ART STUDIO
              </h2>
              <p className="text-[11px] font-retro-mono text-[#d1d1d1]/50">
                Craft custom 90s cassette mixtape cover art with Gemini AI (Supports 1K, 2K & 4K)
              </p>
            </div>
          </div>

          <button
            id="close-ai-art-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-4 font-retro-mono">
          {/* Prompt Input */}
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[#d1d1d1]/60 mb-1 font-bold">
              Describe Your Nostalgic Memory or Scene:
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A retro Walkman, monsoon raindrops on window glass, hot cutting chai and autumn memories..."
                rows={3}
                className="w-full rounded-xl bg-[#1e1e22] border border-white/10 px-3 py-2 text-xs text-slate-100 placeholder-white/20 focus:outline-none focus:border-[#ff4e00] transition-all font-sans"
              />
            </div>
          </div>

          {/* Prompt Suggestions */}
          <div>
            <span className="text-[10px] text-[#d1d1d1]/50 block mb-1">
              ✨ Tap a nostalgic preset inspiration:
            </span>
            <div className="flex flex-wrap gap-1.5 font-sans">
              {promptSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(sug)}
                  className="text-[11px] text-left px-2.5 py-1 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#ff4e00]/50 text-slate-300 transition-all"
                >
                  {sug.slice(0, 48)}...
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Image Resolution */}
            <div>
              <label className="block text-[10px] text-[#d1d1d1]/50 mb-1 font-semibold uppercase">
                Resolution:
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#1a1a1e] p-1 rounded-lg border border-white/10">
                {(['1K', '2K', '4K'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setImageSize(sz)}
                    className={`py-1 text-xs font-bold rounded transition-all ${
                      imageSize === sz
                        ? 'bg-[#ff4e00] text-black font-black'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-[10px] text-[#d1d1d1]/50 mb-1 font-semibold uppercase">
                Aspect Ratio:
              </label>
              <div className="grid grid-cols-4 gap-1 bg-[#1a1a1e] p-1 rounded-lg border border-white/10">
                {(['1:1', '16:9', '4:3', '9:16'] as const).map((ar) => (
                  <button
                    key={ar}
                    type="button"
                    onClick={() => setAspectRatio(ar)}
                    className={`py-1 text-[10px] font-semibold rounded transition-all ${
                      aspectRatio === ar
                        ? 'bg-[#ff4e00] text-black font-black'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {ar}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Palette */}
            <div>
              <label className="block text-[10px] text-[#d1d1d1]/50 mb-1 font-semibold uppercase">
                Aesthetic Tone:
              </label>
              <div className="grid grid-cols-2 gap-1 bg-[#1a1a1e] p-1 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setMoodOption('happy')}
                  className={`py-1 text-xs rounded font-semibold transition-all ${
                    moodOption === 'happy'
                      ? 'bg-[#ff4e00] text-black font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  ☀️ Side A
                </button>
                <button
                  type="button"
                  onClick={() => setMoodOption('sad')}
                  className={`py-1 text-xs rounded font-semibold transition-all ${
                    moodOption === 'sad'
                      ? 'bg-[#00A3FF] text-black font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  🌧️ Side B
                </button>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono">
              {errorMessage}
            </div>
          )}

          {/* Generate Action Button */}
          <button
            id="generate-art-action-btn"
            type="button"
            disabled={isLoading}
            onClick={handleGenerate}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
              isLoading
                ? 'bg-neutral-800 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#ff4e00] to-[#ffd700] text-black hover:opacity-90 active:scale-98'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Developing Nostalgic Film ({imageSize})...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Generate {imageSize} Nostalgic Artwork</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Art Result Showcase */}
        {generatedArt && (
          <div className="mt-5 pt-4 border-t border-white/10 font-retro-mono">
            <h3 className="text-[10px] uppercase tracking-widest text-[#00ff41] mb-2.5">
              ● Developed Mixtape Artwork:
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#1a1a1e] p-3.5 rounded-xl border border-white/10">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-lg overflow-hidden border border-white/20 shadow-xl shrink-0">
                <img
                  src={generatedArt.imageUrl}
                  alt={generatedArt.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-[9px] px-1.5 py-0.5 rounded text-[#ff4e00] border border-white/10">
                  {generatedArt.size}
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2.5">
                <div>
                  <h4 className="font-serif-display text-xl font-bold text-white">
                    {generatedArt.caption}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-sans line-clamp-2">
                    “{generatedArt.prompt}”
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => handleApplyToCassette(generatedArt.imageUrl)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff4e00] text-black font-bold text-xs shadow-md hover:bg-[#ff4e00]/90 transition-all"
                  >
                    <Check className="w-3 h-3" />
                    <span>Set on Cassette</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadImage(generatedArt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white font-medium text-xs border border-white/15 hover:bg-white/20 transition-all"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download {generatedArt.size}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Previously Saved Arts Gallery */}
        {savedArts.length > 1 && (
          <div className="mt-5 pt-3 border-t border-white/10 font-retro-mono">
            <span className="text-[10px] text-[#d1d1d1]/50 block mb-2 uppercase">
              Recent Generated Memory Artworks:
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {savedArts.map((art) => (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => handleApplyToCassette(art.imageUrl)}
                  className="relative group rounded-lg overflow-hidden border border-white/10 hover:border-[#ff4e00] aspect-square"
                  title="Click to apply to cassette"
                >
                  <img
                    src={art.imageUrl}
                    alt={art.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white font-bold transition-opacity">
                    Apply
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

