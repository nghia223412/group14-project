import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function Auth({ onLoginSuccess }) {
  const [showLogin, setShowLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email không hợp lệ');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        name,
        email,
        password
      });
      
      console.log('Signup response:', response.data);
      const token = response.data.data.token; // Backend: { data: { user, token } }
      const user = response.data.data.user;
      
      localStorage.setItem('token', token);
      onLoginSuccess(user, token);
    } catch (error) {
      setError(error.response?.data?.message || 'Đăng ký thất bại. Email có thể đã tồn tại.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      const token = response.data.data.token; // Backend: { data: { user, token } }
      const user = response.data.data.user;
      
      localStorage.setItem('token', token);
      onLoginSuccess(user, token);
    } catch (error) {
      setError(error.response?.data?.message || 'Đăng nhập thất bại.');
    }
  };

  if (showForgotPassword) {
    const ForgotPassword = require('./ForgotPassword').default;
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '50px auto', border: '2px solid #007bff', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center' }}>Hệ thống Xác thực Tài khoản</h1>
      
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => { setShowLogin(true); setError(''); }}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: showLogin ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Đăng nhập
        </button>
        <button 
          onClick={() => { setShowLogin(false); setError(''); }}
          style={{
            padding: '10px 20px',
            backgroundColor: !showLogin ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Đăng ký
        </button>
      </div>

      {showLogin ? (
        <div>
          <h2>Đăng nhập</h2>
          <form onSubmit={handleLogin}>
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                style={{ width: '100%', padding: '10px', fontSize: '14px' }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Mật khẩu:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                style={{ width: '100%', padding: '10px', fontSize: '14px' }}
                required
              />
            </div>
            
            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Đăng nhập
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '14px'
                }}
              >
                Quên mật khẩu?
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <h2>Đăng ký tài khoản</h2>
          <form onSubmit={handleSignup}>
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Tên:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                style={{ width: '100%', padding: '10px', fontSize: '14px' }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                style={{ width: '100%', padding: '10px', fontSize: '14px' }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Mật khẩu (tối thiểu 6 ký tự):</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                style={{ width: '100%', padding: '10px', fontSize: '14px' }}
                required
              />
            </div>
            
            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Đăng ký
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Auth;
