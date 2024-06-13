import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3001/login', { username, password }, { withCredentials: true });
      if (response && response.data) {
        setMessage(response.data.message);
        localStorage.setItem('token', response.data.token);

        console.log("role:", response.data.role);
        navigate('/main');
        
      } else {
        setMessage('Unexpected error occurred. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Login</button>
          <Link to="/register">
            <button type="button">Register</button>
          </Link>
        </div>
      </form>
      {message && <p>{message}</p>}
      <div>
        <Link to="/find-username">아이디 찾기</Link> | <Link to="/find-password">비밀번호 찾기</Link>
      </div>
    </div>
  );
};

export default Login;
