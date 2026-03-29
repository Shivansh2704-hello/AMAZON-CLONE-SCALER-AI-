import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// DEFAULT USER for "No Login Required" mode
const DEFAULT_USER = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  phone: '9876543210'
};

export const AuthProvider = ({ children }) => {
  // Initialize with DEFAULT_USER if no token is found in localStorage
  // This satisfies the user's "Assume a default user is logged in" request.
  const [user, setUser] = useState(DEFAULT_USER);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || 'mock-admin-token');

  useEffect(() => {
    // If we have a real token, we could fetch the real profile, 
    // but for this request, we prioritize the "Default User" experience.
    if (!localStorage.getItem('token')) {
       localStorage.setItem('token', 'mock-admin-token');
    }
  }, []);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading: loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
