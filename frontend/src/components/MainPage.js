import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/MainPage.css';

const MainPage = () => {
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
      console.error('Error logging out', error);
    }
  };

  const handleMyVilla = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/villa/user-villas`, { withCredentials: true });
      console.log('Fetched villas:', response.data);
      if (response && response.data) {
        navigate('/my-villa', { state: { villas: response.data } });
      }
    } catch (error) {
      console.error('Error fetching villas:', error);
      alert('빌라 정보를 가져오는 데 오류가 발생했습니다.');
    }
  };

  const handleEnterVilla = () => {
    navigate('/enter-villa');
  };

  const handleRegisterVilla = () => {
    navigate('/register-villa');
  };

  return (
    <div className="button-group">
    <button onClick={handleMyVilla} className="btn main-btn">내 빌라</button>
    <button onClick={handleEnterVilla} className="btn main-btn">빌라 입장</button>
    <button onClick={handleRegisterVilla} className="btn main-btn">내 빌라 등록</button>
    <button onClick={handleLogout} className="btn logout-btn">로그아웃</button>
  </div>
  );
};

export default MainPage;