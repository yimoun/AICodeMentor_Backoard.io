import React from 'react';
import {
  DashboardCard,
  CardTitle,
} from '../../../styles/dashboard/DashboardStyles';
import {
  CreditsUsageContainer,
  UsageBar,
  UsageSegment,
  UsageLegend,
  LegendItem,
  LegendColor,
  CreditsSummary,
} from '../../../styles/dashboard/DashboardCardsStyles';

/**
 * Type pour les données d'utilisation
 */
export interface UsageData {
  questions: number;
  reviews: number;
  debug: number;
}

interface CreditsUsageCardProps {
  /** Titre de la card */
  title?: string;
  /** Icône du titre */
  titleIcon?: string;
  /** Données d'utilisation (pourcentages) */
  usage: UsageData;
  /** Crédits utilisés */
  creditsUsed: number;
  /** Crédits restants */
  creditsRemaining: number;
  /** Période (ex: "ce mois") */
  period?: string;
}

/**
 * Formate le nombre avec séparateur
 */
const formatNumber = (num: number): string => {
  return num.toLocaleString('fr-FR');
};

/**
 * Card d'utilisation des crédits
 */
const CreditsUsageCard: React.FC<CreditsUsageCardProps> = ({
  title = 'Utilisation des crédits',
  titleIcon = '💎',
  usage,
  creditsUsed,
  creditsRemaining,
  period = 'ce mois',
}) => {
  return (
    <DashboardCard>
      <CardTitle>
        {titleIcon} {title}
      </CardTitle>
      
      <CreditsUsageContainer>
        {/* Barre d'utilisation */}
        <UsageBar>
          <UsageSegment
            variant="questions"
            sx={{ width: `${usage.questions}%` }}
          />
          <UsageSegment
            variant="reviews"
            sx={{ width: `${usage.reviews}%` }}
          />
          <UsageSegment
            variant="debug"
            sx={{ width: `${usage.debug}%` }}
          />
        </UsageBar>
        
        {/* Légende */}
        <UsageLegend>
          <LegendItem>
            <LegendColor variant="questions" />
            <span>Questions ({usage.questions}%)</span>
          </LegendItem>
          <LegendItem>
            <LegendColor variant="reviews" />
            <span>Code reviews ({usage.reviews}%)</span>
          </LegendItem>
          <LegendItem>
            <LegendColor variant="debug" />
            <span>Debugging ({usage.debug}%)</span>
          </LegendItem>
        </UsageLegend>
        
        {/* Résumé */}
        <CreditsSummary>
          <span>{formatNumber(creditsUsed)} crédits utilisés {period}</span>
          <span>{formatNumber(creditsRemaining)} restants</span>
        </CreditsSummary>
      </CreditsUsageContainer>
    </DashboardCard>
  );
};

export default CreditsUsageCard;