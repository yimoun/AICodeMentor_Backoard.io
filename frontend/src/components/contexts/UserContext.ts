import { createContext, useState, useCallback } from "react";
import type IUser from "../../data_interfaces/IUser";

/**
 * Interface du contexte utilisateur
 */
export interface IUserContext {
  // État
  initialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: IUser | null;

  // Actions d'authentification
  init: (user: IUser) => void;
  login: (user: IUser) => void;
  logout: () => void;
  
  // Actions de mise à jour
  updateUser: (updates: Partial<IUser>) => void;
  completeOnboarding: (data: Partial<IUser>) => void;
  
  // Helpers
  getInitials: () => string;
  getFullName: () => string;
  hasCompletedOnboarding: () => boolean;
}

/**
 * Valeurs par défaut du contexte
 */
const defaultUserContext: IUserContext = {
  initialized: false,
  isAuthenticated: false,
  isLoading: true,
  user: null,

  init: (): void => {},
  login: (): void => {},
  logout: (): void => {},
  updateUser: (): void => {},
  completeOnboarding: (): void => {},
  getInitials: (): string => "",
  getFullName: (): string => "",
  hasCompletedOnboarding: (): boolean => false,
};

/**
 * Hook pour créer l'état du contexte utilisateur
 */
export const UserContextState = (): IUserContext => {
  const [userContext, setUserContext] = useState<IUserContext>(defaultUserContext);

  /**
   * Initialiser le contexte avec les données utilisateur
   * Appelé au chargement de l'app si un token existe
   */
  userContext.init = (user: IUser): void => {
    setUserContext((prev) => ({
      ...prev,
      initialized: true,
      isAuthenticated: true,
      isLoading: false,
      user: { ...user },
    }));
  };

  /**
   * Connexion de l'utilisateur
   */
  userContext.login = (user: IUser): void => {
    setUserContext((prev) => ({
      ...prev,
      initialized: true,
      isAuthenticated: true,
      isLoading: false,
      user: { ...user },
    }));
  };

  /**
   * Déconnexion de l'utilisateur
   */
  userContext.logout = (): void => {
    setUserContext((prev) => ({
      ...prev,
      initialized: true,
      isAuthenticated: false,
      isLoading: false,
      user: null,
    }));
  };

  /**
   * Mettre à jour les données utilisateur
   */
  userContext.updateUser = (updates: Partial<IUser>): void => {
    setUserContext((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates } : null,
    }));
  };

  /**
   * Marquer l'onboarding comme terminé
   */
  userContext.completeOnboarding = (data: Partial<IUser>): void => {
    setUserContext((prev) => ({
      ...prev,
      user: prev.user
        ? { ...prev.user, ...data, onboarding_finished: true }
        : null,
    }));
  };

  /**
   * Obtenir les initiales de l'utilisateur
   */
  userContext.getInitials = (): string => {
    const user = userContext.user;
    if (!user) return "?";

    const firstInitial = user.first_name?.charAt(0)?.toUpperCase() || "";
    const lastInitial = user.last_name?.charAt(0)?.toUpperCase() || "";

    if (firstInitial && lastInitial) {
      return `${firstInitial}${lastInitial}`;
    }

    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }

    return "?";
  };

  /**
   * Obtenir le nom complet de l'utilisateur
   */
  userContext.getFullName = (): string => {
    const user = userContext.user;
    if (!user) return "";

    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }

    return user.username || "";
  };

  /**
   * Vérifier si l'onboarding est terminé
   */
  userContext.hasCompletedOnboarding = (): boolean => {
    return userContext.user?.onboarding_finished ?? false;
  };

  return userContext;
};

/**
 * Contexte React
 */
const UserContext = createContext<IUserContext>(defaultUserContext);

export default UserContext;