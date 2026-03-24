import { Router } from 'express';
import { body } from 'express-validator';
import { OrganizationController } from '../controllers';
import { authenticate, isOrganization } from '../middleware';

const router = Router();

// All routes require organization authentication
router.use(authenticate, isOrganization);

// Dashboard
router.get('/dashboard', OrganizationController.getDashboard);

// Profile
router.get('/profile', OrganizationController.getProfile);
router.patch(
  '/profile',
  [
    body('name').optional().trim(),
    body('description').optional().trim(),
    body('website').optional().trim(),
    body('logoUrl').optional().trim(),
    body('address').optional().trim(),
    body('city').optional().trim(),
  ],
  OrganizationController.updateProfile
);

// Opportunities
router.post(
  '/opportunities',
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('location').trim().notEmpty(),
    body('category').trim().notEmpty(),
    body('requiredSkills').optional().isArray(),
    body('requiredVolunteers').optional().isInt({ min: 1 }),
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
    body('imageUrl').optional().trim(),
  ],
  OrganizationController.createOpportunity
);

router.get('/opportunities', OrganizationController.getOpportunities);
router.get('/opportunities/:id', OrganizationController.getOpportunityById);
router.patch(
  '/opportunities/:id',
  [
    body('title').optional().trim(),
    body('description').optional().trim(),
    body('location').optional().trim(),
    body('category').optional().trim(),
    body('requiredSkills').optional().isArray(),
    body('requiredVolunteers').optional().isInt({ min: 1 }),
    body('startDate').optional().isISO8601(),
    body('endDate').optional().isISO8601(),
    body('imageUrl').optional().trim(),
  ],
  OrganizationController.updateOpportunity
);
router.patch(
  '/opportunities/:id/status',
  [body('status').isIn(['DRAFT', 'OPEN', 'CLOSED', 'CANCELLED', 'COMPLETED'])],
  OrganizationController.changeOpportunityStatus
);

// Applications
router.get('/opportunities/:id/applications', OrganizationController.getApplications);
router.patch(
  '/opportunities/:id/applications/:applicationId',
  [
    body('status').isIn(['ACCEPTED', 'REJECTED']),
    body('note').optional().trim(),
  ],
  OrganizationController.respondToApplication
);

// Hours Management
router.get('/opportunities/:id/hours', OrganizationController.getHoursLogs);
router.patch('/opportunities/:id/hours/:logId/approve', OrganizationController.approveHours);

// Certificates
router.post('/opportunities/:id/certificates/:volunteerId', OrganizationController.issueCertificate);

export default router;
