import React, { useState } from 'react';
// import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ setLoggedIn, setUserId }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  //const [loggedIn, setLoggedIn] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      if (!response.ok) {
        throw new Error('Network response failed');
      }

      const data = await response.json();
      console.log('Login data:', data);

      const userId = data[0].id;
      setLoggedIn(true);
      setUserId(userId);
      navigate(`/Users/${userId}/InvManager`);
      console.log('UserId:', data.userId);

    } catch (error) {
        console.error('Failed to login', error);
    }

  };

  return (
    <div className="login-form">
      <h2>Inventory Manager Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
