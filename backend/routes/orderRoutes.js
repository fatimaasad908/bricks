import express from 'express';
import { createOrderQuote, getOrderQuotes, updateOrderStatus, deleteOrderQuote, getUnreadOrdersCount, markOrdersAsRead, getMyOrders } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createOrderQuote) // Public create
  .get(protect, admin, getOrderQuotes); // Protected read

router.get('/my-orders', protect, getMyOrders);
router.get('/unread', protect, admin, getUnreadOrdersCount);
router.put('/mark-read', protect, admin, markOrdersAsRead);


router.route('/:id')
  .put(protect, admin, updateOrderStatus) // Protected update
  .delete(protect, admin, deleteOrderQuote); // Protected delete

export default router;
