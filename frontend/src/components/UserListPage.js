import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/UserListPage.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/all`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/user/delete/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      setMessage('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage('Error deleting user');
    }
  };

  const handleViewUser = (userId) => {
    navigate(`/user-info/${userId}`);
  };

  return (
    
    <div className="user-list-container">
      <h2 className='userlistpage-h2'>모든 회원 목록</h2>
      <div className='userlist-body'>
        {message && <p className="message">{message}</p>}
        <ul className="user-list">
          {users.map((user) => (
            <li key={user._id} className="user-item">
              <span>{user.username}</span>
              <div className='userlistbutton-group'>
                <button className="userlistview-btn" onClick={() => handleViewUser(user._id)}>회원정보</button>
                <button className="userlistdelete-btn" onClick={() => handleDeleteUser(user._id)}>삭제</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UsersPage;