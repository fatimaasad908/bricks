import express from 'express';
import { getProductions, createProduction, updateProduction, deleteProduction } from '../controllers/productionController.js';

const router = express.Router();

router.route('/')
  .get(getProductions)
  .post(createProduction);

router.route('/:id')
  .put(updateProduction)
  .delete(deleteProduction);

export default router;
