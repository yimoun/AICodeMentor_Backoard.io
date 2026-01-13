// widget d'affichage des crédits utilisateur dans le chat

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button';
import {
  CreditsWidgetContainer,
  CreditsHeader,
  CreditsIcon,
  CreditsLabel,
  CreditsAmountContainer,
  CreditsCurrent,
  CreditsTotal,
  CreditsProgressBar,
  CreditsBuyContainer,
} from '../../../styles/chat/CreditsWidgetStyles';

interface CreditsWidgetProps {
  /** Crédits actuels */
  current: number;
  /** Total de crédits du plan */
  total: number;
  /** Icône (emoji) */
  icon?: string;
  /** Label */
  label?: string;
  /** Afficher le bouton d'achat */
  showBuyButton?: boolean;
  /** Texte du bouton d'achat */
  buyButtonText?: string;
  /** Callback au clic sur acheter */
  onBuyClick?: () => void;
}

/**
 * Formate le nombre avec séparateur de milliers
 */
const formatNumber = (num: number): string => {
  return num.toLocaleString('fr-FR');
};

/**
 * Widget affichant les crédits de l'utilisateur
 */
const CreditsWidget: React.FC<CreditsWidgetProps> = ({
  current,
  total,
  icon = '💎',
  label = 'Crédits',
  showBuyButton = true,
  buyButtonText = '+ Acheter',
  onBuyClick,
}) => {
  const navigate = useNavigate();
  
  const percentage = Math.min((current / total) * 100, 100);

  const handleBuyClick = () => {
    if (onBuyClick) {
      onBuyClick();
    } else {
      navigate('/pricing');
    }
  };

  return (
    <CreditsWidgetContainer>
      <CreditsHeader>
        <CreditsIcon>{icon}</CreditsIcon>
        <CreditsLabel>{label}</CreditsLabel>
      </CreditsHeader>

      <CreditsAmountContainer>
        <CreditsCurrent>{formatNumber(current)}</CreditsCurrent>
        <CreditsTotal>/ {formatNumber(total)}</CreditsTotal>
      </CreditsAmountContainer>

      <CreditsProgressBar 
        variant="determinate" 
        value={percentage} 
      />

      {showBuyButton && (
        <CreditsBuyContainer>
          <Button
            variant="outline"
            size="sm"

            onClick={handleBuyClick}
          >
            {buyButtonText}
          </Button>
        </CreditsBuyContainer>
      )}
    </CreditsWidgetContainer>
  );
};

export default CreditsWidget;