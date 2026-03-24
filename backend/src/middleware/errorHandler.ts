import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { errorResponse } from '../utils/response';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === 'P2002') {
      const field = (err.meta?.target as string[])?.[0] || 'field';
      errorResponse(res, `${field} already exists`, 409);
      return;
    }
    
    // Foreign key constraint
    if (err.code === 'P2003') {
      errorResponse(res, 'Referenced record not found', 404);
      return;
    }
    
    // Record not found
    if (err.code === 'P2025') {
      errorResponse(res, 'Record not found', 404);
      return;
    }
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    errorResponse(res, err.message, 422);
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    errorResponse(res, 'Invalid token', 401);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    errorResponse(res, 'Token expired', 401);
    return;
  }

  // Default error
  errorResponse(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    500
  );
};

export const notFoundHandler = (req: Request, res: Response): void => {
  errorResponse(res, `Route ${req.originalUrl} not found`, 404);
};
