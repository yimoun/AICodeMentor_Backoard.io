
import { createContext, useState } from "react";
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
  getPlanLabel: () => string;
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
  getInitials: (): string => "?",
  getFullName: (): string => "",
  hasCompletedOnboarding: (): boolean => false,
  getPlanLabel: (): string => "Plan Gratuit",
};

/**
 * Hook pour créer l'état du contexte utilisateur
 */
export const UserContextState = (): IUserContext => {
  const [state, setState] = useState<{
    initialized: boolean;
    isAuthenticated: boolean;
    isLoading: boolean;
    user: IUser | null;
  }>({
    initialized: false,
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  /**
   * Initialiser le contexte avec les données utilisateur
   */
  const init = (user: IUser): void => {
    setState({
      initialized: true,
      isAuthenticated: true,
      isLoading: false,
      user: { ...user },
    });
  };

  /**
   * Connexion de l'utilisateur
   */
  const login = (user: IUser): void => {
    setState({
      initialized: true,
      isAuthenticated: true,
      isLoading: false,
      user: { ...user },
    });
  };

  /**
   * Déconnexion de l'utilisateur
   */
  const logout = (): void => {
    setState({
      initialized: true,
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
  };

  /**
   * Mettre à jour les données utilisateur
   */
  const updateUser = (updates: Partial<IUser>): void => {
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates } : null,
    }));
  };

  /**
   * Marquer l'onboarding comme terminé
   */
  const completeOnboarding = (data: Partial<IUser>): void => {
    setState((prev) => ({
      ...prev,
      user: prev.user
        ? { ...prev.user, ...data, onboarding_finished: true }
        : null,
    }));
  };

  /**
   * Obtenir les initiales de l'utilisateur
   */
  const getInitials = (): string => {
    const user = state.user;
    if (!user) return "?";

    const firstName = user.first_name || "";
    const lastName = user.last_name || "";

    if (firstName && lastName) {
      return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
    }

    if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    }

    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }

    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }

    return "?";
  };

  /**
   * Obtenir le nom complet de l'utilisateur
   */
  const getFullName = (): string => {
    const user = state.user;
    if (!user) return "";

    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }

    if (user.first_name) {
      return user.first_name;
    }

    return user.username || "";
  };

  /**
   * Vérifier si l'onboarding est terminé
   */
  const hasCompletedOnboarding = (): boolean => {
    return state.user?.onboarding_finished ?? false;
  };

  /**
   * Obtenir le label du plan
   */
  const getPlanLabel = (): string => {
    const plan = state.user?.plan;
    switch (plan) {
      case 'starter':
        return 'Plan Starter';
      case 'pro':
        return 'Plan Pro';
      case 'enterprise':
        return 'Plan Enterprise';
      default:
        return 'Plan Gratuit';
    }
  };

  return {
    ...state,
    init,
    login,
    logout,
    updateUser,
    completeOnboarding,
    getInitials,
    getFullName,
    hasCompletedOnboarding,
    getPlanLabel,
  };
};

/**
 * Contexte React
 */
const UserContext = createContext<IUserContext>(defaultUserContext);

export default UserContext;