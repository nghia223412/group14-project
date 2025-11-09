// Nội dung file: frontend/src/App.js (Đã sửa lỗi no-undef và no-unused-vars)
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Auth from './components/Auth';
import Profile from './components/Profile';
import AdminUserManagement from './components/AdminUserManagement';

// URL của Backend (sử dụng environment variable)
const API_URL = process.env.REACT_APP_API_URL || 'https://group14-project-a92d.onrender.com/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentPage, setCurrentPage] = useState('home'); // home, profile, admin
  
  // XÓA: Tất cả các state không dùng trong App.js (users, name, email, password, editingUser, error)
  // Logic và state liên quan đến CRUD đã được chuyển sang AdminUserManagement.jsx

  // Hàm fetchUsers (Giữ lại để truyền xuống Admin, nhưng phải được làm đơn giản nhất)
  // Tuy nhiên, để tránh lỗi no-undef, ta sẽ định nghĩa lại hàm này trong AdminUserManagement.jsx
  // và chỉ truyền nó xuống AdminUserManagement nếu cần (hoặc nếu AdminUserManagement có thể tự gọi)

  // 1. Hàm kiểm tra xác thực (Định nghĩa bằng useCallback)
  const checkAuth = useCallback(async () => {
    try {
      console.log('🔍 Checking authentication...');
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Auth valid - User:', response.data.data.name);
      setCurrentUser(response.data.data);
      setIsLoggedIn(true);
      // XÓA: fetchUsers() ở đây để tránh lỗi no-undef
    } catch (error) {
      console.log('⚠️ Auth check failed - Clearing old token');
      localStorage.removeItem('token');
      setToken('');
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  }, [token]); // Dependency: Chỉ cần token

  // Axios interceptor: Tự động xóa token khi gặp lỗi 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        // Chỉ auto logout khi gặp 401 VÀ đang có user logged in
        if (error.response?.status === 401 && isLoggedIn) {
          console.log('🔴 Token expired - Auto logout');
          localStorage.removeItem('token');
          setToken('');
          setIsLoggedIn(false);
          setCurrentUser(null);
          setCurrentPage('home');
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [isLoggedIn]);

  // Check authentication on mount (Đã sửa lỗi Dòng 53)
  useEffect(() => {
    if (token) {
      checkAuth();
    }
  }, [checkAuth, token]); // ✅ Đã sửa lỗi missing dependencies

  const handleLoginSuccess = (user, userToken) => {
    console.log('🔐 Login success - Saving token to localStorage');
    localStorage.setItem('token', userToken);
    setCurrentUser(user);
    setToken(userToken);
    setIsLoggedIn(true);
    // XÓA: fetchUsers() ở đây
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setIsLoggedIn(false);
    setCurrentUser(null);
    // XÓA: setUsers([]);
    setCurrentPage('home');
  };

  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  // XÓA: Tất cả các hàm CRUD không sử dụng (fetchUsers, handleSubmit, handleDelete, handleEdit, resetForm)
  // Vì chúng là nguyên nhân gây ra lỗi no-undef.

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {!isLoggedIn ? (
        <Auth onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div>
          {/* Navigation Bar */}
          <nav style={{ 
            backgroundColor: '#000000',
            padding: '15px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <h2 style={{ color: 'white', margin: 0 }}>
                Hệ thống quản lý tài khoản
              </h2>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setCurrentPage('home')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: currentPage === 'home' ? '#007bff' : 'transparent',
                    color: 'white',
                    border: '1px solid white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Trang chủ
                </button>
                
                <button
                  onClick={() => setCurrentPage('profile')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: currentPage === 'profile' ? '#007bff' : 'transparent',
                    color: 'white',
                    border: '1px solid white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Profile
                </button>
                
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => setCurrentPage('admin')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: currentPage === 'admin' ? '#dc3545' : 'transparent',
                      color: 'white',
                      border: '1px solid white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Quản lý Users
                  </button>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ color: 'white', textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold' }}>{currentUser?.name}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  {currentUser?.role === 'admin' ? 'Admin' : 'User'}
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Đăng xuất
              </button>
            </div>
          </nav>

          {/* Main Content */}
          <div style={{ padding: '30px' }}>
            {currentPage === 'home' && (
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <h1 style={{textAlign: 'center'}}>Chào mừng đến với Hệ thống Quản lý Tài khoản<br />Group 14 Project</h1>
                
                <div style={{ 
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  marginTop: '20px',
                  border: '1px solid #dee2e6'
                }}>
                  <h3>Các chức năng có sẵn:</h3>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '15px',
                    marginTop: '20px'
                  }}>
                    <div style={{
                      padding: '20px',
                      backgroundColor: '#ffffffff',
                      boxShadow: '0 8px 30px rgba(20,20,40,0.06)',
                    }}>
                      <h4 style={{ marginTop: 0 }}>Quản lý Profile</h4>
                      <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
                        <li>Xem thông tin cá nhân</li>
                        <li>Cập nhật tên & email</li>
                        <li>Đổi mật khẩu</li>
                        <li>Upload avatar</li>
                      </ul>
                    </div>
                    
                    {currentUser?.role === 'admin' && (
                      <div style={{
                        padding: '20px',
                        backgroundColor: '#ffffffff',
                        boxShadow: '0 8px 30px rgba(20,20,40,0.06)',
                      }}>
                        <h4 style={{ marginTop: 0 }}>Quản lý Users (Admin)</h4>
                        <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
                          <li>Xem danh sách users</li>
                          <li>Phân quyền (User/Admin)</li>
                          <li>Xóa tài khoản</li>
                          <li>Xem chi tiết user</li>
                        </ul>
                      </div>
                    )}
                    
                    <div style={{
                      padding: '20px',
                      backgroundColor: '#ffffffff',
                      boxShadow: '0 8px 30px rgba(20,20,40,0.06)',
                    }}>
                      <h4 style={{ marginTop: 0 }}>Bảo mật</h4>
                      <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
                        <li>JWT Authentication</li>
                        <li>Password hashing (bcrypt)</li>
                        <li>Forgot password</li>
                        <li>Role-based access</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentPage === 'profile' && (
              <Profile 
                currentUser={currentUser} 
                token={token}
                onUpdateSuccess={handleUpdateProfile}
              />
            )}
            
            {currentPage === 'admin' && currentUser?.role === 'admin' && (
              <AdminUserManagement 
                token={token}
                currentUser={currentUser}
                // AdminUserManagement hiện tại tự fetch dữ liệu
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
