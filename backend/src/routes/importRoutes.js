import { Router } from 'express';
import { importTransactions } from '../controllers/importController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.post('/transactions', importTransactions);

export default router;
