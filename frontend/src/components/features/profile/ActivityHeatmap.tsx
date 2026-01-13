import React from 'react';
import {
  ActivityHeatmapContainer,
  HeatmapGrid,
  HeatmapWeek,
  HeatmapDay,
  HeatmapLegend,
  LegendSquares,
} from '../../../styles/profile/PublicProfileStyles';

/**
 * Type de niveau d'activité (0-4)
 */
export type ActivityLevel = 0 | 1 | 2 | 3 | 4;

/**
 * Données d'un jour
 */
export interface HeatmapDayData {
  level: ActivityLevel;
  isToday?: boolean;
}

/**
 * Données d'une semaine
 */
export interface HeatmapWeekData {
  days: HeatmapDayData[];
}

interface ActivityHeatmapProps {
  /** Données des semaines */
  weeks: HeatmapWeekData[];
  /** Afficher la légende */
  showLegend?: boolean;
}

/**
 * Heatmap d'activité style GitHub
 */
const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  weeks,
  showLegend = true,
}) => {
  return (
    <ActivityHeatmapContainer>
      {/* Grille */}
      <HeatmapGrid>
        {weeks.map((week, weekIndex) => (
          <HeatmapWeek key={weekIndex}>
            {week.days.map((day, dayIndex) => (
              <HeatmapDay
                key={dayIndex}
                level={day.level}
                isToday={day.isToday}
              />
            ))}
          </HeatmapWeek>
        ))}
      </HeatmapGrid>

      {/* Légende */}
      {showLegend && (
        <HeatmapLegend>
          <span>Moins</span>
          <LegendSquares>
            <HeatmapDay level={0} />
            <HeatmapDay level={1} />
            <HeatmapDay level={2} />
            <HeatmapDay level={3} />
            <HeatmapDay level={4} />
          </LegendSquares>
          <span>Plus</span>
        </HeatmapLegend>
      )}
    </ActivityHeatmapContainer>
  );
};

export default ActivityHeatmap;