import express from 'express';
import { getPurchaseOrders, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } from '../controllers/purchaseOrderController.js';

const router = express.Router();

router.route('/')
  .get(getPurchaseOrders)
  .post(createPurchaseOrder);

router.route('/:id')
  .put(updatePurchaseOrder)
  .delete(deletePurchaseOrder);

export default router;
