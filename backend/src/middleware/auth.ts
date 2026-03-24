import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { prisma } from '../config/prisma';
import { unauthorizedResponse, forbiddenResponse } from '../utils/response';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      unauthorizedResponse(res, 'No token provided');
      return;
    }
    
    const token = authHeader.substring(7);
    
    if (!token) {
      unauthorizedResponse(res, 'Invalid token format');
      return;
    }
    
    const decoded = verifyToken(token);
    
    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, status: true },
    });
    
    if (!user) {
      unauthorizedResponse(res, 'User not found');
      return;
    }
    
    if (user.status !== 'ACTIVE') {
      forbiddenResponse(res, 'Account is not active');
      return;
    }
    
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    
    next();
  } catch (error) {
    unauthorizedResponse(res, 'Invalid token');
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      unauthorizedResponse(res, 'Not authenticated');
      return;
    }
    
    if (!roles.includes(req.user.role)) {
      forbiddenResponse(res, 'Insufficient permissions');
      return;
    }
    
    next();
  };
};

export const isVolunteer = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'VOLUNTEER') {
    forbiddenResponse(res, 'Volunteer access required');
    return;
  }
  next();
};

export const isOrganization = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'ORGANIZATION') {
    forbiddenResponse(res, 'Organization access required');
    return;
  }
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    forbiddenResponse(res, 'Admin access required');
    return;
  }
  next();
};
