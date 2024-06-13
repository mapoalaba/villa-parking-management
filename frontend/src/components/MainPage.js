import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/MainPage.css';

const MainPage = () => {
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
      console.error('Error logging out', error);
    }
  };

  const handleMyVilla = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/villa/user-villas', { withCredentials: true });
      console.log('Fetched villas:', response.data);
      if (response && response.data) {
        navigate('/my-villa', { state: { villas: response.data } });
      }
    } catch (error) {
      console.error('Error fetching villas:', error);
    }
  };

  const handleEnterVilla = () => {
    navigate('/enter-villa');
  };

  const handleRegisterVilla = () => {
    navigate('/register-villa');
  };

  return (
    <div className="main-container">
      <h2>Main Page</h2>
      <div className="button-group">
        <button onClick={handleMyVilla} className="btn main-btn">내 빌라</button>
        <button onClick={handleEnterVilla} className="btn main-btn">빌라 입장</button>
        <button onClick={handleRegisterVilla} className="btn main-btn">내 빌라 등록</button>
        <button onClick={handleLogout} className="btn logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default MainPage;
