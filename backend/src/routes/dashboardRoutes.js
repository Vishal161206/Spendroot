import { Router } from 'express';
import { getDashboardSummary, getDashboardAnalytics } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/summary', getDashboardSummary);
router.get('/analytics', getDashboardAnalytics);

export default router;
