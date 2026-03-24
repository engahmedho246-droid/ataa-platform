import { Router } from 'express';
import { body } from 'express-validator';
import { VolunteerController } from '../controllers';
import { authenticate, isVolunteer } from '../middleware';

const router = Router();

// All routes require volunteer authentication
router.use(authenticate, isVolunteer);

// Dashboard
router.get('/dashboard', VolunteerController.getDashboard);

// Profile
router.get('/profile', VolunteerController.getProfile);
router.patch(
  '/profile',
  [
    body('city').optional().trim(),
    body('skills').optional().isArray(),
    body('interests').optional().isArray(),
    body('bio').optional().trim(),
    body('avatarUrl').optional().trim(),
  ],
  VolunteerController.updateProfile
);

// Portfolio
router.get('/portfolio', VolunteerController.getPortfolio);

// Opportunities
router.get('/opportunities', VolunteerController.getOpportunities);
router.get('/opportunities/:id', VolunteerController.getOpportunityById);
router.post(
  '/opportunities/:id/apply',
  [body('message').optional().trim()],
  VolunteerController.applyForOpportunity
);

// Applications
router.get('/applications', VolunteerController.getMyApplications);
router.patch('/applications/:id/withdraw', VolunteerController.withdrawApplication);

// Check-in/Check-out
router.post('/opportunities/:id/check-in', VolunteerController.checkIn);
router.post('/opportunities/:id/check-out', VolunteerController.checkOut);

export default router;
