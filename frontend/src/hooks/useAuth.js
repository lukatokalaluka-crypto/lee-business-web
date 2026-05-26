import { useState, useEffect } from 'react';
import { apiUrl } from '../utils/api';

const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setIsAdmin(true);
      return true;
    } catch (err) {
      setError(err.message || 'An error occurred during login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl('/api/auth/logout'), {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Logout failed');
      }
      setIsAdmin(false);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message || 'Unable to logout');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    setAuthChecking(true);
    try {
      const response = await fetch(apiUrl('/api/auth/check'), {
        credentials: 'include',
      });
      const data = await response.json();
      setIsAdmin(data.isAdmin === true);
    } catch (err) {
      setIsAdmin(false);
    } finally {
      setAuthChecking(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return {
    isAdmin,
    authChecking,
    loading,
    error,
    login,
    logout,
    checkAuthStatus,
  };
};

export default useAuth;