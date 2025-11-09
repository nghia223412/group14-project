const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Kết nối MongoDB (Hoạt động 5)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/groupDB';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

// Temporary admin setup route (chỉ dùng lần đầu)
const User = require('./models/User.js');
app.post('/api/setup-admin', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Nếu đã tồn tại, update role thành admin
      existingUser.role = 'admin';
      await existingUser.save();
      return res.json({ 
        success: true, 
        message: 'User đã tồn tại, đã cập nhật role thành admin',
        data: { name: existingUser.name, email: existingUser.email, role: existingUser.role }
      });
    }

    // Tạo admin mới
    const admin = await User.create({
      name: name || 'Admin',
      email,
      password,
      role: 'admin'
    });

    res.status(201).json({ 
      success: true, 
      message: 'Tạo tài khoản admin thành công',
      data: { name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (error) {
    console.error('Setup admin error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.use('/api', userRoutes); // Mount user routes tại /api
app.use('/api/auth', authRoutes); // Mount auth routes tại /api/auth

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
