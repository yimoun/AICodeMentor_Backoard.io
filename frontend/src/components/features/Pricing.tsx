import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import { Button } from '../ui/Button';


import {
  PricingSection,
  PricingTitle,
  PricingHighlight,
  PricingSubtitle,
  PricingToggle,
  ToggleLabel,
  SaveBadge,
  BillingSwitch,
  PricingGrid,
  PricingCard,
  PopularBadge,
  PlanHeader,
  PlanName,
  PlanPrice,
  Price,
  PricePeriod,
  YearlyTotal,
  PlanCredits,
  CreditsAmount,
  PlanFeatures,
  PlanFeatureItem,
  CheckIcon,
  CrossIcon,
  CreditsInfoSection,
  CreditsInfoTitle,
  CreditsTable,
  CreditItem,
  CreditAction,
  CreditCost,
  CreditsNote,
} from '../../styles/PricingStyles';


export interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}


export interface PricingPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  yearlyTotal?: number;
  credits: number;
  features: PlanFeature[];
  popular?: boolean;
  ctaText: string;
  ctaVariant?: 'primary' | 'outline';
}

export interface CreditPriceItem {
  action: string;
  cost: number;
}

interface PricingProps {
  /** Titre de la section */
  title?: string;
  /** Mot à highlight dans le titre */
  titleHighlight?: string;
  /** Sous-titre */
  subtitle?: string;
  /** Liste des plans */
  plans?: PricingPlan[];
  /** Texte label mensuel */
  monthlyLabel?: string;
  /** Texte label annuel */
  yearlyLabel?: string;
  /** Pourcentage d'économie annuel */
  yearlySavings?: string;
  /** Afficher la section crédits */
  showCreditsInfo?: boolean;
  /** Items de crédit */
  creditItems?: CreditPriceItem[];
  /** Note des crédits */
  creditsNote?: string;
  /** Lien de la note */
  creditsNoteLink?: string;
  /** ID pour le scroll anchor */
  id?: string;
  /** Callback lors du choix d'un plan */
  onSelectPlan?: (planId: string, isYearly: boolean) => void;
}

/**
 * Plans par défaut
 */
const defaultPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    priceMonthly: 0,
    priceYearly: 0,
    credits: 50,
    features: [
      { text: '2 skills maximum', included: true },
      { text: '3 sessions/jour', included: true },
      { text: 'Test de niveau', included: true },
      { text: 'Suivi de progression', included: true },
      { text: 'Code review', included: false },
      { text: 'LLMs premium', included: false },
    ],
    ctaText: 'Commencer',
    ctaVariant: 'outline',
  },
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 9.99,
    priceYearly: 8.33,
    yearlyTotal: 99,
    credits: 500,
    features: [
      { text: '5 skills', included: true },
      { text: '10 sessions/jour', included: true },
      { text: 'Code review', included: true },
      { text: 'Spaced repetition', included: true },
      { text: 'GPT-3.5 + Mistral', included: true },
      { text: 'Analytics avancés', included: false },
    ],
    ctaText: 'Choisir Starter',
    ctaVariant: 'primary',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 19.99,
    priceYearly: 16.66,
    yearlyTotal: 199,
    credits: 2000,
    features: [
      { text: 'Skills illimités', included: true },
      { text: 'Sessions illimitées', included: true },
      { text: 'Code review avancé', included: true },
      { text: 'Claude + GPT-4', included: true, highlight: true },
      { text: 'Parcours personnalisés', included: true },
      { text: 'Analytics complets', included: true },
    ],
    popular: true,
    ctaText: 'Choisir Pro',
    ctaVariant: 'primary',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 49.99,
    priceYearly: 41.66,
    yearlyTotal: 499,
    credits: 10000,
    features: [
      { text: 'Tout de Pro', included: true },
      { text: 'Gestion d\'équipe', included: true },
      { text: 'Accès API', included: true },
      { text: 'SLA garanti', included: true },
      { text: 'Support prioritaire', included: true },
      { text: 'Export des données', included: true },
    ],
    ctaText: 'Contacter',
    ctaVariant: 'outline',
  },
];

/**
 * Items de crédit par défaut
 */
const defaultCreditItems: CreditPriceItem[] = [
  { action: 'Question simple', cost: 1 },
  { action: 'Explication détaillée', cost: 3 },
  { action: 'Code review', cost: 5 },
  { action: 'Session debugging', cost: 10 },
];

/**
 * Formatte le prix
 */
const formatPrice = (price: number): string => {
  if (price === 0) return '$0';
  return `$${price.toFixed(2).replace('.00', '')}`;
};

/**
 * Formatte le coût en crédits
 */
const formatCreditCost = (cost: number): string => {
  return `${cost} crédit${cost > 1 ? 's' : ''}`;
};

/**
 * Section Pricing de la landing page
 */
const Pricing: React.FC<PricingProps> = ({
  title = 'Des tarifs',
  titleHighlight = 'simples',
  subtitle = 'Commencez gratuitement, évoluez selon vos besoins',
  plans = defaultPlans,
  monthlyLabel = 'Mensuel',
  yearlyLabel = 'Annuel',
  yearlySavings = '-17%',
  showCreditsInfo = true,
  creditItems = defaultCreditItems,
  creditsNote = 'Besoin de plus ?',
  creditsNoteLink = '/pricing',
  id = 'pricing',
  onSelectPlan,
}) => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  /**
   * Gère le changement de billing period
   */
  const handleToggle = () => {
    setIsYearly(!isYearly);
  };

  /**
   * Gère le clic sur un plan
   */
  const handleSelectPlan = (planId: string) => {
    if (onSelectPlan) {
      onSelectPlan(planId, isYearly);
    } else {
      // Navigation par défaut vers signup avec le plan
      navigate(`/signup?plan=${planId}&billing=${isYearly ? 'yearly' : 'monthly'}`);
    }
  };

  return (
    <PricingSection as="section" id={id}>
      {/* Titre */}
      <PricingTitle variant="h2">
        {title} <PricingHighlight>{titleHighlight}</PricingHighlight>
      </PricingTitle>

      {/* Sous-titre */}
      <PricingSubtitle>{subtitle}</PricingSubtitle>

      {/* Toggle Mensuel/Annuel */}
      <PricingToggle>
        <ToggleLabel 
          active={!isYearly} 
          onClick={() => setIsYearly(false)}
        >
          {monthlyLabel}
        </ToggleLabel>
        
        <BillingSwitch 
          checked={isYearly} 
          onChange={handleToggle}
          inputProps={{ 'aria-label': 'Toggle billing period' }}
        />
        
        <ToggleLabel 
          active={isYearly} 
          onClick={() => setIsYearly(true)}
        >
          {yearlyLabel}
          {yearlySavings && (
            <SaveBadge label={yearlySavings} size="small" />
          )}
        </ToggleLabel>
      </PricingToggle>

      {/* Grille des plans */}
      <PricingGrid>
        {plans.map((plan) => (
          <PricingCard key={plan.id} popular={plan.popular}>
            {/* Badge populaire */}
            {plan.popular && (
              <PopularBadge>Le plus populaire</PopularBadge>
            )}

            {/* Header */}
            <PlanHeader>
              <PlanName>{plan.name}</PlanName>
              
              <PlanPrice>
                <Price>
                  {formatPrice(isYearly ? plan.priceYearly : plan.priceMonthly)}
                </Price>
                <PricePeriod>/mois</PricePeriod>
              </PlanPrice>

              {/* Total annuel */}
              {isYearly && plan.yearlyTotal && plan.yearlyTotal > 0 && (
                <YearlyTotal>Facturé ${plan.yearlyTotal}/an</YearlyTotal>
              )}
            </PlanHeader>

            {/* Crédits */}
            <PlanCredits>
              <CreditsAmount>{plan.credits.toLocaleString()}</CreditsAmount> crédits/mois
            </PlanCredits>

            {/* Features */}
            <PlanFeatures>
              {plan.features.map((feature, index) => (
                <PlanFeatureItem key={index} disabled={!feature.included}>
                  {feature.included ? (
                    <CheckIcon>✓</CheckIcon>
                  ) : (
                    <CrossIcon>✗</CrossIcon>
                  )}
                  {feature.highlight ? (
                    <strong>{feature.text}</strong>
                  ) : (
                    feature.text
                  )}
                </PlanFeatureItem>
              ))}
            </PlanFeatures>

            {/* CTA Button */}
            <Button
              variant={plan.ctaVariant || 'primary'}
              size="lg"
              onClick={() => handleSelectPlan(plan.id)}
            >
              {plan.ctaText}
            </Button>
          </PricingCard>
        ))}
      </PricingGrid>

      {/* Section info crédits */}
      {showCreditsInfo && (
        <CreditsInfoSection>
          <CreditsInfoTitle>
            💡 Comment fonctionnent les crédits ?
          </CreditsInfoTitle>

          <CreditsTable>
            {creditItems.map((item, index) => (
              <CreditItem key={index}>
                <CreditAction>{item.action}</CreditAction>
                <CreditCost>{formatCreditCost(item.cost)}</CreditCost>
              </CreditItem>
            ))}
          </CreditsTable>

          <CreditsNote>
            {creditsNote}{' '}
            <Link component={RouterLink} to={creditsNoteLink}>
              Achetez des crédits supplémentaires
            </Link>
          </CreditsNote>
        </CreditsInfoSection>
      )}
    </PricingSection>
  );
};

export default Pricing;