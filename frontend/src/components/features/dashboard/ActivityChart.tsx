// Graphique d'activité   

import React from 'react';
import { Tooltip } from '@mui/material';
import {
  DashboardCard,
  CardTitle,
  ChartPlaceholder,
  BarChart,
  Bar,
  BarLabel,
} from '../../../styles/dashboard/dashboardStyles';

/**
 * Type pour une donnée de jour
 */
export interface DayData {
  day: string;
  value: number;
  isToday?: boolean;
}

interface ActivityChartProps {
  /** Titre du graphique */
  title?: string;
  /** Icône du titre */
  titleIcon?: string;
  /** Données des jours */
  data: DayData[];
  /** Valeur maximale (pour calculer les hauteurs) */
  maxValue?: number;
  /** Callback au clic sur une bar */
  onBarClick?: (day: DayData) => void;
}

/**
 * Graphique d'activité quotidienne
 */
const ActivityChart: React.FC<ActivityChartProps> = ({
  title = 'Activité quotidienne',
  titleIcon = '📊',
  data,
  maxValue,
  onBarClick,
}) => {
  // Calcul de la valeur max si non fournie
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <DashboardCard>
      <CardTitle>
        {titleIcon} {title}
      </CardTitle>
      
      <ChartPlaceholder>
        <BarChart>
          {data.map((item, index) => {
            const heightPercent = (item.value / max) * 100;
            
            return (
              <Tooltip
                key={index}
                title={`${item.day}: ${item.value} activités`}
                arrow
              >
                <Bar
                  isToday={item.isToday}
                  sx={{ height: `${heightPercent}%` }}
                  onClick={() => onBarClick?.(item)}
                >
                  <BarLabel>{item.day}</BarLabel>
                </Bar>
              </Tooltip>
            );
          })}
        </BarChart>
      </ChartPlaceholder>
    </DashboardCard>
  );
};

export default ActivityChart;