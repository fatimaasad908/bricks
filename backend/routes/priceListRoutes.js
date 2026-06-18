import express from 'express';
import { getPriceLists, createPriceList, updatePriceList, deletePriceList } from '../controllers/priceListController.js';

const router = express.Router();

router.route('/')
  .get(getPriceLists)
  .post(createPriceList);

router.route('/:id')
  .put(updatePriceList)
  .delete(deletePriceList);

export default router;
