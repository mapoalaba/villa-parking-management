import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/VillaList.css';

const VillaList = () => {
  const [villas, setVillas] = useState([]);

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

  return (
    <div className="villa-list-container">
      <h2>빌라 목록</h2>
      <ul className="villa-list">
        {villas.map((villa) => (
          <li key={villa._id}>
            <span>{villa.villaName} - {villa.address}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VillaList;