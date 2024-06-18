import React from 'react';
import QrReader from 'react-qr-reader';

const QRScanner = ({ onScan, onError }) => {
  const handleScan = (data) => {
    if (data) {
      onScan(data);
    }
  };

  const handleError = (err) => {
    onError(err);
  };

  return (
    <QrReader
      delay={300}
      onError={handleError}
      onScan={handleScan}
      style={{ width: '100%' }}
    />
  );
};

export default QRScanner;