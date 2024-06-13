import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Admin Page</h2>
      <button onClick={() => navigate('/villas')}>모든 빌라 목록</button>
      <button onClick={() => navigate('/users')}>모든 회원 목록</button>
    </div>
  );
};

export default AdminPage;
