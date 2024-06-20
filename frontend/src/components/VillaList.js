import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/VillaListPage.css';

const VillaListPage = () => {
  const [villas, setVillas] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/villa/all`);
        setVillas(response.data);
      } catch (error) {
        console.error('빌라 가져오기 오류:', error);
      }
    };

    fetchVillas();
  }, []);

  const handleDeleteVilla = async (villaId) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/villa/remove-villa/${villaId}`, { withCredentials: true });
      if (response.status === 200) {
        setVillas((prevVillas) => prevVillas.filter((villa) => villa._id !== villaId));
      }
    } catch (error) {
      console.error('Error removing villa:', error);
    }
  };

  const handleViewDetails = (villaId) => {
    console.log(`Navigating to villa with ID: ${villaId}`);
    navigate(`/villa/${villaId}`);
  };

  const handleViewResidents = (villaId) => {
    navigate(`/villa/${villaId}/residents`);
  };

  return (
    <div className="villa-list-container">
      <div className='villalist-header'>
        <h2 className='villalistpage-h2'>모든 빌라 목록</h2>
      </div>
      <div className='villalist-body'>
        {message && <p className="message">{message}</p>}
        {villas.map((villa) => (
          <div key={villa._id} className="villa-item">
            <h3>{villa.villaName}</h3>
            <p>{villa.address}</p>
            <button className="villalistpagedetail-btn" onClick={() => handleViewDetails(villa._id)}>상세</button>
            <button className="villalistpageresidents-btn" onClick={() => handleViewResidents(villa._id)}>거주자목록</button>
            <button className="villalistpagedelete-btn" onClick={() => handleDeleteVilla(villa._id)}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VillaListPage;