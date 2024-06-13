import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Login from './components/Login';
import Register from './components/Register';
import MainPage from './components/MainPage';
import RegisterVilla from './components/RegisterVilla';
import MyVilla from './components/MyVilla';
import EnterVilla from './components/EnterVilla';
import VillaQRCode from './components/VillaQRCode';
import VillaDetail from './components/VillaDetail'; // VillaDetail 컴포넌트 추가
import PrivateRoute from './components/PrivateRoute';
import FindUsername from './components/FindUsername';
import FindPassword from './components/FindPassword';
import UsernameList from './components/UsernameList';
import AdminPage from './components/AdminPage';
import VillaListPage from './components/VillaListPage';
import UserListPage from './components/UserListPage';
import VillaDetailPage from './components/VillaDetailPage';
import UserInfoPage from './components/UserInfoPage';
import './styles/App.css';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <div className="App">
          <header>
            
          </header>
          <body>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/main" element={<PrivateRoute element={<MainPage />} />} />
              <Route path="/my-villa" element={<PrivateRoute element={<MyVilla />} />} />
              <Route path="/enter-villa" element={<PrivateRoute element={<EnterVilla />} />} />
              <Route path="/register-villa/*" element={<PrivateRoute element={<RegisterVilla />} />} />
              <Route path="/villa-qrcode" element={<PrivateRoute element={<VillaQRCode />} />} />
              <Route path="/villa/:id" element={<PrivateRoute element={<VillaDetail />} />} /> {/* VillaDetail 경로 추가 */}
              <Route path="/find-username" element={<FindUsername />} />
              <Route path="/find-password" element={<FindPassword />} />
              <Route path="/username-list" element={<UsernameList />} />
              <Route path="/admin" element={<PrivateRoute element={<AdminPage />} />} />
              <Route path="/villas" element={<PrivateRoute element={<VillaListPage />} />} />
              <Route path="/users" element={<PrivateRoute element={<UserListPage />} />} />
              <Route path="/villa/:id" element={<PrivateRoute element={<VillaDetailPage />} />} />
              <Route path="/user-info/:userId" element={<UserInfoPage />} />
            </Routes>
          </body>
        </div>
      </Router>
    </DndProvider>
  );
}

export default App;
