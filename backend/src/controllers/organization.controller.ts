import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { successResponse, errorResponse, createdResponse, notFoundResponse } from '../utils';

export class OrganizationController {
  // Get organization dashboard
  static async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const organization = await prisma.organization.findFirst({
        where: { userId },
      });

      if (!organization) {
        notFoundResponse(res, 'Organization profile not found');
        return;
      }

      const [
        totalOpportunities,
        activeOpportunities,
        totalVolunteers,
        pendingApplications,
        totalHoursResult,
      ] = await Promise.all([
        prisma.opportunity.count({
          where: { organizationId: organization.id },
        }),
        prisma.opportunity.count({
          where: {
            organizationId: organization.id,
            status: 'OPEN',
          },
        }),
        prisma.application.count({
          where: {
            opportunity: {
              organizationId: organization.id,
            },
            status: { in: ['ACCEPTED', 'COMPLETED'] },
          },
        }),
        prisma.application.count({
          where: {
            opportunity: {
              organizationId: organization.id,
            },
            status: 'PENDING',
          },
        }),
        prisma.hoursLog.aggregate({
          where: {
            application: {
              opportunity: {
                organizationId: organization.id,
              },
            },
            approvedByOrg: true,
          },
          _sum: { totalHours: true },
        }),
      ]);

      const recentApplications = await prisma.application.findMany({
        where: {
          opportunity: {
            organizationId: organization.id,
          },
        },
        include: {
          volunteer: {
            include: {
              user: {
                select: { name: true },
              },
            },
          },
          opportunity: {
            select: { title: true },
          },
        },
        take: 5,
        orderBy: { appliedAt: 'desc' },
      });

      successResponse(res, {
        stats: {
          totalOpportunities,
          activeOpportunities,
          totalVolunteers,
          pendingApplications,
          totalHours: totalHoursResult._sum.totalHours || 0,
        },
        recentApplications,
      }, 'Dashboard retrieved successfully');
    } catch (error) {
      console.error('Get dashboard error:', error);
      errorResponse(res, 'Failed to get dashboard', 500);
    }
  }

  // Get organization profile
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const organization = await prisma.organization.findFirst({
        where: { userId },
        include: {
          user: {
            select: { id: true, email: true, name: true, phone: true },
          },
          _count: {
            select: { opportunities: true },
          },
        },
      });

      if (!organization) {
        notFoundResponse(res, 'Organization profile not found');
        return;
      }

      successResponse(res, organization, 'Profile retrieved successfully');
    } catch (error) {
      console.error('Get profile error:', error);
      errorResponse(res, 'Failed to get profile', 500);
    }
  }

  // Update organization profile
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { name, description, website, logoUrl, address, city } = req.body;

      const organization = await prisma.organization.findFirst({
        where: { userId },
      });

      if (!organization) {
        notFoundResponse(res, 'Organization profile not found');
        return;
      }

      const updatedOrganization = await prisma.organization.update({
        where: { id: organization.id },
        data: {
          name,
          description,
          website,
          logoUrl,
          address,
          city,
        },
        include: {
          user: {
            select: { id: true, email: true, name: true, phone: true },
          },
        },
      });

      successResponse(res, updatedOrganization, 'Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      errorResponse(res, 'Failed to update profile', 500);
    }
  }

  // Create opportunity
  static async createOpportunity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const {
        title,
        description,
        location,
        category,
        requiredSkills,
        requiredVolunteers,
        startDate,
        endDate,
        imageUrl,
      } = req.body;

      const organization = await prisma.organization.findFirst({
        where: { userId },
      });

      if (!organization) {
        notFoundResponse(res, 'Organization profile not found');
        return;
      }

      if (!organization.isVerified) {
        errorResponse(res, 'Organization must be verified to create opportunities', 403);
        return;
      }

      const opportunity = await prisma.opportunity.create({
        data: {
          organizationId: organization.id,
          title,
          description,
          location,
          category,
          requiredSkills: requiredSkills || [],
          requiredVolunteers: requiredVolunteers || 1,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          imageUrl,
          status: 'DRAFT',
        },
      });

      createdResponse(res, opportunity, 'Opportunity created successfully');
    } catch (error) {
      console.error('Create opportunity error:', error);
      errorResponse(res, 'Failed to create opportunity', 500);
    }
  }

  // Get organization's opportunities
  static async getOpportunities(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { status, page = '1', limit = '10' } = req.query;

      const organization = await prisma.organization.findFirst({
        where: { userId },
      });

      if (!organization) {
        notFoundResponse(res, 'Organization profile not found');
        return;
      }

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const where: any = { organizationId: organization.id };
      if (status) {
        where.status = status as string;
      }

      const [opportunities, total] = await Promise.all([
        prisma.opportunity.findMany({
          where,
          include: {
            _count: {
              select: {
                applications: true,
              },
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

  // Get opportunity by ID
  static async getOpportunityById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const organization = await prisma.organization.findFirst({
        where: { userId },
      });

      if (!organization) {
        notFoundResponse(res, 'Organization profile not found');
        return;
      }

      const opportunity = await prisma.opportunity.findFirst({
        where: {
          id,
          organizationId: organization.id,
        },
        include: {
          _count: {
            select: { applications: true },
          },
        },
      });

      if (!opportunity) {
        notFoundResponse(res, 'Opportunity not found');
        return;
      }

      successResponse(res, opportunity, 'Opportunity retrieved successfully');
    } catch (error) {
      console.error('Get opportunity error:', error);
      errorResponse(res, 'Failed to get opportunity', 500);
    }
  }

  // Update opportunity
  static async updateOpportunity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const updateData = req.body;

      const organization = await prisma.organization.findFirst({
        where: { userId },
      });

      if (!organization) {
        notFoundResponse(res, 'Organization profile not found');
        return;
      }

      const opportunity = await prisma.opportunity.findFirst({
        where: {
          id,
          organizationId: organization.id,
        },
      });

      if (!opportunity) {
        notFoundResponse(res, 'Opportunity not found');
        return;
      }

      // Convert dates if provided
      if (updateData.startDate) {
        updateData.startDate = new Date(updateData.startDate);
      }
      if (updateData.endDate) {
        updateData.endDate = new Date(updateData.endDate);
      }

      const updatedOpportunity = await prisma.opportunity.update({
        where: { id },
        data: updateData,
      });

      successResponse(res, updatedOpportunity, 'Opportunity updated successfully');
    } catch (error) {
      console.error('Update opportunity error:', error);
      errorResponse(res, 'Failed to update opportunity', 500);
    }
  }

  // Change opportunity status
  static async changeOpportunityStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { status } = req.body;

      const organization = await prisma.organization.findFirst({
        where: { userId },
      });

      if (!organization) {
        notFoundResponse(res, 'Organization profile not found');
        return;
      }

      const opportunity = await prisma.opportunity.findFirst({
        where: {
          id,
          organizationId: organization.id,
        },
      });

      if (!opportunity) {
        notFoundResponse(res, 'Opportunity not found');
        return;
      }

      const updatedOpportunity = await prisma.opportunity.update({
        where: { id },
        data: { status },
      });

      successResponse(res, updatedOpportunity, 'Opportunity status updated successfully');
    } catch (error) {
      console.error('Change status error:', error);
      errorResponse(res, 'Failed to change opportunity status', 500);
    }
  }

  // Get opportunity applications
  static async getApplications(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id: opportunityId } = req.params;
      const { status, page = '1', limit = '10' } = req.query;

      const organization = await prisma.organization.findFirst({
        where: { userId },
      });

      if (!organization) {
        notFoundResponse(res, 'Organization profile not found');
        return;
      }

      // Verify opportunity belongs to organization
      const opportunity = await prisma.opportunity.findFirst({
        where: {
          id: opportunityId,
          organizationId: organization.id,
        },
      });

      if (!opportunity) {
        notFoundResponse(res, 'Opportunity not found');
        return;
      }

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const where: any = { opportunityId };
      if (status) {
        where.status = status as string;
      }

      const [applications, total] = await Promise.all([
        prisma.application.findMany({
          where,
          include: {
            volunteer: {
              include: {
                user: {
                  select: { name: true, email: true, phone: true },
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

  // Respond to application (accept/reject)
  static async respondToApplication(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id: opportunityId, applicationId } = req.params;
      const { status, note } = req.body;

      const organization = await prisma.organization.findFirst({
        where: { userId },
      });

      if (!organization) {
        notFoundResponse(res, 'Organization profile not found');
        return;
      }

      // Verify opportunity belongs to organization
      const opportunity = await prisma.opportunity.findFirst({
        where: {
          id: opportunityId,
          organizationId: organization.id,
        },
      });

      if (!opportunity) {
        notFoundResponse(res, 'Opportunity not found');
        return;
      }

      const application = await prisma.application.findFirst({
        where: {
          id: applicationId,
          opportunityId,
        },
        include: {
          volunteer: {
            include: {
              user: {
                select: { id: true },
              },
            },
          },
        },
      });

      if (!application) {
        notFoundResponse(res, 'Application not found');
        return;
      }

      if (application.status !== 'PENDING') {
        errorResponse(res, 'Application has already been responded to', 400);
        return;
      }

      const updatedApplication = await prisma.application.update({
        where: { id: applicationId },
        data: {
          status,
          responseNote: note,
          respondedAt: new Date(),
        },
      });

      // Create notification for volunteer
      await prisma.notification.create({
        data: {
          userId: application.volunteer.user.id,
          type: 'APPLICATION_STATUS',
          title: `Application ${status}`,
          message: `Your application for "${opportunity.title}" has been ${status.toLowerCase()}`,
          data: { applicationId, opportunityId, status },
        },
      });

      successResponse(res, updatedApplication, `Application ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Respond to application error:', error);
      errorResponse(res, 'Failed to respond to application', 500);
    }
  }

  // Get hours logs for opportunity
  static async getHoursLogs(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id: opportunityId } = req.params;

      const organization = await prisma.organization.findFirst({
        where: { userId },
      });

      if (!organization) {
        notFoundResponse(res, 'Organization profile not found');
        return;
      }

      // Verify opportunity belongs to organization
      const opportunity = await prisma.opportunity.findFirst({
        where: {
          id: opportunityId,
          organizationId: organization.id,
        },
      });

      if (!opportunity) {
        notFoundResponse(res, 'Opportunity not found');
        return;
      }

      const hoursLogs = await prisma.hoursLog.findMany({
        where: {
          application: {
            opportunityId,
          },
        },
        include: {
          application: {
            include: {
              volunteer: {
                include: {
                  user: {
                    select: { name: true },
                  },
                },
              },
            },
          },
        },
        orderBy: { checkInTime: 'desc' },
      });

      successResponse(res, hoursLogs, 'Hours logs retrieved successfully');
    } catch (error) {
      console.error('Get hours logs error:', error);
      errorResponse(res, 'Failed to get hours logs', 500);
    }
  }

  // Approve hours log
  static async approveHours(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id: opportunityId, logId } = req.params;

      const organization = await prisma.organization.findFirst({
        where: { userId },
      });

      if (!organization) {
        notFoundResponse(res, 'Organization profile not found');
        return;
      }

      // Verify opportunity belongs to organization
      const opportunity = await prisma.opportunity.findFirst({
        where: {
          id: opportunityId,
          organizationId: organization.id,
        },
      });

      if (!opportunity) {
        notFoundResponse(res, 'Opportunity not found');
        return;
      }

      const hoursLog = await prisma.hoursLog.findFirst({
        where: {
          id: logId,
          application: {
            opportunityId,
          },
        },
        include: {
          application: {
            include: {
              volunteer: true,
            },
          },
        },
      });

      if (!hoursLog) {
        notFoundResponse(res, 'Hours log not found');
        return;
      }

      if (hoursLog.approvedByOrg) {
        errorResponse(res, 'Hours already approved', 400);
        return;
      }

      const updatedLog = await prisma.hoursLog.update({
        where: { id: logId },
        data: {
          approvedByOrg: true,
          approvedAt: new Date(),
          approvedById: organization.id,
        },
      });

      // Update volunteer total hours
      await prisma.volunteer.update({
        where: { id: hoursLog.application.volunteerId },
        data: {
          totalHours: {
            increment: hoursLog.totalHours || 0,
          },
        },
      });

      successResponse(res, updatedLog, 'Hours approved successfully');
    } catch (error) {
      console.error('Approve hours error:', error);
      errorResponse(res, 'Failed to approve hours', 500);
    }
  }

  // Issue certificate
  static async issueCertificate(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id: opportunityId, volunteerId } = req.params;

      const organization = await prisma.organization.findFirst({
        where: { userId },
      });

      if (!organization) {
        notFoundResponse(res, 'Organization profile not found');
        return;
      }

      // Verify opportunity belongs to organization
      const opportunity = await prisma.opportunity.findFirst({
        where: {
          id: opportunityId,
          organizationId: organization.id,
        },
      });

      if (!opportunity) {
        notFoundResponse(res, 'Opportunity not found');
        return;
      }

      // Check if volunteer has completed application
      const application = await prisma.application.findFirst({
        where: {
          opportunityId,
          volunteerId,
          status: 'COMPLETED',
        },
        include: {
          volunteer: {
            include: {
              user: {
                select: { id: true, name: true },
              },
            },
          },
        },
      });

      if (!application) {
        errorResponse(res, 'Volunteer has not completed this opportunity', 400);
        return;
      }

      // Check if certificate already exists
      const existingCertificate = await prisma.certificate.findFirst({
        where: {
          opportunityId,
          volunteerId,
        },
      });

      if (existingCertificate) {
        errorResponse(res, 'Certificate already issued for this volunteer', 409);
        return;
      }

      // Calculate total hours
      const hoursResult = await prisma.hoursLog.aggregate({
        where: {
          applicationId: application.id,
          approvedByOrg: true,
        },
        _sum: { totalHours: true },
      });

      const totalHours = hoursResult._sum.totalHours || 0;

      // Generate certificate hash
      const certificateHash = `ATAA-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const certificate = await prisma.certificate.create({
        data: {
          volunteerId,
          opportunityId,
          hours: totalHours,
          certificateHash,
          pdfUrl: null, // Can be generated later
        },
      });

      // Create notification for volunteer
      await prisma.notification.create({
        data: {
          userId: application.volunteer.user.id,
          type: 'CERTIFICATE_ISSUED',
          title: 'Certificate Issued',
          message: `You have received a certificate for "${opportunity.title}"`,
          data: { certificateId: certificate.id },
        },
      });

      createdResponse(res, certificate, 'Certificate issued successfully');
    } catch (error) {
      console.error('Issue certificate error:', error);
      errorResponse(res, 'Failed to issue certificate', 500);
    }
  }
}
