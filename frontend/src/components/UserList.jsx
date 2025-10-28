import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/usersApi";

const UserList = () => {
  const [users, setUsers] = useState([]); 
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error("Lỗi load users:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createUser({ name, email });
      setName("");
      setEmail("");
      await fetchUsers();
    } catch (err) {
      console.error("Lỗi tạo user:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setName(user.name);
    setEmail(user.email);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUser(editingId, { name, email });
      setEditingId(null);
      setName("");
      setEmail("");
      await fetchUsers();
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      setError("Lỗi khi cập nhật: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    
    try {
      await deleteUser(id);
      await fetchUsers();
    } catch (err) {
      console.error("Lỗi xóa:", err);
      setError("Lỗi khi xóa: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{editingId ? "Cập nhật người dùng" : "Thêm người dùng mới"}</h2>
      <form onSubmit={editingId ? handleUpdate : handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên người dùng"
            required
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ padding: "5px 10px" }}
          >
            {isSubmitting ? "Đang xử lý..." : (editingId ? "Cập nhật" : "Thêm người dùng")}
          </button>
          {editingId && (
            <button 
              type="button"
              onClick={() => {
                setEditingId(null);
                setName("");
                setEmail("");
              }}
              style={{ marginLeft: "10px", padding: "5px 10px" }}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      <h2>Danh sách người dùng</h2>
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.length > 0 ? (
          users.map((u) => (
            <li key={u._id} style={{ 
              marginBottom: "5px", 
              padding: "5px", 
              border: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>{u.name} - {u.email}</span>
              <div>
                <button 
                  onClick={() => handleEdit(u)}
                  style={{ marginRight: "5px" }}
                >
                  Sửa
                </button>
                <button 
                  onClick={() => handleDelete(u._id)}
                  style={{ backgroundColor: "#ff4444", color: "white" }}
                >
                  Xóa
                </button>
              </div>
            </li>
          ))
        ) : !error && (
          <li>Chưa có người dùng nào.</li>
        )}
      </ul>
    </div>
  );
};

export default UserList;