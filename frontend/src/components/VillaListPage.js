import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/VillaListPage.css';

const VillaListPage = () => {
  const [villas, setVillas] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/villa/all');
        setVillas(response.data);
      } catch (error) {
        console.error('빌라 가져오기 오류:', error);
      }
    };

    fetchVillas();
  }, []);

  const handleDeleteVilla = async (villaId) => {
    try {
      await axios.delete(`http://localhost:3001/api/villa/delete/${villaId}`);
      setVillas((prevVillas) => prevVillas.filter((villa) => villa._id !== villaId));
      setMessage('빌라가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('빌라 삭제 오류:', error);
      setMessage('빌라 삭제 오류');
    }
  };

  return (
    <div className="villa-list-container">
      <h2>모든 빌라 목록</h2>
      {message && <p className="message">{message}</p>}
      {villas.map((villa) => (
        <div key={villa._id} className="villa-item">
          <h3>{villa.villaName}</h3>
          <p>{villa.address}</p>
          <button className="btn delete-btn" onClick={() => handleDeleteVilla(villa._id)}>삭제</button>
        </div>
      ))}
    </div>
  );
};

export default VillaListPage;
