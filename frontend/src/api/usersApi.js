import axios from "axios";

// URL backend qua ngrok
const API_BASE = "https://impressionless-corrine-repealable.ngrok-free.dev";

// axios instance với header bỏ warning ngrok
const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { "ngrok-skip-browser-warning": "true" }
});

// GET danh sách người dùng (trả về data trực tiếp)
export const getUsers = async () => {
  const res = await axiosInstance.get("/api/users");
  return res.data;
};

// POST thêm người dùng mới
export const createUser = async (user) => {
  const res = await axiosInstance.post("/api/users", user);
  return res.data;
};

// PUT cập nhật người dùng
export const updateUser = async (id, user) => {
  const res = await axiosInstance.put(`/api/users/${id}`, user);
  return res.data;
};

// DELETE người dùng
export const deleteUser = async (id) => {
  const res = await axiosInstance.delete(`/api/users/${id}`);
  return res.data;
};