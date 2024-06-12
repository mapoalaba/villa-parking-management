import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  return (
    <div>
      <h2>Main Page</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default MainPage;
