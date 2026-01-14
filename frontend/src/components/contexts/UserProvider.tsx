import React, { useEffect, useCallback } from "react";
import UserContext, { UserContextState } from "./UserContext";
import UserDS from "../../data_services/UserDS";
import { getLocalToken } from "../../data_services/CustomAxios";

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
    const token = getLocalToken();

    if (!token) {
      // Pas de token, utilisateur non connecté
      userContext.logout();
      return;
    }

    try {
      // Token présent, récupérer les données utilisateur
      const response = await UserDS.get();
      userContext.init(response.data);
    } catch (error) {
      console.error("Failed to initialize user:", error);
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