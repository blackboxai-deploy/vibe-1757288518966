/**
 * Database Connection Configuration
 * Handles PostgreSQL, MongoDB, and Redis connections
 */

import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import { config } from './env';
import { logger } from '@/utils/logger';

// PostgreSQL connection via Prisma
export const prisma = new PrismaClient({
  log: config.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'minimal',
});

// Redis connection
export const redis = new Redis(config.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  lazyConnect: true,
  connectTimeout: 10000,
  commandTimeout: 5000,
  family: 4, // 4 (IPv4) or 6 (IPv6)
});

// MongoDB connection
export const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGODB_URL, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0,
    });
    
    logger.info('✅ MongoDB connected successfully');
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    throw error;
  }
};

// PostgreSQL connection test
export const connectPostgreSQL = async (): Promise<void> => {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    logger.info('✅ PostgreSQL connected successfully');
  } catch (error) {
    logger.error('❌ PostgreSQL connection failed:', error);
    throw error;
  }
};

// Redis connection test
export const connectRedis = async (): Promise<void> => {
  try {
    await redis.connect();
    await redis.ping();
    logger.info('✅ Redis connected successfully');
  } catch (error) {
    logger.error('❌ Redis connection failed:', error);
    throw error;
  }
};

// Connect all databases
export const connectDatabases = async (): Promise<void> => {
  try {
    await Promise.all([
      connectPostgreSQL(),
      connectMongoDB(),
      connectRedis()
    ]);
    
    logger.info('✅ All database connections established');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
};

// Disconnect all databases
export const disconnectDatabases = async (): Promise<void> => {
  try {
    await Promise.all([
      prisma.$disconnect(),
      mongoose.disconnect(),
      redis.disconnect()
    ]);
    
    logger.info('✅ All database connections closed');
  } catch (error) {
    logger.error('❌ Error closing database connections:', error);
    throw error;
  }
};

// Health check for all databases
export const checkDatabaseHealth = async (): Promise<{
  postgres: boolean;
  mongodb: boolean;
  redis: boolean;
}> => {
  const health = {
    postgres: false,
    mongodb: false,
    redis: false
  };

  try {
    // Check PostgreSQL
    await prisma.$queryRaw`SELECT 1`;
    health.postgres = true;
  } catch (error) {
    logger.warn('PostgreSQL health check failed:', error);
  }

  try {
    // Check MongoDB
    await mongoose.connection.db.admin().ping();
    health.mongodb = true;
  } catch (error) {
    logger.warn('MongoDB health check failed:', error);
  }

  try {
    // Check Redis
    await redis.ping();
    health.redis = true;
  } catch (error) {
    logger.warn('Redis health check failed:', error);
  }

  return health;
};

// Database event handlers
redis.on('connect', () => logger.info('Redis connecting...'));
redis.on('ready', () => logger.info('Redis ready'));
redis.on('error', (error) => logger.error('Redis error:', error));
redis.on('close', () => logger.info('Redis connection closed'));
redis.on('reconnecting', () => logger.info('Redis reconnecting...'));

mongoose.connection.on('connected', () => logger.info('MongoDB connected'));
mongoose.connection.on('error', (error) => logger.error('MongoDB error:', error));
mongoose.connection.on('disconnected', () => logger.info('MongoDB disconnected'));

// Graceful shutdown handlers
process.on('SIGINT', async () => {
  await disconnectDatabases();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabases();
  process.exit(0);
});