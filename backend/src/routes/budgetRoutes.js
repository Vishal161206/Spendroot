import { Router } from 'express';
import { body } from 'express-validator';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getBudgets);

router.post(
  '/',
  [
    body('category').trim().notEmpty().withMessage('Category is required.'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be positive.'),
    validate
  ],
  createBudget
);

router.put(
  '/:id',
  [
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be positive.'),
    validate
  ],
  updateBudget
);

router.delete('/:id', deleteBudget);

export default router;
