import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/VillaDetailPage.css';

const VillaDetail = () => {
  const { id } = useParams();
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

  if (!villa) {
    return <p>Loading...</p>;
  }

  return (
    <div className="villa-detail-container">
      <h2>상세 정보</h2>
      <p>주소: {villa.address}</p>
      <p>고유번호: {villa._id}</p>
      <h3>주차 배치도</h3>
      <div className="parking-layout">
        {villa.spaces.map((space, index) => (
          <div
            key={index}
            className={`space ${space.type.toLowerCase()}`}
            style={{
              top: space.top,
              left: space.left,
              width: space.width,
              height: space.height,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default VillaDetail;
