import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatSidebar, { type UserData, type CreditsData } from '../components/features/chat/ChatSidebar.tsx';
import DashboardMain, { type StatData, type PeriodType } from '../components/features/dashboard/DashboardMain.tsx';
import { type DayData } from '../components/features/dashboard/ActivityChart';
import { type SkillData } from '../components/features/dashboard/SkillProgressCard';
import { type ReviewTopicData } from '../components/features/dashboard/ReviewListCard';
import { type BadgeData } from '../components/features/dashboard/BadgesCard';
import { type UsageData } from '../components/features/dashboard/CreditsUsageCard';
import { type SkillProgressData } from '../components/features/chat/SkillsProgress';
import { ChatLayoutContainer } from '../styles/chat/ChatLayoutStyles';

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
 * Skills sidebar par défaut
 */
const defaultSidebarSkills: SkillProgressData[] = [
  { id: 'python', name: 'Python', icon: '🐍', level: 'Intermédiaire', progress: 65 },
  { id: 'fastapi', name: 'FastAPI', icon: '⚡', level: 'Débutant', progress: 25 },
  { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', level: 'Intermédiaire', progress: 55 },
];

/**
 * Stats par défaut
 */
const defaultStats: StatData[] = [
  { icon: '🔥', value: 7, label: 'Jours de streak', change: '+2 vs semaine dernière', isPositive: true },
  { icon: '💬', value: 23, label: 'Questions posées', change: '+15%', isPositive: true },
  { icon: '⏱️', value: '2h 45m', label: "Temps d'apprentissage", change: '+30min', isPositive: true },
  { icon: '📈', value: '+12%', label: 'Progression globale' },
];

/**
 * Données d'activité par défaut
 */
const defaultActivityData: DayData[] = [
  { day: 'Lun', value: 40 },
  { day: 'Mar', value: 60 },
  { day: 'Mer', value: 80 },
  { day: 'Jeu', value: 45 },
  { day: 'Ven', value: 90 },
  { day: 'Sam', value: 70 },
  { day: 'Auj', value: 55, isToday: true },
];

/**
 * Skills dashboard par défaut
 */
const defaultDashboardSkills: SkillData[] = [
  { id: 'python', name: 'Python', icon: '🐍', level: 'intermediate', levelLabel: 'Intermédiaire', currentXp: 650, maxXp: 1000 },
  { id: 'fastapi', name: 'FastAPI', icon: '⚡', level: 'beginner', levelLabel: 'Débutant', currentXp: 125, maxXp: 500 },
  { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', level: 'intermediate', levelLabel: 'Intermédiaire', currentXp: 550, maxXp: 1000 },
];

/**
 * Topics à réviser par défaut
 */
const defaultReviewTopics: ReviewTopicData[] = [
  { id: '1', topic: 'Async/Await (Python)', reason: 'Maîtrise: 40% - Révision recommandée', urgent: true },
  { id: '2', topic: 'Décorateurs (Python)', reason: 'Vu il y a 5 jours' },
  { id: '3', topic: 'Dependency Injection (FastAPI)', reason: 'Vu il y a 3 jours' },
];

/**
 * Badges par défaut
 */
const defaultBadges: BadgeData[] = [
  { id: '1', name: 'Streak 7 jours', icon: '🔥', earned: true },
  { id: '2', name: 'Python Explorer', icon: '🐍', earned: true },
  { id: '3', name: '100 questions', icon: '🎯', earned: false, progress: '23/100' },
  { id: '4', name: 'FastAPI Master', icon: '⚡', earned: false, progress: 'Niveau avancé requis' },
];

/**
 * Utilisation des crédits par défaut
 */
const defaultCreditsUsage: UsageData = {
  questions: 45,
  reviews: 30,
  debug: 25,
};

/**
 * Page Dashboard
 */
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<PeriodType>('week');

  /**
   * Change la période
   */
  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod);
    // TODO: Recharger les données pour la nouvelle période
  };

  /**
   * Réviser un topic
   */
  const handleReview = (topicId: string) => {
    // TODO: Naviguer vers le chat avec ce topic
    console.log('Review topic:', topicId);
    navigate('/chat');
  };

  /**
   * Clic sur un skill
   */
  const handleSkillClick = (skillId: string) => {
    // TODO: Naviguer vers la page du skill
    console.log('Skill clicked:', skillId);
  };

  /**
   * Clic sur un badge
   */
  const handleBadgeClick = (badgeId: string) => {
    // TODO: Afficher les détails du badge
    console.log('Badge clicked:', badgeId);
  };

  /**
   * Acheter des crédits
   */
  const handleBuyCredits = () => {
    navigate('/settings');
  };

  return (
    <ChatLayoutContainer>
      {/* Sidebar (réutilisée du chat) */}
      {/* <ChatSidebar
        user={defaultUser}
        credits={defaultCredits}
        skills={defaultSidebarSkills}
        streakCount={7}
        onBuyCredits={handleBuyCredits}
        onSkillClick={handleSkillClick}
      /> */}

      {/* Zone principale */}
      <DashboardMain
        title="Dashboard"
        subtitle="Votre progression cette semaine"
        period={period}
        onPeriodChange={handlePeriodChange}
        stats={defaultStats}
        activityData={defaultActivityData}
        skills={defaultDashboardSkills}
        reviewTopics={defaultReviewTopics}
        badges={defaultBadges}
        creditsUsage={defaultCreditsUsage}
        creditsUsed={153}
        creditsRemaining={1847}
        onReview={handleReview}
        onSkillClick={handleSkillClick}
        onBadgeClick={handleBadgeClick}
      />
    </ChatLayoutContainer>
  );
};

export default DashboardPage;