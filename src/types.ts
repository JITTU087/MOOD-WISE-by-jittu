export type MoodType = 'happy' | 'sad';

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  youtubeId: string;
  mood: MoodType;
  era?: string;
  memoryTag?: string;
}

export interface PlaylistInfo {
  id: string;
  title: string;
  subtitle: string;
  side: 'Side A' | 'Side B';
  youtubePlaylistId: string;
  youtubeUrl: string;
  colorTheme: {
    primary: string;
    secondary: string;
    accent: string;
    border: string;
    glow: string;
    tapeColor: string;
    labelColor: string;
  };
  tracks: Track[];
}

export interface NostalgicQuote {
  id: string;
  quote: string;
  authorOrEra: string;
  tag: string;
  mood: MoodType;
}

export interface AmbientNoiseState {
  tapeHiss: boolean;
  vinylCrackle: boolean;
  monsoonRain: boolean;
  volume: number;
}

export interface GeneratedArtwork {
  id: string;
  imageUrl: string;
  caption: string;
  prompt: string;
  mood: MoodType;
  size: string;
  timestamp: number;
}
