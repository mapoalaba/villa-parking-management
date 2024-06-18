import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import Webcam from 'react-webcam';

const QRScanner = ({ onScan }) => {
  const webcamRef = useRef(null);
  const reader = useMemo(() => new BrowserMultiFormatReader(), []);

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          const result = await reader.decodeFromImage(undefined, imageSrc);
          onScan(result.getText());
        } catch (err) {
          if (err.name !== 'NotFoundException') {
            console.error(err);
          }
        }
      }
    }
  }, [onScan, reader]);

  useEffect(() => {
    const interval = setInterval(() => {
      capture();
    }, 1000); // 1초마다 스캔 시도
    return () => clearInterval(interval);
  }, [capture]);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default QRScanner;