import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/user/login', form, { withCredentials: true });
      if (response.status === 200) {
        alert('Login successful!');
        navigate('/main');
      }
    } catch (error) {
      console.error('There was an error during the login!', error);
      alert('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input type="text" name="username" value={form.username} onChange={handleChange} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
