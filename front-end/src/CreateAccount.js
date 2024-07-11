import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAccount = ({ setUserId }) => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [createUsername, setCreateUsername] = useState('');
    const [createPassword, setCreatePassword] = useState('');
    const navigate = useNavigate();

    //   handles POST request
    const handleAddUser = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/Users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname: firstname,
                    lastname: lastname,
                    username: createUsername,
                    password: createPassword
                })
            });

            if (!response.ok) {
                throw new Error('Network response failed');
            }

            const data = await response.text();

            const newUserId = data[0].id;
            setFirstname('');
            setLastname('');
            setCreateUsername('');
            setCreatePassword('');
            setUserId(newUserId);
            navigate('/Login');

        } catch (error) {
            console.error('Failed to create user account:', error);
        }
    };


    return (
        <div className="createAccount-form">
            <h2>Create Account</h2>
            <form onSubmit={handleAddUser}>
                <div>
                <label>Firstname</label>
                <input
                        type="text"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                    />
                </div>
                <div>
                <label>Lastname</label>
                <input
                        type="text"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        required
                    />
                </div>
                    <div>
                    <label>Create Username</label>
                    <input
                        type="text"
                        value={createUsername}
                        onChange={(e) => setCreateUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Create Password</label>
                    <input
                        type="password"
                        value={createPassword}
                        onChange={(e) => setCreatePassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Account</button>
            </form>
        </div>
    );
};

export default CreateAccount;