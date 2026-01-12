// Sidebar complète pour le chat, incluant la liste des conversations et les options de l'utilisateur

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserInfo from './UserInfo';
import CreditsWidget from './CreditsWidget';
import SkillsProgress, { type SkillProgressData } from './SkillsProgress';
import StreakWidget from './StreakWidget';
import { NavItem, SidebarNav } from '../../layout/NavItem';
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

/**
 * Type pour les données utilisateur
 */
export interface UserData {
  name: string;
  initials?: string;
  plan: string;
  avatarUrl?: string;
}

/**
 * Type pour les données de crédits
 */
export interface CreditsData {
  current: number;
  total: number;
}

interface ChatSidebarProps {
  /** Données utilisateur */
  user: UserData;
  /** Données des crédits */
  credits: CreditsData;
  /** Skills avec progression */
  skills?: SkillProgressData[];
  /** Nombre de jours de streak */
  streakCount?: number;
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
}

/**
 * Navigation par défaut
 */
const defaultNavItems: NavItemData[] = [
  { icon: '💬', label: 'Chat', href: '/chat' },
  { icon: '📊', label: 'Dashboard', href: '/dashboard' },
  { icon: '📚', label: 'Mes skills', href: '/skills' },
  { icon: '🏆', label: 'Badges', href: '/badges' },
  { icon: '⚙️', label: 'Paramètres', href: '/settings' },
];

/**
 * Sidebar du chat avec tous les widgets
 */
const ChatSidebar: React.FC<ChatSidebarProps> = ({
  user,
  credits,
  skills = [],
  streakCount = 0,
  navItems = defaultNavItems,
  showStreak = true,
  showSkillsProgress = true,
  onBuyCredits,
  onSkillClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ChatSidebarContainer>
      {/* Header avec info utilisateur */}
      <SidebarHeader>
        <UserInfo
          name={user.name}
          initials={user.initials}
          plan={user.plan}
          avatarUrl={user.avatarUrl}
          onAvatarClick={() => navigate('/settings')}
        />
      </SidebarHeader>

      {/* Widget crédits */}
      <CreditsWidget
        current={credits.current}
        total={credits.total}
        onBuyClick={onBuyCredits}
      />

      {/* Navigation */}
      <SidebarNav>
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={location.pathname === item.href}
            badge={item.badge}
          />
        ))}
      </SidebarNav>

      {/* Progression des skills */}
      {showSkillsProgress && skills.length > 0 && (
        <SkillsProgress
          skills={skills}
          onSkillClick={onSkillClick}
        />
      )}

      {/* Widget streak */}
      {showStreak && streakCount > 0 && (
        <StreakWidget count={streakCount} />
      )}
    </ChatSidebarContainer>
  );
};

export default ChatSidebar;