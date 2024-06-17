import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/UserInfoPage.css';

const UserInfoPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <div className="user-info-container">
      <h2>회원 정보</h2>
      {user ? (
        <div className="user-info-group">
          <p>아이디: {user.username}</p>
          <p>전화번호: {user.phone}</p>
          <p>주소: {user.address}</p>
          <p>차 이름: {user.vehicleName}</p>
          <p>차 번호: {user.vehicleNumber}</p>
          <div className="button-group">
            <button className="btn back-btn" onClick={() => navigate('/users')}>
              회원 목록으로
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserInfoPage;
