import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/UsernameList.css';

const UsernameList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usernames } = location.state || { usernames: [] };

  console.log('Usernames:', usernames);

  return (
    <div className="username-list-container">
      <div className='usernamelist-header'>
        <h2 className='usernamelist-h2'>아이디 목록</h2>
      </div>
      <div className='usernamelist-body'>
        {usernames.length > 0 ? (
          <ul className="username-list">
            {usernames.map((username, index) => (
              <li key={index}>{username}</li>
            ))}
          </ul>
        ) : (
          <p className="message">이 전화번호에 대한 사용자 아이디를 찾을 수 없습니다.</p>
        )}
        <div className="usernamebutton-group">
          <button onClick={() => navigate('/login')} className="usernamelistlogin-btn">로그인으로 돌아가기</button>
          <button onClick={() => navigate('/find-password')} className="usernamelistfindpwd-btn">비밀번호 찾기</button>
        </div>
      </div>
    </div>
  );
};

export default UsernameList;
