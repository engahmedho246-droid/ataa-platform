import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers';
import { authenticate } from '../middleware';

const router = Router();

// Register as Volunteer
router.post(
  '/register/volunteer',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
    body('phone').optional().trim(),
    body('city').optional().trim(),
    body('skills').optional().isArray(),
    body('interests').optional().isArray(),
    body('bio').optional().trim(),
  ],
  AuthController.registerVolunteer
);

// Register as Organization
router.post(
  '/register/organization',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
    body('phone').optional().trim(),
    body('orgName').trim().notEmpty(),
    body('orgType').isIn(['NON_PROFIT', 'GOVERNMENT', 'PRIVATE', 'EDUCATIONAL', 'HEALTHCARE', 'OTHER']),
    body('licenseNumber').optional().trim(),
    body('description').optional().trim(),
    body('website').optional().trim(),
    body('address').optional().trim(),
    body('city').optional().trim(),
  ],
  AuthController.registerOrganization
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  AuthController.login
);

// Get current user
router.get('/me', authenticate, AuthController.getCurrentUser);

// Change password
router.post(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }),
  ],
  AuthController.changePassword
);

export default router;
