import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/MainPage.css';

const MainPage = () => {
  const [search, setSearch] = useState('');
  const [villas, setVillas] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });
      if (response && response.data) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
        window.location.reload();
      }
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  const handleMyVilla = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/villa/user-villas', { withCredentials: true });
      console.log('Fetched villas:', response.data);
      if (response && response.data) {
        navigate('/my-villa', { state: { villas: response.data } });
      }
    } catch (error) {
      console.error('Error fetching villas:', error);
    }
  };

  const handleEnterVilla = () => {
    navigate('/enter-villa');
  };

  const handleRegisterVilla = () => {
    navigate('/register-villa');
  };

  const handleSearchChange = async (e) => {
    setSearch(e.target.value);
    if (e.target.value) {
      try {
        const response = await axios.get(`http://localhost:3001/api/villa/search?address=${e.target.value}`, { withCredentials: true });
        setVillas(response.data);
      } catch (error) {
        console.error('Error fetching villas:', error);
      }
    } else {
      setVillas([]);
    }
  };

  const handleVillaSelect = (villaId) => {
    navigate(`/villa/${villaId}`);
  };

  return (
    <div className="main-container">
      <h2>Main Page</h2>
      <div className="search-container">
        <input 
          type="text" 
          value={search} 
          onChange={handleSearchChange} 
          placeholder="주소로 빌라 검색" 
          className="search-input"
        />
        {villas.length > 0 && (
          <ul className="dropdown">
            {villas.map((villa) => (
              <li key={villa._id} onClick={() => handleVillaSelect(villa._id)}>{villa.villaName}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="button-group">
        <button onClick={handleMyVilla} className="btn main-btn">내 빌라</button>
        <button onClick={handleEnterVilla} className="btn main-btn">빌라 입장</button>
        <button onClick={handleRegisterVilla} className="btn main-btn">내 빌라 등록</button>
        <button onClick={handleLogout} className="btn logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default MainPage;
