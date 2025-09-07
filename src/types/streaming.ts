import { User } from './auth';
import { DJ } from './music';

export interface LiveStream {
  id: string;
  title: string;
  description?: string;
  dj: DJ;
  status: StreamStatus;
  viewers: number;
  maxViewers: number;
  startTime?: string;
  endTime?: string;
  duration: number;
  thumbnail?: string;
  streamUrl: string;
  chatEnabled: boolean;
  recordingEnabled: boolean;
  recordingUrl?: string;
  tags: string[];
  category: StreamCategory;
  quality: StreamQuality;
  settings: StreamSettings;
  stats: StreamStats;
  createdAt: string;
  updatedAt: string;
}

export enum StreamStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  ENDED = 'ended',
  CANCELLED = 'cancelled'
}

export enum StreamCategory {
  DJ_SET = 'dj_set',
  LIVE_MIX = 'live_mix',
  TUTORIAL = 'tutorial',
  INTERVIEW = 'interview',
  EVENT = 'event',
  PRACTICE = 'practice'
}

export enum StreamQuality {
  SD = '480p',
  HD = '720p',
  FHD = '1080p',
  UHD = '4K'
}

export interface StreamSettings {
  maxViewers?: number;
  requireAuth: boolean;
  allowComments: boolean;
  enableReactions: boolean;
  enableRequests: boolean;
  moderatedChat: boolean;
  subscribersOnly: boolean;
  maturityRating: 'all' | '13+' | '18+';
}

export interface StreamStats {
  totalViews: number;
  uniqueViewers: number;
  averageViewTime: number;
  peakViewers: number;
  likes: number;
  dislikes: number;
  shares: number;
  comments: number;
  superChats: number;
  revenue: number;
}

export interface ChatMessage {
  id: string;
  streamId: string;
  user: User;
  message: string;
  timestamp: string;
  type: MessageType;
  metadata?: MessageMetadata;
  isDeleted: boolean;
  isModerated: boolean;
}

export enum MessageType {
  TEXT = 'text',
  EMOJI = 'emoji',
  REACTION = 'reaction',
  SUPER_CHAT = 'super_chat',
  SYSTEM = 'system',
  COMMAND = 'command'
}

export interface MessageMetadata {
  color?: string;
  amount?: number;
  currency?: string;
  duration?: number;
  emojis?: string[];
  mentions?: string[];
}

export interface StreamReaction {
  id: string;
  streamId: string;
  userId: string;
  type: ReactionType;
  count: number;
  timestamp: string;
}

export enum ReactionType {
  FIRE = 'fire',
  HEART = 'heart',
  THUMBS_UP = 'thumbs_up',
  CLAP = 'clap',
  DANCE = 'dance',
  MONEY = 'money'
}

export interface StreamRequest {
  id: string;
  streamId: string;
  user: User;
  type: RequestType;
  content: string;
  status: RequestStatus;
  votes: number;
  timestamp: string;
}

export enum RequestType {
  SONG = 'song',
  SHOUTOUT = 'shoutout',
  QUESTION = 'question',
  CHALLENGE = 'challenge'
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

export interface WebRTCConnection {
  id: string;
  streamId: string;
  peerId: string;
  type: 'broadcaster' | 'viewer';
  quality: StreamQuality;
  bitrate: number;
  fps: number;
  latency: number;
  isConnected: boolean;
  lastPing: string;
}

export interface StreamAnalytics {
  streamId: string;
  date: string;
  metrics: {
    viewers: ViewerMetrics;
    engagement: EngagementMetrics;
    technical: TechnicalMetrics;
    revenue: RevenueMetrics;
  };
}

export interface ViewerMetrics {
  totalViews: number;
  uniqueViewers: number;
  averageViewTime: number;
  peakConcurrent: number;
  dropOffPoints: number[];
  deviceTypes: Record<string, number>;
  locations: Record<string, number>;
}

export interface EngagementMetrics {
  totalMessages: number;
  activeChatter: number;
  reactions: Record<ReactionType, number>;
  shares: number;
  likes: number;
  follows: number;
}

export interface TechnicalMetrics {
  averageBitrate: number;
  bufferingEvents: number;
  connectionIssues: number;
  qualitySwitches: number;
  latency: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  superChats: number;
  donations: number;
  subscriptions: number;
  merchandise: number;
}