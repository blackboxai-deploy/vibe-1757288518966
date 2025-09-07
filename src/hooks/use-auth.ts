'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import type { 
  User, 
  LoginCredentials, 
  RegisterCredentials, 
  AuthState, 
  AuthContextType 
} from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthState(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth-token');
      const userData = localStorage.getItem('user-data');
      
      if (!token || !userData) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Simulate API call to verify token
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = JSON.parse(userData);
      setUser(user);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error
  };
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthActions() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials): Promise<User | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        username: credentials.email.split('@')[0],
        role: credentials.email === 'admin@baddbeatz.com' ? 'admin' : 'user',
        avatar: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8b6a438d-f357-4f70-8429-7f5b64f993d9.png}`,
        createdAt: new Date().toISOString(),
      };
      
      const token = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('auth-token', token);
      localStorage.setItem('user-data', JSON.stringify(mockUser));
      
      return mockUser;
    } catch (err: any) {
      const message = err.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<User | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data
      const mockUser: User = {
        id: Date.now().toString(),
        email: credentials.email,
        username: credentials.username,
        role: 'user',
        avatar: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e18b2263-1ba8-425e-ac8d-3b73f423d816.png}`,
        createdAt: new Date().toISOString(),
      };
      
      const token = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('auth-token', token);
      localStorage.setItem('user-data', JSON.stringify(mockUser));
      
      return mockUser;
    } catch (err: any) {
      const message = err.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');
      
      // Redirect to home page
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const refreshUser = async (): Promise<User | null> => {
    try {
      const userData = localStorage.getItem('user-data');
      return userData ? JSON.parse(userData) : null;
    } catch (err) {
      console.error('Failed to refresh user:', err);
      return null;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    login,
    register,
    logout,
    refreshUser,
    clearError,
    isLoading,
    error
  };
}

// Route protection helpers
export function useRequireAuth(redirectTo = '/login') {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth-token');
      const userData = localStorage.getItem('user-data');
      
      if (!token || !userData) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        if (typeof window !== 'undefined') {
          window.location.href = redirectTo;
        }
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-data');
        setIsAuthenticated(false);
        setUser(null);
        if (typeof window !== 'undefined') {
          window.location.href = redirectTo;
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [redirectTo]);

  return { isAuthenticated, loading, user };
}

// Admin route protection
export function useRequireAdmin(redirectTo = '/') {
  const { user, isAuthenticated, loading } = useRequireAuth('/login');

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role !== 'admin' && typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
  }, [user, isAuthenticated, loading, redirectTo]);

  return { isAuthenticated: isAuthenticated && user?.role === 'admin', loading, user };
}

// DJ route protection
export function useRequireDJ(redirectTo = '/') {
  const { user, isAuthenticated, loading } = useRequireAuth('/login');

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role !== 'dj' && user?.role !== 'admin' && typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
  }, [user, isAuthenticated, loading, redirectTo]);

  return { isAuthenticated: isAuthenticated && (user?.role === 'dj' || user?.role === 'admin'), loading, user };
}

// Social login helpers
export function useOAuthLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithProvider = async (provider: 'google' | 'facebook' | 'discord' | 'spotify') => {
    try {
      setIsLoading(true);
      
      // Simulate OAuth redirect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, just show an alert
      alert(`${provider} login would redirect to OAuth provider in a real implementation`);
      setIsLoading(false);
    } catch (err) {
      console.error(`${provider} login error:`, err);
      setIsLoading(false);
    }
  };

  return {
    loginWithGoogle: () => loginWithProvider('google'),
    loginWithFacebook: () => loginWithProvider('facebook'),
    loginWithDiscord: () => loginWithProvider('discord'),
    loginWithSpotify: () => loginWithProvider('spotify'),
    isLoading
  };
}

// Password reset helpers
export function usePasswordReset() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const requestPasswordReset = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestPasswordReset,
    resetPassword,
    isLoading,
    error,
    success,
    clearError: () => setError(null),
    clearSuccess: () => setSuccess(false)
  };
}