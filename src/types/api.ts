// Generic API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  metadata?: ResponseMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string;
}

export interface ResponseMetadata {
  timestamp: string;
  requestId: string;
  version: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Request Types
export interface PaginatedRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface SearchRequest extends PaginatedRequest {
  query: string;
  categories?: string[];
  dateRange?: DateRange;
}

export interface DateRange {
  start: string;
  end: string;
}

// File Upload Types
export interface FileUploadRequest {
  file: File;
  type: FileType;
  metadata?: FileMetadata;
}

export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
  thumbnailUrl?: string;
  metadata: FileMetadata;
  createdAt: string;
}

export interface FileMetadata {
  width?: number;
  height?: number;
  duration?: number;
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
  codec?: string;
  tags?: Record<string, string>;
}

export enum FileType {
  AUDIO = 'audio',
  VIDEO = 'video',
  IMAGE = 'image',
  DOCUMENT = 'document'
}

// GraphQL Types
export interface GraphQLRequest {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: GraphQLError[];
  extensions?: Record<string, any>;
}

export interface GraphQLError {
  message: string;
  locations?: GraphQLLocation[];
  path?: (string | number)[];
  extensions?: Record<string, any>;
}

export interface GraphQLLocation {
  line: number;
  column: number;
}

// Subscription Types
export interface WebSocketMessage<T = any> {
  id: string;
  type: MessageType;
  payload: T;
  timestamp: string;
}

export enum MessageType {
  CONNECTION_INIT = 'connection_init',
  CONNECTION_ACK = 'connection_ack',
  START = 'start',
  DATA = 'data',
  ERROR = 'error',
  COMPLETE = 'complete',
  STOP = 'stop',
  CONNECTION_TERMINATE = 'connection_terminate'
}

// Analytics Types
export interface AnalyticsEvent {
  event: string;
  userId?: string;
  sessionId: string;
  timestamp: string;
  properties: Record<string, any>;
  metadata?: {
    userAgent: string;
    ip: string;
    referrer?: string;
    utm?: UtmParameters;
  };
}

export interface UtmParameters {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

// Booking Types
export interface BookingRequest {
  eventDate: string;
  eventType: string;
  venue: string;
  duration: number; // hours
  requirements?: string;
  budget?: number;
  contactInfo: ContactInfo;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
}

export interface BookingResponse {
  id: string;
  status: BookingStatus;
  estimatedCost: number;
  availableSlots: string[];
  message: string;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

// Notification Types
export interface NotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  channels: NotificationChannel[];
}

export enum NotificationType {
  BOOKING = 'booking',
  STREAM = 'stream',
  FOLLOW = 'follow',
  LIKE = 'like',
  COMMENT = 'comment',
  SYSTEM = 'system'
}

export enum NotificationChannel {
  EMAIL = 'email',
  PUSH = 'push',
  IN_APP = 'in_app',
  SMS = 'sms'
}