const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// =======================================================
// CẤU HÌNH MIDDLEWARE
// =======================================================

// 1. Body Parser: Phải chạy trước CORS và các route khác.
app.use(express.json());


// 2. CẤU HÌNH CORS (Cross-Origin Resource Sharing)
// Khai báo domain Frontend Vercel của bạn
const allowedOrigins = [
    'http://localhost:3000',
    'https://group14-project-virid.vercel.app',  // Giữ lại nếu cần
    'https://group14-project-virid2.vercel.app', // Giữ lại nếu cần
    'https://group14-project-vdi2.vercel.app'
];

const corsOptions = {
    origin: (origin, callback) => {
        // Cho phép các nguồn trong danh sách, hoặc cho phép các yêu cầu không có 'origin'
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            console.error('CORS blocked origin:', origin);
            callback(new Error(`Not allowed by CORS policy: ${origin}`));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", 
    credentials: true, // Quan trọng để gửi cookie/headers Authorization
    optionsSuccessStatus: 204 // Mã phản hồi cho yêu cầu OPTIONS thành công
};

// Áp dụng CORS middleware: SỬ DỤNG ĐÚNG biến 'corsOptions' đã cấu hình chi tiết
app.use(cors(corsOptions)); 


// =======================================================
// KẾT NỐI MONGODB
// =======================================================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/groupDB';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));


// =======================================================
// IMPORT VÀ MOUNT ROUTES
// =======================================================

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const User = require('./models/user.js'); // Đảm bảo đúng tên file 'user.js'


// Định tuyến
app.use('/api', userRoutes);         // Mount user routes
app.use('/api/auth', authRoutes);    // Mount auth routes


// =======================================================
// TEMPORARY ADMIN SETUP ROUTE
// =======================================================

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


// =======================================================
// KHỞI ĐỘNG SERVER
// =======================================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
