import { Router } from 'express';
import { body } from 'express-validator';
import { AdminController } from '../controllers';
import { authenticate, isAdmin } from '../middleware';

const router = Router();

// All routes require admin authentication
router.use(authenticate, isAdmin);

// Dashboard
router.get('/dashboard', AdminController.getDashboard);

// Users
router.get('/users', AdminController.getUsers);
router.get('/users/:id', AdminController.getUserById);
router.patch(
  '/users/:id/status',
  [body('status').isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED'])],
  AdminController.updateUserStatus
);
router.delete('/users/:id', AdminController.deleteUser);

// Organizations Verification
router.get('/organizations/pending', AdminController.getPendingOrganizations);
router.patch(
  '/organizations/:id/verify',
  [
    body('status').isIn(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']),
    body('reason').optional().trim(),
  ],
  AdminController.verifyOrganization
);

// Badges
router.get('/badges', AdminController.getBadges);
router.post(
  '/badges',
  [
    body('name').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('icon').trim().notEmpty(),
    body('criteriaType').isIn(['TOTAL_HOURS', 'COMPLETED_OPPORTUNITIES', 'SPECIFIC_CATEGORY', 'STREAK_DAYS', 'SPECIAL_ACHIEVEMENT']),
    body('threshold').isFloat({ min: 0 }),
    body('color').optional().trim(),
  ],
  AdminController.createBadge
);
router.patch(
  '/badges/:id',
  [
    body('name').optional().trim(),
    body('description').optional().trim(),
    body('icon').optional().trim(),
    body('criteriaType').optional().isIn(['TOTAL_HOURS', 'COMPLETED_OPPORTUNITIES', 'SPECIFIC_CATEGORY', 'STREAK_DAYS', 'SPECIAL_ACHIEVEMENT']),
    body('threshold').optional().isFloat({ min: 0 }),
    body('color').optional().trim(),
  ],
  AdminController.updateBadge
);
router.delete('/badges/:id', AdminController.deleteBadge);

// Opportunities
router.get('/opportunities', AdminController.getAllOpportunities);

// Statistics
router.get('/statistics', AdminController.getStatistics);

// Admin creation (for initial setup)
router.post(
  '/create-admin',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
  ],
  AdminController.createAdmin
);

export default router;
