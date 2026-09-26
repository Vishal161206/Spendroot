import { Router } from 'express';
import { body } from 'express-validator';
import {
  getGoals,
  createGoal,
  contributeGoal,
  deleteGoal,
} from '../controllers/goalController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getGoals);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Goal name is required.'),
    body('targetAmount').isFloat({ gt: 0 }).withMessage('Target amount must be positive.'),
    validate
  ],
  createGoal
);

router.post(
  '/:id/contribute',
  [
    body('amount').isFloat({ gt: 0 }).withMessage('Contribution amount must be positive.'),
    validate
  ],
  contributeGoal
);

router.delete('/:id', deleteGoal);

export default router;
