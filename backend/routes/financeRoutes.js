import express from 'express';
import { getFinances, createFinance, updateFinance, deleteFinance } from '../controllers/financeController.js';

const router = express.Router();

router.route('/')
  .get(getFinances)
  .post(createFinance);

router.route('/:id')
  .put(updateFinance)
  .delete(deleteFinance);

export default router;
