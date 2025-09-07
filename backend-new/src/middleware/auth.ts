/**
 * Authentication Middleware
 * JWT token validation and user context setup
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { logger } from '@/utils/logger';
import { redis } from '@/config/database';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
        role: string;
      };
    }
  }
}

interface JWTPayload {
  id: string;
  email: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthService {
  static generateTokens(user: { id: string; email: string; username: string; role: string }): AuthTokens {
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    };

    const accessToken = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
      issuer: 'baddbeatz',
      audience: 'baddbeatz-users'
    });

    const refreshToken = jwt.sign({ id: user.id }, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
      issuer: 'baddbeatz',
      audience: 'baddbeatz-users'
    });

    const decoded = jwt.decode(accessToken) as JWTPayload;
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

    return { accessToken, refreshToken, expiresIn };
  }

  static async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET, {
        issuer: 'baddbeatz',
        audience: 'baddbeatz-users'
      }) as JWTPayload;

      // Check if token is blacklisted
      const isBlacklisted = await redis.get(`blacklist_${token}`);
      if (isBlacklisted) {
        logger.warn('Blacklisted token used', { userId: decoded.id });
        return null;
      }

      return decoded;
    } catch (error) {
      logger.debug('Token verification failed:', error);
      return null;
    }
  }

  static async verifyRefreshToken(refreshToken: string): Promise<{ id: string } | null> {
    try {
      const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET, {
        issuer: 'baddbeatz',
        audience: 'baddbeatz-users'
      }) as { id: string };

      // Check if refresh token exists in Redis
      const storedToken = await redis.get(`refresh_${decoded.id}`);
      if (storedToken !== refreshToken) {
        logger.warn('Invalid refresh token used', { userId: decoded.id });
        return null;
      }

      return decoded;
    } catch (error) {
      logger.debug('Refresh token verification failed:', error);
      return null;
    }
  }

  static async blacklistToken(token: string): Promise<void> {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      if (decoded && decoded.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
          await redis.setex(`blacklist_${token}`, ttl, 'true');
        }
      }
    } catch (error) {
      logger.error('Error blacklisting token:', error);
    }
  }

  static async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    try {
      const decoded = jwt.decode(refreshToken) as { exp: number };
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      await redis.setex(`refresh_${userId}`, ttl, refreshToken);
    } catch (error) {
      logger.error('Error storing refresh token:', error);
    }
  }

  static async removeRefreshToken(userId: string): Promise<void> {
    try {
      await redis.del(`refresh_${userId}`);
    } catch (error) {
      logger.error('Error removing refresh token:', error);
    }
  }
}

// Middleware for protecting routes
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      req.user = undefined;
      return next();
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    const decoded = await AuthService.verifyToken(token);
    
    if (!decoded) {
      req.user = undefined;
      return next();
    }

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
      role: decoded.role
    };

    logger.debug('User authenticated', { userId: decoded.id, endpoint: req.path });
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    req.user = undefined;
    next();
  }
};

// Middleware for requiring authentication
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
    return;
  }
  next();
};

// Middleware for requiring specific roles
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: roles,
        current: req.user.role
      });
      return;
    }

    next();
  };
};

// Middleware for optional authentication
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  // This middleware always continues, but may set req.user if token is valid
  authMiddleware(req, res, next);
};

export default {
  AuthService,
  authMiddleware,
  requireAuth,
  requireRole,
  optionalAuth
};