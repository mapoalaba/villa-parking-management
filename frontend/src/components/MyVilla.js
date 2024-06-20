import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/MyVilla.css';

const MyVilla = () => {
  const [villas, setVillas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/villa/user-villas`, { withCredentials: true });
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
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/villa/remove-villa/${villaId}`, { withCredentials: true });
      if (response.status === 200) {
        setVillas((prevVillas) => prevVillas.filter((villa) => villa._id !== villaId));
      }
    } catch (error) {
      console.error('Error removing villa:', error);
    }
  };

  return (
    <div className="villa-container">
      <h2 className="villa-header">내 빌라</h2>
      <div className="villa-list">
        {villas.length > 0 ? (
          <ul className="villa-list-ul">
            {villas.map((villa) => (
              <li key={villa._id} className="villa-list-item">
                <span className="villa-name">{villa.villaName}</span>
                <div className="villa-buttons">
                  <button className="villa-view-btn" onClick={() => handleView(villa._id)}>보기</button>
                  <button className="myvilladelete-btn" onClick={() => handleRemove(villa._id)}>삭제</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="message">등록된 빌라가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MyVilla;
