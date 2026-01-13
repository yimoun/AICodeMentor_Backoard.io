import React from 'react';
import {
  FeaturedBadgesContainer,
  FeaturedBadgeItem,
  FeaturedBadgeIcon,
  FeaturedBadgeLabel,
} from '../../../styles/profile/PublicProfileStyles';

/**
 * Données d'un badge en vedette
 */
export interface FeaturedBadgeData {
  id: string;
  icon: string;
  label: string;
}

interface FeaturedBadgesProps {
  badges: FeaturedBadgeData[];
  onBadgeClick?: (badgeId: string) => void;
}

/**
 * Section des badges en vedette
 */
const FeaturedBadges: React.FC<FeaturedBadgesProps> = ({
  badges,
  onBadgeClick,
}) => {
  return (
    <FeaturedBadgesContainer>
      {badges.map((badge) => (
        <FeaturedBadgeItem
          key={badge.id}
          onClick={() => onBadgeClick?.(badge.id)}
          sx={{ cursor: onBadgeClick ? 'pointer' : 'default' }}
        >
          <FeaturedBadgeIcon>{badge.icon}</FeaturedBadgeIcon>
          <FeaturedBadgeLabel>{badge.label}</FeaturedBadgeLabel>
        </FeaturedBadgeItem>
      ))}
    </FeaturedBadgesContainer>
  );
};

export default FeaturedBadges;