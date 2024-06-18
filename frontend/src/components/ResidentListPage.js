import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ResidentListPage.css';

const ResidentListPage = () => {
  const { id: villaId } = useParams();
  const [villa, setVilla] = useState(null);
  const [residents, setResidents] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVillaResidents = async () => {
      try {
        const villaResponse = await axios.get(`http://localhost:3001/api/villa/${villaId}`);
        setVilla(villaResponse.data);
        console.log('Villa:', villaResponse.data);

        const residentsResponse = await axios.get(`http://localhost:3001/api/villa/${villaId}/residents`);
        setResidents(residentsResponse.data);
        console.log('Residents:', residentsResponse.data);
      } catch (error) {
        console.error('빌라 거주자 목록 가져오기 오류:', error);
        setMessage('빌라 거주자 목록 가져오기 오류');
      }
    };

    fetchVillaResidents();
  }, [villaId]);

  const handleViewUser = (userId) => {
    navigate(`/user-info/${userId}`);
  };

  return (
    <div className="resident-list-container">
      {villa && (
        <>
          <div className='residentlist-header'>
            <h2 className='residentlistpage-h2'>{villa.villaName}</h2>
          </div>
          <div className='residentlist-body'>
            <h3>거주 중인 회원 목록</h3>
            {message && <p className="message">{message}</p>}
            <ul className="resident-list">
              {residents.length > 0 ? (
                residents.map((resident) => (
                  <li key={resident._id} className="resident-item">
                    <span>{resident.username}</span>
                    <button className="view-btn userbtn" onClick={() => handleViewUser(resident._id)}>회원정보</button>
                  </li>
                ))
              ) : (
                <p className="message">거주 중인 회원이 없습니다.</p>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default ResidentListPage;
