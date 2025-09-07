#!/usr/bin/env node

/**
 * BaddBeatz Backend Server
 * Modern Node.js/Express server with GraphQL, TypeScript, and microservices architecture
 */

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { json, urlencoded } from 'express';

// Internal imports
import { config } from '@/config/env';
import { logger } from '@/utils/logger';
import { connectDatabases } from '@/config/database';
import { typeDefs, resolvers } from '@/graphql';
import { authMiddleware } from '@/middleware/auth';
import { errorHandler } from '@/middleware/errorHandler';
import { setupSocketIO } from '@/services/socketService';
import { apiRoutes } from '@/routes';

class BaddBeatzServer {
  private app: express.Application;
  private httpServer: any;
  private apolloServer: ApolloServer;
  private io: SocketIOServer;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.setupApollo();
    this.setupSocketIO();
  }

  private setupApollo(): void {
    this.apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer })],
      csrfPrevention: true,
      cache: 'bounded',
      introspection: config.NODE_ENV !== 'production',
      includeStacktraceInErrorResponses: config.NODE_ENV !== 'production',
    });
  }

  private setupSocketIO(): void {
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: config.CORS_ORIGIN,
        methods: ['GET', 'POST']
      },
      transports: ['websocket', 'polling']
    });

    setupSocketIO(this.io);
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https:"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          connectSrc: ["'self'", "https:", "wss:", "ws:"],
          fontSrc: ["'self'", "https:", "data:"],
          mediaSrc: ["'self'", "https:", "blob:"],
          objectSrc: ["'none'"],
          frameSrc: ["'none'"]
        }
      },
      crossOriginEmbedderPolicy: false
    }));

    // CORS
    this.app.use(cors({
      origin: config.CORS_ORIGIN.split(','),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Apollo-Require-Preflight']
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
        error: 'Too many requests from this IP, please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

    this.app.use('/api/', limiter);

    // Body parsing
    this.app.use(json({ limit: '10mb' }));
    this.app.use(urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        body: req.method === 'POST' ? req.body : undefined
      });
      next();
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.NODE_ENV,
        version: process.env.npm_package_version || '2.0.0'
      });
    });

    // API routes
    this.app.use('/api', apiRoutes);

    // GraphQL endpoint
    this.app.use('/graphql', 
      authMiddleware,
      expressMiddleware(this.apolloServer, {
        context: async ({ req }) => {
          return {
            user: req.user,
            req,
            ip: req.ip
          };
        }
      })
    );

    // WebSocket endpoint info
    this.app.get('/ws', (req, res) => {
      res.json({
        message: 'WebSocket endpoint available',
        endpoint: '/ws',
        protocols: ['websocket', 'polling']
      });
    });

    // Serve static files (uploads)
    this.app.use('/uploads', express.static('uploads'));

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
      });
    });

    // Global error handler
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Connect to databases
      await connectDatabases();
      logger.info('✅ Database connections established');

      // Setup middleware and routes
      this.setupMiddleware();
      
      // Start Apollo Server
      await this.apolloServer.start();
      logger.info('✅ Apollo GraphQL Server started');

      // Setup routes
      this.setupRoutes();

      // Start HTTP server
      this.httpServer.listen(config.PORT, () => {
        logger.info(`🚀 Server running on port ${config.PORT}`);
        logger.info(`📊 GraphQL Playground: http://localhost:${config.PORT}/graphql`);
        logger.info(`🔌 WebSocket Server: ws://localhost:${config.PORT}/ws`);
        logger.info(`🏥 Health Check: http://localhost:${config.PORT}/health`);
        logger.info(`🌍 Environment: ${config.NODE_ENV}`);
      });

      // Graceful shutdown
      process.on('SIGTERM', this.shutdown.bind(this));
      process.on('SIGINT', this.shutdown.bind(this));

    } catch (error) {
      logger.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  private async shutdown(): Promise<void> {
    logger.info('🛑 Shutting down server...');
    
    try {
      await this.apolloServer.stop();
      this.httpServer.close(() => {
        logger.info('✅ Server shut down gracefully');
        process.exit(0);
      });
    } catch (error) {
      logger.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  }
}

// Start the server
const server = new BaddBeatzServer();
server.start().catch((error) => {
  logger.error('❌ Failed to start server:', error);
  process.exit(1);
});