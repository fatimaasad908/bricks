import express from 'express';
import { getShifts, createShift, updateShift, deleteShift } from '../controllers/shiftController.js';

const router = express.Router();

router.route('/')
  .get(getShifts)
  .post(createShift);

router.route('/:id')
  .put(updateShift)
  .delete(deleteShift);

export default router;
