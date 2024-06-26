import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/logout`, {}, { withCredentials: true });
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
      <h2 className='adminpage-h2'>관리자 페이지</h2>
      <div className="button-group adminbutton">
        <button onClick={() => navigate('/villas')} className="adminvillalist-btn">모든 빌라 목록</button>
        <button onClick={() => navigate('/users')} className="adminuserlist-btn">모든 회원 목록</button>
        <button onClick={handleLogout} className="adminlogout-btn">로그아웃</button>
      </div>
    </div>
  );
};

export default AdminPage;