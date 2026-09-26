import { Router } from 'express';
import { body } from 'express-validator';
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getTransactions);

router.post(
  '/',
  [
    body('merchant').trim().notEmpty().withMessage('Merchant name is required.'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero.'),
    validate
  ],
  createTransaction
);

router.delete('/:id', deleteTransaction);

export default router;
