import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRScanner from './QRScanner';
import '../styles/EnterVilla.css';
import Logo from '../img/logo.png'

const EnterVilla = () => {
  const [villaId, setVillaId] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [search, setSearch] = useState('');
  const [villas, setVillas] = useState([]);
  const navigate = useNavigate();

  const handleVillaIdChange = (e) => {
    setVillaId(e.target.value);
  };

  const handleAddVilla = async (id) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/villa/add-villa`, { villaId: id }, { withCredentials: true });
      if (response && response.data) {
        navigate('/my-villa');
      }
    } catch (error) {
      console.error('Error adding villa:', error);
    }
  };

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
      setVillaId(data);
      handleAddVilla(data);
    }
  };

  const handleError = (err) => {
    console.error('Error scanning QR code:', err);
  };

  const handleSearchChange = async (e) => {
    setSearch(e.target.value);
    if (e.target.value) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/villa/search?address=${e.target.value}`, { withCredentials: true });
        setVillas(response.data);
      } catch (error) {
        console.error('Error fetching villas:', error);
      }
    } else {
      setVillas([]);
    }
  };

  const handleVillaSelect = (id) => {
    handleAddVilla(id);
  };

  return (
    <div className="enter-villa-container">
      <h2 className='entervilla-h2'>빌라 입장</h2>
      <div className="search-container">
        <input 
          type="text" 
          value={search} 
          onChange={handleSearchChange} 
          placeholder="주소로 빌라 검색" 
          className="search-input"
        />
        {villas.length > 0 && (
          <ul className="dropdown">
            {villas.map((villa) => (
              <li key={villa._id} onClick={() => handleVillaSelect(villa._id)}>{villa.villaName}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="input-group">
        <label>빌라 고유번호 입력</label>
        <input 
          type="text" 
          value={villaId} 
          onChange={handleVillaIdChange} 
          className="villa-input-field"
        />
        <button className="entervillaadd-btn" onClick={() => handleAddVilla(villaId)}>내 빌라에 추가</button>
      </div>
      <div className="qr-container">
        <h3>QR 코드 촬영</h3>
        <QRScanner onScan={handleScan} onError={handleError} />
        <p>{scanResult}</p>
      </div>
    </div>
  );
};

export default EnterVilla;