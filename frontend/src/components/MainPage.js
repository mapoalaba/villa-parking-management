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
      console.error('로그아웃 오류', error);
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
      console.error('빌라 가져오기 오류:', error);
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
        console.error('빌라 가져오기 오류:', error);
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
      <h2>메인 페이지</h2>
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
      <div className="mainpagebutton-group">
        <button onClick={handleMyVilla} className="mainmyvilla-btn">내 빌라</button>
        <button onClick={handleEnterVilla} className="mainentervilla-btn">빌라 입장</button>
        <button onClick={handleRegisterVilla} className="mainregistration-btn">내 빌라 등록</button>
        <button onClick={handleLogout} className="mainlogout-btn">로그아웃</button>
      </div>
    </div>
  );
};

export default MainPage;
