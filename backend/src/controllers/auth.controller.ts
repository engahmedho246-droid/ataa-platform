import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { hashPassword, comparePassword, generateToken, successResponse, errorResponse, createdResponse } from '../utils';
import { RegisterVolunteerRequest, RegisterOrganizationRequest, LoginRequest } from '../types';

export class AuthController {
  // Register as Volunteer
  static async registerVolunteer(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name, phone, city, skills, interests, bio } = req.body as RegisterVolunteerRequest;

      // Check if email exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        errorResponse(res, 'Email already registered', 409);
        return;
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user and volunteer in transaction
      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            phone,
            role: 'VOLUNTEER',
          },
        });

        const volunteer = await tx.volunteer.create({
          data: {
            userId: user.id,
            city,
            skills: skills || [],
            interests: interests || [],
            bio,
          },
        });

        return { user, volunteer };
      });

      // Generate token
      const token = generateToken({
        userId: result.user.id,
        email: result.user.email,
        role: result.user.role,
      });

      createdResponse(res, {
        token,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
        },
        volunteer: result.volunteer,
      }, 'Volunteer registered successfully');
    } catch (error) {
      console.error('Register volunteer error:', error);
      errorResponse(res, 'Failed to register volunteer', 500);
    }
  }

  // Register as Organization
  static async registerOrganization(req: Request, res: Response): Promise<void> {
    try {
      const {
        email, password, name, phone,
        orgName, orgType, licenseNumber, description,
        website, address, city
      } = req.body as RegisterOrganizationRequest;

      // Check if email exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        errorResponse(res, 'Email already registered', 409);
        return;
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user and organization in transaction
      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            phone,
            role: 'ORGANIZATION',
          },
        });

        const organization = await tx.organization.create({
          data: {
            userId: user.id,
            name: orgName,
            type: orgType as any,
            licenseNumber,
            description,
            website,
            address,
            city,
            verificationStatus: 'PENDING',
          },
        });

        return { user, organization };
      });

      // Generate token
      const token = generateToken({
        userId: result.user.id,
        email: result.user.email,
        role: result.user.role,
      });

      createdResponse(res, {
        token,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
        },
        organization: result.organization,
      }, 'Organization registered successfully. Pending verification.');
    } catch (error) {
      console.error('Register organization error:', error);
      errorResponse(res, 'Failed to register organization', 500);
    }
  }

  // Login
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as LoginRequest;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          volunteer: true,
          organization: true,
        },
      });

      if (!user) {
        errorResponse(res, 'Invalid credentials', 401);
        return;
      }

      // Check if user is active
      if (user.status !== 'ACTIVE') {
        errorResponse(res, 'Account is not active', 403);
        return;
      }

      // Verify password
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        errorResponse(res, 'Invalid credentials', 401);
        return;
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      successResponse(res, {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
        },
        profile: user.volunteer || user.organization,
      }, 'Login successful');
    } catch (error) {
      console.error('Login error:', error);
      errorResponse(res, 'Failed to login', 500);
    }
  }

  // Get current user
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          volunteer: true,
          organization: true,
        },
      });

      if (!user) {
        errorResponse(res, 'User not found', 404);
        return;
      }

      successResponse(res, user, 'User retrieved successfully');
    } catch (error) {
      console.error('Get current user error:', error);
      errorResponse(res, 'Failed to get user', 500);
    }
  }

  // Change password
  static async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { currentPassword, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        errorResponse(res, 'User not found', 404);
        return;
      }

      // Verify current password
      const isValidPassword = await comparePassword(currentPassword, user.password);
      if (!isValidPassword) {
        errorResponse(res, 'Current password is incorrect', 400);
        return;
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      successResponse(res, null, 'Password changed successfully');
    } catch (error) {
      console.error('Change password error:', error);
      errorResponse(res, 'Failed to change password', 500);
    }
  }
}
