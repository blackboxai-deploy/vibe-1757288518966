export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    streams: boolean;
    bookings: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showEmail: boolean;
    showStats: boolean;
  };
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  DJ = 'dj',
  MODERATOR = 'moderator'
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export interface JWTPayload {
  sub: string;
  email: string;
  username: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface OAuthProfile {
  provider: 'google' | 'facebook' | 'discord' | 'spotify';
  id: string;
  email: string;
  name: string;
  image?: string;
}