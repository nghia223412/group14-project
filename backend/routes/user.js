const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const { protect, authorize } = require('../middleware/auth.js');

// ==================== ADMIN ROUTES - Hoạt động 3 ====================

// GET /users - Lấy danh sách tất cả user (Admin only)
router.get('/users', protect, authorize('admin'), userController.getAllUsers);

// GET /users/:id - Lấy thông tin 1 user (Admin only)
router.get('/users/:id', protect, authorize('admin'), userController.getUserById);

// PUT /users/:id/role - Cập nhật role user (Admin only)
router.put('/users/:id/role', protect, authorize('admin'), userController.updateUserRole);

// DELETE /users/me - Tự xóa tài khoản của mình
router.delete('/users/me', protect, userController.deleteMe);

// DELETE /users/:id - Xóa user (Admin hoặc chính mình)
router.delete('/users/:id', protect, userController.deleteUser);

// ==================== OLD ROUTES (deprecated) ====================

// POST /users (Tạo user mới - không dùng nữa, dùng /api/auth/signup)
router.post('/users', userController.createUser);

// PUT /users/:id (Sửa user - không dùng nữa, dùng /api/auth/profile)
router.put('/users/:id', userController.updateUser);

module.exports = router;
