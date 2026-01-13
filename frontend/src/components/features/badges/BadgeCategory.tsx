

import React from 'react';
import BadgeItem, { type BadgeItemData } from './BadgeItem';
import {
  BadgeCategoryContainer,
  CategoryTitle,
  BadgesRow,
} from '../../../styles/badges/BadgesStyles';

/**
 * Type pour une catégorie de badges
 */
export interface BadgeCategoryData {
  id: string;
  icon: string;
  title: string;
  badges: BadgeItemData[];
}

interface BadgeCategoryProps {
  /** Données de la catégorie */
  category: BadgeCategoryData;
  /** Callback au clic sur un badge */
  onBadgeClick?: (badgeId: string) => void;
}

/**
 * Catégorie de badges avec titre et liste de badges
 */
const BadgeCategory: React.FC<BadgeCategoryProps> = ({
  category,
  onBadgeClick,
}) => {
  const { icon, title, badges } = category;

  return (
    <BadgeCategoryContainer>
      <CategoryTitle>
        {icon} {title}
      </CategoryTitle>
      <BadgesRow>
        {badges.map((badge) => (
          <BadgeItem
            key={badge.id}
            badge={badge}
            onClick={onBadgeClick}
          />
        ))}
      </BadgesRow>
    </BadgeCategoryContainer>
  );
};

export default BadgeCategory;