import React, { useRef, useEffect } from 'react';
import QrScanner from 'qr-scanner';

const QRScanner = ({ onScan }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    let qrScanner;

    const startScanning = async () => {
      qrScanner = new QrScanner(video, result => {
        onScan(result.data);
        qrScanner.stop(); // QR 코드를 인식하면 카메라를 중지합니다.
      }, {
        returnDetailedScanResult: true // 자세한 스캔 결과 반환
      });
      await qrScanner.start();
    };

    startScanning();

    return () => {
      if (qrScanner) {
        qrScanner.stop();
      }
    };
  }, [onScan]);

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%' }} />
    </div>
  );
};

export default QRScanner;