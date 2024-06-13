import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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
    <div>
      <h2>회원 정보</h2>
      {user ? (
        <div>
          <p>Username: {user.username}</p>
          <p>Phone: {user.phone}</p>
          <p>Address: {user.address}</p>
          <p>Vehicle Name: {user.vehicleName}</p>
          <p>Vehicle Number: {user.vehicleNumber}</p>
          {/* 추가적인 회원 정보를 여기에 표시 */}
          <button onClick={() => navigate('/users')}>회원 목록으로 돌아가기</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserInfoPage;
