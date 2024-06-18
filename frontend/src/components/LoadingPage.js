// LoadingPage.js
import React from 'react';
import '../styles/LoadingPage.css'; // 필요한 스타일
import logo from '../assist/logo.png';

const LoadingPage = () => {
  return (
    <div className="loading-container">
      <div className="logo">
        <img src={logo}/>
      </div>
    </div>
  );
};

export default LoadingPage;