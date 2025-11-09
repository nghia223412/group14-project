const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware xác thực token
exports.protect = async (req, res, next) => {
  let token;

  // Kiểm tra token trong header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Debug logging
  console.log('Auth Middleware:');
  console.log('- Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
  console.log('- Token extracted:', token ? 'Yes' : 'No');

  // Kiểm tra token có tồn tại không
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập để truy cập'
    });
  }

  try {
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    console.log('- Token decoded successfully for user ID:', decoded.id);

    // Lấy thông tin user từ token
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      console.log('- User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    console.log('- User authenticated:', req.user.email);
    next();
  } catch (error) {
    console.log('- Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

// Middleware kiểm tra role (admin)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập'
      });
    }
    next();
  };
};
