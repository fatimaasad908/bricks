import express from 'express';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from '../controllers/invoiceController.js';

const router = express.Router();

router.route('/')
  .get(getInvoices)
  .post(createInvoice);

router.route('/:id')
  .put(updateInvoice)
  .delete(deleteInvoice);

export default router;
