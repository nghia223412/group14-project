const User = require('../models/user');  // Sửa thành chữ U hoa

// Lấy danh sách người dùng
async function getUsers(req, res) {
  try {
    console.log('GET /users - Đang tìm users...');
    const users = await User.find();
    console.log('GET /users - Kết quả:', users);
    res.json(users);
  } catch (err) {
    console.error('GET /users - Lỗi:', err);
    res.status(500).json({ message: err.message });
  }
}

// Tạo user mới
async function createUser(req, res) {
  console.log('POST /users - Body nhận được:', req.body);
  const { name, email } = req.body;

  if (!name || !email) {
    console.log('POST /users - Thiếu name hoặc email');
    return res.status(400).json({ message: 'name và email là bắt buộc' });
  }

  const newUser = new User({ name, email });
  try {
    console.log('POST /users - Đang lưu user mới:', newUser);
    const savedUser = await newUser.save();
    console.log('POST /users - Đã lưu thành công:', savedUser);
    res.status(201).json(savedUser);
  } catch (err) {
    console.error('POST /users - Lỗi khi lưu:', err);
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  getUsers,
  createUser
};
