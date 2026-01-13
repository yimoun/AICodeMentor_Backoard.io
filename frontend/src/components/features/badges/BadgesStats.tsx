import React from 'react';
import {
  BadgesStatsGrid,
  StatCard,
  StatIcon,
  StatValue,
  StatLabel,
} from '../../../styles/badges/BadgesStyles';
import { Box } from '@mui/material';

/**
 * Type pour une stat
 */
export interface BadgeStatData {
  id: string;
  icon: string;
  value: string | number;
  label: string;
}

interface BadgesStatsProps {
  /** Liste des stats */
  stats: BadgeStatData[];
}

/**
 * Grille de statistiques des badges
 */
const BadgesStats: React.FC<BadgesStatsProps> = ({ stats }) => {
  return (
    <BadgesStatsGrid>
      {stats.map((stat) => (
        <StatCard key={stat.id}>
          <StatIcon>{stat.icon}</StatIcon>
          <Box>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </Box>
        </StatCard>
      ))}
    </BadgesStatsGrid>
  );
};

export default BadgesStats;