

// import React, { useState } from 'react';
// import './Login.css';
// import { useNavigate } from 'react-router-dom';

// const CreateAccount = (setCreateAccount) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();
//   //const [loggedIn, setLoggedIn] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
 
//     try{
//       const response = await fetch("http://localhost:8080/login", {
//         method: "POST",
//         headers:{
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: username,
//           password: password
//         })
//       });
//       const data = await response.json();
//       setCreateAccount(data[0].id);
//       navigate('/Login');
//       //console.log(data);
//     }catch(error){
//       console.error(error);
//     }
    
//   };

//   return (
//     <div className="login-container">
//       <h2>Create Account</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Create Username</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Create Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Create Account</button>
//       </form>
//     </div>
//   );
// };

// export default CreateAccount;