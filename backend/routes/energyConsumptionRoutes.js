import express from 'express';
import { getEnergyConsumptions, createEnergyConsumption, updateEnergyConsumption, deleteEnergyConsumption } from '../controllers/energyConsumptionController.js';

const router = express.Router();

router.route('/')
  .get(getEnergyConsumptions)
  .post(createEnergyConsumption);

router.route('/:id')
  .put(updateEnergyConsumption)
  .delete(deleteEnergyConsumption);

export default router;
