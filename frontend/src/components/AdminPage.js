import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });
      if (response && response.data) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
        window.location.reload();
      }
    } catch (error) {
      console.error('로그아웃 오류', error);
    }
  };

  return (
    <div className="admin-container">
      <h2>관리자 페이지</h2>
      <div className="button-group adminbutton">
        <button onClick={() => navigate('/villas')} className="btn admin-btn">모든 빌라 목록</button>
        <button onClick={() => navigate('/users')} className="btn admin-btn">모든 회원 목록</button>
        <button onClick={handleLogout} className="btn logout-btn">로그아웃</button>
      </div>
    </div>
  );
};

export default AdminPage;
