import React from 'react';
import {
  BadgeProgressIndicatorContainer,
  ProgressRingSvg,
  ProgressRingBg,
  ProgressRingFill,
  ProgressRingText,
} from '../../../styles/badges/BadgesStyles';

/**
 * Type de couleur pour l'indicateur
 */
export type ProgressColorType = 'primary' | 'gold' | 'silver' | 'bronze' | 'success';

interface BadgeProgressIndicatorProps {
  /** Valeur actuelle */
  current: number;
  /** Valeur maximale */
  max: number;
  /** Taille de l'indicateur */
  size?: 'sm' | 'md' | 'lg';
  /** Couleur de la progression */
  color?: ProgressColorType;
  /** Afficher le pourcentage au lieu de current/max */
  showPercentage?: boolean;
  /** Format personnalisé du texte */
  formatText?: (current: number, max: number) => string;
}

/**
 * Indicateur de progression circulaire pour les badges
 */
const BadgeProgressIndicator: React.FC<BadgeProgressIndicatorProps> = ({
  current,
  max,
  size = 'md',
  color = 'primary',
  showPercentage = false,
  formatText,
}) => {
  // Calcul du pourcentage (0-100)
  const percentage = Math.min(Math.round((current / max) * 100), 100);

  // Texte à afficher
  const displayText = formatText
    ? formatText(current, max)
    : showPercentage
    ? `${percentage}%`
    : `${current}/${max}`;

  // Le cercle SVG utilise un viewBox de 36x36 avec un rayon de 15.9155
  // pour que la circonférence soit approximativement 100
  const radius = 15.9155;
  const center = 18;

  return (
    <BadgeProgressIndicatorContainer size={size} value={0}>
      <ProgressRingSvg viewBox="0 0 36 36">
        {/* Cercle de fond */}
        <ProgressRingBg
          cx={center}
          cy={center}
          r={radius}
        />
        {/* Cercle de progression */}
        <ProgressRingFill
          cx={center}
          cy={center}
          r={radius}
          progress={percentage}
          color={color}
        />
      </ProgressRingSvg>
      {/* Texte au centre */}
      <ProgressRingText>{displayText}</ProgressRingText>
    </BadgeProgressIndicatorContainer>
  );
};

export default BadgeProgressIndicator;