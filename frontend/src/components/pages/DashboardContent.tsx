import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUser';
import { useAppContext } from '../layouts/AppLayout';
import DashboardMain, { type StatData, type PeriodType } from '../features/dashboard/DashboardMain';
import { type DayData } from '../features/dashboard/ActivityChart';
import { type SkillData } from '../features/dashboard/SkillProgressCard';
import { type ReviewTopicData } from '../features/dashboard/ReviewListCard';
import { type BadgeData } from '../features/dashboard/BadgesCard';
import { type UsageData } from '../features/dashboard/CreditsUsageCard';

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
 * Page Dashboard avec contextes
 */
const DashboardContent: React.FC = () => {
  const navigate = useNavigate();
  
  // Contextes
  const { user } = useUser();
  const { credits, sidebarSkills, streakDays } = useAppContext();
  
  const [period, setPeriod] = useState<PeriodType>('week');

  /**
   * Générer les stats depuis les contextes
   */
  const stats = useMemo<StatData[]>(() => [
    { 
      icon: '🔥', 
      value: streakDays || 0, 
      label: 'Jours de streak', 
      change: '+2 vs semaine dernière', 
      isPositive: true 
    },
    { 
      icon: '💬', 
      value: 23, // TODO: Charger depuis l'API
      label: 'Questions posées', 
      change: '+15%', 
      isPositive: true 
    },
    { 
      icon: '⏱️', 
      value: '2h 45m', // TODO: Charger depuis l'API
      label: "Temps d'apprentissage", 
      change: '+30min', 
      isPositive: true 
    },
    { 
      icon: '📈', 
      value: '+12%', 
      label: 'Progression globale' 
    },
  ], [streakDays]);

  /**
   * Convertir les skills de la sidebar en skills du dashboard
   */
  const dashboardSkills = useMemo<SkillData[]>(() => {
    if (!sidebarSkills || sidebarSkills.length === 0) {
      // Skills par défaut si aucun n'est chargé
      return [
        { id: 'python', name: 'Python', icon: '🐍', level: 'intermediate', levelLabel: 'Intermédiaire', currentXp: 650, maxXp: 1000 },
        { id: 'fastapi', name: 'FastAPI', icon: '⚡', level: 'beginner', levelLabel: 'Débutant', currentXp: 125, maxXp: 500 },
        { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', level: 'intermediate', levelLabel: 'Intermédiaire', currentXp: 550, maxXp: 1000 },
      ];
    }

    return sidebarSkills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      icon: skill.icon,
      level: getLevelFromProgress(skill.progress),
      levelLabel: skill.level,
      currentXp: Math.round((skill.progress / 100) * 1000),
      maxXp: 1000,
    }));
  }, [sidebarSkills]);

  /**
   * Calculs des crédits
   */
  const creditsUsed = credits.total - credits.current;
  const creditsRemaining = credits.current;

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
  const handleReview = () => {
    navigate('/app/chat');
  };

  /**
   * Clic sur un skill
   */
  const handleSkillClick = (skillId: string) => {
    navigate(`/app/chat?skill=${skillId}`);
  };

  /**
   * Clic sur un badge
   */
  const handleBadgeClick = () => {
    navigate('/app/badges');
  };

  return (
    <DashboardMain
      title={`Bonjour, ${user?.first_name || 'Apprenant'} ! 👋`}
      subtitle="Votre progression cette semaine"
      period={period}
      onPeriodChange={handlePeriodChange}
      stats={stats}
      activityData={defaultActivityData}
      skills={dashboardSkills}
      reviewTopics={defaultReviewTopics}
      badges={defaultBadges}
      creditsUsage={defaultCreditsUsage}
      creditsUsed={creditsUsed}
      creditsRemaining={creditsRemaining}
      onReview={handleReview}
      onSkillClick={handleSkillClick}
      onBadgeClick={handleBadgeClick}
    />
  );
};

/**
 * Obtenir le niveau depuis le pourcentage de progression
 */
const getLevelFromProgress = (progress: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' => {
  if (progress >= 80) return 'expert';
  if (progress >= 60) return 'advanced';
  if (progress >= 30) return 'intermediate';
  return 'beginner';
};

export default DashboardContent;