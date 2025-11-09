import React, { useState } from "react";
import { createUser } from "../api/usersApi";

const AddUser = ({ onUserAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser({ name, email });
      setName("");
      setEmail("");
      onUserAdded(); // reload danh sách
    } catch (err) {
      console.error("Lỗi tạo user:", err);
      alert("Lỗi server khi tạo người dùng");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Tên"
        required
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <button type="submit">Thêm người dùng</button>
    </form>
  );
};

export default AddUser;
export const getUsers = () => axiosInstance.get("/api/users");