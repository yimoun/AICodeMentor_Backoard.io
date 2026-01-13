// Zone principale

import React from 'react';
import SubscriptionCard, { type PlanType, type SubscriptionDetail } from './SubscriptionCard';
import CreditPacksCard, { type CreditPack } from './CreditPacksCard';
import ProfileCard, { type ProfileData } from './ProfileCard';
import PreferencesCard, { type PreferenceData } from './PreferencesCard';
import {
  SettingsMainContainer,
  SettingsHeader,
  SettingsTitle,
  SettingsGrid,
} from '../../../styles/settings/SettingsStyles';

interface SettingsMainProps {
  /** Titre de la page */
  title?: string;
  
  // Subscription
  /** Plan actuel */
  plan: PlanType;
  /** Label du plan */
  planLabel: string;
  /** Détails de l'abonnement */
  subscriptionDetails: SubscriptionDetail[];
  /** Callback changer de plan */
  onChangePlan?: () => void;
  /** Callback gérer le paiement */
  onManagePayment?: () => void;
  
  // Credit Packs
  /** Packs de crédits disponibles */
  creditPacks: CreditPack[];
  /** Callback achat de crédits */
  onPurchaseCredits: (packId: string) => void;
  /** État de chargement de l'achat */
  isPurchasing?: boolean;
  
  // Profile
  /** Données du profil */
  profileData: ProfileData;
  /** Callback sauvegarde du profil */
  onSaveProfile: (data: ProfileData) => void;
  /** État de chargement du profil */
  isSavingProfile?: boolean;
  
  // Preferences
  /** Liste des préférences */
  preferences: PreferenceData[];
  /** Callback changement de préférence */
  onPreferenceChange: (preferenceId: string, enabled: boolean) => void;
}

/**
 * Zone principale des paramètres
 */
const SettingsMain: React.FC<SettingsMainProps> = ({
  title = 'Paramètres',
  plan,
  planLabel,
  subscriptionDetails,
  onChangePlan,
  onManagePayment,
  creditPacks,
  onPurchaseCredits,
  isPurchasing = false,
  profileData,
  onSaveProfile,
  isSavingProfile = false,
  preferences,
  onPreferenceChange,
}) => {
  return (
    <SettingsMainContainer>
      {/* Header */}
      <SettingsHeader>
        <SettingsTitle>{title}</SettingsTitle>
      </SettingsHeader>

      {/* Grid */}
      <SettingsGrid>
        {/* Subscription Card */}
        <SubscriptionCard
          plan={plan}
          planLabel={planLabel}
          details={subscriptionDetails}
          onChangePlan={onChangePlan}
          onManagePayment={onManagePayment}
        />

        {/* Credit Packs Card */}
        <CreditPacksCard
          packs={creditPacks}
          onPurchase={onPurchaseCredits}
          isLoading={isPurchasing}
        />

        {/* Profile Card */}
        <ProfileCard
          initialData={profileData}
          onSave={onSaveProfile}
          isLoading={isSavingProfile}
        />

        {/* Preferences Card */}
        <PreferencesCard
          preferences={preferences}
          onPreferenceChange={onPreferenceChange}
        />
      </SettingsGrid>
    </SettingsMainContainer>
  );
};

export default SettingsMain;