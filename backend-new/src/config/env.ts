/**
 * Environment Configuration
 * Centralized configuration management with validation
 */

import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const envSchema = z.object({
  // Server Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default('4000'),
  HOST: z.string().default('0.0.0.0'),

  // Database Configuration
  DATABASE_URL: z.string().url().optional(),
  POSTGRES_HOST: z.string().default('localhost'),
  POSTGRES_PORT: z.string().transform(Number).default('5432'),
  POSTGRES_DATABASE: z.string().default('baddbeatz_db'),
  POSTGRES_USER: z.string().default('baddbeatz_user'),
  POSTGRES_PASSWORD: z.string().default('baddbeatz_pass'),

  // Redis Configuration
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  REDIS_PASSWORD: z.string().optional(),

  // MongoDB Configuration
  MONGODB_URL: z.string().optional(),
  MONGODB_HOST: z.string().default('localhost'),
  MONGODB_PORT: z.string().transform(Number).default('27017'),
  MONGODB_DATABASE: z.string().default('baddbeatz_music'),

  // Security
  JWT_SECRET: z.string().min(32).default('your_super_secret_jwt_key_change_in_production'),
  JWT_REFRESH_SECRET: z.string().min(32).default('your_super_secret_refresh_key_change_in_production'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  // File Upload
  UPLOAD_PATH: z.string().default('./uploads'),
  MAX_FILE_SIZE: z.string().default('100mb'),

  // Email Configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),

  // External APIs
  YOUTUBE_API_KEY: z.string().optional(),
  SOUNDCLOUD_CLIENT_ID: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),

  // Cloudflare
  CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_API_TOKEN: z.string().optional(),

  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Features
  ENABLE_GRAPHQL_PLAYGROUND: z.string().transform(v => v === 'true').default('false'),
  ENABLE_METRICS: z.string().transform(v => v === 'true').default('true'),
  ENABLE_RATE_LIMITING: z.string().transform(v => v === 'true').default('true'),
});

// Validate environment variables
const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('❌ Invalid environment configuration:');
  console.error(parseResult.error.format());
  process.exit(1);
}

export const config = parseResult.data;

// Additional derived configuration
export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
export const isTest = config.NODE_ENV === 'test';

// Database URLs construction if not provided
if (!config.DATABASE_URL) {
  config.DATABASE_URL = `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_HOST}:${config.POSTGRES_PORT}/${config.POSTGRES_DATABASE}`;
}

if (!config.REDIS_URL) {
  config.REDIS_URL = config.REDIS_PASSWORD 
    ? `redis://:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}`
    : `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`;
}

if (!config.MONGODB_URL) {
  config.MONGODB_URL = `mongodb://${config.MONGODB_HOST}:${config.MONGODB_PORT}/${config.MONGODB_DATABASE}`;
}

// Logging configuration
export const logConfig = {
  level: config.LOG_LEVEL,
  format: isProduction ? 'json' : 'combined',
  colorize: !isProduction,
  timestamp: true,
  errors: 'error.log',
  combined: 'combined.log'
};

// Security configuration
export const securityConfig = {
  bcryptRounds: 12,
  passwordMinLength: 8,
  sessionTimeout: 60 * 60 * 24 * 7, // 7 days in seconds
  maxLoginAttempts: 5,
  lockoutDuration: 60 * 15, // 15 minutes
  rateLimits: {
    general: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // requests per window
    },
    auth: {
      windowMs: 15 * 60 * 1000,
      max: 5 // login attempts per window
    },
    api: {
      windowMs: 15 * 60 * 1000,
      max: 1000 // API calls per window
    }
  }
};

// File upload configuration
export const uploadConfig = {
  destination: config.UPLOAD_PATH,
  maxFileSize: config.MAX_FILE_SIZE,
  allowedMimeTypes: {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
    video: ['video/mp4', 'video/webm', 'video/ogg']
  },
  audioFormats: ['mp3', 'wav', 'ogg', 'm4a', 'flac'],
  imageFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  videoFormats: ['mp4', 'webm', 'ogg']
};