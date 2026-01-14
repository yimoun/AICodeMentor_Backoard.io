

import React, { useEffect, useCallback } from "react";
import UserContext, { UserContextState } from "./UserContext";
import UserDS, { getLocalToken } from "../../data_services/UserDS";

interface UserProviderProps {
  children: React.ReactNode;
}

/**
 * Provider du contexte utilisateur
 * Wrap l'application pour fournir les données utilisateur partout
 */
const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const userContext = UserContextState();

  /**
   * Initialiser le contexte au chargement de l'app
   * Vérifie si un token existe et récupère les données utilisateur
   */
  const initializeUser = useCallback(async () => {
    console.log("🔄 [UserProvider] Initializing user...");

    const token = getLocalToken();

    if (!token) {
      console.log("❌ [UserProvider] No token found, user not authenticated");
      userContext.logout();
      return;
    }

    try {
      console.log("🔑 [UserProvider] Token found, fetching user data...");
      
      // Récupérer les données utilisateur via UserDS
      const response = await UserDS.get();
      const user = response.data;
      
      console.log("✅ [UserProvider] User loaded:", user);
      userContext.init(user);
      
    } catch (error) {
      console.error("❌ [UserProvider] Failed to initialize user:", error);
      // Token invalide ou expiré
      userContext.logout();
    }
  }, []);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return (
    <UserContext.Provider value={userContext}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;