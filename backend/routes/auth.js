const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Forgot Password routes - Hoạt động 4
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password/:resetToken', authController.resetPassword);

// Protected routes (cần token)
router.get('/me', protect, authController.getMe);

// Profile routes - Hoạt động 2
router.get('/profile', protect, authController.viewProfile);
router.put('/profile', protect, authController.updateProfile);

// Avatar upload - Hoạt động 4
router.put('/avatar', protect, authController.uploadAvatar);

module.exports = router;
