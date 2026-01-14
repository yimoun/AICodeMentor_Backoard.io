import React from 'react';
import {
  DashboardCard,
  CardTitle,
} from '../../../styles/dashboard/DashboardStyles';
import {
  BadgesGrid,
  BadgeItem,
  BadgeIcon,
  BadgeName,
  BadgeProgress,
} from '../../../styles/dashboard/DashboardCardsStyles';

/**
 * Type pour un badge
 */
export interface BadgeData {
  id: string;
  name: string;
  icon: string;
  earned: boolean;
  progress?: string;
}

interface BadgesCardProps {
  /** Titre de la card */
  title?: string;
  /** Icône du titre */
  titleIcon?: string;
  /** Liste des badges */
  badges: BadgeData[];
  /** Callback au clic sur un badge */
  onBadgeClick?: (badgeId: string) => void;
}

/**
 * Card des badges récents
 */
const BadgesCard: React.FC<BadgesCardProps> = ({
  title = 'Badges récents',
  titleIcon = '🏆',
  badges,
  onBadgeClick,
}) => {
  return (
    <DashboardCard>
      <CardTitle>
        {titleIcon} {title}
      </CardTitle>
      
      <BadgesGrid>
        {badges.map((badge) => (
          <BadgeItem
            key={badge.id}
            earned={badge.earned}
            onClick={() => onBadgeClick?.(badge.id)}
            sx={{ cursor: onBadgeClick ? 'pointer' : 'default' }}
          >
            <BadgeIcon>{badge.icon}</BadgeIcon>
            <BadgeName>{badge.name}</BadgeName>
            {badge.progress && !badge.earned && (
              <BadgeProgress>{badge.progress}</BadgeProgress>
            )}
          </BadgeItem>
        ))}
      </BadgesGrid>
    </DashboardCard>
  );
};

export default BadgesCard;