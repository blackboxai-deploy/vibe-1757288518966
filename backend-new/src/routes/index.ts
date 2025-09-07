/**
 * API Routes Index
 */

import { Router } from 'express';

export const apiRoutes = Router();

// Health check route
apiRoutes.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Placeholder for other routes
apiRoutes.use('/auth', (req, res) => {
  res.json({ message: 'Auth routes - coming soon' });
});

apiRoutes.use('/users', (req, res) => {
  res.json({ message: 'User routes - coming soon' });
});

apiRoutes.use('/tracks', (req, res) => {
  res.json({ message: 'Track routes - coming soon' });
});

export default apiRoutes;