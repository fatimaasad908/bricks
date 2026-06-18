import express from 'express';
import { getProductionBatches, createProductionBatch, updateProductionBatch, deleteProductionBatch } from '../controllers/productionBatchController.js';

const router = express.Router();

router.route('/')
  .get(getProductionBatches)
  .post(createProductionBatch);

router.route('/:id')
  .put(updateProductionBatch)
  .delete(deleteProductionBatch);

export default router;
