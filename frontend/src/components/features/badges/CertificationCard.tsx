import React from 'react';
import { Button } from '../../../components/ui/Button';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import {
  CertificationCardContainer,
  CertBadge,
  CertIcon,
  SkillEmoji,
  CertLevel,
  CertInfo,
  CertTitle,
  CertDescription,
  CertMeta,
  CertTopics,
  TopicTag,
  CertProgress,
  ProgressBar,
  ProgressText,
  CertActions,
} from '../../../styles/badges/BadgesStyles';

/**
 * Type pour un topic
 */
export interface CertTopicData {
  name: string;
  status: 'success' | 'partial' | 'locked';
}

/**
 * Type pour une certification
 */
export interface CertificationData {
  id: string;
  skillIcon: string;
  skillName: string;
  level: 'gold' | 'silver' | 'bronze' | 'empty';
  levelLabel: string;
  title: string;
  description: string;
  status: 'earned' | 'in-progress';
  date?: string;
  score?: number;
  progress?: number;
  topics: CertTopicData[];
}

interface CertificationCardProps {
  /** Données de la certification */
  certification: CertificationData;
  /** Callback partage LinkedIn */
  onLinkedInShare?: (certId: string) => void;
  /** Callback téléchargement PDF */
  onDownloadPdf?: (certId: string) => void;
  /** Callback copie du lien */
  onCopyLink?: (certId: string) => void;
  /** Callback continuer (pour in-progress) */
  onContinue?: (certId: string) => void;
}

/**
 * Card de certification
 */
const CertificationCard: React.FC<CertificationCardProps> = ({
  certification,
  onLinkedInShare,
  onDownloadPdf,
  onCopyLink,
  onContinue,
}) => {
  const {
    id,
    skillIcon,
    level,
    levelLabel,
    title,
    description,
    status,
    date,
    score,
    progress,
    topics,
  } = certification;

  return (
    <CertificationCardContainer status={status}>
      {/* Badge avec icône et niveau */}
      <CertBadge>
        <CertIcon level={level}>
          <SkillEmoji>{skillIcon}</SkillEmoji>
        </CertIcon>
        <CertLevel>{levelLabel}</CertLevel>
      </CertBadge>

      {/* Informations */}
      <CertInfo>
        <CertTitle>{title}</CertTitle>
        <CertDescription>{description}</CertDescription>

        {/* Meta (date + score) pour les certifications obtenues */}
        {status === 'earned' && (
          <CertMeta>
            {date && <span>📅 {date}</span>}
            {score && <span>🎯 Score: {score}%</span>}
          </CertMeta>
        )}

        {/* Barre de progression pour les certifications en cours */}
        {status === 'in-progress' && progress !== undefined && (
          <CertProgress>
            <ProgressBar variant="determinate" value={progress} />
            <ProgressText>{progress}% complété</ProgressText>
          </CertProgress>
        )}

        {/* Topics */}
        {/* <CertTopics>
          {topics.map((topic, index) => (
            <TopicTag
              key={index}
              label={`${topic.name} ${topic.status === 'success' ? '✓' : topic.status === 'partial' ? '⚠' : '🔒'}`}
              variant={topic.status}
              size="small"
            />
          ))}
        </CertTopics> */}
      </CertInfo>

      {/* Actions */}
      <CertActions>
        {status === 'earned' ? (
          <>
            {onLinkedInShare && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onLinkedInShare(id)}
                startIcon={<LinkedInIcon sx={{ fontSize: 14 }} />}
              >
                LinkedIn
              </Button>
            )}
            {onDownloadPdf && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownloadPdf(id)}
              >
                📥 PDF
              </Button>
            )}
            {onCopyLink && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopyLink(id)}
              >
                🔗
              </Button>
            )}
          </>
        ) : (
          onContinue && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onContinue(id)}
            >
              Continuer →
            </Button>
          )
        )}
      </CertActions>
    </CertificationCardContainer>
  );
};

export default CertificationCard;