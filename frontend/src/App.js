import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MainPage from './components/MainPage';
import FindUsername from './components/FindUsername';
import FindPassword from './components/FindPassword';
import './App.css';

function PrivateRoute({ element }) {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/main" element={<PrivateRoute element={<MainPage />} />} />
            <Route path="/find-username" element={<FindUsername />} />
            <Route path="/find-password" element={<FindPassword />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;