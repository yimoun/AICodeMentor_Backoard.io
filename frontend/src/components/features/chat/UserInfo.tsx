import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import UserDS from '../../../data_services/UserDS';
import {
  UserInfoContainer,
  UserInfoRow,
  UserInfoWrapper,
  UserAvatar,
  UserDetails,
  UserName,
  UserPlan,
  LogoutButtonContainer,
  LogoutButton,
  LogoutTooltip,
} from '../../../styles/chat/UserInfoStyles';

interface UserInfoProps {
  /** Nom complet de l'utilisateur */
  name: string;
  /** Initiales pour l'avatar (ex: "JT") */
  initials?: string;
  /** Plan actuel (ex: "Plan Pro") */
  plan?: string;
  /** URL de l'avatar (optionnel) */
  avatarUrl?: string;
  /** Callback au clic sur l'avatar */
  onAvatarClick?: () => void;
  /** Afficher le bouton de déconnexion */
  showLogout?: boolean;
  /** Callback personnalisé pour la déconnexion */
  onLogout?: () => void;
}

/**
 * Génère les initiales à partir du nom
 */
const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

/**
 * Icône de déconnexion (SVG)
 */
const LogoutIcon: React.FC = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

/**
 * Icône de chargement (SVG spinner)
 */
const SpinnerIcon: React.FC = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);

/**
 * Composant UserInfo - Affiche les informations de l'utilisateur avec bouton déconnexion
 */
const UserInfo: React.FC<UserInfoProps> = ({
  name,
  initials,
  plan = 'Plan Gratuit',
  avatarUrl,
  onAvatarClick,
  showLogout = true,
  onLogout,
}) => {
  const navigate = useNavigate();
  const { logout: logoutContext } = useUser();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const displayInitials = initials || getInitials(name);

  /**
   * Gestion de la déconnexion
   */
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // Appeler le callback personnalisé si fourni
      if (onLogout) {
        onLogout();
        return;
      }

      // Sinon, utiliser la logique par défaut
      console.log('👋 Logging out...');
      
      // 1. Déconnexion via UserDS (clear localStorage)
      await UserDS.logout();
      
      // 2. Mettre à jour le contexte
      logoutContext();
      
      // 3. Rediriger vers login
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error('Logout error:', error);
      // En cas d'erreur, forcer la déconnexion quand même
      logoutContext();
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <UserInfoContainer>
      <UserInfoRow>
        {/* Avatar + Infos */}
        <UserInfoWrapper>
          <UserAvatar
            src={avatarUrl}
            alt={name}
            onClick={onAvatarClick}
            sx={{ cursor: onAvatarClick ? 'pointer' : 'default' }}
          >
            {!avatarUrl && displayInitials}
          </UserAvatar>
          
          <UserDetails>
            <UserName>{name}</UserName>
            <UserPlan>{plan}</UserPlan>
          </UserDetails>
        </UserInfoWrapper>

        {/* Bouton de déconnexion */}
        {showLogout && (
          <LogoutButtonContainer>
            <LogoutButton
              onClick={handleLogout}
              disabled={isLoggingOut}
              $isLoading={isLoggingOut}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              aria-label="Se déconnecter"
            >
              {isLoggingOut ? <SpinnerIcon /> : <LogoutIcon />}
            </LogoutButton>
            
            <LogoutTooltip $visible={showTooltip && !isLoggingOut}>
              Se déconnecter
            </LogoutTooltip>
          </LogoutButtonContainer>
        )}
      </UserInfoRow>
    </UserInfoContainer>
  );
};

export default UserInfo;