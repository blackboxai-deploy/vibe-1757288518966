/**
 * GraphQL Schema and Resolvers
 * Main entry point for GraphQL configuration
 */

import { gql } from 'graphql-tag';

// Type definitions
export const typeDefs = gql`
  # Scalars
  scalar DateTime
  scalar Upload

  # Enums
  enum UserRole {
    USER
    ADMIN
    DJ
    PREMIUM
  }

  enum MusicGenre {
    TECHNO
    HARDSTYLE
    HOUSE
    TRANCE
    HARDCORE
    AMBIENT
    DRUM_AND_BASS
    DUBSTEP
    ELECTRONIC
    OTHER
  }

  enum StreamStatus {
    LIVE
    OFFLINE
    SCHEDULED
    ENDED
  }

  # Types
  type User {
    id: ID!
    email: String!
    username: String!
    firstName: String
    lastName: String
    avatar: String
    role: UserRole!
    isVerified: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    profile: UserProfile
    playlists: [Playlist!]!
    bookings: [Booking!]!
  }

  type UserProfile {
    id: ID!
    bio: String
    location: String
    website: String
    socialLinks: SocialLinks
    preferences: UserPreferences
    userId: ID!
  }

  type SocialLinks {
    facebook: String
    instagram: String
    twitter: String
    soundcloud: String
    youtube: String
    tiktok: String
  }

  type UserPreferences {
    favoriteGenres: [MusicGenre!]!
    notifications: NotificationSettings!
    privacy: PrivacySettings!
  }

  type NotificationSettings {
    email: Boolean!
    push: Boolean!
    sms: Boolean!
    newReleases: Boolean!
    events: Boolean!
    bookings: Boolean!
  }

  type PrivacySettings {
    profileVisible: Boolean!
    showEmail: Boolean!
    showLocation: Boolean!
    allowMessages: Boolean!
  }

  type Track {
    id: ID!
    title: String!
    artist: String!
    duration: Int!
    genre: MusicGenre!
    bpm: Int
    key: String
    fileUrl: String!
    coverArt: String
    waveform: String
    createdAt: DateTime!
    uploadedBy: User!
    playlists: [Playlist!]!
    plays: Int!
    likes: Int!
    isPublic: Boolean!
  }

  type Playlist {
    id: ID!
    name: String!
    description: String
    coverImage: String
    tracks: [Track!]!
    duration: Int!
    createdBy: User!
    isPublic: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    likes: Int!
    plays: Int!
  }

  type Booking {
    id: ID!
    eventName: String!
    eventDate: DateTime!
    venue: String!
    location: String!
    description: String
    rate: Float!
    status: BookingStatus!
    clientName: String!
    clientEmail: String!
    clientPhone: String
    requirements: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum BookingStatus {
    PENDING
    CONFIRMED
    CANCELLED
    COMPLETED
  }

  type LiveStream {
    id: ID!
    title: String!
    description: String
    status: StreamStatus!
    scheduledAt: DateTime
    startedAt: DateTime
    endedAt: DateTime
    thumbnailUrl: String
    streamUrl: String
    chatEnabled: Boolean!
    viewers: Int!
    maxViewers: Int!
    dj: User!
    currentTrack: Track
    setlist: [Track!]!
  }

  type ChatMessage {
    id: ID!
    message: String!
    timestamp: DateTime!
    user: User!
    streamId: ID!
  }

  # Input Types
  input RegisterInput {
    email: String!
    username: String!
    password: String!
    firstName: String
    lastName: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    firstName: String
    lastName: String
    bio: String
    location: String
    website: String
    socialLinks: SocialLinksInput
  }

  input SocialLinksInput {
    facebook: String
    instagram: String
    twitter: String
    soundcloud: String
    youtube: String
    tiktok: String
  }

  input CreatePlaylistInput {
    name: String!
    description: String
    isPublic: Boolean = true
  }

  input CreateBookingInput {
    eventName: String!
    eventDate: DateTime!
    venue: String!
    location: String!
    description: String
    rate: Float!
    clientName: String!
    clientEmail: String!
    clientPhone: String
    requirements: String
  }

  input CreateStreamInput {
    title: String!
    description: String
    scheduledAt: DateTime
    chatEnabled: Boolean = true
  }

  # Queries
  type Query {
    # Authentication
    me: User

    # Users
    user(id: ID!): User
    users(limit: Int = 10, offset: Int = 0): [User!]!

    # Tracks
    track(id: ID!): Track
    tracks(genre: MusicGenre, limit: Int = 20, offset: Int = 0): [Track!]!
    popularTracks(limit: Int = 10): [Track!]!
    searchTracks(query: String!, limit: Int = 20): [Track!]!

    # Playlists
    playlist(id: ID!): Playlist
    playlists(limit: Int = 20, offset: Int = 0): [Playlist!]!
    myPlaylists: [Playlist!]!
    popularPlaylists(limit: Int = 10): [Playlist!]!

    # Bookings
    booking(id: ID!): Booking
    myBookings: [Booking!]!
    allBookings(status: BookingStatus, limit: Int = 20, offset: Int = 0): [Booking!]!

    # Live Streams
    liveStream(id: ID!): LiveStream
    liveStreams(status: StreamStatus, limit: Int = 10): [LiveStream!]!
    currentLiveStream: LiveStream

    # Analytics
    trackAnalytics(trackId: ID!): TrackAnalytics
    userAnalytics: UserAnalytics
  }

  # Mutations
  type Mutation {
    # Authentication
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    refreshToken: AuthPayload!
    logout: Boolean!
    forgotPassword(email: String!): Boolean!
    resetPassword(token: String!, password: String!): Boolean!

    # Profile
    updateProfile(input: UpdateProfileInput!): User!
    uploadAvatar(file: Upload!): User!

    # Tracks
    uploadTrack(file: Upload!, title: String!, artist: String!, genre: MusicGenre!): Track!
    updateTrack(id: ID!, title: String, artist: String, genre: MusicGenre): Track!
    deleteTrack(id: ID!): Boolean!
    likeTrack(id: ID!): Track!
    unlikeTrack(id: ID!): Track!

    # Playlists
    createPlaylist(input: CreatePlaylistInput!): Playlist!
    updatePlaylist(id: ID!, name: String, description: String, isPublic: Boolean): Playlist!
    deletePlaylist(id: ID!): Boolean!
    addTrackToPlaylist(playlistId: ID!, trackId: ID!): Playlist!
    removeTrackFromPlaylist(playlistId: ID!, trackId: ID!): Playlist!

    # Bookings
    createBooking(input: CreateBookingInput!): Booking!
    updateBookingStatus(id: ID!, status: BookingStatus!): Booking!
    deleteBooking(id: ID!): Boolean!

    # Live Streaming
    startStream(input: CreateStreamInput!): LiveStream!
    endStream(id: ID!): LiveStream!
    updateStream(id: ID!, title: String, description: String): LiveStream!
    sendChatMessage(streamId: ID!, message: String!): ChatMessage!
  }

  # Subscriptions
  type Subscription {
    # Live Stream
    streamUpdated(streamId: ID!): LiveStream!
    chatMessage(streamId: ID!): ChatMessage!
    viewerCount(streamId: ID!): Int!

    # Real-time notifications
    notification: Notification!
  }

  # Additional Types
  type AuthPayload {
    token: String!
    refreshToken: String!
    user: User!
    expiresIn: Int!
  }

  type TrackAnalytics {
    totalPlays: Int!
    uniqueListeners: Int!
    averageListenTime: Float!
    skipRate: Float!
    likesCount: Int!
    sharesCount: Int!
    dailyPlays: [DailyPlay!]!
  }

  type DailyPlay {
    date: DateTime!
    plays: Int!
  }

  type UserAnalytics {
    totalTracks: Int!
    totalPlays: Int!
    totalLikes: Int!
    followerCount: Int!
    streamingMinutes: Int!
    topGenres: [GenreCount!]!
  }

  type GenreCount {
    genre: MusicGenre!
    count: Int!
  }

  type Notification {
    id: ID!
    type: String!
    title: String!
    message: String!
    read: Boolean!
    createdAt: DateTime!
    userId: ID!
  }
`;

// Base resolvers - will be expanded with actual implementation
export const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return user;
    },
    
    tracks: async (_, { genre, limit, offset }) => {
      // Implementation will be added with database models
      return [];
    },
    
    playlists: async (_, { limit, offset }) => {
      // Implementation will be added with database models
      return [];
    }
  },

  Mutation: {
    register: async (_, { input }) => {
      // Implementation will be added with authentication service
      throw new Error('Not implemented yet');
    },
    
    login: async (_, { input }) => {
      // Implementation will be added with authentication service
      throw new Error('Not implemented yet');
    }
  },

  Subscription: {
    streamUpdated: {
      subscribe: (_, { streamId }, { pubsub }) => {
        return pubsub.asyncIterator(`STREAM_UPDATED_${streamId}`);
      }
    },
    
    chatMessage: {
      subscribe: (_, { streamId }, { pubsub }) => {
        return pubsub.asyncIterator(`CHAT_MESSAGE_${streamId}`);
      }
    }
  }
};

export default { typeDefs, resolvers };