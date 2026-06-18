import express from 'express';
import { getSalesOrders, createSalesOrder, updateSalesOrder, deleteSalesOrder } from '../controllers/salesOrderController.js';

const router = express.Router();

router.route('/')
  .get(getSalesOrders)
  .post(createSalesOrder);

router.route('/:id')
  .put(updateSalesOrder)
  .delete(deleteSalesOrder);

export default router;
