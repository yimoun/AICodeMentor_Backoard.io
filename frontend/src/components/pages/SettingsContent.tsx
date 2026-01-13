import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatSidebar, { type UserData, type CreditsData } from '../features/chat/ChatSidebar';
import SettingsMain from '../features/settings/SettingsMain';
import { type PlanType, type SubscriptionDetail } from '../features/settings/SubscriptionCard';
import { type CreditPack } from '../features/settings/CreditPacksCard';
import { type ProfileData } from '../features/settings/ProfileCard';
import { type PreferenceData } from '../features/settings/PreferencesCard';
import { ChatLayoutContainer } from '../../styles/chat/ChatLayoutStyles';

/**
 * Données utilisateur par défaut
 */
const defaultUser: UserData = {
  name: 'Jordan T.',
  initials: 'JT',
  plan: 'Plan Pro',
};

/**
 * Crédits par défaut
 */
const defaultCredits: CreditsData = {
  current: 1847,
  total: 2000,
};

/**
 * Détails de l'abonnement par défaut
 */
const defaultSubscriptionDetails: SubscriptionDetail[] = [
  { label: 'Plan actuel', value: 'Pro - $19.99/mois' },
  { label: 'Prochain renouvellement', value: '15 février 2026' },
  { label: 'Méthode de paiement', value: '•••• 4242' },
];

/**
 * Packs de crédits par défaut
 */
const defaultCreditPacks: CreditPack[] = [
  { id: 'pack-100', amount: 100, price: 2.99 },
  { id: 'pack-500', amount: 500, price: 9.99, savings: 'Économisez 33%', popular: true },
  { id: 'pack-1000', amount: 1000, price: 14.99, savings: 'Économisez 50%' },
];

/**
 * Données du profil par défaut
 */
const defaultProfileData: ProfileData = {
  firstName: 'Jordan',
  lastName: 'Takam',
  email: 'jordan@example.com',
};

/**
 * Préférences par défaut
 */
const defaultPreferences: PreferenceData[] = [
  {
    id: 'daily-reminders',
    name: 'Rappels quotidiens',
    description: 'Recevoir un rappel pour maintenir votre streak',
    enabled: true,
  },
  {
    id: 'progress-emails',
    name: 'Emails de progression',
    description: 'Résumé hebdomadaire de votre progression',
    enabled: true,
  },
  {
    id: 'dark-mode',
    name: 'Mode sombre',
    description: 'Activer le thème sombre',
    enabled: false,
  },
];

/**
 * Page Settings
 */
const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [preferences, setPreferences] = useState<PreferenceData[]>(defaultPreferences);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  /**
   * Changer de plan
   */
  const handleChangePlan = () => {
    navigate('/pricing');
  };

  /**
   * Gérer le paiement
   */
  const handleManagePayment = () => {
    // TODO: Ouvrir Stripe customer portal
    console.log('Manage payment');
  };

  /**
   * Acheter des crédits
   */
  const handlePurchaseCredits = async (packId: string) => {
    setIsPurchasing(true);
    
    try {
      // TODO: Appeler l'API Stripe pour créer une session de paiement
      console.log('Purchase credits:', packId);
      
      // Simuler un délai
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // TODO: Rediriger vers Stripe Checkout
    } catch (error) {
      console.error('Error purchasing credits:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  /**
   * Sauvegarder le profil
   */
  const handleSaveProfile = async (data: ProfileData) => {
    setIsSavingProfile(true);
    
    try {
      // TODO: Appeler l'API pour sauvegarder le profil
      console.log('Save profile:', data);
      
      // Simuler un délai
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  /**
   * Changer une préférence
   */
  const handlePreferenceChange = (preferenceId: string, enabled: boolean) => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.id === preferenceId ? { ...pref, enabled } : pref
      )
    );
    
    // TODO: Appeler l'API pour sauvegarder la préférence
    console.log('Preference changed:', preferenceId, enabled);
    
    // Gérer le mode sombre
    if (preferenceId === 'dark-mode') {
      // TODO: Appliquer le thème sombre
      document.documentElement.setAttribute('data-theme', enabled ? 'dark' : 'light');
    }
  };

  /**
   * Acheter des crédits depuis la sidebar
   */
  const handleBuyCredits = () => {
    // Scroll vers la section d'achat de crédits
    const creditsSection = document.querySelector('[data-section="credits"]');
    creditsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
   
      <SettingsMain
        title="Paramètres"
        plan="pro"
        planLabel="Pro"
        subscriptionDetails={defaultSubscriptionDetails}
        onChangePlan={handleChangePlan}
        onManagePayment={handleManagePayment}
        creditPacks={defaultCreditPacks}
        onPurchaseCredits={handlePurchaseCredits}
        isPurchasing={isPurchasing}
        profileData={defaultProfileData}
        onSaveProfile={handleSaveProfile}
        isSavingProfile={isSavingProfile}
        preferences={preferences}
        onPreferenceChange={handlePreferenceChange}
      />
   
  );
};

export default SettingsPage;