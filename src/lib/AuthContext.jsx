/**
 * AuthContext.jsx — Contexte d'authentification relié au backend FastAPI
 * 
 * Remplace l'ancien AuthContext.jsx (qui utilisait @base44/sdk).
 * Placez ce fichier dans :  Front end/src/lib/AuthContext.jsx
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getMe, isLoggedIn } from '@/api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  // Gardés pour compatibilité avec App.jsx existant
  const [isLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Au montage : vérifie si un token valide est présent
  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    setIsLoadingAuth(true);
    setAuthError(null);

    if (!isLoggedIn()) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoadingAuth(false);
      return;
    }

    try {
      const currentUser = await getMe();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      // Token expiré ou invalide
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("crypto_token");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  /** Connexion avec username + password */
  const login = async (username, password) => {
    setAuthError(null);
    const data = await apiLogin(username, password); // lance une exception si échec
    setUser({ username: data.username, role: data.role });
    setIsAuthenticated(true);
    return data;
  };

  /** Déconnexion */
  const logout = async (shouldRedirect = false) => {
    try {
      await apiLogout();
    } catch (_) { /* ignore */ }
    setUser(null);
    setIsAuthenticated(false);
    if (shouldRedirect) {
      window.location.href = "/landing";
    }
  };

  /** Redirige vers la page de connexion */
  const navigateToLogin = () => {
    window.location.href = "/landing";
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings: null,
      authChecked: !isLoadingAuth,
      login,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState: checkUserAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
