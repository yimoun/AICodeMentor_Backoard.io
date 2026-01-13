import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import {
  SettingsCard,
  CardTitle,
  CardDescription,
  CreditPacksContainer,
  CreditPackLabel,
  CreditPackInput,
  PackCard,
  PackBadge,
  PackAmount,
  PackPrice,
  PackSavings,
} from '../../../styles/settings/SettingsStyles';


/**
 * Type pour un pack de crédits
 */
export interface CreditPack {
  id: string;
  amount: number;
  price: number;
  savings?: string;
  popular?: boolean;
}

interface CreditPacksCardProps {
  /** Titre de la card */
  title?: string;
  /** Icône du titre */
  titleIcon?: string;
  /** Description */
  description?: string;
  /** Packs disponibles */
  packs: CreditPack[];
  /** Pack sélectionné par défaut */
  defaultSelectedId?: string;
  /** Callback à l'achat */
  onPurchase: (packId: string) => void;
  /** Texte du bouton d'achat */
  purchaseButtonText?: string;
  /** État de chargement */
  isLoading?: boolean;
}

/**
 * Formate le prix
 */
const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

/**
 * Card d'achat de crédits
 */
const CreditPacksCard: React.FC<CreditPacksCardProps> = ({
  title = 'Acheter des crédits',
  titleIcon = '💎',
  description = 'Besoin de plus de crédits ce mois-ci ?',
  packs,
  defaultSelectedId,
  onPurchase,
  purchaseButtonText = 'Acheter maintenant',
  isLoading = false,
}) => {
  // Trouver le pack popular par défaut ou le premier
  const getDefaultPack = () => {
    if (defaultSelectedId) return defaultSelectedId;
    const popular = packs.find((p) => p.popular);
    return popular?.id || packs[0]?.id || '';
  };

  const [selectedPackId, setSelectedPackId] = useState<string>(getDefaultPack());

  const handlePackSelect = (packId: string) => {
    setSelectedPackId(packId);
  };

  const handlePurchase = () => {
    if (selectedPackId) {
      onPurchase(selectedPackId);
    }
  };

  return (
    <SettingsCard>
      <CardTitle>
        {titleIcon} {title}
      </CardTitle>
      
      {description && <CardDescription>{description}</CardDescription>}

      <CreditPacksContainer>
        {packs.map((pack) => (
          <CreditPackLabel key={pack.id}>
            <CreditPackInput
              type="radio"
              name="credit-pack"
              value={pack.id}
              checked={selectedPackId === pack.id}
              onChange={() => handlePackSelect(pack.id)}
            />
            <PackCard selected={selectedPackId === pack.id}>
              {pack.popular && <PackBadge>Populaire</PackBadge>}
              <PackAmount>{pack.amount}</PackAmount>
              <PackPrice>{formatPrice(pack.price)}</PackPrice>
              {pack.savings && <PackSavings>{pack.savings}</PackSavings>}
            </PackCard>
          </CreditPackLabel>
        ))}
      </CreditPacksContainer>

      <Button
        variant="primary"
        fullWidth
        onClick={handlePurchase}
        isLoading={isLoading}
        disabled={!selectedPackId}
      >
        {purchaseButtonText}
      </Button>
    </SettingsCard>
  );
};

export default CreditPacksCard;