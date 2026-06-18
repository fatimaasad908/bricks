import express from 'express';
import { signup, login, adminLogin, verifyEmail, getProfile, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/verify/:token', verifyEmail);

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);


export default router;
