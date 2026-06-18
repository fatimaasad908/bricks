import express from 'express';
import { createContactMessage, getContactMessages, deleteContactMessage } from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createContactMessage) // Public create
  .get(protect, getContactMessages); // Protected read

router.route('/:id')
  .delete(protect, deleteContactMessage); // Protected delete

export default router;
