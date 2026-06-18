import express from 'express';
import { getQualityControlRecords, createQualityControlRecord, updateQualityControlRecord, deleteQualityControlRecord } from '../controllers/qualityControlController.js';

const router = express.Router();

router.route('/')
  .get(getQualityControlRecords)
  .post(createQualityControlRecord);

router.route('/:id')
  .put(updateQualityControlRecord)
  .delete(deleteQualityControlRecord);

export default router;
