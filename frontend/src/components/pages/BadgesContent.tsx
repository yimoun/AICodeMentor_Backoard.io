import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUser';
import { useAppContext } from '../layouts/AppLayout';
import BadgesMain from '../features/badges/BadgesMain';
import { type BadgeStatData } from '../features/badges/BadgesStats';
import { type CertificationData } from '../features/badges/CertificationCard';
import { type BadgeCategoryData } from '../features/badges/BadgeCategory';

/**
 * Certifications par défaut
 */
const defaultCertifications: CertificationData[] = [
  {
    id: 'python',
    skillIcon: '🐍',
    skillName: 'Python',
    level: 'gold',
    levelLabel: 'INTERMÉDIAIRE',
    title: 'Python Developer',
    description: 'Maîtrise des concepts intermédiaires : POO, décorateurs, générateurs, gestion d\'erreurs',
    status: 'earned',
    date: 'Obtenu le 15 déc. 2025',
    score: 78,
    topics: [
      { name: 'POO', status: 'success' },
      { name: 'Fonctions', status: 'success' },
      { name: 'Exceptions', status: 'success' },
      { name: 'Async', status: 'partial' },
    ],
  },
  {
    id: 'fastapi',
    skillIcon: '⚡',
    skillName: 'FastAPI',
    level: 'bronze',
    levelLabel: 'DÉBUTANT',
    title: 'FastAPI Developer',
    description: 'Fondamentaux de FastAPI : routes, validation Pydantic, dépendances',
    status: 'earned',
    date: 'Obtenu le 3 jan. 2026',
    score: 65,
    topics: [
      { name: 'Routes', status: 'success' },
      { name: 'Pydantic', status: 'success' },
      { name: 'Auth', status: 'partial' },
    ],
  },
  {
    id: 'postgresql',
    skillIcon: '🐘',
    skillName: 'PostgreSQL',
    level: 'silver',
    levelLabel: 'INTERMÉDIAIRE',
    title: 'PostgreSQL Developer',
    description: 'Requêtes avancées, jointures, indexation, optimisation',
    status: 'earned',
    date: 'Obtenu le 20 déc. 2025',
    score: 72,
    topics: [
      { name: 'Joins', status: 'success' },
      { name: 'Index', status: 'success' },
      { name: 'Subqueries', status: 'success' },
    ],
  },
  {
    id: 'react',
    skillIcon: '⚛️',
    skillName: 'React',
    level: 'empty',
    levelLabel: 'EN COURS',
    title: 'React Developer',
    description: 'Prérequis: JavaScript Intermédiaire ✓',
    status: 'in-progress',
    progress: 35,
    topics: [
      { name: 'Components', status: 'success' },
      { name: 'JSX', status: 'success' },
      { name: 'Hooks', status: 'locked' },
      { name: 'State', status: 'locked' },
    ],
  },
];

/**
 * Catégories de badges par défaut
 */
const defaultBadgeCategories: BadgeCategoryData[] = [
  {
    id: 'regularity',
    icon: '🔥',
    title: 'Régularité',
    badges: [
      { id: 'streak-7', icon: '🔥', name: 'Flamme de 7 jours', status: 'earned', count: 7, tooltip: '7 jours consécutifs' },
      { id: 'first-week', icon: '📅', name: 'Première semaine', status: 'earned', tooltip: 'Première semaine complétée' },
      { id: 'perfect-month', icon: '🌟', name: 'Mois parfait', status: 'in-progress', progress: '7/30', tooltip: '30 jours consécutifs' },
      { id: 'centurion', icon: '💎', name: 'Centurion', status: 'locked', tooltip: '100 jours consécutifs' },
    ],
  },
  {
    id: 'learning',
    icon: '💬',
    title: 'Apprentissage',
    badges: [
      { id: 'first-question', icon: '❓', name: 'Première question', status: 'earned' },
      { id: 'curious-50', icon: '💡', name: 'Curieux (50 questions)', status: 'earned', count: 50 },
      { id: 'expert-100', icon: '🧠', name: 'Expert (100 questions)', status: 'in-progress', progress: '87/100' },
      { id: 'no-hint', icon: '🎯', name: 'Sans indice (10 de suite)', status: 'earned' },
    ],
  },
  {
    id: 'skills',
    icon: '🎓',
    title: 'Compétences',
    badges: [
      { id: 'python-explorer', icon: '🐍', name: 'Python Explorer', status: 'earned' },
      { id: 'fastapi-starter', icon: '⚡', name: 'FastAPI Starter', status: 'earned' },
      { id: 'sql-apprentice', icon: '🐘', name: 'SQL Apprentice', status: 'earned' },
      { id: 'polyglot', icon: '🌳', name: 'Polyglotte (5 langages)', status: 'in-progress', progress: '3/5' },
    ],
  },
  {
    id: 'special',
    icon: '✨',
    title: 'Spéciaux',
    badges: [
      { id: 'early-adopter', icon: '🚀', name: 'Early Adopter', status: 'earned', isRare: true },
      { id: 'night-owl', icon: '🌙', name: 'Noctambule', status: 'earned' },
      { id: 'top-1', icon: '👑', name: 'Top 1%', status: 'locked' },
      { id: 'hackathon', icon: '🏆', name: 'Hackathon Winner', status: 'locked' },
    ],
  },
];

/**
 * Contenu de la page Badges avec contextes
 */
const BadgesContent: React.FC = () => {
  const navigate = useNavigate();
  
  // Contextes
  // const { credits, streakDays } = useAppContext();

  /**
   * Stats calculées depuis les contextes
   */
  const stats = useMemo<BadgeStatData[]>(() => {
    // Compter les badges obtenus
    const earnedBadges = defaultBadgeCategories.reduce((acc, cat) => {
      return acc + cat.badges.filter((b) => b.status === 'earned').length;
    }, 0);

    // Compter les certifications
    const earnedCerts = defaultCertifications.filter((c) => c.status === 'earned').length;

    return [
      { id: 'badges', icon: '🏅', value: earnedBadges, label: 'Badges obtenus' },
      { id: 'certifications', icon: '📜', value: earnedCerts, label: 'Certifications' },
      { id: 'xp', icon: '⭐', value: '2,450', label: 'XP Total' }, // TODO: Calculer depuis l'API
      { id: 'ranking', icon: '📈', value: 'Top 15%', label: 'Classement global' },
    ];
  }, []);

  /**
   * Voir le profil public
   */
  const handleViewPublicProfile = () => {
    navigate('/app/profile');
  };

  /**
   * Ouvrir le modal de partage
   */
  const handleShare = () => {
    setShareModalOpen(true);
    console.log('Open share modal');
  };

  /**
   * Partager sur LinkedIn
   */
  const handleLinkedInShare = (certId: string) => {
    const cert = defaultCertifications.find((c) => c.id === certId);
    if (cert) {
      const text = encodeURIComponent(`Je viens d'obtenir la certification ${cert.title} sur AI Code Mentor! 🎉`);
      const url = encodeURIComponent(`https://aicodementor.io/cert/${certId}`);
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`,
        '_blank'
      );
    }
  };

  /**
   * Télécharger le PDF
   */
  const handleDownloadPdf = (certId: string) => {
    console.log('Download PDF for:', certId);
  };

  /**
   * Copier le lien
   */
  const handleCopyLink = async (certId: string) => {
    const link = `https://aicodementor.io/cert/${certId}`;
    try {
      await navigator.clipboard.writeText(link);
      console.log('Link copied:', link);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  /**
   * Continuer une certification
   */
  const handleContinueCertification = (certId: string) => {
    navigate(`/app/chat?skill=${certId}`);
  };

  /**
   * Clic sur un badge
   */
  const handleBadgeClick = (badgeId: string) => {
    console.log('Badge clicked:', badgeId);
  };

  return (
    <BadgesMain
      stats={stats}
      certifications={defaultCertifications}
      badgeCategories={defaultBadgeCategories}
      onViewPublicProfile={handleViewPublicProfile}
      onShare={handleShare}
      onLinkedInShare={handleLinkedInShare}
      onDownloadPdf={handleDownloadPdf}
      onCopyLink={handleCopyLink}
      onContinueCert={handleContinueCertification}
      onBadgeClick={handleBadgeClick}
    />
  );
};

export default BadgesContent;