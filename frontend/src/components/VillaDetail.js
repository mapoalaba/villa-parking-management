import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VillaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [villa, setVilla] = useState(null);

  useEffect(() => {
    const fetchVillaDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/villa/${id}`, { withCredentials: true });
        setVilla(response.data);
      } catch (error) {
        console.error('Error fetching villa details:', error);
      }
    };

    fetchVillaDetails();
  }, [id]);

  const handleGoToMain = () => {
    navigate('/main');
  };

  if (!villa) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{villa.villaName} 상세 정보</h2>
      <p>주소: {villa.address}</p>
      <p>고유번호: {villa._id}</p>
      {villa.qrCodeUrl ? <img src={villa.qrCodeUrl} alt="QR Code" /> : <p>QR 코드를 로드할 수 없습니다.</p>}
      <h3>주차 배치도</h3>
      <div style={{ width: '100%', height: '400px', border: '1px solid black', position: 'relative' }}>
        {villa.spaces.map((space, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: space.top,
              left: space.left,
              width: space.width,
              height: space.height,
              backgroundColor: space.type === 'VILLA' ? 'blue' : space.type === 'PARKING' ? 'green' : space.type === 'EXIT' ? 'red' : 'gray'
            }}
          />
        ))}
      </div>
      <button onClick={handleGoToMain}>메인 페이지로</button>
    </div>
  );
};

export default VillaDetail;
