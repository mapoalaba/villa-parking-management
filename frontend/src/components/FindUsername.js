import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      alert('Verification code sent!');
      setMessage(response.data.message);
    } catch (error) {
      console.error('There was an error sending the verification code!', error);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Unexpected error occurred. Please try again.');
      }
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/user/verify-code', { code: verificationCode });
      if (response.status === 200) {
        setIsVerified(true);
        alert('Phone number verified!');
        setMessage('Phone number verified! Click the button below to retrieve your username.');
      }
    } catch (error) {
      console.error('There was an error verifying the code!', error);
      alert('Invalid verification code!');
      setMessage(error.response.data.message);
    }
  };

  const handleRetrieveUsername = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert('Please verify your phone number first.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/user/retrieve-username', { phone });
      console.log(response.data);
      navigate('/username-list', { state: { usernames: response.data.usernames } });
    } catch (error) {
      console.error('There was an error retrieving the username!', error);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Find Username</h2>
      <form onSubmit={handleSendCode}>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder='전화번호 ( - 빼고 입력)'
          />
          <button type="submit">Send Verification Code</button>
        </div>
      </form>
      <div>
        <label>Verification Code:</label>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
        />
        <button onClick={handleVerifyCode}>Verify Code</button>
      </div>
      <div>
        <button onClick={handleRetrieveUsername} disabled={!isVerified}>Retrieve Username</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FindUsername;
