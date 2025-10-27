# Dự án Nhóm 14 – Quản lý Người Dùng (Fullstack MERN)

## Giới thiệu dự án
Dự án xây dựng hệ thống quản lý người dùng cơ bản, gồm các chức năng: thêm mới người dùng (Create), hiển thị danh sách người dùng (Read), chỉnh sửa thông tin người dùng (Update), xóa người dùng (Delete). Hệ thống hoạt động theo mô hình MERN (MongoDB – Express – React – Node.js), kết nối qua API RESTful.

## Công nghệ sử dụng
Backend: Node.js, Express.js, MongoDB Atlas, Mongoose, dotenv, Ngrok (public API). Frontend: React.js, Axios, React Hooks, CSS/Tailwind (tùy chọn).

## Hướng dẫn cài đặt và chạy dự án
Clone project: `git clone https://github.com/dncuni/group14-project.git` và di chuyển vào thư mục `group14-project`. 
Cài đặt backend: `cd backend` → `npm install`, tạo file `.env` với nội dung `PORT=3000` và `MONGO_URI=<chuỗi_kết_nối_MongoDB_Atlas>`. 
Chạy server backend: `node server.js` hoặc `npx nodemon server.js`. 
Backend chạy ở `http://localhost:3000`. 
Cài đặt frontend: `cd ../frontend` → `npm install` → `npm start`. 
Frontend chạy ở `http://localhost:3001` (có thể chỉnh port trong `package.json`). 
Tùy chọn: dùng ngrok để public backend: `cd ../backend` → `ngrok http 3000` → copy link hiển thị và cập nhật trong `axiosInstance.js` của frontend.

## Đóng góp của từng thành viên
Sinh viên 1 (Trần Minh Nghĩa - 223412) – Backend + Database: xây dựng REST API (GET, POST, PUT, DELETE), kết nối MongoDB. 
Sinh viên 2 (Lâm Ngọc Như - 225224) – Frontend: giao diện React, gọi API, hiển thị dữ liệu, thêm/sửa/xóa người dùng. 
Cả 2 cùng làm – Tổng hợp & báo cáo: hoàn thiện README.md, kiểm thử, tạo ảnh demo và PR cuối cùng.

## Ảnh minh họa
Giao diện hiển thị danh sách người dùng, ảnh test API bằng Postman, ảnh CRUD đầy đủ (Create - Read - Update - Delete).

## Link GitHub
[https://github.com/dncuni/group14-project]
