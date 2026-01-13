import React from 'react';
import { Box } from '@mui/material';
import { Button } from '../../ui/Button';
import BadgesStats, { type BadgeStatData } from './BadgesStats';
import CertificationCard, { type CertificationData } from './CertificationCard';
import BadgeCategory, { type BadgeCategoryData } from './BadgeCategory';
import {
  BadgesMainContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  HeaderActions,
  Section,
  SectionHeader,
  SectionTitle,
  SectionBadge,
  CertificationsGrid,
  BadgesCategoriesContainer,
} from '../../../styles/badges/BadgesStyles';

interface BadgesMainProps {
  /** Titre de la page */
  title?: string;
  /** Sous-titre de la page */
  subtitle?: string;
  
  /** Statistiques */
  stats: BadgeStatData[];
  
  /** Certifications */
  certifications: CertificationData[];
  
  /** Catégories de badges */
  badgeCategories: BadgeCategoryData[];
  
  /** Callbacks pour les certifications */
  onLinkedInShare?: (certId: string) => void;
  onDownloadPdf?: (certId: string) => void;
  onCopyLink?: (certId: string) => void;
  onContinueCert?: (certId: string) => void;
  
  /** Callback pour les badges */
  onBadgeClick?: (badgeId: string) => void;
  
  /** Callbacks header */
  onViewPublicProfile?: () => void;
  onShare?: () => void;
}

/**
 * Zone principale de la page Badges
 */
const BadgesMain: React.FC<BadgesMainProps> = ({
  title = '🏆 Mes Badges & Certifications',
  subtitle = 'Montrez vos compétences au monde',
  stats,
  certifications,
  badgeCategories,
  onLinkedInShare,
  onDownloadPdf,
  onCopyLink,
  onContinueCert,
  onBadgeClick,
  onViewPublicProfile,
  onShare,
}) => {
  return (
    <BadgesMainContainer>
      {/* Header */}
      <PageHeader>
        <Box>
          <PageTitle>{title}</PageTitle>
          <PageSubtitle>{subtitle}</PageSubtitle>
        </Box>
        <HeaderActions>
          {onViewPublicProfile && (
            <Button variant="outline" onClick={onViewPublicProfile}>
              <span>🌐</span> Voir mon profil public
            </Button>
          )}
          {onShare && (
            <Button variant="primary" onClick={onShare}>
              <span>📤</span> Partager
            </Button>
          )}
        </HeaderActions>
      </PageHeader>

      {/* Stats */}
      <BadgesStats stats={stats} />

      {/* Section Certifications */}
      <Section>
        <SectionHeader>
          <SectionTitle>📜 Certifications de Compétence</SectionTitle>
          <SectionBadge label="Partageables sur LinkedIn" size="small" />
        </SectionHeader>

        <CertificationsGrid>
          {certifications.map((cert) => (
            <CertificationCard
              key={cert.id}
              certification={cert}
              onLinkedInShare={onLinkedInShare}
              onDownloadPdf={onDownloadPdf}
              onCopyLink={onCopyLink}
              onContinue={onContinueCert}
            />
          ))}
        </CertificationsGrid>
      </Section>

      {/* Section Badges d'accomplissement */}
      <Section>
        <SectionHeader>
          <SectionTitle>🏅 Badges d'Accomplissement</SectionTitle>
        </SectionHeader>

        <BadgesCategoriesContainer>
          {badgeCategories.map((category) => (
            <BadgeCategory
              key={category.id}
              category={category}
              onBadgeClick={onBadgeClick}
            />
          ))}
        </BadgesCategoriesContainer>
      </Section>
    </BadgesMainContainer>
  );
};

export default BadgesMain;