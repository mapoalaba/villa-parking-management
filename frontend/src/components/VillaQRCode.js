import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/VillaQRCode.css';

const VillaQRCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { villaId, qrCode } = location.state || {};

  if (!villaId || !qrCode) {
    return <p>Error: Villa ID or QR Code not found</p>;
  }

  const handleComplete = () => {
    navigate('/main');
  };

  return (
    <div className="qr-container">
      <h2>빌라 저장 완료</h2>
      <p>빌라 고유번호: {villaId}</p>
      <img src={qrCode} alt="QR Code" />
      <button onClick={handleComplete}>완료</button>
    </div>
  );
};

export default VillaQRCode;
