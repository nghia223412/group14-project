const User = require('../models/user.js');

// ==================== ADMIN FUNCTIONS - Hoạt động 3 ====================

// @desc    Lấy danh sách tất cả user (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    // Lấy tất cả users, không bao gồm password
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: { users }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server khi lấy danh sách user',
      error: error.message 
    });
  }
};

// @desc    Lấy thông tin 1 user theo ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy user' 
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server',
      error: error.message 
    });
  }
};

// @desc    Cập nhật role user (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Kiểm tra role hợp lệ
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: 'Role phải là "user" hoặc "admin"' 
      });
    }

    // Không cho phép admin tự hạ quyền chính mình
    if (req.params.id === req.user.id.toString() && role === 'user') {
      return res.status(400).json({ 
        success: false,
        message: 'Không thể tự hạ quyền admin của chính mình' 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy user' 
      });
    }

    res.status(200).json({
      success: true,
      message: `Đã cập nhật role thành ${role}`,
      data: { user }
    });

  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server',
      error: error.message 
    });
  }
};

// @desc    Xóa user (Admin hoặc tự xóa)
// @route   DELETE /api/users/:id
// @access  Private
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy user' 
      });
    }

    // Kiểm tra quyền: Admin có thể xóa bất kỳ ai, user chỉ xóa chính mình
    const isAdmin = req.user.role === 'admin';
    const isOwner = req.params.id === req.user.id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ 
        success: false,
        message: 'Bạn không có quyền xóa user này' 
      });
    }

    // Không cho phép xóa admin cuối cùng
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ 
          success: false,
          message: 'Không thể xóa admin cuối cùng trong hệ thống' 
        });
      }
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Xóa user thành công',
      data: {}
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server',
      error: error.message 
    });
  }
};

// @desc    Xóa chính mình (Self Delete)
// @route   DELETE /api/users/me
// @access  Private
exports.deleteMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy user' 
      });
    }

    // Không cho phép xóa admin cuối cùng
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ 
          success: false,
          message: 'Bạn là admin cuối cùng, không thể tự xóa tài khoản' 
        });
      }
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Tài khoản của bạn đã được xóa',
      data: {}
    });

  } catch (error) {
    console.error('Delete me error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server',
      error: error.message 
    });
  }
};

// ==================== OLD FUNCTIONS (giữ lại để tương thích) ====================

// GET: Lấy tất cả user từ MongoDB (không dùng nữa - dùng getAllUsers)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST: Tạo user mới vào MongoDB (không dùng nữa - dùng signup)
// POST: Tạo user mới (deprecated - dùng /api/auth/signup thay thế)
// Giữ lại để tương thích với frontend cũ
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng cung cấp đầy đủ: name, email, password' 
      });
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Email đã được sử dụng' 
      });
    }

    // Tạo user mới (password sẽ tự động hash qua pre-save middleware)
    const user = await User.create({
      name,
      email,
      password,
      role: 'user' // Mặc định là user thường
    });

    res.status(201).json({
      success: true,
      data: user
    });

  } catch (err) {
    console.error('Create user error:', err);
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

// PUT: Cập nhật user (không dùng nữa - dùng updateProfile hoặc updateUserRole)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
