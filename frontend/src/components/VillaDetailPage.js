import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const VillaDetailPage = () => {
  const { id } = useParams();
  const [villa, setVilla] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVilla = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/villa/${id}`);
        setVilla(response.data);
      } catch (error) {
        console.error('Error fetching villa:', error);
      }
    };

    fetchVilla();
  }, [id]);

  const handleDeleteResident = async (residentId) => {
    try {
      await axios.delete(`http://localhost:3001/api/villa/resident/${residentId}`);
      setVilla({
        ...villa,
        residents: villa.residents.filter((resident) => resident._id !== residentId),
      });
      alert('Resident deleted successfully');
    } catch (error) {
      console.error('Error deleting resident:', error);
      alert('Error deleting resident');
    }
  };

  if (!villa) return <div>Loading...</div>;

  return (
    <div>
      <h2>{villa.name}</h2>
      <h3>Residents</h3>
      <ul>
        {villa.residents.map((resident) => (
          <li key={resident._id}>
            {resident.username} <button onClick={() => handleDeleteResident(resident._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/villas')}>Back to Villa List</button>
    </div>
  );
};

export default VillaDetailPage;
