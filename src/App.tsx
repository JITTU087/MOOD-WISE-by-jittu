import React, { useState, useEffect } from 'react';
import { MoodType, AmbientNoiseState } from './types';
import { PLAYLISTS_DATA } from './data/musicData';
import { BackgroundVibe } from './components/BackgroundVibe';
import { Header } from './components/Header';
import { CassetteDeck } from './components/CassetteDeck';
import { RotatingQuotes } from './components/RotatingQuotes';
import { NostalgicDetails } from './components/NostalgicDetails';
import { NostalgicPlayer } from './components/NostalgicPlayer';
import { AiArtStudioModal } from './components/AiArtStudioModal';
import { AmbientSoundMixer } from './components/AmbientSoundMixer';
import { audioSynth } from './utils/audioSynth';

export default function App() {
  const [currentMood, setCurrentMood] = useState<MoodType>('happy');
  const [activeTrackIndex, setActiveTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showScanlines, setShowScanlines] = useState<boolean>(false);
  const [isArtModalOpen, setIsArtModalOpen] = useState<boolean>(false);
  const [isAmbientMixerOpen, setIsAmbientMixerOpen] = useState<boolean>(false);
  const [customCoverArtUrl, setCustomCoverArtUrl] = useState<string | undefined>(undefined);
  const [tapeCounter, setTapeCounter] = useState<number>(142);
  const [trackProgress, setTrackProgress] = useState<number>(24);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(58);

  const [ambientState, setAmbientState] = useState<AmbientNoiseState>({
    tapeHiss: false,
    vinylCrackle: false,
    monsoonRain: false,
    volume: 0.5,
  });

  const playlist = PLAYLISTS_DATA[currentMood];
  const activeTrack = playlist.tracks[activeTrackIndex] || playlist.tracks[0];

  // Helper to convert "3:48" into seconds
  const parseDurationToSeconds = (durationStr: string) => {
    const parts = durationStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 240;
  };

  const totalDurationSec = parseDurationToSeconds(activeTrack.duration);

  // Playback timer & progress simulation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTimeSec((prev) => {
        const next = prev + 1;
        if (next >= totalDurationSec) {
          // Auto advance to next track
          setActiveTrackIndex((curr) => (curr + 1) % playlist.tracks.length);
          return 0;
        }
        return next;
      });

      setTapeCounter((prev) => prev + 0.3);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, totalDurationSec, playlist.tracks.length]);

  // Sync progress percentage
  useEffect(() => {
    const pct = (currentTimeSec / totalDurationSec) * 100;
    setTrackProgress(Math.min(100, Math.max(0, pct)));
  }, [currentTimeSec, totalDurationSec]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMoodChange = (newMood: MoodType) => {
    setCurrentMood(newMood);
    setActiveTrackIndex(0);
    setCurrentTimeSec(0);
  };

  const handleMoodFlip = () => {
    const nextMood: MoodType = currentMood === 'happy' ? 'sad' : 'happy';
    handleMoodChange(nextMood);
  };

  const handleNextTrack = () => {
    setActiveTrackIndex((prev) => (prev + 1) % playlist.tracks.length);
    setCurrentTimeSec(0);
  };

  const handlePrevTrack = () => {
    setActiveTrackIndex((prev) => (prev - 1 + playlist.tracks.length) % playlist.tracks.length);
    setCurrentTimeSec(0);
  };

  const handleSeek = (percent: number) => {
    const newSec = Math.floor((percent / 100) * totalDurationSec);
    setCurrentTimeSec(newSec);
  };

  const isAmbientActive =
    ambientState.tapeHiss || ambientState.vinylCrackle || ambientState.monsoonRain;

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col justify-between overflow-x-hidden pb-36">
      {/* Dynamic Background Atmosphere */}
      <BackgroundVibe mood={currentMood} showScanlines={showScanlines} />

      {/* Top Header Navigation & Controls */}
      <Header
        currentMood={currentMood}
        onMoodChange={handleMoodChange}
        showScanlines={showScanlines}
        onToggleScanlines={() => setShowScanlines(!showScanlines)}
        onOpenArtStudio={() => setIsArtModalOpen(true)}
        onOpenAmbientMixer={() => setIsAmbientMixerOpen(true)}
        isAmbientActive={isAmbientActive}
        activeTrackTitle={activeTrack.title}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 max-w-7xl mx-auto w-full my-auto">
        {/* Subtitle & Mood Header Banner */}
        <div className="text-center my-2 sm:my-3">
          <span
            className={`inline-block text-xs font-retro-mono px-3.5 py-1 rounded-full uppercase tracking-widest border backdrop-blur-md transition-colors duration-500 font-bold ${
              currentMood === 'happy'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
            }`}
          >
            {playlist.subtitle}
          </span>
        </div>

        {/* Central Illustrated Cassette Deck Object */}
        <CassetteDeck
          currentMood={currentMood}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          activeTrack={activeTrack}
          onMoodFlip={handleMoodFlip}
          tapeCounter={tapeCounter}
          customCoverArtUrl={customCoverArtUrl}
          onOpenArtModal={() => setIsArtModalOpen(true)}
        />

        {/* Rotating Nostalgic Quotes Section */}
        <RotatingQuotes currentMood={currentMood} />

        {/* Authentic Details, Slangs, and Specifications */}
        <NostalgicDetails currentMood={currentMood} />
      </main>

      {/* Glassmorphism Bottom Music Player */}
      <NostalgicPlayer
        currentMood={currentMood}
        playlist={playlist}
        activeTrackIndex={activeTrackIndex}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onSelectTrack={(idx) => {
          setActiveTrackIndex(idx);
          setCurrentTimeSec(0);
          setIsPlaying(true);
        }}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
        onMoodToggle={handleMoodFlip}
        trackProgress={trackProgress}
        onSeek={handleSeek}
        currentTimeStr={formatTime(currentTimeSec)}
        durationTimeStr={activeTrack.duration}
      />

      {/* Gemini AI Nostalgic Cover Art Studio Modal */}
      <AiArtStudioModal
        isOpen={isArtModalOpen}
        onClose={() => setIsArtModalOpen(false)}
        currentMood={currentMood}
        onSetCustomCover={(url) => {
          setCustomCoverArtUrl(url);
          setIsArtModalOpen(false);
        }}
        activeCustomCover={customCoverArtUrl}
      />

      {/* Ambient Lo-Fi Noise Mixer Modal */}
      <AmbientSoundMixer
        isOpen={isAmbientMixerOpen}
        onClose={() => setIsAmbientMixerOpen(false)}
        currentMood={currentMood}
        ambientState={ambientState}
        onUpdateAmbientState={setAmbientState}
      />
    </div>
  );
}
