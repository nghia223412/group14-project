import React, { useEffect, useState } from "react";
import { getUsers } from "../api/usersApi";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        console.log("Users fetched:", res.data);
        setUsers(res.data);
      } catch (err) {
        console.error("Lỗi load user:", err);
        setUsers([]); // nếu lỗi, danh sách trống
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Danh sách người dùng</h2>
      <ul>
        {users.length > 0 ? (
          users.map(u => (
            <li key={u._id}>{u.name} - {u.email}</li>
          ))
        ) : (
          <li>Không tải được danh sách người dùng.</li>
        )}
      </ul>
    </div>
  );
};

export default UserList;
