import express from 'express';
import { getWorkers, createWorker, updateWorker, deleteWorker } from '../controllers/workerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getWorkers)
  .post(protect, createWorker);

router.route('/:id')
  .put(protect, updateWorker)
  .delete(protect, deleteWorker);

export default router;
