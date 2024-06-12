import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  const handleGoToMain = () => {
    navigate('/main');
  };

  const handleViewDetails = (villaId) => {
    navigate(`/villa/${villaId}`);
  };

  return (
    <div>
      <h2>내 빌라 목록</h2>
      {villas.length > 0 ? (
        <ul>
          {villas.map(villa => (
            <li key={villa._id}>
              <h3 style={{ cursor: 'pointer', color: 'blue' }} onClick={() => handleViewDetails(villa._id)}>
                {villa.villaName}
              </h3>
              <p>{villa.address}</p>
              <button onClick={() => handleDeleteVilla(villa._id)}>삭제</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>등록된 빌라가 없습니다.</p>
      )}
      <button onClick={handleGoToMain}>메인 페이지로</button>
    </div>
  );
};

export default MyVilla;
