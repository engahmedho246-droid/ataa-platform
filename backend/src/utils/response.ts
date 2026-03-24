import { Response } from 'express';
import { ApiResponse } from '../types';

export const successResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
  meta?: any
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  
  if (meta) {
    response.meta = meta;
  }
  
  res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  message: string = 'Error occurred',
  statusCode: number = 400,
  errors?: any[]
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    error: message,
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  res.status(statusCode).json(response);
};

export const createdResponse = <T>(res: Response, data: T, message: string = 'Created successfully'): void => {
  successResponse(res, data, message, 201);
};

export const notFoundResponse = (res: Response, message: string = 'Resource not found'): void => {
  errorResponse(res, message, 404);
};

export const unauthorizedResponse = (res: Response, message: string = 'Unauthorized'): void => {
  errorResponse(res, message, 401);
};

export const forbiddenResponse = (res: Response, message: string = 'Forbidden'): void => {
  errorResponse(res, message, 403);
};

export const validationErrorResponse = (res: Response, errors: any[], message: string = 'Validation failed'): void => {
  errorResponse(res, message, 422, errors);
};
