import React from 'react';
import { Tooltip } from '@mui/material';
import {
  BadgeItemContainer,
  BadgeVisual,
  BadgeEmoji,
  BadgeCount,
//   BadgeProgressIndicator,
  BadgeName,
} from '../../../styles/badges/BadgesStyles';
import BadgeProgressIndicator from './BadgeProgressIndicator';

/**
 * Statut d'un badge
 */
export type BadgeStatus = 'earned' | 'locked' | 'in-progress';

/**
 * Type pour un badge
 */
export interface BadgeItemData {
  id: string;
  icon: string;
  name: string;
  status: BadgeStatus;
  count?: number;
  progress?: string;
  tooltip?: string;
  isRare?: boolean;
}

interface BadgeItemProps {
  /** Données du badge */
  badge: BadgeItemData;
  /** Callback au clic */
  onClick?: (badgeId: string) => void;
}

/**
 * Item de badge individuel
 */
const BadgeItem: React.FC<BadgeItemProps> = ({ badge, onClick }) => {
  const { id, icon, name, status, count, progress, tooltip, isRare } = badge;

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  const badgeContent = (
    <BadgeItemContainer
    //   status={status}
    //   isRare={isRare}
      onClick={handleClick}
    >
      <BadgeVisual>
        <BadgeEmoji>{icon}</BadgeEmoji>
        {count !== undefined && status === 'earned' && (
          <BadgeCount>{count}</BadgeCount>
        )}
        {progress && status === 'in-progress' && (
          <BadgeItemContainer>{progress}</BadgeItemContainer>
        )}
      </BadgeVisual>
      <BadgeName>{name}</BadgeName>
    </BadgeItemContainer>
  );

  // Avec tooltip si défini
  if (tooltip) {
    return (
      <Tooltip title={tooltip} arrow placement="top">
        {badgeContent}
      </Tooltip>
    );
  }

  return badgeContent;
};

export default BadgeItem;