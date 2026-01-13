import React from 'react';
import {
  SkillShowcaseCardContainer,
  ShowcaseHeader,
  ShowcaseIcon,
  ShowcaseInfo,
  ShowcaseSkillName,
  ShowcaseLevel,
  ShowcaseScore,
  ScoreRing,
  ScoreRingSvg,
  ScoreRingBg,
  ScoreRingFill,
  ScoreText,
  ShowcaseTopics,
  TopicPill,
  ShowcaseFooter,
  VerifiedBadge,
  CertDate,
} from '../../../styles/profile/PublicProfileStyles';

export type SkillLevelType = 'gold' | 'silver' | 'bronze';

/**
 * Topic d'un skill
 */
export interface SkillTopicData {
  name: string;
  status: 'success' | 'warning' | 'default';
}

/**
 * Données d'un skill showcase
 */
export interface SkillShowcaseData {
  id: string;
  icon: string;
  name: string;
  level: SkillLevelType;
  levelLabel: string;
  score: number;
  topics: SkillTopicData[];
  certDate: string;
}

interface SkillShowcaseCardProps {
  skill: SkillShowcaseData;
}

/**
 * Chemin SVG pour le cercle
 */
const circlePath = 'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831';

/**
 * Carte de skill pour le profil public
 */
const SkillShowcaseCard: React.FC<SkillShowcaseCardProps> = ({ skill }) => {
  const { icon, name, level, levelLabel, score, topics, certDate } = skill;

  return (
    <SkillShowcaseCardContainer>
      {/* Header */}
      <ShowcaseHeader>
        <ShowcaseIcon>{icon}</ShowcaseIcon>
        <ShowcaseInfo>
          <ShowcaseSkillName>{name}</ShowcaseSkillName>
          <ShowcaseLevel level={level}>{levelLabel}</ShowcaseLevel>
        </ShowcaseInfo>
        <ShowcaseScore>
          <ScoreRing>
            <ScoreRingSvg viewBox="0 0 36 36">
              <ScoreRingBg d={circlePath} />
              <ScoreRingFill
                d={circlePath}
                color={level}
                strokeDasharray={`${score}, 100`}
              />
            </ScoreRingSvg>
            <ScoreText>{score}%</ScoreText>
          </ScoreRing>
        </ShowcaseScore>
      </ShowcaseHeader>

      {/* Topics */}
      <ShowcaseTopics>
        {topics.map((topic, index) => (
          <TopicPill key={index} variant={topic.status}>
            {topic.name}
          </TopicPill>
        ))}
      </ShowcaseTopics>

      {/* Footer */}
      <ShowcaseFooter>
        <VerifiedBadge>✓ Vérifié par AI Code Mentor</VerifiedBadge>
        <CertDate>{certDate}</CertDate>
      </ShowcaseFooter>
    </SkillShowcaseCardContainer>
  );
};

export default SkillShowcaseCard;