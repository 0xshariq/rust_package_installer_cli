import { CustomError } from './errorHandler.js';

// Validation middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        const message = error.details.map(detail => detail.message).join(', ');
        throw new CustomError(message, 400);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Simple validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new CustomError(`${fieldName} is required`, 400);
  }
};

export const validateLength = (value, fieldName, min, max) => {
  if (value.length < min || value.length > max) {
    throw new CustomError(`${fieldName} must be between ${min} and ${max} characters`, 400);
  }
};

// User validation middleware
export const validateUserData = (req, res, next) => {
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