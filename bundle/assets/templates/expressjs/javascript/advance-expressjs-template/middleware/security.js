import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';

// CORS configuration
export const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Rate limiting configuration
export const rateLimitConfig = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers configuration
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Morgan logging configuration
export const morganConfig = morgan('combined', {
  skip: (req, res) => res.statusCode < 400,
  stream: {
    write: (message) => {
      console.log(message.trim());
    },
  },
});

// Compression configuration
export const compressionConfig = compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
});

// Request size limit middleware
export const requestSizeLimit = express.json({ limit: '10mb' });
export const urlEncodedLimit = express.urlencoded({ extended: true, limit: '10mb' });

// Security middleware setup
export const setupSecurityMiddleware = (app) => {
  // Security headers
  app.use(helmetConfig);
  
  // CORS
  app.use(cors(corsOptions));
  
  // Rate limiting
  app.use(rateLimitConfig);
  
  // Compression
  app.use(compressionConfig);
  
  // Logging
  app.use(morganConfig);
  
  // Body parsing
  app.use(requestSizeLimit);
  app.use(urlEncodedLimit);
  
  // Additional security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
}; 