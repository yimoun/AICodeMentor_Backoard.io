

import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AppContext, { AppContextState } from '../../components/contexts/AppContext';
import useUser from '../../components/hooks/useUser';
import ChatSidebar from '../features/chat/ChatSidebar';
import ProgressBackdrop from '../controls/ProgressBackdrop';
import { ChatLayoutContainer } from '../../styles/chat/ChatLayoutStyles';
import UserDS from '../../data_services/UserDS';
import type { SkillProgressData } from '../features/chat/SkillsProgress';


export { useAppContext } from '../../components/contexts/AppContext';

/**
 * Skills par défaut pour la sidebar
 */
const defaultSidebarSkills: SkillProgressData[] = [
  { id: 'python', name: 'Python', icon: '🐍', level: 'Intermédiaire', progress: 65 },
  { id: 'fastapi', name: 'FastAPI', icon: '⚡', level: 'Débutant', progress: 25 },
  { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', level: 'Intermédiaire', progress: 55 },
];

/**
 * Contenu de l'AppLayout (utilise les contextes)
 */
const AppLayoutContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Contextes
  const { 
    user, 
    isAuthenticated, 
    isLoading: isUserLoading, 
    hasCompletedOnboarding,
    logout: logoutUser,
  } = useUser();

  const appContext = React.useContext(AppContext);
  const { init: initApp, initialized: isAppInitialized } = appContext;

  /**
   * Charger les données de l'app au montage
   */
  useEffect(() => {
    // Attendre que l'utilisateur soit chargé
    if (isUserLoading || !isAuthenticated || !user) return;
    
    // Ne pas réinitialiser si déjà fait
    if (isAppInitialized) return;

    // Initialiser les données de l'app
    initApp({
      credits: {
        current: user.credits || 1847,
        total: 2000,
      },
      sidebarSkills: defaultSidebarSkills,
      streakDays: 7,
      unreadNotifications: 0,
    });
  }, [isUserLoading, isAuthenticated, user, isAppInitialized, initApp]);

  /**
   * Protection des routes
   */
  useEffect(() => {
    // Attendre que le contexte soit initialisé
    if (isUserLoading) return;

    // Si non authentifié, rediriger vers login
    if (!isAuthenticated) {
      console.log('🔒 Not authenticated, redirecting to /login');
      navigate('/login', { 
        replace: true,
        state: { from: location }
      });
      return;
    }

    // Si onboarding pas terminé, rediriger vers onboarding
    if (!hasCompletedOnboarding()) {
      console.log('📋 Onboarding not finished, redirecting to /onboarding');
      navigate('/onboarding', { replace: true });
      return;
    }
  }, [isAuthenticated, isUserLoading, hasCompletedOnboarding, navigate, location]);

  /**
   * Déconnexion
   */
  const handleLogout = async () => {
    try {
      await UserDS.logout();
      logoutUser();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
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

  // Afficher un loader pendant l'initialisation
  if (isUserLoading) {
    return <ProgressBackdrop open={true} />;
  }

  // Ne pas afficher si non authentifié (redirect en cours)
  if (!isAuthenticated) {
    return <ProgressBackdrop open={true} />;
  }

  return (
    <ChatLayoutContainer>
      {/* Sidebar - utilise automatiquement les contextes */}
      <ChatSidebar
        onBuyCredits={handleBuyCredits}
        onLogout={handleLogout}
        onSkillClick={handleSkillClick}
      />
      
      {/* Contenu de la page */}
      <Outlet />
    </ChatLayoutContainer>
  );
};

/**
 * Layout principal avec AppContext Provider
 */
const AppLayout: React.FC = () => {
  const appContext = AppContextState();

  return (
    <AppContext.Provider value={appContext}>
      <AppLayoutContent />
    </AppContext.Provider>
  );
};

export default AppLayout;