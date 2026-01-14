import React, { useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AppContext, { AppContextState, useAppContext } from '../contexts/AppContext';
import useUser from '../hooks/useUser';
import ChatSidebar from '../features/chat/ChatSidebar';
import ProgressBackdrop from '../controls/ProgressBackdrop';
import { ChatLayoutContainer } from '../../styles/chat/ChatLayoutStyles';
import UserDS from '../../data_services/UserDS';
import type { SkillProgressData } from '../features/chat/SkillsProgress';

// Ré-exporter useAppContext pour les imports depuis AppLayout
export { useAppContext } from '../contexts/AppContext';

/**
 * Items de navigation
 */
interface NavItemData {
  icon: string;
  label: string;
  href: string;
}

const navItems: NavItemData[] = [
  { icon: '💬', label: 'Chat', href: '/app/chat' },
  { icon: '📊', label: 'Dashboard', href: '/app/dashboard' },
  { icon: '🏆', label: 'Badges', href: '/app/badges' },
  { icon: '🌐', label: 'Profil Public', href: '/app/profile' },
  { icon: '⚙️', label: 'Paramètres', href: '/app/settings' },
];

/**
 * Skills par défaut pour la sidebar
 */
const defaultSidebarSkills: SkillProgressData[] = [
  { id: 'python', name: 'Python', icon: '🐍', level: 'Intermédiaire', progress: 65 },
  { id: 'fastapi', name: 'FastAPI', icon: '⚡', level: 'Débutant', progress: 25 },
  { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', level: 'Intermédiaire', progress: 55 },
];

/**
 * Layout principal de l'application
 * Fournit le contexte de l'app et affiche la sidebar + contenu
 */
const AppLayoutContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Contextes
  const { 
    user, 
    isAuthenticated, 
    isLoading: isUserLoading, 
    getInitials,
    getFullName,
    hasCompletedOnboarding,
    logout: logoutUser,
  } = useUser();

  const appContext = useAppContext();
  const { credits, sidebarSkills, init: initApp } = appContext;

  /**
   * Charger les données de l'app au montage
   */
  const loadAppData = useCallback(async () => {
    if (!user) return;

    try {
      // TODO: Remplacer par un appel API réel
      // const response = await AppDS.getAppData();
      
      // Pour l'instant, utiliser les données par défaut ou celles de l'utilisateur
      initApp({
        credits: {
          current: user.credits || 1847,
          total: 2000, // Selon le plan
        },
        sidebarSkills: defaultSidebarSkills, // TODO: Charger depuis l'API
        streakDays: 7, // TODO: Charger depuis l'API
        unreadNotifications: 0,
      });
    } catch (error) {
      console.error('Failed to load app data:', error);
    }
  }, [user, initApp]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadAppData();
    }
  }, [isAuthenticated, user, loadAppData]);

  /**
   * Protection des routes
   */
  useEffect(() => {
    // Attendre que le contexte soit initialisé
    if (isUserLoading) return;

    // Si non authentifié, rediriger vers login
    if (!isAuthenticated) {
      navigate('/login', { 
        replace: true,
        state: { from: location }
      });
      return;
    }

    // Si onboarding pas terminé, rediriger vers onboarding
    if (!hasCompletedOnboarding()) {
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

  // Données pour la sidebar
  const userData = {
    name: getFullName() || user?.username || 'Utilisateur',
    initials: getInitials(),
    plan: getPlanLabel(user?.plan),
  };

  const creditsData = {
    current: credits.current,
    total: credits.total,
  };

  return (
    <ChatLayoutContainer>
      <ChatSidebar
        user={userData}
        credits={creditsData}
        skills={sidebarSkills.length > 0 ? sidebarSkills : defaultSidebarSkills}
        streakCount={appContext.streakDays}
        showStreak={true}
        showSkillsProgress={true}
        navItems={navItems}
        onBuyCredits={handleBuyCredits}
        onSkillClick={handleSkillClick}
      />
      <Outlet />
    </ChatLayoutContainer>
  );
};

/**
 * Obtenir le label du plan
 */
const getPlanLabel = (plan?: string): string => {
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

/**
 * Layout wrapper avec AppContext Provider
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