import { Router } from 'express';
import { getInsights, calculateSimulation, applyRecommendation } from '../controllers/insightController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getInsights);
router.post('/simulate', calculateSimulation);
router.post('/recommendations/:id/apply', applyRecommendation);

export default router;
