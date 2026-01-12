// Card de statistique

import React from 'react';
import {
  StatCard as StatCardContainer,
  StatIcon,
  StatContent,
  StatValue,
  StatLabel,
  StatChange,
} from '../../../styles/dashboard/dashboardStyles';

interface StatCardProps {
  /** Icône (emoji) */
  icon: string;
  /** Valeur principale */
  value: string | number;
  /** Label de la stat */
  label: string;
  /** Changement par rapport à la période précédente */
  change?: string;
  /** Le changement est-il positif? */
  isPositive?: boolean;
}

/**
 * Card de statistique pour le dashboard
 */
const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  change,
  isPositive = true,
}) => {
  return (
    <StatCardContainer>
      <StatIcon>{icon}</StatIcon>
      
      <StatContent>
        <StatValue>{value}</StatValue>
        <StatLabel>{label}</StatLabel>
      </StatContent>
      
      {change && (
        <StatChange positive={isPositive}>
          {change}
        </StatChange>
      )}
    </StatCardContainer>
  );
};

export default StatCard;