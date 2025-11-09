import React, { useState } from 'react';
import axios from 'axios';

function AddUser({ onUserAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = { name, email };
      await axios.post('https://group14-project-a92d.onrender.com/api/users', newUser);
      setName('');
      setEmail('');
      onUserAdded(); // Refresh danh sách
      alert('Thêm user thành công!');
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Lỗi khi thêm user!');
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px' }}>
      <h2>Thêm User Mới</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: '5px', marginRight: '10px' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '5px', marginRight: '10px' }}
          />
          <button type="submit" style={{ padding: '5px 15px' }}>
            Thêm User
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUser;
