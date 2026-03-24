import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { successResponse, errorResponse, createdResponse, notFoundResponse } from '../utils';
import { hashPassword } from '../utils/password';

export class AdminController {
  // Get admin dashboard
  static async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const [
        totalUsers,
        totalVolunteers,
        totalOrganizations,
        pendingVerifications,
        totalOpportunities,
        totalHoursResult,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'VOLUNTEER' } }),
        prisma.user.count({ where: { role: 'ORGANIZATION' } }),
        prisma.organization.count({ where: { verificationStatus: 'PENDING' } }),
        prisma.opportunity.count(),
        prisma.hoursLog.aggregate({
          where: { approvedByOrg: true },
          _sum: { totalHours: true },
        }),
      ]);

      const recentUsers = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      });

      const recentOpportunities = await prisma.opportunity.findMany({
        include: {
          organization: {
            select: { name: true },
          },
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      });

      successResponse(res, {
        stats: {
          totalUsers,
          totalVolunteers,
          totalOrganizations,
          pendingVerifications,
          totalOpportunities,
          totalHours: totalHoursResult._sum.totalHours || 0,
        },
        recentUsers,
        recentOpportunities,
      }, 'Dashboard retrieved successfully');
    } catch (error) {
      console.error('Get dashboard error:', error);
      errorResponse(res, 'Failed to get dashboard', 500);
    }
  }

  // Get all users
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const { role, status, search, page = '1', limit = '10' } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const where: any = {};

      if (role) {
        where.role = role as string;
      }

      if (status) {
        where.status = status as string;
      }

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            volunteer: {
              select: { id: true, totalHours: true },
            },
            organization: {
              select: { id: true, name: true, isVerified: true },
            },
          },
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      successResponse(res, users, 'Users retrieved successfully', 200, {
        page: parseInt(page as string),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      });
    } catch (error) {
      console.error('Get users error:', error);
      errorResponse(res, 'Failed to get users', 500);
    }
  }

  // Get user by ID
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          volunteer: {
            include: {
              earnedBadges: {
                include: { badge: true },
              },
              certificates: {
                include: {
                  opportunity: { select: { title: true } },
                },
              },
            },
          },
          organization: {
            include: {
              opportunities: {
                take: 5,
                orderBy: { createdAt: 'desc' },
              },
            },
          },
        },
      });

      if (!user) {
        notFoundResponse(res, 'User not found');
        return;
      }

      successResponse(res, user, 'User retrieved successfully');
    } catch (error) {
      console.error('Get user error:', error);
      errorResponse(res, 'Failed to get user', 500);
    }
  }

  // Update user status
  static async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        notFoundResponse(res, 'User not found');
        return;
      }

      if (user.role === 'ADMIN') {
        errorResponse(res, 'Cannot modify admin status', 403);
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { status },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      });

      successResponse(res, updatedUser, 'User status updated successfully');
    } catch (error) {
      console.error('Update user status error:', error);
      errorResponse(res, 'Failed to update user status', 500);
    }
  }

  // Delete user
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        notFoundResponse(res, 'User not found');
        return;
      }

      if (user.role === 'ADMIN') {
        errorResponse(res, 'Cannot delete admin user', 403);
        return;
      }

      await prisma.user.delete({
        where: { id },
      });

      successResponse(res, null, 'User deleted successfully');
    } catch (error) {
      console.error('Delete user error:', error);
      errorResponse(res, 'Failed to delete user', 500);
    }
  }

  // Get pending organizations
  static async getPendingOrganizations(req: Request, res: Response): Promise<void> {
    try {
      const { page = '1', limit = '10' } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const [organizations, total] = await Promise.all([
        prisma.organization.findMany({
          where: { verificationStatus: 'PENDING' },
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.organization.count({ where: { verificationStatus: 'PENDING' } }),
      ]);

      successResponse(res, organizations, 'Pending organizations retrieved successfully', 200, {
        page: parseInt(page as string),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      });
    } catch (error) {
      console.error('Get pending organizations error:', error);
      errorResponse(res, 'Failed to get pending organizations', 500);
    }
  }

  // Verify organization
  static async verifyOrganization(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;

      const organization = await prisma.organization.findUnique({
        where: { id },
        include: {
          user: {
            select: { id: true, email: true },
          },
        },
      });

      if (!organization) {
        notFoundResponse(res, 'Organization not found');
        return;
      }

      const updatedOrganization = await prisma.organization.update({
        where: { id },
        data: {
          verificationStatus: status,
          isVerified: status === 'APPROVED',
        },
      });

      // Create notification for organization
      await prisma.notification.create({
        data: {
          userId: organization.user.id,
          type: 'SYSTEM_ANNOUNCEMENT',
          title: `Verification ${status}`,
          message: status === 'APPROVED'
            ? 'Your organization has been verified. You can now create opportunities.'
            : `Your organization verification was rejected. Reason: ${reason || 'Not specified'}`,
          data: { verificationStatus: status },
        },
      });

      successResponse(res, updatedOrganization, `Organization ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Verify organization error:', error);
      errorResponse(res, 'Failed to verify organization', 500);
    }
  }

  // Get all badges
  static async getBadges(req: Request, res: Response): Promise<void> {
    try {
      const badges = await prisma.badge.findMany({
        orderBy: { createdAt: 'desc' },
      });

      successResponse(res, badges, 'Badges retrieved successfully');
    } catch (error) {
      console.error('Get badges error:', error);
      errorResponse(res, 'Failed to get badges', 500);
    }
  }

  // Create badge
  static async createBadge(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, icon, criteriaType, threshold, color } = req.body;

      const badge = await prisma.badge.create({
        data: {
          name,
          description,
          icon,
          criteriaType,
          threshold,
          color,
        },
      });

      createdResponse(res, badge, 'Badge created successfully');
    } catch (error) {
      console.error('Create badge error:', error);
      errorResponse(res, 'Failed to create badge', 500);
    }
  }

  // Update badge
  static async updateBadge(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const badge = await prisma.badge.findUnique({
        where: { id },
      });

      if (!badge) {
        notFoundResponse(res, 'Badge not found');
        return;
      }

      const updatedBadge = await prisma.badge.update({
        where: { id },
        data: updateData,
      });

      successResponse(res, updatedBadge, 'Badge updated successfully');
    } catch (error) {
      console.error('Update badge error:', error);
      errorResponse(res, 'Failed to update badge', 500);
    }
  }

  // Delete badge
  static async deleteBadge(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const badge = await prisma.badge.findUnique({
        where: { id },
      });

      if (!badge) {
        notFoundResponse(res, 'Badge not found');
        return;
      }

      await prisma.badge.delete({
        where: { id },
      });

      successResponse(res, null, 'Badge deleted successfully');
    } catch (error) {
      console.error('Delete badge error:', error);
      errorResponse(res, 'Failed to delete badge', 500);
    }
  }

  // Get all opportunities (admin view)
  static async getAllOpportunities(req: Request, res: Response): Promise<void> {
    try {
      const { status, page = '1', limit = '10' } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const where: any = {};
      if (status) {
        where.status = status as string;
      }

      const [opportunities, total] = await Promise.all([
        prisma.opportunity.findMany({
          where,
          include: {
            organization: {
              select: { name: true, isVerified: true },
            },
            _count: {
              select: { applications: true },
            },
          },
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.opportunity.count({ where }),
      ]);

      successResponse(res, opportunities, 'Opportunities retrieved successfully', 200, {
        page: parseInt(page as string),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      });
    } catch (error) {
      console.error('Get opportunities error:', error);
      errorResponse(res, 'Failed to get opportunities', 500);
    }
  }

  // Get statistics
  static async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      const dateFilter: any = {};
      if (startDate && endDate) {
        dateFilter.createdAt = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        };
      }

      const [
        usersByRole,
        opportunitiesByStatus,
        applicationsByStatus,
        hoursByMonth,
        topVolunteers,
        topOrganizations,
      ] = await Promise.all([
        // Users by role
        prisma.user.groupBy({
          by: ['role'],
          _count: { id: true },
        }),

        // Opportunities by status
        prisma.opportunity.groupBy({
          by: ['status'],
          _count: { id: true },
        }),

        // Applications by status
        prisma.application.groupBy({
          by: ['status'],
          _count: { id: true },
        }),

        // Hours by month (last 6 months)
        prisma.hoursLog.findMany({
          where: {
            approvedByOrg: true,
            createdAt: {
              gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000),
            },
          },
          select: {
            totalHours: true,
            createdAt: true,
          },
        }),

        // Top volunteers
        prisma.volunteer.findMany({
          take: 10,
          orderBy: { totalHours: 'desc' },
          include: {
            user: {
              select: { name: true },
            },
          },
        }),

        // Top organizations
        prisma.organization.findMany({
          take: 10,
          include: {
            user: { select: { name: true } },
            opportunities: {
              where: { status: 'COMPLETED' },
            },
            _count: {
              select: { opportunities: true },
            },
          },
        }),
      ]);

      successResponse(res, {
        usersByRole,
        opportunitiesByStatus,
        applicationsByStatus,
        hoursByMonth,
        topVolunteers,
        topOrganizations,
      }, 'Statistics retrieved successfully');
    } catch (error) {
      console.error('Get statistics error:', error);
      errorResponse(res, 'Failed to get statistics', 500);
    }
  }

  // Create admin user (initial setup)
  static async createAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;

      // Check if email exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        errorResponse(res, 'Email already registered', 409);
        return;
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      const admin = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'ADMIN',
          status: 'ACTIVE',
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });

      createdResponse(res, admin, 'Admin created successfully');
    } catch (error) {
      console.error('Create admin error:', error);
      errorResponse(res, 'Failed to create admin', 500);
    }
  }
}
