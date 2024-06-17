import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/FindUsername.css';

const FindUsername = () => {
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/user/send-code', { phone });
      alert('인증 코드가 전송되었습니다!');
      setMessage(response.data.message);
    } catch (error) {
      console.error('인증 코드를 전송하는 동안 오류가 발생했습니다!', error);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('예기치 않은 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/user/verify-code', { code: verificationCode });
      if (response.status === 200) {
        setIsVerified(true);
        alert('전화번호가 확인되었습니다!');
      }
    } catch (error) {
      console.error('코드 확인 중 오류가 발생했습니다!', error);
      alert('인증 코드가 잘못되었습니다!');
      setMessage(error.response.data.message);
    }
  };

  const handleRetrieveUsername = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert('먼저 휴대폰 번호를 인증해 주세요.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/user/retrieve-username', { phone });
      console.log(response.data);
      navigate('/username-list', { state: { usernames: response.data.usernames } });
    } catch (error) {
      console.error('사용자 아이디를 검색하는 동안 오류가 발생했습니다!', error);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('예기치 않은 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  return (
    <div className="find-username-container">
      <h2>아이디 찾기</h2>
      <form onSubmit={handleSendCode}>
        <div className="input-group">
          <label>전화번호:</label>
          <div className="input-with-button">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder='전화번호 ( - 빼고 입력)'
            />
            <button type="submit" className="btn">Send</button>
          </div>
        </div>
      </form>
      <div className="input-group">
        <label>인증코드:</label>
        <div className="input-with-button">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
          <button onClick={handleVerifyCode} className="btn">확인</button>
        </div>
      </div>
      <div className="button-group">
        <button onClick={handleRetrieveUsername} className="btn" disabled={!isVerified}>아이디 검색</button>
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default FindUsername;