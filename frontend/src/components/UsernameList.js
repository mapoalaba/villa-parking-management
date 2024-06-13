import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UsernameList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usernames } = location.state || { usernames: [] };

  console.log('Usernames:', usernames);

  return (
    <div>
      <h2>Username List</h2>
      {usernames.length > 0 ? (
        <ul>
          {usernames.map((username, index) => (
            <li key={index}>{username}</li>
          ))}
        </ul>
      ) : (
        <p>No usernames found for this phone number.</p>
      )}
      <button onClick={() => navigate('/login')}>Back to Login</button>
      <button onClick={() => navigate('/find-password')}>Find Password</button>
    </div>
  );
};

export default UsernameList;
