import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FindPassword = () => {
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validatePhone = (phone) => {
    const phoneRegex = /^(010\d{4}\d{4}|010-\d{4}-\d{4})$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,20}$/;
    return passwordRegex.test(password);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!validatePhone(phone)) {
      setMessage('Phone number must be in the format 01000000000 or 010-0000-0000.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/user/send-code', { phone });
      alert('Verification code sent!');
      setMessage(response.data.message);
    } catch (error) {
      console.error('There was an error sending the verification code!', error);
      setMessage(error.response?.data?.message || 'Unexpected error occurred. Please try again.');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/user/verify-code', { code: verificationCode });
      if (response.status === 200) {
        setIsVerified(true);
        alert('Phone number verified!');
        setMessage('Phone number verified! You can now reset your password.');
      }
    } catch (error) {
      console.error('There was an error verifying the code!', error);
      setMessage(error.response?.data?.message || 'Invalid verification code! Please try again.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validatePassword(newPassword)) {
      setMessage('Password must be 4-20 characters long, with at least one uppercase letter and one special character.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match!");
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/user/change-password', {
        phone,
        username,
        newPassword
      });
      if (response.status === 200) {
        alert('Password changed successfully!');
        navigate('/login');
      } else {
        setMessage(response.data.message || 'Error changing password');
      }
    } catch (error) {
      console.error('There was an error changing the password!', error);
      setMessage(error.response?.data?.message || 'Unexpected error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Find Password</h2>
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
      {isVerified && (
        <form onSubmit={handleChangePassword}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirm New Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Change Password</button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default FindPassword;
