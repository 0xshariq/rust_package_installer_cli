import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';

// User interface
export interface IUser extends Document {
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Request with user interface
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Error interface
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Environment variables interface
export interface EnvironmentVariables {
  PORT: string;
  NODE_ENV: string;
  MONGODB_URI: string;
  JWT_SECRET?: string;
  JWT_EXPIRES_IN?: string;
  RATE_LIMIT_WINDOW_MS?: string;
  RATE_LIMIT_MAX_REQUESTS?: string;
  CORS_ORIGIN?: string;
}

// Controller function type
export type ControllerFunction = (
  req: Request | AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

// Async error handler type
export type AsyncErrorHandler = (
  fn: ControllerFunction
) => ControllerFunction; 