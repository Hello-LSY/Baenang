// services/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import tokenStorage from './tokenStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [memberId, setMemberId] = useState(null);

  useEffect(() => {
    const loadCredentials = async () => {
      const { token, memberId } = await tokenStorage.getCredentials();
      if (token && memberId) {
        setToken(token);
        setMemberId(memberId);
      }
    };
    loadCredentials();
  }, []);

  const login = async (newToken, newMemberId) => {
    setToken(newToken);
    setMemberId(newMemberId);
    await tokenStorage.setCredentials(newToken, newMemberId);
  };

  const logout = async () => {
    setToken(null);
    setMemberId(null);
    await tokenStorage.clearCredentials();
  };

  return (
    <AuthContext.Provider value={{ token, memberId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
