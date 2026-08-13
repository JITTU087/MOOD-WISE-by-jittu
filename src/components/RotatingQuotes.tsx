import React, { useState, useEffect } from 'react';
import { MoodType, NostalgicQuote } from '../types';
import { NOSTALGIC_QUOTES } from '../data/musicData';
import { Sparkles, ChevronLeft, ChevronRight, Copy, Check, Quote, RefreshCw } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

interface RotatingQuotesProps {
  currentMood: MoodType;
}

export const RotatingQuotes: React.FC<RotatingQuotesProps> = ({ currentMood }) => {
  const [quotesList, setQuotesList] = useState<NostalgicQuote[]>(NOSTALGIC_QUOTES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);

  // Filter quotes relevant to current mood or universal
  const moodQuotes = quotesList.filter(
    (q) => q.mood === currentMood || q.tag.includes('Mixtape')
  );

  const isHappy = currentMood === 'happy';

  // Auto rotate quote every 8 seconds with smooth progress bar
  useEffect(() => {
    setProgress(0);
    const duration = 8000;
    const intervalTime = 100;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((curr) => (curr + 1) % moodQuotes.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentIndex, moodQuotes.length, currentMood]);

  const activeQuote = moodQuotes[currentIndex % moodQuotes.length] || moodQuotes[0];

  const handleNextQuote = () => {
    audioSynth.playCassetteClick('switch');
    setCurrentIndex((prev) => (prev + 1) % moodQuotes.length);
    setProgress(0);
  };

  const handlePrevQuote = () => {
    audioSynth.playCassetteClick('switch');
    setCurrentIndex((prev) => (prev - 1 + moodQuotes.length) % moodQuotes.length);
    setProgress(0);
  };

  const handleCopyQuote = () => {
    if (activeQuote) {
      navigator.clipboard.writeText(`"${activeQuote.quote}" — ${activeQuote.authorOrEra} (${activeQuote.tag})`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleGenerateAiMemory = async () => {
    setIsGeneratingQuote(true);
    try {
      const response = await fetch('/api/gemini/nostalgia-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: currentMood,
          memoryPrompt: isHappy ? '90s summer afternoons and terrace walkman' : 'monsoon rain at midnight on train window',
        }),
      });
      const data = await response.json();
      if (data.quotes && Array.isArray(data.quotes) && data.quotes.length > 0) {
        const newQuotes: NostalgicQuote[] = data.quotes.map((item: any, i: number) => ({
          id: `ai-${Date.now()}-${i}`,
          quote: item.quote,
          authorOrEra: item.era || 'Echo from 1999',
          tag: item.tag || 'AI Memory Archive',
          mood: currentMood,
        }));
        setQuotesList((prev) => [...newQuotes, ...prev]);
        setCurrentIndex(0);
        setProgress(0);
      }
    } catch (e) {
      console.error('Error generating memory:', e);
    } finally {
      setIsGeneratingQuote(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto my-2 px-2">
      <div className="relative rounded-xl p-3 sm:p-4 border border-white/10 shadow-xl backdrop-blur-md bg-[#161619]/90">
        {/* Progress line at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5 rounded-t-xl overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ease-linear ${
              isHappy ? 'bg-[#ff4e00]' : 'bg-[#00A3FF]'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Quote className={`w-3.5 h-3.5 ${isHappy ? 'text-[#ff4e00]' : 'text-[#00A3FF]'}`} />
            <span className="text-[10px] font-retro-mono uppercase tracking-widest text-[#d1d1d1]/50">
              TELEMETRY MEMORY LOG • {activeQuote?.tag || 'Echo'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              id="ai-generate-memory-btn"
              type="button"
              onClick={handleGenerateAiMemory}
              disabled={isGeneratingQuote}
              className="flex items-center gap-1 text-[10px] font-retro-mono px-2 py-0.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 transition-all"
              title="Generate new poetic memory with Gemini"
            >
              {isGeneratingQuote ? (
                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              ) : (
                <Sparkles className="w-2.5 h-2.5 text-[#ff4e00]" />
              )}
              <span className="hidden sm:inline">AI MEMORY</span>
            </button>

            <button
              id="copy-quote-btn"
              type="button"
              onClick={handleCopyQuote}
              className="p-1 rounded text-white/40 hover:text-white hover:bg-white/5 transition-all"
              title="Copy quote"
            >
              {isCopied ? <Check className="w-3 h-3 text-[#00ff41]" /> : <Copy className="w-3 h-3" />}
            </button>

            <button
              id="prev-quote-btn"
              type="button"
              onClick={handlePrevQuote}
              className="p-1 rounded text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              id="next-quote-btn"
              type="button"
              onClick={handleNextQuote}
              className="p-1 rounded text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* The Quote Body with High Density Serif typography */}
        <div className="min-h-[48px] flex flex-col justify-center">
          <p className="font-serif-display text-lg sm:text-xl text-white font-normal italic leading-snug">
            “{activeQuote?.quote}”
          </p>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-[#d1d1d1]/50 font-retro-mono">
            <span className={isHappy ? 'text-[#ff4e00]' : 'text-[#00A3FF]'}>
              — {activeQuote?.authorOrEra}
            </span>
            <span>•</span>
            <span className="text-[10px] opacity-40">Auto-cycling index #{currentIndex + 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

