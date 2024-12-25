import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedProfilePic = localStorage.getItem('profilePicture');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    if (storedProfilePic) {
      setProfilePicture(storedProfilePic);
    }
  }, []);

  const login = (userData) => {
    // Generate a random but static profile picture URL for this session
    const newProfilePic = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`;
    setProfilePicture(newProfilePic);
    localStorage.setItem('profilePicture', newProfilePic);
    
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setProfilePicture(null);
    localStorage.removeItem('user');
    localStorage.removeItem('profilePicture');
    localStorage.removeItem('rememberedUser');
  };

  const value = {
    isAuthenticated,
    user,
    profilePicture,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 