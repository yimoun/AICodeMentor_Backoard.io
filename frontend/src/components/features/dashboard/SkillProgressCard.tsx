import React from 'react';
import {
  DashboardCard,
  CardTitle,
} from '../../../styles/dashboard/dashboardStyles';
import {
  SkillsList,
  SkillRow,
  SkillHeader,
  SkillIcon,
  SkillName,
  SkillLevelBadge,
  SkillProgressBar,
  SkillXp,
} from '../../../styles/dashboard/DashboardCardsStyles';

/**
 * Type pour un skill
 */
export interface SkillData {
  id: string;
  name: string;
  icon: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  levelLabel: string;
  currentXp: number;
  maxXp: number;
}

interface SkillProgressCardProps {
  /** Titre de la card */
  title?: string;
  /** Icône du titre */
  titleIcon?: string;
  /** Liste des skills */
  skills: SkillData[];
  /** Callback au clic sur un skill */
  onSkillClick?: (skillId: string) => void;
}

/**
 * Formate les XP
 */
const formatXp = (current: number, max: number): string => {
  return `${current.toLocaleString()} / ${max.toLocaleString()} XP`;
};

/**
 * Card de progression des skills
 */
const SkillProgressCard: React.FC<SkillProgressCardProps> = ({
  title = 'Progression des skills',
  titleIcon = '🎯',
  skills,
  onSkillClick,
}) => {
  return (
    <DashboardCard>
      <CardTitle>
        {titleIcon} {title}
      </CardTitle>
      
      <SkillsList>
        {skills.map((skill) => {
          const progressPercent = (skill.currentXp / skill.maxXp) * 100;
          
          return (
            <SkillRow
              key={skill.id}
              onClick={() => onSkillClick?.(skill.id)}
              sx={{ cursor: onSkillClick ? 'pointer' : 'default' }}
            >
              <SkillHeader>
                <SkillIcon>{skill.icon}</SkillIcon>
                <SkillName>{skill.name}</SkillName>
                <SkillLevelBadge
                  level={skill.level}
                  label={skill.levelLabel}
                  size="small"
                />
              </SkillHeader>
              
              <SkillProgressBar
                variant="determinate"
                value={progressPercent}
              />
              
              <SkillXp>{formatXp(skill.currentXp, skill.maxXp)}</SkillXp>
            </SkillRow>
          );
        })}
      </SkillsList>
    </DashboardCard>
  );
};

export default SkillProgressCard;