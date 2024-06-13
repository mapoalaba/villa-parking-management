import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      console.error('Error logging out', error);
    }
  };

  return (
    <div>
      <h2>Admin Page</h2>
      <button onClick={() => navigate('/villas')}>모든 빌라 목록</button>
      <button onClick={() => navigate('/users')}>모든 회원 목록</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminPage;
