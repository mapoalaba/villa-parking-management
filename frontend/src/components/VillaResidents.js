import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VillaResidents = () => {
  const { villaId } = useParams();
  const [residents, setResidents] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/villa/${villaId}/residents`, { withCredentials: true });
        setResidents(response.data);
      } catch (error) {
        console.error('Error fetching residents:', error);
      }
    };

    fetchResidents();
  }, [villaId]);

  const handleDeleteResident = async (residentId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/user/delete/${residentId}`, { withCredentials: true });
      setResidents((prevResidents) => prevResidents.filter((resident) => resident._id !== residentId));
      setMessage('Resident deleted successfully');
    } catch (error) {
      console.error('Error deleting resident:', error);
      setMessage('Error deleting resident');
    }
  };

  const handleViewResident = (residentId) => {
    navigate(`/user-info/${residentId}`);
  };

  return (
    <div>
      {message && <p className="message">{message}</p>}
      <ul>
        {residents.map((resident) => (
          <li key={resident._id}>
            {resident.username}
            <button onClick={() => handleViewResident(resident._id)}>회원정보</button>
            <button onClick={() => handleDeleteResident(resident._id)}>삭제</button>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default VillaResidents;