import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Login from './Components/login';
import Dashboard from './Components/dashboard';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={loggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          <Route
            path="/dashboard"
            element={loggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;