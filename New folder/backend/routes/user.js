const express = require('express');
const router = express.Router();
const User = require('../models/userser'); // model Mongoose

// GET tất cả user
// Lấy danh sách tất cả user (không trả về password)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // loại bỏ trường password
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST tạo user mới
// Tạo user mới
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được đăng ký' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const user = new User({ name, email, password: hashedPassword });
    const newUser = await user.save();

    // Trả về thông tin user (không gửi password)
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json(userWithoutPassword);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT update user
// Cập nhật user theo ID
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Kiểm tra user tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    // Cập nhật thông tin nếu có trong body
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password; // nếu muốn hỗ trợ đổi mật khẩu

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Lỗi khi cập nhật user' });
  }
});

// DELETE user
// Xóa user theo ID
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Kiểm tra user tồn tại hay không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    // Xóa user
    await User.deleteOne({ _id: userId });

    res.json({ message: 'Đã xóa user thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Sign Up
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra email trùng
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/logout', (req, res) => {
    // Logout thực chất là xóa token phía client
    res.json({ message: 'Đăng xuất thành công' });
});

module.exports = router;
