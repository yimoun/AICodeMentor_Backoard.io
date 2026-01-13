import React from 'react';
import { Link } from '@mui/material';
import ProfileBannerSection, { type ProfileStatData } from './ProfileBannerSection';
import SkillShowcaseCard, { type SkillShowcaseData } from './SkillShowcaseCard';
import FeaturedBadges, { type FeaturedBadgeData } from './FeaturedBadges';
import ActivityHeatmap, { type HeatmapWeekData } from './ActivityHeatmap';
import EmbedSection, { type EmbedSkillData } from './EmbedSection';
import {
  PublicProfileContainer,
  ProfileContent,
  ProfileSection,
  SectionTitle,
  SkillsShowcaseGrid,
  ProfileFooter,
  FooterContent,
  FooterBrand,
  FooterLink,
  BackToDashboard,
} from '../../../styles/profile/PublicProfileStyles';

interface PublicProfileMainProps {
  /** Données de l'utilisateur */
  user: {
    initials: string | undefined;
    name: string;
    tagline: string;
    username: string;
  };
  /** Stats du banner */
  bannerStats: ProfileStatData[];
  /** Skills à afficher */
  skills: SkillShowcaseData[];
  /** Badges en vedette */
  featuredBadges: FeaturedBadgeData[];
  /** Données du heatmap */
  activityWeeks: HeatmapWeekData[];
  /** Skills pour l'embed */
  embedSkills: EmbedSkillData[];
  /** Streak actuel */
  streakDays: number;
  /** XP total */
  totalXp: string;
  /** Afficher le bouton retour (pour le propriétaire du profil) */
  showBackButton?: boolean;
  /** Callbacks */
  onCopyLink?: () => void;
  onShareLinkedIn?: () => void;
  onBadgeClick?: (badgeId: string) => void;
  onBackToDashboard?: () => void;
}

/**
 * Composant principal du profil public
 */
const PublicProfileMain: React.FC<PublicProfileMainProps> = ({
  user,
  bannerStats,
  skills,
  featuredBadges,
  activityWeeks,
  embedSkills,
  streakDays,
  totalXp,
  showBackButton = true,
  onCopyLink,
  onShareLinkedIn,
  onBadgeClick,
  onBackToDashboard,
}) => {
  // Skill principal pour le badge compact
  const mainSkill = skills[0];
  const mainSkillLevel = mainSkill
    ? `${mainSkill.name} ${mainSkill.levelLabel}`
    : 'Développeur';

  return (
    <PublicProfileContainer>
      {/* Banner */}
      <ProfileBannerSection
        initials={user.initials || ''}
        name={user.name}
        tagline={user.tagline}
        stats={bannerStats}
        onCopyLink={onCopyLink}
        onShareLinkedIn={onShareLinkedIn}
      />

      {/* Contenu */}
      <ProfileContent>
        {/* Section Skills */}
        <ProfileSection>
          <SectionTitle>🎯 Compétences Vérifiées</SectionTitle>
          <SkillsShowcaseGrid>
            {skills.map((skill) => (
              <SkillShowcaseCard key={skill.id} skill={skill} />
            ))}
          </SkillsShowcaseGrid>
        </ProfileSection>

        {/* Section Badges en vedette */}
        <ProfileSection>
          <SectionTitle>🏅 Badges en vedette</SectionTitle>
          <FeaturedBadges badges={featuredBadges} onBadgeClick={onBadgeClick} />
        </ProfileSection>

        {/* Section Activité récente */}
        <ProfileSection>
          <SectionTitle>📊 Activité récente</SectionTitle>
          <ActivityHeatmap weeks={activityWeeks} />
        </ProfileSection>

        {/* Section Embed */}
        <EmbedSection
          initials={user.initials || ''}
          name={user.name}
          mainSkillLevel={mainSkillLevel}
          skills={embedSkills}
          streakDays={streakDays}
          totalXp={totalXp}
          username={user.username}
        />
      </ProfileContent>

      {/* Footer */}
      <ProfileFooter>
        <FooterContent>
          <FooterBrand>🎓 AI Code Mentor</FooterBrand>
          <FooterLink>
            <Link href="https://aicodementor.io">
              Créez votre profil gratuitement →
            </Link>
          </FooterLink>
        </FooterContent>
      </ProfileFooter>

      {/* Bouton retour (visible seulement pour le propriétaire) */}
      {showBackButton && onBackToDashboard && (
        <BackToDashboard onClick={onBackToDashboard}>
          ← Retour à mes badges
        </BackToDashboard>
      )}
    </PublicProfileContainer>
  );
};

export default PublicProfileMain;