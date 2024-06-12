import React, { useState } from 'react';
import axios from 'axios';

const FindUsername = () => {
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [username, setUsername] = useState(null);
  const [message, setMessage] = useState('');

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
    try {
      const response = await axios.post('http://localhost:3001/api/user/retrieve-username', { phone });
      setUsername(response.data.username);
      setMessage('Username retrieved successfully!');
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
      {isVerified && (
        <div>
          <button onClick={handleRetrieveUsername}>Retrieve Username</button>
        </div>
      )}
      {username && (
        <div>
          <h3>Your Username:</h3>
          <p>{username}</p>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default FindUsername;
