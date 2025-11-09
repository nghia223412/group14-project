const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// =======================================================
// SỬA ĐỔI CẤU HÌNH CORS ĐỂ CHO PHÉP FRONTEND VERCEL
// =======================================================

const allowedOrigins = [
  'http://localhost:3000', 
  'https://group14-project-virid.vercel.app' // THÊM DOMAIN FRONTEND CỦA BẠN
];

const corsOptions = {
    origin: (origin, callback) => {
        // Cho phép các nguồn trong danh sách, hoặc cho phép các yêu cầu không có 'origin' (như Postman)
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Cho phép cookie, authorization headers
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions)); // SỬ DỤNG CẤU HÌNH MỚI
app.use(express.json());

// ... (Các phần code khác giữ nguyên)

// Kết nối MongoDB (Hoạt động 5)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/groupDB';
// ... (Logic kết nối MongoDB)

// Import routes
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

// Temporary admin setup route (chỉ dùng lần đầu)
const User = require('./models/user.js');
// ... (Logic setup admin)

app.use('/api', userRoutes); 
app.use('/api/auth', authRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
