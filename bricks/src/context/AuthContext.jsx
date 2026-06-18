import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('bricks_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('bricks_token');
    const savedUser = localStorage.getItem('bricks_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('bricks_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, isAdmin = false) => {
    try {
      const endpoint = isAdmin 
        ? 'http://localhost:5000/api/auth/admin-login' 
        : 'http://localhost:5000/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data);
        localStorage.setItem('bricks_token', data.token);
        localStorage.setItem('bricks_user', JSON.stringify(data));
        return { success: true, role: data.role };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An unexpected error occurred.' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bricks_token');
    localStorage.removeItem('bricks_user');
  };

  const updateUserInfo = (userData) => {
    setUser(userData);
    localStorage.setItem('bricks_user', JSON.stringify(userData));
    if (userData.token) {
        setToken(userData.token);
        localStorage.setItem('bricks_token', userData.token);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUserInfo,
  };


  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
