import { User } from './auth';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre: Genre[];
  duration: number; // in seconds
  bpm?: number;
  key?: string;
  year?: number;
  coverArt?: string;
  audioUrl: string;
  waveformData?: number[];
  tags: string[];
  isExplicit: boolean;
  playCount: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Mix {
  id: string;
  title: string;
  description?: string;
  dj: DJ;
  tracks: Track[];
  duration: number;
  genre: Genre[];
  coverArt?: string;
  audioUrl: string;
  videoUrl?: string;
  bpm?: number;
  key?: string;
  recordedAt?: string;
  venue?: Venue;
  playCount: number;
  likes: number;
  downloads: number;
  tags: string[];
  isLive: boolean;
  isFeatured: boolean;
  visibility: 'public' | 'private' | 'unlisted';
  createdAt: string;
  updatedAt: string;
}

export interface DJ {
  id: string;
  name: string;
  realName?: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  genres: Genre[];
  location?: string;
  website?: string;
  socialLinks: SocialLinks;
  stats: DJStats;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface DJStats {
  totalMixes: number;
  totalPlays: number;
  totalLikes: number;
  totalFollowers: number;
  totalBookings: number;
  averageRating: number;
}

export interface SocialLinks {
  soundcloud?: string;
  spotify?: string;
  youtube?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  discord?: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  capacity?: number;
  website?: string;
  image?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  creator: User;
  tracks: Track[];
  isPublic: boolean;
  coverArt?: string;
  totalDuration: number;
  playCount: number;
  likes: number;
  followers: number;
  createdAt: string;
  updatedAt: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  parentGenre?: Genre;
  subGenres?: Genre[];
}

export enum AudioQuality {
  LOW = '128',
  MEDIUM = '192',
  HIGH = '256',
  LOSSLESS = '320'
}

export interface PlayerState {
  currentTrack: Track | null;
  currentMix: Mix | null;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  quality: AudioQuality;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  queue: (Track | Mix)[];
  history: (Track | Mix)[];
}

export interface AudioAnalysis {
  trackId: string;
  waveformData: number[];
  spectrogramData: number[][];
  bpm: number;
  key: string;
  energy: number;
  danceability: number;
  valence: number;
  acousticness: number;
}