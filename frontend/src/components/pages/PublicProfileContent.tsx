import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicProfileMain from '../features/profile/PublicProfileMain';
import { type ProfileStatData } from '../features/profile/ProfileBannerSection';
import { type SkillShowcaseData } from '../features/profile/SkillShowcaseCard';
import { type FeaturedBadgeData } from '../features/profile/FeaturedBadges';
import { type HeatmapWeekData } from '../features/profile/ActivityHeatmap';
import { type EmbedSkillData } from '../features/profile/EmbedSection';
import { useAppContext } from '../layouts/AppLayout';

/**
 * Stats du banner par défaut
 */
const defaultBannerStats: ProfileStatData[] = [
  { icon: '🔥', label: '7 jours de streak' },
  { icon: '⭐', label: '2,450 XP' },
  { icon: '📈', label: 'Top 15%' },
];

/**
 * Skills par défaut
 */
const defaultSkills: SkillShowcaseData[] = [
  {
    id: 'python',
    icon: '🐍',
    name: 'Python',
    level: 'gold',
    levelLabel: 'Intermédiaire',
    score: 78,
    topics: [
      { name: 'POO', status: 'success' },
      { name: 'Fonctions', status: 'success' },
      { name: 'Exceptions', status: 'success' },
      { name: 'Async', status: 'warning' },
    ],
    certDate: 'Déc. 2025',
  },
  {
    id: 'fastapi',
    icon: '⚡',
    name: 'FastAPI',
    level: 'bronze',
    levelLabel: 'Débutant',
    score: 65,
    topics: [
      { name: 'Routes', status: 'success' },
      { name: 'Pydantic', status: 'success' },
      { name: 'Auth', status: 'warning' },
    ],
    certDate: 'Jan. 2026',
  },
  {
    id: 'postgresql',
    icon: '🐘',
    name: 'PostgreSQL',
    level: 'silver',
    levelLabel: 'Intermédiaire',
    score: 72,
    topics: [
      { name: 'Joins', status: 'success' },
      { name: 'Index', status: 'success' },
      { name: 'Subqueries', status: 'success' },
    ],
    certDate: 'Déc. 2025',
  },
];

/**
 * Badges en vedette par défaut
 */
const defaultFeaturedBadges: FeaturedBadgeData[] = [
  { id: 'streak-7', icon: '🔥', label: '7 jours streak' },
  { id: 'early-adopter', icon: '🚀', label: 'Early Adopter' },
  { id: 'questions-50', icon: '💡', label: '50 questions' },
  { id: 'python-explorer', icon: '🐍', label: 'Python Explorer' },
];

/**
 * Données du heatmap par défaut
 */
const defaultActivityWeeks: HeatmapWeekData[] = [
  {
    days: [
      { level: 0 },
      { level: 1 },
      { level: 2 },
      { level: 3 },
      { level: 2 },
      { level: 1 },
      { level: 0 },
    ],
  },
  {
    days: [
      { level: 1 },
      { level: 2 },
      { level: 3 },
      { level: 4 },
      { level: 3 },
      { level: 2 },
      { level: 1 },
    ],
  },
  {
    days: [
      { level: 2 },
      { level: 3 },
      { level: 2 },
      { level: 1 },
      { level: 3 },
      { level: 4 },
      { level: 2 },
    ],
  },
  {
    days: [
      { level: 3 },
      { level: 4 },
      { level: 3 },
      { level: 2 },
      { level: 4 },
      { level: 3 },
      { level: 4, isToday: true },
    ],
  },
];

/**
 * Skills pour l'embed par défaut
 */
const defaultEmbedSkills: EmbedSkillData[] = [
  { icon: '🐍', name: 'Python', level: 'Intermédiaire' },
  { icon: '⚡', name: 'FastAPI', level: 'Débutant' },
];

/**
 * Contenu de la page Profil Public (sans sidebar car c'est une page publique)
 */
const PublicProfileContent: React.FC = () => {
  const navigate = useNavigate();
  
  // Essayer de récupérer le contexte (si disponible)
  let user = {
    initials: 'JT' as string | undefined,
    name: 'Jordan T.',
    tagline: 'Full Stack Developer en formation',
    username: 'jordan-t',
  };

  try {
    const context = useAppContext();
    user = {
      initials: context.user.initials,
      name: context.user.name,
      tagline: 'Full Stack Developer en formation',
      username: context.user.name.toLowerCase().replace(' ', '-'),
    };
  } catch {
    // Contexte non disponible (page publique), utiliser les valeurs par défaut
  }

  /**
   * Copier le lien du profil
   */
  const handleCopyLink = async () => {
    const link = `https://aicodementor.io/p/${user.username}`;
    try {
      await navigator.clipboard.writeText(link);
      // TODO: Afficher un toast de confirmation
      console.log('Link copied:', link);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  /**
   * Partager sur LinkedIn
   */
  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(`https://aicodementor.io/p/${user.username}`);
    const text = encodeURIComponent(
      `Découvrez mon profil développeur sur AI Code Mentor! 🎓 #coding #developer #learning`
    );
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`,
      '_blank',
      'width=600,height=400'
    );
  };

  /**
   * Clic sur un badge
   */
  const handleBadgeClick = (badgeId: string) => {
    console.log('Badge clicked:', badgeId);
  };

  /**
   * Retour aux badges
   */
  const handleBackToDashboard = () => {
    navigate('/app/badges');
  };

  return (
    <PublicProfileMain
      user={user}
      bannerStats={defaultBannerStats}
      skills={defaultSkills}
      featuredBadges={defaultFeaturedBadges}
      activityWeeks={defaultActivityWeeks}
      embedSkills={defaultEmbedSkills}
      streakDays={7}
      totalXp="2,450"
      showBackButton={true}
      onCopyLink={handleCopyLink}
      onShareLinkedIn={handleShareLinkedIn}
      onBadgeClick={handleBadgeClick}
      onBackToDashboard={handleBackToDashboard}
    />
  );
};

export default PublicProfileContent;