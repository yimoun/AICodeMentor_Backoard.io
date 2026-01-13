import React, { useState } from 'react';
import {
  EmbedSectionContainer,
  SectionTitle,
  SectionDescription,
  EmbedOptions,
  EmbedOption,
  EmbedOptionTitle,
  EmbedPreview,
  MiniBadge,
  MiniAvatar,
  MiniInfo,
  MiniName,
  MiniLevel,
  MiniLogo,
  DetailedBadge,
  DbHeader,
  DbAvatar,
  DbInfo,
  DbName,
  DbSubtitle,
  DbSkills,
  DbSkill,
  DbSkillIcon,
  DbSkillName,
  DbLevel,
  DbFooter,
  EmbedCode,
  EmbedCodeText,
  CopyButton,
} from '../../../styles/profile/PublicProfileStyles';
import { ProfileSection } from '../../../styles/profile/PublicProfileStyles';

/**
 * Skill pour le badge détaillé
 */
export interface EmbedSkillData {
  icon: string;
  name: string;
  level: string;
}

interface EmbedSectionProps {
  /** Initiales de l'utilisateur */
  initials: string;
  /** Nom de l'utilisateur */
  name: string;
  /** Skill principal (pour le badge compact) */
  mainSkillLevel: string;
  /** Skills pour le badge détaillé */
  skills: EmbedSkillData[];
  /** Streak actuel */
  streakDays: number;
  /** XP total */
  totalXp: string;
  /** Username pour les URLs */
  username: string;
}

/**
 * Section des codes d'intégration
 */
const EmbedSection: React.FC<EmbedSectionProps> = ({
  initials,
  name,
  mainSkillLevel,
  skills,
  streakDays,
  totalXp,
  username,
}) => {
  const [copiedCompact, setCopiedCompact] = useState(false);
  const [copiedDetailed, setCopiedDetailed] = useState(false);

  const baseUrl = 'https://aicodementor.io';
  const compactCode = `<a href="${baseUrl}/p/${username}"><img src="${baseUrl}/badge/${username}/compact.svg" alt="AI Code Mentor Badge"></a>`;
  const detailedCode = `<a href="${baseUrl}/p/${username}"><img src="${baseUrl}/badge/${username}/detailed.svg"></a>`;

  const handleCopyCompact = async () => {
    try {
      await navigator.clipboard.writeText(compactCode);
      setCopiedCompact(true);
      setTimeout(() => setCopiedCompact(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleCopyDetailed = async () => {
    try {
      await navigator.clipboard.writeText(detailedCode);
      setCopiedDetailed(true);
      setTimeout(() => setCopiedDetailed(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <ProfileSection>
      <EmbedSectionContainer>
        <SectionTitle>🔧 Intégrer sur votre site</SectionTitle>
        <SectionDescription>
          Ajoutez vos badges sur votre portfolio ou CV en ligne
        </SectionDescription>

        <EmbedOptions>
          {/* Badge compact */}
          <EmbedOption>
            <EmbedOptionTitle>Badge compact</EmbedOptionTitle>
            <EmbedPreview>
              <MiniBadge>
                <MiniAvatar>{initials}</MiniAvatar>
                <MiniInfo>
                  <MiniName>{name}</MiniName>
                  <MiniLevel>{mainSkillLevel}</MiniLevel>
                </MiniInfo>
                <MiniLogo>🎓</MiniLogo>
              </MiniBadge>
            </EmbedPreview>
            <EmbedCode>
              <EmbedCodeText>{compactCode}</EmbedCodeText>
              <CopyButton onClick={handleCopyCompact}>
                {copiedCompact ? '✅' : '📋'}
              </CopyButton>
            </EmbedCode>
          </EmbedOption>

          {/* Badge détaillé */}
          <EmbedOption>
            <EmbedOptionTitle>Badge détaillé</EmbedOptionTitle>
            <EmbedPreview>
              <DetailedBadge>
                <DbHeader>
                  <DbAvatar>{initials}</DbAvatar>
                  <DbInfo>
                    <DbName>{name}</DbName>
                    <DbSubtitle>AI Code Mentor</DbSubtitle>
                  </DbInfo>
                </DbHeader>
                <DbSkills>
                  {skills.slice(0, 2).map((skill, index) => (
                    <DbSkill key={index}>
                      <DbSkillIcon>{skill.icon}</DbSkillIcon>
                      <DbSkillName>{skill.name}</DbSkillName>
                      <DbLevel>{skill.level}</DbLevel>
                    </DbSkill>
                  ))}
                </DbSkills>
                <DbFooter>
                  <span>🔥 {streakDays} jours</span>
                  <span>⭐ {totalXp} XP</span>
                </DbFooter>
              </DetailedBadge>
            </EmbedPreview>
            <EmbedCode>
              <EmbedCodeText>{detailedCode}</EmbedCodeText>
              <CopyButton onClick={handleCopyDetailed}>
                {copiedDetailed ? '✅' : '📋'}
              </CopyButton>
            </EmbedCode>
          </EmbedOption>
        </EmbedOptions>
      </EmbedSectionContainer>
    </ProfileSection>
  );
};

export default EmbedSection;