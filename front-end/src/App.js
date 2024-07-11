import logo from './logo.svg';
import { useState } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import './App.css';
import Login from './Login';
// import CreateAccount from './CreateAccount';
import InventoryManager from './InventoryManager';
import Inventory from './Inventory';

function App() {
  const [userId, setUserId] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  // const [ createAccount, setCreateAccount ] = useState();

  return (
    <>
      <Routes>
        <Route path="/Inventory" element={<Inventory />} />
        <Route
          path="/Login"
          element={<Login setLoggedIn={setLoggedIn} setUserId={setUserId} />}
        />
        {/* <Route path="/CreateAccount" element={<CreateAccount setCreateAccount={setCreateAccount} />} /> */}
        <Route
          path="/Users/:UserId/InvManager"
          element={<InventoryManager userId={userId} />}
        />
      </Routes>

      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Inventory Checker</h1>
          <nav>
                <>
                  {/* <Link to="/CreateAccount">Create Account</Link> */}
                  <ul><Link to="/Login"> Login</Link></ul>
                  <ul><Link to="/Inventory">Inventory</Link></ul>
                </>
          </nav>
        </header>
      </div>

    </>
  );
}

export default App;
