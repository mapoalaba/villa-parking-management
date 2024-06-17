import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { MultiBackend, TouchTransition } from 'dnd-multi-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import Login from './components/Login';
import Register from './components/Register';
import MainPage from './components/MainPage';
import RegisterVilla from './components/RegisterVilla';
import MyVilla from './components/MyVilla';
import EnterVilla from './components/EnterVilla';
import VillaQRCode from './components/VillaQRCode';
import VillaDetail from './components/VillaDetail';
import PrivateRoute from './components/PrivateRoute';
import FindUsername from './components/FindUsername';
import FindPassword from './components/FindPassword';
import UsernameList from './components/UsernameList';
import AdminPage from './components/AdminPage';
import './styles/App.css';

const HTML5toTouch = {
  backends: [
    {
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      transition: TouchTransition,
    },
  ],
};

function App() {
  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/main" element={<PrivateRoute element={<MainPage />} />} />
              <Route path="/my-villa" element={<PrivateRoute element={<MyVilla />} />} />
              <Route path="/enter-villa" element={<PrivateRoute element={<EnterVilla />} />} />
              <Route path="/register-villa/*" element={<PrivateRoute element={<RegisterVilla />} />} />
              <Route path="/villa-qrcode" element={<PrivateRoute element={<VillaQRCode />} />} />
              <Route path="/villa/:id" element={<PrivateRoute element={<VillaDetail />} />} />
              <Route path="/find-username" element={<FindUsername />} />
              <Route path="/find-password" element={<FindPassword />} />
              <Route path="/username-list" element={<UsernameList />} />
              <Route path="/admin" element={<PrivateRoute element={<AdminPage />} />} />
            </Routes>
      </Router>
    </DndProvider>
  );
}

export default App;
