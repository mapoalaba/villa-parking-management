import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/FindPassword.css';

const FindPassword = () => {
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // const validatePhone = (phone) => {
  //   const phoneRegex = /^(010\d{4}\d{4}|010-\d{4}-\d{4})$/;
  //   return phoneRegex.test(phone);
  // };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,20}$/;
    return passwordRegex.test(password);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    // if (!validatePhone(phone)) {
    //   setMessage('Phone number must be in the format 01000000000 or 010-0000-0000.');
    //   return;
    // }
    try {
      const response = await axios.post('http://localhost:3001/api/user/send-code', { phone });
      alert('인증 코드가 전송되었습니다!');
      setMessage(response.data.message);
    } catch (error) {
      console.error('인증 코드를 전송하는 동안 오류가 발생했습니다!', error);
      setMessage(error.response?.data?.message || '예기치 않은 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/user/verify-code', { code: verificationCode });
      if (response.status === 200) {
        setIsVerified(true);
        alert('전화번호가 확인되었습니다!');
        setMessage('휴대폰 번호가 확인되었습니다! 이제 비밀번호를 재설정할 수 있습니다.');
      }
    } catch (error) {
      console.error('코드 확인 중 오류가 발생했습니다!', error);
      setMessage(error.response?.data?.message || '인증 코드가 잘못되었습니다! 다시 시도해 주세요.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validatePassword(newPassword)) {
      setMessage('비밀번호는 대문자 하나 이상과 특수 문자 하나를 포함하여 4~20자 길이여야 합니다.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다!");
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/user/change-password', {
        phone,
        username,
        newPassword
      });
      if (response.status === 200) {
        alert('비밀번호가 성공적으로 변경되었습니다!');
        navigate('/login');
      } else {
        setMessage(response.data.message || '비밀번호 변경 오류');
      }
    } catch (error) {
      console.error('비밀번호를 변경하는 동안 오류가 발생했습니다!', error);
      setMessage(error.response?.data?.message || '예기치 않은 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="find-password-container">
      <h2>비밀번호 찾기</h2>
      {!isVerified ? (
        <>
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
                  className="input-field"
                />
                <button type="submit" className="btn">코드전송</button>
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
                className="input-field"
              />
              <button onClick={handleVerifyCode} className="btn">인증확인</button>
            </div>
          </div>
        </>
      ) : (
        <form onSubmit={handleChangePassword}>
          <div className="input-group">
            <label>아이디:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label>새 비밀번호:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label>새 비밀번호 확인:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <button type="submit" className="btn full-width-btn">비밀번호 변경</button>
          </div>
        </form>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default FindPassword;