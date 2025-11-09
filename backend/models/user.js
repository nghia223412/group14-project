const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Vui lòng nhập tên']
  },
  email: { 
    type: String, 
    required: [true, 'Vui lòng nhập email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
  },
  password: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    select: false // Không trả về password khi query
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  // Forgot Password fields - Hoạt động 4
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method để so sánh mật khẩu
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method tạo reset password token - Hoạt động 4
userSchema.methods.getResetPasswordToken = function() {
  // Tạo token ngẫu nhiên
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token và lưu vào database
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set thời gian hết hạn (10 phút)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // Trả về token chưa hash (để gửi cho user qua email)
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
