/**
 * Winston Logger Configuration
 * Centralized logging with multiple transports and formats
 */

import winston from 'winston';
import { config, logConfig, isDevelopment } from '@/config/env';

// Custom log format for development
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta, null, 2)}`;
    }
    
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

// Production format - structured JSON
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
);

// Create logger instance
export const logger = winston.createLogger({
  level: logConfig.level,
  format: isDevelopment ? developmentFormat : productionFormat,
  defaultMeta: {
    service: 'baddbeatz-backend',
    version: process.env.npm_package_version || '2.0.0',
    environment: config.NODE_ENV
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      handleExceptions: true,
      handleRejections: true,
      format: isDevelopment ? developmentFormat : winston.format.simple()
    })
  ],
  exitOnError: false
});

// Add file transports in production
if (!isDevelopment) {
  logger.add(new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: productionFormat,
    maxsize: 10485760, // 10MB
    maxFiles: 5,
    tailable: true
  }));

  logger.add(new winston.transports.File({
    filename: 'logs/combined.log',
    format: productionFormat,
    maxsize: 10485760, // 10MB
    maxFiles: 10,
    tailable: true
  }));
}

// Custom logging methods for specific use cases
export const loggers = {
  // HTTP request logging
  http: (req: any, res: any, responseTime: number) => {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id
    };

    if (res.statusCode >= 400) {
      logger.error('HTTP Request Error', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  },

  // Database operation logging
  database: (operation: string, table: string, duration?: number, error?: any) => {
    const logData = {
      operation,
      table,
      duration: duration ? `${duration}ms` : undefined
    };

    if (error) {
      logger.error(`Database Error: ${operation}`, { ...logData, error: error.message });
    } else {
      logger.debug(`Database Operation: ${operation}`, logData);
    }
  },

  // Authentication logging
  auth: (action: string, userId?: string, ip?: string, success: boolean = true, details?: any) => {
    const logData = {
      action,
      userId,
      ip,
      success,
      ...details
    };

    if (success) {
      logger.info(`Auth Success: ${action}`, logData);
    } else {
      logger.warn(`Auth Failure: ${action}`, logData);
    }
  },

  // Security event logging
  security: (event: string, severity: 'low' | 'medium' | 'high' | 'critical', details: any) => {
    const logData = {
      securityEvent: event,
      severity,
      timestamp: new Date().toISOString(),
      ...details
    };

    if (severity === 'critical' || severity === 'high') {
      logger.error(`Security Alert: ${event}`, logData);
    } else if (severity === 'medium') {
      logger.warn(`Security Warning: ${event}`, logData);
    } else {
      logger.info(`Security Info: ${event}`, logData);
    }
  },

  // Performance monitoring
  performance: (operation: string, duration: number, threshold: number = 1000) => {
    const logData = {
      operation,
      duration: `${duration}ms`,
      threshold: `${threshold}ms`,
      slow: duration > threshold
    };

    if (duration > threshold) {
      logger.warn('Slow Operation Detected', logData);
    } else {
      logger.debug('Performance Log', logData);
    }
  },

  // External API logging
  externalApi: (service: string, endpoint: string, method: string, statusCode: number, duration: number) => {
    const logData = {
      service,
      endpoint,
      method,
      statusCode,
      duration: `${duration}ms`
    };

    if (statusCode >= 400) {
      logger.error('External API Error', logData);
    } else {
      logger.info('External API Call', logData);
    }
  }
};

// Error handler for unhandled exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
});

// Export logger as default
export default logger;