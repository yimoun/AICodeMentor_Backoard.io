// Info utilisateur dans le chat (avatar, nom, statut, etc.)

import React from 'react';
import {
  UserInfoContainer,
  UserAvatar,
  UserDetails,
  UserName,
  UserPlan,
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
 * Composant UserInfo - Affiche les informations de l'utilisateur
 */
const UserInfo: React.FC<UserInfoProps> = ({
  name,
  initials,
  plan = 'Plan Gratuit',
  avatarUrl,
  onAvatarClick,
}) => {
  const displayInitials = initials || getInitials(name);

  return (
    <UserInfoContainer>
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
    </UserInfoContainer>
  );
};

export default UserInfo;