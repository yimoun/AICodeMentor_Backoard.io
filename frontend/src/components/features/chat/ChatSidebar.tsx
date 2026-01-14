

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import { useAppContext } from '../../layouts/AppLayout';
import UserInfo from './UserInfo';
import CreditsWidget from './CreditsWidget';
import SkillsProgress, { type SkillProgressData } from './SkillsProgress';
import StreakWidget from './StreakWidget';
import { NavItem, SidebarNav } from '../../ui/NavItem';
import {
  ChatSidebarContainer,
  SidebarHeader,
} from '../../../styles/chat/ChatSidebarStyles';

/**
 * Type pour un item de navigation
 */
export interface NavItemData {
  icon: string;
  label: string;
  href: string;
  badge?: number;
}

interface ChatSidebarProps {
  /** Items de navigation personnalisés */
  navItems?: NavItemData[];
  /** Afficher le widget de streak */
  showStreak?: boolean;
  /** Afficher la progression des skills */
  showSkillsProgress?: boolean;
  /** Callback au clic sur acheter des crédits */
  onBuyCredits?: () => void;
  /** Callback au clic sur un skill */
  onSkillClick?: (skillId: string) => void;
  /** Callback au clic sur logout */
  onLogout?: () => void;
}

/**
 * Navigation par défaut
 */
const defaultNavItems: NavItemData[] = [
  { icon: '💬', label: 'Chat', href: '/app/chat' },
  { icon: '📊', label: 'Dashboard', href: '/app/dashboard' },
  { icon: '🏆', label: 'Badges', href: '/app/badges' },
  { icon: '🌐', label: 'Profil Public', href: '/app/profile' },
  { icon: '⚙️', label: 'Paramètres', href: '/app/settings' },
];

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
 * Sidebar du chat avec tous les widgets
 * Utilise automatiquement UserContext et AppContext
 */
const ChatSidebar: React.FC<ChatSidebarProps> = ({
  navItems = defaultNavItems,
  showStreak = true,
  showSkillsProgress = true,
  onBuyCredits,
  onSkillClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Récupérer les données depuis les contextes
  const { user, getInitials, getFullName } = useUser();
  const { credits, sidebarSkills, streakDays } = useAppContext();

  // Données utilisateur depuis le contexte
  const userName = getFullName() || user?.username || 'Utilisateur';
  const userInitials = getInitials() || '?';
  const userPlan = getPlanLabel(user?.plan);

  /**
   * Navigation vers les paramètres
   */
  const handleAvatarClick = () => {
    navigate('/app/settings');
  };

  /**
   * Acheter des crédits
   */
  const handleBuyCredits = () => {
    if (onBuyCredits) {
      onBuyCredits();
    } else {
      navigate('/app/settings');
    }
  };

  /**
   * Clic sur un skill
   */
  const handleSkillClick = (skillId: string) => {
    if (onSkillClick) {
      onSkillClick(skillId);
    } else {
      navigate(`/app/chat?skill=${skillId}`);
    }
  };

  return (
    <ChatSidebarContainer>
      {/* Header avec info utilisateur */}
      <SidebarHeader>
        <UserInfo
          name={userName}
          initials={userInitials}
          plan={userPlan}
          onAvatarClick={handleAvatarClick}
        />
      </SidebarHeader>

      {/* Widget crédits */}
      <CreditsWidget
        current={credits.current}
        total={credits.total}
        onBuyClick={handleBuyCredits}
      />

      {/* Navigation */}
      <SidebarNav>
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={location.pathname === item.href || location.pathname.startsWith(item.href + '/')}
            badge={item.badge}
          />
        ))}
      </SidebarNav>

      {/* Progression des skills */}
      {showSkillsProgress && sidebarSkills.length > 0 && (
        <SkillsProgress
          skills={sidebarSkills}
          onSkillClick={handleSkillClick}
        />
      )}

      {/* Widget streak */}
      {showStreak && streakDays > 0 && (
        <StreakWidget count={streakDays} />
      )}
    </ChatSidebarContainer>
  );
};

export default ChatSidebar;