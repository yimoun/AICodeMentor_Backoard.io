// Zone principale

import React from 'react';
import { MenuItem } from '@mui/material';
import StatCard from './StatCard';
import ActivityChart, { type DayData } from './ActivityChart';
import SkillProgressCard, { type SkillData } from './SkillProgressCard';
import ReviewListCard, { type ReviewTopicData } from './ReviewListCard';
import BadgesCard, { type BadgeData } from './BadgesCard';
import CreditsUsageCard, { type UsageData } from './CreditsUsageCard';
import {
  DashboardMainContainer,
  DashboardHeader,
  DashboardTitle,
  DashboardSubtitle,
  HeaderActions,
  PeriodSelect,
  DashboardGrid,
  StatsRow,
} from '../../../styles/dashboard/DashboardStyles';

/**
 * Type pour une stat
 */
export interface StatData {
  icon: string;
  value: string | number;
  label: string;
  change?: string;
  isPositive?: boolean;
}

/**
 * Période disponible
 */
export type PeriodType = 'week' | 'month' | 'all';

interface DashboardMainProps {
  /** Titre du dashboard */
  title?: string;
  /** Sous-titre */
  subtitle?: string;
  /** Période sélectionnée */
  period: PeriodType;
  /** Callback changement de période */
  onPeriodChange: (period: PeriodType) => void;
  /** Stats à afficher */
  stats: StatData[];
  /** Données d'activité */
  activityData: DayData[];
  /** Skills avec progression */
  skills: SkillData[];
  /** Topics à réviser */
  reviewTopics: ReviewTopicData[];
  /** Badges */
  badges: BadgeData[];
  /** Utilisation des crédits */
  creditsUsage: UsageData;
  /** Crédits utilisés */
  creditsUsed: number;
  /** Crédits restants */
  creditsRemaining: number;
  /** Callback réviser un topic */
  onReview: (topicId: string) => void;
  /** Callback clic sur un skill */
  onSkillClick?: (skillId: string) => void;
  /** Callback clic sur un badge */
  onBadgeClick?: (badgeId: string) => void;
}

/**
 * Labels des périodes
 */
const periodLabels: Record<PeriodType, string> = {
  week: 'Cette semaine',
  month: 'Ce mois',
  all: 'Tout le temps',
};

/**
 * Zone principale du dashboard
 */
const DashboardMain: React.FC<DashboardMainProps> = ({
  title = 'Dashboard',
  subtitle = 'Votre progression cette semaine',
  period,
  onPeriodChange,
  stats,
  activityData,
  skills,
  reviewTopics,
  badges,
  creditsUsage,
  creditsUsed,
  creditsRemaining,
  onReview,
  onSkillClick,
  onBadgeClick,
}) => {
  return (
    <DashboardMainContainer>
      {/* Header */}
      <DashboardHeader>
        <div>
          <DashboardTitle>{title}</DashboardTitle>
          <DashboardSubtitle>{subtitle}</DashboardSubtitle>
        </div>
        
        <HeaderActions>
          <PeriodSelect
            value={period}
            onChange={(e) => onPeriodChange(e.target.value as PeriodType)}
            size="small"
          >
            <MenuItem value="week">{periodLabels.week}</MenuItem>
            <MenuItem value="month">{periodLabels.month}</MenuItem>
            <MenuItem value="all">{periodLabels.all}</MenuItem>
          </PeriodSelect>
        </HeaderActions>
      </DashboardHeader>

      {/* Grid */}
      <DashboardGrid>
        {/* Stats Row */}
        <StatsRow>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              change={stat.change}
              isPositive={stat.isPositive}
            />
          ))}
        </StatsRow>

        {/* Activity Chart */}
        <ActivityChart data={activityData} />

        {/* Skills Progress */}
        <SkillProgressCard
          skills={skills}
          onSkillClick={onSkillClick}
        />

        {/* Topics to Review */}
        <ReviewListCard
          topics={reviewTopics}
          onReview={onReview}
        />

        {/* Badges */}
        <BadgesCard
          badges={badges}
          onBadgeClick={onBadgeClick}
        />

        {/* Credits Usage */}
        <CreditsUsageCard
          usage={creditsUsage}
          creditsUsed={creditsUsed}
          creditsRemaining={creditsRemaining}
        />
      </DashboardGrid>
    </DashboardMainContainer>
  );
};

export default DashboardMain;