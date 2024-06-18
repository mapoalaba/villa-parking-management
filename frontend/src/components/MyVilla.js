import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/MyVilla.css';

const MyVilla = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { villas } = location.state || [];

  const handleDeleteVilla = async (villaId) => {
    try {
      console.log(`Attempting to delete villa with ID: ${villaId}`);
      const response = await axios.delete(`http://localhost:3001/api/villa/delete/${villaId}`, { withCredentials: true });
      console.log('Delete response:', response.data);
      if (response && response.data) {
        // 삭제된 후 빌라 목록을 갱신
        const updatedVillas = villas.filter(villa => villa._id !== villaId);
        navigate('/my-villa', { state: { villas: updatedVillas } });
      }
    } catch (error) {
      console.error('Error deleting villa:', error);
    }
  };

  const handleViewDetails = (villaId) => {
    navigate(`/villa/${villaId}`);
  };

  return (
    <div className="villa-container">
      <h2>내 빌라</h2>
      <div className="villa-list">
        {villas.length > 0 ? (
          <ul>
            {villas.map(villa => (
              <li key={villa._id} className="villa-item">
                <h3 className="villa-name" onClick={() => handleViewDetails(villa._id)}>
                  {villa.villaName}
                </h3>
                <p>{villa.address}</p>
                <button className="myvilladelete-btn" onClick={() => handleDeleteVilla(villa._id)}>삭제</button>
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
