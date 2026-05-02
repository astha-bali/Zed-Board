import { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('zedboard_token');
    if (token) {
      authApi.getMe()
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('zedboard_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem('zedboard_token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const register = async (name, email, password, role, organization, designation, department) => {
    let res;
    if (role === 'admin') {
      res = await authApi.registerAdmin({ name, email, password, organization, designation, department });
    } else {
      res = await authApi.registerMember({ name, email, password, organization, designation, department });
    }
    localStorage.setItem('zedboard_token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('zedboard_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
