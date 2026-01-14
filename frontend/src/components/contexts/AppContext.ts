import { createContext, useState, useContext } from "react";
import type { SkillProgressData } from "../../components/features/chat/SkillsProgress";


export interface CreditsData {
  current: number;
  total: number;
}

/**
 * Interface du contexte de l'application
 */
export interface IAppContext {
  // État
  initialized: boolean;
  isLoading: boolean;

  // Crédits
  credits: CreditsData;
  updateCredits: (current: number) => void;
  deductCredits: (amount: number) => void;

  // Skills de la sidebar
  sidebarSkills: SkillProgressData[];
  setSidebarSkills: (skills: SkillProgressData[]) => void;

  // Streak
  streakDays: number;
  updateStreak: (days: number) => void;

  // Notifications
  unreadNotifications: number;
  setUnreadNotifications: (count: number) => void;

  // Initialisation
  init: (data: Partial<AppInitData>) => void;
  reset: () => void;
}

/**
 * Données d'initialisation
 */
export interface AppInitData {
  credits: CreditsData;
  sidebarSkills: SkillProgressData[];
  streakDays: number;
  unreadNotifications: number;
}

/**
 * Valeurs par défaut du contexte
 */
const defaultAppContext: IAppContext = {
  initialized: false,
  isLoading: true,

  credits: { current: 0, total: 0 },
  updateCredits: (): void => {},
  deductCredits: (): void => {},

  sidebarSkills: [],
  setSidebarSkills: (): void => {},

  streakDays: 0,
  updateStreak: (): void => {},

  unreadNotifications: 0,
  setUnreadNotifications: (): void => {},

  init: (): void => {},
  reset: (): void => {},
};

/**
 * Hook pour créer l'état du contexte
 */
export const AppContextState = (): IAppContext => {
  const [appContext, setAppContext] = useState<IAppContext>(defaultAppContext);

  /**
   * Initialiser le contexte avec les données de l'app
   */
  appContext.init = (data: Partial<AppInitData>): void => {
    setAppContext((prev) => ({
      ...prev,
      initialized: true,
      isLoading: false,
      credits: data.credits || prev.credits,
      sidebarSkills: data.sidebarSkills || prev.sidebarSkills,
      streakDays: data.streakDays ?? prev.streakDays,
      unreadNotifications: data.unreadNotifications ?? prev.unreadNotifications,
    }));
  };

  /**
   * Réinitialiser le contexte
   */
  appContext.reset = (): void => {
    setAppContext({
      ...defaultAppContext,
      initialized: true,
      isLoading: false,
    });
  };

  /**
   * Mettre à jour les crédits
   */
  appContext.updateCredits = (current: number): void => {
    setAppContext((prev) => ({
      ...prev,
      credits: { ...prev.credits, current },
    }));
  };

  /**
   * Déduire des crédits
   */
  appContext.deductCredits = (amount: number): void => {
    setAppContext((prev) => ({
      ...prev,
      credits: {
        ...prev.credits,
        current: Math.max(0, prev.credits.current - amount),
      },
    }));
  };

  /**
   * Mettre à jour les skills de la sidebar
   */
  appContext.setSidebarSkills = (skills: SkillProgressData[]): void => {
    setAppContext((prev) => ({
      ...prev,
      sidebarSkills: [...skills],
    }));
  };

  /**
   * Mettre à jour le streak
   */
  appContext.updateStreak = (days: number): void => {
    setAppContext((prev) => ({
      ...prev,
      streakDays: days,
    }));
  };

  /**
   * Mettre à jour les notifications
   */
  appContext.setUnreadNotifications = (count: number): void => {
    setAppContext((prev) => ({
      ...prev,
      unreadNotifications: count,
    }));
  };

  return appContext;
};

/**
 * Contexte React
 */
const AppContext = createContext<IAppContext>(defaultAppContext);

/**
 * Hook personnalisé pour accéder au contexte de l'app
 * 
 * @example
 * const { credits, deductCredits, sidebarSkills } = useAppContext();
 */
export const useAppContext = (): IAppContext => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppLayout");
  }

  return context;
};

export default AppContext;