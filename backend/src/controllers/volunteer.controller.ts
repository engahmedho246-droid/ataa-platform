import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { successResponse, errorResponse, createdResponse, notFoundResponse } from '../utils';

export class VolunteerController {
  // Get volunteer dashboard
  static async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const volunteer = await prisma.volunteer.findFirst({
        where: { userId },
        include: {
          user: {
            select: { id: true, email: true, name: true, phone: true },
          },
        },
      });

      if (!volunteer) {
        notFoundResponse(res, 'Volunteer profile not found');
        return;
      }

      // Get counts
      const pendingApplications = await prisma.application.count({
        where: {
          volunteerId: volunteer.id,
          status: 'PENDING',
        },
      });

      const upcomingOpportunities = await prisma.application.findMany({
        where: {
          volunteerId: volunteer.id,
          status: 'ACCEPTED',
          opportunity: {
            startDate: { gte: new Date() },
          },
        },
        include: {
          opportunity: {
            include: {
              organization: {
                select: { name: true, logoUrl: true },
              },
            },
          },
        },
        take: 5,
        orderBy: { opportunity: { startDate: 'asc' } },
      });

      const recentBadges = await prisma.earnedBadge.findMany({
        where: { volunteerId: volunteer.id },
        include: { badge: true },
        take: 5,
        orderBy: { earnedAt: 'desc' },
      });

      const notifications = await prisma.notification.findMany({
        where: { userId, isRead: false },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      successResponse(res, {
        profile: volunteer,
        stats: {
          totalHours: volunteer.totalHours,
          completedOpportunities: volunteer.completedOpportunities,
          pendingApplications,
        },
        upcomingOpportunities,
        recentBadges,
        notifications,
      }, 'Dashboard retrieved successfully');
    } catch (error) {
      console.error('Get dashboard error:', error);
      errorResponse(res, 'Failed to get dashboard', 500);
    }
  }

  // Get volunteer profile
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const volunteer = await prisma.volunteer.findFirst({
        where: { userId },
        include: {
          user: {
            select: { id: true, email: true, name: true, phone: true },
          },
          _count: {
            select: {
              applications: true,
              earnedBadges: true,
              certificates: true,
            },
          },
        },
      });

      if (!volunteer) {
        notFoundResponse(res, 'Volunteer profile not found');
        return;
      }

      successResponse(res, volunteer, 'Profile retrieved successfully');
    } catch (error) {
      console.error('Get profile error:', error);
      errorResponse(res, 'Failed to get profile', 500);
    }
  }

  // Update volunteer profile
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { city, skills, interests, bio, avatarUrl } = req.body;

      const volunteer = await prisma.volunteer.findFirst({
        where: { userId },
      });

      if (!volunteer) {
        notFoundResponse(res, 'Volunteer profile not found');
        return;
      }

      const updatedVolunteer = await prisma.volunteer.update({
        where: { id: volunteer.id },
        data: {
          city,
          skills,
          interests,
          bio,
          avatarUrl,
        },
        include: {
          user: {
            select: { id: true, email: true, name: true, phone: true },
          },
        },
      });

      successResponse(res, updatedVolunteer, 'Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      errorResponse(res, 'Failed to update profile', 500);
    }
  }

  // Get volunteer portfolio
  static async getPortfolio(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const volunteer = await prisma.volunteer.findFirst({
        where: { userId },
      });

      if (!volunteer) {
        notFoundResponse(res, 'Volunteer profile not found');
        return;
      }

      // Get completed opportunities
      const completedOpportunities = await prisma.application.findMany({
        where: {
          volunteerId: volunteer.id,
          status: 'COMPLETED',
        },
        include: {
          opportunity: {
            select: {
              id: true,
              title: true,
              category: true,
              location: true,
              startDate: true,
              endDate: true,
              organization: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      // Get all badges
      const badges = await prisma.earnedBadge.findMany({
        where: { volunteerId: volunteer.id },
        include: { badge: true },
        orderBy: { earnedAt: 'desc' },
      });

      // Get all certificates
      const certificates = await prisma.certificate.findMany({
        where: { volunteerId: volunteer.id },
        include: {
          opportunity: {
            select: { title: true },
          },
        },
        orderBy: { issuedAt: 'desc' },
      });

      // Get hours history
      const hoursHistory = await prisma.hoursLog.findMany({
        where: {
          application: {
            volunteerId: volunteer.id,
          },
          approvedByOrg: true,
        },
        include: {
          application: {
            include: {
              opportunity: {
                select: { title: true },
              },
            },
          },
        },
        orderBy: { checkInTime: 'desc' },
      });

      successResponse(res, {
        summary: {
          totalHours: volunteer.totalHours,
          completedOpportunities: volunteer.completedOpportunities,
          totalBadges: badges.length,
          totalCertificates: certificates.length,
        },
        completedOpportunities,
        badges,
        certificates,
        hoursHistory,
      }, 'Portfolio retrieved successfully');
    } catch (error) {
      console.error('Get portfolio error:', error);
      errorResponse(res, 'Failed to get portfolio', 500);
    }
  }

  // Get all opportunities with filters
  static async getOpportunities(req: Request, res: Response): Promise<void> {
    try {
      const {
        location,
        category,
        skills,
        startDate,
        endDate,
        search,
        page = '1',
        limit = '10',
      } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      // Build where clause
      const where: any = {
        status: 'OPEN',
      };

      if (location) {
        where.location = { contains: location as string, mode: 'insensitive' };
      }

      if (category) {
        where.category = category as string;
      }

      if (skills) {
        const skillArray = (skills as string).split(',');
        where.requiredSkills = { hasSome: skillArray };
      }

      if (startDate && endDate) {
        where.startDate = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        };
      }

      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const [opportunities, total] = await Promise.all([
        prisma.opportunity.findMany({
          where,
          include: {
            organization: {
              select: { name: true, logoUrl: true, isVerified: true },
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

  // Get opportunity details
  static async getOpportunityById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const volunteer = await prisma.volunteer.findFirst({
        where: { userId },
      });

      if (!volunteer) {
        notFoundResponse(res, 'Volunteer profile not found');
        return;
      }

      const opportunity = await prisma.opportunity.findUnique({
        where: { id },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              description: true,
              logoUrl: true,
              isVerified: true,
              city: true,
            },
          },
          _count: {
            select: { applications: true },
          },
        },
      });

      if (!opportunity) {
        notFoundResponse(res, 'Opportunity not found');
        return;
      }

      // Check if volunteer has already applied
      const existingApplication = await prisma.application.findFirst({
        where: {
          opportunityId: id,
          volunteerId: volunteer.id,
        },
      });

      successResponse(res, {
        ...opportunity,
        hasApplied: !!existingApplication,
        applicationStatus: existingApplication?.status || null,
      }, 'Opportunity retrieved successfully');
    } catch (error) {
      console.error('Get opportunity error:', error);
      errorResponse(res, 'Failed to get opportunity', 500);
    }
  }

  // Apply for opportunity
  static async applyForOpportunity(req: Request, res: Response): Promise<void> {
    try {
      const { id: opportunityId } = req.params;
      const userId = req.user!.id;
      const { message } = req.body;

      const volunteer = await prisma.volunteer.findFirst({
        where: { userId },
      });

      if (!volunteer) {
        notFoundResponse(res, 'Volunteer profile not found');
        return;
      }

      // Check if opportunity exists and is open
      const opportunity = await prisma.opportunity.findUnique({
        where: { id: opportunityId },
        include: {
          _count: {
            select: {
              applications: {
                where: { status: { in: ['ACCEPTED', 'COMPLETED'] } },
              },
            },
          },
        },
      });

      if (!opportunity) {
        notFoundResponse(res, 'Opportunity not found');
        return;
      }

      if (opportunity.status !== 'OPEN') {
        errorResponse(res, 'This opportunity is not open for applications', 400);
        return;
      }

      // Check if already applied
      const existingApplication = await prisma.application.findFirst({
        where: {
          opportunityId,
          volunteerId: volunteer.id,
        },
      });

      if (existingApplication) {
        errorResponse(res, 'You have already applied for this opportunity', 409);
        return;
      }

      // Check if opportunity is full
      if (opportunity._count.applications >= opportunity.requiredVolunteers) {
        errorResponse(res, 'This opportunity has reached the maximum number of volunteers', 400);
        return;
      }

      const application = await prisma.application.create({
        data: {
          opportunityId,
          volunteerId: volunteer.id,
          message,
          status: 'PENDING',
        },
        include: {
          opportunity: {
            select: { title: true },
          },
        },
      });

      // Create notification for organization
      await prisma.notification.create({
        data: {
          userId: opportunity.organizationId,
          type: 'OPPORTUNITY_CREATED',
          title: 'New Application',
          message: `Someone applied for "${opportunity.title}"`,
          data: { applicationId: application.id },
        },
      });

      createdResponse(res, application, 'Application submitted successfully');
    } catch (error) {
      console.error('Apply error:', error);
      errorResponse(res, 'Failed to submit application', 500);
    }
  }

  // Get my applications
  static async getMyApplications(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { status, page = '1', limit = '10' } = req.query;

      const volunteer = await prisma.volunteer.findFirst({
        where: { userId },
      });

      if (!volunteer) {
        notFoundResponse(res, 'Volunteer profile not found');
        return;
      }

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const where: any = { volunteerId: volunteer.id };
      if (status) {
        where.status = status as string;
      }

      const [applications, total] = await Promise.all([
        prisma.application.findMany({
          where,
          include: {
            opportunity: {
              select: {
                id: true,
                title: true,
                location: true,
                category: true,
                startDate: true,
                endDate: true,
                organization: {
                  select: { name: true, logoUrl: true },
                },
              },
            },
          },
          skip,
          take,
          orderBy: { appliedAt: 'desc' },
        }),
        prisma.application.count({ where }),
      ]);

      successResponse(res, applications, 'Applications retrieved successfully', 200, {
        page: parseInt(page as string),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      });
    } catch (error) {
      console.error('Get applications error:', error);
      errorResponse(res, 'Failed to get applications', 500);
    }
  }

  // Withdraw application
  static async withdrawApplication(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const volunteer = await prisma.volunteer.findFirst({
        where: { userId },
      });

      if (!volunteer) {
        notFoundResponse(res, 'Volunteer profile not found');
        return;
      }

      const application = await prisma.application.findFirst({
        where: {
          id,
          volunteerId: volunteer.id,
        },
      });

      if (!application) {
        notFoundResponse(res, 'Application not found');
        return;
      }

      if (!['PENDING', 'ACCEPTED'].includes(application.status)) {
        errorResponse(res, 'Cannot withdraw this application', 400);
        return;
      }

      await prisma.application.update({
        where: { id },
        data: { status: 'WITHDRAWN' },
      });

      successResponse(res, null, 'Application withdrawn successfully');
    } catch (error) {
      console.error('Withdraw error:', error);
      errorResponse(res, 'Failed to withdraw application', 500);
    }
  }

  // Check-in to opportunity
  static async checkIn(req: Request, res: Response): Promise<void> {
    try {
      const { id: opportunityId } = req.params;
      const userId = req.user!.id;
      const { qrToken } = req.body;

      const volunteer = await prisma.volunteer.findFirst({
        where: { userId },
      });

      if (!volunteer) {
        notFoundResponse(res, 'Volunteer profile not found');
        return;
      }

      // Find accepted application
      const application = await prisma.application.findFirst({
        where: {
          opportunityId,
          volunteerId: volunteer.id,
          status: 'ACCEPTED',
        },
      });

      if (!application) {
        notFoundResponse(res, 'No accepted application found for this opportunity');
        return;
      }

      // Check if already checked in
      const existingLog = await prisma.hoursLog.findFirst({
        where: {
          applicationId: application.id,
          checkOutTime: null,
        },
      });

      if (existingLog) {
        errorResponse(res, 'You are already checked in', 400);
        return;
      }

      const hoursLog = await prisma.hoursLog.create({
        data: {
          applicationId: application.id,
          checkInTime: new Date(),
          source: qrToken ? 'QR' : 'MANUAL',
          qrToken,
        },
      });

      successResponse(res, hoursLog, 'Checked in successfully');
    } catch (error) {
      console.error('Check-in error:', error);
      errorResponse(res, 'Failed to check in', 500);
    }
  }

  // Check-out from opportunity
  static async checkOut(req: Request, res: Response): Promise<void> {
    try {
      const { id: opportunityId } = req.params;
      const userId = req.user!.id;

      const volunteer = await prisma.volunteer.findFirst({
        where: { userId },
      });

      if (!volunteer) {
        notFoundResponse(res, 'Volunteer profile not found');
        return;
      }

      // Find accepted application
      const application = await prisma.application.findFirst({
        where: {
          opportunityId,
          volunteerId: volunteer.id,
          status: 'ACCEPTED',
        },
      });

      if (!application) {
        notFoundResponse(res, 'No accepted application found for this opportunity');
        return;
      }

      // Find active hours log
      const hoursLog = await prisma.hoursLog.findFirst({
        where: {
          applicationId: application.id,
          checkOutTime: null,
        },
      });

      if (!hoursLog) {
        errorResponse(res, 'No active check-in found', 400);
        return;
      }

      const checkOutTime = new Date();
      const totalHours = (checkOutTime.getTime() - hoursLog.checkInTime.getTime()) / (1000 * 60 * 60);

      const updatedLog = await prisma.hoursLog.update({
        where: { id: hoursLog.id },
        data: {
          checkOutTime,
          totalHours: Math.round(totalHours * 100) / 100,
        },
      });

      successResponse(res, updatedLog, 'Checked out successfully');
    } catch (error) {
      console.error('Check-out error:', error);
      errorResponse(res, 'Failed to check out', 500);
    }
  }
}
