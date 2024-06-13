import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VillaListPage = () => {
  const [villas, setVillas] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/villa/all');
        setVillas(response.data);
      } catch (error) {
        console.error('Error fetching villas:', error);
      }
    };

    fetchVillas();
  }, []);

  const handleDeleteVilla = async (villaId) => {
    try {
      await axios.delete(`http://localhost:3001/api/villa/delete/${villaId}`);
      setVillas((prevVillas) => prevVillas.filter((villa) => villa._id !== villaId));
      setMessage('Villa deleted successfully');
    } catch (error) {
      console.error('Error deleting villa:', error);
      setMessage('Error deleting villa');
    }
  };

  return (
    <div>
      <h2>모든 빌라 목록</h2>
      {message && <p>{message}</p>}
      {villas.map((villa) => (
        <div key={villa._id}>
          <h3>{villa.villaName}</h3>
          <p>{villa.address}</p>
          <button onClick={() => handleDeleteVilla(villa._id)}>삭제</button>
        </div>
      ))}
    </div>
  );
};

export default VillaListPage;
