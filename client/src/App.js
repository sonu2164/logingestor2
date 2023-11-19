// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './component/Login';
import Register from './component/Register';
import QueryInterface from './component/QueryInterface';


const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(
    localStorage.getItem('token') ? true : false
  );

  const logout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={!isLoggedIn ? (
            <Login setLoggedIn={setLoggedIn} />
          ) : (
            <Navigate to="/" />
          )} />

          <Route path="/register" element={!isLoggedIn ? (
            <Register />
          ) : (
            <Navigate to="/" />
          )} />

          <Route
            path='/'

            element={
              isLoggedIn ? (
                <QueryInterface isLoggedIn={isLoggedIn} />
              ) : (
                <Navigate to='/login' />
              )
            }
          />
          {/* <Route path="/" element={<Navigate to="/login" />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
