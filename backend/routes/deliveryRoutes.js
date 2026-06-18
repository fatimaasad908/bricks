import express from 'express';
import { getDeliveries, createDelivery, updateDelivery, deleteDelivery } from '../controllers/deliveryController.js';

const router = express.Router();

router.route('/')
  .get(getDeliveries)
  .post(createDelivery);

router.route('/:id')
  .put(updateDelivery)
  .delete(deleteDelivery);

export default router;
