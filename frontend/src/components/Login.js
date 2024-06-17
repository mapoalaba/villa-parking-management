// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3001/login', { username, password }, { withCredentials: true });
//       if (response && response.data) {
//         setMessage(response.data.message);
//         localStorage.setItem('token', response.data.token);
//         navigate('/main');
//       } else {
//         setMessage('Unexpected error occurred. Please try again.');
//       }
//     } catch (error) {
//       if (error.response && error.response.data) {
//         setMessage(error.response.data.message);
//       } else {
//         setMessage('Unexpected error occurred. Please try again.');
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <div>
//           <label>Username:</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <div>
//           <button type="submit">Login</button>
//           <Link to="/register">
//             <button type="button">Register</button>
//           </Link>
//         </div>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

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
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>아이디:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label>비밀번호:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="button-group">
          <button type="submit" className="btn login-btn">로그인</button>
          <Link to="/register" className='link'>회원가입</Link>
        </div>
      </form>
      {message && <p className="message">{message}</p>}
      <div className="link-group">
        <Link to="/find-username" className="link">아이디 찾기</Link> | <Link to="/find-password" className="link">비밀번호 찾기</Link>
      </div>
    </div>
  );
};

export default Login;