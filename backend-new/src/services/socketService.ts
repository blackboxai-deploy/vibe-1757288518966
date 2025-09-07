/**
 * Socket.IO Service for Real-time Communication
 */

import { Server as SocketIOServer } from 'socket.io';
import { logger } from '@/utils/logger';

export const setupSocketIO = (io: SocketIOServer): void => {
  logger.info('Setting up Socket.IO server');
  
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });
};