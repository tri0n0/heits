import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import App from '../App';

const RoutesComponent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
      />
      <Route
        path="/*"
        element={isAuthenticated ? <App /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <RoutesComponent />
    </BrowserRouter>
  );
};

export default AppRouter; 