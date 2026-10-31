import React, { useState, useEffect } from 'react';
import { apiClient, User } from '../services/apiClient';
import { AuthContext } from './authContextInstance';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(localStorage.getItem('access_token') && !localStorage.getItem('user_profile')));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && !user) {
      apiClient.getCurrentUser()
        .then((profile) => {
          setUser(profile);
          localStorage.setItem('user_profile', JSON.stringify(profile));
        })
        .catch(() => {
          apiClient.clearAuth();
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user]);

  const login = async (phone: string, pin: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.login(phone, pin);
      setUser(response.user);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'लॉगिन अयशस्वी. कृपया फोन व पासवर्ड तपासा.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiClient.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
