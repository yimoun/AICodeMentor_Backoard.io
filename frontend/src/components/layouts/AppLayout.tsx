import React, { useState, createContext, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ChatSidebar, { type UserData, type CreditsData, type NavItemData } from '../features/chat/ChatSidebar.tsx';
import { type SkillProgressData } from '../features/chat/SkillsProgress.tsx';
import { ChatLayoutContainer } from '../../styles/chat/ChatLayoutStyles.ts';

/**
 * Type pour le contexte de l'application
 */
interface AppContextType {
  user: UserData;
  credits: CreditsData; 
  skills: SkillProgressData[];
  streakCount: number;
  updateCredits: (newCredits: Partial<CreditsData>) => void;
  updateUser: (newUser: Partial<UserData>) => void;
}

/**
 * Contexte de l'application
 */
const AppContext = createContext<AppContextType | null>(null);

/**
 * Hook pour accéder au contexte
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppLayout');
  }
  return context;
};

/**
 * Données utilisateur par défaut
 */
const defaultUser: UserData = {
  name: 'Jordan T.',
  initials: 'JT',
  plan: 'Plan Pro',
};

/**
 * Crédits par défaut
 */
const defaultCredits: CreditsData = {
  current: 1847,
  total: 2000,
};

/**
 * Skills par défaut
 */
const defaultSkills: SkillProgressData[] = [
  { id: 'python', name: 'Python', icon: '🐍', level: 'Intermédiaire', progress: 65 },
  { id: 'fastapi', name: 'FastAPI', icon: '⚡', level: 'Débutant', progress: 25 },
  { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', level: 'Intermédiaire', progress: 55 },
];

/**
 * Navigation items
 */
const navItems: NavItemData[] = [
  { icon: '💬', label: 'Chat', href: '/app/chat' },
  { icon: '📊', label: 'Dashboard', href: '/app/dashboard' },
  { icon: '📚', label: 'Mes skills', href: '/app/skills' },
  { icon: '🏆', label: 'Badges', href: '/app/badges' },
  { icon: '⚙️', label: 'Paramètres', href: '/app/settings' },
];

/**
 * Layout principal de l'application avec sidebar persistante
 */
const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  
  // State global de l'application
  const [user, setUser] = useState<UserData>(defaultUser);
  const [credits, setCredits] = useState<CreditsData>(defaultCredits);
  const [skills] = useState<SkillProgressData[]>(defaultSkills);
  const [streakCount] = useState(7);

  /**
   * Met à jour les crédits
   */
  const updateCredits = (newCredits: Partial<CreditsData>) => {
    setCredits((prev) => ({ ...prev, ...newCredits }));
  };

  /**
   * Met à jour l'utilisateur
   */
  const updateUser = (newUser: Partial<UserData>) => {
    setUser((prev) => ({ ...prev, ...newUser }));
  };

  /**
   * Acheter des crédits
   */
  const handleBuyCredits = () => {
    navigate('/app/settings');
  };

  /**
   * Clic sur un skill
   */
  const handleSkillClick = (skillId: string) => {
    navigate(`/app/chat?skill=${skillId}`);
  };

  // Valeur du contexte
  const contextValue: AppContextType = {
    user,
    credits,
    skills,
    streakCount,
    updateCredits,
    updateUser,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <ChatLayoutContainer>
        {/* Sidebar persistante */}
        <ChatSidebar
          user={user}
          credits={credits}
          skills={skills}
          streakCount={streakCount}
          navItems={navItems}
          onBuyCredits={handleBuyCredits}
          onSkillClick={handleSkillClick}
        />

        {/* Contenu dynamique (change selon la route) */}
        <Outlet />
      </ChatLayoutContainer>
    </AppContext.Provider>
  );
};

export default AppLayout;