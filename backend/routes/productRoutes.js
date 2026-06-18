import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadProductImage } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts) // Public read
  .post(protect, admin, createProduct); // Protected write

router.route('/upload')
  .post(protect, admin, uploadProductImage);

router.route('/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
