// Progression des skills

import React from 'react';
import {
  SkillsProgressContainer,
  SkillsProgressTitle,
  SkillProgressItem,
  SkillInfo,
  SkillName,
  SkillLevel,
  SkillProgressBar,
} from '../../../styles/chat/SkillsProgressStyles';

/**
 * Type pour un skill avec sa progression
 */
export interface SkillProgressData {
  /** Identifiant unique */
  id: string;
  /** Nom du skill */
  name: string;
  /** Icône (emoji) */
  icon: string;
  /** Niveau actuel */
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  /** Pourcentage de progression (0-100) */
  progress: number;
}

interface SkillsProgressProps {
  /** Titre de la section */
  title?: string;
  /** Liste des skills */
  skills: SkillProgressData[];
  /** Callback au clic sur un skill */
  onSkillClick?: (skillId: string) => void;
}

/**
 * Composant affichant la progression des skills dans la sidebar
 */
const SkillsProgress: React.FC<SkillsProgressProps> = ({
  title = 'Progression',
  skills,
  onSkillClick,
}) => {
  if (skills.length === 0) {
    return null;
  }

  return (
    <SkillsProgressContainer>
      <SkillsProgressTitle>{title}</SkillsProgressTitle>

      {skills.map((skill) => (
        <SkillProgressItem
          key={skill.id}
          onClick={() => onSkillClick?.(skill.id)}
          sx={{ cursor: onSkillClick ? 'pointer' : 'default' }}
        >
          <SkillInfo>
            <SkillName>
              {skill.icon} {skill.name}
            </SkillName>
            <SkillLevel>{skill.level}</SkillLevel>
          </SkillInfo>
          
          <SkillProgressBar
            variant="determinate"
            value={skill.progress}
          />
        </SkillProgressItem>
      ))}
    </SkillsProgressContainer>
  );
};

export default SkillsProgress;