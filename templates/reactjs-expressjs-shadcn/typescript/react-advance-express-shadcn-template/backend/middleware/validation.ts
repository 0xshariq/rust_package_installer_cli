import { Request, Response, NextFunction } from 'express';
import { CustomError } from './errorHandler.js';

// Validation middleware
export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        const message = error.details.map((detail: any) => detail.message).join(', ');
        throw new CustomError(message, 400);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Simple validation helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: any, fieldName: string): void => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new CustomError(`${fieldName} is required`, 400);
  }
};

export const validateLength = (value: string, fieldName: string, min: number, max: number): void => {
  if (value.length < min || value.length > max) {
    throw new CustomError(`${fieldName} must be between ${min} and ${max} characters`, 400);
  }
};

// User validation middleware
export const validateUserData = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;

    validateRequired(name, 'Name');
    validateRequired(email, 'Email');
    validateLength(name, 'Name', 2, 50);

    if (!validateEmail(email)) {
      throw new CustomError('Please provide a valid email address', 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}; 