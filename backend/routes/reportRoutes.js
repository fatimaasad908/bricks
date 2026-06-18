import express from 'express';
import { getReports, createReport, updateReport, deleteReport } from '../controllers/reportController.js';

const router = express.Router();

router.route('/')
  .get(getReports)
  .post(createReport);

router.route('/:id')
  .put(updateReport)
  .delete(deleteReport);

export default router;
