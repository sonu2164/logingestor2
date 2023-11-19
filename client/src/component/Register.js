import React, { useState } from 'react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const registerUser = async () => {
        try {
            if (password !== confirmPassword) {
                setMessage('Passwords do not match');
                return;
            }

            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`User ${data.username} registered successfully!`);
                // You might want to redirect to the login page or automatically log in the user here
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Error during registration:', error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">User Registration</h2>

                <div className="mb-4">
                    <label className="block text-gray-700">Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <button
                    onClick={registerUser}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Register
                </button>

                {message && <p className="text-red-500 mt-4">{message}</p>}
            </div>
        </div>
    );
};

export default Register;
