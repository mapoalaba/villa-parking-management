import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyVilla = () => {
  const [villas, setVillas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/villa/user-villas', { withCredentials: true });
        setVillas(response.data);
      } catch (error) {
        console.error('Error fetching user villas:', error);
      }
    };

    fetchVillas();
  }, []);

  const handleView = (villaId) => {
    console.log(`Navigating to villa with ID: ${villaId}`);
    navigate(`/villa/${villaId}`);
  };

  const handleRemove = async (villaId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/villa/remove-villa/${villaId}`, { withCredentials: true });
      if (response.status === 200) {
        setVillas((prevVillas) => prevVillas.filter((villa) => villa._id !== villaId));
      }
    } catch (error) {
      console.error('Error removing villa:', error);
    }
  };

  return (
    <div>
      <h2>내 빌라 목록</h2>
      {villas.length > 0 ? (
        <ul>
          {villas.map((villa) => (
            <li key={villa._id}>
              <span>{villa.villaName}</span>
              <button onClick={() => handleView(villa._id)}>보기</button>
              <button onClick={() => handleRemove(villa._id)}>삭제</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>등록된 빌라가 없습니다.</p>
      )}
    </div>
  );
};

export default MyVilla;