import React, { useState } from 'react';
// import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = ( {setLoggedIn} ) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  //const [loggedIn, setLoggedIn] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try{
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });
      const data = await response.json();
      setLoggedIn(data[0].id);
      navigate('/inventorymanager');
      //console.log(data);
    }catch(error){
      console.error(error);
    }
    
  };

  return (
    <div className="login-container">
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
