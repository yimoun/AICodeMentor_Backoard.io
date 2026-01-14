import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUser';
import { useAppContext } from '../layouts/AppLayout';
import SettingsMain from '../features/settings/SettingsMain';
import { type PlanType, type SubscriptionDetail } from '../features/settings/SubscriptionCard';
import { type CreditPack } from '../features/settings/CreditPacksCard';
import { type ProfileData } from '../features/settings/ProfileCard';
import { type PreferenceData } from '../features/settings/PreferencesCard';
import UserDS from '../../data_services/UserDS';

/**
 * Packs de crédits par défaut
 */
const defaultCreditPacks: CreditPack[] = [
  { id: 'pack-100', amount: 100, price: 2.99 },
  { id: 'pack-500', amount: 500, price: 9.99, savings: 'Économisez 33%', popular: true },
  { id: 'pack-1000', amount: 1000, price: 14.99, savings: 'Économisez 50%' },
];

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
 * Page Settings avec contextes
 */
const SettingsContent: React.FC = () => {
  const navigate = useNavigate();
  
  // Contextes
  const { user, updateUser } = useUser();
  const { credits, updateCredits } = useAppContext();
  
  // State
  const [preferences, setPreferences] = useState<PreferenceData[]>(defaultPreferences);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  /**
   * Plan de l'utilisateur
   */
  const plan: PlanType = (user?.plan as PlanType) || 'free';
  const planLabel = getPlanLabel(plan);

  /**
   * Détails de l'abonnement
   */
  const subscriptionDetails = useMemo<SubscriptionDetail[]>(() => [
    { label: 'Plan actuel', value: `${planLabel} - ${getPlanPrice(plan)}` },
    { label: 'Prochain renouvellement', value: '15 février 2026' },
    { label: 'Méthode de paiement', value: '•••• 4242' },
  ], [plan, planLabel]);

  /**
   * Données du profil depuis le contexte utilisateur
   */
  const profileData = useMemo<ProfileData>(() => ({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
  }), [user]);

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
      const pack = defaultCreditPacks.find((p) => p.id === packId);
      if (!pack) return;

      // TODO: Appeler l'API Stripe pour créer une session de paiement
      console.log('Purchase credits:', packId, pack.amount);
      
      // Simuler un délai et un achat réussi
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // ✅ Mettre à jour les crédits via le contexte
      updateCredits(credits.current + pack.amount);
      
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
      // Appeler l'API pour sauvegarder le profil
      await UserDS.save({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
      });
      
      // ✅ Mettre à jour le contexte utilisateur
      updateUser({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
      });
      
      console.log('Profile saved successfully');
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
      document.documentElement.setAttribute('data-theme', enabled ? 'dark' : 'light');
    }
  };

  return (
    <SettingsMain
      title="Paramètres"
      plan={plan}
      planLabel={planLabel}
      subscriptionDetails={subscriptionDetails}
      onChangePlan={handleChangePlan}
      onManagePayment={handleManagePayment}
      creditPacks={defaultCreditPacks}
      onPurchaseCredits={handlePurchaseCredits}
      isPurchasing={isPurchasing}
      profileData={profileData}
      onSaveProfile={handleSaveProfile}
      isSavingProfile={isSavingProfile}
      preferences={preferences}
      onPreferenceChange={handlePreferenceChange}
    />
  );
};

/**
 * Obtenir le label du plan
 */
const getPlanLabel = (plan: PlanType): string => {
  switch (plan) {
    case 'starter':
      return 'Starter';
    case 'pro':
      return 'Pro';
    case 'enterprise':
      return 'Enterprise';
    default:
      return 'Gratuit';
  }
};

/**
 * Obtenir le prix du plan
 */
const getPlanPrice = (plan: PlanType): string => {
  switch (plan) {
    case 'starter':
      return '$9.99/mois';
    case 'pro':
      return '$19.99/mois';
    case 'enterprise':
      return '$49.99/mois';
    default:
      return 'Gratuit';
  }
};

export default SettingsContent;