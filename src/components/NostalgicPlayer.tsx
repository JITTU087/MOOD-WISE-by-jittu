import React, { useState } from 'react';
import { MoodType, PlaylistInfo } from '../types';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
  Shuffle,
  Repeat,
  ExternalLink,
  Radio,
  Sun,
  CloudRain,
  Disc,
} from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

interface NostalgicPlayerProps {
  currentMood: MoodType;
  playlist: PlaylistInfo;
  activeTrackIndex: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSelectTrack: (index: number) => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onMoodToggle: () => void;
  trackProgress: number;
  onSeek: (percent: number) => void;
  currentTimeStr: string;
  durationTimeStr: string;
}

export const NostalgicPlayer: React.FC<NostalgicPlayerProps> = ({
  currentMood,
  playlist,
  activeTrackIndex,
  isPlaying,
  onTogglePlay,
  onSelectTrack,
  onNextTrack,
  onPrevTrack,
  onMoodToggle,
  trackProgress,
  onSeek,
  currentTimeStr,
  durationTimeStr,
}) => {
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showVideoEmbed, setShowVideoEmbed] = useState(false);

  const activeTrack = playlist.tracks[activeTrackIndex] || playlist.tracks[0];
  const isHappy = currentMood === 'happy';
  const accentColor = isHappy ? '#ff4e00' : '#00A3FF';

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(100, pos * 100)));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      {/* Hidden/Collapsible YouTube Player Embed for Audio Streaming */}
      <div
        className={`fixed bottom-24 right-4 z-40 transition-all duration-300 ${
          showVideoEmbed
            ? 'w-72 h-44 sm:w-96 sm:h-56 opacity-100 scale-100 shadow-2xl rounded-2xl overflow-hidden border-2 border-white/20'
            : 'w-0 h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-[#111] text-white text-[11px] font-retro-mono px-3 py-1 flex items-center justify-between border-b border-white/10">
          <span className="text-[#00ff41]">● YOUTUBE CASSETTE FEED</span>
          <button
            type="button"
            onClick={() => setShowVideoEmbed(false)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <iframe
          id="yt-player-frame"
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${activeTrack.youtubeId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1&origin=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}`}
          title={activeTrack.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Tracklist Drawer Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-x-0 bottom-28 max-w-2xl mx-auto z-40 px-4 animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div className="rounded-2xl p-4 sm:p-5 border border-white/10 shadow-2xl backdrop-blur-2xl bg-[#141416]/95 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <ListMusic className="w-4 h-4 text-[#00ff41]" />
                <div>
                  <h3 className="font-retro-mono font-bold text-xs tracking-wider uppercase text-white">
                    {playlist.title} ({playlist.side})
                  </h3>
                  <p className="text-[10px] font-retro-mono text-[#d1d1d1]/50">
                    {playlist.tracks.length} Curated Nostalgic Tracks • {playlist.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={playlist.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] font-retro-mono px-2 py-1 rounded bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30 transition-all"
                  title="Open Playlist on YouTube"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>YouTube</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Track Items */}
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1 font-retro-mono">
              {playlist.tracks.map((track, idx) => {
                const isCurrent = idx === activeTrackIndex;
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      audioSynth.playCassetteClick('play');
                      onSelectTrack(idx);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg border flex items-center justify-between gap-3 transition-all ${
                      isCurrent
                        ? isHappy
                          ? 'bg-[#ff4e00]/20 border-[#ff4e00]/60 text-white shadow-xs'
                          : 'bg-[#00A3FF]/20 border-[#00A3FF]/60 text-white shadow-xs'
                        : 'bg-white/5 border-transparent text-[#d1d1d1]/70 hover:bg-white/10 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[11px] text-white/40 w-5 text-center">
                        {isCurrent && isPlaying ? (
                          <Disc className="w-3 h-3 text-[#00ff41] animate-spin inline" />
                        ) : (
                          String(idx + 1).padStart(2, '0')
                        )}
                      </span>
                      <div className="truncate">
                        <div className="text-xs font-semibold truncate text-white flex items-center gap-1.5">
                          <span>{track.title}</span>
                          {track.memoryTag && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-white/10 text-[#d1d1d1]/60 font-normal">
                              {track.memoryTag}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-white/40 truncate">{track.artist}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-white/40 shrink-0">
                      <span>{track.era}</span>
                      <span className="text-white/20">•</span>
                      <span>{track.duration}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Fixed High Density Telemetry Player Bar */}
      <footer className="fixed bottom-0 inset-x-0 z-30 p-2 sm:p-4 select-none pointer-events-auto">
        <div className="max-w-6xl mx-auto w-full bg-[#121215]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:px-6 sm:py-3 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Track Details & Mood Switch */}
          <div className="flex items-center gap-3 w-full sm:w-1/4">
            <button
              type="button"
              onClick={onMoodToggle}
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-white/10 overflow-hidden relative group"
              title="Toggle Mood / Tape Side"
            >
              <div
                className="w-full h-full opacity-80 flex items-center justify-center transition-all group-hover:scale-105"
                style={{
                  background: isHappy
                    ? 'linear-gradient(135deg, #ff4e00, #ffd700)'
                    : 'linear-gradient(135deg, #00A3FF, #7000FF)',
                }}
              >
                {isHappy ? <Sun className="w-4 h-4 text-black" /> : <CloudRain className="w-4 h-4 text-white" />}
              </div>
            </button>

            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-bold text-white truncate">{activeTrack.title}</span>
              <span className="text-[9px] font-retro-mono opacity-50 uppercase tracking-widest text-[#d1d1d1] truncate">
                {activeTrack.artist} • {playlist.side}
              </span>
            </div>
          </div>

          {/* Center: High Density Playback Controller & Progress Bar */}
          <div className="flex-grow flex flex-col items-center w-full sm:w-auto">
            <div className="flex items-center gap-4 sm:gap-6 mb-1.5">
              {/* Shuffle button */}
              <button
                type="button"
                onClick={() => setIsShuffle(!isShuffle)}
                className={`text-[10px] font-retro-mono uppercase transition-colors ${
                  isShuffle ? 'text-[#ff4e00] font-bold' : 'text-white/40 hover:text-white'
                }`}
                title="Shuffle"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>

              {/* Prev Diamond Marker */}
              <button
                type="button"
                onClick={() => {
                  audioSynth.playCassetteClick('play');
                  onPrevTrack();
                }}
                className="flex items-center gap-1 text-xs text-white opacity-80 hover:opacity-100 tracking-widest font-retro-mono transition-opacity"
              >
                <div className="w-3 h-3 border border-white/40 rotate-45 flex items-center justify-center">
                  <div className="w-1 h-1 bg-white" />
                </div>
                <span className="hidden sm:inline text-[11px]">PREV</span>
              </button>

              {/* Play / Pause Main Dial */}
              <button
                type="button"
                onClick={() => {
                  audioSynth.playCassetteClick(isPlaying ? 'stop' : 'play');
                  onTogglePlay();
                }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all hover:scale-105 active:scale-95"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current text-white" />
                ) : (
                  <Play className="w-4 h-4 fill-current text-white ml-0.5" />
                )}
              </button>

              {/* Next Diamond Marker */}
              <button
                type="button"
                onClick={() => {
                  audioSynth.playCassetteClick('play');
                  onNextTrack();
                }}
                className="flex items-center gap-1 text-xs text-white opacity-80 hover:opacity-100 tracking-widest font-retro-mono transition-opacity"
              >
                <span className="hidden sm:inline text-[11px]">NEXT</span>
                <div className="w-3 h-3 border border-white/40 rotate-45 flex items-center justify-center">
                  <div className="w-1 h-1 bg-white" />
                </div>
              </button>

              {/* Repeat button */}
              <button
                type="button"
                onClick={() => setIsRepeat(!isRepeat)}
                className={`text-[10px] font-retro-mono uppercase transition-colors ${
                  isRepeat ? 'text-[#00ff41] font-bold' : 'text-white/40 hover:text-white'
                }`}
                title="Repeat"
              >
                <Repeat className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Seeking Bar */}
            <div
              className="w-full max-w-sm sm:max-w-md h-[3px] bg-white/10 relative rounded-full overflow-hidden cursor-pointer"
              onClick={handleProgressBarClick}
            >
              <div
                className="absolute left-0 top-0 h-full transition-all duration-150"
                style={{
                  width: `${trackProgress}%`,
                  backgroundColor: accentColor,
                }}
              />
            </div>
          </div>

          {/* Right: Time & Telemetry Tools */}
          <div className="w-full sm:w-1/4 flex justify-between sm:justify-end items-center gap-3">
            <div className="text-left sm:text-right font-retro-mono">
              <div className="text-xs sm:text-sm text-white font-bold">{currentTimeStr}</div>
              <div className="text-[9px] opacity-40 uppercase text-[#d1d1d1]">/{durationTimeStr}</div>
            </div>

            <div className="hidden sm:block w-[1px] h-7 bg-white/10" />

            {/* Volume control */}
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={toggleMute} className="text-white/50 hover:text-white">
                {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-12 sm:w-16 h-1 bg-white/20 rounded appearance-none cursor-pointer accent-[#ff4e00]"
              />
            </div>

            {/* Video toggle */}
            <button
              type="button"
              onClick={() => setShowVideoEmbed(!showVideoEmbed)}
              className={`p-1.5 rounded-md border text-[10px] font-retro-mono flex items-center gap-1 ${
                showVideoEmbed
                  ? 'bg-red-600/30 text-red-200 border-red-500/50'
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
              }`}
              title="Toggle Video Display"
            >
              <Radio className="w-3 h-3 text-red-400" />
            </button>

            {/* Tracklist Toggle */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-md border text-[10px] font-retro-mono flex items-center gap-1 ${
                isDrawerOpen
                  ? 'bg-white/20 text-white border-white/40 font-bold'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
              }`}
            >
              <ListMusic className="w-3 h-3" />
              <span className="hidden sm:inline">TRACKS</span>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};

