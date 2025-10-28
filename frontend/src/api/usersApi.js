import axios from "axios";

// URL backend qua ngrok
const API_BASE = "https://impressionless-corrine-repealable.ngrok-free.dev";

// axios instance với header bỏ warning ngrok
const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { "ngrok-skip-browser-warning": "true" }
});

// GET danh sách người dùng
export const getUsers = () => axiosInstance.get("/api/users");

// POST thêm người dùng mới
export const createUser = (user) => axiosInstance.post("/api/users", user);
