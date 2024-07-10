import logo from './logo.svg';
import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import './App.css';
import Login from './Login';
// import CreateAccount from './CreateAccount';
import InventoryManager from './InventoryManager';
import Inventory from './Inventory';

function App() {
  // const navigate = useNavigate();
  const [ loggedIn, setLoggedIn] = useState(0);
  // const [ createAccount, setCreateAccount ] = useState();

  return (
    <>
      <Routes>
        <Route path="/Inventory" element={<Inventory/>} />
        <Route path="/Login" element={<Login setLoggedIn={setLoggedIn} />} />
        {/* <Route path="/CreateAccount" element={<CreateAccount setCreateAccount={setCreateAccount} />} /> */}
        <Route path="/Users/:UserId/InvManager" element={<InventoryManager />} />
      </Routes>

      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Inventory Checker</h1>
          <nav>
            {!loggedIn 
            // || !createAccount 
            ? 
            (
              <>
            {/* <Link to="/CreateAccount">Create Account</Link> */}
              <Link to="/Login"> Login</Link>
              <Link to="/Inventory"> Inventory</Link>
              </> 
               ) 
              : null}
            {loggedIn ? (
              <>
                <Link to="/Users/:UserId/InvManager">Inventory Manager</Link>
                <Link to="/dashboard">Dashboard</Link>
              </>
            ) : (null)}
          </nav>
        </header>
      </div>

    </>
  );
}

export default App;
