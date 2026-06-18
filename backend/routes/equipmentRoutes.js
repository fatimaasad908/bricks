import express from 'express';
import { getEquipment, createEquipment, updateEquipment, deleteEquipment } from '../controllers/equipmentController.js';

const router = express.Router();

router.route('/')
  .get(getEquipment)
  .post(createEquipment);

router.route('/:id')
  .put(updateEquipment)
  .delete(deleteEquipment);

export default router;
