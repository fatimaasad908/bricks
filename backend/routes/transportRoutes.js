import express from 'express';
import { 
  getTransports, createTransport, updateTransport, deleteTransport,
  getTrucks, createTruck, updateTruck, deleteTruck,
  getDrivers, createDriver, updateDriver, deleteDriver 
} from '../controllers/transportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/trucks')
  .get(protect, admin, getTrucks)
  .post(protect, admin, createTruck);

router.route('/trucks/:id')
  .put(protect, admin, updateTruck)
  .delete(protect, admin, deleteTruck);

router.route('/drivers')
  .get(protect, admin, getDrivers)
  .post(protect, admin, createDriver);

router.route('/drivers/:id')
  .put(protect, admin, updateDriver)
  .delete(protect, admin, deleteDriver);

router.route('/')
  .get(protect, admin, getTransports)
  .post(protect, admin, createTransport);

router.route('/:id')
  .put(protect, admin, updateTransport)
  .delete(protect, admin, deleteTransport);

export default router;
