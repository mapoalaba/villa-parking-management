import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import QrScanner from 'react-qr-scanner';

const EnterVilla = () => {
  const [villaId, setVillaId] = useState('');
  const [scanResult, setScanResult] = useState('');
  const navigate = useNavigate();

  const handleVillaIdChange = (e) => {
    setVillaId(e.target.value);
  };

  const handleAddVilla = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/villa/add-villa', { villaId }, { withCredentials: true });
      if (response && response.data) {
        navigate('/my-villa');
      }
    } catch (error) {
      console.error('Error adding villa:', error);
    }
  };

  const handleScan = (data) => {
    if (data) {
      setScanResult(data.text);
      setVillaId(data.text);
    }
  };

  const handleError = (err) => {
    console.error('Error scanning QR code:', err);
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <div>
      <h2>빌라 입장</h2>
      <div>
        <label>빌라 고유번호 입력</label>
        <input type="text" value={villaId} onChange={handleVillaIdChange} />
        <button onClick={handleAddVilla}>내 빌라에 추가</button>
      </div>
      <div>
        <h3>QR 코드 촬영</h3>
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={previewStyle}
        />
        <p>{scanResult}</p>
      </div>
    </div>
  );
};

export default EnterVilla;