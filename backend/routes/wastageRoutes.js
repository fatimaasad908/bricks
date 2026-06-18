import express from 'express';
import { getWastageRecords, createWastageRecord, updateWastageRecord, deleteWastageRecord } from '../controllers/wastageController.js';

const router = express.Router();

router.route('/')
  .get(getWastageRecords)
  .post(createWastageRecord);

router.route('/:id')
  .put(updateWastageRecord)
  .delete(deleteWastageRecord);

export default router;
