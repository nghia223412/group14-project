import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/usersApi";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validateName = (name) => {
  return name.trim().length >= 2;
};

const UserList = () => {
  const [users, setUsers] = useState([]); 
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [validation, setValidation] = useState({
    name: { valid: true, message: "" },
    email: { valid: true, message: "" }
  });

  const validateForm = () => {
    const nameValid = validateName(name);
    const emailValid = validateEmail(email);

    setValidation({
      name: {
        valid: nameValid,
        message: nameValid ? "" : "Tên phải có ít nhất 2 ký tự"
      },
      email: {
        valid: emailValid,
        message: emailValid ? "" : "Email không đúng định dạng"
      }
    });

    return nameValid && emailValid;
  };

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
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await createUser({ name, email });
      setName("");
      setEmail("");
      await fetchUsers();
      setValidation({
        name: { valid: true, message: "" },
        email: { valid: true, message: "" }
      });
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
    setValidation({
      name: { valid: true, message: "" },
      email: { valid: true, message: "" }
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await updateUser(editingId, { name, email });
      setEditingId(null);
      setName("");
      setEmail("");
      await fetchUsers();
      setValidation({
        name: { valid: true, message: "" },
        email: { valid: true, message: "" }
      });
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
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!validation.name.valid) validateForm();
              }}
              placeholder="Tên người dùng"
              required
              style={{
                marginRight: "10px",
                padding: "5px",
                borderColor: validation.name.valid ? '#ddd' : 'red'
              }}
            />
            {!validation.name.valid && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {validation.name.message}
              </div>
            )}
          </div>
          
          <div style={{ marginBottom: "10px" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (!validation.email.valid) validateForm();
              }}
              placeholder="Email"
              required
              style={{
                marginRight: "10px",
                padding: "5px",
                borderColor: validation.email.valid ? '#ddd' : 'red'
              }}
            />
            {!validation.email.valid && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {validation.email.message}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || !validation.name.valid || !validation.email.valid}
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
                setValidation({
                  name: { valid: true, message: "" },
                  email: { valid: true, message: "" }
                });
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