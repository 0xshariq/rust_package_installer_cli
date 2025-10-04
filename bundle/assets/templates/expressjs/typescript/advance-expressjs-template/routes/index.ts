import express from 'express';
import userRoutes from './user.routes.js';

const router = express.Router();

// API versioning
const API_VERSION = '/api/v1';

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
router.use(`${API_VERSION}/users`, userRoutes);

// 404 handler for API routes
router.use(`${API_VERSION}/*`, (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

export default router; 