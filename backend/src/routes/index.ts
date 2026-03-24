import { Router } from 'express';
import authRoutes from './auth.routes';
import volunteerRoutes from './volunteer.routes';
import organizationRoutes from './organization.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
router.use('/auth', authRoutes);
router.use('/volunteer', volunteerRoutes);
router.use('/organization', organizationRoutes);
router.use('/admin', adminRoutes);

export default router;
