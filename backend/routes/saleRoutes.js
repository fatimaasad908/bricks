import express from 'express';
import { getSales, createSale, updateSale, deleteSale } from '../controllers/saleController.js';

const router = express.Router();

router.route('/')
  .get(getSales)
  .post(createSale);

router.route('/:id')
  .put(updateSale)
  .delete(deleteSale);

export default router;
