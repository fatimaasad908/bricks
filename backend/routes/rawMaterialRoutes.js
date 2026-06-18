import express from 'express';
import { getRawMaterials, createRawMaterial, updateRawMaterial, deleteRawMaterial } from '../controllers/rawMaterialController.js';

const router = express.Router();

router.route('/')
  .get(getRawMaterials)
  .post(createRawMaterial);

router.route('/:id')
  .put(updateRawMaterial)
  .delete(deleteRawMaterial);

export default router;
