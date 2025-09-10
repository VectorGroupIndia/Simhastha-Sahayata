/*********************************************************************************
 * Author: Sujit Babar
 * Company: Transfigure Technologies Pvt. Ltd.
 *
 * Copyright Note: All rights reserved.
 * The code, design, process, logic, thinking, and overall layout structure
 * of this application are the intellectual property of Transfigure Technologies Pvt. Ltd.
 * This notice is for informational purposes only and does not grant any rights
 * to copy, modify, or distribute this code without explicit written permission.
 * This code is provided as-is and is intended for read-only inspection. It cannot be edited.
 *********************************************************************************/
import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { User } from '../types';

// This file creates a context for authentication.
// It provides a way to manage the currently logged-in user's state throughout the app.
// Components can consume this context to check if a user is logged in, get user details,
// or call login/logout functions.

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((userData: User) => {
    setUser(userData);
    // In a real app, you would also store a token, e.g., in localStorage.
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    // In a real app, you would also clear the token from localStorage.
  }, []);

  const updateUser = useCallback((updatedData: Partial<User>) => {
      setUser(prevUser => prevUser ? { ...prevUser, ...updatedData } : null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};